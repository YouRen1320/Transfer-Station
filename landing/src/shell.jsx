// Shared components: Topbar, Footer, ModelGlyph, Logo

const Logo = ({ size = 28 }) => (
  <div className="brand-mark" style={{ width: size, height: size, borderRadius: size * 0.28, fontSize: size * 0.54 }}>
    <span>f</span>
  </div>
);

// Compact monogram for model families
const ModelGlyph = ({ family, size = 22 }) => {
  const m = {
    openai: { bg: "var(--gpt-soft)", fg: "var(--gpt)", label: "G" },
    anthropic: { bg: "var(--claude-soft)", fg: "var(--claude)", label: "C" },
    google: { bg: "var(--google-soft)", fg: "var(--google)", label: "✦" },
  }[family] || { bg: "var(--bg-soft)", fg: "var(--ink-3)", label: "·" };
  return (
    <div style={{ width: size, height: size, borderRadius: 6, background: m.bg, color: m.fg, display: "grid", placeItems: "center", fontSize: size * 0.5, fontWeight: 600, fontFamily: "var(--font-display)" }}>{m.label}</div>
  );
};

const Topbar = ({ t, route, navigate, theme, setTheme, lang, setLang, signedIn }) => {
  const links = [
    { id: "home", label: t("nav_home") },
    { id: "models", label: t("nav_models") },
    { id: "pricing", label: t("nav_pricing") },
    { id: "docs", label: t("nav_docs") },
    { id: "status", label: t("nav_status") },
  ];
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <div className="brand" onClick={() => navigate("home")} style={{ cursor: "pointer" }}>
          <Logo />
          {window.SITE?.name || "Transfer-Station"}
        </div>
        <nav className="nav-links">
          {links.map(l => (
            <a key={l.id} className={"nav-link" + (route.page === l.id ? " active" : "")} onClick={() => navigate(l.id)}>{l.label}</a>
          ))}
        </nav>
        <div className="topbar-right">
          <button className="icon-btn" onClick={() => setLang(lang === "zh" ? "en" : "zh")} title="Language">
            <Icon name="globe" />
          </button>
          <button className="icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} title="Theme">
            <Icon name={theme === "light" ? "moon" : "sun"} />
          </button>
          {signedIn ? (
            <React.Fragment>
              <button className="btn btn-primary btn-sm" onClick={() => navigate("chat")} style={{ gap: 6 }}>
                <Icon name="chat" size={14} stroke={2} />{t("nav_chat")}
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 999, background: "var(--bg-soft)", border: "1px solid var(--line)", fontSize: 12.5, marginLeft: 6 }}>
                <span style={{ color: "var(--ink-3)" }}>¥</span><span className="num" style={{ fontWeight: 600 }}>187.42</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate("dashboard")}>{t("nav_console")}</button>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--ink)", color: "var(--bg)", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 12, marginLeft: 4 }}>余</div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate("login")}>{t("nav_login")}</button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate("chat")} style={{ gap: 6 }}>
                <Icon name="chat" size={14} stroke={2} />{t("nav_chat")}
              </button>
            </React.Fragment>
          )}
        </div>
      </div>
    </header>
  );
};

const Footer = ({ t, navigate, lang }) => {
  const cols = [
    { brand: true },
    { title: lang === "zh" ? "产品" : "Product", links: [
      { label: t("nav_models"), id: "models" },
      { label: t("nav_pricing"), id: "pricing" },
      { label: t("nav_docs"), id: "docs" },
      { label: t("nav_status"), id: "status" },
    ]},
    { title: lang === "zh" ? "公司" : "Company", links: [
      { label: lang === "zh" ? "关于" : "About", id: "home" },
      { label: lang === "zh" ? "联系销售" : "Contact sales", id: "pricing" },
      { label: lang === "zh" ? "招聘" : "Careers", id: "home" },
    ]},
    { title: lang === "zh" ? "资源" : "Resources", links: [
      { label: lang === "zh" ? "更新日志" : "Changelog", id: "status" },
      { label: lang === "zh" ? "迁移指南" : "Migration guide", id: "docs" },
      { label: lang === "zh" ? "Cookbook" : "Cookbook", id: "docs" },
    ]},
    { title: lang === "zh" ? "法律" : "Legal", links: [
      { label: lang === "zh" ? "服务条款" : "Terms", id: "home" },
      { label: lang === "zh" ? "隐私政策" : "Privacy", id: "home" },
      { label: "DPA", id: "home" },
    ]},
  ];
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="brand" style={{ marginBottom: 14 }}>
              <Logo />
              {window.SITE?.name || "Transfer-Station"}
            </div>
            <p style={{ fontSize: 13.5, color: "var(--ink-3)", margin: 0, maxWidth: 280 }}>
              {lang === "zh"
                ? "GPT 与 Claude 的一站式 API 中转。把基础设施交给我们，把时间留给你的产品。"
                : "One gateway for GPT and Claude. Skip the plumbing — ship faster."}
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <span className="badge"><span className="live-dot" style={{ margin: 0 }} />{lang === "zh" ? "全部系统正常" : "All systems normal"}</span>
            </div>
          </div>
          {cols.slice(1).map((c, i) => (
            <div key={i} className="footer-col">
              <h4>{c.title}</h4>
              <ul>
                {c.links.map((l, j) => <li key={j}><a onClick={() => navigate(l.id)}>{l.label}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div>© {window.SITE?.year || "2025"} {window.SITE?.name || "Transfer-Station"} · {lang === "zh" ? "由开发者，为开发者" : "By devs, for devs"}</div>
          <div style={{ display: "flex", gap: 16 }}>
            <span>{lang === "zh" ? "京 ICP 备 2026000000 号" : "v3.2.1"}</span>
            <span className="mono" style={{ fontSize: 12 }}>build 2026.05.13</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Public page wrapper (Topbar + content + Footer)
const PublicShell = ({ children, ...props }) => (
  <div className="app-root">
    <Topbar {...props} />
    <main style={{ flex: 1 }}>{children}</main>
    <Footer t={props.t} navigate={props.navigate} lang={props.lang} />
  </div>
);

window.Logo = Logo;
window.ModelGlyph = ModelGlyph;
window.Topbar = Topbar;
window.Footer = Footer;
window.PublicShell = PublicShell;
