# Transfer-Station

一键部署的 AI API 中转站。基于 [Sub2API](https://github.com/Wei-Shaw/sub2api)，支持 ChatGPT / Claude / Gemini 全系模型，OpenAI 协议兼容，自带号池调度、计费、支付。

Fork 即用，三步上线。

## 架构

```
客户端 ──HTTPS──> nginx (443)
                   ├── api.你的域名  →  Sub2API (8080)
                   │                     ├─ PostgreSQL
                   │                     └─ Redis
                   └── 你的域名      →  落地页 (静态)
```

## 快速开始

### 1. 准备

- 一台 VPS（1GB+ 内存，推荐 Debian 12）
- 一个域名（已在 Cloudflare 或其他 DNS 托管）
- 已安装 Docker + Docker Compose V2 + nginx

### 2. 部署

```bash
git clone https://github.com/你的用户名/Transfer-Station.git
cd Transfer-Station

# 交互式初始化：输入域名和邮箱，自动生成 .env + nginx 配置
./setup.sh

# 启动全部服务
docker compose up -d

# 查看日志（首次启动看管理员密码）
docker compose logs -f sub2api
```

### 3. SSL 证书

推荐 acme.sh + Cloudflare DNS 通配证书（setup.sh 会打印具体命令）：

```bash
export CF_Token="你的_cloudflare_api_token"
~/.acme.sh/acme.sh --issue --dns dns_cf -d 你的域名 -d '*.你的域名' --keylength ec-256

# 安装到 nginx
~/.acme.sh/acme.sh --install-cert -d 你的域名 --ecc \
  --fullchain-file /etc/nginx/ssl/你的域名.crt \
  --key-file /etc/nginx/ssl/你的域名.key \
  --reloadcmd 'systemctl reload nginx'
```

### 4. 打开浏览器

- 管理后台 + API：`https://api.你的域名`
- 落地页：`https://你的域名`

## 可选：聊天 UI

```bash
# 启用 Hermes Web UI（额外占用 ~200M 内存）
docker compose --profile chat up -d
```

## 可选：落地页

项目自带一个 React 落地页（`landing/`），fork 后换个品牌名就能用：

```bash
# 1. 编辑品牌配置（名称、域名、颜色）
vim landing/site.config.js

# 2. 构建
cd landing
npm install
npm run build

# 3. 部署到服务器
scp -r dist/* 你的服务器:/opt/transfer-station/landing/dist/
```

## 项目结构

```
Transfer-Station/
├── docker-compose.yml      # Sub2API + PostgreSQL + Redis + (可选) Hermes UI
├── .env.example            # 所有配置项，带注释
├── setup.sh                # 交互式初始化脚本
├── nginx/
│   ├── api.conf.template   # API 反代模板
│   └── landing.conf.template   # 落地页模板
├── landing/                # 静态落地页源码
│   ├── site.config.js      # 品牌配置（fork 后改这个）
│   ├── build.mjs           # esbuild 构建
│   ├── src/                # React 组件
│   └── styles.css
├── scripts/
│   └── image_client_example.py  # 图片生成 API 示例
└── README.md
```

## 常用运维

```bash
# 看状态
docker compose ps

# 看日志
docker compose logs -f sub2api

# 重启
docker compose restart sub2api

# 升级 Sub2API
docker compose pull sub2api
docker compose up -d sub2api

# 备份（数据库 + 配置）
tar czf backup-$(date +%Y%m%d).tar.gz .env data/
```

## 上游项目

- [Sub2API](https://github.com/Wei-Shaw/sub2api) — AI 网关 / 号池 / 计费 / 支付
- [Hermes Web UI](https://github.com/EKKOLearnAI/hermes-web-ui) — 聊天前端

## License

MIT
