// Public pages: Models, Pricing, Docs, Status
const _PN = window.SITE?.name || "Transfer-Station";
const _PA = window.SITE?.apiDomain || ("api." + (window.SITE?.domain || "example.com"));

const PageHero = ({ kicker, title, sub }) => (
  <div style={{ padding: "60px 0 30px" }}>
    <div className="container">
      <div className="eyebrow">{kicker}</div>
      <h1 className="h1" style={{ marginTop: 12, fontSize: 44, maxWidth: 24 + "ch" }}>{title}</h1>
      {sub && <p className="lead" style={{ marginTop: 16 }}>{sub}</p>}
    </div>
  </div>
);

/* ============ MODELS ============ */
const ModelsPage = ({ t, lang, navigate }) => {
  const [filter, setFilter] = React.useState("all");
  const filtered = window.MOCK.MODELS.filter(m => filter === "all" || m.family === filter);
  return (
    <React.Fragment>
      <PageHero
        kicker={lang === "zh" ? "全部模型 · 实时同步官方价格" : "All models · upstream pricing"}
        title={lang === "zh" ? "用最聪明的模型，做最有趣的事。" : "The smartest minds, at your fingertips."}
        sub={lang === "zh" ? "价格按官方汇率 1:1 换算为人民币，每 1M Token 计价。可在控制台开启「Token 倍率折扣」。" : "Pricing tracks upstream 1:1 in CNY per 1M tokens. Volume discounts available in the console."}
      />
      <div className="container" style={{ paddingBottom: 80 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[
            { id: "all", label: lang === "zh" ? "全部" : "All", n: window.MOCK.MODELS.length },
            { id: "openai", label: "OpenAI", n: window.MOCK.MODELS.filter(m => m.family === "openai").length },
            { id: "anthropic", label: "Anthropic", n: window.MOCK.MODELS.filter(m => m.family === "anthropic").length },
          ].map(f => (
            <button key={f.id} className={"chip" + (filter === f.id ? " active" : "")} onClick={() => setFilter(f.id)}>
              {f.label} <span style={{ opacity: 0.6 }}>{f.n}</span>
            </button>
          ))}
        </div>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="table">
            <thead>
              <tr>
                <th>{lang === "zh" ? "模型" : "Model"}</th>
                <th>{lang === "zh" ? "供应商" : "Provider"}</th>
                <th style={{ textAlign: "right" }}>{lang === "zh" ? "上下文" : "Context"}</th>
                <th style={{ textAlign: "right" }}>{lang === "zh" ? "输入 / 1M Tokens" : "Input / 1M"}</th>
                <th style={{ textAlign: "right" }}>{lang === "zh" ? "输出 / 1M Tokens" : "Output / 1M"}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <ModelGlyph family={m.family} size={28} />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 600 }}>{m.name}</span>
                          {m.tag && <span className={"badge " + (m.family === "openai" ? "badge-gpt" : "badge-claude")} style={{ fontSize: 11 }}>{m.tag}</span>}
                        </div>
                        <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2, maxWidth: 56 + "ch" }}>{lang === "zh" ? m.desc_zh : m.desc_en}</div>
                        <div className="mono" style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 4 }}>{m.id}</div>
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontSize: 13, color: "var(--ink-3)" }}>{m.family === "openai" ? "OpenAI" : "Anthropic"}</span></td>
                  <td style={{ textAlign: "right" }}><span className="mono">{m.ctx}</span></td>
                  <td style={{ textAlign: "right" }}><span className="num" style={{ fontWeight: 500 }}>¥{m.in.toFixed(2)}</span></td>
                  <td style={{ textAlign: "right" }}><span className="num" style={{ fontWeight: 500 }}>¥{m.out.toFixed(2)}</span></td>
                  <td style={{ textAlign: "right" }}><button className="btn btn-ghost btn-sm" onClick={() => navigate("docs")}>{lang === "zh" ? "试调用" : "Try"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted" style={{ fontSize: 12.5, marginTop: 16 }}>
          {lang === "zh"
            ? "* 价格随官方调整自动同步。缓存读取按官方折扣计费，详见 Docs。"
            : "* Prices sync with upstream changes. Cached reads billed at upstream discount — see Docs."}
        </p>
      </div>
    </React.Fragment>
  );
};

/* ============ PRICING ============ */
const PricingPage = ({ t, lang, navigate }) => {
  return (
    <React.Fragment>
      <PageHero kicker={t("pricing_kicker")} title={t("pricing_title")} sub={t("pricing_sub")} />
      <div className="container" style={{ paddingBottom: 60 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {window.MOCK.PLANS.map(p => (
            <div key={p.id} className="card" style={{
              padding: 28,
              borderColor: p.featured ? "var(--ink)" : "var(--line)",
              borderWidth: p.featured ? 2 : 1,
              position: "relative"
            }}>
              {p.featured && <span className="badge badge-accent" style={{ position: "absolute", top: -10, left: 20 }}>{lang === "zh" ? "最受欢迎" : "Most popular"}</span>}
              <div className="h3" style={{ marginBottom: 6 }}>{t("plan_" + p.id)}</div>
              <p style={{ color: "var(--ink-3)", fontSize: 13.5, lineHeight: 1.55, margin: "0 0 18px", minHeight: 64 }}>{lang === "zh" ? p.desc_zh : p.desc_en}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 18 }}>
                {p.price === null ? (
                  <span className="num" style={{ fontSize: 30, fontWeight: 600 }}>{lang === "zh" ? "定制" : "Custom"}</span>
                ) : (
                  <React.Fragment>
                    <span style={{ fontSize: 18, color: "var(--ink-3)" }}>¥</span>
                    <span className="num" style={{ fontSize: 36, fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>{p.price}</span>
                    <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{lang === "zh" ? p.unit_zh : p.unit_en}</span>
                  </React.Fragment>
                )}
              </div>
              <button
                className={"btn " + (p.featured ? "btn-primary" : "btn-outline")}
                style={{ width: "100%" }}
                onClick={() => p.cta === "free" ? navigate("signup") : p.cta === "contact" ? navigate("home") : navigate("billing")}
              >
                {t("pricing_cta_" + p.cta)}
              </button>
              <ul style={{ listStyle: "none", padding: 0, margin: "22px 0 0", display: "flex", flexDirection: "column", gap: 10 }}>
                {(lang === "zh" ? p.features_zh : p.features_en).map((f, i) => (
                  <li key={i} style={{ display: "flex", gap: 8, fontSize: 13.5, color: "var(--ink-2)" }}>
                    <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }}><Icon name="check" size={15} stroke={2.4} /></span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 80 }}>
          <h2 className="h1" style={{ fontSize: 32, marginBottom: 32, textAlign: "center" }}>{lang === "zh" ? "常见问题" : "FAQ"}</h2>
          <FAQ lang={lang} />
        </div>
      </div>
    </React.Fragment>
  );
};

const FAQ = ({ lang }) => {
  const items = lang === "zh" ? [
    { q: `为什么 ${_PN} 价格比官方便宜？`, a: "我们与上游签订企业账户，按量采购获得阶梯折扣，再让利给中小开发者。同时通过缓存命中、国内边缘节点等技术降低成本。" },
    { q: "充值后多久到账？", a: "微信 / 支付宝支付秒到。对公转账一般 1 个工作日内到账，到账后自动发送邮件提醒。" },
    { q: "余额可以退款吗？", a: "未使用余额自支付日起 30 天内可全额退款（赠送额度不退）。提交工单 24 小时内处理完毕。" },
    { q: "调用记录会被记录吗？", a: "默认仅保留 30 天聚合统计（Token / 模型 / 时间），请求/响应正文不存储。可在设置中关闭，也可签 DPA 走私有化部署。" },
    { q: "支持哪些 SDK 与框架？", a: "OpenAI 官方 SDK（Python/Node/Go）、Anthropic 官方 SDK、LangChain、LlamaIndex、Vercel AI、Cursor、Cline、Continue 等。" },
    { q: "速率限制是多少？", a: "免费体验 5 RPM；开发者 60 RPM；团队 300 RPM；企业可议至 999+ RPM。如有突发需求可工单临时调整。" },
  ] : [
    { q: `Why is ${_PN} cheaper than upstream?`, a: "We negotiate enterprise contracts and pass the volume discount on. Caching and China-edge nodes further reduce our cost." },
    { q: "How fast does a top-up clear?", a: "WeChat / Alipay clear instantly. Wire transfers clear within one business day; we email you when it lands." },
    { q: "Can I get a refund?", a: "Unused balance is fully refundable within 30 days of payment (bonus credit excluded). Tickets resolved within 24 hours." },
    { q: "Are my requests logged?", a: "By default we keep 30 days of aggregate stats (tokens / model / time). Request/response bodies are not stored. Disable in Settings or sign a DPA for private deploy." },
    { q: "Which SDKs are supported?", a: "OpenAI SDK (Python/Node/Go), Anthropic SDK, LangChain, LlamaIndex, Vercel AI, Cursor, Cline, Continue, and more." },
    { q: "What are the rate limits?", a: "5 RPM on free trial; 60 RPM Developer; 300 RPM Team; up to 999+ RPM negotiable on Enterprise. File a ticket for temporary bursts." },
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((it, i) => (
        <div key={i} className="card" style={{ padding: 0, cursor: "pointer" }} onClick={() => setOpen(open === i ? -1 : i)}>
          <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <span style={{ fontWeight: 600, fontSize: 15.5 }}>{it.q}</span>
            <span style={{ color: "var(--ink-3)", transform: open === i ? "rotate(180deg)" : "none", transition: "transform .2s" }}><Icon name="chevron_down" /></span>
          </div>
          {open === i && (
            <div style={{ padding: "0 24px 22px", color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.65, borderTop: "1px solid var(--line)", paddingTop: 18 }}>{it.a}</div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ============ STATUS ============ */
// 实时探活:每 30 秒 ping 一次 api/chat 子域,把延迟+状态显示出来。
// 这是页面里唯一会动的数据,证明站点不只是静态原型。
const useLiveProbes = () => {
  const [state, setState] = React.useState({
    api: { ok: null, ms: null },
    chat: { ok: null, ms: null },
    site: { ok: true, ms: 0 },
    updatedAt: Date.now(),
  });
  React.useEffect(() => {
    let cancelled = false;
    const probe = async (url) => {
      const t0 = performance.now();
      try {
        const ctrl = new AbortController();
        const tid = setTimeout(() => ctrl.abort(), 4000);
        await fetch(url, { method: "GET", mode: "no-cors", cache: "no-store", signal: ctrl.signal });
        clearTimeout(tid);
        return { ok: true, ms: Math.round(performance.now() - t0) };
      } catch {
        return { ok: false, ms: null };
      }
    };
    const tick = async () => {
      const [api, chat] = await Promise.all([
        probe(`https://${_PA}/health`),
        probe(window.SITE?.chatDomain ? `https://${window.SITE.chatDomain}/` : `https://${_PA}/health`),
      ]);
      if (!cancelled) setState((s) => ({ ...s, api, chat, updatedAt: Date.now() }));
    };
    tick();
    const iv = setInterval(tick, 30000);
    return () => { cancelled = true; clearInterval(iv); };
  }, []);
  return state;
};

const StatusPage = ({ t, lang }) => {
  const probes = useLiveProbes();
  const allOk = probes.api.ok !== false && probes.chat.ok !== false && probes.site.ok;
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => { const i = setInterval(force, 1000); return () => clearInterval(i); }, []);
  const lastUpdSec = Math.floor((Date.now() - probes.updatedAt) / 1000);

  return (
    <React.Fragment>
      <PageHero kicker={lang === "zh" ? "系统状态 · 实时" : "System status · live"} title={t("status_title")} sub={t("status_sub")} />
      <div className="container" style={{ paddingBottom: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 24px",
          background: allOk
            ? "color-mix(in srgb, var(--ok) 12%, var(--bg-elev))"
            : "color-mix(in srgb, var(--warn) 12%, var(--bg-elev))",
          border: "1px solid " + (allOk
            ? "color-mix(in srgb, var(--ok) 25%, var(--line))"
            : "color-mix(in srgb, var(--warn) 25%, var(--line))"),
          borderRadius: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: allOk ? "var(--ok)" : "var(--warn)", display: "grid", placeItems: "center", color: "#fff" }}>
            <Icon name={allOk ? "check" : "activity"} size={20} stroke={2.4} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              {allOk ? t("status_all_ok") : (lang === "zh" ? "部分子系统异常" : "Some systems degraded")}
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-3)" }}>
              {lang === "zh" ? "每 30 秒自动刷新 · " : "Refreshes every 30s · "}
              {lang === "zh" ? `${lastUpdSec} 秒前更新` : `updated ${lastUpdSec}s ago`}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { id: "api", label: lang === "zh" ? "API 网关" : "API", st: probes.api },
              { id: "chat", label: "Chat", st: probes.chat },
              { id: "site", label: lang === "zh" ? "网站" : "Site", st: probes.site },
            ].map((p) => (
              <div key={p.id} style={{ padding: "6px 10px", background: "var(--bg-elev)", borderRadius: 8, border: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 8, minWidth: 92 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background:
                  p.st.ok === null ? "var(--ink-4)" : p.st.ok ? "var(--ok)" : "var(--warn)" }} />
                <div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", lineHeight: 1.1 }}>{p.label}</div>
                  <div className="mono" style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.2 }}>
                    {p.st.ok === null ? "…" : p.st.ok ? `${p.st.ms ?? 0}ms` : (lang === "zh" ? "异常" : "down")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {window.MOCK.SYSTEMS.map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", gap: 16, padding: "18px 24px", borderBottom: i < window.MOCK.SYSTEMS.length - 1 ? "1px solid var(--line)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="live-dot" />
                <span style={{ fontSize: 14.5, fontWeight: 500 }}>{s.name}</span>
              </div>
              {/* 90-day pixel strip */}
              <div style={{ display: "flex", gap: 2 }}>
                {Array.from({ length: 60 }).map((_, j) => {
                  const hasIssue = (i === 0 && j === 7) || (i === 4 && j === 28);
                  return <span key={j} style={{ width: 4, height: 22, borderRadius: 1.5, background: hasIssue ? "var(--warn)" : "var(--ok)", opacity: 0.85 }} />;
                })}
              </div>
              <span className="num" style={{ fontWeight: 500, fontSize: 14, minWidth: 60, textAlign: "right" }}>{s.uptime.toFixed(2)}%</span>
            </div>
          ))}
        </div>

        <h2 className="h2" style={{ marginTop: 56, marginBottom: 20, fontSize: 22 }}>{lang === "zh" ? "近期事件" : "Recent incidents"}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {window.MOCK.STATUS_HISTORY.map((h, i) => (
            <div key={i} className="card" style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
              <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)", minWidth: 100 }}>{h.date}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 500 }}>{lang === "zh" ? h.title_zh : h.title_en}</div>
              </div>
              <span className="badge">{lang === "zh" ? h.duration_zh : h.duration_en}</span>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

/* ============ DOCS ============ */
const DocsPage = ({ t, lang, navigate }) => {
  const [section, setSection] = React.useState("quickstart");
  const sections = [
    { id: "quickstart", label_zh: "快速开始", label_en: "Quickstart" },
    { id: "auth", label_zh: "身份认证", label_en: "Authentication" },
    { id: "chat", label_zh: "聊天补全", label_en: "Chat Completions" },
    { id: "messages", label_zh: "Anthropic Messages", label_en: "Anthropic Messages" },
    { id: "streaming", label_zh: "流式响应", label_en: "Streaming" },
    { id: "errors", label_zh: "错误码", label_en: "Error codes" },
    { id: "rate", label_zh: "速率限制", label_en: "Rate limits" },
    { id: "migrate", label_zh: "迁移指南", label_en: "Migration" },
  ];
  return (
    <div className="container" style={{ padding: "40px 28px 100px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 56 }}>
      <aside style={{ position: "sticky", top: 84, alignSelf: "flex-start" }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>{lang === "zh" ? "API 文档" : "API Docs"}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {sections.map(s => (
            <a key={s.id} onClick={() => setSection(s.id)} style={{ padding: "8px 12px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", color: section === s.id ? "var(--ink)" : "var(--ink-3)", background: section === s.id ? "var(--bg-soft)" : "transparent" }}>
              {lang === "zh" ? s.label_zh : s.label_en}
            </a>
          ))}
        </div>
      </aside>
      <article style={{ maxWidth: 760 }}>
        <DocsContent section={section} lang={lang} />
      </article>
    </div>
  );
};

const DocsContent = ({ section, lang }) => {
  // Simple token-based highlighter: split lines, color comments green-grey, strings green, numbers/keywords orange.
  const HL = ({ code }) => {
    const lines = code.split("\n");
    const colorize = (line) => {
      // Comments: # ... or // ...
      if (/^\s*(#|\/\/)/.test(line)) return <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>{line}</span>;
      // Tokenize: keep strings and the rest
      const parts = [];
      let rest = line;
      let key = 0;
      const re = /("(?:[^"\\]|\\.)*")/;
      while (rest.length) {
        const m = rest.match(re);
        if (!m) { parts.push(<span key={key++}>{rest}</span>); break; }
        if (m.index > 0) parts.push(<span key={key++}>{rest.slice(0, m.index)}</span>);
        parts.push(<span key={key++} style={{ color: "var(--gpt)" }}>{m[1]}</span>);
        rest = rest.slice(m.index + m[1].length);
      }
      return parts;
    };
    return (
      <pre className="code-block" style={{ marginTop: 20, marginBottom: 24, whiteSpace: "pre-wrap" }}>
        {lines.map((l, i) => <div key={i} style={{ minHeight: 18 }}>{colorize(l)}</div>)}
      </pre>
    );
  };

  if (section === "quickstart") return (
    <React.Fragment>
      <div className="eyebrow">{lang === "zh" ? "5 分钟接入" : "5-minute integration"}</div>
      <h1 className="h1" style={{ marginTop: 8, fontSize: 38 }}>{lang === "zh" ? "快速开始" : "Quickstart"}</h1>
      <p className="lead" style={{ marginTop: 14 }}>{lang === "zh" ? `你只需要把 base_url 指向 ${_PN}，其他和官方 SDK 完全一致。` : `Point base_url at ${_PN}. The rest is identical to the official SDK.`}</p>
      <h2 className="h2" style={{ marginTop: 36, marginBottom: 12 }}>{lang === "zh" ? "1. 获取 API Key" : "1. Get your API key"}</h2>
      <p style={{ color: "var(--ink-2)" }}>{lang === "zh" ? "登录控制台 → API 密钥 → 创建新密钥。密钥以 sk-demo- 开头。" : "Console → API Keys → Create. Keys start with sk-demo-."}</p>
      <h2 className="h2" style={{ marginTop: 28, marginBottom: 12 }}>{lang === "zh" ? "2. 发出第一个请求" : "2. Send your first request"}</h2>
      <HL code={`# Python — openai >= 1.0
from openai import OpenAI

client = OpenAI(
    api_key="sk-demo-...",
    base_url="https://${_PA}/v1"
)

r = client.chat.completions.create(
    model="claude-sonnet-4.5",
    messages=[{"role": "user", "content": "Hi!"}]
)
print(r.choices[0].message.content)`} />
      <h2 className="h2" style={{ marginTop: 28, marginBottom: 12 }}>{lang === "zh" ? "3. 切换模型" : "3. Swap models"}</h2>
      <p style={{ color: "var(--ink-2)" }}>{lang === "zh" ? "只需要修改 model 字段。下面是常用模型 ID：" : "Just change the model field. Common IDs:"}</p>
      <ul className="mono" style={{ fontSize: 13, color: "var(--ink-2)", paddingLeft: 18, lineHeight: 2 }}>
        <li>gpt-5 · gpt-5-mini · gpt-4o · o4-mini</li>
        <li>claude-opus-4.5 · claude-sonnet-4.5 · claude-haiku-4.5</li>
      </ul>
    </React.Fragment>
  );
  if (section === "auth") return (
    <React.Fragment>
      <h1 className="h1" style={{ fontSize: 38 }}>{lang === "zh" ? "身份认证" : "Authentication"}</h1>
      <p className="lead" style={{ marginTop: 14 }}>{lang === "zh" ? "所有请求都需要在 Header 中带上 Bearer Token。" : "All requests require a Bearer token in the Authorization header."}</p>
      <HL code={`Authorization: Bearer sk-demo-LJa7e2k8MwQpR3xC9vN5tF6dY1bH4u`} />
      <p style={{ color: "var(--ink-2)" }}>{lang === "zh" ? "密钥泄露后请立即在控制台吊销，所有使用该密钥的请求将在 30 秒内被拒绝。" : "If a key leaks, revoke it in the console — all calls using it stop within 30 seconds."}</p>
    </React.Fragment>
  );
  if (section === "chat") return (
    <React.Fragment>
      <h1 className="h1" style={{ fontSize: 38 }}>Chat Completions</h1>
      <p className="lead" style={{ marginTop: 14 }}>{lang === "zh" ? "完全兼容 OpenAI /v1/chat/completions 接口。" : "Fully compatible with OpenAI /v1/chat/completions."}</p>
      <HL code={`POST /v1/chat/completions

{
  "model": "gpt-5",
  "messages": [
    {"role": "system", "content": "You are helpful"},
    {"role": "user", "content": "Hi!"}
  ],
  "stream": false,
  "temperature": 0.7
}`} />
    </React.Fragment>
  );
  if (section === "messages") return (
    <React.Fragment>
      <h1 className="h1" style={{ fontSize: 38 }}>Anthropic Messages</h1>
      <p className="lead" style={{ marginTop: 14 }}>{lang === "zh" ? "如果你已经在用 Anthropic SDK，把 base_url 指过来就能用。" : "Already on the Anthropic SDK? Just point base_url here."}</p>
      <HL code={`POST /v1/messages

{
  "model": "claude-opus-4.5",
  "max_tokens": 1024,
  "messages": [
    {"role": "user", "content": "Hi!"}
  ]
}`} />
    </React.Fragment>
  );
  if (section === "streaming") return (
    <React.Fragment>
      <h1 className="h1" style={{ fontSize: 38 }}>{lang === "zh" ? "流式响应" : "Streaming"}</h1>
      <p className="lead" style={{ marginTop: 14 }}>{lang === "zh" ? "在请求体中加上 stream: true，响应以 SSE 形式分块返回。" : "Add stream: true. Responses arrive as SSE chunks."}</p>
      <HL code={`# Each "data:" line is one JSON chunk
data: {"choices":[{"delta":{"content":"Hi"}}]}
data: {"choices":[{"delta":{"content":" there"}}]}
data: [DONE]`} />
    </React.Fragment>
  );
  if (section === "errors") return (
    <React.Fragment>
      <h1 className="h1" style={{ fontSize: 38 }}>{lang === "zh" ? "错误码" : "Error codes"}</h1>
      <table className="table" style={{ marginTop: 24 }}>
        <thead><tr><th>Code</th><th>{lang === "zh" ? "含义" : "Meaning"}</th></tr></thead>
        <tbody>
          <tr><td className="mono">401</td><td>{lang === "zh" ? "密钥无效或已吊销" : "Invalid or revoked key"}</td></tr>
          <tr><td className="mono">402</td><td>{lang === "zh" ? "余额不足" : "Insufficient balance"}</td></tr>
          <tr><td className="mono">403</td><td>{lang === "zh" ? "无权限调用该模型" : "Model not permitted on this key"}</td></tr>
          <tr><td className="mono">429</td><td>{lang === "zh" ? "超过速率限制" : "Rate limit exceeded"}</td></tr>
          <tr><td className="mono">502</td><td>{lang === "zh" ? "上游短暂故障，建议重试" : "Upstream blip — retry"}</td></tr>
        </tbody>
      </table>
    </React.Fragment>
  );
  if (section === "rate") return (
    <React.Fragment>
      <h1 className="h1" style={{ fontSize: 38 }}>{lang === "zh" ? "速率限制" : "Rate limits"}</h1>
      <p className="lead" style={{ marginTop: 14 }}>{lang === "zh" ? "速率按账户级别分配，可在每个 Key 上单独再下限。" : "Limits apply per account; each key can further tighten its own cap."}</p>
      <ul style={{ color: "var(--ink-2)", lineHeight: 1.9 }}>
        <li>Trial: 5 RPM / 10K TPM</li>
        <li>Developer: 60 RPM / 200K TPM</li>
        <li>Team: 300 RPM / 1M TPM</li>
        <li>{lang === "zh" ? "Enterprise: 议价至 999+ RPM" : "Enterprise: negotiable up to 999+ RPM"}</li>
      </ul>
    </React.Fragment>
  );
  if (section === "migrate") return (
    <React.Fragment>
      <h1 className="h1" style={{ fontSize: 38 }}>{lang === "zh" ? "从官方迁移" : "Migrating from upstream"}</h1>
      <p className="lead" style={{ marginTop: 14 }}>{lang === "zh" ? "一行字符串。真的只有一行。" : "One string. That's it."}</p>
      <HL code={`- base_url="https://api.openai.com/v1"
+ base_url="https://${_PA}/v1"`} />
    </React.Fragment>
  );
  return null;
};

window.ModelsPage = ModelsPage;
window.PricingPage = PricingPage;
window.StatusPage = StatusPage;
window.DocsPage = DocsPage;
