# Transfer-Station

面向个人实验环境的 AI API 网关部署整合项目。仓库使用 Docker Compose 编排 [Sub2API](https://github.com/Wei-Shaw/sub2api)、PostgreSQL、Redis、Nginx 和可选聊天界面，并提供品牌落地页。

号池调度、模型协议、计费和支付等业务能力来自上游 Sub2API，本仓库自身不实现这些功能，也不代表模型供应商或上游项目提供服务保证。

## 项目边界

| 仓库 | 职责 | 不包含 |
| --- | --- | --- |
| **Transfer-Station** | 带落地页和 Nginx 示例的实验性整合部署 | 自研网关、模型账号或合规授权 |
| [ai-gateway-kit](https://github.com/YouRen1320/ai-gateway-kit) | 安全优先、品牌中立的可复用部署底座 | 营销站和产品品牌 |
| [open-gateway-starter](https://github.com/YouRen1320/open-gateway-starter) | 明确标注演示数据的前端站点模板 | 认证、支付或代理后端 |

> [!WARNING]
> 当前 Compose 使用上游的可变 latest 镜像，Redis 密码默认留空，初始化流程还依赖从日志读取上游生成的管理员密码。它适合受控实验和二次开发，不应未经镜像固定、网络隔离、密钥加固、备份恢复及合规审查就直接作为公共生产服务。需要更严格的部署基线时，优先使用 ai-gateway-kit。

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

- 一台 VPS（建议至少 2GB 内存，推荐 Debian 12）
- 一个域名（已在 Cloudflare 或其他 DNS 托管）
- 已安装 Docker + Docker Compose V2 + nginx

### 2. 部署

```bash
git clone https://github.com/YouRen1320/Transfer-Station.git
cd Transfer-Station

# 交互式初始化：输入域名和邮箱，自动生成 .env + nginx 配置
./setup.sh

# 启动全部服务
docker compose up -d

# 查看日志（当前上游首次启动流程可能在日志中给出管理员密码）
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
npm ci
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

# 备份（包含 .env 和数据库，属于敏感文件，必须加密并限制访问）
tar czf backup-$(date +%Y%m%d).tar.gz .env data/
```

## 上游项目

- [Sub2API](https://github.com/Wei-Shaw/sub2api) — AI 网关 / 号池 / 计费 / 支付
- [Hermes Web UI](https://github.com/EKKOLearnAI/hermes-web-ui) — 聊天前端

## 许可证

本仓库原创代码采用 [MIT License](LICENSE)。Sub2API、Hermes Web UI 及其他第三方镜像和依赖保留各自的许可证、商标与使用条款。
