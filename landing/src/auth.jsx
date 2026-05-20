// Auth pages: Login & Signup
const _SN = window.SITE?.name || "Transfer-Station";
const AuthPage = ({ mode, t, navigate, setSignedIn, lang }) => {
  const [tab, setTab] = React.useState("password"); // password | wechat
  const [showPw, setShowPw] = React.useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSignedIn(true);
    navigate("dashboard");
  };
  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      {/* Left: form */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 32px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div className="brand" style={{ marginBottom: 36, cursor: "pointer" }} onClick={() => navigate("home")}>
            <Logo />{_SN}
          </div>
          <h1 className="h1" style={{ fontSize: 30, marginBottom: 8 }}>
            {mode === "login" ? t("auth_login_title") : t("auth_signup_title")}
          </h1>
          <p style={{ color: "var(--ink-3)", marginTop: 0, marginBottom: 28 }}>
            {mode === "login"
              ? (lang === "zh" ? "欢迎回来，今天又是写代码的好日子。" : "Welcome back. Let's ship.")
              : (lang === "zh" ? "注册即送 ¥5 体验额度，无需绑卡。" : "¥5 free credit on signup. No card required.")}
          </p>

          {/* Tab switch: password vs wechat */}
          <div style={{ display: "flex", gap: 6, padding: 4, background: "var(--bg-soft)", borderRadius: 10, marginBottom: 22 }}>
            {[
              { id: "password", label: lang === "zh" ? "邮箱 / 密码" : "Email / Password" },
              { id: "wechat", label: lang === "zh" ? "微信扫码" : "WeChat QR" },
            ].map(x => (
              <button key={x.id} onClick={() => setTab(x.id)} style={{
                flex: 1, padding: "8px 12px", border: 0, cursor: "pointer", borderRadius: 7,
                background: tab === x.id ? "var(--bg-elev)" : "transparent",
                boxShadow: tab === x.id ? "var(--shadow-sm)" : "none",
                fontWeight: 500, fontSize: 13.5, color: tab === x.id ? "var(--ink)" : "var(--ink-3)"
              }}>{x.label}</button>
            ))}
          </div>

          {tab === "password" ? (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="field">
                  <label className="field-label">{t("auth_email")}</label>
                  <input className="input" type="email" placeholder="you@example.com" defaultValue="" />
                </div>
                <div className="field">
                  <label className="field-label" style={{ display: "flex", justifyContent: "space-between" }}>
                    {t("auth_password")}
                    {mode === "login" && <a style={{ fontSize: 12, color: "var(--ink-3)", cursor: "pointer" }}>{t("auth_forgot")}</a>}
                  </label>
                  <div style={{ position: "relative" }}>
                    <input className="input" type={showPw ? "text" : "password"} placeholder={lang === "zh" ? "8 位以上" : "8+ characters"} defaultValue={mode === "login" ? "••••••••••" : ""} />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "transparent", border: 0, cursor: "pointer", color: "var(--ink-3)", padding: 6 }}>
                      <Icon name={showPw ? "eye_off" : "eye"} size={16} />
                    </button>
                  </div>
                </div>
                {mode === "login" && (
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--ink-2)" }}>
                    <input type="checkbox" defaultChecked /> {t("auth_remember")}
                  </label>
                )}
                <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 6, width: "100%" }}>
                  {mode === "login" ? t("auth_login_btn") : t("auth_signup_btn")}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0" }}>
              <div style={{ width: 200, height: 200, border: "1px solid var(--line)", borderRadius: 12, padding: 14, background: "var(--bg-elev)", display: "grid", placeItems: "center" }}>
                <QRCodePlaceholder />
              </div>
              <p style={{ marginTop: 16, fontSize: 13, color: "var(--ink-3)", textAlign: "center" }}>
                {lang === "zh" ? "打开微信扫码，关注后即可登录" : "Open WeChat and scan the code"}
              </p>
              <button onClick={handleSubmit} className="btn btn-ghost btn-sm" style={{ marginTop: 12 }}>
                {lang === "zh" ? "（演示用：直接登录）" : "(demo: skip)"}
              </button>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "28px 0 20px" }}>
            <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
            <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{t("auth_or")}</span>
            <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
          </div>

          <button onClick={handleSubmit} className="btn btn-outline" style={{ width: "100%" }}>
            <Icon name="code" size={16} />{t("auth_github")}
          </button>

          <p style={{ textAlign: "center", fontSize: 13.5, color: "var(--ink-3)", marginTop: 26 }}>
            {mode === "login" ? (
              <span>{lang === "zh" ? "还没有账户？" : "No account? "}<a onClick={() => navigate("signup")} style={{ color: "var(--ink)", fontWeight: 500, cursor: "pointer" }}>{lang === "zh" ? "立即注册" : "Sign up"}</a></span>
            ) : (
              <span>{lang === "zh" ? "已有账户？" : "Already have one? "}<a onClick={() => navigate("login")} style={{ color: "var(--ink)", fontWeight: 500, cursor: "pointer" }}>{lang === "zh" ? "登录" : "Sign in"}</a></span>
            )}
          </p>
          {mode === "signup" && (
            <p style={{ textAlign: "center", fontSize: 12, color: "var(--ink-4)", marginTop: 14 }}>{t("auth_terms")}</p>
          )}
        </div>
      </div>

      {/* Right: visual side */}
      <div style={{ background: "var(--ink)", color: "var(--bg)", padding: "48px 56px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 20%, color-mix(in srgb, var(--accent) 50%, transparent) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <span className="eyebrow" style={{ color: "color-mix(in srgb, var(--bg) 60%, transparent)" }}>
            {lang === "zh" ? "12,400+ 开发者的选择" : "Chosen by 12,400+ devs"}
          </span>
        </div>
        <div style={{ position: "relative", maxWidth: 460 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 500, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
            {lang === "zh"
              ? <span>"从 OpenAI 直连切过来之后，<span style={{ color: "var(--accent)" }}>每个月省下两千块</span>，还顺手把 Claude 也跑起来了。"</span>
              : <span>"Switched over and <span style={{ color: "var(--accent)" }}>saved ¥2k/month</span> — and got Claude in the bargain."</span>
            }
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent)", display: "grid", placeItems: "center", fontWeight: 600 }}>K</div>
            <div>
              <div style={{ fontWeight: 500 }}>Kong Ling</div>
              <div style={{ fontSize: 13, opacity: 0.6 }}>{lang === "zh" ? "后端 · 某独角兽" : "Backend · Unicorn co."}</div>
            </div>
          </div>
        </div>
        <div style={{ position: "relative", display: "flex", gap: 28, fontSize: 13, opacity: 0.7 }}>
          <span>© {window.SITE?.year || "2025"} {_SN}</span>
          <a style={{ cursor: "pointer" }}>{lang === "zh" ? "服务条款" : "Terms"}</a>
          <a style={{ cursor: "pointer" }}>{lang === "zh" ? "隐私" : "Privacy"}</a>
        </div>
      </div>
    </div>
  );
};

const QRCodePlaceholder = () => {
  // Stable 21x21 fake QR matrix
  const cells = [];
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 21 * 21; i++) cells.push(rand() > 0.5 ? 1 : 0);
  return (
    <svg viewBox="0 0 21 21" width="100%" height="100%" shapeRendering="crispEdges">
      {cells.map((c, i) => c ? <rect key={i} x={i % 21} y={Math.floor(i / 21)} width="1" height="1" fill="var(--ink)" /> : null)}
      {/* finder patterns */}
      {[[0,0],[14,0],[0,14]].map(([x,y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="7" height="7" fill="var(--ink-elev, var(--bg-elev))" />
          <rect x={x} y={y} width="7" height="7" fill="none" stroke="var(--ink)" strokeWidth="1" />
          <rect x={x+1} y={y+1} width="5" height="5" fill="none" stroke="var(--ink)" strokeWidth="1" />
          <rect x={x+2} y={y+2} width="3" height="3" fill="var(--ink)" />
        </g>
      ))}
      {/* center logo */}
      <rect x="8" y="8" width="5" height="5" fill="var(--bg-elev)" />
      <rect x="9" y="9" width="3" height="3" fill="var(--accent)" />
    </svg>
  );
};

window.AuthPage = AuthPage;
