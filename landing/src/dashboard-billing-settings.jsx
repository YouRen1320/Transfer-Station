// Billing / Recharge & Settings pages

const BillingPage = ({ t, lang }) => {
  const [amount, setAmount] = React.useState(500);
  const [custom, setCustom] = React.useState("");
  const [method, setMethod] = React.useState("wechat");
  const [showPayModal, setShowPayModal] = React.useState(false);

  const bonusFor = (amt) => {
    if (amt >= 5000) return 0.15;
    if (amt >= 1000) return 0.12;
    if (amt >= 500) return 0.10;
    if (amt >= 100) return 0.05;
    return 0;
  };
  const effective = +custom || amount;
  const bonus = effective * bonusFor(effective);

  return (
    <React.Fragment>
      <div className="page-head">
        <div className="grow">
          <div className="eyebrow" style={{ marginBottom: 8 }}>{t("nav_console")} · {t("dash_billing")}</div>
          <h1>{t("billing_title")}</h1>
          <p>{t("billing_sub")}</p>
        </div>
        <button className="btn btn-outline btn-sm"><Icon name="book" size={14} />{lang === "zh" ? "开具发票" : "Invoice"}</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, marginBottom: 36 }}>
        {/* Balance card */}
        <div className="card" style={{ padding: 28, background: "var(--ink)", color: "var(--bg)", borderColor: "var(--ink)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -100, top: -100, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)", opacity: 0.55, pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>{t("billing_balance")}</div>
            <div className="num" style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1 }}>¥1,847.62</div>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 12 }}>
              {lang === "zh" ? "其中赠送额度 ¥187.42 · 按现用量约可用" : "Incl. ¥187.42 bonus · est. usage"} <strong style={{ color: "var(--accent)", opacity: 1 }}>54 {lang === "zh" ? "天" : "days"}</strong>
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 32, paddingTop: 20, borderTop: "1px solid color-mix(in srgb, var(--bg) 12%, transparent)" }}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.6 }}>{lang === "zh" ? "本月消费" : "MTD spend"}</div>
                <div className="num" style={{ fontSize: 19, fontWeight: 600, marginTop: 4 }}>¥176.23</div>
              </div>
              <div>
                <div style={{ fontSize: 12, opacity: 0.6 }}>{lang === "zh" ? "本月调用" : "MTD calls"}</div>
                <div className="num" style={{ fontSize: 19, fontWeight: 600, marginTop: 4 }}>78,895</div>
              </div>
              <div>
                <div style={{ fontSize: 12, opacity: 0.6 }}>{lang === "zh" ? "累计充值" : "Total topped up"}</div>
                <div className="num" style={{ fontSize: 19, fontWeight: 600, marginTop: 4 }}>¥6,800</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick info */}
        <div className="card-flat" style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="eyebrow">{lang === "zh" ? "充值送多少" : "Bonus tiers"}</div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { amt: 100, bonus: 5 },
              { amt: 500, bonus: 10 },
              { amt: 1000, bonus: 12 },
              { amt: 5000, bonus: 15 },
            ].map(b => (
              <div key={b.amt} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--bg-elev)", borderRadius: 8, border: "1px solid var(--line)" }}>
                <span className="num" style={{ fontWeight: 500 }}>¥{b.amt}+</span>
                <span style={{ fontSize: 13.5, color: "var(--ink-3)" }}>{lang === "zh" ? "赠" : "+"} <strong className="num" style={{ color: "var(--accent)" }}>{b.bonus}%</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top-up form */}
      <h2 className="h2" style={{ marginBottom: 14, fontSize: 22 }}>{t("billing_topup")}</h2>
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[50, 100, 500, 1000, 2000, 5000, 10000].map(v => (
            <button key={v} onClick={() => { setAmount(v); setCustom(""); }} className="card-flat" style={{
              padding: 18, textAlign: "left", cursor: "pointer", border: "1px solid",
              borderColor: amount === v && !custom ? "var(--ink)" : "var(--line)",
              background: amount === v && !custom ? "var(--bg-elev)" : "var(--bg-soft)",
              boxShadow: amount === v && !custom ? "var(--shadow-sm)" : "none",
            }}>
              <div className="num" style={{ fontSize: 22, fontWeight: 600, fontFamily: "var(--font-display)" }}>¥{v.toLocaleString()}</div>
              {bonusFor(v) > 0 && <div style={{ fontSize: 12, color: "var(--accent)", marginTop: 4 }}>{lang === "zh" ? "赠" : "+"}¥{(v * bonusFor(v)).toFixed(0)} ({(bonusFor(v) * 100).toFixed(0)}%)</div>}
            </button>
          ))}
          <div className="card-flat" style={{ padding: 18, display: "flex", flexDirection: "column", justifyContent: "center", border: "1px solid", borderColor: custom ? "var(--ink)" : "var(--line)" }}>
            <label style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 4 }}>{t("billing_custom")}</label>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 18, color: "var(--ink-3)" }}>¥</span>
              <input className="num" style={{ border: 0, background: "transparent", fontSize: 22, fontWeight: 600, fontFamily: "var(--font-display)", width: "100%", padding: 0, outline: "none", color: "var(--ink)" }}
                placeholder="0" value={custom} onChange={e => setCustom(e.target.value.replace(/[^0-9]/g, ""))} />
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="eyebrow" style={{ marginBottom: 12 }}>{lang === "zh" ? "支付方式" : "Payment method"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
          {[
            { id: "wechat", label: t("billing_pay_wechat"), icon: "weixin", color: "#1AAD19" },
            { id: "alipay", label: t("billing_pay_alipay"), icon: "alipay", color: "#1677FF" },
            { id: "wire", label: t("billing_pay_card"), icon: "bank", color: "var(--ink)" },
          ].map(p => (
            <button key={p.id} onClick={() => setMethod(p.id)} style={{
              padding: "14px 18px", textAlign: "left", cursor: "pointer", borderRadius: 10,
              border: "1px solid", borderColor: method === p.id ? "var(--ink)" : "var(--line)",
              background: method === p.id ? "var(--bg-soft)" : "var(--bg-elev)",
              display: "flex", alignItems: "center", gap: 12,
              fontFamily: "inherit",
            }}>
              <span style={{ color: p.color }}><Icon name={p.icon} size={22} stroke={1.6} /></span>
              <span style={{ fontWeight: 500, fontSize: 14, color: "var(--ink)" }}>{p.label}</span>
              <span style={{ marginLeft: "auto", width: 16, height: 16, borderRadius: "50%", border: "2px solid", borderColor: method === p.id ? "var(--ink)" : "var(--line-strong)", background: method === p.id ? "var(--ink)" : "transparent", boxShadow: method === p.id ? "inset 0 0 0 3px var(--bg-elev)" : "none" }} />
            </button>
          ))}
        </div>

        {/* Summary */}
        <div style={{ padding: 18, borderRadius: 10, background: "var(--bg-soft)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: "var(--ink-3)" }}>{lang === "zh" ? "支付金额" : "You pay"}</div>
            <div className="num" style={{ fontSize: 28, fontWeight: 600, fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>¥{effective.toLocaleString()}</div>
            {bonus > 0 && <div style={{ fontSize: 13, color: "var(--accent)", marginTop: 4 }}>{lang === "zh" ? "到账" : "Credit"} ¥{(effective + bonus).toLocaleString()} ({lang === "zh" ? "赠" : "+"}¥{bonus.toFixed(0)})</div>}
          </div>
          <button className="btn btn-primary btn-lg" disabled={effective < 1} onClick={() => setShowPayModal(true)} style={{ opacity: effective < 1 ? 0.4 : 1 }}>
            {t("billing_confirm")}<Icon name="arrow_right" size={16} />
          </button>
        </div>
      </div>

      {/* History */}
      <h2 className="h2" style={{ marginTop: 40, marginBottom: 14, fontSize: 22 }}>{t("billing_history")}</h2>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr>
              <th>{lang === "zh" ? "订单号" : "Order"}</th>
              <th>{lang === "zh" ? "日期" : "Date"}</th>
              <th>{lang === "zh" ? "方式" : "Method"}</th>
              <th style={{ textAlign: "right" }}>{lang === "zh" ? "金额" : "Amount"}</th>
              <th style={{ textAlign: "right" }}>{lang === "zh" ? "赠送" : "Bonus"}</th>
              <th>{lang === "zh" ? "状态" : "Status"}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {window.MOCK.TRANSACTIONS.map(tx => (
              <tr key={tx.id}>
                <td><span className="mono" style={{ fontSize: 12, color: "var(--ink-2)" }}>{tx.id}</span></td>
                <td><span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{tx.date}</span></td>
                <td>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                    <Icon name={tx.method === "wechat" ? "weixin" : tx.method === "alipay" ? "alipay" : "bank"} size={15} />
                    {tx.method === "wechat" ? (lang === "zh" ? "微信" : "WeChat") : tx.method === "alipay" ? (lang === "zh" ? "支付宝" : "Alipay") : (lang === "zh" ? "对公" : "Wire")}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}><span className="num" style={{ fontWeight: 500 }}>¥{tx.amount.toLocaleString()}</span></td>
                <td style={{ textAlign: "right" }}><span className="num" style={{ color: "var(--accent)" }}>+¥{tx.bonus}</span></td>
                <td><span className="badge" style={{ color: "var(--ok)" }}><span className="badge-dot" />{lang === "zh" ? "成功" : "Success"}</span></td>
                <td style={{ textAlign: "right" }}><button className="btn btn-ghost btn-sm">{lang === "zh" ? "发票" : "Invoice"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPayModal && <PayModal lang={lang} t={t} amount={effective} method={method} onClose={() => setShowPayModal(false)} />}
    </React.Fragment>
  );
};

const PayModal = ({ lang, t, amount, method, onClose }) => {
  const [paid, setPaid] = React.useState(false);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(20,19,15,0.45)", backdropFilter: "blur(4px)", zIndex: 100, display: "grid", placeItems: "center", padding: 20 }} onClick={onClose}>
      <div className="card" style={{ maxWidth: 420, width: "100%", padding: 28, textAlign: "center", boxShadow: "var(--shadow-lg)" }} onClick={e => e.stopPropagation()}>
        {!paid ? (
          <React.Fragment>
            <h3 className="h2" style={{ marginBottom: 4 }}>
              {method === "wechat" ? (lang === "zh" ? "微信扫码支付" : "Scan with WeChat") : method === "alipay" ? (lang === "zh" ? "支付宝扫码" : "Scan with Alipay") : (lang === "zh" ? "对公转账信息" : "Wire transfer")}
            </h3>
            <p style={{ color: "var(--ink-3)", fontSize: 13.5, marginBottom: 24 }}>
              {lang === "zh" ? "金额" : "Amount"} <strong className="num" style={{ color: "var(--ink)", fontSize: 18 }}>¥{amount.toLocaleString()}</strong>
            </p>
            {method !== "wire" ? (
              <div style={{ width: 220, height: 220, margin: "0 auto", padding: 14, background: "var(--bg-elev)", border: "1px solid var(--line)", borderRadius: 12 }}>
                <QRCodePlaceholder />
              </div>
            ) : (
              <div style={{ textAlign: "left", background: "var(--bg-soft)", padding: 16, borderRadius: 10, fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.9 }}>
                <div><span style={{ color: "var(--ink-3)" }}>{lang === "zh" ? "户名" : "Name"}：</span>北京友谊智能科技有限公司</div>
                <div><span style={{ color: "var(--ink-3)" }}>{lang === "zh" ? "开户行" : "Bank"}：</span>招商银行北京中关村支行</div>
                <div><span style={{ color: "var(--ink-3)" }}>{lang === "zh" ? "账号" : "Account"}：</span>1100 8888 8888 8888</div>
                <div><span style={{ color: "var(--ink-3)" }}>{lang === "zh" ? "备注" : "Memo"}：</span>UID-9F3K2X · ¥{amount}</div>
              </div>
            )}
            <button onClick={() => setPaid(true)} className="btn btn-ghost btn-sm" style={{ marginTop: 18 }}>
              {lang === "zh" ? "（演示用：模拟支付成功）" : "(demo: mark paid)"}
            </button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--gpt-soft)", margin: "0 auto 16px", display: "grid", placeItems: "center", color: "var(--gpt)" }}>
              <Icon name="check" size={32} stroke={2.6} />
            </div>
            <h3 className="h2" style={{ marginBottom: 8 }}>{lang === "zh" ? "支付成功！" : "Payment successful"}</h3>
            <p style={{ color: "var(--ink-3)" }}>{lang === "zh" ? `¥${amount} 已到账，开始写代码吧。` : `¥${amount} credited. Time to ship.`}</p>
            <button className="btn btn-primary" style={{ marginTop: 20, width: "100%" }} onClick={onClose}>{t("confirm")}</button>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

/* ============ SETTINGS ============ */
const SettingsPage = ({ t, lang }) => {
  const [tab, setTab] = React.useState("profile");
  return (
    <React.Fragment>
      <div className="page-head">
        <div className="grow">
          <div className="eyebrow" style={{ marginBottom: 8 }}>{t("nav_console")}</div>
          <h1>{t("settings_title")}</h1>
          <p>{lang === "zh" ? "管理你的账户、安全与团队偏好。" : "Manage your account, security, and team."}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 32 }}>
        <aside>
          {[
            { id: "profile", label: t("settings_profile"), icon: "user" },
            { id: "security", label: t("settings_security"), icon: "shield" },
            { id: "notification", label: t("settings_notification"), icon: "bell" },
            { id: "team", label: t("settings_team"), icon: "user" },
          ].map(s => (
            <a key={s.id} className={"sidebar-link" + (tab === s.id ? " active" : "")} onClick={() => setTab(s.id)} style={{ marginBottom: 2 }}>
              <span className="sidebar-icon"><Icon name={s.icon} size={16} /></span>
              {s.label}
            </a>
          ))}
        </aside>
        <div style={{ minWidth: 0 }}>
          <SettingsContent tab={tab} t={t} lang={lang} />
        </div>
      </div>
    </React.Fragment>
  );
};

const SettingsContent = ({ tab, t, lang }) => {
  if (tab === "profile") return (
    <div className="card" style={{ padding: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--ink)", color: "var(--bg)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 28 }}>YL</div>
        <div>
          <button className="btn btn-outline btn-sm">{lang === "zh" ? "上传头像" : "Upload avatar"}</button>
          <p style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 8, marginBottom: 0 }}>{lang === "zh" ? "JPG / PNG，最大 2MB" : "JPG / PNG, 2MB max"}</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Field label={lang === "zh" ? "昵称" : "Display name"} defaultValue="Yu Long" />
        <Field label={lang === "zh" ? "邮箱" : "Email"} defaultValue="yulong@example.com" />
        <Field label={lang === "zh" ? "手机号" : "Phone"} defaultValue="+86 138-•••-2024" />
        <Field label={lang === "zh" ? "公司 / 团队" : "Company"} defaultValue="Friendly Robots Inc." />
      </div>
      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button className="btn btn-outline">{t("cancel")}</button>
        <button className="btn btn-primary">{t("save")}</button>
      </div>
    </div>
  );
  if (tab === "security") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SettingsRow title={lang === "zh" ? "登录密码" : "Password"} desc={lang === "zh" ? "上次修改于 2026-02-14" : "Last changed 2026-02-14"} action={lang === "zh" ? "修改" : "Change"} />
      <SettingsRow title={lang === "zh" ? "二次验证 (TOTP)" : "2FA (TOTP)"} desc={lang === "zh" ? "已绑定 Authenticator" : "Authenticator bound"} action={lang === "zh" ? "重新绑定" : "Re-bind"} badge={lang === "zh" ? "已开启" : "On"} />
      <SettingsRow title={lang === "zh" ? "登录会话" : "Active sessions"} desc={lang === "zh" ? "当前有 2 个活跃会话 · macOS · iOS" : "2 active sessions · macOS · iOS"} action={lang === "zh" ? "全部登出" : "Revoke all"} />
      <SettingsRow title={lang === "zh" ? "请求日志留存" : "Log retention"} desc={lang === "zh" ? "请求与响应正文保留 30 天" : "Request/response bodies kept 30 days"} action={lang === "zh" ? "立即关闭" : "Disable"} />
      <SettingsRow title={lang === "zh" ? "数据导出" : "Export data"} desc={lang === "zh" ? "导出全部账单与用量数据" : "Download all billing and usage data"} action={lang === "zh" ? "导出" : "Export"} />
    </div>
  );
  if (tab === "notification") return (
    <div className="card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
      {[
        { label: lang === "zh" ? "余额低于 ¥50 时邮件提醒" : "Email when balance < ¥50", on: true },
        { label: lang === "zh" ? "异常流量自动告警" : "Anomaly traffic alert", on: true },
        { label: lang === "zh" ? "每周用量周报" : "Weekly usage summary", on: false },
        { label: lang === "zh" ? "新模型上线通知" : "New model announcements", on: true },
        { label: lang === "zh" ? "营销与活动邮件" : "Marketing emails", on: false },
      ].map((n, i) => (
        <ToggleRow key={i} {...n} />
      ))}
    </div>
  );
  if (tab === "team") return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 className="h3">{lang === "zh" ? "成员 (3)" : "Members (3)"}</h3>
        <button className="btn btn-primary btn-sm"><Icon name="plus" size={14} />{lang === "zh" ? "邀请成员" : "Invite"}</button>
      </div>
      <table className="table">
        <thead><tr>
          <th>{lang === "zh" ? "成员" : "Member"}</th>
          <th>{lang === "zh" ? "角色" : "Role"}</th>
          <th>{lang === "zh" ? "月度配额" : "Monthly quota"}</th>
          <th>{lang === "zh" ? "本月" : "MTD"}</th>
          <th></th>
        </tr></thead>
        <tbody>
          {[
            { n: "Yu Long", e: "yulong@example.com", r: "owner", q: "∞", u: 176.23, c: "#E85A3A" },
            { n: "Tang Lin", e: "tanglin@example.com", r: "admin", q: "¥500", u: 88.42, c: "#3B6E8F" },
            { n: "Mei Wu", e: "mei@example.com", r: "member", q: "¥200", u: 33.12, c: "#7A5E3E" },
          ].map((m, i) => (
            <tr key={i}>
              <td><div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: m.c, color: "#fff", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 12 }}>{m.n.split(" ").map(s => s[0]).join("")}</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{m.n}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{m.e}</div>
                </div>
              </div></td>
              <td><span className="badge" style={{ textTransform: "capitalize" }}>{m.r}</span></td>
              <td><span className="num">{m.q}</span></td>
              <td><span className="num">¥{m.u.toFixed(2)}</span></td>
              <td style={{ textAlign: "right" }}><button className="btn btn-ghost btn-sm">{lang === "zh" ? "编辑" : "Edit"}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  return null;
};

const Field = ({ label, defaultValue }) => (
  <div className="field">
    <label className="field-label">{label}</label>
    <input className="input" defaultValue={defaultValue} />
  </div>
);

const SettingsRow = ({ title, desc, action, badge }) => (
  <div className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>{title}{badge && <span className="badge"><span className="badge-dot" />{badge}</span>}</div>
      <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 3 }}>{desc}</div>
    </div>
    <button className="btn btn-outline btn-sm">{action}</button>
  </div>
);

const ToggleRow = ({ label, on: initial }) => {
  const [on, setOn] = React.useState(initial);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
      <span style={{ fontSize: 14.5 }}>{label}</span>
      <button onClick={() => setOn(!on)} style={{ width: 42, height: 24, borderRadius: 999, border: 0, background: on ? "var(--ink)" : "var(--line-strong)", padding: 0, cursor: "pointer", position: "relative", transition: "background .2s" }}>
        <span style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 20, height: 20, borderRadius: "50%", background: "var(--bg-elev)", transition: "left .2s", boxShadow: "0 1px 2px rgba(0,0,0,0.15)" }} />
      </button>
    </div>
  );
};

window.BillingPage = BillingPage;
window.SettingsPage = SettingsPage;
