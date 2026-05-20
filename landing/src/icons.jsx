// Lucide-style minimal stroke icons
const Icon = ({ name, size = 18, stroke = 1.75, ...rest }) => {
  const paths = {
    home: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /></>,
    cube: <><path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" /><path d="M4 7l8 4 8-4" /><path d="M12 11v10" /></>,
    tag: <><path d="M3 3h8l10 10-8 8L3 11V3Z" /><circle cx="7.5" cy="7.5" r="1.5" /></>,
    book: <><path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4Z" /><path d="M4 17a3 3 0 0 1 3-3h11" /></>,
    activity: <path d="M3 12h4l3-8 4 16 3-8h4" />,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    key: <><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9" /><path d="m15 4 3 3" /><path d="m18 7-2.5 2.5" /></>,
    chart: <><path d="M3 3v18h18" /><path d="M7 14v4" /><path d="M12 9v9" /><path d="M17 5v13" /></>,
    wallet: <><path d="M3 7a3 3 0 0 1 3-3h12v4" /><rect x="3" y="7" width="18" height="13" rx="2" /><circle cx="16" cy="13.5" r="1.5" /></>,
    activity2: <><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></>,
    cog: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></>,
    copy: <><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
    check: <path d="m5 12 5 5L20 7" />,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    arrow_right: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
    chevron_right: <path d="m9 6 6 6-6 6" />,
    chevron_down: <path d="m6 9 6 6 6-6" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" /></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
    bolt: <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />,
    shield: <path d="M12 3 4 6v7a9 9 0 0 0 8 8 9 9 0 0 0 8-8V6l-8-3Z" />,
    layers: <><path d="m12 2 10 6-10 6L2 8l10-6Z" /><path d="m2 14 10 6 10-6" /><path d="m2 18 10 6 10-6" /></>,
    radio: <><circle cx="12" cy="12" r="2" /><path d="M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4" /></>,
    headset: <><path d="M3 14v-3a9 9 0 0 1 18 0v3" /><rect x="3" y="13" width="5" height="8" rx="2" /><rect x="16" y="13" width="5" height="8" rx="2" /><path d="M21 17v1a4 4 0 0 1-4 4h-2" /></>,
    eye: <><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    eye_off: <><path d="m2 2 20 20" /><path d="M10.6 6.1A10.9 10.9 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.6 4.2M6.6 6.6A17 17 0 0 0 2 12s4 6 10 6a10.9 10.9 0 0 0 5.4-1.4" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    trash: <><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></>,
    refresh: <><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></>,
    spark: <><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4" /></>,
    code: <><path d="m8 8-5 4 5 4" /><path d="m16 8 5 4-5 4" /><path d="m14 4-4 16" /></>,
    weixin: <><path d="M8.5 4C4.9 4 2 6.5 2 9.5c0 1.7 1 3.2 2.5 4.2L4 16l2.5-1.2c.7.2 1.5.3 2.3.3" /><path d="M16 9.5c-3.4 0-6 2.3-6 5.3 0 1.6.8 3 2.2 4l-.4 1.7 2-1c.7.2 1.5.3 2.2.3 3.4 0 6-2.3 6-5.3s-2.6-5-6-5Z" /><circle cx="13.5" cy="14.5" r=".5" fill="currentColor" stroke="none" /><circle cx="18.5" cy="14.5" r=".5" fill="currentColor" stroke="none" /><circle cx="6" cy="9" r=".5" fill="currentColor" stroke="none" /><circle cx="11" cy="9" r=".5" fill="currentColor" stroke="none" /></>,
    alipay: <><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M7 13c2 0 4-1 5-2.5M7 13c1 3 4 5 7 5 2 0 4-.7 4-2.5 0-2-3-3-7-3.5" /></>,
    bank: <><path d="M3 9 12 4l9 5" /><path d="M5 9v9M19 9v9M9 12v6M15 12v6" /><path d="M3 21h18" /></>,
    chat: <><path d="M21 12a8 8 0 0 1-8 8H4l3-3a8 8 0 1 1 14-5Z" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 16-5-5L5 21" /></>,
    megaphone: <><path d="M3 11v3a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1Z" /><path d="M14 7a5 5 0 0 1 0 10" /></>,
    store: <><path d="M3 9 4 4h16l1 5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0Z" /><path d="M5 11v9h14v-9" /></>,
    terminal: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m6 9 3 3-3 3" /><path d="M13 15h5" /></>,
    edit: <><path d="M4 20h4l11-11-4-4L4 16v4Z" /><path d="m14 6 4 4" /></>,
    folder: <><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z" /></>,
    send: <><path d="m4 12 16-8-6 18-3-7-7-3Z" /></>,
    mic: <><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3" /></>,
    sidebar: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></>,
    inbox: <><path d="M3 12h6l2 3h2l2-3h6" /><path d="M5 5h14l2 7v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6Z" /></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3 2" /></>,
    paperclip: <path d="M21 12 12 21a5 5 0 0 1-7-7l8-8a3 3 0 0 1 4 4l-8 8a1.5 1.5 0 0 1-2-2l7-7" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {paths[name] || null}
    </svg>
  );
};

window.Icon = Icon;
