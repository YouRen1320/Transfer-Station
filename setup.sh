#!/usr/bin/env bash
# =============================================================================
# Transfer-Station 一键初始化
# 功能: 生成 .env + nginx 配置
# 用法: ./setup.sh
# =============================================================================
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo -e "${CYAN}"
echo "  ╔══════════════════════════════════════╗"
echo "  ║   Transfer-Station  Setup            ║"
echo "  ║   AI API 中转站 · 一键初始化         ║"
echo "  ╚══════════════════════════════════════╝"
echo -e "${NC}"

# ─── 检查依赖 ────────────────────────────────────────────────────────────────
check_dep() {
    if ! command -v "$1" &>/dev/null; then
        echo -e "${RED}✗ 缺少依赖: $1${NC}"
        echo "  请先安装: $2"
        exit 1
    fi
}

check_dep docker "https://docs.docker.com/engine/install/"
check_dep openssl "apt install openssl / yum install openssl"

# envsubst 可选：没有则用 sed 替代
HAS_ENVSUBST=false
if command -v envsubst &>/dev/null; then
    HAS_ENVSUBST=true
fi

if ! docker compose version &>/dev/null; then
    echo -e "${RED}✗ 需要 Docker Compose V2 (docker compose)${NC}"
    echo "  安装文档: https://docs.docker.com/compose/install/"
    exit 1
fi

# ─── 工具函数 ────────────────────────────────────────────────────────────────

# 安全读取已有 .env 中的某个变量（不 source 整个文件）
read_env_var() {
    local key="$1" file="$2"
    grep -E "^${key}=" "$file" 2>/dev/null | head -1 | cut -d'=' -f2-
}

# 域名格式校验
validate_domain() {
    local d="$1"
    # 允许: 字母、数字、连字符、点；至少有一个点；不以点或连字符开头/结尾
    if [[ "$d" =~ ^[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$ ]]; then
        return 0
    fi
    return 1
}

# 模板替换（优先 envsubst，fallback 到 sed）
render_template() {
    local template="$1" output="$2"
    if [ "$HAS_ENVSUBST" = true ]; then
        envsubst '${DOMAIN} ${SUB2API_PORT}' < "$template" > "$output"
    else
        sed -e "s/\${DOMAIN}/${DOMAIN}/g" \
            -e "s/\${SUB2API_PORT}/${SUB2API_PORT}/g" \
            < "$template" > "$output"
    fi
}

# ─── 如果已有 .env，询问是否覆盖 ─────────────────────────────────────────────
SKIP_ENV=false
if [ -f "$SCRIPT_DIR/.env" ]; then
    echo -e "${YELLOW}⚠ 检测到已有 .env 文件${NC}"
    read -rp "覆盖? (y/N): " overwrite
    if [[ ! "$overwrite" =~ ^[Yy]$ ]]; then
        echo "跳过 .env 生成，只更新 nginx 配置。"
        DOMAIN="$(read_env_var DOMAIN "$SCRIPT_DIR/.env")"
        SUB2API_PORT="$(read_env_var SUB2API_PORT "$SCRIPT_DIR/.env")"
        if [ -z "$DOMAIN" ]; then
            echo -e "${RED}✗ 已有 .env 中未找到 DOMAIN，请重新运行并选择覆盖${NC}"
            exit 1
        fi
        SKIP_ENV=true
    fi
fi

# ─── 交互式输入 ──────────────────────────────────────────────────────────────
if [ "$SKIP_ENV" != "true" ]; then
    echo -e "${CYAN}── 基础配置 ──${NC}"

    while true; do
        read -rp "你的域名 (例: example.com): " DOMAIN
        if [ -z "$DOMAIN" ]; then
            echo -e "${RED}  域名不能为空${NC}"
        elif ! validate_domain "$DOMAIN"; then
            echo -e "${RED}  域名格式不对，请输入类似 example.com 的格式${NC}"
        else
            break
        fi
    done

    read -rp "管理员邮箱 [admin@${DOMAIN}]: " ADMIN_EMAIL
    ADMIN_EMAIL="${ADMIN_EMAIL:-admin@${DOMAIN}}"

    read -rp "管理员密码 (留空=自动生成，首次启动看日志): " ADMIN_PASSWORD

    read -rp "时区 [Asia/Shanghai]: " TZ_INPUT
    TZ_INPUT="${TZ_INPUT:-Asia/Shanghai}"
    # 基本校验：时区格式应为 Region/City
    if [[ ! "$TZ_INPUT" =~ ^[A-Za-z_]+/[A-Za-z_]+$ ]] && [ "$TZ_INPUT" != "UTC" ]; then
        echo -e "${YELLOW}  ⚠ 时区格式建议为 Region/City（如 Asia/Shanghai），当前值: ${TZ_INPUT}${NC}"
        read -rp "  继续使用? (Y/n): " tz_confirm
        if [[ "$tz_confirm" =~ ^[Nn]$ ]]; then
            read -rp "  重新输入时区: " TZ_INPUT
        fi
    fi

    # 自动生成密钥
    echo -e "\n${CYAN}── 自动生成密钥 ──${NC}"
    POSTGRES_PASSWORD=$(openssl rand -hex 16)
    JWT_SECRET=$(openssl rand -hex 32)
    TOTP_ENCRYPTION_KEY=$(openssl rand -hex 32)
    echo -e "  ${GREEN}✓${NC} POSTGRES_PASSWORD"
    echo -e "  ${GREEN}✓${NC} JWT_SECRET"
    echo -e "  ${GREEN}✓${NC} TOTP_ENCRYPTION_KEY"

    # 先写临时文件再原子替换，避免中途崩溃留下半成品
    ENV_TMP="$SCRIPT_DIR/.env.tmp.$$"
    cat > "$ENV_TMP" << EOF
# Transfer-Station 环境配置 — 由 setup.sh 生成于 $(date -Iseconds)
DOMAIN=${DOMAIN}
ADMIN_EMAIL=${ADMIN_EMAIL}
ADMIN_PASSWORD=${ADMIN_PASSWORD}
SUB2API_PORT=8080
HERMES_PORT=6060
POSTGRES_USER=sub2api
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=sub2api
REDIS_PASSWORD=
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRE_HOUR=24
TOTP_ENCRYPTION_KEY=${TOTP_ENCRYPTION_KEY}
TZ=${TZ_INPUT}
SERVER_MODE=release
RUN_MODE=standard
EOF
    chmod 600 "$ENV_TMP" || {
        echo -e "${RED}✗ 无法设置 .env 文件权限${NC}"
        rm -f "$ENV_TMP"
        exit 1
    }
    mv "$ENV_TMP" "$SCRIPT_DIR/.env"
    echo -e "\n${GREEN}✓ .env 已生成（权限 600）${NC}"
fi

# ─── 生成 nginx 配置 ─────────────────────────────────────────────────────────
echo -e "\n${CYAN}── 生成 nginx 配置 ──${NC}"

SUB2API_PORT="${SUB2API_PORT:-8080}"
export DOMAIN SUB2API_PORT

render_template "$SCRIPT_DIR/nginx/api.conf.template" \
    "$SCRIPT_DIR/nginx/api.${DOMAIN}.conf"
echo -e "  ${GREEN}✓${NC} nginx/api.${DOMAIN}.conf"

render_template "$SCRIPT_DIR/nginx/landing.conf.template" \
    "$SCRIPT_DIR/nginx/landing.${DOMAIN}.conf"
echo -e "  ${GREEN}✓${NC} nginx/landing.${DOMAIN}.conf"

# ─── 创建数据目录 ────────────────────────────────────────────────────────────
mkdir -p "$SCRIPT_DIR/data/sub2api" "$SCRIPT_DIR/data/postgres" "$SCRIPT_DIR/data/redis"
echo -e "  ${GREEN}✓${NC} data/ 目录已创建"

# ─── SSL 证书 ────────────────────────────────────────────────────────────────
echo -e "\n${CYAN}── SSL 证书 ──${NC}"
echo "推荐使用 acme.sh 申请通配证书。以 Cloudflare DNS 为例:"
echo ""
echo -e "  ${YELLOW}# 1. 安装 acme.sh${NC}"
echo "  curl https://get.acme.sh | sh"
echo ""
echo -e "  ${YELLOW}# 2. 申请证书${NC}"
echo "  export CF_Token=\"你的_cloudflare_api_token\""
echo "  ~/.acme.sh/acme.sh --issue --dns dns_cf -d ${DOMAIN} -d '*.${DOMAIN}' --keylength ec-256"
echo ""
echo -e "  ${YELLOW}# 3. 安装到 nginx${NC}"
echo "  sudo mkdir -p /etc/nginx/ssl"
echo "  ~/.acme.sh/acme.sh --install-cert -d ${DOMAIN} --ecc \\"
echo "    --fullchain-file /etc/nginx/ssl/${DOMAIN}.crt \\"
echo "    --key-file /etc/nginx/ssl/${DOMAIN}.key \\"
echo "    --reloadcmd 'systemctl reload nginx'"
echo ""

read -rp "证书已就绪? (y/N，选 N 稍后手动配): " cert_ready
if [[ "$cert_ready" =~ ^[Yy]$ ]]; then
    echo -e "  ${GREEN}✓${NC} 证书路径: /etc/nginx/ssl/${DOMAIN}.{crt,key}"
fi

# ─── 安装 nginx 配置 ─────────────────────────────────────────────────────────
echo -e "\n${CYAN}── 安装 nginx 配置 ──${NC}"

# 自动检测 nginx 配置目录（Debian/Ubuntu 用 sites-available, RHEL/CentOS 用 conf.d）
NGINX_CONF_DIR=""
NGINX_STYLE=""
if [ -d /etc/nginx/sites-available ]; then
    NGINX_CONF_DIR="/etc/nginx/sites-available"
    NGINX_STYLE="debian"
elif [ -d /etc/nginx/conf.d ]; then
    NGINX_CONF_DIR="/etc/nginx/conf.d"
    NGINX_STYLE="rhel"
fi

if [ -n "$NGINX_CONF_DIR" ]; then
    read -rp "自动安装 nginx 配置到 ${NGINX_CONF_DIR}? (y/N): " install_nginx
    if [[ "$install_nginx" =~ ^[Yy]$ ]]; then
        sudo cp "$SCRIPT_DIR/nginx/api.${DOMAIN}.conf" "$NGINX_CONF_DIR/"
        sudo cp "$SCRIPT_DIR/nginx/landing.${DOMAIN}.conf" "$NGINX_CONF_DIR/"

        # Debian 需要 symlink 到 sites-enabled
        if [ "$NGINX_STYLE" = "debian" ]; then
            sudo ln -sf "$NGINX_CONF_DIR/api.${DOMAIN}.conf" /etc/nginx/sites-enabled/
            sudo ln -sf "$NGINX_CONF_DIR/landing.${DOMAIN}.conf" /etc/nginx/sites-enabled/
        fi

        if sudo nginx -t; then
            sudo systemctl reload nginx
            echo -e "  ${GREEN}✓${NC} nginx 配置已安装并 reload"
        else
            echo -e "  ${RED}✗ nginx 配置检查失败，请手动排查: sudo nginx -t${NC}"
        fi
    fi
else
    echo "未检测到 nginx 配置目录，请手动复制:"
    echo "  # Debian / Ubuntu:"
    echo "  sudo cp nginx/*.${DOMAIN}.conf /etc/nginx/sites-available/"
    echo "  sudo ln -s /etc/nginx/sites-available/*.conf /etc/nginx/sites-enabled/"
    echo ""
    echo "  # RHEL / CentOS:"
    echo "  sudo cp nginx/*.${DOMAIN}.conf /etc/nginx/conf.d/"
fi

# ─── 完成 ────────────────────────────────────────────────────────────────────
echo -e "\n${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ 初始化完成！${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "下一步:"
echo ""
echo -e "  ${CYAN}1. 启动服务:${NC}"
echo "     docker compose up -d"
echo ""
echo -e "  ${CYAN}2. 查看日志（首次启动看管理员密码）:${NC}"
echo "     docker compose logs -f sub2api"
echo ""
echo -e "  ${CYAN}3. 打开管理后台:${NC}"
echo "     https://api.${DOMAIN}"
echo ""
echo -e "  ${CYAN}4.（可选）启用聊天 UI:${NC}"
echo "     docker compose --profile chat up -d"
echo ""
echo -e "  ${CYAN}5.（可选）构建落地页:${NC}"
echo "     cd landing && npm install && npm run build"
echo ""
