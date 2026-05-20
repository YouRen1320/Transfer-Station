// API Keys & Usage dashboard pages

const KeysPage = ({ t, lang }) => {
  const [keys, setKeys] = React.useState(window.MOCK.KEYS);
  const [creating, setCreating] = React.useState(false);
  const [revealed, setRevealed] = React.useState({});
  const [copied, setCopied] = React.useState(null);

  const handleCreate = (data) => {
    const newKey = {
      id: keys.length + 1,
      name: data.name || "untitled",
      key: "sk-demo-" + Array.from({ length: 30 }).map(() => "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"[Math.floor(Math.random() * 54)]).join(""),
      quota: data.quota,
      used: 0,
      status: "active",
      created: "2026-05-13",
    };
    setKeys([newKey, ...keys]);
    setRevealed({ [newKey.id]: true });
    setCreating(false);
  };

  const toggle = (id) => {
    setKeys(keys.map(k => k.id === id ? { ...k, status: k.status === "active" ? "disabled" : "active" } : k));
  };

  const copy = (text, id) => {
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <React.Fragment>
      <div className="page-head">
        <div className="grow">
          <div className="eyebrow" style={{ marginBottom: 8 }}>{t("nav_console")} · {t("dash_keys")}</div>
          <h1>{t("keys_title")}</h1>
          <p>{t("keys_sub")}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>
          <Icon name="plus" size={16} />{t("keys_new")}
        </button>
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <div className="input-prefix" style={{ flex: "1 1 320px", maxWidth: 360 }}>
          <Icon name="search" size={15} stroke={1.8} />
          <input className="input" placeholder={lang === "zh" ? "搜索密钥名称…" : "Search keys…"} />
        </div>
        <button className="chip active">{lang === "zh" ? "全部" : "All"} <span style={{ opacity: 0.6 }}>{keys.length}</span></button>
        <button className="chip">{t("keys_active")} <span style={{ opacity: 0.6 }}>{keys.filter(k => k.status === "active").length}</span></button>
        <button className="chip">{t("keys_disabled")} <span style={{ opacity: 0.6 }}>{keys.filter(k => k.status === "disabled").length}</span></button>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr>
              <th>{t("keys_name")}</th>
              <th>{t("keys_key")}</th>
              <th style={{ width: 200 }}>{t("keys_used")} / {t("keys_quota")}</th>
              <th>{t("keys_status")}</th>
              <th>{t("keys_created")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {keys.map(k => {
              const pct = Math.min(100, (k.used / k.quota) * 100);
              const isRevealed = revealed[k.id];
              const mask = "sk-demo-" + "•".repeat(20) + k.key.slice(-4);
              return (
                <tr key={k.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: k.status === "active" ? "var(--ok)" : "var(--ink-4)" }} />
                      <span style={{ fontWeight: 600 }}>{k.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <code className="mono" style={{ fontSize: 12.5, color: "var(--ink-2)", background: "var(--bg-soft)", padding: "4px 8px", borderRadius: 6 }}>
                        {isRevealed ? k.key : mask}
                      </code>
                      <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => setRevealed({ ...revealed, [k.id]: !isRevealed })}>
                        <Icon name={isRevealed ? "eye_off" : "eye"} size={14} />
                      </button>
                      <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => copy(k.key, k.id)}>
                        <Icon name={copied === k.id ? "check" : "copy"} size={14} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="num" style={{ fontSize: 12.5, marginBottom: 4 }}>¥{k.used.toFixed(2)} / ¥{k.quota.toFixed(0)}</div>
                    <div className="progress"><span style={{ width: pct + "%", background: pct > 90 ? "var(--accent)" : "var(--ink)" }} /></div>
                  </td>
                  <td>
                    <span className={"badge " + (k.status === "active" ? "" : "badge-warn")}>
                      {k.status === "active" ? <React.Fragment><span className="badge-dot" />{t("keys_active")}</React.Fragment> : t("keys_disabled")}
                    </span>
                  </td>
                  <td><span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{k.created}</span></td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => toggle(k.id)}>{k.status === "active" ? t("disable") : t("enable")}</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: "var(--accent-ink)" }}>{t("revoke")}</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 28 }} className="card-flat">
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <span style={{ color: "var(--accent)", flexShrink: 0 }}><Icon name="shield" /></span>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{lang === "zh" ? "密钥保密小贴士" : "Keep keys safe"}</div>
            <p style={{ fontSize: 13.5, color: "var(--ink-2)", margin: 0, lineHeight: 1.6 }}>
              {lang === "zh"
                ? "不要把密钥写进前端代码或 Git 仓库。我们检测到密钥泄露后会自动吊销并通知你。建议为不同应用分别创建密钥，并设置单独额度。"
                : "Never commit keys to git or ship them in client bundles. We auto-revoke on detected leaks and alert you. Create per-app keys with separate quotas."}
            </p>
          </div>
        </div>
      </div>

      {creating && <CreateKeyModal lang={lang} t={t} onClose={() => setCreating(false)} onCreate={handleCreate} />}
    </React.Fragment>
  );
};

const CreateKeyModal = ({ lang, t, onClose, onCreate }) => {
  const [name, setName] = React.useState("");
  const [quota, setQuota] = React.useState(100);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(20,19,15,0.45)", backdropFilter: "blur(4px)", zIndex: 100, display: "grid", placeItems: "center", padding: 20 }} onClick={onClose}>
      <div className="card" style={{ maxWidth: 460, width: "100%", padding: 28, boxShadow: "var(--shadow-lg)" }} onClick={e => e.stopPropagation()}>
        <h3 className="h2" style={{ marginBottom: 6 }}>{t("keys_new")}</h3>
        <p style={{ color: "var(--ink-3)", fontSize: 13.5, marginBottom: 24 }}>{lang === "zh" ? "创建后请立即复制并保存，关闭后将无法再次完整查看。" : "Copy the key now — you can't view it again later."}</p>
        <div className="field" style={{ marginBottom: 16 }}>
          <label className="field-label">{t("keys_name")}</label>
          <input className="input" placeholder={lang === "zh" ? "如：production-ios" : "e.g. production-ios"} value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="field" style={{ marginBottom: 16 }}>
          <label className="field-label">{t("keys_quota")} (¥)</label>
          <input className="input num" type="number" value={quota} onChange={e => setQuota(+e.target.value)} />
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {[50, 100, 500, 1000, 0].map(v => (
              <button key={v} className="chip" style={{ fontSize: 12, padding: "4px 10px" }} onClick={() => setQuota(v)}>
                {v === 0 ? (lang === "zh" ? "无上限" : "Unlimited") : "¥" + v}
              </button>
            ))}
          </div>
        </div>
        <div className="field" style={{ marginBottom: 24 }}>
          <label className="field-label">{lang === "zh" ? "允许模型" : "Allowed models"}</label>
          <select className="select">
            <option>{lang === "zh" ? "全部模型" : "All models"}</option>
            <option>{lang === "zh" ? "仅 OpenAI" : "OpenAI only"}</option>
            <option>{lang === "zh" ? "仅 Anthropic" : "Anthropic only"}</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="btn btn-outline" onClick={onClose}>{t("cancel")}</button>
          <button className="btn btn-primary" onClick={() => onCreate({ name, quota })}>{t("create")}</button>
        </div>
      </div>
    </div>
  );
};

/* ============ USAGE ============ */
const UsagePage = ({ t, lang }) => {
  const [range, setRange] = React.useState("7d");
  return (
    <React.Fragment>
      <div className="page-head">
        <div className="grow">
          <div className="eyebrow" style={{ marginBottom: 8 }}>{t("nav_console")} · {t("dash_usage")}</div>
          <h1>{t("usage_title")}</h1>
          <p>{t("usage_sub")}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select className="select" style={{ width: 160 }}>
            <option>{lang === "zh" ? "全部密钥" : "All keys"}</option>
            <option>production-web</option>
            <option>ios-app-beta</option>
          </select>
          <select className="select" style={{ width: 160 }}>
            <option>{lang === "zh" ? "全部模型" : "All models"}</option>
          </select>
          <button className="btn btn-outline btn-sm"><Icon name="refresh" size={14} />{lang === "zh" ? "导出 CSV" : "Export CSV"}</button>
        </div>
      </div>

      {/* Headline numbers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { l: lang === "zh" ? "总调用" : "Total calls", v: "78,895", d: "+18.4%" },
          { l: lang === "zh" ? "总 Tokens" : "Total tokens", v: "12.4M", d: "+22.1%" },
          { l: lang === "zh" ? "总消费" : "Total spend", v: "¥176.23", d: "+19.8%" },
          { l: lang === "zh" ? "缓存节省" : "Cache saved", v: "¥34.18", d: "19% hit" },
        ].map((s, i) => (
          <div key={i} className="card-flat" style={{ padding: 18 }}>
            <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{s.l}</div>
            <div className="num" style={{ fontSize: 26, fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.01em", marginTop: 4 }}>{s.v}</div>
            <div style={{ fontSize: 12, color: "var(--ok)", marginTop: 4 }}>{s.d}</div>
          </div>
        ))}
      </div>

      {/* Range tabs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h3 className="h3">{lang === "zh" ? "调用趋势" : "Calls trend"}</h3>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { id: "7d", l: "7D" },
            { id: "30d", l: "30D" },
            { id: "90d", l: "90D" },
            { id: "custom", l: lang === "zh" ? "自定义" : "Custom" },
          ].map(r => (
            <button key={r.id} className={"chip" + (range === r.id ? " active" : "")} onClick={() => setRange(r.id)}>{r.l}</button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <BigTrendChart />
      </div>

      {/* Per-model breakdown table */}
      <h3 className="h3" style={{ marginBottom: 14 }}>{lang === "zh" ? "按模型聚合" : "By model"}</h3>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr>
              <th>{lang === "zh" ? "模型" : "Model"}</th>
              <th style={{ textAlign: "right" }}>{lang === "zh" ? "调用" : "Calls"}</th>
              <th style={{ textAlign: "right" }}>{lang === "zh" ? "输入 Tokens" : "Input tokens"}</th>
              <th style={{ textAlign: "right" }}>{lang === "zh" ? "输出 Tokens" : "Output tokens"}</th>
              <th style={{ textAlign: "right" }}>{lang === "zh" ? "平均延迟" : "Avg latency"}</th>
              <th style={{ textAlign: "right" }}>{lang === "zh" ? "消费" : "Spend"}</th>
              <th style={{ textAlign: "right" }}>{lang === "zh" ? "占比" : "%"}</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: "claude-sonnet-4.5", family: "anthropic", calls: 28411, in: 8.21e6, out: 1.84e6, lat: 488, spend: 66.92, pct: 38 },
              { id: "gpt-5-mini", family: "openai", calls: 21082, in: 4.12e6, out: 982e3, lat: 312, spend: 45.78, pct: 26 },
              { id: "claude-opus-4.5", family: "anthropic", calls: 9412, in: 1.82e6, out: 412e3, lat: 1098, spend: 31.71, pct: 18 },
              { id: "gpt-5", family: "openai", calls: 12421, in: 2.41e6, out: 612e3, lat: 1814, spend: 21.13, pct: 12 },
              { id: "claude-haiku-4.5", family: "anthropic", calls: 7569, in: 612e3, out: 188e3, lat: 198, spend: 10.69, pct: 6 },
            ].map(m => (
              <tr key={m.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <ModelGlyph family={m.family} size={22} />
                    <span className="mono" style={{ fontSize: 13 }}>{m.id}</span>
                  </div>
                </td>
                <td style={{ textAlign: "right" }}><span className="num">{m.calls.toLocaleString()}</span></td>
                <td style={{ textAlign: "right" }}><span className="num" style={{ color: "var(--ink-2)" }}>{(m.in / 1e6).toFixed(2)}M</span></td>
                <td style={{ textAlign: "right" }}><span className="num" style={{ color: "var(--ink-2)" }}>{(m.out / 1e6).toFixed(2)}M</span></td>
                <td style={{ textAlign: "right" }}><span className="num" style={{ color: m.lat > 1000 ? "var(--warn)" : "var(--ink-2)" }}>{m.lat} ms</span></td>
                <td style={{ textAlign: "right" }}><span className="num" style={{ fontWeight: 500 }}>¥{m.spend.toFixed(2)}</span></td>
                <td style={{ textAlign: "right", minWidth: 120 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="progress" style={{ flex: 1 }}><span style={{ width: m.pct + "%" }} /></div>
                    <span className="num" style={{ fontSize: 12, minWidth: 32 }}>{m.pct}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

const BigTrendChart = () => {
  const data = window.MOCK.TREND_7D;
  const W = 1000, H = 280, PAD = { l: 50, r: 30, t: 20, b: 36 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const maxCost = Math.max(...data.map(d => d.cost));
  const step = innerW / (data.length - 1);
  const pts = data.map((d, i) => [PAD.l + i * step, PAD.t + (1 - d.cost / maxCost) * innerH]);

  // Smooth path
  const smoothPath = (points) => {
    if (points.length < 2) return "";
    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 0; i < points.length - 1; i++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[i + 1];
      const cx1 = x1 + step * 0.4;
      const cx2 = x2 - step * 0.4;
      d += ` C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
    }
    return d;
  };
  const linePath = smoothPath(pts);
  const areaPath = linePath + ` L ${pts[pts.length-1][0]} ${PAD.t + innerH} L ${pts[0][0]} ${PAD.t + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="chart-grid">
        {[0,0.25,0.5,0.75,1].map((p,i) => (
          <line key={i} x1={PAD.l} x2={W-PAD.r} y1={PAD.t + p * innerH} y2={PAD.t + p * innerH} />
        ))}
      </g>
      <g className="chart-axis">
        {[0,0.25,0.5,0.75,1].map((p,i) => (
          <text key={i} x={PAD.l - 10} y={PAD.t + (1-p) * innerH + 3} textAnchor="end">¥{(maxCost*p).toFixed(0)}</text>
        ))}
        {data.map((d, i) => (
          <text key={i} x={PAD.l + i * step} y={H - 12} textAnchor="middle">{d.d}</text>
        ))}
      </g>
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="4" fill="var(--bg-elev)" stroke="var(--accent)" strokeWidth="2" />
          {i === pts.length - 1 && (
            <g>
              <rect x={p[0] - 50} y={p[1] - 38} width="100" height="26" rx="6" fill="var(--ink)" />
              <text x={p[0]} y={p[1] - 21} textAnchor="middle" fill="var(--bg)" fontSize="12" fontFamily="var(--font-mono)">¥34.21</text>
            </g>
          )}
        </g>
      ))}
    </svg>
  );
};

window.KeysPage = KeysPage;
window.UsagePage = UsagePage;
