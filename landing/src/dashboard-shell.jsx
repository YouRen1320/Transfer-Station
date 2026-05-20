// Dashboard shell with sidebar + chrome
const DashboardShell = ({ t, navigate, route, lang, theme, setTheme, setLang, signedIn, setSignedIn, children }) => {
  const links = [
    { id: "dashboard", label: t("dash_overview"), icon: "grid" },
    { id: "keys", label: t("dash_keys"), icon: "key" },
    { id: "usage", label: t("dash_usage"), icon: "activity" },
    { id: "billing", label: t("dash_billing"), icon: "wallet" },
  ];
  const links2 = [
    { id: "models", label: t("dash_models_d"), icon: "cube" },
    { id: "docs", label: t("dash_docs_d"), icon: "book" },
    { id: "status", label: t("dash_status_d"), icon: "radio" },
  ];
  const links3 = [
    { id: "settings", label: t("dash_settings"), icon: "cog" },
  ];

  const renderLink = (l) => (
    <a key={l.id} className={"sidebar-link" + (route.page === l.id ? " active" : "")} onClick={() => navigate(l.id)}>
      <span className="sidebar-icon"><Icon name={l.icon} size={17} /></span>
      {l.label}
    </a>
  );

  return (
    <div className="app-root">
      <Topbar t={t} route={route} navigate={navigate} theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} signedIn={signedIn} />
      <div className="app-shell">
        <aside className="sidebar">
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {links.map(renderLink)}
          </div>
          <div className="sidebar-section">{lang === "zh" ? "参考" : "Reference"}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {links2.map(renderLink)}
          </div>
          <div className="sidebar-section">{lang === "zh" ? "账号" : "Account"}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {links3.map(renderLink)}
          </div>

          {/* Bottom user card */}
          <div style={{ marginTop: "auto", padding: 10, borderRadius: 10, background: "var(--bg-elev)", border: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--ink)", color: "var(--bg)", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 12, flexShrink: 0 }}>YL</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Yu Long</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>user@example.com</div>
            </div>
            <button className="icon-btn" style={{ width: 28, height: 28 }} title={t("nav_logout")} onClick={() => { setSignedIn(false); navigate("home"); }}>
              <Icon name="arrow_right" size={15} />
            </button>
          </div>
        </aside>
        <div className="main-pane" style={{ background: "var(--bg)" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

window.DashboardShell = DashboardShell;
