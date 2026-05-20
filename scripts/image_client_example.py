"""
Transfer-Station 图像 API 客户端示例 (httpx + stream)

为什么这样写:
- 上游 gpt-image-2 复杂 prompt 实测 P99 ~410s,/edits + ref P99 ~415s
- 同步模式下 httpx read timeout=180s 必挂(实测三连 broken pipe)
- sub2api OAuth 通道在 stream=true 时会每 10s 注入 SSE keepalive(:\n\n)
- 因此 read_timeout 只需覆盖"单 chunk 间隔",60s 给足 6x buffer
- 失败时降配重试(quality=medium / size=1024x1024)能把长尾砍掉一半
"""

from __future__ import annotations

import base64
import json
import os
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Iterator

import httpx

API_BASE = os.getenv("API_BASE", "https://api.example.com/v1")
API_KEY = os.environ["API_KEY"]

# 关键超时:
#   connect: 上游建连
#   read:    两次 chunk 之间最长间隔(sub2api keepalive=10s,留 6x)
#   write:   上传 multipart(ref 图大时给足)
#   pool:    连接池获取
TIMEOUT = httpx.Timeout(connect=10.0, read=60.0, write=120.0, pool=10.0)


@dataclass
class ImageResult:
    b64: str
    model: str
    elapsed_s: float
    partials_received: int


def _parse_sse(resp: httpx.Response) -> Iterator[dict]:
    """SSE 流解析:event/data 成对,丢弃以 ':' 开头的 keepalive 注释行"""
    event_name = ""
    data_lines: list[str] = []
    for raw in resp.iter_lines():
        if raw == "":
            if data_lines:
                payload = "\n".join(data_lines)
                if payload != "[DONE]":
                    try:
                        yield {"event": event_name, "data": json.loads(payload)}
                    except json.JSONDecodeError:
                        pass
            event_name, data_lines = "", []
            continue
        if raw.startswith(":"):
            continue  # sub2api keepalive,故意忽略
        if raw.startswith("event:"):
            event_name = raw[6:].strip()
        elif raw.startswith("data:"):
            data_lines.append(raw[5:].lstrip())


def _consume_image_stream(resp: httpx.Response) -> tuple[str, int]:
    """从 SSE 流里拿到最终 b64,顺便统计 partial 数(可用于 UI 进度)"""
    final_b64 = ""
    partials = 0
    for ev in _parse_sse(resp):
        data = ev["data"]
        et = data.get("type", "")
        if et == "image_generation.partial_image" or "partial_image_b64" in data:
            partials += 1
            # 想展示进度图就用 data["partial_image_b64"]
        elif et in ("image_generation.completed", "image.generation.completed"):
            final_b64 = data.get("b64_json") or data.get("image", {}).get("b64_json", "")
        elif "data" in data and isinstance(data["data"], list) and data["data"]:
            final_b64 = data["data"][0].get("b64_json", "")
    if not final_b64:
        raise RuntimeError("stream ended without final image")
    return final_b64, partials


def generate(
    prompt: str,
    *,
    size: str = "1536x1024",
    quality: str = "high",
    model: str = "gpt-image-2",
    client: httpx.Client | None = None,
) -> ImageResult:
    started = time.monotonic()
    body = {
        "model": model,
        "prompt": prompt,
        "size": size,
        "quality": quality,
        "n": 1,
        "stream": True,  # 这一行就是核心修复
    }
    owns = client is None
    client = client or httpx.Client(timeout=TIMEOUT, base_url=API_BASE,
                                    headers={"Authorization": f"Bearer {API_KEY}"})
    try:
        with client.stream("POST", "/images/generations", json=body,
                           headers={"Accept": "text/event-stream"}) as r:
            r.raise_for_status()
            b64, partials = _consume_image_stream(r)
            return ImageResult(b64, model, time.monotonic() - started, partials)
    finally:
        if owns:
            client.close()


def edit(
    prompt: str,
    image_path: str | Path,
    *,
    size: str = "1536x1024",
    quality: str = "high",
    model: str = "gpt-image-2",
    client: httpx.Client | None = None,
) -> ImageResult:
    started = time.monotonic()
    image_path = Path(image_path)
    files = {"image": (image_path.name, image_path.read_bytes(),
                       "image/png" if image_path.suffix == ".png" else "image/jpeg")}
    data = {
        "model": model,
        "prompt": prompt,
        "size": size,
        "quality": quality,
        "n": "1",
        "stream": "true",  # multipart 走字符串
    }
    owns = client is None
    client = client or httpx.Client(timeout=TIMEOUT, base_url=API_BASE,
                                    headers={"Authorization": f"Bearer {API_KEY}"})
    try:
        with client.stream("POST", "/images/edits", data=data, files=files,
                           headers={"Accept": "text/event-stream"}) as r:
            r.raise_for_status()
            b64, partials = _consume_image_stream(r)
            return ImageResult(b64, model, time.monotonic() - started, partials)
    finally:
        if owns:
            client.close()


# 降配重试链:复杂多角色失败 → 中等质量重试 → 1:1 重试 → 放弃
# 不跨模型 fallback 是因为号池当前只有 ChatGPT OAuth 一条,无第三方 image channel
RETRY_LADDER = [
    {},                                       # 原始参数
    {"quality": "medium"},                    # 砍质量,出图时间 ~减半
    {"quality": "medium", "size": "1024x1024"},  # 进一步降分辨率
]


def generate_with_retry(prompt: str, **kwargs) -> ImageResult:
    last_err: Exception | None = None
    for i, override in enumerate(RETRY_LADDER):
        attempt_kwargs = {**kwargs, **override}
        try:
            return generate(prompt, **attempt_kwargs)
        except (httpx.ReadTimeout, httpx.RemoteProtocolError, httpx.HTTPStatusError) as e:
            last_err = e
            if i == len(RETRY_LADDER) - 1:
                break
            time.sleep(2 ** i)  # 指数退避
    raise RuntimeError(f"image generation failed after {len(RETRY_LADDER)} attempts: {last_err}")


if __name__ == "__main__":
    result = generate_with_retry(
        "Three realistic people in a bustling night market with neon signs reflecting on wet pavement, "
        "first person in vintage leather jacket and ripped jeans, second person in elegant red qipao with "
        "golden embroidery, third person in oversized streetwear hoodie, all looking at camera, 35mm film",
        size="1536x1024",
        quality="high",
    )
    print(f"OK in {result.elapsed_s:.1f}s, model={result.model}, partials={result.partials_received}")
    Path("out.png").write_bytes(base64.b64decode(result.b64))
