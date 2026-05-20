// Main app shell - routing, state, Tweaks
const { useState, useEffect, useMemo } = React;

const PUBLIC_PAGES = ["home", "models", "pricing", "docs", "status"];
const AUTH_PAGES = ["login", "signup"];
const DASH_PAGES = ["dashboard", "keys", "usage", "billing", "settings"];
const APP_PAGES = ["chat"];

const App = () => {
  // Tweaks
  const t_def = /*EDITMODE-BEGIN*/{
    "accent": "#E85A3A",
    "dark": false,
    "density": "comfortable"
  }/*EDITMODE-END*/;
  const [tweaks, setTweak] = useTweaks(t_def);

  // Route
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    return { page: hash || "home" };
  });

  // Auth
  const [signedIn, setSignedIn] = useState(false);

  // Lang
  const [lang, setLang] = useState(() => localStorage.getItem("fa_lang") || "zh");
  useEffect(() => { localStorage.setItem("fa_lang", lang); }, [lang]);
  const t = (k) => (window.I18N[lang] && window.I18N[lang][k]) || k;

  // Theme
  const theme = tweaks.dark ? "dark" : "light";
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty("--accent", tweaks.accent);
    document.documentElement.style.setProperty("--density", tweaks.density === "compact" ? "0.94" : "1");
  }, [theme, tweaks.accent, tweaks.density]);

  // Hash sync
  useEffect(() => {
    const onHash = () => setRoute({ page: window.location.hash.replace("#", "") || "home" });
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // 实际客户的注册/登录走 Sub2API,不要在我们 SPA 里 mock。
  // dashboard/chat/billing/keys/usage/settings 这些"已登录后"的页面也直接跳 Sub2API 控制台。
  // 留在本站内的:home/models/pricing/docs/status —— 纯展示。
  // 外跳地址从 site.config.js 读取域名
  const _api = window.SITE?.apiDomain || ("api." + (window.SITE?.domain || "example.com"));
  const _chat = window.SITE?.chatDomain;
  const EXTERNAL_ROUTES = {
    login:     "https://" + _api + "/login",
    signup:    "https://" + _api + "/register",
    dashboard: "https://" + _api + "/",
    keys:      "https://" + _api + "/console/keys",
    usage:     "https://" + _api + "/console/usage",
    billing:   "https://" + _api + "/console/billing",
    settings:  "https://" + _api + "/console/settings",
    ...(_chat ? { chat: "https://" + _chat + "/" } : {}),
  };
  const navigate = (page) => {
    const ext = EXTERNAL_ROUTES[page];
    if (ext) {
      window.location.href = ext;
      return;
    }
    window.location.hash = page;
    setRoute({ page });
    window.scrollTo(0, 0);
  };

  const commonProps = { t, navigate, route, lang, setLang, theme, setTheme: (m) => setTweak("dark", m === "dark"), signedIn, setSignedIn };

  // Render
  const page = route.page;

  if (AUTH_PAGES.includes(page)) {
    return (
      <React.Fragment>
        <AuthPage mode={page} {...commonProps} />
        <TweaksUI tweaks={tweaks} setTweak={setTweak} lang={lang} />
      </React.Fragment>
    );
  }

  if (DASH_PAGES.includes(page)) {
    return (
      <React.Fragment>
        <DashboardShell {...commonProps}>
          <PageBody page={page} {...commonProps} />
        </DashboardShell>
        <TweaksUI tweaks={tweaks} setTweak={setTweak} lang={lang} />
      </React.Fragment>
    );
  }

  if (APP_PAGES.includes(page)) {
    return (
      <React.Fragment>
        <div data-screen-label="Chat" className="fade-in" key={page}>
          <ChatPage {...commonProps} />
        </div>
        <TweaksUI tweaks={tweaks} setTweak={setTweak} lang={lang} />
      </React.Fragment>
    );
  }

  // Public page (with topbar + footer)
  return (
    <React.Fragment>
      <PublicShell {...commonProps}>
        <PageBody page={page} {...commonProps} />
      </PublicShell>
      <TweaksUI tweaks={tweaks} setTweak={setTweak} lang={lang} />
    </React.Fragment>
  );
};

const PageBody = ({ page, ...props }) => {
  // Set data-screen-label for context
  const label = useMemo(() => {
    const labels = { home: "Landing", models: "Models", pricing: "Pricing", docs: "Docs", status: "Status", dashboard: "Dashboard", keys: "API Keys", usage: "Usage", billing: "Billing", settings: "Settings" };
    return labels[page] || page;
  }, [page]);

  let content;
  switch (page) {
    case "home": content = <Landing {...props} />; break;
    case "models": content = <ModelsPage {...props} />; break;
    case "pricing": content = <PricingPage {...props} />; break;
    case "docs": content = <DocsPage {...props} />; break;
    case "status": content = <StatusPage {...props} />; break;
    case "dashboard": content = <DashboardOverview {...props} />; break;
    case "keys": content = <KeysPage {...props} />; break;
    case "usage": content = <UsagePage {...props} />; break;
    case "billing": content = <BillingPage {...props} />; break;
    case "settings": content = <SettingsPage {...props} />; break;
    default: content = <Landing {...props} />;
  }
  return <div data-screen-label={label} className="fade-in" key={page}>{content}</div>;
};

const TweaksUI = ({ tweaks, setTweak, lang }) => {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label={lang === "zh" ? "外观" : "Appearance"}>
        <TweakToggle label={lang === "zh" ? "暗色模式" : "Dark mode"} value={tweaks.dark} onChange={v => setTweak("dark", v)} />
        <TweakColor label={lang === "zh" ? "强调色" : "Accent color"} value={tweaks.accent} onChange={v => setTweak("accent", v)} options={["#E85A3A","#D97757","#0E7C66","#3B6E8F","#B85C8C","#6E5DA8"]} />
        <TweakRadio label={lang === "zh" ? "密度" : "Density"} value={tweaks.density} onChange={v => setTweak("density", v)} options={[
          { value: "comfortable", label: lang === "zh" ? "舒适" : "Comfy" },
          { value: "compact", label: lang === "zh" ? "紧凑" : "Compact" },
        ]} />
      </TweakSection>
    </TweaksPanel>
  );
};

// Mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
