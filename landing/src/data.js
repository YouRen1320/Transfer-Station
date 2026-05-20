// Mock data for landing page demo — models, plans, keys, transactions
const MODELS = [
  { id: "gpt-5", family: "openai", name: "GPT-5", desc_zh: "OpenAI 最新旗舰，强推理 + 长上下文 + 多模态。", desc_en: "OpenAI's flagship — reasoning, long-context, multimodal.", in: 7.50, out: 30.00, ctx: "400K", tag: "旗舰", use: "chat" },
  { id: "gpt-5-mini", family: "openai", name: "GPT-5 mini", desc_zh: "性价比首选，日常对话/Agent 主力。", desc_en: "Cost-effective default for chat / agents.", in: 1.50, out: 6.00, ctx: "400K", tag: "热门", use: "chat" },
  { id: "gpt-4o", family: "openai", name: "GPT-4o", desc_zh: "成熟稳定的多模态模型。", desc_en: "Stable multimodal workhorse.", in: 18.00, out: 60.00, ctx: "128K", tag: "", use: "chat" },
  { id: "o4-mini", family: "openai", name: "o4-mini", desc_zh: "强推理的小模型，写代码/数学题专精。", desc_en: "Compact reasoning model — strong at code & math.", in: 8.00, out: 32.00, ctx: "200K", tag: "推理", use: "chat" },
  { id: "codex", family: "openai", name: "Codex", desc_zh: "OpenAI 编程专精模型，IDE 与 CLI 原生体验。", desc_en: "OpenAI's coding-tuned model — native CLI & IDE.", in: 8.00, out: 24.00, ctx: "256K", tag: "编程", use: "code" },
  { id: "claude-opus-4.5", family: "anthropic", name: "Claude Opus 4.5", desc_zh: "Anthropic 最强模型，写作/Agent 表现拔尖。", desc_en: "Anthropic's top-tier — best for writing & agents.", in: 110.00, out: 550.00, ctx: "200K", tag: "旗舰", use: "chat" },
  { id: "claude-sonnet-4.5", family: "anthropic", name: "Claude Sonnet 4.5", desc_zh: "甜点位，速度与质量的最佳平衡。", desc_en: "The sweet spot — speed × quality.", in: 22.00, out: 110.00, ctx: "1M", tag: "推荐", use: "chat" },
  { id: "claude-haiku-4.5", family: "anthropic", name: "Claude Haiku 4.5", desc_zh: "极致便宜与快速，适合高并发轻量任务。", desc_en: "Cheap & fast — for high-volume light tasks.", in: 5.50, out: 22.00, ctx: "200K", tag: "快速", use: "chat" },
  { id: "claude-code", family: "anthropic", name: "Claude Code", desc_zh: "Anthropic 命令行编程助手，200K 上下文、深度代码理解。", desc_en: "Anthropic's CLI coding agent — 200K ctx, deep code understanding.", in: 22.00, out: 110.00, ctx: "200K", tag: "编程", use: "code" },
  { id: "gemini-3-pro", family: "google", name: "Gemini 3 Pro", desc_zh: "Google 最新多模态旗舰，文档/学术长文本超长。", desc_en: "Google's multimodal flagship — best for long docs & academia.", in: 12.00, out: 48.00, ctx: "2M", tag: "新", use: "chat" },
  { id: "gemini-cli", family: "google", name: "Gemini CLI", desc_zh: "Gemini 命令行原生体验，极速响应。", desc_en: "Gemini's CLI-native build — fast inference.", in: 6.00, out: 18.00, ctx: "1M", tag: "编程", use: "code" },
];

const PLANS = [
  { id: "starter", featured: false, price: 0, unit_zh: "免费", unit_en: "Free", desc_zh: "新用户注册即得，无需任何信息。", desc_en: "Just sign up. No card required.", features_zh: ["¥5 体验额度", "全部模型可用", "5 RPM 速率", "社区支持"], features_en: ["¥5 trial credit", "All models", "5 RPM", "Community support"], cta: "free" },
  { id: "pro", featured: true, price: 100, unit_zh: "起充", unit_en: "min top-up", desc_zh: "按 Token 用量结算，赠送 10% 等比额度。", desc_en: "Pay per token. 10% bonus on every top-up.", features_zh: ["每 ¥100 赠 ¥10", "60 RPM 速率", "私人 Key + 子 Key", "邮件支持 < 24h"], features_en: ["+10% bonus on ¥100", "60 RPM", "Master + child keys", "Email support < 24h"], cta: "buy" },
  { id: "team", featured: false, price: 1000, unit_zh: "起充", unit_en: "min top-up", desc_zh: "团队共用账户、独立子 Key、消费报表。", desc_en: "Shared workspace, per-member keys, reports.", features_zh: ["每 ¥1000 赠 ¥120", "300 RPM 速率", "成员/部门额度", "专属客服群"], features_en: ["+12% bonus on ¥1000", "300 RPM", "Per-member quotas", "Dedicated Slack/IM"], cta: "buy" },
  { id: "enterprise", featured: false, price: null, unit_zh: "定制", unit_en: "Custom", desc_zh: "私有化部署、SLA 合同、安全审计、对公开票。", desc_en: "Private deploy, SLA contract, security audit, invoicing.", features_zh: ["999 RPM+ 可议", "99.9% SLA + 赔付", "DPA / 等保 / 安全审计", "7×24 专属支持"], features_en: ["999+ RPM negotiable", "99.9% SLA + credits", "DPA / ISO / audit", "24/7 dedicated"], cta: "contact" },
];

const KEYS = [
  { id: 1, name: "production-web", key: "sk-demo-LJa7e2k8MwQpR3xC9vN5tF6dY1bH4u", quota: 500, used: 187.42, status: "active", created: "2026-03-14" },
  { id: 2, name: "ios-app-beta", key: "sk-demo-Bn6Xz9yR2sT8mP4kJ7eV1cW3fL5gH8", quota: 200, used: 98.13, status: "active", created: "2026-04-02" },
  { id: 3, name: "scratch", key: "sk-demo-Qr4Tn8wE1aO9pI6yL2mU5sB7dV3xK0", quota: 50, used: 50.00, status: "disabled", created: "2026-02-20" },
  { id: 4, name: "data-pipeline-cron", key: "sk-demo-Hk2Mc7vT9fQ4nA1eS8lD6wY3jX5bP9", quota: 1000, used: 412.88, status: "active", created: "2026-01-08" },
];

const TRANSACTIONS = [
  { id: "TXN-2026-0501-1A2B", date: "2026-05-12 14:22", method: "wechat", amount: 1000, bonus: 120, status: "success" },
  { id: "TXN-2026-0428-9F3K", date: "2026-04-28 09:51", method: "alipay", amount: 500, bonus: 50, status: "success" },
  { id: "TXN-2026-0411-7Z2M", date: "2026-04-11 16:08", method: "wechat", amount: 200, bonus: 20, status: "success" },
  { id: "TXN-2026-0322-3X8P", date: "2026-03-22 11:34", method: "wire", amount: 5000, bonus: 750, status: "success" },
  { id: "TXN-2026-0301-5Y4N", date: "2026-03-01 20:15", method: "alipay", amount: 100, bonus: 10, status: "success" },
];

const RECENT_CALLS = [
  { time: "2 sec ago", model: "claude-sonnet-4.5", key: "production-web", in_tok: 1284, out_tok: 412, cost: 0.082, latency: 412 },
  { time: "8 sec ago", model: "gpt-5-mini", key: "production-web", in_tok: 642, out_tok: 188, cost: 0.0021, latency: 281 },
  { time: "14 sec ago", model: "claude-opus-4.5", key: "ios-app-beta", in_tok: 2841, out_tok: 1062, cost: 0.897, latency: 1124 },
  { time: "22 sec ago", model: "gpt-5", key: "data-pipeline-cron", in_tok: 8412, out_tok: 2014, cost: 0.124, latency: 1830 },
  { time: "31 sec ago", model: "claude-haiku-4.5", key: "production-web", in_tok: 412, out_tok: 88, cost: 0.0042, latency: 198 },
  { time: "47 sec ago", model: "gpt-5-mini", key: "production-web", in_tok: 824, out_tok: 244, cost: 0.0028, latency: 312 },
  { time: "1 min ago", model: "claude-sonnet-4.5", key: "ios-app-beta", in_tok: 1612, out_tok: 580, cost: 0.099, latency: 522 },
];

const TREND_7D = [
  { d: "5/6", calls: 8421, cost: 18.42 },
  { d: "5/7", calls: 9183, cost: 21.05 },
  { d: "5/8", calls: 7820, cost: 16.88 },
  { d: "5/9", calls: 12421, cost: 28.91 },
  { d: "5/10", calls: 14188, cost: 32.14 },
  { d: "5/11", calls: 11240, cost: 24.62 },
  { d: "5/12", calls: 15812, cost: 34.21 },
];

const MODEL_SPLIT = [
  { name: "claude-sonnet-4.5", pct: 38, color: "var(--claude)" },
  { name: "gpt-5-mini", pct: 26, color: "var(--gpt)" },
  { name: "claude-opus-4.5", pct: 18, color: "var(--accent)" },
  { name: "gpt-5", pct: 12, color: "var(--ink-2)" },
  { name: "其它 / others", pct: 6, color: "var(--ink-4)" },
];

const SYSTEMS = [
  { name: "OpenAI 中转网关 / OpenAI Gateway", status: "ok", uptime: 99.98 },
  { name: "Anthropic 中转网关 / Anthropic Gateway", status: "ok", uptime: 99.99 },
  { name: "Google Gemini 网关 / Gemini Gateway", status: "ok", uptime: 99.97 },
  { name: "AI 对话 Chat 平台 / Chat App", status: "ok", uptime: 99.97 },
  { name: "AI 编程 Code 平台 / Code App", status: "ok", uptime: 99.96 },
  { name: "充值系统 Billing", status: "ok", uptime: 100.00 },
  { name: "国内 CDN 加速节点 / China Edge", status: "ok", uptime: 99.95 },
];

const STATUS_HISTORY = [
  { date: "2026-05-05", title_zh: "已恢复：Claude Opus 上游短暂抖动", title_en: "Resolved: brief Claude Opus upstream blip", duration_zh: "影响 6 分钟", duration_en: "6 min impact" },
  { date: "2026-04-22", title_zh: "已修复：账单页面汇率显示异常", title_en: "Fixed: billing page FX display glitch", duration_zh: "无业务影响", duration_en: "No service impact" },
  { date: "2026-04-10", title_zh: "新增：Gemini 3 Pro / Claude Opus 4.5 接入", title_en: "Released: Gemini 3 Pro & Claude Opus 4.5 available", duration_zh: "新功能", duration_en: "New feature" },
];

window.MOCK = { MODELS, PLANS, KEYS, TRANSACTIONS, RECENT_CALLS, TREND_7D, MODEL_SPLIT, SYSTEMS, STATUS_HISTORY };
