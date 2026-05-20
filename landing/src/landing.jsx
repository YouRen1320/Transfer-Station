// Landing page V2 — bolder, denser, China-market tuned
// 品牌名/域名从 site.config.js 读取
const _S = window.SITE || {};
const _N = _S.name || "Transfer-Station";
const _API = _S.apiDomain || ("api." + (_S.domain || "example.com"));

const Landing = ({ t, navigate, lang }) => {
  return (
    <React.Fragment>
      <PromoBanner lang={lang} navigate={navigate} />
      <Hero lang={lang} navigate={navigate} />
      <ModelTicker lang={lang} />
      <TrustBar lang={lang} />
      <TwoPillars lang={lang} navigate={navigate} />
      <Features lang={lang} />
      <UseCases lang={lang} navigate={navigate} />
      <ModelsShowcase lang={lang} navigate={navigate} />
      <Carpool lang={lang} navigate={navigate} />
      <DevSection lang={lang} navigate={navigate} />
      <PricingTeaser lang={lang} navigate={navigate} />
      <CommunityCTA lang={lang} navigate={navigate} />
    </React.Fragment>
  );
};

/* ============ Promo banner ============ */
const PromoBanner = ({ lang, navigate }) => (
  <div style={{ background: "var(--ink)", color: "var(--bg)", padding: "10px 0", fontSize: 13 }}>
    <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
      <span className="badge" style={{ background: "var(--accent)", color: "#fff", borderColor: "transparent" }}>{lang === "zh" ? "限时" : "Limited"}</span>
      <span>{lang === "zh" ? "新用户首充 ¥100 起，最高赠 15% 等比额度 · 当月有效" : "First top-up ≥¥100 earns up to 15% bonus · this month only"}</span>
      <a onClick={() => navigate("pricing")} style={{ borderBottom: "1px solid currentColor", cursor: "pointer", paddingBottom: 1 }}>{lang === "zh" ? "看活动详情 →" : "View promo →"}</a>
    </div>
  </div>
);

/* ============ Hero ============ */
const Hero = ({ lang, navigate }) => {
  return (
    <section style={{ padding: "80px 0 64px", position: "relative", overflow: "hidden" }}>
      {/* Background glows */}
      <div style={{ position: "absolute", top: -200, left: "-10%", width: 700, height: 700, background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 25%, transparent), transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 100, right: "-20%", width: 800, height: 800, background: "radial-gradient(circle, color-mix(in srgb, var(--google) 22%, transparent), transparent 65%)", pointerEvents: "none" }} />

      <div className="container" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 56, alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 14px 6px 8px", border: "1px solid var(--line)", borderRadius: 999, background: "var(--bg-elev)", fontSize: 12.5, color: "var(--ink-2)", marginBottom: 26 }}>
            <span className="badge badge-accent" style={{ fontSize: 11, padding: "2px 8px" }}>NEW</span>
            {lang === "zh" ? `${_N} · 对话 + 编程 双产品已合并` : `${_N} · Chat + Code, unified`}
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(46px, 6.4vw, 84px)", lineHeight: 1.02, letterSpacing: "-0.03em", fontWeight: 600, margin: 0 }}>
            {lang === "zh" ? <React.Fragment>满血 <span style={{ color: "var(--accent)" }}>GPT-5</span> 与 <span style={{ color: "var(--claude)" }}>Claude</span><br />一个 Key，<br />通杀对话与编程。</React.Fragment> : <React.Fragment>Full-power <span style={{ color: "var(--accent)" }}>GPT-5</span> &amp; <span style={{ color: "var(--claude)" }}>Claude</span>.<br />One key. <br />Chat and code, sorted.</React.Fragment>}
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: "var(--ink-2)", maxWidth: 56 + "ch", marginTop: 26 }}>
            {lang === "zh" ? `${_N} 把 OpenAI、Anthropic、Google 三家顶级模型，以及 Claude Code、Codex、Gemini CLI 三大编程工具，聚合进一个国内可直连、按 Token 透明计费的中转平台。` : "We aggregate every top-tier model from OpenAI, Anthropic and Google — plus Claude Code, Codex and Gemini CLI — behind one stable, no-VPN, per-token-billed gateway."}
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate("signup")}>{lang === "zh" ? "免费开始 · 送 ¥5" : "Start free · ¥5 credit"}<Icon name="arrow_right" size={16} /></button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate("docs")}>{lang === "zh" ? "查看接入文档" : "Read the docs"}</button>
          </div>
          {/* Mini stats */}
          <div style={{ display: "flex", gap: 36, marginTop: 36, flexWrap: "wrap" }}>
            {[
              { v: "20+", l: lang === "zh" ? "顶级模型" : "Top models" },
              { v: "12,400+", l: lang === "zh" ? "活跃开发者" : "Active devs" },
              { v: "99.98%", l: lang === "zh" ? "30 天可用率" : "30-day uptime" },
              { v: "< 400ms", l: lang === "zh" ? "国内首字延迟" : "TTFB in China" },
            ].map((s, i) => (
              <div key={i}>
                <div className="num" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, letterSpacing: "-0.01em" }}>{s.v}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <HeroProductSplit lang={lang} />
      </div>
    </section>
  );
};

/* Hero visual: split into two product previews stacked */
const HeroProductSplit = ({ lang }) => {
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Chat product preview */}
      <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "var(--shadow-lg)", transform: "translateX(-12px)" }}>
        <ProductWindowChrome title={lang === "zh" ? `${_N} · 对话` : `${_N} · Chat`} subtitle="GPT-5" />
        <div style={{ padding: 20, background: "var(--bg-elev)" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
            <div style={{ maxWidth: "78%", padding: "10px 14px", background: "var(--ink)", color: "var(--bg)", borderRadius: "14px 14px 4px 14px", fontSize: 13.5, lineHeight: 1.5 }}>
              {lang === "zh" ? "用 TypeScript 写一个泛型防抖函数，支持 leading 模式" : "Write a generic TS debounce that supports leading mode"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--gpt-soft)", color: "var(--gpt)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>G</div>
            <div style={{ flex: 1 }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 4 }}>GPT-5 · {lang === "zh" ? "思考 2 秒" : "thought 2s"}</div>
              <div className="code-block" style={{ background: "var(--bg)", padding: "12px 14px", fontSize: 11.5, lineHeight: 1.55, borderRadius: 8 }}>
{`function debounce<T extends (...a:any[])=>any>(
  fn: T, delay: number, opts={leading:false}
) {
  let t: ReturnType<typeof setTimeout>|null = null;
  let called = false;
  return (...args: Parameters<T>) => {`}
                <span className="caret" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code product preview */}
      <div className="card" style={{ padding: 0, overflow: "hidden", background: "#15140F", color: "#F4F2EE", borderColor: "#15140F", boxShadow: "var(--shadow-lg)", transform: "translateX(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid #2A271F", fontSize: 12 }}>
          <div style={{ display: "flex", gap: 5, marginRight: 12 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#E5A89A" }} />
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#E5CFA0" }} />
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#B5CCAB" }} />
          </div>
          <span className="mono" style={{ color: "#9A9588" }}>~/projects/agi · claude-code</span>
          <span className="badge" style={{ marginLeft: "auto", background: "transparent", color: "#9A9588", borderColor: "#3A362C" }}>ctx 124K / 200K</span>
        </div>
        <div style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", fontSize: 11.5, lineHeight: 1.65 }}>
          <div style={{ color: "#9A9588" }}><span style={{ color: "#D78A55" }}>{">"}</span> {lang === "zh" ? "重构 src/auth.ts 用最新的 OIDC 流程" : "refactor src/auth.ts to use latest OIDC flow"}</div>
          <div style={{ color: "#9A9588", marginTop: 6 }}>● {lang === "zh" ? "正在分析 3 个文件…" : "Analyzing 3 files…"}</div>
          <div style={{ color: "#9A9588", marginTop: 2 }}>● src/auth.ts · src/oauth.ts · src/middleware.ts</div>
          <div style={{ marginTop: 8 }}><span style={{ color: "#50A578" }}>+</span> <span>import {`{`} createRemoteJWKSet {`}`} from 'jose'</span></div>
          <div><span style={{ color: "#50A578" }}>+</span> <span>const JWKS = createRemoteJWKSet(new URL(...))</span></div>
          <div><span style={{ color: "#E0B14A" }}>~</span> <span>{lang === "zh" ? "替换" : "replace"} verifyToken() · 24 lines</span><span className="caret" /></div>
        </div>
      </div>
    </div>
  );
};

const ProductWindowChrome = ({ title, subtitle }) => (
  <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid var(--line)", background: "var(--bg-soft)", fontSize: 12 }}>
    <div style={{ display: "flex", gap: 5, marginRight: 12 }}>
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#E5A89A" }} />
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#E5CFA0" }} />
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#B5CCAB" }} />
    </div>
    <span style={{ color: "var(--ink-2)", fontWeight: 500 }}>{title}</span>
    {subtitle && <span style={{ marginLeft: "auto", color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>{subtitle}</span>}
  </div>
);

/* ============ Model ticker ============ */
const ModelTicker = ({ lang }) => {
  const items = window.MOCK.MODELS;
  const dup = [...items, ...items];
  return (
    <div style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "var(--bg-elev)", padding: "16px 0" }}>
      <div className="marquee">
        <div className="marquee-track" style={{ alignItems: "center" }}>
          {dup.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5 }}>
              <ModelGlyph family={m.family} size={20} />
              <span style={{ fontWeight: 500 }}>{m.name}</span>
              <span className="mono" style={{ color: "var(--ink-3)", fontSize: 12 }}>
                ¥{m.in.toFixed(2)} <span style={{ color: "var(--ink-4)" }}>/</span> ¥{m.out.toFixed(2)} <span style={{ color: "var(--ink-4)" }}>/ 1M</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============ Trust bar ============ */
const TrustBar = ({ lang }) => (
  <section className="container" style={{ marginTop: 80 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--bg-elev)" }}>
      {[
        { v: "100万+", v_en: "1M+", l: lang === "zh" ? "累计对话与请求" : "Chats & calls" },
        { v: "20+", l: lang === "zh" ? "顶级模型同时在线" : "Models live now" },
        { v: "60%", l: lang === "zh" ? "拼车池平均省下" : "Saved via shared pool" },
        { v: "<5min", l: lang === "zh" ? "从注册到第一次调用" : "Signup to first call" },
      ].map((s, i) => (
        <div key={i} style={{ padding: "32px 28px", borderRight: i < 3 ? "1px solid var(--line)" : "none" }}>
          <div className="num" style={{ fontSize: 38, fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>{lang === "zh" ? s.v : (s.v_en || s.v)}</div>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 6 }}>{s.l}</div>
        </div>
      ))}
    </div>
  </section>
);

/* ============ Two pillars ============ */
const TwoPillars = ({ lang, navigate }) => (
  <section className="container" style={{ padding: "100px 0 40px" }}>
    <div style={{ textAlign: "center", marginBottom: 56 }}>
      <div className="eyebrow">{lang === "zh" ? "两个产品 · 一个账号" : "Two products · one account"}</div>
      <h2 className="h1" style={{ fontSize: 44, marginTop: 14 }}>
        {lang === "zh" ? "对话与编程，从此不再分两处。" : "Chat and code, never split again."}
      </h2>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {/* Chat pillar */}
      <div className="card" style={{ padding: 36, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, color-mix(in srgb, var(--gpt) 22%, transparent), transparent 65%)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--gpt-soft)", color: "var(--gpt)", display: "grid", placeItems: "center" }}><Icon name="activity2" size={20} /></div>
            <span className="badge badge-gpt">CHAT</span>
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.15 }}>
            {lang === "zh" ? `${_N} 对话` : `${_N} Chat`}
          </h3>
          <p style={{ color: "var(--ink-2)", fontSize: 15, lineHeight: 1.55, marginTop: 12, marginBottom: 24 }}>
            {lang === "zh" ? "网页 + 桌面 + 移动端，多模型聚合的 AI 工作台。思维链推理、LaTeX、Mermaid、文件分析、图像生成，全套。" : "Web + desktop + mobile. Chain-of-thought, LaTeX, Mermaid, file analysis, image gen — all in."}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              lang === "zh" ? "满血 GPT-5 / Claude Opus 4.5" : "Full GPT-5 / Claude Opus 4.5",
              lang === "zh" ? "Gemini 3 Pro 多模态" : "Gemini 3 Pro multimodal",
              lang === "zh" ? "代码 / LaTeX / Mermaid 渲染" : "Code / LaTeX / Mermaid",
              lang === "zh" ? "PDF / 图片 / 表格分析" : "PDF / image / table parse",
              lang === "zh" ? "思维链可视化" : "Visible chain-of-thought",
              lang === "zh" ? "本地优先存储" : "Local-first storage",
            ].map((f, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 13.5, color: "var(--ink-2)" }}>
                <span style={{ color: "var(--gpt)", marginTop: 2 }}><Icon name="check" size={14} stroke={2.4} /></span>{f}
              </li>
            ))}
          </ul>
          <button className="btn btn-primary" onClick={() => navigate("signup")}>{lang === "zh" ? "进入对话" : "Open chat"}<Icon name="arrow_right" size={15} /></button>
        </div>
      </div>

      {/* Code pillar */}
      <div className="card" style={{ padding: 36, position: "relative", overflow: "hidden", background: "var(--ink)", color: "var(--bg)", borderColor: "var(--ink)" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 32%, transparent), transparent 65%)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "color-mix(in srgb, var(--accent) 35%, transparent)", color: "#fff", display: "grid", placeItems: "center" }}><Icon name="code" size={20} /></div>
            <span className="badge" style={{ background: "color-mix(in srgb, var(--accent) 25%, transparent)", color: "#fff", borderColor: "transparent" }}>CODE</span>
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.15 }}>
            {lang === "zh" ? `${_N} 编程` : `${_N} Code`}
          </h3>
          <p style={{ fontSize: 15, lineHeight: 1.55, marginTop: 12, marginBottom: 24, opacity: 0.8 }}>
            {lang === "zh" ? "Claude Code、Codex、Gemini CLI 三大顶级编程 Agent 共池接入。一行命令配置完成，写代码效率提升 300%。" : "Claude Code, Codex, Gemini CLI — one shared pool. One CLI command to set up. 3× faster shipping."}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              "Claude Code · 200K ctx",
              "OpenAI Codex CLI",
              "Gemini CLI · 1M ctx",
              lang === "zh" ? "macOS / Win / Linux" : "macOS / Win / Linux",
              lang === "zh" ? "拼车池省 60%" : "Shared pool, −60%",
              lang === "zh" ? "VSCode / Cursor 兼容" : "VSCode / Cursor",
            ].map((f, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 13.5, opacity: 0.9 }}>
                <span style={{ color: "var(--accent)", marginTop: 2 }}><Icon name="check" size={14} stroke={2.4} /></span>{f}
              </li>
            ))}
          </ul>
          <button className="btn btn-accent" onClick={() => navigate("docs")}>{lang === "zh" ? "查看接入命令" : "Get the CLI"}<Icon name="arrow_right" size={15} /></button>
        </div>
      </div>
    </div>
  </section>
);

/* ============ Features ============ */
const Features = ({ lang }) => {
  const items = [
    { icon: "bolt", t_zh: "满血直连", t_en: "Full power, direct", d_zh: "所有模型对齐官方满血版本，不阉割、不降智。", d_en: "Every model is the upstream full-power build. No nerfing." },
    { icon: "globe", t_zh: "国内秒开", t_en: "China-direct", d_zh: "多线 BGP + 边缘节点，国内首字延迟 <400ms，无需任何代理。", d_en: "Multi-line BGP + edge. Sub-400ms TTFB. No VPN." },
    { icon: "wallet", t_zh: "拼车共享", t_en: "Carpool pool", d_zh: "智能调度共享额度池，同样的体验，平均省下 60%。", d_en: "Shared pool with smart routing — same UX, 60% cheaper." },
    { icon: "layers", t_zh: "双轨产品", t_en: "Two products", d_zh: "AI 对话工作台 + AI 编程 CLI，一个账户两套全用。", d_en: "Chat console + Coding CLI. One account, both products." },
    { icon: "spark", t_zh: "思维链推理", t_en: "Chain of thought", d_zh: "对支持的模型展示完整推理过程，深度可视化。", d_en: "Visible thinking trace on supported models." },
    { icon: "shield", t_zh: "数据本地优先", t_en: "Local-first data", d_zh: "对话记录端侧加密存储，不用于训练，可签 DPA。", d_en: "Encrypted local chats. Never used for training. DPA available." },
  ];
  return (
    <section className="container" style={{ padding: "100px 0" }}>
      <div className="eyebrow">{lang === "zh" ? `为什么选 ${_N}` : `Why ${_N}`}</div>
      <h2 className="h1" style={{ marginTop: 14, marginBottom: 56, fontSize: 40, maxWidth: 22 + "ch" }}>
        {lang === "zh" ? "六个理由，让你切过来不回头。" : "Six reasons you won't switch back."}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--line)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        {items.map((f, i) => (
          <div key={i} style={{ background: "var(--bg-elev)", padding: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--bg-soft)", display: "grid", placeItems: "center", marginBottom: 18, color: "var(--accent)" }}>
              <Icon name={f.icon} size={20} stroke={1.6} />
            </div>
            <h3 className="h3">{lang === "zh" ? f.t_zh : f.t_en}</h3>
            <p style={{ color: "var(--ink-3)", fontSize: 14, lineHeight: 1.6, marginTop: 8, marginBottom: 0 }}>{lang === "zh" ? f.d_zh : f.d_en}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ============ Use cases ============ */
const UseCases = ({ lang, navigate }) => {
  const [active, setActive] = React.useState(0);
  const cases = [
    {
      tab_zh: "代码助手", tab_en: "Code", model: "Claude Code",
      title_zh: "从写代码到重构，AI 接管你的脏活。", title_en: "From scaffolding to refactor, AI takes the grind.",
      desc_zh: "Claude Code 深度理解大型代码库，200K 上下文吃下整个模块。一句指令完成跨文件改造、写测试、生成迁移脚本。", desc_en: "Claude Code grasps large codebases — 200K context eats whole modules. One prompt to refactor cross-file, write tests, generate migrations.",
      bullets_zh: ["跨文件重构与改名", "自动生成单元测试", "迁移脚本一键产出"], bullets_en: ["Cross-file rename & refactor", "Auto unit tests", "Generated migrations"],
      visual: "code"
    },
    {
      tab_zh: "学术 / 写作", tab_en: "Writing", model: "Gemini 3 Pro",
      title_zh: "长文档、公式、流程图，专业内容一站完成。", title_en: "Long docs, formulas, diagrams — professional output, one tool.",
      desc_zh: "Gemini 3 Pro 2M 上下文吃下整篇论文。LaTeX 公式、Mermaid 流程图、Markdown 表格全部原生渲染。", desc_en: "Gemini 3 Pro's 2M context swallows entire papers. LaTeX, Mermaid, Markdown tables render natively.",
      bullets_zh: ["LaTeX 公式渲染", "Mermaid 流程图", "PDF / DOCX 解析"], bullets_en: ["LaTeX rendering", "Mermaid diagrams", "PDF / DOCX parse"],
      visual: "math"
    },
    {
      tab_zh: "Agent 工作流", tab_en: "Agents", model: "Claude Opus 4.5",
      title_zh: "搭一个能跑全天的 Agent。", title_en: "Ship an agent that runs all day.",
      desc_zh: `Claude Opus 4.5 长时任务能力业界第一。配合 ${_N} 的速率分发与多 Key 调度，你的 Agent 终于不会半路死。`, desc_en: `Opus 4.5 leads long-horizon tasks. Plus ${_N}'s rate routing and multi-key dispatch — your agent finally stays alive.`,
      bullets_zh: ["100+ 工具并行", "失败自动重试", "多 Key 速率分发"], bullets_en: ["100+ parallel tools", "Auto retry", "Multi-key rate split"],
      visual: "agent"
    },
    {
      tab_zh: "图像生成", tab_en: "Imagery", model: "GPT-Image-1",
      title_zh: "一句话生成营销素材。", title_en: "One sentence → marketing art.",
      desc_zh: "接入 GPT-Image-1 与 Gemini 图像模型，自然语言生成插画、海报、产品图。商用授权清晰。", desc_en: "GPT-Image-1 and Gemini imagery — natural-language posters, illustrations, product shots. Commercial license clean.",
      bullets_zh: ["多种风格预设", "高清 2K 输出", "商用授权可下载"], bullets_en: ["Style presets", "2K HD output", "Commercial-use ready"],
      visual: "image"
    },
  ];
  const c = cases[active];
  return (
    <section style={{ background: "var(--bg-soft)", padding: "100px 0" }}>
      <div className="container">
        <div className="eyebrow">{lang === "zh" ? "AI 助力多场景" : "Use cases"}</div>
        <h2 className="h1" style={{ marginTop: 14, marginBottom: 36, fontSize: 40 }}>
          {lang === "zh" ? "编程、学术、Agent、绘画——一个平台搞定。" : "Code, papers, agents, art — one stop."}
        </h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 36, flexWrap: "wrap" }}>
          {cases.map((c, i) => (
            <button key={i} onClick={() => setActive(i)} className={"chip" + (active === i ? " active" : "")} style={{ padding: "8px 16px", fontSize: 14 }}>
              {lang === "zh" ? c.tab_zh : c.tab_en}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 56, alignItems: "center" }}>
          <div>
            <div className="badge" style={{ marginBottom: 18 }}><span className="badge-dot" />{lang === "zh" ? "推荐模型" : "Recommended"} · {c.model}</div>
            <h3 className="h1" style={{ fontSize: 32, marginBottom: 16 }}>{lang === "zh" ? c.title_zh : c.title_en}</h3>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--ink-2)" }}>{lang === "zh" ? c.desc_zh : c.desc_en}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "24px 0 0", display: "flex", flexDirection: "column", gap: 10 }}>
              {(lang === "zh" ? c.bullets_zh : c.bullets_en).map((b, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14.5 }}>
                  <span style={{ color: "var(--accent)" }}><Icon name="check" size={16} stroke={2.4} /></span>{b}
                </li>
              ))}
            </ul>
          </div>
          <UseCaseVisual kind={c.visual} lang={lang} />
        </div>
      </div>
    </section>
  );
};

const UseCaseVisual = ({ kind, lang }) => {
  if (kind === "code") return (
    <div className="card" style={{ padding: 0, overflow: "hidden", background: "#15140F", color: "#F4F2EE", borderColor: "#15140F" }}>
      <ProductWindowChrome title="src/auth.ts" subtitle="claude-code · refactor" />
      <pre style={{ margin: 0, padding: "18px 20px", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.65, color: "#D6D2C6", overflowX: "auto" }}>
{`- import { verify } from 'jsonwebtoken'
+ import { createRemoteJWKSet, jwtVerify } from 'jose'

  export async function verifyToken(tok: string) {
-   return verify(tok, process.env.SECRET!)
+   const JWKS = createRemoteJWKSet(new URL(JWKS_URL))
+   const { payload } = await jwtVerify(tok, JWKS, {
+     issuer: ISSUER,
+     audience: AUDIENCE,
+   })
+   return payload
  }`}
      </pre>
      <div style={{ padding: "10px 20px", borderTop: "1px solid #2A271F", fontSize: 11.5, fontFamily: "var(--font-mono)", color: "#9A9588", display: "flex", justifyContent: "space-between" }}>
        <span>● {lang === "zh" ? "3 文件已修改" : "3 files modified"}</span>
        <span style={{ color: "#50A578" }}>+12 −4</span>
      </div>
    </div>
  );
  if (kind === "math") return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <ProductWindowChrome title={lang === "zh" ? "学术写作 · paper.tex" : "Academic · paper.tex"} subtitle="gemini-3-pro" />
      <div style={{ padding: 28, background: "var(--bg-elev)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 500, marginBottom: 14 }}>{lang === "zh" ? "欧拉恒等式" : "Euler's identity"}</div>
        <div style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 22 }}>
          {lang === "zh" ? "在复分析中，将自然指数 e、虚数单位 i、圆周率 π 与 0、1 用单一恒等式联系：" : "In complex analysis, this single identity links e, i, π, 0 and 1:"}
        </div>
        <div style={{ padding: "24px 20px", background: "var(--bg-soft)", borderRadius: 10, textAlign: "center", fontFamily: "var(--font-display)", fontSize: 38, color: "var(--ink)" }}>
          e<sup style={{ fontSize: 22 }}>iπ</sup> + 1 = 0
        </div>
        <div style={{ marginTop: 18, padding: "12px 14px", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-3)" }}>
          $$ e^{`{i\\pi}`} + 1 = 0 $$
        </div>
      </div>
    </div>
  );
  if (kind === "agent") return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <ProductWindowChrome title="agent.run · order-fulfillment" subtitle="claude-opus-4.5" />
      <div style={{ padding: 22, background: "var(--bg-elev)", display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { ok: true, label: lang === "zh" ? "读取订单状态" : "fetch_order_status", time: "184 ms" },
          { ok: true, label: lang === "zh" ? "校验库存" : "verify_inventory", time: "212 ms" },
          { ok: true, label: lang === "zh" ? "生成发货单" : "build_shipping_label", time: "541 ms" },
          { ok: "running", label: lang === "zh" ? "通知物流方" : "notify_carrier", time: "…" },
          { ok: "pending", label: lang === "zh" ? "更新用户邮件" : "send_user_email", time: "" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.ok === true ? "var(--ok)" : s.ok === "running" ? "var(--accent)" : "var(--ink-4)", boxShadow: s.ok === "running" ? "0 0 0 4px color-mix(in srgb, var(--accent) 22%, transparent)" : "none" }} />
            <span className="mono" style={{ fontSize: 12.5, flex: 1 }}>{s.label}</span>
            <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{s.time}</span>
          </div>
        ))}
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4, textAlign: "center" }}>
          {lang === "zh" ? "5 个工具步骤 · 已用 ¥0.087" : "5 tool steps · cost ¥0.087"}
        </div>
      </div>
    </div>
  );
  if (kind === "image") return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <ProductWindowChrome title={lang === "zh" ? "图像 · 赛博朋克城市" : "Image · cyberpunk city"} subtitle="gpt-image-1" />
      <div style={{ padding: 20, background: "var(--bg-elev)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            ["linear-gradient(135deg, #E85A3A 0%, #1F1B3F 60%, #0A0F1E 100%)", "Cyberpunk City"],
            ["linear-gradient(135deg, #3B6E8F 0%, #1F0F2E 60%, #06030B 100%)", "Neon Alley"],
            ["linear-gradient(135deg, #B85C8C 0%, #2E1545 60%, #0C0612 100%)", "Synthwave"],
            ["linear-gradient(135deg, #C28A00 0%, #3F2A00 60%, #0E0900 100%)", "Tokyo 2099"],
          ].map(([bg, label], i) => (
            <div key={i} style={{ aspectRatio: "1 / 1", borderRadius: 8, background: bg, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg, transparent 0 6px, rgba(255,255,255,0.04) 6px 7px)" }} />
              <div style={{ position: "absolute", bottom: 8, left: 10, color: "#fff", fontSize: 11, fontFamily: "var(--font-mono)", opacity: 0.85 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--bg-soft)", borderRadius: 8, fontSize: 12.5, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="spark" size={14} />
          <span className="mono">{lang === "zh" ? "「赛博朋克风格的雨夜城市，霓虹反射」" : '"cyberpunk rainy city, neon reflections"'}</span>
        </div>
      </div>
    </div>
  );
  return null;
};

/* ============ Models showcase ============ */
const ModelsShowcase = ({ lang, navigate }) => (
  <section className="container" style={{ padding: "100px 0 60px" }}>
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 12 }}>
      <div>
        <div className="eyebrow">{lang === "zh" ? "支持的模型" : "Supported models"}</div>
        <h2 className="h1" style={{ marginTop: 14, maxWidth: 22 + "ch", fontSize: 40 }}>
          {lang === "zh" ? "今天最强的脑子，都在这里。" : "The smartest minds, all here."}
        </h2>
      </div>
      <a className="btn btn-ghost" onClick={() => navigate("models")}>{lang === "zh" ? "查看全部模型 →" : "View all →"}</a>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      {window.MOCK.MODELS.slice(0, 8).map(m => (
        <div key={m.id} className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <ModelGlyph family={m.family} size={26} />
            {m.tag && <span className={"badge " + (m.family === "openai" ? "badge-gpt" : m.family === "anthropic" ? "badge-claude" : "badge-google")}>{m.tag}</span>}
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17 }}>{m.name}</div>
          <p style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55, marginTop: 6, marginBottom: 18, minHeight: 60 }}>{lang === "zh" ? m.desc_zh : m.desc_en}</p>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 10, fontSize: 12, paddingTop: 14, borderTop: "1px dashed var(--line)", alignItems: "baseline" }}>
            <div>
              <div style={{ color: "var(--ink-3)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.06em" }}>{lang === "zh" ? "上下文" : "Ctx"}</div>
              <div className="mono" style={{ fontWeight: 500 }}>{m.ctx}</div>
            </div>
            <div>
              <div style={{ color: "var(--ink-3)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.06em" }}>In</div>
              <div className="num" style={{ fontWeight: 500 }}>¥{m.in.toFixed(2)}</div>
            </div>
            <div>
              <div style={{ color: "var(--ink-3)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Out</div>
              <div className="num" style={{ fontWeight: 500 }}>¥{m.out.toFixed(2)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

/* ============ Carpool ============ */
const Carpool = ({ lang, navigate }) => (
  <section className="container" style={{ padding: "60px 0 100px" }}>
    <div style={{ position: "relative", padding: "56px 56px", borderRadius: "var(--radius-xl)", background: "var(--bg-soft)", border: "1px solid var(--line)", overflow: "hidden", display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 56, alignItems: "center" }}>
      <div>
        <div className="eyebrow" style={{ color: "var(--accent-ink)" }}>{lang === "zh" ? "拼车共享 · 独家" : "Carpool · exclusive"}</div>
        <h2 className="h1" style={{ marginTop: 14, fontSize: 40, lineHeight: 1.1 }}>
          {lang === "zh" ? <React.Fragment>三个人共用一个池子，<br />同样体验，平均 <span style={{ color: "var(--accent)" }}>省 60%</span>。</React.Fragment> : <React.Fragment>Three people share one pool.<br />Same UX. <span style={{ color: "var(--accent)" }}>60% cheaper</span>.</React.Fragment>}
        </h2>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--ink-2)", marginTop: 18, maxWidth: 56 + "ch" }}>
          {lang === "zh" ? "我们与上游签订企业级订阅，把闲置额度智能调度给拼车成员。数据完全隔离，互不可见。同等模型能力，月度成本对半再砍。" : "We hold enterprise upstream subscriptions and intelligently route spare capacity to pool members. Workloads isolated. Same models, half the bill."}
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          <button className="btn btn-primary" onClick={() => navigate("pricing")}>{lang === "zh" ? "看拼车套餐" : "See pool plans"}<Icon name="arrow_right" size={15} /></button>
          <button className="btn btn-outline" onClick={() => navigate("docs")}>{lang === "zh" ? "了解原理" : "How it works"}</button>
        </div>
      </div>
      <CarpoolViz lang={lang} />
    </div>
  </section>
);

const CarpoolViz = ({ lang }) => {
  return (
    <div className="card" style={{ padding: 28, position: "relative", overflow: "hidden" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {lang === "zh" ? "本月共享池 · 实时" : "Pool this month · live"}
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        {[
          { c: "#E85A3A", n: "Yu Long", u: 38 },
          { c: "#3B6E8F", n: "Tang Lin", u: 27 },
          { c: "#7A5E3E", n: "Mei Wu", u: 22 },
        ].map((p, i) => (
          <div key={i} style={{ flex: 1, padding: "14px 14px", background: "var(--bg-soft)", borderRadius: 10, border: "1px solid var(--line)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: p.c, color: "#fff", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 600 }}>{p.n[0]}</div>
              <span style={{ fontSize: 12.5, fontWeight: 500 }}>{p.n}</span>
            </div>
            <div className="num" style={{ fontSize: 19, fontWeight: 600, fontFamily: "var(--font-display)" }}>{p.u}%</div>
          </div>
        ))}
      </div>
      <div style={{ height: 14, borderRadius: 999, overflow: "hidden", display: "flex", background: "var(--bg-soft)", border: "1px solid var(--line)" }}>
        <span style={{ width: "38%", background: "#E85A3A" }} />
        <span style={{ width: "27%", background: "#3B6E8F" }} />
        <span style={{ width: "22%", background: "#7A5E3E" }} />
      </div>
      <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-3)" }}>
        <span>{lang === "zh" ? "已用 87% / 池容 5,000 万 Token" : "Used 87% of 50M-token pool"}</span>
        <span className="mono">¥412.88 / ¥1,000</span>
      </div>
      <div style={{ marginTop: 24, padding: 16, background: "var(--ink)", color: "var(--bg)", borderRadius: 10, display: "flex", alignItems: "center", gap: 14 }}>
        <Icon name="spark" size={20} />
        <div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>{lang === "zh" ? "本月相比独自直连" : "vs. solo subscriptions"}</div>
          <div className="num" style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--accent)" }}>
            {lang === "zh" ? "省下 ¥1,847" : "Saved ¥1,847"}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============ Dev section ============ */
const DevSection = ({ lang, navigate }) => {
  const [tab, setTab] = React.useState("python");
  const samples = {
    python: [
      'from openai import OpenAI',
      '',
      'client = OpenAI(',
      '    api_key="sk-...",',
      `    base_url="https://${_API}/v1"`,
      ')',
      '',
      'r = client.chat.completions.create(',
      '    model="claude-opus-4.5",  # or gpt-5, gemini-3-pro',
      '    messages=[{"role": "user", "content": "Hi!"}],',
      ')',
      'print(r.choices[0].message.content)',
    ],
    node: [
      'import OpenAI from "openai";',
      '',
      'const client = new OpenAI({',
      '  apiKey: "sk-...",',
      `  baseURL: "https://${_API}/v1"`,
      '});',
      '',
      'const r = await client.chat.completions.create({',
      '  model: "claude-sonnet-4.5",',
      '  messages: [{ role: "user", content: "Hi!" }]',
      '});',
    ],
    cli: [
      `# Claude Code via ${_N}`,
      `export ANTHROPIC_BASE_URL=https://${_API}`,
      'export ANTHROPIC_API_KEY=sk-...',
      '',
      'claude-code "refactor src/auth.ts to use jose"',
      '',
      '# Codex CLI',
      `codex --base-url https://${_API}/v1 \\`,
      '      --api-key sk-... "write me a tic-tac-toe"',
    ],
  };
  return (
    <section style={{ background: "var(--bg-soft)", padding: "100px 0" }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 56, alignItems: "center" }}>
        <div>
          <div className="eyebrow">{lang === "zh" ? "开发者友好" : "Drop-in for devs"}</div>
          <h2 className="h1" style={{ marginTop: 14, fontSize: 40 }}>
            {lang === "zh" ? "改一行 base_url，整套迁移完成。" : "Change base_url. That's the migration."}
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--ink-2)", marginTop: 18 }}>
            {lang === "zh" ? "兼容 OpenAI、Anthropic、Google 三家官方协议。LangChain、LlamaIndex、Cursor、Cline、Continue 全部零成本接入。" : "OpenAI, Anthropic and Google protocols all supported. LangChain, LlamaIndex, Cursor, Cline, Continue — zero migration."}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22, marginBottom: 26 }}>
            {["OpenAI SDK","Anthropic SDK","LangChain","LlamaIndex","Cursor","Cline","Continue","Dify"].map((it, i) => (
              <span key={i} className="chip" style={{ padding: "5px 12px", fontSize: 12.5 }}>{it}</span>
            ))}
          </div>
          <button className="btn btn-outline" onClick={() => navigate("docs")}>{lang === "zh" ? "完整接入指南" : "Full integration guide"}<Icon name="arrow_right" size={15} /></button>
        </div>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--line)", background: "var(--bg-elev)" }}>
            {[{ id: "python", l: "Python" }, { id: "node", l: "Node.js" }, { id: "cli", l: "CLI / Code" }].map(k => (
              <button key={k.id} onClick={() => setTab(k.id)} style={{ padding: "12px 18px", fontFamily: "var(--font-mono)", fontSize: 13, background: tab === k.id ? "var(--bg-inset)" : "transparent", border: 0, borderBottom: tab === k.id ? "2px solid var(--accent)" : "2px solid transparent", color: tab === k.id ? "var(--ink)" : "var(--ink-3)", cursor: "pointer" }}>{k.l}</button>
            ))}
            <div style={{ marginLeft: "auto", padding: 8 }}><button className="btn btn-ghost btn-sm"><Icon name="copy" size={13} />{lang === "zh" ? "复制" : "Copy"}</button></div>
          </div>
          <pre style={{ margin: 0, padding: "20px 22px", background: "var(--bg-inset)", fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.65, color: "var(--ink)", overflowX: "auto" }}>
            {samples[tab].map((line, i) => (
              <div key={i} style={{ minHeight: 18, color: line.startsWith("#") ? "var(--ink-3)" : "var(--ink)", fontStyle: line.startsWith("#") ? "italic" : "normal" }}>{line}</div>
            ))}
          </pre>
        </div>
      </div>
    </section>
  );
};

/* ============ Pricing teaser ============ */
const PricingTeaser = ({ lang, navigate }) => (
  <section className="container" style={{ padding: "100px 0 60px" }}>
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 12 }}>
      <div>
        <div className="eyebrow">{lang === "zh" ? "价格" : "Pricing"}</div>
        <h2 className="h1" style={{ marginTop: 14, fontSize: 40 }}>
          {lang === "zh" ? "按 Token 付费，不绑订阅。" : "Pay per token. No lock-in."}
        </h2>
      </div>
      <a className="btn btn-ghost" onClick={() => navigate("pricing")}>{lang === "zh" ? "完整套餐对比 →" : "Full comparison →"}</a>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      {window.MOCK.PLANS.map(p => (
        <div key={p.id} className="card" style={{ padding: 26, borderColor: p.featured ? "var(--ink)" : "var(--line)", borderWidth: p.featured ? 2 : 1, position: "relative" }}>
          {p.featured && <span className="badge badge-accent" style={{ position: "absolute", top: -10, left: 18 }}>{lang === "zh" ? "最受欢迎" : "Most popular"}</span>}
          <div className="h3" style={{ marginBottom: 4 }}>{p.id === "starter" ? (lang === "zh" ? "体验" : "Trial") : p.id === "pro" ? (lang === "zh" ? "开发者" : "Developer") : p.id === "team" ? (lang === "zh" ? "团队" : "Team") : (lang === "zh" ? "企业" : "Enterprise")}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 16 }}>
            {p.price === null ? <span className="num" style={{ fontSize: 26, fontWeight: 600 }}>{lang === "zh" ? "定制" : "Custom"}</span> : <React.Fragment>
              <span style={{ fontSize: 16, color: "var(--ink-3)" }}>¥</span>
              <span className="num" style={{ fontSize: 32, fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>{p.price}</span>
              <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{lang === "zh" ? p.unit_zh : p.unit_en}</span>
            </React.Fragment>}
          </div>
          <button className={"btn " + (p.featured ? "btn-primary" : "btn-outline")} style={{ width: "100%" }} onClick={() => p.cta === "free" ? navigate("signup") : p.cta === "contact" ? navigate("home") : navigate("billing")}>
            {p.cta === "free" ? (lang === "zh" ? "免费开始" : "Start free") : p.cta === "contact" ? (lang === "zh" ? "联系销售" : "Contact sales") : (lang === "zh" ? "立即充值" : "Top up")}
          </button>
        </div>
      ))}
    </div>
  </section>
);

/* ============ Community CTA ============ */
const CommunityCTA = ({ lang, navigate }) => (
  <section className="container" style={{ paddingBottom: 100 }}>
    <div style={{ position: "relative", padding: "64px 56px", borderRadius: "var(--radius-xl)", background: "var(--ink)", color: "var(--bg)", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -120, top: -120, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)", opacity: 0.45, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: -150, bottom: -180, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, var(--google) 0%, transparent 65%)", opacity: 0.3, pointerEvents: "none" }} />
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48, alignItems: "center" }}>
        <div>
          <h2 className="h1" style={{ color: "var(--bg)", fontSize: 44, lineHeight: 1.1 }}>
            {lang === "zh" ? <React.Fragment>5 分钟接入，<br />从今天开始放手干。</React.Fragment> : <React.Fragment>5 minutes to live.<br />Ship from today.</React.Fragment>}
          </h2>
          <p style={{ color: "color-mix(in srgb, var(--bg) 70%, transparent)", fontSize: 16, marginTop: 16, marginBottom: 28, maxWidth: 54 + "ch" }}>
            {lang === "zh" ? "注册、生成 Key、发出第一次请求 —— 全程不超过一杯咖啡的时间。" : "Sign up, generate a key, ship — faster than your coffee."}
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn-accent btn-lg" onClick={() => navigate("signup")}>{lang === "zh" ? "免费开始" : "Start free"}<Icon name="arrow_right" size={16} /></button>
            <button className="btn btn-lg" style={{ background: "transparent", color: "var(--bg)", border: "1px solid color-mix(in srgb, var(--bg) 28%, transparent)" }} onClick={() => navigate("docs")}>{lang === "zh" ? "看文档" : "Read docs"}</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <CommunityCard title={lang === "zh" ? "微信交流群" : "WeChat group"} sub={lang === "zh" ? "扫码加入 · 1.2k 成员" : "Scan to join · 1.2k members"} />
          <CommunityCard title={lang === "zh" ? "QQ 频道" : "QQ channel"} sub="971885281" mono />
        </div>
      </div>
    </div>
  </section>
);

const CommunityCard = ({ title, sub, mono }) => (
  <div style={{ flex: "1 1 220px", padding: 20, borderRadius: 14, background: "color-mix(in srgb, var(--bg) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--bg) 14%, transparent)", display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 70, height: 70, borderRadius: 10, padding: 6, background: "var(--bg)", flexShrink: 0 }}>
      <QRMini />
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontWeight: 500, fontSize: 14 }}>{title}</div>
      <div style={{ fontSize: 12, color: "color-mix(in srgb, var(--bg) 65%, transparent)", marginTop: 4, fontFamily: mono ? "var(--font-mono)" : "inherit" }}>{sub}</div>
    </div>
  </div>
);

const QRMini = () => {
  const cells = [];
  let seed = 19;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let i = 0; i < 21 * 21; i++) cells.push(rand() > 0.5 ? 1 : 0);
  return (
    <svg viewBox="0 0 21 21" width="100%" height="100%" shapeRendering="crispEdges">
      {cells.map((c, i) => c ? <rect key={i} x={i % 21} y={Math.floor(i / 21)} width="1" height="1" fill="var(--ink)" /> : null)}
      {[[0,0],[14,0],[0,14]].map(([x,y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="7" height="7" fill="var(--bg)" />
          <rect x={x} y={y} width="7" height="7" fill="none" stroke="var(--ink)" strokeWidth="1" />
          <rect x={x+2} y={y+2} width="3" height="3" fill="var(--ink)" />
        </g>
      ))}
    </svg>
  );
};

window.Landing = Landing;
