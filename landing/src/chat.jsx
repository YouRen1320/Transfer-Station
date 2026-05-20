// Chat workbench — full-bleed sidebar + canvas, mirrors the in-app feel
const { useState: useStateChat, useRef: useRefChat, useEffect: useEffectChat } = React;

const ChatPage = ({ t, navigate, lang, setLang, signedIn }) => {
  const [activeNav, setActiveNav] = useStateChat("new");
  const [model, setModel] = useStateChat("gpt-5");
  const [modelOpen, setModelOpen] = useStateChat(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useStateChat(false);
  const [messages, setMessages] = useStateChat([]); // {role, text, model}
  const [input, setInput] = useStateChat("");
  const [streaming, setStreaming] = useStateChat(false);
  const [conversations, setConversations] = useStateChat([
    { id: "c1", title: lang === "zh" ? "TypeScript 防抖函数" : "TS debounce", time: lang === "zh" ? "刚刚" : "just now", pinned: true },
    { id: "c2", title: lang === "zh" ? "周末读书笔记整理" : "Weekend reading notes", time: lang === "zh" ? "今天" : "today" },
    { id: "c3", title: lang === "zh" ? "Mermaid 架构图示例" : "Mermaid diagram", time: lang === "zh" ? "今天" : "today" },
    { id: "c4", title: lang === "zh" ? "" + (window.SITE?.name || "Transfer-Station") + " 文档翻译" : "" + (window.SITE?.name || "Transfer-Station") + " docs translation", time: lang === "zh" ? "昨天" : "yesterday" },
    { id: "c5", title: lang === "zh" ? "数据分析报告大纲" : "Data report outline", time: "5/10" },
    { id: "c6", title: lang === "zh" ? "Python 多线程教学" : "Python threading tutor", time: "5/9" },
  ]);
  const [activeConv, setActiveConv] = useStateChat(null);
  const scrollRef = useRefChat(null);

  const navItems = [
    { id: "new", label_zh: "新的聊天", label_en: "New chat", icon: "edit" },
    { id: "image", label_zh: "图片", label_en: "Images", icon: "image" },
    { id: "code", label_zh: "AI 编程", label_en: "Code (CLI)", icon: "terminal", badge: "Code" },
    { id: "store", label_zh: "应用商店", label_en: "Apps", icon: "store" },
    { id: "notice", label_zh: "公告", label_en: "Updates", icon: "megaphone", dot: true },
    { id: "settings", label_zh: "设置", label_en: "Settings", icon: "cog" },
  ];

  const allModels = window.MOCK.MODELS.filter(m => m.use === "chat");
  const cur = allModels.find(m => m.id === model) || allModels[0];

  // Prompt suggestion chips — 3 rows, marquee
  const promptRows = [
    [
      { emoji: "📚", label_zh: "学习辅导", label_en: "Study help" },
      { emoji: "💼", label_zh: "工作助手", label_en: "Work tasks" },
      { emoji: "🎨", label_zh: "设计灵感", label_en: "Design ideas" },
      { emoji: "💻", label_zh: "编程帮助", label_en: "Coding" },
      { emoji: "📝", label_zh: "文档整理", label_en: "Doc cleanup" },
      { emoji: "⭐", label_zh: "问题解答", label_en: "Q&A" },
      { emoji: "💡", label_zh: "创意写作", label_en: "Creative writing" },
      { emoji: "🔍", label_zh: "数据分析", label_en: "Data analysis" },
      { emoji: "📖", label_zh: "翻译", label_en: "Translate" },
    ],
    [
      { emoji: "🌐", label_zh: "知识探索", label_en: "Explore" },
      { emoji: "🚀", label_zh: "项目规划", label_en: "Plan a project" },
      { emoji: "📊", label_zh: "报告生成", label_en: "Reports" },
      { emoji: "🎯", label_zh: "目标制定", label_en: "Set goals" },
      { emoji: "🔬", label_zh: "研究分析", label_en: "Research" },
      { emoji: "🖥️", label_zh: "技术咨询", label_en: "Tech advice" },
      { emoji: "📈", label_zh: "数据可视化", label_en: "Visualize" },
      { emoji: "🎪", label_zh: "娱乐互动", label_en: "Fun" },
      { emoji: "✏️", label_zh: "润色文章", label_en: "Polish writing" },
    ],
    [
      { emoji: "✈️", label_zh: "旅行攻略", label_en: "Travel" },
      { emoji: "🏋️", label_zh: "运动健身", label_en: "Fitness" },
      { emoji: "💰", label_zh: "理财建议", label_en: "Finance" },
      { emoji: "🎵", label_zh: "音乐推荐", label_en: "Music" },
      { emoji: "🎬", label_zh: "影视解读", label_en: "Film notes" },
      { emoji: "🌱", label_zh: "生活妙招", label_en: "Life hacks" },
      { emoji: "🧘", label_zh: "健康养生", label_en: "Wellness" },
      { emoji: "🍜", label_zh: "美食烹饪", label_en: "Cooking" },
      { emoji: "🎲", label_zh: "推荐游戏", label_en: "Games" },
    ],
  ];

  const sendMessage = (text) => {
    if (!text.trim() || streaming) return;
    const userMsg = { role: "user", text, model };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setStreaming(true);

    // Fake assistant response (mocked, never actually calls Claude)
    const responses = {
      zh: [
        "好的，我来帮你处理。给我一点时间组织一下：\n\n这个问题的核心在于**理解上下文**与**确定边界**。具体来说：\n\n1. 先明确目标和限制条件\n2. 拆解为更小的子问题\n3. 逐个解决并验证\n\n你想从哪一步开始？",
        "这是一个很好的问题。让我从几个角度展开：\n\n**角度一：本质**\n问题的本质往往隐藏在表象之下，需要你抽丝剥茧。\n\n**角度二：方案**\n基于你提供的信息，我建议先做一份原型，验证假设。\n\n如果你愿意，我可以帮你写一份具体的方案。",
        "这件事我可以分步骤帮你完成。\n\n第一步：收集所有相关信息\n第二步：整理成结构化文档\n第三步：与现有方案对比\n第四步：给出建议\n\n你希望先做哪一步？",
      ],
      en: [
        "Got it — let me think this through.\n\nThe core of the question is about **context** and **constraints**. Here's how I'd approach it:\n\n1. Clarify goals and limits\n2. Decompose into sub-problems\n3. Solve and verify each\n\nWhich step do you want to start with?",
        "Great question. Let me unpack it from a few angles:\n\n**Angle 1 — essence**\nThe truth is usually under the surface. Strip the layers.\n\n**Angle 2 — solution**\nGiven what you shared, I'd prototype first, validate assumptions next.\n\nHappy to draft a concrete plan if you'd like.",
        "I can break this into steps:\n\n1. Gather all related info\n2. Structure it as a doc\n3. Compare with existing approaches\n4. Recommend a path\n\nWhich one shall we start with?",
      ]
    };
    const pool = responses[lang] || responses.en;
    const reply = pool[Math.floor(Math.random() * pool.length)];

    // Token-by-token reveal
    let i = 0;
    setMessages(m => [...m, { role: "assistant", text: "", model, thinking: true }]);
    const interval = setInterval(() => {
      i += Math.max(1, Math.floor(Math.random() * 4));
      if (i >= reply.length) {
        i = reply.length;
        clearInterval(interval);
        setStreaming(false);
      }
      setMessages(m => {
        const copy = [...m];
        copy[copy.length - 1] = { ...copy[copy.length - 1], text: reply.slice(0, i), thinking: false };
        return copy;
      });
    }, 22);
  };

  useEffectChat(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div className="chat-root" style={{ display: "flex", height: "100vh", background: "var(--bg)", color: "var(--ink)" }}>
      {/* === SIDEBAR === */}
      <aside style={{ width: sidebarCollapsed ? 68 : 264, flexShrink: 0, borderRight: "1px solid var(--line)", background: "var(--bg-soft)", display: "flex", flexDirection: "column", transition: "width 200ms ease" }}>
        {/* brand + collapse */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: sidebarCollapsed ? "18px 16px" : "18px 18px", borderBottom: "1px solid var(--line)" }}>
          {!sidebarCollapsed && <div className="brand" onClick={() => navigate("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17 }}><Logo size={24} />{window.SITE?.name || "Transfer-Station"}</div>}
          <button className="icon-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ marginLeft: sidebarCollapsed ? 0 : "auto" }} title="Toggle sidebar"><Icon name="sidebar" size={18} /></button>
        </div>

        {/* primary nav */}
        <div style={{ padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(n => {
            const active = activeNav === n.id;
            return (
              <button key={n.id} onClick={() => setActiveNav(n.id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: sidebarCollapsed ? "10px" : "9px 12px",
                background: active ? "var(--bg-elev)" : "transparent", border: "1px solid " + (active ? "var(--line)" : "transparent"),
                borderRadius: 8, color: active ? "var(--ink)" : "var(--ink-2)", fontSize: 14, fontWeight: active ? 500 : 400, cursor: "pointer",
                position: "relative", justifyContent: sidebarCollapsed ? "center" : "flex-start"
              }}>
                <Icon name={n.icon} size={17} stroke={active ? 2 : 1.7} />
                {!sidebarCollapsed && <span style={{ flex: 1, textAlign: "left" }}>{lang === "zh" ? n.label_zh : n.label_en}</span>}
                {!sidebarCollapsed && n.badge && <span style={{ fontSize: 10, padding: "1px 6px", background: "var(--accent)", color: "#fff", borderRadius: 4, fontFamily: "var(--font-mono)" }}>{n.badge}</span>}
                {n.dot && <span style={{ position: "absolute", top: 8, right: sidebarCollapsed ? 14 : 10, width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />}
              </button>
            );
          })}
        </div>

        {!sidebarCollapsed && (
          <React.Fragment>
            {/* projects collapsible */}
            <div style={{ padding: "8px 14px 4px", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>{lang === "zh" ? "项目" : "Projects"}</span>
              <button className="icon-btn" style={{ width: 22, height: 22 }} title={lang === "zh" ? "新建" : "New"}><Icon name="plus" size={13} /></button>
            </div>
            <div style={{ padding: "0 10px", display: "flex", flexDirection: "column", gap: 1 }}>
              {[{ name: lang === "zh" ? "📁 工作笔记" : "📁 Work notes" }, { name: lang === "zh" ? "📁 AI 学习" : "📁 AI Studies" }].map((p, i) => (
                <button key={i} style={{ padding: "7px 12px", textAlign: "left", background: "transparent", border: 0, color: "var(--ink-2)", fontSize: 13, borderRadius: 6, cursor: "pointer" }}>{p.name}</button>
              ))}
            </div>

            {/* conversation history */}
            <div style={{ padding: "16px 14px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>{lang === "zh" ? "对话记录" : "Conversations"}</span>
            </div>
            <div style={{ padding: "0 10px", display: "flex", flexDirection: "column", gap: 1, overflowY: "auto", flex: 1, minHeight: 0 }}>
              {conversations.map(c => (
                <button key={c.id} onClick={() => setActiveConv(c.id)} style={{
                  padding: "8px 12px", textAlign: "left", background: activeConv === c.id ? "var(--bg-elev)" : "transparent",
                  border: "1px solid " + (activeConv === c.id ? "var(--line)" : "transparent"),
                  borderRadius: 6, cursor: "pointer", display: "flex", flexDirection: "column", gap: 2
                }}>
                  <span style={{ fontSize: 13, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.pinned && <span style={{ color: "var(--accent)", marginRight: 4 }}>★</span>}
                    {c.title}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{c.time}</span>
                </button>
              ))}
            </div>
          </React.Fragment>
        )}

        {/* user */}
        <div style={{ borderTop: "1px solid var(--line)", padding: sidebarCollapsed ? "12px" : "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--ink)", color: "var(--bg)", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 12, flexShrink: 0 }}>余</div>
          {!sidebarCollapsed && (
            <React.Fragment>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>yu_long</div>
                <div style={{ fontSize: 11, color: "var(--ink-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>user@example.com</div>
              </div>
              <button className="icon-btn" onClick={() => navigate("dashboard")} title={lang === "zh" ? "控制台" : "Console"}><Icon name="chevron_right" size={14} /></button>
            </React.Fragment>
          )}
        </div>
      </aside>

      {/* === MAIN === */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* topbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", borderBottom: "1px solid var(--line)", background: "var(--bg)" }}>
          {/* model picker */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setModelOpen(!modelOpen)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "var(--bg-soft)", border: "1px solid var(--line)", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
              <ModelGlyph family={cur.family} size={20} />
              <span>{cur.name}</span>
              <Icon name="chevron_down" size={14} stroke={2} />
            </button>
            {modelOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, width: 340, background: "var(--bg-elev)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "var(--shadow-lg)", zIndex: 30, padding: 6, maxHeight: 460, overflowY: "auto" }}>
                {allModels.map(m => (
                  <div key={m.id} onClick={() => { setModel(m.id); setModelOpen(false); }} style={{ padding: "10px 12px", display: "flex", alignItems: "flex-start", gap: 12, borderRadius: 8, cursor: "pointer", background: m.id === model ? "var(--bg-soft)" : "transparent" }}>
                    <ModelGlyph family={m.family} size={26} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 500 }}>{m.name}</span>
                        {m.tag && <span className={"badge " + (m.family === "openai" ? "badge-gpt" : m.family === "anthropic" ? "badge-claude" : "badge-google")} style={{ fontSize: 10 }}>{m.tag}</span>}
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 3, lineHeight: 1.4 }}>{lang === "zh" ? m.desc_zh : m.desc_en}</div>
                      <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 5 }}>¥{m.in.toFixed(2)} / ¥{m.out.toFixed(2)} <span style={{ color: "var(--ink-4)" }}>· {m.ctx}</span></div>
                    </div>
                    {m.id === model && <Icon name="check" size={16} stroke={2.5} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setLang(lang === "zh" ? "en" : "zh")}><Icon name="globe" size={14} />{lang === "zh" ? "EN" : "中"}</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("pricing")} style={{ gap: 6 }}><Icon name="spark" size={13} />{lang === "zh" ? "升级 Plus" : "Upgrade"}</button>
          </div>
        </div>

        {/* canvas */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "0 28px", position: "relative" }}>
          {isEmpty ? (
            <ChatWelcome lang={lang} promptRows={promptRows} onPick={sendMessage} />
          ) : (
            <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 0 120px", display: "flex", flexDirection: "column", gap: 28 }}>
              {messages.map((msg, i) => <Message key={i} msg={msg} lang={lang} cur={cur} />)}
              {streaming && <div style={{ fontSize: 12, color: "var(--ink-3)", textAlign: "center", marginTop: -16 }}><span className="live-dot" style={{ background: "var(--accent)" }} />{lang === "zh" ? "正在生成…" : "Generating…"}</div>}
            </div>
          )}
        </div>

        {/* composer */}
        <div style={{ padding: "14px 28px 22px", background: "var(--bg)", borderTop: isEmpty ? "none" : "1px solid var(--line)" }}>
          <Composer lang={lang} value={input} setValue={setInput} onSend={() => sendMessage(input)} streaming={streaming} />
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: "var(--ink-3)" }}>
            {lang === "zh" ? "AI 回复仅供参考，重要决策请自行核实。Shift + Enter 换行" : "AI replies may be inaccurate. Verify before acting. Shift + Enter for new line."}
          </div>
        </div>
      </div>
    </div>
  );
};

/* === Welcome state === */
const ChatWelcome = ({ lang, promptRows, onPick }) => {
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 40, paddingBottom: 60 }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 46, fontWeight: 600, letterSpacing: "-0.02em", margin: 0, lineHeight: 1.1, color: "var(--ink)" }}>
          {lang === "zh" ? "你好，余龙。" : "Hello, friend."}
        </h1>
        <p style={{ fontSize: 18, color: "var(--ink-3)", marginTop: 14 }}>
          {lang === "zh" ? "今天想聊点什么？" : "What's on your mind today?"}
        </p>
      </div>

      {/* prompt chip rows — each scrolls, alternating direction */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {promptRows.map((row, idx) => {
          const dup = [...row, ...row, ...row];
          const reverse = idx % 2 === 1;
          return (
            <div key={idx} className="marquee" style={{ maxWidth: "100%" }}>
              <div className="marquee-track" style={{ animationDuration: 38 + idx * 6 + "s", animationDirection: reverse ? "reverse" : "normal", gap: 10 }}>
                {dup.map((p, j) => (
                  <button key={j} onClick={() => onPick((lang === "zh" ? p.label_zh : p.label_en))} style={{
                    padding: "10px 18px", background: "var(--bg-elev)", border: "1px solid var(--line)", borderRadius: 999, fontSize: 14, cursor: "pointer", color: "var(--ink-2)",
                    display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", transition: "all 150ms"
                  }} onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.color = "var(--ink-2)"; }}>
                    <span style={{ fontSize: 15 }}>{p.emoji}</span>
                    <span>{lang === "zh" ? p.label_zh : p.label_en}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* === Message bubble === */
const Message = ({ msg, lang, cur }) => {
  if (msg.role === "user") return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div style={{ maxWidth: "78%", padding: "12px 16px", background: "var(--bg-soft)", border: "1px solid var(--line)", borderRadius: "14px 14px 4px 14px", fontSize: 14.5, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
        {msg.text}
      </div>
    </div>
  );
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <ModelGlyph family={cur.family} size={30} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{cur.name}{msg.thinking ? (lang === "zh" ? " · 思考中…" : " · thinking…") : ""}</div>
        <div style={{ fontSize: 15, lineHeight: 1.65, whiteSpace: "pre-wrap", color: "var(--ink)" }}>
          {msg.text}
          {msg.thinking || (msg.text && msg.text.length < 600 && msg.role === "assistant") ? <span className="caret" /> : null}
        </div>
        {!msg.thinking && msg.text && (
          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
            <button className="icon-btn" style={{ width: 28, height: 28 }} title={lang === "zh" ? "复制" : "Copy"}><Icon name="copy" size={13} /></button>
            <button className="icon-btn" style={{ width: 28, height: 28 }} title={lang === "zh" ? "重新生成" : "Regenerate"}><Icon name="refresh" size={13} /></button>
          </div>
        )}
      </div>
    </div>
  );
};

/* === Composer === */
const Composer = ({ lang, value, setValue, onSend, streaming }) => {
  const ta = useRefChat(null);
  useEffectChat(() => {
    if (ta.current) {
      ta.current.style.height = "auto";
      ta.current.style.height = Math.min(ta.current.scrollHeight, 180) + "px";
    }
  }, [value]);

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", border: "1px solid var(--line)", borderRadius: 16, padding: "10px 12px", background: "var(--bg-elev)", boxShadow: "var(--shadow-sm)" }}>
      <textarea
        ref={ta}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
        placeholder={lang === "zh" ? "和我聊点什么吧…" : "Ask me anything…"}
        rows={1}
        style={{ width: "100%", border: 0, outline: 0, resize: "none", background: "transparent", fontSize: 14.5, lineHeight: 1.6, padding: "8px 6px", color: "var(--ink)", fontFamily: "inherit", maxHeight: 180 }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 4px 0" }}>
        <button className="icon-btn" title={lang === "zh" ? "附件" : "Attach"}><Icon name="paperclip" size={16} /></button>
        <button className="icon-btn" title={lang === "zh" ? "图片" : "Image"}><Icon name="image" size={16} /></button>
        <span className="badge" style={{ fontSize: 11 }}><Icon name="globe" size={11} />{lang === "zh" ? "联网" : "Web"}</span>
        <span className="badge" style={{ fontSize: 11 }}><Icon name="spark" size={11} />{lang === "zh" ? "深度思考" : "Deep think"}</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <button className="icon-btn" title="Voice"><Icon name="mic" size={16} /></button>
          <button onClick={onSend} disabled={!value.trim() || streaming} style={{
            width: 36, height: 36, borderRadius: 10, background: value.trim() && !streaming ? "var(--accent)" : "var(--bg-soft)",
            color: value.trim() && !streaming ? "#fff" : "var(--ink-4)", border: 0, display: "grid", placeItems: "center", cursor: value.trim() && !streaming ? "pointer" : "not-allowed"
          }}>
            <Icon name={streaming ? "refresh" : "arrow_right"} size={16} stroke={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
};

window.ChatPage = ChatPage;
