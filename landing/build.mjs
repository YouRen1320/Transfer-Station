// Transfer-Station 落地页构建
// 把所有 JSX 预编译合并 → dist/bundle.js，生成 production HTML
// 品牌名/域名从 site.config.js 读取
import { build } from 'esbuild';
import { readFile, writeFile, mkdir, rm, copyFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = ROOT;
const DIST = join(ROOT, 'dist');

// 从 site.config.js 读取配置
let SITE = {};
try {
  const configSrc = await readFile(join(SRC, 'site.config.js'), 'utf8');
  const _window = {};
  new Function('window', configSrc)(_window);
  SITE = _window.SITE || {};
} catch (err) {
  console.error('✗ 无法解析 site.config.js:', err.message);
  console.error('  请检查 site.config.js 语法是否正确');
  process.exit(1);
}

const BRAND = SITE.name || 'Transfer-Station';
const DOMAIN = SITE.domain || 'example.com';

if (DOMAIN === 'example.com') {
  console.warn('⚠ site.config.js 中的 domain 仍为 example.com，请修改为你的实际域名');
}

// 脚本编译顺序（语义依赖，不能乱）
const SCRIPT_ORDER = [
  'site.config.js',              // window.SITE — 必须第一个
  'tweaks-panel.jsx',            // useTweaks / TweaksPanel
  'src/i18n.js',                 // window.I18N
  'src/data.js',                 // window.MOCK
  'src/icons.jsx',               // window.Icon
  'src/shell.jsx',               // window.Topbar / Footer / PublicShell / Logo / ModelGlyph
  'src/landing.jsx',             // window.Landing
  'src/public-pages.jsx',        // window.ModelsPage / PricingPage / DocsPage / StatusPage
  'src/auth.jsx',                // window.AuthPage
  'src/dashboard-shell.jsx',     // window.DashboardShell
  'src/dashboard-overview.jsx',  // window.DashboardOverview
  'src/dashboard-keys-usage.jsx',
  'src/dashboard-billing-settings.jsx',
  'src/chat.jsx',
  'src/app.jsx',                 // 主入口
];

async function compileOne(rel) {
  const file = join(SRC, rel);
  if (!existsSync(file)) {
    console.error(`✗ 文件不存在: ${rel}`);
    process.exit(1);
  }
  const result = await build({
    entryPoints: [file],
    bundle: false,
    write: false,
    format: 'iife',
    target: 'es2020',
    loader: { '.jsx': 'jsx', '.js': 'js' },
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    minify: true,
    legalComments: 'none',
  });
  return result.outputFiles[0].text;
}

async function main() {
  console.log(`▶ building ${BRAND} landing page…`);
  if (existsSync(DIST)) await rm(DIST, { recursive: true });
  await mkdir(DIST, { recursive: true });

  const parts = [];
  for (const rel of SCRIPT_ORDER) {
    const out = await compileOne(rel);
    parts.push(`/* ── ${rel} ── */\n${out}`);
  }
  const banner = `/* ${DOMAIN} bundle — built ${new Date().toISOString()} */\n`;
  const wrapper = banner + parts.join('\n') + '\n';

  await writeFile(join(DIST, 'bundle.js'), wrapper);
  const bundleSize = (await stat(join(DIST, 'bundle.js'))).size;
  console.log(`  bundle.js: ${(bundleSize / 1024).toFixed(1)} KB`);

  await copyFile(join(SRC, 'styles.css'), join(DIST, 'styles.css'));
  if (existsSync(join(SRC, 'og.svg'))) {
    await copyFile(join(SRC, 'og.svg'), join(DIST, 'og.svg'));
  }

  // production index.html — 品牌/域名从配置读取
  const htmlOut = `<!doctype html>
<html lang="zh-CN" data-theme="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${BRAND} · AI API Gateway</title>
  <meta name="description" content="${BRAND} — GPT, Claude, Gemini API gateway. Per-token billing, OpenAI-compatible." />
  <meta name="theme-color" content="#E85A3A" />
  <meta property="og:title" content="${BRAND} · AI API Gateway" />
  <meta property="og:description" content="GPT, Claude, Gemini — one key, one gateway. Per-token billing." />
  <meta property="og:url" content="https://${DOMAIN}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://${DOMAIN}/og.svg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="https://${DOMAIN}/og.svg" />
  <link rel="canonical" href="https://${DOMAIN}/" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://${DOMAIN}/#org",
        "name": "${BRAND}",
        "url": "https://${DOMAIN}",
        "logo": "https://${DOMAIN}/favicon.svg",
        "description": "AI API gateway with per-token billing."
      },
      {
        "@type": "WebSite",
        "name": "${BRAND}",
        "url": "https://${DOMAIN}",
        "inLanguage": ["zh-CN", "en"]
      }
    ]
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <div id="root"></div>

  <script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
  <script src="/bundle.js"></script>
</body>
</html>
`;
  await writeFile(join(DIST, 'index.html'), htmlOut);

  // favicon — 品牌首字母
  const initial = BRAND.charAt(0).toLowerCase();
  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#14130F"/><circle cx="9" cy="6" r="14" fill="#E85A3A" opacity="0.85"/><text x="16" y="22" font-family="Space Grotesk, system-ui" font-size="20" font-weight="700" text-anchor="middle" fill="#FAF8F4">${initial}</text></svg>`;
  await writeFile(join(DIST, 'favicon.svg'), favicon);

  // 404
  const notFound = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><title>404 · ${BRAND}</title><link rel="stylesheet" href="/styles.css"/></head><body style="display:grid;place-items:center;min-height:100vh;background:var(--bg);"><div style="text-align:center;padding:40px"><div style="font-family:var(--font-display);font-size:96px;font-weight:600;color:var(--accent);line-height:1">404</div><div style="font-size:18px;color:var(--ink-2);margin-top:12px">Page not found</div><a href="/" style="display:inline-block;margin-top:24px;padding:10px 20px;background:var(--ink);color:var(--bg);border-radius:8px;text-decoration:none">Home</a></div></body></html>`;
  await writeFile(join(DIST, '404.html'), notFound);

  // robots + sitemap
  await writeFile(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://${DOMAIN}/sitemap.xml\n`);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://${DOMAIN}/</loc><priority>1.0</priority></url>
  <url><loc>https://${DOMAIN}/#models</loc><priority>0.8</priority></url>
  <url><loc>https://${DOMAIN}/#pricing</loc><priority>0.9</priority></url>
  <url><loc>https://${DOMAIN}/#docs</loc><priority>0.7</priority></url>
  <url><loc>https://${DOMAIN}/#status</loc><priority>0.5</priority></url>
</urlset>
`;
  await writeFile(join(DIST, 'sitemap.xml'), sitemap);

  console.log('✓ build done →', DIST);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
