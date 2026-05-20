// Dashboard overview page
const DashboardOverview = ({ t, lang, navigate }) => {
  const stats = [
    { label: t("dash_balance"), value: "¥1,847.62", delta: "+¥1,000 " + (lang === "zh" ? "本月" : "MTD"), tone: "ink", action: "billing", cta: t("dash_topup") },
    { label: t("dash_today"), value: "¥34.21", delta: "+12.4% vs " + (lang === "zh" ? "昨日" : "yest."), tone: "ink" },
    { label: t("dash_calls"), value: "15,812", delta: "+9.8% vs " + (lang === "zh" ? "昨日" : "yest."), tone: "ink" },
    { label: t("dash_avg"), value: "412 ms", delta: lang === "zh" ? "P95 1.2s" : "P95 1.2s", tone: "ink" },
  ];

  return (
    <React.Fragment>
      <div className="page-head">
        <div className="grow">
          <div className="eyebrow" style={{ marginBottom: 8 }}>{t("dash_overview")}</div>
          <h1>{t("dash_welcome")}, Yu Long</h1>
          <p>{lang === "zh" ? "这是你最近 7 天的中转概况。" : "Here's your relay activity for the last 7 days."}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("docs")}>
            <Icon name="book" size={15} />{lang === "zh" ? "文档" : "Docs"}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("keys")}>
            <Icon name="plus" size={15} />{lang === "zh" ? "新建密钥" : "New key"}
          </button>
        </div>
      </div>

      {/* Top stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div key={i} className="card" style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14, background: i === 0 ? "var(--ink)" : "var(--bg-elev)", color: i === 0 ? "var(--bg)" : "var(--ink)", borderColor: i === 0 ? "var(--ink)" : "var(--line)", position: i === 0 ? "relative" : "static", overflow: "hidden" }}>
            {i === 0 && <div style={{ position: "absolute", right: -60, top: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)", opacity: 0.6, pointerEvents: "none" }} />}
            <div style={{ position: "relative", fontSize: 13, color: i === 0 ? "color-mix(in srgb, var(--bg) 70%, transparent)" : "var(--ink-3)", fontWeight: 500 }}>{s.label}</div>
            <div style={{ position: "relative", fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1 }} className="num">{s.value}</div>
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <span style={{ fontSize: 12.5, color: i === 0 ? "color-mix(in srgb, var(--bg) 70%, transparent)" : "var(--ink-3)" }}>{s.delta}</span>
              {s.cta && <button className="btn btn-accent btn-sm" onClick={() => navigate(s.action)}>{s.cta}</button>}
            </div>
          </div>
        ))}
      </div>

      {/* Trend + Distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 24 }}>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <h3 className="h3">{t("dash_trend")}</h3>
              <p style={{ color: "var(--ink-3)", fontSize: 13, margin: "4px 0 0" }}>
                {lang === "zh" ? "调用次数 (柱) · 消费 (线)" : "Calls (bars) · Spend (line)"}
              </p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["7D","30D","90D"].map((p, i) => (
                <button key={p} className={"chip" + (i === 0 ? " active" : "")} style={{ padding: "4px 10px", fontSize: 12 }}>{p}</button>
              ))}
            </div>
          </div>
          <TrendChart lang={lang} />
        </div>
        <div className="card">
          <h3 className="h3" style={{ marginBottom: 4 }}>{t("dash_distribution")}</h3>
          <p style={{ color: "var(--ink-3)", fontSize: 13, margin: "0 0 18px" }}>
            {lang === "zh" ? "按 Token 消耗占比" : "By token spend"}
          </p>
          <DonutChart />
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
            {window.MOCK.MODEL_SPLIT.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: m.color }} />
                <span style={{ flex: 1, color: "var(--ink-2)" }}>{m.name}</span>
                <span className="num" style={{ fontWeight: 500 }}>{m.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent calls */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 className="h3">{t("dash_recent")}</h3>
            <p style={{ color: "var(--ink-3)", fontSize: 13, margin: "4px 0 0" }}>
              <span className="live-dot" />{lang === "zh" ? "实时滚动 · 每 5 秒刷新" : "Live · refreshes every 5s"}
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("usage")}>{lang === "zh" ? "全部用量 →" : "View all →"}</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 100 }}>{lang === "zh" ? "时间" : "Time"}</th>
              <th>{lang === "zh" ? "模型" : "Model"}</th>
              <th>{lang === "zh" ? "密钥" : "Key"}</th>
              <th style={{ textAlign: "right" }}>Tokens</th>
              <th style={{ textAlign: "right" }}>{lang === "zh" ? "延迟" : "Latency"}</th>
              <th style={{ textAlign: "right" }}>{lang === "zh" ? "成本" : "Cost"}</th>
            </tr>
          </thead>
          <tbody>
            {window.MOCK.RECENT_CALLS.map((c, i) => (
              <tr key={i}>
                <td><span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{c.time}</span></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ModelGlyph family={c.model.startsWith("gpt") || c.model.startsWith("o") ? "openai" : "anthropic"} size={18} />
                    <span className="mono" style={{ fontSize: 12.5 }}>{c.model}</span>
                  </div>
                </td>
                <td><span style={{ fontSize: 13, color: "var(--ink-2)" }}>{c.key}</span></td>
                <td style={{ textAlign: "right" }}>
                  <span className="num" style={{ fontSize: 13 }}>{c.in_tok.toLocaleString()} <span style={{ color: "var(--ink-4)" }}>/</span> {c.out_tok.toLocaleString()}</span>
                </td>
                <td style={{ textAlign: "right" }}><span className="num" style={{ fontSize: 13, color: c.latency > 1000 ? "var(--warn)" : "var(--ink-2)" }}>{c.latency} ms</span></td>
                <td style={{ textAlign: "right" }}><span className="num" style={{ fontSize: 13, fontWeight: 500 }}>¥{c.cost.toFixed(4)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tips strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 24 }}>
        {[
          { icon: "bolt", title: lang === "zh" ? "缓存命中省 50%" : "Save 50% with caching", body: lang === "zh" ? "对相同 system prompt 自动复用缓存。" : "Reuse cache for repeated system prompts.", link: "docs" },
          { icon: "shield", title: lang === "zh" ? "为每个 Key 设额度" : "Quota per key", body: lang === "zh" ? "把生产 Key 和测试 Key 分开。" : "Separate prod from dev keys.", link: "keys" },
          { icon: "spark", title: lang === "zh" ? "本月已为你省下" : "Saved this month", body: lang === "zh" ? "¥187.42（相比官方直连）" : "¥187.42 vs upstream", link: "billing" },
        ].map((tip, i) => (
          <div key={i} className="card" style={{ display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer", padding: 18 }} onClick={() => navigate(tip.link)}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--bg-soft)", display: "grid", placeItems: "center", color: "var(--accent)", flexShrink: 0 }}>
              <Icon name={tip.icon} size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 4 }}>{tip.title}</div>
              <div style={{ fontSize: 13, color: "var(--ink-3)" }}>{tip.body}</div>
            </div>
            <span style={{ color: "var(--ink-3)" }}><Icon name="chevron_right" size={16} /></span>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

const TrendChart = ({ lang }) => {
  const data = window.MOCK.TREND_7D;
  const W = 720, H = 220, PAD_L = 36, PAD_R = 40, PAD_T = 16, PAD_B = 28;
  const maxCalls = Math.max(...data.map(d => d.calls));
  const maxCost = Math.max(...data.map(d => d.cost));
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const barW = innerW / data.length * 0.55;
  const step = innerW / (data.length - 1);
  const linePoints = data.map((d, i) => [PAD_L + i * step, PAD_T + (1 - d.cost / maxCost) * innerH]);
  const path = linePoints.map((p, i) => (i === 0 ? "M" : "L") + p[0] + " " + p[1]).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible", display: "block" }}>
      {/* grid */}
      <g className="chart-grid">
        {[0,0.25,0.5,0.75,1].map((p,i) => (
          <line key={i} x1={PAD_L} x2={W-PAD_R} y1={PAD_T + p * innerH} y2={PAD_T + p * innerH} />
        ))}
      </g>
      {/* y labels left (calls) */}
      <g className="chart-axis">
        {[0,0.5,1].map((p,i) => (
          <text key={i} x={PAD_L - 8} y={PAD_T + (1-p) * innerH + 3} textAnchor="end">{Math.round(maxCalls * p / 1000) + "k"}</text>
        ))}
      </g>
      {/* y labels right (cost) */}
      <g className="chart-axis">
        {[0,0.5,1].map((p,i) => (
          <text key={i} x={W - PAD_R + 8} y={PAD_T + (1-p) * innerH + 3} textAnchor="start" fill="var(--accent)">¥{(maxCost*p).toFixed(0)}</text>
        ))}
      </g>
      {/* bars */}
      {data.map((d, i) => {
        const x = PAD_L + i * step - barW / 2;
        const h = (d.calls / maxCalls) * innerH;
        return <rect key={i} x={x} y={PAD_T + innerH - h} width={barW} height={h} rx="2" fill="var(--ink-2)" opacity={i === data.length - 1 ? 1 : 0.18} />;
      })}
      {/* x labels */}
      <g className="chart-axis">
        {data.map((d, i) => (
          <text key={i} x={PAD_L + i * step} y={H - 8} textAnchor="middle">{d.d}</text>
        ))}
      </g>
      {/* line */}
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" />
      {linePoints.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="var(--accent)" />)}
    </svg>
  );
};

const DonutChart = () => {
  const data = window.MOCK.MODEL_SPLIT;
  const R = 80, r = 52, CX = 100, CY = 100;
  let acc = 0;
  const total = data.reduce((s, d) => s + d.pct, 0);
  return (
    <svg viewBox="0 0 200 200" width="100%" style={{ maxWidth: 220, margin: "0 auto", display: "block" }}>
      {data.map((d, i) => {
        const startAngle = (acc / total) * Math.PI * 2 - Math.PI / 2;
        acc += d.pct;
        const endAngle = (acc / total) * Math.PI * 2 - Math.PI / 2;
        const x1 = CX + R * Math.cos(startAngle);
        const y1 = CY + R * Math.sin(startAngle);
        const x2 = CX + R * Math.cos(endAngle);
        const y2 = CY + R * Math.sin(endAngle);
        const x3 = CX + r * Math.cos(endAngle);
        const y3 = CY + r * Math.sin(endAngle);
        const x4 = CX + r * Math.cos(startAngle);
        const y4 = CY + r * Math.sin(startAngle);
        const large = (d.pct / total) > 0.5 ? 1 : 0;
        const path = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`;
        return <path key={i} d={path} fill={d.color} />;
      })}
      <circle cx={CX} cy={CY} r={r - 0.5} fill="var(--bg-elev)" />
      <text x={CX} y={CY - 4} textAnchor="middle" fontFamily="var(--font-display)" fontWeight="600" fontSize="22" fill="var(--ink)">15.8K</text>
      <text x={CX} y={CY + 16} textAnchor="middle" fontSize="11" fill="var(--ink-3)" fontFamily="var(--font-mono)" letterSpacing="0.08em">CALLS · 24H</text>
    </svg>
  );
};

window.DashboardOverview = DashboardOverview;
