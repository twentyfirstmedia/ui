/* @ds-bundle: {"format":4,"namespace":"Halo","components":[{"name":"Icon"},{"name":"Button"},{"name":"IconButton"},{"name":"Chip"},{"name":"Badge"},{"name":"TintIcon"},{"name":"Avatar"},{"name":"AvatarStack"},{"name":"Input"},{"name":"Select"},{"name":"Textarea"},{"name":"SearchField"},{"name":"Checkbox"},{"name":"Switch"},{"name":"Tabs"},{"name":"Breadcrumb"},{"name":"Pagination"},{"name":"StatTile"},{"name":"Card"},{"name":"EventCard"},{"name":"Panel"},{"name":"PageHeader"},{"name":"TopBar"},{"name":"SideRail"},{"name":"Dock"},{"name":"AppShell"},{"name":"Stagger"},{"name":"Table"},{"name":"ListRow"},{"name":"Timeline"},{"name":"FileRow"},{"name":"KanbanColumn"},{"name":"Progress"},{"name":"ProgressRing"},{"name":"BarChart"},{"name":"LineChart"},{"name":"Sparkline"},{"name":"Donut"},{"name":"Skeleton"},{"name":"Menu"},{"name":"Modal"},{"name":"Toast"},{"name":"EmptyState"},{"name":"SubNav"},{"name":"Drawer"},{"name":"CommandPalette"},{"name":"NotificationList"},{"name":"Flow"},{"name":"FileCard"},{"name":"Wizard"},{"name":"PermissionMatrix"},{"name":"InvoicePreview"},{"name":"TransactionRow"},{"name":"FormField"},{"name":"TextField"},{"name":"RadioGroup"},{"name":"Segmented"},{"name":"Popover"},{"name":"Tooltip"},{"name":"Combobox"},{"name":"TagInput"},{"name":"Calendar"},{"name":"DatePicker"},{"name":"NumberInput"},{"name":"Slider"},{"name":"OtpInput"},{"name":"FileDrop"},{"name":"Alert"},{"name":"ConfirmDialog"},{"name":"Toaster"},{"name":"FilterBar"},{"name":"DataTable"},{"name":"StackedBarChart"},{"name":"AreaChart"},{"name":"Heatmap"},{"name":"Funnel"},{"name":"Gauge"},{"name":"Legend"},{"name":"RichText"},{"name":"CodeBlock"},{"name":"TypingDots"},{"name":"AgentMark"},{"name":"ChatMessage"},{"name":"ToolCall"},{"name":"Reasoning"},{"name":"ApprovalCard"},{"name":"PromptStarters"},{"name":"ModelPicker"},{"name":"Composer"},{"name":"AgentStatus"},{"name":"RunTrace"},{"name":"UsageMeter"},{"name":"ProductArt"},{"name":"Price"},{"name":"Rating"},{"name":"StockBadge"},{"name":"ProductCard"},{"name":"VariantPicker"},{"name":"CartLine"},{"name":"OrderSummary"},{"name":"CheckoutSteps"},{"name":"OrderTimeline"},{"name":"StatusScreen"},{"name":"PlanCard"},{"name":"AuthCard"},{"name":"StatusShape"},{"name":"StatusIndicator"},{"name":"ApprovalInbox"},{"name":"Kbd"},{"name":"KeyValue"},{"name":"Spinner"},{"name":"Collapsible"},{"name":"ContextMenu"},{"name":"SplitPane"},{"name":"TreeView"},{"name":"InlineEdit"},{"name":"LogView"},{"name":"CodeViewer"},{"name":"SecretField"},{"name":"MoneyInput"},{"name":"SettingsLayout"},{"name":"ShortcutsOverlay"},{"name":"StatCell"},{"name":"UptimeBar"},{"name":"Meter"},{"name":"AgentCard"},{"name":"AgentDetails"},{"name":"ChatList"},{"name":"ChatWorkspace"},{"name":"SearchHits"},{"name":"ThinkingLine"},{"name":"FeedbackRating"},{"name":"ActivityFeed"},{"name":"DailyBriefing"},{"name":"BudgetStop"},{"name":"MemoryViewer"},{"name":"OverrideDiff"},{"name":"TriggerList"},{"name":"ScheduleCalendar"},{"name":"OrgChart"},{"name":"VoiceMode"},{"name":"ConnectionCard"},{"name":"ConnectionBanner"},{"name":"ServerCard"},{"name":"DeployPipeline"},{"name":"DnsRecordTable"},{"name":"DomainList"},{"name":"MailAuthStatus"},{"name":"LedgerTable"},{"name":"PnLStatement"},{"name":"ReceiptSuggestion"},{"name":"AccountSwitcher"},{"name":"InboxList"},{"name":"MailThread"},{"name":"SignatureEditor"},{"name":"AttachmentPreview"},{"name":"MobileTabBar"},{"name":"PushNotification"},{"name":"ConfigPRSummary"},{"name":"ModuleRegistry"},{"name":"RangeSlider"},{"name":"BarList"},{"name":"StatusSelect"},{"name":"TilePicker"},{"name":"LiveFeed"},{"name":"MapView"},{"name":"RichTextEditor"},{"name":"EmailPreview"},{"name":"SearchAdPreview"},{"name":"BalanceCard"},{"name":"ServiceMonitor"},{"name":"RunHistory"},{"name":"WebhookEndpoint"},{"name":"BackupList"},{"name":"BlockList"},{"name":"ReviewCard"},{"name":"CouponCard"},{"name":"LocaleField"},{"name":"LocaleSwitcher"},{"name":"WorkspaceSwitcher"},{"name":"ExportDialog"},{"name":"TwoFactorSetup"},{"name":"ImageVariants"},{"name":"Gallery"},{"name":"BeforeAfter"},{"name":"ListingCard"},{"name":"ResultsToolbar"},{"name":"SavedSearch"},{"name":"ValuationCard"},{"name":"EnergyClass"},{"name":"ChatLauncher"},{"name":"CookieConsent"},{"name":"AnnouncementBar"},{"name":"ColorField"}]} */
(function () {
  var React = window.React, h = React.createElement, F = React.Fragment;
  /* ── Text and locale: the kit ships no fixed copy. Every visible string goes through L(),
        apps replace them with Halo.setLabels({ "Copy": "Kopieren", "Remove {name}": … }).
        Numbers, money and dates follow Halo.setLocale("de-DE", { currency: "EUR", weekStart: 1 }). ── */
  var LABELS = {}, LOCALE = { tag: undefined, currency: "EUR", weekStart: 1 };
  function L(key, vars) {
    var s = Object.prototype.hasOwnProperty.call(LABELS, key) ? LABELS[key] : key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ""; });
    return s;
  }
  /* Like L(), but {slots} can be React nodes: Lx("Type {word} to confirm", { word: h("b", null, "RESET") }) */
  function Lx(key, nodes) {
    var parts = L(key).split(/(\{\w+\})/), out = [];
    parts.forEach(function (p, i) { var m = /^\{(\w+)\}$/.exec(p); out.push(m ? h(F, { key: i }, nodes[m[1]]) : p); });
    return out;
  }
  function setLabels(map, replace) { LABELS = replace ? Object.assign({}, map) : Object.assign({}, LABELS, map); }
  function setLocale(tag, opts) { LOCALE = Object.assign({}, LOCALE, opts || {}, { tag: tag }); }
  function fmtNum(v, o) { try { return new Intl.NumberFormat(LOCALE.tag, o).format(v); } catch (e) { return String(v); } }
  function fmtMoney(v, cur, o) { return fmtNum(v, Object.assign({ style: "currency", currency: cur || LOCALE.currency, minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 }, o || {})); }
  function fmtDate(d, o) { try { return new Intl.DateTimeFormat(LOCALE.tag, o || { day: "2-digit", month: "2-digit", year: "numeric" }).format(d); } catch (e) { return d.toDateString(); } }
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function reduced() { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } }
  function useMounted(delay) {
    var s = React.useState(false);
    React.useEffect(function () { var t = setTimeout(function () { s[1](true); }, delay || 30); return function () { clearTimeout(t); }; }, []);
    return s[0];
  }

  /* Icon set: 24px grid, 2px rounded strokes, drawn for Halo */
  var P = {
    thumbUp: "M7 10.5v9.5H4v-9.5h3zM7 10.5l4-7c1.4 0 2.5 1.1 2.5 2.5v3h5a2 2 0 0 1 2 2.3l-1.2 6.8a2 2 0 0 1-2 1.9H7",
    thumbDown: "M7 13.5V4H4v9.5h3zM7 13.5l4 7c1.4 0 2.5-1.1 2.5-2.5v-3h5a2 2 0 0 0 2-2.3l-1.2-6.8A2 2 0 0 0 17.3 4H7",
    arrowUp: "M12 19V5M6 11l6-6 6 6", heart: "M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z",
    tag: "M3.5 12.5V4h8.5l8.5 8.5-8 8-9-8zM8 8.5h.01", cart: "M3 4h2.5l2.2 11h10.6l2-8H6.6M9 20h.01M17 20h.01",
    package: "M12 3.5l8 4.5v8L12 20.5 4 16V8l8-4.5zM4 8l8 4.5L20 8M12 12.5v8", truck: "M2.5 6h11v10h-11zM13.5 9.5h4l3 3.5V16h-7M6.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    plus: "M12 5v14M5 12h14", minus: "M5 12h14", check: "M5 12.5l4.5 4.5L19 7.5", x: "M6 6l12 12M18 6L6 18", more: "M6 12h.01M12 12h.01M18 12h.01",
    search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5", bell: "M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16zM10 20.5a2 2 0 0 0 4 0",
    clock: "M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM12 7.5V12l3 2", eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
    edit: "M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4", trash: "M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13",
    users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.8c2 .7 3.5 2.6 3.5 5.2",
    user: "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6",
    home: "M4 10.5L12 4l8 6.5V20h-5v-6H9v6H4v-9.5z", chart: "M4 20h16M7 16v-5M12 16V6M17 16v-8", mail: "M3.5 6.5h17v11h-17zM4 7l8 6 8-6",
    grid: "M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z",
    share: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4",
    menu: "M4 8h16M4 16h16", play: "M8 5.5v13l10.5-6.5L8 5.5z", calendar: "M4 6.5h16V20H4zM4 10.5h16M8.5 3.5v5M15.5 3.5v5",
    file: "M6 3.5h8l4 4V20.5H6zM14 3.5v4h4", card: "M3 6.5h18v11H3zM3 10.5h18", swap: "M4 8h14l-3.5-3.5M20 16H6l3.5 3.5",
    send: "M20.5 3.5L3.5 10.5l7 3 3 7 7-17zM10.5 13.5l4-4", download: "M12 4v11M7 10.5l5 5 5-5M4.5 20h15",
    book: "M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5c-.8 0-1.5-.7-1.5-1.5V5.5zM13 4h5.5c.8 0 1.5.7 1.5 1.5v13c0 .8-.7 1.5-1.5 1.5H13V4z",
    chevronDown: "M6 9l6 6 6-6", chevronLeft: "M15 6l-6 6 6 6", chevronRight: "M9 6l6 6-6 6", arrowUpRight: "M7 17L17 7M8 7h9v9",
    sparkle: "M12 3.5l2 6.5 6.5 2-6.5 2-2 6.5-2-6.5-6.5-2 6.5-2 2-6.5z", filter: "M4 6h16M7 12h10M10 18h4",
    settings: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2.5v3M12 18.5v3M4.4 4.4l2.1 2.1M17.5 17.5l2.1 2.1M2.5 12h3M18.5 12h3M4.4 19.6l2.1-2.1M17.5 6.5l2.1-2.1",
    lock: "M6 11h12v9.5H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3", link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
    paperclip: "M20 11.5l-8 8a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7L9.7 17.2a1.7 1.7 0 0 1-2.4-2.4L15 7",
    star: "M12 4l2.5 5.2 5.5.8-4 3.9 1 5.6-5-2.7-5 2.7 1-5.6-4-3.9 5.5-.8L12 4z", flag: "M5.5 21V4M5.5 4.5h11l-2 4 2 4h-11",
    trend: "M3.5 16.5l6-6 4 4 7-7M15 7.5h5.5V13", globe: "M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z",
    inbox: "M3.5 13.5l2.5-8h12l2.5 8V19h-17v-5.5zM3.5 13.5H9l1 2h4l1-2h5.5", logout: "M14 4.5h4.5v15H14M10 8l-4 4 4 4M6 12h9",
    moon: "M19.5 14A8 8 0 1 1 10 4.5a6.5 6.5 0 0 0 9.5 9.5z",
    bot: "M12 3v3M7 7h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3zM9.5 12.5v1M14.5 12.5v1M2 13v2M22 13v2",
    code: "M8.5 7l-5 5 5 5M15.5 7l5 5-5 5", branch: "M6 3.5v11M6 14.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM18 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9.5c0 5-6 3.5-12 7",
    terminal: "M3.5 5h17v14h-17zM7 9.5l3 2.5-3 2.5M12.5 15h4.5", server: "M4 4.5h16v6H4zM4 13.5h16v6H4zM7.5 7.5h.01M7.5 16.5h.01",
    key: "M15 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM11 13L3.5 20.5M6 18l2 2M8.5 15.5l2 2",
    database: "M12 3.5c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6.5v11c0 1.7 3.6 3 8 3s8-1.3 8-3v-11M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
    refresh: "M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4", pause: "M8.5 5.5v13M15.5 5.5v13", archive: "M3.5 4.5h17v4h-17zM5 8.5v11h14v-11M10 12.5h4",
    reply: "M9.5 6L4 11.5 9.5 17M4.5 11.5h9a6 6 0 0 1 6 6v1", shield: "M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6L12 3z",
    help: "M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01",
    cpu: "M7 7h10v10H7zM10 3.5V7M14 3.5V7M10 17v3.5M14 17v3.5M3.5 10H7M3.5 14H7M17 10h3.5M17 14h3.5", zap: "M13 3L5 13.5h6L10 21l8-10.5h-6L13 3z", folder: "M3.5 6.5h6l2 2h9v10h-17z"
  };
  function Icon(p) {
    var size = p.size || 16;
    return h("svg", { className: cx("ha-ico", p.className), width: size, height: size, viewBox: "0 0 24 24", fill: p.name === "play" ? "currentColor" : "none", stroke: "currentColor", strokeWidth: p.name === "more" ? 3.2 : 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": p.label ? undefined : true, role: p.label ? "img" : undefined, "aria-label": p.label, style: { width: size, height: size } },
      h("path", { d: P[p.name] || P.sparkle }));
  }
  Icon.names = Object.keys(P);

  /* ── Actions ── */
  function Button(p) {
    var v = p.variant || "primary";
    return h("button", { type: p.type || "button", className: cx("ha-btn", "ha-btn-" + v, p.size === "sm" && "ha-btn-sm", p.className), style: p.style, disabled: p.disabled, onClick: p.onClick },
      p.icon && h(Icon, { name: p.icon, size: 15 }), p.children, p.iconRight && h(Icon, { name: p.iconRight, size: 15 }));
  }
  function IconButton(p) {
    return h("button", { type: "button", "aria-label": p.label, title: p.label, className: cx("ha-iconbtn", "ha-iconbtn-" + (p.variant || "soft"), p.size && "ha-iconbtn-" + p.size, p.className), disabled: p.disabled, onClick: p.onClick },
      h(Icon, { name: p.icon }));
  }
  function Chip(p) {
    return h("button", { type: "button", className: cx("ha-chip", p.className), "aria-pressed": p.selected ? "true" : "false", onClick: p.onClick },
      p.icon && h(Icon, { name: p.icon, size: 14 }), p.children, p.count != null && h("span", { className: "ha-chip-count" }, p.count));
  }
  var TONE_ALIAS = { ok: "success", warn: "warning", signal: "highlight", idle: "neutral", running: "info", error: "danger" };
  function Badge(p) {
    var tone = TONE_ALIAS[p.tone] || p.tone || "neutral";
    return h("span", { className: cx("ha-badge", "ha-badge-" + tone, (p.live || p.tone === "running") && "ha-badge-live", p.className) }, p.dot !== false && h("span", { className: "ha-badge-dot", "aria-hidden": true }), p.children);
  }
  function TintIcon(p) {
    return h("span", { className: cx("ha-tinticon", "ha-t-" + (p.tint || "plain"), p.className), "aria-hidden": p.label ? undefined : true, title: p.label, style: p.size ? { width: p.size, height: p.size } : undefined }, h(Icon, { name: p.icon }));
  }
  var AV_TINTS = ["lilac", "sky", "mint", "butter", "blush"];
  function initials(n) { return (n || "?").split(/\s+/).filter(function (s) { return /^[A-Za-z0-9\u00C0-\u024F]/.test(s); }).map(function (s) { return s[0]; }).slice(0, 2).join("").toUpperCase() || "?"; }
  function Avatar(p) {
    var size = p.size || 32, t = p.tint || AV_TINTS[(p.name || "").length % AV_TINTS.length];
    return h("span", { className: cx("ha-avatar", p.className), style: { width: size, height: size, background: "var(--" + t + ")", fontSize: Math.round(size * 0.36) }, title: p.name },
      p.src ? h("img", { src: p.src, alt: p.name || "" }) : initials(p.name));
  }
  function AvatarStack(p) {
    var names = p.names || [], max = p.max || 4, extra = names.length - max;
    return h("span", { className: "ha-avatar-stack" }, names.slice(0, max).map(function (n) { return h(Avatar, { key: n, name: n, size: p.size || 28 }); }),
      extra > 0 && h(Avatar, { name: "+" + extra, tint: "surface-sunken", size: p.size || 28 }));
  }

  /* ── Forms ── */
  function Field(p, control) {
    return h("label", { className: "ha-field" }, p.label && h("span", { className: "ha-field-label" }, p.label), control,
      p.error ? h("span", { className: "ha-field-error" }, p.error) : p.hint && h("span", { className: "ha-field-hint" }, p.hint));
  }
  function Input(p) {
    return Field(p, h("input", { className: "ha-input", type: p.type || "text", placeholder: p.placeholder, defaultValue: p.defaultValue, value: p.value, onChange: p.onChange, disabled: p.disabled, "aria-invalid": p.error ? "true" : undefined }));
  }
  function Select(p) {
    return Field(p, h("select", { className: "ha-input", defaultValue: p.defaultValue, value: p.value, onChange: p.onChange }, (p.options || []).map(function (o) { return h("option", { key: o, value: o }, o); })));
  }
  function Textarea(p) {
    return Field(p, h("textarea", { className: "ha-input", placeholder: p.placeholder, defaultValue: p.defaultValue, rows: p.rows || 4 }));
  }
  function SearchField(p) {
    return h("label", { className: cx("ha-search", p.className), style: p.style }, h(Icon, { name: "search", size: 15 }),
      h("input", { type: "search", placeholder: p.placeholder || L("Search"), "aria-label": p.placeholder || L("Search"), value: p.value, onChange: p.onChange }),
      p.shortcut && h("span", { className: "ha-kbd" }, p.shortcut));
  }
  function Checkbox(p) {
    return h("label", { className: "ha-check" },
      h("span", { className: "ha-checkbox" },
        h("input", { type: "checkbox", defaultChecked: p.defaultChecked, checked: p.checked, onChange: p.onChange, disabled: p.disabled, "aria-label": p.label }),
        h("span", { className: "ha-checkbox-box", "aria-hidden": true }, h("svg", { viewBox: "0 0 24 24", width: 14, height: 14, fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: "M5 12.5l4.5 4.5L19 7.5" })))),
      p.children);
  }
  function Switch(p) {
    return h("label", { className: "ha-check", style: p.spread ? { justifyContent: "space-between", width: "100%" } : undefined }, p.spread && p.children, h("input", { type: "checkbox", role: "switch", className: "ha-switch", defaultChecked: p.defaultChecked, checked: p.checked, onChange: p.onChange }), !p.spread && p.children);
  }

  /* ── Navigation ── */
  function Tabs(p) {
    var items = p.items || [], st = React.useState(p.defaultValue || items[0]), val = p.value != null ? p.value : st[0];
    var wrap = React.useRef(null), ind = React.useState({ x: 0, w: 0, ready: false });
    React.useLayoutEffect(function () {
      var el = wrap.current && wrap.current.querySelector('[aria-selected="true"]');
      if (el) ind[1]({ x: el.offsetLeft, w: el.offsetWidth, ready: true });
    }, [val, items.join("|")]);
    return h("div", { ref: wrap, className: cx("ha-tabs", p.block && "ha-tabs-block", p.className), role: "tablist" },
      h("span", { className: "ha-tabs-ind", "aria-hidden": true, style: { width: ind[0].w, transform: "translateX(" + ind[0].x + "px)", opacity: ind[0].ready ? 1 : 0 } }),
      items.map(function (it) {
        return h("button", { key: it, type: "button", role: "tab", className: "ha-tab", "aria-selected": it === val ? "true" : "false", onClick: function () { st[1](it); p.onChange && p.onChange(it); } }, it);
      }));
  }
  function Breadcrumb(p) {
    var items = p.items || [];
    return h("nav", { className: "ha-crumbs", "aria-label": "Breadcrumb" }, items.map(function (it, i) {
      var last = i === items.length - 1;
      return h(F, { key: i }, last ? h("span", { "aria-current": "page" }, it) : h("a", { href: "#" }, it), !last && h(Icon, { name: "chevronRight", size: 13 }));
    }));
  }
  function Pagination(p) {
    var total = p.total || 1, st = React.useState(p.page || 1), cur = st[0], pages = [];
    for (var i = 1; i <= total; i++) { if (i === 1 || i === total || Math.abs(i - cur) <= 1) pages.push(i); else if (pages[pages.length - 1] !== "…") pages.push("…"); }
    return h("nav", { className: "ha-pager", "aria-label": "Pagination" },
      h(IconButton, { icon: "chevronLeft", label: L("Previous page"), size: "sm", onClick: function () { st[1](Math.max(1, cur - 1)); } }),
      pages.map(function (n, i) { return n === "…" ? h("span", { key: "e" + i, className: "ha-page", "aria-hidden": true }, "…") : h("button", { key: n, type: "button", className: "ha-page", "aria-current": n === cur ? "page" : undefined, onClick: function () { st[1](n); } }, n); }),
      h(IconButton, { icon: "chevronRight", label: L("Next page"), size: "sm", onClick: function () { st[1](Math.min(total, cur + 1)); } }));
  }

  /* ── Data ── */
  function parseNum(v) {
    var m = /^([^0-9\-]*)(-?[0-9][0-9,]*\.?[0-9]*)(.*)$/.exec(String(v));
    if (!m) return null;
    var raw = m[2].replace(/,/g, ""), dec = (raw.split(".")[1] || "").length;
    return { pre: m[1], num: parseFloat(raw), dec: dec, comma: m[2].indexOf(",") > -1, post: m[3] };
  }
  function fmt(n, o) {
    var s = n.toFixed(o.dec);
    if (o.comma) { var parts = s.split("."); parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); s = parts.join("."); }
    return o.pre + s + o.post;
  }
  function CountUp(p) {
    var o = parseNum(p.value), st = React.useState(o && !reduced() ? fmt(0, o) : String(p.value)), last = React.useRef(0), first = React.useRef(true);
    React.useEffect(function () {
      if (!o || reduced()) { st[1](String(p.value)); return; }
      var from = last.current, start = null, dur = first.current ? (p.duration || 900) : 450, delay = first.current ? (p.delay || 0) : 0, raf;
      first.current = false;
      function tick(t) { if (start === null) start = t; var k = Math.min(1, Math.max(0, (t - start - delay) / dur)); var e = 1 - Math.pow(1 - k, 3), v = from + (o.num - from) * e; last.current = v; st[1](fmt(v, o)); if (k < 1) raf = requestAnimationFrame(tick); else last.current = o.num; }
      raf = requestAnimationFrame(tick); return function () { cancelAnimationFrame(raf); };
    }, [p.value]);
    return h("span", { className: p.className }, st[0]);
  }
  function StatTile(p) {
    var tint = p.tint || "sky";
    return h("div", { className: cx("ha-stat", tint === "placeholder" ? "ha-stat-placeholder" : "ha-bg-" + tint, p.className) },
      h(CountUp, { className: "ha-stat-value", value: p.value, delay: p.delay || 120 }), h("span", { className: "ha-stat-label" }, p.label),
      p.delta && h("span", { className: "ha-stat-delta" }, p.delta));
  }
  function Card(p) {
    var tint = p.tint && p.tint !== "surface" ? "ha-bg-" + p.tint : null;
    return h("article", { className: cx("ha-card", tint, p.onClick && "ha-card-interactive", p.className), style: p.style, tabIndex: p.onClick ? 0 : undefined, onClick: p.onClick },
      p.corner && h("span", { className: "ha-card-corner" }, p.corner),
      p.eyebrow && h("span", { className: "ha-card-meta" }, p.eyebrow),
      p.title && h("h3", { className: "ha-card-title" }, p.title),
      p.description && h("p", { className: "ha-card-desc" }, p.description),
      p.meta && h("div", { className: "ha-card-meta" }, p.meta.map(function (m, i) { return h("span", { key: i }, m); })),
      p.children,
      (p.status || p.actions) && h("div", { className: "ha-card-foot" }, p.status || h("span"), p.actions && h("div", { className: "ha-row" }, p.actions)));
  }
  var KIND = { meeting: ["users", "sky"], deadline: ["clock", "butter"], review: ["eye", "lilac"], launch: ["sparkle", "mint"], incident: ["bell", "blush"] };
  function EventCard(p) {
    var k = KIND[p.kind] || KIND.meeting, tint = p.tint || k[1];
    return h("div", { className: cx("ha-event", "ha-bg-" + tint, p.className) },
      h("div", { className: "ha-event-head" }, h("span", { className: "ha-event-kind" }, h(Icon, { name: p.icon || k[0], size: 14 }), p.label), h("span", { className: "ha-event-date" }, p.date)),
      h("p", { className: "ha-event-body" }, p.children),
      h("div", { className: "ha-event-bar" }, h("span", { className: "ha-row" }, h(Icon, { name: "clock", size: 14 }), " ", p.time),
        p.actions !== false && h("span", { className: "ha-row" }, h(IconButton, { icon: "eye", label: L("Open"), size: "sm", variant: "outline" }), h(IconButton, { icon: "edit", label: L("Edit"), size: "sm", variant: "outline" }), h(IconButton, { icon: "trash", label: L("Remove"), size: "sm", variant: "outline" }))));
  }
  function Panel(p) {
    return h("section", { className: cx("ha-panel", p.side && "ha-side", p.className), style: p.style },
      (p.title || p.action) && h("div", { className: "ha-header" }, h("div", null, h("h2", { className: "ha-panel-title" }, p.title), p.subtitle && h("p", { className: "ha-panel-sub" }, p.subtitle)), p.action),
      p.children);
  }
  function PageHeader(p) {
    return h("header", { className: "ha-header" }, h("div", null, p.crumbs && h("div", { style: { marginBottom: 8 } }, h(Breadcrumb, { items: p.crumbs })), h("h1", { className: "ha-header-title" }, p.title), p.subtitle && h("p", { className: "ha-header-sub" }, p.subtitle)), p.actions && h("div", { className: "ha-row" }, p.actions));
  }
  function TopBar(p) {
    return h("nav", { className: "ha-topbar", "aria-label": L("Main") },
      h("span", { className: "ha-brand" }, p.brand || L("Halo"), h("span", { className: "ha-brand-dot", "aria-hidden": true }), p.tag && h("span", { className: "ha-brand-tag" }, p.tag)),
      h("div", { className: "ha-nav" }, (p.items || []).map(function (it) {
        var active = it.label === p.active;
        return h("button", { key: it.label, type: "button", className: "ha-nav-item", "aria-current": active ? "page" : undefined, title: it.label, onClick: function () { p.onNavigate && p.onNavigate(it.label); } }, h(Icon, { name: it.icon }), h("span", { className: "ha-nav-label" }, it.label), it.count ? h("span", { className: "ha-nav-count" }, it.count) : null);
      })),
      p.extra && h("div", { className: "ha-topbar-extra" }, p.extra),
      p.user && h("button", { type: "button", className: "ha-user", "aria-haspopup": "menu", "aria-expanded": p.userOpen ? "true" : "false", onClick: p.onUser }, h(Avatar, { name: p.user.name, size: 28 }), h("span", { className: "ha-user-text" }, h("span", { className: "ha-user-name" }, p.user.name), p.user.email && h("span", { className: "ha-user-mail" }, p.user.email)), h(Icon, { name: "chevronDown", size: 14 })));
  }
  function railBtn(it, i) {
    return h("button", { key: it.label, type: "button", className: "ha-rail-btn", style: { animationDelay: (200 + i * 50) + "ms" }, "aria-label": it.label, title: it.label, "aria-current": it.active ? "page" : undefined, onClick: it.onClick }, h(Icon, { name: it.icon }), it.count ? h("span", { className: "ha-dotcount" }, it.count) : null);
  }
  function SideRail(p) {
    return h("aside", { className: "ha-rail", "aria-label": L("Tools") }, h("div", { className: "ha-rail-group" }, (p.top || []).map(railBtn)), h("div", { className: "ha-rail-group" }, (p.bottom || []).map(function (it, i) { return railBtn(it, i + 3); })));
  }
  function Dock(p) {
    return h("div", { className: "ha-dock", role: "toolbar", "aria-label": p.label || L("Quick actions") }, (p.items || []).map(function (it) {
      return h("button", { key: it.label, type: "button", className: cx("ha-dock-btn", "ha-t-" + (it.tint || "plain")), "aria-label": it.label, title: it.label, onClick: it.onClick }, h(Icon, { name: it.icon }));
    }));
  }
  var NAV = [{ label: L("Home"), icon: "home" }, { label: L("People"), icon: "users" }, { label: L("Projects"), icon: "grid" }, { label: L("Inbox"), icon: "mail" }, { label: "Calendar", icon: "calendar" }, { label: L("Billing"), icon: "card" }, { label: L("Reports"), icon: "chart" }, { label: L("Settings"), icon: "settings" }];
  var RAIL_TOP = [{ label: L("Share"), icon: "share", active: true }, { label: L("List view"), icon: "menu" }, { label: L("Grid view"), icon: "grid" }];
  var RAIL_BOTTOM = [{ label: L("Notifications"), icon: "bell", count: 3 }, { label: L("Zoom in"), icon: "plus" }, { label: L("Zoom out"), icon: "minus" }];
  var DOCK = [{ label: L("Invite"), icon: "users", tint: "sky" }, { label: L("New page"), icon: "file", tint: "lilac" }, { label: L("New invoice"), icon: "card", tint: "blush" }, { label: L("Announce"), icon: "send", tint: "butter" }, { label: L("Export"), icon: "download", tint: "mint" }, { label: L("More"), icon: "plus" }];
  function AppShell(p) {
    return h("div", { className: "ha-shell", style: p.style },
      h(TopBar, { brand: p.brand || L("Halo"), tag: p.tag || L("Admin"), active: p.active, items: p.nav || NAV, onNavigate: p.onNavigate, user: p.user || { name: "Mara Ellis", email: "mara@halo.app" } }),
      h("div", { className: cx("ha-sheet", !p.side && "ha-sheet-2"), style: p.sheetStyle },
        h(SideRail, { top: p.railTop || RAIL_TOP, bottom: p.railBottom || RAIL_BOTTOM }),
        h("main", { key: p.contentKey, className: cx("ha-main", p.dock !== false && "ha-main-dock") }, p.children),
        p.side || null,
        p.dock !== false && h("div", { className: "ha-dock-float" }, h(Dock, { items: p.dockItems || DOCK }))));
  }
  function Stagger(p) {
    var st = Object.assign({}, p.style || {}); if (p.delay) st["--base"] = p.delay + "ms";
    return h(p.as || "div", { className: cx("ha-stagger", p.className), style: st }, p.children);
  }
  function Table(p) {
    var cols = p.columns || [];
    return h("table", { className: "ha-table" }, h("thead", null, h("tr", null, cols.map(function (c) { return h("th", { key: c.key, className: c.align === "right" ? "ha-num" : undefined, style: c.width ? { width: c.width } : undefined }, c.label); }))),
      h("tbody", { className: p.animate === false ? undefined : "ha-stagger", style: { "--base": "180ms" } }, (p.rows || []).map(function (r, i) { return h("tr", { key: i }, cols.map(function (c) { return h("td", { key: c.key, className: c.align === "right" ? "ha-num" : undefined }, c.render ? c.render(r) : r[c.key]); })); })));
  }
  function ListRow(p) {
    return h("button", { type: "button", className: "ha-row-item", "aria-current": p.active ? "true" : undefined, onClick: p.onClick },
      p.leading || (p.avatar ? h(Avatar, { name: p.avatar, size: 36 }) : h(TintIcon, { icon: p.icon || "mail", tint: p.tint || "plain" })),
      h("span", { style: { minWidth: 0 } }, h("span", { className: "ha-row-title" }, p.unread && h("span", { className: "ha-unread", "aria-label": L("Unread") }), p.title), p.subtitle && h("span", { className: "ha-row-sub", style: { display: "block" } }, p.subtitle)),
      h("span", { className: "ha-row-meta" }, p.meta, p.trailing));
  }
  function Timeline(p) {
    return h("ol", { className: "ha-timeline ha-stagger", style: { "--base": (p.delay || 200) + "ms" } }, (p.items || []).map(function (it, i) {
      return h("li", { key: i, className: "ha-tl-item" }, it.avatar ? h(Avatar, { name: it.avatar, size: 30 }) : h(TintIcon, { icon: it.icon || "sparkle", tint: it.tint || "plain" }),
        h("div", null, h("p", { className: "ha-tl-text" }, it.text), h("span", { className: "ha-tl-time" }, it.time)));
    }));
  }
  var FT = { pdf: ["file", "blush"], fig: ["sparkle", "lilac"], sheet: ["chart", "mint"], doc: ["book", "sky"], zip: ["folder", "butter"] };
  function FileRow(p) {
    var t = FT[p.kind] || FT.doc;
    return h("div", { className: "ha-file" }, h(TintIcon, { icon: t[0], tint: t[1] }), h("div", { style: { flex: 1, minWidth: 0 } }, h("div", { className: "ha-file-name" }, p.name), h("div", { className: "ha-file-meta" }, p.meta)), h(IconButton, { icon: "download", label: L("Download {name}", { name: p.name }), size: "sm" }));
  }
  function KanbanColumn(p) {
    return h("section", { className: "ha-kanban", "aria-label": p.title },
      h("div", { className: "ha-kanban-head" }, h("span", { className: "ha-row", style: { gap: 0 } }, p.dot && h("span", { className: "ha-badge-dot", style: { color: "var(--" + p.dot + "-ink)", width: 8, height: 8, borderRadius: "50%", background: "currentColor", marginRight: 8 } }), p.title, h("span", { className: "ha-kanban-count" }, React.Children.count(p.children))), h(IconButton, { icon: "more", label: L("Column options"), size: "sm" })),
      h(Stagger, { className: "ha-col", style: { gap: 10 }, delay: p.delay || 0 }, p.children),
      h("button", { type: "button", className: "ha-kanban-add", onClick: p.onAdd }, h(Icon, { name: "plus", size: 14 }), L("Add card")));
  }
  function Progress(p) {
    var v = Math.max(0, Math.min(100, p.value || 0));
    return h("div", { className: cx("ha-progress", p.tint && "ha-progress-" + p.tint), role: "progressbar", "aria-valuenow": v, "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": p.label }, h("span", { style: { width: v + "%" } }));
  }
  function ProgressRing(p) {
    var size = p.size || 88, sw = p.stroke || 9, r = (size - sw) / 2, c = 2 * Math.PI * r, v = Math.max(0, Math.min(100, p.value || 0)), on = useMounted(150);
    return h("div", { className: "ha-ring", style: { width: size, height: size }, role: "img", "aria-label": (p.label || "Progress") + " " + v + "%" },
      h("svg", { width: size, height: size, viewBox: "0 0 " + size + " " + size },
        h("circle", { className: "ha-arc-track", cx: size / 2, cy: size / 2, r: r, strokeWidth: sw }),
        h("circle", { className: cx("ha-arc", "ha-arc-" + (p.tint || "ink")), cx: size / 2, cy: size / 2, r: r, strokeWidth: sw, strokeDasharray: c, strokeDashoffset: on || reduced() ? c * (1 - v / 100) : c })),
      h("span", { className: "ha-ring-label" }, h("span", null, h(CountUp, { value: v + "%", delay: 150 }), p.caption && h("small", null, p.caption))));
  }
  function useWidth(fixed, fallback) {
    var ref = React.useRef(null), st = React.useState(fixed || 0);
    React.useLayoutEffect(function () {
      if (fixed || !ref.current) return;
      var el = ref.current, ro;
      function measure() { var w = Math.floor(el.getBoundingClientRect().width); if (w > 40) st[1](function (o) { return Math.abs(o - w) > 1 ? w : o; }); else if (!st[0]) st[1](fallback); }
      measure();
      if (window.ResizeObserver) { ro = new ResizeObserver(measure); ro.observe(el); return function () { ro.disconnect(); }; }
    }, [fixed]);
    return [ref, st[0]];
  }
  function niceMax(m) { var p = Math.pow(10, Math.floor(Math.log10(m || 1))); return Math.ceil(m / p) * p; }
  function BarChart(p) {
    var mw = useWidth(p.width, 560), data = p.data || [], W = mw[1], Hh = p.height || 200, pad = 34, max = niceMax(Math.max.apply(null, data.map(function (d) { return d.value; }).concat([1])));
    var n = data.length, gw = Math.max(1, (W - pad) / n), bw = Math.max(1, Math.min(p.barWidth || 28, gw * 0.62)), ticks = [0, 0.5, 1];
    return h("div", { ref: mw[0], className: "ha-chart-wrap" }, h("svg", { className: "ha-chart", width: W, height: Hh + 22, viewBox: "0 0 " + W + " " + (Hh + 22), preserveAspectRatio: "xMinYMin meet", role: "img", "aria-label": p.label || L("Bar chart") },
      ticks.map(function (t) { var y = Hh - t * (Hh - 10); return h("g", { key: t }, h("line", { className: "grid", x1: pad, x2: W, y1: y, y2: y, strokeDasharray: t ? "3 5" : null }), h("text", { x: 0, y: y + 4 }, p.format ? p.format(max * t) : Math.round(max * t))); }),
      data.map(function (d, i) {
        var bh = Math.max(4, (d.value / max) * (Hh - 10)), x = pad + gw * i + (gw - bw) / 2;
        return h("g", { key: i }, h("rect", { className: cx("ha-bar", "ha-bar-" + (d.tint || p.tint || "ink")), x: x, y: Hh - bh, width: bw, height: bh, rx: Math.min(10, bw / 2), style: { animationDelay: (120 + i * 55) + "ms" } }, h("title", null, d.label + ": " + d.value)),
          h("text", { x: x + bw / 2, y: Hh + 18, textAnchor: "middle" }, d.label));
      })));
  }
  function LineChart(p) {
    var mw = useWidth(p.width, 560), series = p.series || [], labels = p.labels || [], W = mw[1], Hh = p.height || 200, pad = 44;
    var all = []; series.forEach(function (s) { all = all.concat(s.values); });
    var max = niceMax(Math.max.apply(null, all.concat([1]))), n = labels.length || (series[0] && series[0].values.length) || 1;
    function X(i) { return pad + 14 + (W - pad - 32) * (n === 1 ? 0 : i / (n - 1)); } function Y(v) { return Hh - (v / max) * (Hh - 12); }
    function path(vals) { return vals.map(function (v, i) { return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1); }).join(" "); }
    return h("div", { ref: mw[0], className: "ha-chart-wrap" }, h("svg", { className: "ha-chart", width: W, height: Hh + 22, viewBox: "0 0 " + W + " " + (Hh + 22), preserveAspectRatio: "xMinYMin meet", role: "img", "aria-label": p.label || L("Line chart") },
      [0, 0.5, 1].map(function (t) { var y = Hh - t * (Hh - 12); return h("g", { key: t }, h("line", { className: "grid", x1: pad, x2: W, y1: y, y2: y, strokeDasharray: t ? "3 5" : null }), h("text", { x: 0, y: y + 4 }, p.format ? p.format(max * t) : Math.round(max * t))); }),
      labels.map(function (l, i) { return h("text", { key: l + i, x: X(i), y: Hh + 18, textAnchor: "middle" }, l); }),
      series.map(function (s, si) {
        var tint = s.tint || "ink", d = path(s.values), last = s.values.length - 1;
        return h("g", { key: si },
          s.area && h("path", { className: cx("ha-area", "ha-area-" + tint), d: d + " L" + X(last) + " " + Hh + " L" + X(0) + " " + Hh + " Z" }),
          h("path", { className: cx("ha-line", "ha-line-" + tint), d: d, pathLength: 1, style: { animationDelay: (150 + si * 200) + "ms" } }),
          h("circle", { className: cx("ha-dotpt", "ha-line-" + tint), cx: X(last), cy: Y(s.values[last]), r: 4.5 }));
      })));
  }
  function Sparkline(p) {
    var v = p.values || [], W = p.width || 120, Hh = p.height || 36, max = Math.max.apply(null, v), min = Math.min.apply(null, v), rng = max - min || 1;
    var d = v.map(function (x, i) { return (i ? "L" : "M") + (2 + (W - 4) * i / (v.length - 1)).toFixed(1) + " " + (Hh - 3 - ((x - min) / rng) * (Hh - 6)).toFixed(1); }).join(" ");
    return h("svg", { className: "ha-chart", viewBox: "0 0 " + W + " " + Hh, width: W, height: Hh, role: "img", "aria-label": p.label || L("Trend") }, h("path", { className: cx("ha-line", "ha-line-" + (p.tint || "ink")), d: d, pathLength: 1, style: { strokeWidth: 2 } }));
  }
  function Donut(p) {
    var data = p.data || [], size = p.size || 168, sw = p.stroke || 22, r = (size - sw) / 2, c = 2 * Math.PI * r, total = data.reduce(function (a, d) { return a + d.value; }, 0) || 1, on = useMounted(150), acc = 0, gap = data.length > 1 ? 6 : 0;
    return h("div", { className: "ha-donut", style: { gap: 24 } },
      h("div", { className: "ha-ring", style: { width: size, height: size } },
        h("svg", { width: size, height: size, viewBox: "0 0 " + size + " " + size, role: "img", "aria-label": p.label || L("Breakdown") },
          h("circle", { className: "ha-arc-track", cx: size / 2, cy: size / 2, r: r, strokeWidth: sw }),
          data.map(function (d, i) {
            var len = Math.max(0, c * d.value / total - gap), off = acc; acc += c * d.value / total;
            return h("circle", { key: i, className: cx("ha-arc", "ha-arc-" + (d.tint || "ink")), cx: size / 2, cy: size / 2, r: r, strokeWidth: sw, strokeDasharray: (on || reduced() ? len : 0) + " " + c, strokeDashoffset: -off, style: { transition: "stroke-dasharray var(--dur-slow) var(--ease-out) " + (i * 90) + "ms" } });
          })),
        p.center && h("span", { className: "ha-ring-label" }, h("span", null, h(CountUp, { value: p.center }), p.caption && h("small", null, p.caption)))),
      p.legend !== false && h("div", { className: "ha-col ha-donut-legend", style: { gap: 12 } }, data.map(function (d, i) { return h("div", { key: i, className: "ha-legend", style: { justifyContent: "space-between" } }, h("span", null, h("i", { style: { background: (d.tint || "ink") === "ink" ? "var(--accent)" : "var(--" + d.tint + "-ink)" } }), d.label), h("b", { style: { color: "var(--ink)" } }, Math.round(d.value / total * 100) + "%")); })));
  }
  function Skeleton(p) {
    var v = p.variant || "text";
    return h("span", { className: cx("ha-skel", "ha-skel-" + v, p.className), "aria-hidden": true, style: { width: p.width, height: p.height || (v === "circle" ? p.width : undefined) } });
  }

  /* ── Overlays & feedback ── */
  function Menu(p) {
    return h("div", { className: "ha-menu", role: "menu" }, (p.items || []).map(function (it, i) {
      if (it === "-") return h("div", { key: i, className: "ha-menu-sep", role: "separator" });
      return h("button", { key: i, type: "button", role: "menuitem", className: cx("ha-menu-item", it.danger && "danger"), onClick: it.onClick }, it.icon && h(Icon, { name: it.icon, size: 15 }), it.label, it.shortcut && h("kbd", null, it.shortcut));
    }));
  }
  function Modal(p) {
    return h("div", { className: "ha-modal-wrap", style: p.style }, h("div", { className: "ha-backdrop", "aria-hidden": true }),
      h("div", { className: "ha-modal", role: "dialog", "aria-modal": "true", "aria-label": p.title },
        h("span", { className: "ha-modal-close" }, h(IconButton, { icon: "x", label: L("Close"), size: "sm", onClick: p.onClose })),
        p.icon && h(TintIcon, { icon: p.icon, tint: p.tint || "sky", size: 40 }),
        h("div", null, h("h2", { className: "ha-modal-title" }, p.title), p.text && h("p", { className: "ha-modal-text", style: { marginTop: 6 } }, p.text)),
        p.children,
        p.actions && h("div", { className: "ha-modal-foot" }, p.actions)));
  }
  function Toast(p) {
    return h("div", { className: "ha-toast", role: "status" }, h(TintIcon, { icon: p.icon || "check", tint: p.tint || "mint" }), p.children, p.action && h(Button, { variant: "soft", size: "sm", onClick: p.onAction }, p.action));
  }
  function EmptyState(p) {
    return h("div", { className: "ha-empty ha-in" }, h(TintIcon, { icon: p.icon || "sparkle", tint: p.tint || "sky", size: 44 }), h("p", { className: "ha-empty-title" }, p.title), p.text && h("p", { className: "ha-empty-text" }, p.text), p.action);
  }

  /* ── Shells, overlays and workspace building blocks ── */
  var FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function useTrap(ref, onClose) {
    React.useEffect(function () {
      var root = ref.current, before = document.activeElement;
      if (!root) return;
      if (!root.contains(document.activeElement)) { var auto = root.querySelector('[autofocus], input:not([type="checkbox"]), textarea') || root.querySelector(FOCUSABLE); if (auto && auto.focus) auto.focus(); }
      function k(e) {
        if (e.key === 'Escape' && onClose) { onClose(); return; }
        if (e.key !== 'Tab') return;
        var els = Array.prototype.filter.call(root.querySelectorAll(FOCUSABLE), function (x) { return x.offsetParent !== null; }); if (!els.length) return;
        var a = els[0], z = els[els.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
      root.addEventListener('keydown', k);
      return function () { root.removeEventListener('keydown', k); if (before && before.focus && document.contains(before)) before.focus(); };
    }, []);
  }
  function SubNav(p) {
    return h("nav", { className: "ha-subnav", "aria-label": L("{section} pages", { section: p.eyebrow || L("Section") }) },
      h("div", { className: "ha-subnav-head" }, p.eyebrow && h("span", { className: "ha-subnav-eyebrow" }, p.eyebrow), p.action && h("button", { type: "button", className: "ha-subnav-action", onClick: p.action.onClick }, h(Icon, { name: p.action.icon || "plus", size: 15 }), h("span", null, p.action.label))),
      h("div", { className: "ha-subnav-list" }, (p.items || []).map(function (it) {
        var id = it.id || it.label;
        return h("button", { key: id, type: "button", className: "ha-subnav-item", "aria-current": p.current === id ? "page" : undefined, title: it.label, onClick: function () { p.onPick && p.onPick(id); } }, h(Icon, { name: it.icon, size: 17 }), h("span", { className: "ha-subnav-label" }, it.label), it.count ? h("span", { className: "ha-subnav-count" }, it.count) : null);
      })), p.children);
  }
  function Drawer(p) {
    var ref = React.useRef(null); useTrap(ref, p.onClose);
    return h("div", { className: cx("ha-drawer-wrap", p.inline && "inline"), onMouseDown: function (e) { if (e.target === e.currentTarget && p.onClose) p.onClose(); } },
      h("aside", { ref: ref, className: "ha-drawer", role: "dialog", "aria-modal": "true", "aria-label": p.title, style: p.width ? { width: p.width } : undefined },
        h("div", { className: "ha-header", style: { alignItems: "center" } }, h("div", { className: "ha-row", style: { flexWrap: "nowrap", minWidth: 0 } }, p.avatar && h(Avatar, { name: p.avatar, size: 44 }), h("div", { style: { minWidth: 0 } }, h("div", { className: "ha-panel-title" }, p.title), p.subtitle && h("div", { className: "ha-panel-sub" }, p.subtitle))), h(IconButton, { icon: "x", label: L("Close"), onClick: p.onClose })),
        p.children));
  }
  function CommandPalette(p) {
    var q = React.useState(""), idx = React.useState(0), ref = React.useRef(null); useTrap(ref, p.onClose);
    var ql = q[0].toLowerCase().trim(), all = p.items || [];
    var res = (ql ? all.filter(function (it) { return ql.split(/\s+/).every(function (w) { return (it.label + " " + (it.hint || "") + " " + (it.group || "")).toLowerCase().indexOf(w) > -1; }); }) : all.filter(function (it) { return !it.searchOnly; })).slice(0, 40);
    var cur = Math.min(idx[0], Math.max(0, res.length - 1));
    function run(it) { if (p.onClose) p.onClose(); if (it && it.run) it.run(); }
    function key(e) { if (e.key === "ArrowDown") { e.preventDefault(); idx[1](Math.min(res.length - 1, cur + 1)); } else if (e.key === "ArrowUp") { e.preventDefault(); idx[1](Math.max(0, cur - 1)); } else if (e.key === "Enter") { e.preventDefault(); run(res[cur]); } }
    var groups = []; res.forEach(function (it, i) { var g = it.group || L("Results"); if (!groups.length || groups[groups.length - 1].g !== g) groups.push({ g: g, items: [] }); groups[groups.length - 1].items.push([it, i]); });
    return h("div", { className: cx("ha-palette-wrap", p.inline && "inline"), onMouseDown: function (e) { if (e.target === e.currentTarget && p.onClose) p.onClose(); } },
      h("div", { ref: ref, className: "ha-palette", role: "dialog", "aria-modal": "true", "aria-label": L("Command palette") },
        h("div", { className: "ha-palette-input" }, h(Icon, { name: "search", size: 18 }), h("input", { placeholder: p.placeholder || L("Search pages, actions and records…"), "aria-label": L("Search"), value: q[0], onChange: function (e) { q[1](e.target.value); idx[1](0); }, onKeyDown: key }), h("kbd", null, "Esc")),
        h("div", { className: "ha-palette-list", role: "listbox" }, res.length ? groups.map(function (g) { return h("div", { key: g.g }, h("div", { className: "ha-palette-group" }, g.g), g.items.map(function (pair) { var it = pair[0], i = pair[1]; return h("button", { key: it.id || it.label, type: "button", role: "option", "aria-selected": i === cur ? "true" : "false", className: "ha-palette-item", onMouseMove: function () { if (i !== cur) idx[1](i); }, onClick: function () { run(it); } }, h(TintIcon, { icon: it.icon || "search", tint: it.tint || "plain" }), h("span", { className: "ha-palette-label" }, h("b", null, it.label), it.hint && h("span", null, it.hint)), i === cur && h("kbd", null, "↵")); })); }) : h("div", { className: "ha-palette-empty" }, L("Nothing matches “{query}”.", { query: q[0] }))),
        h("div", { className: "ha-palette-foot" }, h("span", null, h("kbd", null, "↑"), h("kbd", null, "↓"), " ", L("move")), h("span", null, h("kbd", null, "↵"), " ", L("open")), h("span", null, h("kbd", null, "⌘"), h("kbd", null, "K"), L(" anywhere")))));
  }
  function NotificationList(p) {
    var f = React.useState(L("All")), items = (p.items || []).filter(function (n) { return f[0] === L("All") || n.unread; });
    return h("div", { className: "ha-notes", role: "region", "aria-label": L("Notifications") },
      h("div", { className: "ha-header", style: { alignItems: "center", padding: "6px 8px 0" } }, h("b", { style: { fontSize: 16 } }, L("Notifications")), h(Button, { variant: "ghost", size: "sm", icon: "check", disabled: !(p.items || []).some(function (n) { return n.unread; }), onClick: p.onReadAll }, L("Mark all read"))),
      h("div", { style: { padding: "0 8px" } }, h(Tabs, { block: true, items: [L("All"), L("Unread")], value: f[0], onChange: f[1] })),
      h("div", { className: "ha-notes-list" }, items.length ? items.map(function (n) { return h("button", { key: n.id, type: "button", className: cx("ha-note", n.unread && "unread"), onClick: function () { p.onOpen && p.onOpen(n); } }, h(TintIcon, { icon: n.icon, tint: n.tint }), h("span", { className: "ha-note-text" }, h("b", null, n.title), h("span", null, n.text)), h("span", { className: "ha-note-time" }, n.time, n.unread && h("span", { className: "ha-unread" }))); }) : h("div", { className: "ha-notes-empty" }, h(TintIcon, { icon: "check", tint: "mint", size: 40 }), h("b", null, L("You are all caught up")))));
  }
  var STEP = { trigger: ["zap", "sky", L("When")], condition: ["filter", "blush", L("If")], agent: ["bot", "lilac", L("Agent")], approval: ["user", "butter", L("Approval")], action: ["send", "mint", L("Then")] };
  function Flow(p) {
    return h("ol", { className: "ha-flow ha-stagger", style: { "--base": "120ms" } }, (p.steps || []).map(function (s, i) {
      var k = STEP[s.kind] || STEP.action, st = i < (p.active == null ? -1 : p.active) ? "done" : i === p.active ? (p.waiting ? "wait" : "active") : "";
      return h("li", { key: i, className: cx("ha-flow-node", st) }, h("span", { className: "ha-flow-icon ha-t-" + k[1] }, h(Icon, { name: st === "done" ? "check" : k[0], size: 16 })),
        h("div", { className: "ha-flow-card" }, h("div", { className: "ha-flow-kind" }, k[2], st === "active" && h("span", { className: "ha-flow-live" }, "running"), st === "wait" && h("span", { className: "ha-flow-live wait" }, L("waiting for you"))), h("div", { className: "ha-flow-text" }, s.text), st === "wait" && p.onApprove && h("div", { className: "ha-row", style: { marginTop: 8 } }, h(Button, { size: "sm", icon: "check", onClick: p.onApprove }, L("Approve")), p.onReject && h(Button, { size: "sm", variant: "ghost", onClick: p.onReject }, L("Reject")))),
        p.tools && st === "" ? h("div", { className: "ha-flow-tools" }, p.tools(s, i)) : null);
    }));
  }
  var FILE_KIND = { pdf: ["file", "blush"], doc: ["book", "sky"], sheet: ["chart", "mint"], fig: ["sparkle", "lilac"], img: ["eye", "butter"], zip: ["folder", "butter"] };
  function FileThumb(p) {
    var f = p.kind, big = p.big;
    if (f === "sheet") return h("span", { className: "ha-t-sheet" }, Array.from({ length: big ? 7 : 4 }, function (_, r) { return h("span", { key: r }, Array.from({ length: 4 }, function (_, c) { return h("i", { key: c, style: { opacity: r === 0 ? 1 : .55 } }); })); }));
    if (f === "img" || f === "fig") return h("span", { className: cx("ha-t-art", f === "fig" && "fig") }, h("i"), h("i"), h("i"));
    if (f === "zip") return h("span", { className: "ha-t-zip" }, (p.entries || ["logo.svg", "colors.json", "fonts/"]).map(function (x) { return h("span", { key: x }, h(Icon, { name: "file", size: 11 }), x); }));
    return h("span", { className: "ha-t-doc" }, h("b", null, (p.title || "").replace(/\.[^.]+$/, "")), Array.from({ length: big ? 9 : 4 }, function (_, i) { return h("i", { key: i, style: { width: (60 + (i * 37) % 40) + "%" } }); }));
  }
  function FileCard(p) {
    var k = FILE_KIND[p.kind] || FILE_KIND.doc;
    return h("button", { type: "button", className: "ha-filecard", onClick: p.onClick }, h("span", { className: "ha-thumb ha-bg-" + k[1] }, h(FileThumb, { kind: p.kind, title: p.name })), h("span", { className: "ha-filecard-name" }, p.name), h("span", { className: "ha-filecard-meta" }, [p.size, p.meta].filter(Boolean).join(" · "), p.shared && h(Icon, { name: "users", size: 12, label: L("Shared") })));
  }
  function Wizard(p) {
    var steps = p.steps || [], cur = p.current || 0, done = p.done || {};
    return h("div", { className: "ha-wizard", role: "group", "aria-label": p.label || L("Setup") },
      h("aside", { className: "ha-wizard-rail" }, h("span", { className: "ha-brand", style: { color: "var(--on-frame)" } }, p.brand || L("Halo"), h("span", { className: "ha-brand-dot" })), h("ol", null, steps.map(function (s, j) { var ok = done[s.id || j]; return h("li", { key: j }, h("button", { type: "button", className: cx("ha-wizard-step", j === cur && "cur", ok && "ok"), "aria-current": j === cur ? "step" : undefined, onClick: function () { p.onPick && p.onPick(j); } }, h("span", null, ok ? h(Icon, { name: "check", size: 12 }) : j + 1), s.label)); }))),
      h("div", { className: "ha-wizard-main" }, h("div", { className: "ha-card-desc" }, L("Step {n} of {total}", { n: cur + 1, total: steps.length })), h("div", { key: cur, className: "ha-wizard-body" }, steps[cur] && steps[cur].icon && h(TintIcon, { icon: steps[cur].icon, tint: "sky", size: 44 }), steps[cur] && h("h2", { className: "ha-modal-title" }, steps[cur].label), p.children), p.footer && h("div", { className: "ha-modal-foot", style: { justifyContent: "space-between" } }, p.footer)));
  }
  var LEVELS = [L("None"), L("View"), L("Edit"), L("Full")];
  function PermissionMatrix(p) {
    return h("div", { className: "ha-scroll" }, h("table", { className: "ha-table ha-perm" },
      h("thead", null, h("tr", null, h("th", null, L("Role")), (p.areas || []).map(function (a) { return h("th", { key: a }, a); }))),
      h("tbody", { className: "ha-stagger", style: { "--base": "120ms" } }, (p.roles || []).map(function (r, ri) {
        return h("tr", { key: r.name }, h("td", null, h("div", { style: { fontWeight: 700 } }, r.name), r.people != null && h("div", { className: "ha-card-desc" }, L(r.people === 1 ? "{n} member" : "{n} members", { n: r.people }))),
          r.levels.map(function (lv, ai) { return h("td", { key: ai }, h("button", { type: "button", className: "ha-perm-cell lv" + lv, disabled: r.locked, "aria-label": r.name + " · " + p.areas[ai] + ": " + LEVELS[lv], onClick: function () { p.onChange && p.onChange(ri, ai, (lv + 1) % 4); } }, LEVELS[lv])); }));
      }))));
  }
  function money2(n) { return fmtMoney(n, null, { minimumFractionDigits: 2 }); }
  function InvoicePreview(p) {
    var lines = p.lines || [], net = 0, vat = {};
    lines.forEach(function (l) { var x = l.q * l.u; net += x; vat[l.v] = (vat[l.v] || 0) + x * l.v / 100; });
    var tax = 0; Object.keys(vat).forEach(function (k) { tax += vat[k]; });
    var fmt = p.format || money2;
    return h("div", { className: "ha-paper" },
      h("div", { className: "ha-paper-top" }, h("div", null, h("div", { className: "ha-brand", style: { color: "var(--ink)", fontSize: 18 } }, p.brand || L("Halo"), h("span", { className: "ha-brand-dot" })), p.from && h("div", { className: "ha-paper-small" }, p.from)), h("div", { style: { textAlign: "right" } }, h("div", { className: "ha-paper-kind" }, p.kind || L("Invoice")), h("div", { className: "ha-mono" }, "#" + p.number))),
      h("div", { className: "ha-paper-meta" }, h("div", null, h("span", null, L("Bill to")), h("b", null, p.to)), h("div", null, h("span", null, L("Issued")), h("b", null, p.issued)), h("div", null, h("span", null, L("Due")), h("b", null, p.due))),
      h("div", { className: "ha-paper-lines" }, lines.map(function (l, i) { return h("div", { key: i }, h("span", null, (l.d || L("Untitled line")) + (l.q !== 1 ? " × " + l.q : "")), h("b", null, fmt(l.q * l.u))); })),
      h("div", { className: "ha-paper-totals" }, h("div", null, h("span", null, L("Net")), h("b", null, fmt(net))), Object.keys(vat).filter(function (k) { return +k > 0; }).map(function (k) { return h("div", { key: k }, h("span", null, L("VAT {rate}%", { rate: k })), h("b", null, fmt(vat[k]))); }), h("div", { className: "grand" }, h("span", null, L("Total due")), h("b", null, fmt(net + tax)))),
      p.note && h("div", { className: "ha-paper-small" }, p.note));
  }
  function TransactionRow(p) {
    var open = React.useState(false), inc = p.amount > 0;
    return h("div", { className: cx("ha-tx", !p.matched && "unmatched") },
      h("div", { className: "ha-tx-row" }, h(TintIcon, { icon: inc ? "download" : "send", tint: inc ? "mint" : "plain" }),
        h("div", { className: "ha-tx-text" }, h("b", { className: "ha-mono" }, p.text), h("span", null, p.date + (p.matched && p.matchRef ? L(" · matched to {ref}", { ref: p.matchRef }) : ""))),
        h("b", { className: cx("ha-tx-amt", inc ? "in" : "out") }, (inc ? "+" : "−") + money2(Math.abs(p.amount))),
        p.matched ? h(Badge, { tone: "success" }, L("Matched")) : h(Button, { size: "sm", variant: open[0] ? "soft" : "primary", onClick: function () { open[1](!open[0]); } }, open[0] ? L("Close") : L("Match"))),
      open[0] && !p.matched && h("div", { className: "ha-tx-suggest ha-in" }, h(TintIcon, { icon: "bot", tint: "butter" }), h("span", { style: { flex: 1, minWidth: 0 } }, p.hint || L("No suggestion yet.")), h(Button, { size: "sm", icon: "check", onClick: function () { open[1](false); p.onMatch && p.onMatch(); } }, L("Accept"))));
  }

  /* ════════ Kit 2: forms, overlays, data table, more charts ════════ */
  var uid = 0; function useId(prefix) { var r = React.useRef(null); if (!r.current) r.current = (prefix || "ha") + "-" + (++uid); return r.current; }
  function useOutside(ref, open, close) {
    React.useEffect(function () {
      if (!open) return;
      function down(e) { if (ref.current && !ref.current.contains(e.target)) close(); }
      function key(e) { if (e.key === "Escape") { close(); } }
      document.addEventListener("pointerdown", down); document.addEventListener("keydown", key);
      return function () { document.removeEventListener("pointerdown", down); document.removeEventListener("keydown", key); };
    }, [open]);
  }
  function useControlled(value, def, onChange) {
    var st = React.useState(def); var v = value !== undefined ? value : st[0];
    return [v, function (n) { if (value === undefined) st[1](n); onChange && onChange(n); }];
  }

  /* ── Form field shell: label, required mark, hint, error or success ── */
  function FormField(p) {
    var id = p.id;
    return h("div", { className: cx("ha-field", p.className), style: p.style },
      p.label && h("label", { className: "ha-field-label", htmlFor: id }, p.label, p.required && h("span", { className: "ha-req", "aria-hidden": true }, " *"), p.optional && h("span", { className: "ha-opt" }, " ", L("optional"))),
      p.children,
      p.error ? h("span", { className: "ha-field-error", role: "alert" }, h(Icon, { name: "x", size: 12 }), p.error)
        : p.success ? h("span", { className: "ha-field-success" }, h(Icon, { name: "check", size: 12 }), p.success)
        : p.hint && h("span", { className: "ha-field-hint" }, p.hint));
  }
  function TextField(p) {
    var id = useId("tf");
    return h(FormField, { id: id, label: p.label, required: p.required, optional: p.optional, hint: p.hint, error: p.error, success: p.success },
      h("span", { className: cx("ha-inputwrap", p.icon && "has-icon", (p.error || p.success || p.suffix) && "has-suffix") },
        p.icon && h(Icon, { name: p.icon, size: 15, className: "ha-input-icon" }),
        h("input", { id: id, className: cx("ha-input", p.success && "is-valid"), type: p.type || "text", placeholder: p.placeholder, value: p.value, defaultValue: p.defaultValue, onChange: p.onChange, onBlur: p.onBlur, required: p.required, disabled: p.disabled, "aria-invalid": p.error ? "true" : undefined, autoComplete: p.autoComplete }),
        p.error ? h("span", { className: "ha-input-suffix err" }, h(Icon, { name: "x", size: 14 })) : p.success ? h("span", { className: "ha-input-suffix ok" }, h(Icon, { name: "check", size: 14 })) : p.suffix && h("span", { className: "ha-input-suffix" }, p.suffix)));
  }

  /* ── Choice ── */
  function RadioGroup(p) {
    var name = useId("rg"), v = useControlled(p.value, p.defaultValue, p.onChange);
    return h("fieldset", { className: cx("ha-radiogroup", p.cards && "cards", p.className) },
      p.label && h("legend", { className: "ha-field-label" }, p.label),
      h("div", { className: "ha-radiogroup-items" }, (p.options || []).map(function (o) {
        var opt = typeof o === "string" ? { value: o, label: o } : o, on = v[0] === opt.value;
        return h("label", { key: opt.value, className: cx("ha-radio", on && "on", opt.disabled && "disabled") },
          h("input", { type: "radio", name: name, value: opt.value, checked: on, disabled: opt.disabled, onChange: function () { v[1](opt.value); } }),
          h("span", { className: "ha-radio-dot", "aria-hidden": true }),
          h("span", { className: "ha-radio-text" }, h("b", null, opt.label), opt.hint && h("small", null, opt.hint)));
      })),
      p.hint && h("span", { className: "ha-field-hint" }, p.hint));
  }
  function Segmented(p) {
    var v = useControlled(p.value, p.defaultValue != null ? p.defaultValue : (p.options || [])[0] && ((p.options[0].value != null) ? p.options[0].value : p.options[0]), p.onChange), name = useId("seg");
    return h("div", { className: cx("ha-seg", p.size === "sm" && "sm", p.block && "block", p.className), role: "radiogroup", "aria-label": p.label },
      (p.options || []).map(function (o) {
        var opt = typeof o === "string" ? { value: o, label: o } : o, on = v[0] === opt.value;
        return h("label", { key: opt.value, className: cx("ha-seg-item", on && "on") },
          h("input", { type: "radio", name: name, checked: on, onChange: function () { v[1](opt.value); } }),
          opt.icon && h(Icon, { name: opt.icon, size: 14 }), opt.label);
      }));
  }

  /* ── Popover & Tooltip ── */
  function Popover(p) {
    var ref = React.useRef(null), st = useControlled(p.open, false, p.onOpenChange);
    useOutside(ref, st[0], function () { st[1](false); });
    var trigger = typeof p.trigger === "function" ? p.trigger({ open: st[0], toggle: function () { st[1](!st[0]); } }) : h("span", { onClick: function () { st[1](!st[0]); } }, p.trigger);
    return h("span", { ref: ref, className: cx("ha-pop-anchor", p.block && "block", p.className) }, trigger,
      st[0] && h("div", { className: cx("ha-popover", "ha-pop-" + (p.align || "start"), p.side === "top" && "top", p.flush && "flush"), role: p.role || "dialog", style: { width: p.width } },
        typeof p.children === "function" ? p.children({ close: function () { st[1](false); } }) : p.children));
  }
  function Tooltip(p) {
    var id = useId("tip"), st = React.useState(false), t = React.useRef(null);
    function show() { clearTimeout(t.current); t.current = setTimeout(function () { st[1](true); }, 350); }
    function hide() { clearTimeout(t.current); st[1](false); }
    var child = React.Children.only(p.children);
    return h("span", { className: "ha-tip-anchor", onPointerEnter: show, onPointerLeave: hide, onFocus: function () { st[1](true); }, onBlur: hide, onKeyDown: function (e) { if (e.key === "Escape") hide(); } },
      React.cloneElement(child, { "aria-describedby": st[0] ? id : undefined }),
      st[0] && h("span", { id: id, role: "tooltip", className: cx("ha-tooltip", "ha-tip-" + (p.side || "top")) }, p.label, p.shortcut && h("kbd", null, p.shortcut)));
  }

  /* ── Combobox (single or multi, searchable) ── */
  function norm(o) { return typeof o === "string" ? { value: o, label: o } : o; }
  function Combobox(p) {
    var multi = !!p.multiple, opts = (p.options || []).map(norm), id = useId("cb");
    var v = useControlled(p.value, p.defaultValue != null ? p.defaultValue : (multi ? [] : null), p.onChange);
    var q = React.useState(""), open = React.useState(false), act = React.useState(0), ref = React.useRef(null), inp = React.useRef(null);
    useOutside(ref, open[0], function () { open[1](false); q[1](""); });
    var sel = multi ? (v[0] || []) : v[0];
    var list = opts.filter(function (o) { return !q[0] || o.label.toLowerCase().indexOf(q[0].toLowerCase()) >= 0; });
    var canCreate = p.creatable && q[0].trim() && !opts.some(function (o) { return o.label.toLowerCase() === q[0].trim().toLowerCase(); });
    function isOn(o) { return multi ? sel.indexOf(o.value) >= 0 : sel === o.value; }
    function pick(o) {
      if (multi) { v[1](isOn(o) ? sel.filter(function (x) { return x !== o.value; }) : sel.concat([o.value])); q[1](""); inp.current && inp.current.focus(); }
      else { v[1](o.value); open[1](false); q[1](""); }
    }
    function key(e) {
      var n = list.length + (canCreate ? 1 : 0);
      if (e.key === "ArrowDown") { e.preventDefault(); open[1](true); act[1](Math.min(n - 1, act[0] + 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); act[1](Math.max(0, act[0] - 1)); }
      else if (e.key === "Enter") { e.preventDefault(); if (!open[0]) return open[1](true); if (act[0] < list.length) pick(list[act[0]]); else if (canCreate) pick({ value: q[0].trim(), label: q[0].trim() }); }
      else if (e.key === "Backspace" && multi && !q[0] && sel.length) v[1](sel.slice(0, -1));
    }
    var labelOf = function (val) { var o = opts.find(function (x) { return x.value === val; }); return o ? o.label : val; };
    return h(FormField, { id: id, label: p.label, required: p.required, hint: p.hint, error: p.error, className: p.className },
      h("div", { ref: ref, className: cx("ha-combo", open[0] && "open", p.error && "invalid") },
        h("div", { className: "ha-combo-box", onClick: function () { open[1](true); inp.current && inp.current.focus(); } },
          multi && sel.map(function (val) { return h("span", { key: val, className: "ha-token" }, labelOf(val), h("button", { type: "button", "aria-label": L("Remove {name}", { name: labelOf(val) }), onClick: function (e) { e.stopPropagation(); v[1](sel.filter(function (x) { return x !== val; })); } }, h(Icon, { name: "x", size: 12 }))); }),
          h("input", { ref: inp, id: id, role: "combobox", "aria-expanded": open[0], "aria-controls": id + "-list", "aria-autocomplete": "list", autoComplete: "off", className: "ha-combo-input",
            placeholder: multi ? (sel.length ? "" : p.placeholder) : (sel != null && !q[0] ? labelOf(sel) : p.placeholder || L("Select…")),
            value: q[0], onChange: function (e) { q[1](e.target.value); open[1](true); act[1](0); }, onFocus: function () { open[1](true); }, onKeyDown: key,
            style: !multi && sel != null && !q[0] ? { "--ph": "var(--ink)" } : undefined }),
          h("span", { className: "ha-combo-chev" }, h(Icon, { name: "chevronDown", size: 15 }))),
        open[0] && h("div", { className: "ha-popover ha-combo-pop", id: id + "-list", role: "listbox", "aria-multiselectable": multi || undefined },
          list.length === 0 && !canCreate && h("div", { className: "ha-combo-empty" }, L("No matches")),
          list.map(function (o, i) {
            return h("div", { key: o.value, role: "option", "aria-selected": isOn(o), className: cx("ha-option", i === act[0] && "active", isOn(o) && "on"), onPointerDown: function (e) { e.preventDefault(); }, onClick: function () { pick(o); }, onPointerEnter: function () { act[1](i); } },
              o.avatar && h(Avatar, { name: o.label, size: 24 }), o.icon && h(Icon, { name: o.icon, size: 15 }),
              h("span", { className: "ha-option-text" }, o.label, o.hint && h("small", null, o.hint)),
              isOn(o) && h(Icon, { name: "check", size: 15, className: "ha-option-check" }));
          }),
          canCreate && h("div", { role: "option", className: cx("ha-option", act[0] === list.length && "active"), onPointerDown: function (e) { e.preventDefault(); }, onClick: function () { pick({ value: q[0].trim(), label: q[0].trim() }); } }, h(Icon, { name: "plus", size: 15 }), h("span", { className: "ha-option-text" }, L("Create “{name}”", { name: q[0].trim() }))))));
  }
  function TagInput(p) {
    var v = useControlled(p.value, p.defaultValue || [], p.onChange), q = React.useState(""), id = useId("tag");
    function add(t) { t = t.trim().replace(/,$/, ""); if (t && v[0].indexOf(t) < 0) v[1](v[0].concat([t])); q[1](""); }
    return h(FormField, { id: id, label: p.label, hint: p.hint, error: p.error },
      h("div", { className: "ha-combo-box ha-tags", onClick: function (e) { var i = e.currentTarget.querySelector("input"); i && i.focus(); } },
        v[0].map(function (t) { return h("span", { key: t, className: "ha-token" }, t, h("button", { type: "button", "aria-label": L("Remove {name}", { name: t }), onClick: function () { v[1](v[0].filter(function (x) { return x !== t; })); } }, h(Icon, { name: "x", size: 12 }))); }),
        h("input", { id: id, className: "ha-combo-input", placeholder: v[0].length ? "" : (p.placeholder || L("Type and press Enter")), value: q[0],
          onChange: function (e) { var s = e.target.value; if (/,$/.test(s)) add(s); else q[1](s); },
          onKeyDown: function (e) { if (e.key === "Enter") { e.preventDefault(); add(q[0]); } else if (e.key === "Backspace" && !q[0] && v[0].length) v[1](v[0].slice(0, -1)); },
          onBlur: function () { q[0] && add(q[0]); } })));
  }

  /* ── Date picker (single or range, with presets) ── */
  function monthName(d) { return fmtDate(d, { month: "long", year: "numeric" }); }
  function weekdays() { var out = [], base = new Date(2024, 0, 1); for (var i = 0; i < 7; i++) { var d = new Date(2024, 0, 1 + ((LOCALE.weekStart + i - 1) % 7)); out.push(fmtDate(d, { weekday: "short" })); } return out; }
  function d0(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function same(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function fmtD(d) { return d ? fmtDate(d) : ""; }
  function addD(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function Calendar(p) {
    var today = d0(p.today || new Date()), sv = p.range ? p.value && p.value.from : p.value, base = p.month || (sv instanceof Date ? sv : null) || today;
    var m = React.useState(new Date(base.getFullYear(), base.getMonth(), 1)), hov = React.useState(null);
    var first = m[0], start = addD(first, -((first.getDay() - LOCALE.weekStart + 7) % 7)), days = [];
    for (var i = 0; i < 42; i++) days.push(addD(start, i));
    var from = p.range ? p.value && p.value.from : p.value, to = p.range ? (p.value && p.value.to) || (from && hov[0] && hov[0] > from ? hov[0] : null) : null;
    function move(n) { m[1](new Date(first.getFullYear(), first.getMonth() + n, 1)); }
    return h("div", { className: "ha-cal" },
      h("div", { className: "ha-cal-head" }, h(IconButton, { icon: "chevronLeft", label: L("Previous month"), size: "sm", variant: "soft", onClick: function () { move(-1); } }),
        h("b", null, monthName(first)), h(IconButton, { icon: "chevronRight", label: L("Next month"), size: "sm", variant: "soft", onClick: function () { move(1); } })),
      h("div", { className: "ha-cal-grid", role: "grid" },
        weekdays().map(function (w, i) { return h("span", { key: i, className: "ha-cal-wd" }, w); }),
        days.map(function (d) {
          var out = d.getMonth() !== first.getMonth(), isFrom = same(d, from), isTo = same(d, to), inR = from && to && d > from && d < to;
          var dis = (p.min && d < d0(p.min)) || (p.max && d > d0(p.max));
          return h("button", { key: +d, type: "button", disabled: dis, className: cx("ha-cal-day", out && "out", same(d, today) && "today", (isFrom || isTo) && "sel", inR && "inrange", isFrom && to && "start", isTo && from && "end"),
            "aria-pressed": isFrom || isTo, "aria-label": fmtD(d), onPointerEnter: function () { p.range && hov[1](d); },
            onClick: function () {
              if (!p.range) return p.onChange(d);
              if (!from || (from && p.value.to) || d < from) p.onChange({ from: d, to: null }); else p.onChange({ from: from, to: d });
            } }, d.getDate());
        })));
  }
  function DatePicker(p) {
    var id = useId("dp"), v = useControlled(p.value, p.defaultValue || (p.range ? { from: null, to: null } : null), p.onChange), today = d0(p.today || new Date());
    var presets = p.presets !== false && p.range ? [[L("Last 7 days"), -6], [L("Last 30 days"), -29], [L("Last 90 days"), -89], [L("This year"), "y"]] : null;
    var txt = p.range ? (v[0] && v[0].from ? fmtD(v[0].from) + " – " + (v[0].to ? fmtD(v[0].to) : "…") : "") : fmtD(v[0]);
    return h(FormField, { id: id, label: p.label, required: p.required, hint: p.hint, error: p.error, className: p.className },
      h(Popover, { block: true, width: presets ? 476 : 304, trigger: function (s) {
        return h("button", { id: id, type: "button", className: cx("ha-input ha-picker", !txt && "empty"), "aria-haspopup": "dialog", "aria-expanded": s.open, onClick: s.toggle }, h(Icon, { name: "calendar", size: 15 }), h("span", null, txt || p.placeholder || (p.range ? L("Pick a range") : L("Pick a date"))));
      } }, function (s) {
        return h("div", { className: cx("ha-dp", presets && "with-presets") },
          presets && h("div", { className: "ha-dp-presets" }, presets.map(function (pr) {
            var from = pr[1] === "y" ? new Date(today.getFullYear(), 0, 1) : addD(today, pr[1]);
            var on = v[0] && same(v[0].from, from) && same(v[0].to, today);
            return h("button", { key: pr[0], type: "button", className: cx("ha-dp-preset", on && "on"), onClick: function () { v[1]({ from: from, to: today }); s.close(); } }, pr[0]);
          })),
          h(Calendar, { range: p.range, value: v[0], today: today, min: p.min, max: p.max, onChange: function (n) { v[1](n); if (!p.range || n.to) s.close(); } }));
      }));
  }

  /* ── Number, slider, OTP, upload ── */
  function NumberInput(p) {
    var id = useId("num"), v = useControlled(p.value, p.defaultValue != null ? p.defaultValue : 0, p.onChange), step = p.step || 1;
    function set(n) { if (p.min != null) n = Math.max(p.min, n); if (p.max != null) n = Math.min(p.max, n); v[1](Math.round(n * 1000) / 1000); }
    return h(FormField, { id: id, label: p.label, hint: p.hint, error: p.error },
      h("div", { className: "ha-number" },
        h(IconButton, { icon: "minus", label: L("Decrease"), size: "sm", disabled: p.min != null && v[0] <= p.min, onClick: function () { set(v[0] - step); } }),
        h("input", { id: id, className: "ha-number-input", inputMode: "decimal", value: v[0], onChange: function (e) { var n = parseFloat(e.target.value); if (!isNaN(n)) set(n); else if (e.target.value === "") v[1](0); },
          onKeyDown: function (e) { if (e.key === "ArrowUp") { e.preventDefault(); set(v[0] + step); } if (e.key === "ArrowDown") { e.preventDefault(); set(v[0] - step); } } }),
        p.unit && h("span", { className: "ha-number-unit" }, p.unit),
        h(IconButton, { icon: "plus", label: L("Increase"), size: "sm", disabled: p.max != null && v[0] >= p.max, onClick: function () { set(v[0] + step); } })));
  }
  function Slider(p) {
    var id = useId("sl"), min = p.min || 0, max = p.max != null ? p.max : 100, v = useControlled(p.value, p.defaultValue != null ? p.defaultValue : min, p.onChange);
    var pct = (v[0] - min) / (max - min) * 100, f = p.format || String;
    return h(FormField, { id: id, label: p.label, hint: p.hint },
      h("div", { className: "ha-slider" },
        h("div", { className: "ha-slider-track" }, h("input", { id: id, type: "range", min: min, max: max, step: p.step || 1, value: v[0], onChange: function (e) { v[1](+e.target.value); }, style: { "--pct": pct + "%" }, "aria-valuetext": f(v[0]) }),
          h("span", { className: "ha-slider-val", style: { left: "calc(" + pct + "% + " + (10 - pct * 0.2) + "px)" } }, f(v[0]))),
        p.marks !== false && h("div", { className: "ha-slider-marks" }, h("span", null, f(min)), h("span", null, f(max)))));
  }
  function OtpInput(p) {
    var n = p.length || 6, st = React.useState(Array(n).fill("")), refs = React.useRef([]);
    function set(i, ch) {
      var nx = st[0].slice(); nx[i] = ch; st[1](nx);
      if (ch && i < n - 1) refs.current[i + 1].focus();
      if (nx.every(Boolean)) p.onComplete && p.onComplete(nx.join(""));
    }
    return h("div", { className: cx("ha-otp", p.error && "invalid"), role: "group", "aria-label": p.label || L("Verification code") },
      st[0].map(function (c, i) {
        return h(F, { key: i }, i === n / 2 && n > 4 && h("span", { className: "ha-otp-sep", "aria-hidden": true }),
          h("input", { ref: function (el) { refs.current[i] = el; }, className: "ha-otp-cell", inputMode: "numeric", autoComplete: i === 0 ? "one-time-code" : "off", maxLength: 1, value: c, "aria-label": L("Digit {n}", { n: i + 1 }),
            onChange: function (e) { set(i, e.target.value.replace(/\D/g, "").slice(-1)); },
            onKeyDown: function (e) { if (e.key === "Backspace" && !st[0][i] && i > 0) refs.current[i - 1].focus(); if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1].focus(); if (e.key === "ArrowRight" && i < n - 1) refs.current[i + 1].focus(); },
            onPaste: function (e) { var t = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, n); if (!t) return; e.preventDefault(); var nx = Array(n).fill("").map(function (_, k) { return t[k] || ""; }); st[1](nx); refs.current[Math.min(t.length, n - 1)].focus(); if (t.length === n) p.onComplete && p.onComplete(t); } }));
      }));
  }
  function fsize(b) { return b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB"; }
  function FileDrop(p) {
    var over = React.useState(false), files = useControlled(p.files, [], p.onChange), inp = React.useRef(null);
    function take(list) {
      var add = Array.prototype.slice.call(list || []).map(function (f) { return { name: f.name, size: f.size, progress: 0, id: Math.random().toString(36).slice(2) }; });
      if (!add.length) return; var all = (p.multiple === false ? [] : files[0]).concat(add); files[1](all);
      add.forEach(function (f, k) { var t = 0; var iv = setInterval(function () { t += 20 + Math.random() * 25; f.progress = Math.min(100, t); files[1](all.slice()); if (t >= 100) clearInterval(iv); }, 160 + k * 40); });
    }
    return h("div", { className: "ha-col", style: { gap: 12 } },
      h("div", { className: cx("ha-drop", over[0] && "over"), role: "button", tabIndex: 0, onClick: function () { inp.current.click(); }, onKeyDown: function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inp.current.click(); } },
        onDragOver: function (e) { e.preventDefault(); over[1](true); }, onDragLeave: function () { over[1](false); }, onDrop: function (e) { e.preventDefault(); over[1](false); take(e.dataTransfer.files); } },
        h(TintIcon, { icon: "download", tint: over[0] ? "mint" : "sky", size: 40 }),
        h("b", null, over[0] ? L("Drop to upload") : (p.title || L("Drop files here or browse"))), h("span", null, p.hint || L("PDF, PNG or JPG up to 10 MB")),
        h("input", { ref: inp, type: "file", hidden: true, multiple: p.multiple !== false, accept: p.accept, onChange: function (e) { take(e.target.files); e.target.value = ""; } })),
      files[0].length > 0 && h("div", { className: "ha-col", style: { gap: 8 } }, files[0].map(function (f) {
        var done = f.progress >= 100;
        return h("div", { key: f.id, className: "ha-upload" }, h(TintIcon, { icon: "file", tint: done ? "mint" : "plain" }),
          h("div", { className: "ha-upload-text" }, h("b", null, f.name), h("span", null, done ? L("{size} · uploaded", { size: fsize(f.size) }) : Math.round(f.progress) + "% · " + fsize(f.size)), !done && h("span", { className: "ha-progress" }, h("span", { style: { width: f.progress + "%" } }))),
          h(IconButton, { icon: done ? "trash" : "x", label: done ? L("Remove {name}", { name: f.name }) : L("Cancel upload"), size: "sm", onClick: function () { files[1](files[0].filter(function (x) { return x.id !== f.id; })); } }));
      })));
  }

  /* ── Feedback: inline alert, confirm dialog, toasts with undo ── */
  var ALERT_ICON = { info: "bell", success: "check", warning: "flag", danger: "x", highlight: "sparkle" }, ALERT_TINT = { info: "sky", success: "mint", warning: "butter", danger: "blush", highlight: "lilac" };
  function Alert(p) {
    var tone = p.tone || "info";
    return h("div", { className: cx("ha-alert", "ha-alert-" + tone, p.className), role: tone === "danger" || tone === "warning" ? "alert" : "status" },
      h("span", { className: "ha-alert-icon" }, h(Icon, { name: p.icon || ALERT_ICON[tone], size: 15 })),
      h("div", { className: "ha-alert-body" }, p.title && h("b", null, p.title), p.children && h("span", null, p.children)),
      (p.action || p.onDismiss) && h("div", { className: "ha-alert-actions" }, p.action, p.onDismiss && h(IconButton, { icon: "x", label: L("Dismiss"), size: "sm", variant: "ghost", onClick: p.onDismiss })));
  }
  function ConfirmDialog(p) {
    var typed = React.useState(""), ok = !p.confirmText || typed[0] === p.confirmText, cancel = React.useRef(null);
    React.useEffect(function () {
      if (!p.open) return; typed[1](""); setTimeout(function () { cancel.current && cancel.current.focus(); }, 30);
      function k(e) { if (e.key === "Escape") p.onCancel && p.onCancel(); } document.addEventListener("keydown", k); return function () { document.removeEventListener("keydown", k); };
    }, [p.open]);
    if (!p.open) return null;
    return portal(h("div", { className: "ha-overlay" }, h("div", { className: "ha-backdrop", onClick: p.onCancel }),
      h("div", { className: "ha-modal ha-confirm", role: "alertdialog", "aria-modal": "true", "aria-labelledby": "ha-confirm-t" },
        h(TintIcon, { icon: p.icon || (p.danger ? "trash" : "check"), tint: p.danger ? "blush" : "sky", size: 40 }),
        h("div", { className: "ha-col", style: { gap: 8 } }, h("h2", { id: "ha-confirm-t", className: "ha-modal-title" }, p.title), p.text && h("p", { className: "ha-modal-text" }, p.text)),
        p.confirmText && h("label", { className: "ha-field" }, h("span", { className: "ha-field-hint" }, Lx("Type {word} to confirm", { word: h("b", { className: "ha-mono" }, p.confirmText) })), h("input", { className: "ha-input", value: typed[0], onChange: function (e) { typed[1](e.target.value); }, autoComplete: "off" })),
        h("div", { className: "ha-modal-foot" },
          h("button", { ref: cancel, type: "button", className: "ha-btn ha-btn-ghost", onClick: p.onCancel }, p.cancelLabel || L("Cancel")),
          h(Button, { variant: p.danger ? "danger-solid" : "primary", disabled: !ok, onClick: p.onConfirm }, p.confirmLabel || L("Confirm"))))));
  }
  function portal(node) { return window.ReactDOM && ReactDOM.createPortal && typeof document !== "undefined" && document.body ? ReactDOM.createPortal(node, document.body) : node; }
  var toastStore = { list: [], subs: [] };
  function emit() { toastStore.subs.forEach(function (f) { f(toastStore.list.slice()); }); }
  function toast(o) {
    if (typeof o === "string") o = { text: o };
    var t = Object.assign({ id: Math.random().toString(36).slice(2), tone: "success", duration: o && o.undo ? 6000 : 4000 }, o);
    toastStore.list = toastStore.list.concat([t]).slice(-3); emit(); return t.id;
  }
  toast.dismiss = function (id) { toastStore.list = toastStore.list.filter(function (t) { return t.id !== id; }); emit(); };
  function ToastItem(p) {
    var t = p.t, paused = React.useState(false), left = React.useRef(t.duration), last = React.useRef(Date.now());
    React.useEffect(function () {
      if (paused[0]) return; last.current = Date.now();
      var tm = setTimeout(function () { toast.dismiss(t.id); }, left.current);
      return function () { clearTimeout(tm); left.current -= Date.now() - last.current; };
    }, [paused[0]]);
    var tint = ALERT_TINT[t.tone] || "mint";
    return h("div", { className: "ha-toast ha-toast-x", role: t.tone === "danger" ? "alert" : "status", onPointerEnter: function () { paused[1](true); }, onPointerLeave: function () { paused[1](false); } },
      h(TintIcon, { icon: t.icon || ALERT_ICON[t.tone] || "check", tint: tint }),
      h("span", { className: "ha-toast-text" }, t.text),
      t.undo && h("button", { type: "button", className: "ha-toast-action", onClick: function () { t.undo(); toast.dismiss(t.id); } }, L("Undo")),
      t.action && h("button", { type: "button", className: "ha-toast-action", onClick: function () { t.action.onClick(); toast.dismiss(t.id); } }, t.action.label),
      h("button", { type: "button", className: "ha-toast-close", "aria-label": L("Dismiss"), onClick: function () { toast.dismiss(t.id); } }, h(Icon, { name: "x", size: 13 })),
      h("span", { className: "ha-toast-timer", style: { animationDuration: t.duration + "ms", animationPlayState: paused[0] ? "paused" : "running" } }));
  }
  function Toaster(p) {
    var st = React.useState(toastStore.list);
    React.useEffect(function () { toastStore.subs.push(st[1]); return function () { toastStore.subs = toastStore.subs.filter(function (f) { return f !== st[1]; }); }; }, []);
    return portal(h("div", { className: cx("ha-toaster", p && p.position === "top" && "top"), "aria-live": "polite" }, st[0].map(function (t) { return h(ToastItem, { key: t.id, t: t }); })));
  }

  /* ── Data table: sort, select + bulk bar, column toggles, sticky head, expandable rows ── */
  function FilterBar(p) {
    var active = p.value || {}, keys = Object.keys(active).filter(function (k) { return active[k] != null && active[k] !== ""; });
    function set(k, val) { var n = Object.assign({}, active); if (val == null) delete n[k]; else n[k] = val; p.onChange(n); }
    var avail = (p.filters || []).filter(function (f) { return keys.indexOf(f.key) < 0; });
    return h("div", { className: "ha-filterbar" },
      p.search && h(SearchField, { placeholder: p.search, value: p.query, onChange: function (e) { p.onQuery(e.target.value); }, style: { minWidth: 0, flex: "1 1 220px", maxWidth: 320 } }),
      keys.map(function (k) {
        var f = (p.filters || []).find(function (x) { return x.key === k; }) || { label: k };
        return h(Popover, { key: k, width: 220, flush: true, trigger: function (s) {
          return h("span", { className: "ha-filterchip" }, h("button", { type: "button", onClick: s.toggle }, h("span", null, f.label + ":"), h("b", null, active[k])),
            h("button", { type: "button", className: "x", "aria-label": L("Remove filter {name}", { name: f.label }), onClick: function () { set(k, null); } }, h(Icon, { name: "x", size: 12 })));
        } }, function (s) { return h(Menu, { items: f.options.map(function (o) { return { label: o, icon: o === active[k] ? "check" : undefined, onClick: function () { set(k, o); s.close(); } }; }) }); });
      }),
      avail.length > 0 && h(Popover, { width: 240, flush: true, trigger: function (s) { return h("button", { type: "button", className: "ha-chip ha-chip-dashed", onClick: s.toggle }, h(Icon, { name: "plus", size: 14 }), L("Filter")); } },
        function (s) { return h(AddFilterMenu, { avail: avail, onPick: function (k, o) { set(k, o); s.close(); } }); }),
      keys.length > 1 && h("button", { type: "button", className: "ha-linkbtn", onClick: function () { p.onChange({}); } }, L("Clear all")),
      p.right && h("div", { className: "ha-filterbar-right" }, p.right));
  }
  function AddFilterMenu(p) {
    var step = React.useState(null);
    if (step[0]) return h(Menu, { items: [{ label: L("Back"), icon: "chevronLeft", onClick: function () { step[1](null); } }, "-"].concat(step[0].options.map(function (o) { return { label: o, onClick: function () { p.onPick(step[0].key, o); } }; })) });
    return h(Menu, { items: p.avail.map(function (f) { return { label: f.label, icon: f.icon || "filter", onClick: function () { step[1](f); } }; }) });
  }
  function DataTable(p) {
    var cols = p.columns || [], rk = p.rowKey || "id";
    var sort = React.useState(p.defaultSort || null), sel = React.useState([]), hidden = React.useState(cols.filter(function (c) { return c.hidden; }).map(function (c) { return c.key; })), open = React.useState({});
    var rows = (p.rows || []).slice();
    if (sort[0]) { var c0 = cols.find(function (c) { return c.key === sort[0].key; }), dir = sort[0].dir === "desc" ? -1 : 1, acc = c0 && c0.sortValue || function (r) { return r[sort[0].key]; };
      rows.sort(function (a, b) { var x = acc(a), y = acc(b); return (x > y ? 1 : x < y ? -1 : 0) * dir; }); }
    var vis = cols.filter(function (c) { return hidden[0].indexOf(c.key) < 0; });
    var ids = rows.map(function (r) { return r[rk]; }), selected = sel[0].filter(function (id) { return ids.indexOf(id) >= 0; });
    var all = ids.length > 0 && selected.length === ids.length, some = selected.length > 0 && !all;
    function toggle(id) { sel[1](selected.indexOf(id) >= 0 ? selected.filter(function (x) { return x !== id; }) : selected.concat([id])); }
    function cb(checked, onChange, label, ind) {
      return h("span", { className: "ha-checkbox" }, h("input", { type: "checkbox", checked: checked, onChange: onChange, "aria-label": label, ref: function (el) { if (el) el.indeterminate = !!ind; } }),
        h("span", { className: cx("ha-checkbox-box", ind && "ind"), "aria-hidden": true }, h("svg", { viewBox: "0 0 24 24", width: 14, height: 14, fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: ind ? "M6 12h12" : "M5 12.5l4.5 4.5L19 7.5" }))));
    }
    var span = vis.length + (p.selectable ? 1 : 0) + (p.renderExpanded ? 1 : 0);
    var selRows = rows.filter(function (r) { return selected.indexOf(r[rk]) >= 0; });
    return h("div", { className: cx("ha-dt", p.className) },
      (p.toolbar || p.columnToggle !== false) && h("div", { className: "ha-dt-toolbar" }, p.toolbar,
        p.columnToggle !== false && h(Popover, { align: "end", width: 220, flush: true, trigger: function (s) { return h(Tooltip, { label: L("Columns") }, h("button", { type: "button", className: "ha-iconbtn ha-iconbtn-soft", "aria-label": L("Choose columns"), onClick: s.toggle }, h(Icon, { name: "grid" }))); } },
          h("div", { className: "ha-menu ha-menu-static" }, h("div", { className: "ha-menu-label" }, L("Columns")), cols.filter(function (c) { return c.hideable !== false && c.label; }).map(function (c) {
            var on = hidden[0].indexOf(c.key) < 0;
            return h("label", { key: c.key, className: "ha-menu-item" }, cb(on, function () { hidden[1](on ? hidden[0].concat([c.key]) : hidden[0].filter(function (k) { return k !== c.key; })); }, c.label), c.label);
          })))),
      h("div", { className: cx("ha-dt-scroll", p.stickyHeader && "sticky"), style: p.maxHeight ? { maxHeight: p.maxHeight } : undefined },
        h("table", { className: "ha-table ha-dt-table" },
          h("thead", null, h("tr", null,
            p.selectable && h("th", { className: "ha-dt-sel" }, cb(all, function () { sel[1](all ? [] : ids); }, L("Select all rows"), some)),
            p.renderExpanded && h("th", { className: "ha-dt-exp", "aria-label": L("Expand") }),
            vis.map(function (c) {
              var s = sort[0] && sort[0].key === c.key ? sort[0].dir : null;
              return h("th", { key: c.key, className: cx(c.align === "right" && "ha-num"), style: c.width ? { width: c.width } : undefined, "aria-sort": s ? (s === "asc" ? "ascending" : "descending") : undefined },
                c.sortable ? h("button", { type: "button", className: cx("ha-dt-sort", s && "on"), onClick: function () { sort[1](s === "asc" ? { key: c.key, dir: "desc" } : s === "desc" ? null : { key: c.key, dir: "asc" }); } },
                  c.label, h(Icon, { name: s === "desc" ? "chevronDown" : "chevronDown", size: 12, className: cx("ha-dt-arrow", s === "asc" && "up", !s && "idle") })) : c.label);
            }))),
          h("tbody", null, rows.length === 0 ? h("tr", null, h("td", { colSpan: span, className: "ha-dt-empty" }, p.empty || L("Nothing matches these filters."))) :
            rows.map(function (r) {
              var id = r[rk], on = selected.indexOf(id) >= 0, ex = !!open[0][id];
              return h(F, { key: id },
                h("tr", { className: cx(on && "selected", ex && "expanded") },
                  p.selectable && h("td", { className: "ha-dt-sel" }, cb(on, function () { toggle(id); }, L("Select row"))),
                  p.renderExpanded && h("td", { className: "ha-dt-exp" }, h("button", { type: "button", className: cx("ha-dt-toggle", ex && "open"), "aria-expanded": ex, "aria-label": ex ? L("Collapse row") : L("Expand row"), onClick: function () { var n = Object.assign({}, open[0]); n[id] = !ex; open[1](n); } }, h(Icon, { name: "chevronRight", size: 14 }))),
                  vis.map(function (c) { return h("td", { key: c.key, className: c.align === "right" ? "ha-num" : undefined }, c.render ? c.render(r) : r[c.key]); })),
                ex && h("tr", { className: "ha-dt-detail" }, h("td", { colSpan: span }, h("div", { className: "ha-dt-detail-in ha-in" }, p.renderExpanded(r)))));
            })))),
      p.selectable && selected.length > 0 && h("div", { className: "ha-bulkbar", role: "toolbar", "aria-label": L("Bulk actions") },
        h("b", null, L("{n} selected", { n: selected.length })), h("button", { type: "button", className: "ha-linkbtn on-frame", onClick: function () { sel[1]([]); } }, L("Clear")),
        h("div", { className: "ha-bulkbar-actions" }, (p.bulkActions || []).map(function (a) {
          return h("button", { key: a.label, type: "button", className: cx("ha-bulk-btn", a.danger && "danger"), onClick: function () { a.onClick(selRows, function () { sel[1]([]); }); } }, a.icon && h(Icon, { name: a.icon, size: 14 }), a.label);
        }))));
  }

  /* ── More charts ── */
  function ChartTip(p) {
    return h("div", { className: "ha-chart-tip", style: { left: p.x, top: p.y } }, h("b", null, p.title), p.rows.map(function (r) { return h("span", { key: r.label }, h("i", { className: "ha-sw ha-sw-" + r.tint }), r.label, h("em", null, r.value)); }));
  }
  function Legend(p) {
    return h("div", { className: "ha-legend" }, (p.items || []).map(function (s) { return h("span", { key: s.name || s.label }, h("i", { className: "ha-sw ha-sw-" + (s.tint || "ink") }), s.name || s.label); }));
  }
  function StackedBarChart(p) {
    var mw = useWidth(p.width, 560), W = mw[1], Hh = p.height || 200, pad = 40, series = p.series || [], labels = p.labels || [], hov = React.useState(null), f = p.format || function (v) { return Math.round(v); };
    var totals = labels.map(function (_, i) { return series.reduce(function (a, s) { return a + (s.values[i] || 0); }, 0); }), max = niceMax(Math.max.apply(null, totals.concat([1])));
    var n = labels.length || 1, gw = Math.max(1, (W - pad) / n), bw = Math.max(1, Math.min(p.barWidth || 28, gw * 0.62));
    return h("div", { ref: mw[0], className: "ha-chart-wrap ha-chart-hover" },
      h("svg", { className: "ha-chart", width: W, height: Hh + 22, viewBox: "0 0 " + W + " " + (Hh + 22), role: "img", "aria-label": p.label || L("Stacked bar chart"), onPointerLeave: function () { hov[1](null); } },
        [0, 0.5, 1].map(function (t) { var y = Hh - t * (Hh - 10); return h("g", { key: t }, h("line", { className: "grid", x1: pad, x2: W, y1: y, y2: y, strokeDasharray: t ? "3 5" : null }), h("text", { x: 0, y: y + 4 }, f(max * t))); }),
        labels.map(function (l, i) {
          var x = pad + gw * i + (gw - bw) / 2, acc = 0;
          return h("g", { key: i, onPointerEnter: function () { hov[1](i); }, className: hov[0] != null && hov[0] !== i ? "dim" : undefined },
            h("rect", { x: pad + gw * i, y: 0, width: gw, height: Hh, fill: "transparent" }),
            series.map(function (s, si) {
              var v = s.values[i] || 0, bh = v / max * (Hh - 10), y = Hh - acc - bh; acc += bh;
              var top = si === series.length - 1 || series.slice(si + 1).every(function (z) { return !(z.values[i] > 0); });
              return v > 0 && h("path", { key: si, className: cx("ha-seg-bar", "ha-sf-" + (s.tint || "ink")), style: { animationDelay: (120 + i * 45) + "ms" },
                d: top ? roundTop(x, y, bw, Math.max(bh - 2, 1), Math.min(8, bw / 2)) : "M" + x + " " + y + "h" + bw + "v" + Math.max(bh - 2, 1) + "h-" + bw + "z" });
            }),
            h("text", { x: x + bw / 2, y: Hh + 18, textAnchor: "middle" }, l));
        })),
      hov[0] != null && h(ChartTip, { x: Math.min(W - 180, pad + gw * hov[0] + gw / 2 + 12), y: 8, title: labels[hov[0]] + " · " + f(totals[hov[0]]), rows: series.slice().reverse().map(function (s) { return { label: s.name, tint: s.tint || "ink", value: f(s.values[hov[0]] || 0) }; }) }),
      p.legend !== false && h(Legend, { items: series }));
  }
  function roundTop(x, y, w, hh, r) { r = Math.min(r, hh); return "M" + x + " " + (y + hh) + "V" + (y + r) + "Q" + x + " " + y + " " + (x + r) + " " + y + "H" + (x + w - r) + "Q" + (x + w) + " " + y + " " + (x + w) + " " + (y + r) + "V" + (y + hh) + "Z"; }
  function smooth(pts) {
    if (pts.length < 2) return "";
    var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], mx = (a[0] + b[0]) / 2; d += " C" + mx.toFixed(1) + " " + a[1].toFixed(1) + " " + mx.toFixed(1) + " " + b[1].toFixed(1) + " " + b[0].toFixed(1) + " " + b[1].toFixed(1); }
    return d;
  }
  function AreaChart(p) {
    var mw = useWidth(p.width, 560), W = mw[1], Hh = p.height || 200, pad = 44, series = p.series || [], labels = p.labels || [], hov = React.useState(null), f = p.format || function (v) { return Math.round(v); };
    var n = labels.length, stacked = p.stacked !== false, base = labels.map(function () { return 0; }), layers = [];
    series.forEach(function (s) { var top = s.values.map(function (v, i) { return (stacked ? base[i] : 0) + v; }); layers.push({ s: s, lo: stacked ? base.slice() : labels.map(function () { return 0; }), hi: top }); if (stacked) base = top; });
    var max = niceMax(Math.max.apply(null, layers.reduce(function (a, l) { return a.concat(l.hi); }, [1])));
    function X(i) { return pad + 8 + (W - pad - 16) * (n === 1 ? 0 : i / (n - 1)); } function Y(v) { return Hh - v / max * (Hh - 12); }
    return h("div", { ref: mw[0], className: "ha-chart-wrap ha-chart-hover" },
      h("svg", { className: "ha-chart", width: W, height: Hh + 22, viewBox: "0 0 " + W + " " + (Hh + 22), role: "img", "aria-label": p.label || L("Area chart"),
        onPointerMove: function (e) { var r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) * W / r.width; hov[1](Math.max(0, Math.min(n - 1, Math.round((x - pad - 8) / ((W - pad - 16) / Math.max(1, n - 1)))))); }, onPointerLeave: function () { hov[1](null); } },
        [0, 0.5, 1].map(function (t) { var y = Hh - t * (Hh - 12); return h("g", { key: t }, h("line", { className: "grid", x1: pad, x2: W, y1: y, y2: y, strokeDasharray: t ? "3 5" : null }), h("text", { x: 0, y: y + 4 }, f(max * t))); }),
        labels.map(function (l, i) { return (n <= 12 || i % Math.ceil(n / 8) === 0) && h("text", { key: i, x: X(i), y: Hh + 18, textAnchor: "middle" }, l); }),
        layers.slice().reverse().map(function (L, k) {
          var top = L.hi.map(function (v, i) { return [X(i), Y(v)]; }), bot = L.lo.map(function (v, i) { return [X(i), Y(v)]; }).reverse(), tint = L.s.tint || "ink";
          var line = smooth(top), back = smooth(bot).replace(/^M/, "L");
          return h("g", { key: k }, h("path", { className: cx("ha-area2", "ha-af-" + tint), d: line + " " + back + " Z" }), h("path", { className: cx("ha-line", "ha-line-" + tint), d: line, pathLength: 1, style: { strokeWidth: 2 } }));
        }),
        hov[0] != null && h("g", null, h("line", { className: "ha-crosshair", x1: X(hov[0]), x2: X(hov[0]), y1: 0, y2: Hh }),
          layers.map(function (L, k) { return h("circle", { key: k, className: cx("ha-hoverpt", "ha-line-" + (L.s.tint || "ink")), cx: X(hov[0]), cy: Y(L.hi[hov[0]]), r: 4 }); }))),
      hov[0] != null && h(ChartTip, { x: X(hov[0]) > W - 200 ? X(hov[0]) - 192 : X(hov[0]) + 12, y: 8, title: labels[hov[0]], rows: series.slice().reverse().map(function (s) { return { label: s.name, tint: s.tint || "ink", value: f(s.values[hov[0]]) }; }) }),
      p.legend !== false && h(Legend, { items: series }));
  }
  function Heatmap(p) {
    var rows = p.rows || [], cols = p.cols || [], vals = p.values || [], flat = [].concat.apply([], vals), max = Math.max.apply(null, flat.concat([1])), f = p.format || String, hov = React.useState(null);
    function lvl(v) { return v <= 0 ? 0 : Math.min(4, Math.ceil(v / max * 4)); }
    return h("div", { className: "ha-heat-wrap" },
      h("div", { className: "ha-heat", style: { gridTemplateColumns: "auto repeat(" + cols.length + ", minmax(0, 1fr))" }, role: "img", "aria-label": p.label || "Heatmap", onPointerLeave: function () { hov[1](null); } },
        h("span"), cols.map(function (c, i) { return h("span", { key: "c" + i, className: "ha-heat-col" }, (p.colEvery ? i % p.colEvery === 0 : true) ? c : ""); }),
        rows.map(function (r, ri) {
          return h(F, { key: ri }, h("span", { className: "ha-heat-row" }, r), cols.map(function (c, ci) {
            var v = (vals[ri] || [])[ci] || 0;
            return h("span", { key: ci, className: cx("ha-heat-cell", "l" + lvl(v), hov[0] && hov[0][0] === ri && hov[0][1] === ci && "hov"), style: { animationDelay: (ci * 12 + ri * 30) + "ms" }, onPointerEnter: function () { hov[1]([ri, ci]); }, title: r + " " + c + ": " + f(v) });
          }));
        })),
      h("div", { className: "ha-heat-foot" }, h("span", null, hov[0] ? rows[hov[0][0]] + " · " + cols[hov[0][1]] + " — " + f((vals[hov[0][0]] || [])[hov[0][1]] || 0) : (p.caption || "")),
        h("span", { className: "ha-heat-scale" }, L("Less"), [0, 1, 2, 3, 4].map(function (l) { return h("i", { key: l, className: "ha-heat-cell l" + l }); }), L("More"))));
  }
  function Funnel(p) {
    var steps = p.steps || [], top = (steps[0] && steps[0].value) || 1, f = p.format || function (v) { return fmtNum(v); }, on = useMounted(120);
    return h("div", { className: "ha-funnel" }, steps.map(function (s, i) {
      var pct = s.value / top * 100, conv = i ? s.value / (steps[i - 1].value || 1) * 100 : null;
      return h("div", { key: i, className: "ha-funnel-row" },
        h("div", { className: "ha-funnel-label" }, h("b", null, s.label), h("span", null, f(s.value))),
        h("div", { className: "ha-funnel-track" }, h("span", { className: cx("ha-funnel-bar", "ha-sf-" + (s.tint || p.tint || "sky")), style: { width: (on || reduced() ? Math.max(pct, 2) : 0) + "%", transitionDelay: (i * 90) + "ms" } }), h("em", null, Math.round(pct) + "%")),
        h("div", { className: "ha-funnel-conv" }, conv != null ? h(F, null, h(Icon, { name: "chevronDown", size: 12 }), Math.round(conv) + "%") : ""));
    }));
  }
  function Gauge(p) {
    var size = p.size || 200, sw = p.stroke || 18, r = (size - sw) / 2, c = Math.PI * r, max = p.max || 100, v = Math.max(0, Math.min(max, p.value || 0)), on = useMounted(150);
    var tone = p.tint || (p.thresholds ? (v >= p.thresholds[1] ? "blush" : v >= p.thresholds[0] ? "butter" : "mint") : "ink");
    return h("div", { className: "ha-gauge", style: { width: size } },
      h("svg", { width: size, height: size / 2 + sw / 2, viewBox: "0 0 " + size + " " + (size / 2 + sw / 2), role: "img", "aria-label": L("{label}: {value} of {max}", { label: p.label || L("Gauge"), value: v, max: max }) },
        h("path", { className: "ha-arc-track", d: "M" + sw / 2 + " " + size / 2 + " A" + r + " " + r + " 0 0 1 " + (size - sw / 2) + " " + size / 2, strokeWidth: sw, strokeLinecap: "round" }),
        h("path", { className: cx("ha-gauge-arc", "ha-arc-" + tone), d: "M" + sw / 2 + " " + size / 2 + " A" + r + " " + r + " 0 0 1 " + (size - sw / 2) + " " + size / 2, strokeWidth: sw, strokeLinecap: "round", strokeDasharray: c, strokeDashoffset: on || reduced() ? c * (1 - v / max) : c })),
      h("div", { className: "ha-gauge-label" }, h("b", null, p.format ? p.format(v) : h(CountUp, { value: v })), p.caption && h("span", null, p.caption)),
      p.showRange !== false && h("div", { className: "ha-gauge-range" }, h("span", null, p.format ? p.format(0) : 0), h("span", null, p.format ? p.format(max) : max)));
  }

  /* ════════ Kit 3: AI chat & agents, e-commerce, system screens ════════ */

  /* ── Rich text: paragraphs, **bold**, `code`, - lists, 1. lists, ```code blocks``` ── */
  function inline(s, k) {
    var out = [], re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g, last = 0, m, i = 0;
    while ((m = re.exec(s))) {
      if (m.index > last) out.push(s.slice(last, m.index));
      var t = m[0];
      if (t[0] === "*") out.push(h("b", { key: k + "b" + i++ }, t.slice(2, -2)));
      else if (t[0] === "`") out.push(h("code", { key: k + "c" + i++, className: "ha-icode" }, t.slice(1, -1)));
      else { var mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(t); out.push(h("a", { key: k + "a" + i++, href: mm[2], target: "_blank", rel: "noreferrer" }, mm[1])); }
      last = m.index + t.length;
    }
    if (last < s.length) out.push(s.slice(last));
    return out;
  }
  function RichText(p) {
    var src = String(p.text || ""), blocks = [], parts = src.split(/```/);
    parts.forEach(function (part, pi) {
      if (pi % 2 === 1) { var nl = part.indexOf("\n"), lang = nl > -1 ? part.slice(0, nl).trim() : "", code = nl > -1 ? part.slice(nl + 1) : part; blocks.push(h(CodeBlock, { key: "cb" + pi, lang: lang, code: code.replace(/\n$/, ""), open: p.streaming && pi === parts.length - 1 })); return; }
      part.split(/\n{2,}/).forEach(function (para, j) {
        var lines = para.split("\n").filter(function (l) { return l.trim() !== ""; }); if (!lines.length) return;
        var key = pi + "-" + j;
        if (lines.every(function (l) { return /^\s*[-*] /.test(l); })) blocks.push(h("ul", { key: key }, lines.map(function (l, li) { return h("li", { key: li }, inline(l.replace(/^\s*[-*] /, ""), key + li)); })));
        else if (lines.every(function (l) { return /^\s*\d+\. /.test(l); })) blocks.push(h("ol", { key: key }, lines.map(function (l, li) { return h("li", { key: li }, inline(l.replace(/^\s*\d+\. /, ""), key + li)); })));
        else if (/^#{1,3} /.test(lines[0])) blocks.push(h("p", { key: key, className: "ha-rt-h" }, inline(lines[0].replace(/^#+ /, ""), key)), lines.length > 1 && h("p", { key: key + "r" }, inline(lines.slice(1).join(" "), key + "r")));
        else blocks.push(h("p", { key: key }, lines.map(function (l, li) { return h(F, { key: li }, li > 0 && h("br"), inline(l, key + li)); })));
      });
    });
    return h("div", { className: cx("ha-rt", p.className) }, blocks, p.streaming && h("span", { className: "ha-caret", "aria-hidden": true }));
  }
  var KW = /\b(const|let|var|function|return|if|else|for|await|async|import|from|export|new|true|false|null|SELECT|FROM|WHERE|ORDER BY|LIMIT|def|class)\b/g;
  function hl(line, k) {
    var out = [], re = /("[^"]*"|'[^']*'|\/\/.*$|#.*$|\b\d+(\.\d+)?\b|\b(?:const|let|var|function|return|if|else|for|await|async|import|from|export|new|true|false|null|SELECT|FROM|WHERE|LIMIT|def|class)\b)/g, last = 0, m, i = 0;
    while ((m = re.exec(line))) {
      if (m.index > last) out.push(line.slice(last, m.index));
      var t = m[0], c = /^["']/.test(t) ? "s" : /^(\/\/|#)/.test(t) ? "c" : /^\d/.test(t) ? "n" : "k";
      out.push(h("span", { key: k + "-" + i++, className: "tk-" + c }, t)); last = m.index + t.length;
    }
    if (last < line.length) out.push(line.slice(last));
    return out;
  }
  function CodeBlock(p) {
    var copied = React.useState(false);
    function copy() { try { navigator.clipboard.writeText(p.code); } catch (e) {} copied[1](true); setTimeout(function () { copied[1](false); }, 1400); }
    return h("div", { className: "ha-code" },
      h("div", { className: "ha-code-head" }, h("span", null, p.lang || "text"), h("button", { type: "button", className: "ha-code-copy", onClick: copy, "aria-label": L("Copy code") }, h(Icon, { name: copied[0] ? "check" : "file", size: 13 }), copied[0] ? L("Copied") : L("Copy"))),
      h("pre", null, h("code", null, String(p.code || "").split("\n").map(function (l, i) { return h("span", { key: i, className: "ha-code-line" }, hl(l, i), "\n"); }))));
  }

  /* ── Chat building blocks ── */
  function TypingDots(p) { return h("span", { className: "ha-typing", role: "status", "aria-label": p.label || L("Working") }, h("i"), h("i"), h("i")); }
  function AgentMark(p) {
    var s = p.size || 32;
    return h("span", { className: cx("ha-agentmark", "ha-t-" + (p.tint || "lilac"), p.live && "live", p.className), style: { width: s, height: s }, "aria-hidden": true }, h(Icon, { name: p.icon || "bot", size: Math.round(s * 0.5) }));
  }
  function ChatMessage(p) {
    var me = p.role === "user", copied = React.useState(false), fb = React.useState(p.feedback || null);
    if (p.role === "system") return h("div", { className: "ha-msg-system" }, h("span", null, p.children || p.text));
    function copy() { try { navigator.clipboard.writeText(p.text || ""); } catch (e) {} copied[1](true); setTimeout(function () { copied[1](false); }, 1400); }
    return h("div", { className: cx("ha-msg", me ? "me" : "ai", p.className) },
      me ? h(Avatar, { name: p.name || L("You"), size: 32 }) : h(AgentMark, { tint: p.tint, live: p.streaming }),
      h("div", { className: "ha-msg-col" },
        (p.name || p.time) && h("div", { className: "ha-msg-meta" }, h("b", null, p.name), p.time && h("span", null, p.time), p.model && h("span", { className: "ha-msg-model" }, p.model)),
        p.before,
        (p.text || p.children || p.streaming) && h("div", { className: "ha-bubble" }, p.children || (me ? h("p", { className: "ha-rt-plain" }, p.text) : (p.text ? h(RichText, { text: p.text, streaming: p.streaming }) : h(TypingDots, null)))),
        p.attachments && p.attachments.length > 0 && h("div", { className: "ha-msg-attach" }, p.attachments.map(function (a) { return h("span", { key: a.name, className: "ha-attach-chip" }, h(Icon, { name: a.kind === "img" ? "file" : "paperclip", size: 13 }), a.name, a.size && h("small", null, a.size)); })),
        p.sources && p.sources.length > 0 && h("div", { className: "ha-msg-sources" }, p.sources.map(function (s, i) { return h("a", { key: i, className: "ha-source", href: s.url || "#", onClick: s.onClick ? function (e) { e.preventDefault(); s.onClick(); } : undefined }, h("span", { className: "ha-source-n" }, i + 1), h(Icon, { name: s.icon || "book", size: 12 }), s.title); })),
        !me && !p.streaming && p.actions !== false && h("div", { className: "ha-msg-actions" },
          h(Tooltip, { label: copied[0] ? L("Copied") : L("Copy") }, h("button", { type: "button", className: "ha-msg-act", "aria-label": L("Copy reply"), onClick: copy }, h(Icon, { name: copied[0] ? "check" : "file", size: 14 }))),
          p.onRetry && h(Tooltip, { label: L("Regenerate") }, h("button", { type: "button", className: "ha-msg-act", "aria-label": L("Regenerate reply"), onClick: p.onRetry }, h(Icon, { name: "refresh", size: 14 }))),
          h(Tooltip, { label: L("Good reply") }, h("button", { type: "button", className: cx("ha-msg-act", fb[0] === "up" && "on"), "aria-pressed": fb[0] === "up", "aria-label": L("Good reply"), onClick: function () { fb[1](fb[0] === "up" ? null : "up"); p.onFeedback && p.onFeedback("up"); } }, h(Icon, { name: "thumbUp", size: 14 }))),
          h(Tooltip, { label: L("Bad reply") }, h("button", { type: "button", className: cx("ha-msg-act", fb[0] === "down" && "on"), "aria-pressed": fb[0] === "down", "aria-label": L("Bad reply"), onClick: function () { fb[1](fb[0] === "down" ? null : "down"); p.onFeedback && p.onFeedback("down"); } }, h(Icon, { name: "thumbDown", size: 14 }))),
          p.usage && h("span", { className: "ha-msg-usage" }, p.usage)),
        p.after));
  }
  var TOOL_ICON = { running: null, done: "check", error: "x", waiting: "clock" };
  function ToolCall(p) {
    var open = React.useState(!!p.defaultOpen), st = p.status || "done";
    return h("div", { className: cx("ha-tool", "is-" + st, open[0] && "open") },
      h("button", { type: "button", className: "ha-tool-head", "aria-expanded": open[0], onClick: function () { open[1](!open[0]); } },
        h("span", { className: "ha-tool-ico" }, st === "running" ? h("span", { className: "ha-spin", "aria-hidden": true }) : h(Icon, { name: TOOL_ICON[st] || "zap", size: 12 })),
        h(Icon, { name: p.icon || "zap", size: 14, className: "ha-tool-kind" }),
        h("b", null, p.name), h("span", { className: "ha-tool-sum" }, p.summary),
        p.duration && h("span", { className: "ha-tool-time" }, p.duration),
        h(Icon, { name: "chevronDown", size: 14, className: "ha-tool-chev" })),
      open[0] && h("div", { className: "ha-tool-body" },
        p.input != null && h("div", null, h("span", { className: "ha-tool-label" }, "Input"), h("pre", null, typeof p.input === "string" ? p.input : JSON.stringify(p.input, null, 2))),
        p.output != null && h("div", null, h("span", { className: "ha-tool-label" }, st === "error" ? L("Error") : L("Result")), h("pre", { className: st === "error" ? "err" : undefined }, typeof p.output === "string" ? p.output : JSON.stringify(p.output, null, 2)))));
  }
  function Reasoning(p) {
    var open = React.useState(!!p.defaultOpen);
    return h("div", { className: cx("ha-reason", open[0] && "open", p.streaming && "live") },
      h("button", { type: "button", className: "ha-reason-head", "aria-expanded": open[0], onClick: function () { open[1](!open[0]); } }, h(Icon, { name: "sparkle", size: 13 }), p.streaming ? L("Thinking…") : L("Thought for {time}", { time: p.duration || L("a few seconds") }), h(Icon, { name: "chevronDown", size: 13, className: "ha-tool-chev" })),
      open[0] && h("div", { className: "ha-reason-body" }, p.steps ? h("ol", null, p.steps.map(function (s, i) { return h("li", { key: i }, s); })) : p.text));
  }
  function PromptStarters(p) {
    return h("div", { className: "ha-starters" }, (p.items || []).map(function (s, i) {
      return h("button", { key: i, type: "button", className: "ha-starter ha-in", style: { "--d": (i * 60) + "ms" }, onClick: function () { p.onPick && p.onPick(s.prompt || s.title); } }, h(TintIcon, { icon: s.icon || "sparkle", tint: s.tint || "sky" }), h("b", null, s.title), s.text && h("span", null, s.text));
    }));
  }
  function ModelPicker(p) {
    var models = p.models || [], cur = models.find(function (m) { return m.id === p.value; }) || models[0] || {};
    return h(Popover, { side: p.side || "top", width: 300, flush: true, trigger: function (s) { return h("button", { type: "button", className: "ha-model-btn", "aria-haspopup": "menu", "aria-expanded": s.open, onClick: s.toggle }, h(Icon, { name: "sparkle", size: 13 }), cur.label, h(Icon, { name: "chevronDown", size: 13 })); } },
      function (s) { return h("div", { className: "ha-menu ha-menu-static", role: "menu" }, h("div", { className: "ha-menu-label" }, L("Model")), models.map(function (m) {
        return h("button", { key: m.id, type: "button", role: "menuitemradio", "aria-checked": m.id === cur.id, className: "ha-menu-item ha-model-item", onClick: function () { p.onChange && p.onChange(m.id); s.close(); } },
          h("span", { className: "ha-option-text" }, h("b", null, m.label), m.hint && h("small", null, m.hint)), m.id === cur.id && h(Icon, { name: "check", size: 15 }));
      })); });
  }
  function Composer(p) {
    var ta = React.useRef(null), v = useControlled(p.value, "", p.onChange), files = p.attachments || [], slash = React.useState(0);
    var cmds = (p.commands || []).filter(function (c) { return /^\/\S*$/.test(v[0]) && ("/" + c.name).indexOf(v[0]) === 0; });
    React.useLayoutEffect(function () { var el = ta.current; if (!el) return; el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 200) + "px"; }, [v[0]]);
    function send() { if (p.busy) return; if (!v[0].trim() && !files.length) return; p.onSend && p.onSend(v[0], files); v[1](""); }
    function pick(c) { v[1](""); p.onCommand ? p.onCommand(c) : v[1]((c.insert || "") + " "); ta.current && ta.current.focus(); }
    return h("div", { className: cx("ha-composer", p.busy && "busy"), onDragOver: function (e) { if (p.onAttach) e.preventDefault(); }, onDrop: function (e) { if (!p.onAttach) return; e.preventDefault(); p.onAttach(e.dataTransfer.files); } },
      cmds.length > 0 && h("div", { className: "ha-popover ha-composer-cmds top", role: "listbox" }, h("div", { className: "ha-menu-label" }, L("Commands")), cmds.map(function (c, i) {
        return h("button", { key: c.name, type: "button", role: "option", "aria-selected": i === slash[0], className: cx("ha-option", i === slash[0] && "active"), onPointerDown: function (e) { e.preventDefault(); }, onClick: function () { pick(c); } }, h(Icon, { name: c.icon || "zap", size: 15 }), h("span", { className: "ha-option-text" }, h("b", null, "/" + c.name), c.hint && h("small", null, c.hint)));
      })),
      files.length > 0 && h("div", { className: "ha-composer-files" }, files.map(function (f, i) { return h("span", { key: f.name + i, className: "ha-attach-chip" }, h(Icon, { name: "paperclip", size: 13 }), f.name, p.onRemoveAttachment && h("button", { type: "button", "aria-label": L("Remove {name}", { name: f.name }), onClick: function () { p.onRemoveAttachment(i); } }, h(Icon, { name: "x", size: 12 }))); })),
      h("textarea", { ref: ta, rows: 1, className: "ha-composer-input", placeholder: p.placeholder || L("Message…"), "aria-label": p.label || p.placeholder || L("Message"), value: v[0], disabled: p.disabled,
        onChange: function (e) { v[1](e.target.value); slash[1](0); },
        onKeyDown: function (e) {
          if (cmds.length) { if (e.key === "ArrowDown") { e.preventDefault(); slash[1]((slash[0] + 1) % cmds.length); return; } if (e.key === "ArrowUp") { e.preventDefault(); slash[1]((slash[0] - 1 + cmds.length) % cmds.length); return; } if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); pick(cmds[slash[0]]); return; } }
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); }
        } }),
      h("div", { className: "ha-composer-bar" },
        p.onAttach && h(Tooltip, { label: L("Attach files") }, h("label", { className: "ha-composer-tool", "aria-label": L("Attach files") }, h(Icon, { name: "paperclip", size: 16 }), h("input", { type: "file", multiple: true, hidden: true, onChange: function (e) { p.onAttach(e.target.files); e.target.value = ""; } }))),
        p.commands && h(Tooltip, { label: L("Commands"), shortcut: "/" }, h("button", { type: "button", className: "ha-composer-tool", "aria-label": L("Commands"), onClick: function () { v[1]("/"); ta.current && ta.current.focus(); } }, h(Icon, { name: "code", size: 16 }))),
        p.models && h(ModelPicker, { models: p.models, value: p.model, onChange: p.onModel }),
        p.left,
        h("span", { className: "ha-composer-hint" }, p.hint != null ? p.hint : L("Enter to send · Shift+Enter for a new line")),
        p.busy ? h("button", { type: "button", className: "ha-send stop", "aria-label": L("Stop"), onClick: p.onStop }, h("span", { className: "ha-stop-sq" }))
          : h("button", { type: "button", className: "ha-send", "aria-label": L("Send"), disabled: !v[0].trim() && !files.length, onClick: send }, h(Icon, { name: "arrowUp", size: 16 }))));
  }
  var AGENT_TONE = { Running: "success", Thinking: "info", "Waiting for approval": "highlight", Idle: "neutral", Paused: "neutral", Error: "danger" };
  function AgentStatus(p) {
    var s = p.status || L("Idle");
    return h("span", { className: "ha-agentstatus" }, h(Badge, { tone: AGENT_TONE[s] || "neutral", live: s === "Running" || s === "Thinking" }, s), p.step && h("span", { className: "ha-agentstatus-step" }, p.step));
  }
  var TRACE_ICON = { model: "sparkle", tool: "zap", search: "search", approval: "lock", message: "send", error: "x", memory: "book" };
  function RunTrace(p) {
    var steps = p.steps || [], total = steps.reduce(function (a, s) { return Math.max(a, (s.start || 0) + (s.ms || 0)); }, 1), sel = React.useState(p.defaultOpen != null ? p.defaultOpen : null);
    function fms(ms) { return ms >= 1000 ? (ms / 1000).toFixed(1) + " s" : ms + " ms"; }
    return h("div", { className: "ha-trace" },
      h("div", { className: "ha-trace-head" }, h("span", null, L("Step")), h("span", null, L("Timeline · {time}", { time: fms(total) }))),
      steps.map(function (s, i) {
        var open = sel[0] === i, st = s.status || "done";
        return h("div", { key: i, className: cx("ha-trace-row", "is-" + st, open && "open") },
          h("button", { type: "button", className: "ha-trace-main", "aria-expanded": open, onClick: function () { sel[1](open ? null : i); } },
            h("span", { className: cx("ha-trace-ico", "k-" + (s.kind || "tool")) }, h(Icon, { name: TRACE_ICON[s.kind] || "zap", size: 13 })),
            h("span", { className: "ha-trace-label" }, h("b", null, s.label), s.meta && h("small", null, s.meta)),
            h("span", { className: "ha-trace-bar" }, h("i", { style: { left: ((s.start || 0) / total * 100) + "%", width: Math.max(1.5, (s.ms || 0) / total * 100) + "%" } }), h("em", null, st === "running" ? L("running…") : fms(s.ms || 0)))),
          open && s.detail && h("div", { className: "ha-trace-detail ha-in" }, typeof s.detail === "string" ? h("pre", null, s.detail) : s.detail));
      }),
      p.footer && h("div", { className: "ha-trace-foot" }, p.footer));
  }
  function UsageMeter(p) {
    var pct = Math.min(100, (p.used || 0) / (p.limit || 1) * 100), tone = pct >= 90 ? "blush" : pct >= 70 ? "butter" : "mint";
    return h("div", { className: "ha-usage" }, h("div", { className: "ha-usage-top" }, h("span", null, p.label || L("Context")), h("b", null, (p.format || String)(p.used) + " / " + (p.format || String)(p.limit))),
      h("span", { className: "ha-usage-track" }, h("span", { className: "ha-usage-fill ha-sf-" + tone, style: { width: pct + "%" } })), p.caption && h("small", null, p.caption));
  }

  /* ── E-commerce ── */
  var ART = {
    tee: "M38 22l-14 8 6 12 8-4v38h48V38l8 4 6-12-14-8c-3 6-10 10-24 10S41 28 38 22z",
    mug: "M30 34h44v36a8 8 0 0 1-8 8H38a8 8 0 0 1-8-8V34zM74 42h6a8 8 0 0 1 0 16h-6",
    bottle: "M52 18h16v10l6 8v42a6 6 0 0 1-6 6H52a6 6 0 0 1-6-6V36l6-8V18z",
    cap: "M24 64c0-20 16-32 36-32s36 12 36 32H24zM24 64h60c8 0 14 4 16 8H24v-8z",
    tote: "M32 42h56l-4 40H36l-4-40zM46 42v-6a14 14 0 0 1 28 0v6",
    sneaker: "M20 62l6-20c10 2 18 0 24-6l8 4c4 8 14 12 28 14 8 2 14 6 14 12v4H20v-8z",
    watch: "M48 20h24v14H48zM48 86h24V72H48zM60 34a20 20 0 1 1 0 40 20 20 0 0 1 0-40zM60 46v10l6 4",
    lamp: "M44 24h32l10 26H34l10-26zM60 50v28M44 82h32"
  };
  function ProductArt(p) {
    var size = p.size;
    return h("span", { className: cx("ha-art", "ha-bg-" + (p.tint || "sky"), p.className), style: size ? { width: size, height: size } : undefined, role: p.label ? "img" : undefined, "aria-label": p.label, "aria-hidden": p.label ? undefined : true },
      h("svg", { viewBox: "0 0 120 100", fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: ART[p.kind] || ART.tote })));
  }
  ProductArt.kinds = Object.keys(ART);
  function money(v, cur) { return fmtMoney(Number(v), cur); }
  function Price(p) {
    var sale = p.compareAt && p.compareAt > p.value;
    return h("span", { className: cx("ha-price", p.size && "ha-price-" + p.size) }, h("b", null, money(p.value, p.currency)), sale && h("s", null, money(p.compareAt, p.currency)), sale && p.showSave !== false && h("span", { className: "ha-price-save" }, "−" + Math.round((1 - p.value / p.compareAt) * 100) + "%"));
  }
  function Rating(p) {
    var v = p.value || 0;
    return h("span", { className: "ha-rating", role: "img", "aria-label": L("{value} out of 5", { value: v.toFixed(1) }) + (p.count != null ? L(", {n} reviews", { n: p.count }) : "") },
      h("span", { className: "ha-stars", "aria-hidden": true }, [0, 1, 2, 3, 4].map(function (i) { var f = Math.max(0, Math.min(1, v - i)); return h("span", { key: i, className: "ha-star" }, h(Icon, { name: "star", size: p.size || 14 }), h("span", { className: "ha-star-fill", style: { width: f * 100 + "%" } }, h(Icon, { name: "star", size: p.size || 14 }))); })),
      h("b", null, v.toFixed(1)), p.count != null && h("span", null, "(" + p.count + ")"));
  }
  function StockBadge(p) {
    var s = p.stock;
    if (s == null) return null;
    return s <= 0 ? h(Badge, { tone: "danger" }, L("Out of stock")) : s <= (p.low || 10) ? h(Badge, { tone: "warning" }, L("Low stock · {n} left", { n: s })) : h(Badge, { tone: "success" }, p.compact ? L("In stock") : L("In stock · {n}", { n: s }));
  }
  function ProductCard(p) {
    return h("div", { className: cx("ha-product", p.className), onClick: p.onClick },
      h("div", { className: "ha-product-media" }, h(ProductArt, { kind: p.art, tint: p.tint }), p.badge && h("span", { className: "ha-product-badge" }, h(Badge, { tone: p.badgeTone || "highlight", dot: false }, p.badge)),
        p.onWish && h("button", { type: "button", className: cx("ha-product-wish", p.wished && "on"), "aria-pressed": !!p.wished, "aria-label": L(p.wished ? "Remove {name}" : "Save {name}", { name: p.name }), onClick: function (e) { e.stopPropagation(); p.onWish(); } }, h(Icon, { name: "heart", size: 16 }))),
      h("div", { className: "ha-product-body" },
        h("div", { className: "ha-product-top" }, h("b", { className: "ha-product-name" }, p.name), p.meta && h("span", { className: "ha-product-meta" }, p.meta)),
        p.rating != null && h(Rating, { value: p.rating, count: p.reviews, size: 12 }),
        h("div", { className: "ha-product-foot" }, h(Price, { value: p.price, compareAt: p.compareAt }),
          p.onAdd && (p.stock === 0 ? h("span", { className: "ha-card-desc" }, L("Sold out")) : h(IconButton, { icon: p.added ? "check" : "plus", label: L("Add {name} to cart", { name: p.name }), variant: p.added ? "solid" : "soft", size: "sm", onClick: function (e) { e && e.stopPropagation && e.stopPropagation(); p.onAdd(); } })))));
  }
  function VariantPicker(p) {
    var v = useControlled(p.value, p.defaultValue, p.onChange), color = p.type === "color";
    var cur = (p.options || []).find(function (o) { return (o.value || o) === v[0]; });
    return h("fieldset", { className: "ha-variants" },
      h("legend", { className: "ha-field-label" }, p.label, cur && h("span", { className: "ha-variants-cur" }, cur.label || cur)),
      h("div", { className: cx("ha-variants-row", color ? "colors" : "sizes") }, (p.options || []).map(function (o) {
        var val = o.value || o, lab = o.label || o, on = val === v[0], off = o.disabled;
        return h("button", { key: val, type: "button", className: cx("ha-variant", on && "on", off && "off"), "aria-pressed": on, disabled: off, "aria-label": color ? (off ? L("{name} (sold out)", { name: lab }) : lab) : undefined, title: color ? lab : undefined, onClick: function () { v[1](val); } },
          color ? h("span", { className: "ha-swatch", style: { background: o.color } }) : lab);
      })));
  }
  function CartLine(p) {
    return h("div", { className: "ha-cartline" }, h(ProductArt, { kind: p.art, tint: p.tint, size: 64 }),
      h("div", { className: "ha-cartline-text" }, h("b", null, p.name), p.variant && h("span", null, p.variant), p.note && h("span", { className: "ha-cartline-note" }, p.note)),
      p.onQty ? h("div", { className: "ha-number ha-number-sm" }, h(IconButton, { icon: p.qty <= 1 ? "trash" : "minus", label: p.qty <= 1 ? L("Remove {name}", { name: p.name }) : L("One less"), size: "sm", onClick: function () { p.qty <= 1 ? p.onRemove && p.onRemove() : p.onQty(p.qty - 1); } }), h("span", { className: "ha-number-input", "aria-live": "polite" }, p.qty), h(IconButton, { icon: "plus", label: L("One more"), size: "sm", onClick: function () { p.onQty(p.qty + 1); } })) : h("span", { className: "ha-card-desc" }, "× " + p.qty),
      h("b", { className: "ha-cartline-total" }, money(p.price * p.qty)));
  }
  function OrderSummary(p) {
    var lines = p.lines || [], sub = lines.reduce(function (a, l) { return a + l.price * l.qty; }, 0), disc = p.discount ? (p.discount.pct ? sub * p.discount.pct / 100 : p.discount.amount || 0) : 0;
    var ship = p.shipping != null ? p.shipping : (sub - disc >= (p.freeShippingFrom || 75) ? 0 : 4.9), total = sub - disc + ship, vat = total - total / (1 + (p.vat || 19) / 100);
    var code = React.useState(""), err = React.useState(null), toFree = (p.freeShippingFrom || 75) - (sub - disc);
    return h("div", { className: "ha-summary" },
      p.title !== false && h("b", { className: "ha-summary-title" }, p.title || L("Order summary")),
      p.showLines && h("div", { className: "ha-col", style: { gap: 12 } }, lines.map(function (l, i) { return h("div", { key: i, className: "ha-summary-line" }, h("span", { className: "ha-summary-thumb" }, h(ProductArt, { kind: l.art, tint: l.tint, size: 40 }), h("i", null, l.qty)), h("span", { className: "ha-summary-name" }, l.name, l.variant && h("small", null, l.variant)), h("b", null, money(l.price * l.qty))); })),
      toFree > 0 && p.freeShippingFrom !== 0 && h("div", { className: "ha-freeship" }, h("span", null, Lx("Add {amount} for free shipping", { amount: h("b", null, money(Math.ceil(toFree * 100) / 100)) })), h("span", { className: "ha-usage-track" }, h("span", { className: "ha-usage-fill ha-sf-mint", style: { width: Math.min(100, (sub - disc) / (p.freeShippingFrom || 75) * 100) + "%" } }))),
      p.onCoupon && (p.discount ? h("div", { className: "ha-coupon-on" }, h(Icon, { name: "tag", size: 14 }), h("b", null, p.discount.code), h("span", null, p.discount.label), h("button", { type: "button", className: "ha-linkbtn", onClick: function () { p.onCoupon(null); } }, L("Remove")))
        : h("form", { className: "ha-coupon", onSubmit: function (e) { e.preventDefault(); var r = p.onCoupon(code[0].trim().toUpperCase()); err[1](r === false ? L("That code isn’t valid") : null); if (r !== false) code[1](""); } },
          h("input", { className: "ha-input", placeholder: L("Discount code"), "aria-label": L("Discount code"), value: code[0], onChange: function (e) { code[1](e.target.value); err[1](null); }, "aria-invalid": err[0] ? "true" : undefined }), h(Button, { type: "submit", variant: "soft", disabled: !code[0].trim() }, L("Apply")),
          err[0] && h("span", { className: "ha-field-error", style: { gridColumn: "1 / -1" } }, err[0]))),
      h("dl", { className: "ha-summary-rows" },
        h("div", null, h("dt", null, L("Subtotal")), h("dd", null, money(sub))),
        disc > 0 && h("div", { className: "save" }, h("dt", null, L("Discount")), h("dd", null, "−" + money(disc))),
        h("div", null, h("dt", null, L("Shipping")), h("dd", null, ship === 0 ? L("Free") : money(ship))),
        h("div", { className: "total" }, h("dt", null, L("Total")), h("dd", null, money(total))),
        h("div", { className: "vat" }, h("dt", null, L("incl. {rate}% VAT", { rate: p.vat || 19 })), h("dd", null, money(Math.round(vat * 100) / 100)))),
      p.action);
  }
  function CheckoutSteps(p) {
    var steps = p.steps || [L("Cart"), L("Details"), L("Shipping"), L("Payment")], cur = p.current || 0;
    return h("ol", { className: "ha-csteps", "aria-label": L("Checkout progress") }, steps.map(function (s, i) {
      return h("li", { key: s, className: cx(i < cur && "done", i === cur && "cur"), "aria-current": i === cur ? "step" : undefined },
        h("button", { type: "button", disabled: i > cur || !p.onPick, onClick: function () { p.onPick && p.onPick(i); } }, h("span", { className: "ha-cstep-n" }, i < cur ? h(Icon, { name: "check", size: 12 }) : i + 1), s));
    }));
  }
  var ORDER_STEPS = [L("Placed"), L("Paid"), L("Packed"), L("Shipped"), L("Delivered")];
  function OrderTimeline(p) {
    var cur = ORDER_STEPS.indexOf(p.status), times = p.times || {}, cancelled = p.status === "Cancelled" || p.status === "Refunded";
    return h("div", { className: cx("ha-otl", cancelled && "cancelled") }, ORDER_STEPS.map(function (s, i) {
      var done = !cancelled && i <= cur;
      return h("div", { key: s, className: cx("ha-otl-step", done && "done", i === cur && !cancelled && "cur") }, h("span", { className: "ha-otl-dot" }, done ? h(Icon, { name: i === cur && s !== "Delivered" ? "clock" : "check", size: 12 }) : null), h("b", null, s), h("small", null, times[s] || (done ? "" : "—")));
    }), cancelled && h("div", { className: "ha-otl-cancel" }, h(Badge, { tone: "danger" }, p.status)));
  }

  /* ── System screens ── */
  function StatusScreen(p) {
    var code = p.code || "404";
    var d = { "404": [L("Page not found"), L("The link may be old, or the page moved. Nothing is broken on your side."), "search", "sky"], "500": [L("Something broke on our side"), L("We’ve been notified and are on it. Your data is safe; try again in a minute."), "x", "blush"], "maintenance": [L("Back in a few minutes"), L("We’re upgrading the database. Everything you saved is safe."), "settings", "butter"], "offline": [L("You’re offline"), L("Changes are kept on this device and sync when you’re back."), "globe", "lilac"], "403": [L("You don’t have access"), L("Ask a workspace owner to invite you to this area."), "lock", "lilac"] }[code] || [p.title, p.text, "sparkle", "sky"];
    return h("div", { className: "ha-status-screen" },
      h("div", { className: "ha-status-art", "aria-hidden": true }, /^\d+$/.test(code) && h("span", { className: "ha-status-code" }, code), h(TintIcon, { icon: p.icon || d[2], tint: p.tint || d[3], size: 56 })),
      h("h1", null, p.title || d[0]), h("p", null, p.text || d[1]),
      p.extra,
      h("div", { className: "ha-row", style: { justifyContent: "center" } }, p.actions || [h(Button, { key: "h", icon: "home", onClick: p.onHome }, L("Back to overview")), h(Button, { key: "s", variant: "secondary", icon: "mail", onClick: p.onContact }, L("Contact support"))]),
      p.reference && h("span", { className: "ha-status-ref" }, L("Reference {ref}", { ref: p.reference })));
  }
  function PlanCard(p) {
    return h("div", { className: cx("ha-plan", p.featured && "featured", p.current && "current") },
      p.featured && h("span", { className: "ha-plan-flag" }, p.flag || L("Most popular")),
      h("div", { className: "ha-plan-head" }, h("b", null, p.name), p.text && h("span", null, p.text)),
      h("div", { className: "ha-plan-price" }, p.price === 0 ? h("b", null, L("Free")) : p.price == null ? h("b", null, L("Let’s talk")) : h(F, null, h("b", null, money(p.price)), h("span", null, p.per || L("per seat / month"))), p.was && h("s", null, money(p.was))),
      h(Button, { variant: p.current ? "soft" : p.featured ? "primary" : "secondary", disabled: p.current, onClick: p.onPick, className: "ha-plan-cta" }, p.current ? L("Current plan") : p.cta || L("Choose {name}", { name: p.name })),
      h("ul", { className: "ha-plan-feats" }, (p.features || []).map(function (f, i) { return h("li", { key: i, className: f[0] === "-" ? "no" : undefined }, h(Icon, { name: f[0] === "-" ? "minus" : "check", size: 14 }), f.replace(/^-/, "")); })));
  }
  function AuthCard(p) {
    return h("div", { className: "ha-auth" }, h("div", { className: "ha-auth-brand" }, h("span", { className: "ha-brand-word" }, p.brand || L("Halo")), h("span", { className: "ha-brand-dot" })),
      p.icon && h(TintIcon, { icon: p.icon, tint: p.tint || "sky", size: 48 }),
      h("div", { className: "ha-col", style: { gap: 8 } }, h("h1", { className: "ha-auth-title" }, p.title), p.text && h("p", { className: "ha-auth-text" }, p.text)),
      p.children, p.foot && h("div", { className: "ha-auth-foot" }, p.foot));
  }

  /* ════════ Kit 4: status, approvals A–D, foundations, agent & operations components ════════ */
  var STATUS = { ok: "dot", running: "pulse", signal: "diamond", warn: "triangle", danger: "square", idle: "ring" };
  var TONE_STATUS = { success: "ok", info: "running", highlight: "signal", warning: "warn", danger: "danger", neutral: "idle" };
  function StatusShape(p) { return h("span", { className: cx("ha-shape", "ha-shape-" + (STATUS[p.status] || "ring"), "ha-st-" + (p.status || "idle"), p.className), "aria-hidden": true }); }
  function StatusIndicator(p) {
    return h("span", { className: cx("ha-status", p.size === "sm" && "sm", p.className), role: p.label ? undefined : "img", "aria-label": p.label ? undefined : p.status }, h(StatusShape, { status: p.status }), p.label && h("span", { className: "ha-status-label" }, p.label));
  }

  /* ── Approval A–D ── */
  var FAMILY = { money: ["card", "Money"], infra: ["server", "Infrastructure"], comms: ["mail", "Communication"], marketing: ["trend", "Marketing"], apps: ["code", "Own apps"], legal: ["book", "Legal"] };
  function ApprovalCard(p) {
    var opts = p.options || [{ key: "A", label: p.approveLabel || L("Yes, run it as shown") }, { key: "B", label: L("Yes, with a change"), input: L("What should change?") }, { key: "C", label: L("No, discard") }, { key: "D", label: L("Different instruction"), input: L("What should happen instead?") }];
    var open = React.useState(null), txt = React.useState(""), ref = React.useRef(null);
    var d = p.decision || (p.state === "approved" ? { key: "A" } : p.state === "denied" ? { key: "C" } : null);
    function decide(o) {
      if (o.input && open[0] !== o.key) { open[1](o.key); txt[1](""); return; }
      if (o.input && !txt[0].trim()) return;
      p.onDecide && p.onDecide(o.key, o.input ? txt[0].trim() : null);
      if (o.key === "A") p.onApprove && p.onApprove(); if (o.key === "C") p.onDeny && p.onDeny(); if (o.key === "B") p.onEdit && p.onEdit(txt[0]);
      open[1](null);
    }
    function key(e) {
      if (d || e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
      var o = opts.find(function (x) { return x.key === e.key.toUpperCase(); }); if (o) { e.preventDefault(); decide(o); }
    }
    var fam = FAMILY[p.family];
    if (d) {
      var o = opts.find(function (x) { return x.key === d.key; }) || { key: d.key, label: "" };
      return h("div", { className: cx("ha-approval ha-approval-done", d.key === "A" || d.key === "B" ? "yes" : "no", p.className) },
        h(StatusShape, { status: d.key === "A" || d.key === "B" ? "ok" : "idle" }), h("b", null, o.key + " · " + o.label), p.title && h("span", { className: "ha-approval-done-what" }, p.title),
        h("span", { className: "ha-approval-done-by" }, [d.by, d.at].filter(Boolean).join(" · ")), d.text && h("span", { className: "ha-approval-done-note" }, "“" + d.text + "”"));
    }
    return h("div", { ref: ref, className: cx("ha-approval", p.compact && "compact", p.className), tabIndex: 0, onKeyDown: key, role: "group", "aria-label": p.title },
      h("div", { className: "ha-approval-top" }, h(StatusShape, { status: "signal" }), h("b", null, p.heading || L("Approval needed")),
        (p.agent || p.project) && h("span", { className: "ha-approval-who" }, [p.agent, p.project].filter(Boolean).join(" · ")),
        fam && h(Badge, { tone: "neutral", dot: false, className: "ha-family" }, h(Icon, { name: fam[0], size: 12 }), p.familyLabel || L(fam[1])),
        p.age && h("span", { className: "ha-approval-age" }, p.age)),
      h("div", { className: "ha-approval-main" },
        p.title && h("p", { className: "ha-approval-title" }, p.title),
        p.text && h("p", { className: "ha-approval-reason" }, p.text),
        p.children && h("div", { className: "ha-approval-body" }, p.children)),
      h("div", { className: "ha-approval-opts", role: "list" }, opts.map(function (o, i) {
        return h("div", { key: o.key, role: "listitem" },
          h("button", { type: "button", className: cx("ha-approval-opt", i === 0 && "primary", open[0] === o.key && "open"), onClick: function () { decide(o); }, "aria-keyshortcuts": o.key },
            h("kbd", null, o.key), h("span", null, o.label), o.input && open[0] !== o.key && h(Icon, { name: "chevronRight", size: 14 })),
          o.input && open[0] === o.key && h("div", { className: "ha-approval-input ha-in" }, h("textarea", { className: "ha-input", rows: 2, autoFocus: true, placeholder: o.input, value: txt[0], onChange: function (e) { txt[1](e.target.value); }, onKeyDown: function (e) { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) decide(o); if (e.key === "Escape") open[1](null); } }),
            h("div", { className: "ha-row", style: { justifyContent: "flex-end" } }, h(Button, { size: "sm", variant: "ghost", onClick: function () { open[1](null); } }, L("Cancel")), h(Button, { size: "sm", disabled: !txt[0].trim(), onClick: function () { decide(o); } }, o.key + " · " + L("Send")))));
      })),
      (p.escalation || p.trace || p.note) && h("div", { className: "ha-approval-foot" }, p.escalation && h("span", null, h(Icon, { name: "clock", size: 13 }), p.escalation), p.note && h("span", null, p.note), p.trace && h("span", { className: "ha-approval-trace" }, p.trace)));
  }
  function ApprovalInbox(p) {
    var items = (p.items || []).slice().sort(function (a, b) { return (b.ageMin || 0) - (a.ageMin || 0); });
    return h("div", { className: "ha-inbox", role: "listbox", "aria-label": p.label || L("Approvals"), onKeyDown: function (e) {
      var i = items.findIndex(function (x) { return x.id === p.selected; }); if (e.key === "j" || e.key === "ArrowDown") { e.preventDefault(); var n = items[Math.min(items.length - 1, i + 1)]; n && p.onSelect && p.onSelect(n.id); } if (e.key === "k" || e.key === "ArrowUp") { e.preventDefault(); var q = items[Math.max(0, i - 1)]; q && p.onSelect && p.onSelect(q.id); } } },
      items.length === 0 ? h(EmptyState, { icon: "check", tint: "mint", title: p.emptyTitle || L("Nothing waiting for you"), text: p.emptyText }) : items.map(function (x) {
        var fam = FAMILY[x.family];
        return h("button", { key: x.id, type: "button", role: "option", "aria-selected": x.id === p.selected, className: cx("ha-inbox-row", x.id === p.selected && "on"), onClick: function () { p.onSelect && p.onSelect(x.id); } },
          h(StatusShape, { status: "signal" }), h("span", { className: "ha-inbox-text" }, h("b", null, x.title), h("small", null, [x.agent, x.project].filter(Boolean).join(" · "))),
          fam && h(Badge, { tone: "neutral", dot: false, className: "ha-family" }, h(Icon, { name: fam[0], size: 12 }), x.familyLabel || L(fam[1])),
          h("span", { className: cx("ha-inbox-age", x.urgent && "warn") }, x.urgent && h(StatusShape, { status: "warn" }), x.age));
      }));
  }

  /* ── Foundations ── */
  function Kbd(p) { var keys = p.keys || [p.children]; return h("span", { className: "ha-kbds" }, keys.map(function (k, i) { return h("kbd", { key: i, className: "ha-kbd2" }, k); })); }
  function KeyValue(p) {
    return h("dl", { className: cx("ha-kv", p.dense && "dense", p.className) }, (p.items || []).map(function (it, i) {
      var r = Array.isArray(it) ? { k: it[0], v: it[1], mono: it[2] } : it;
      return h("div", { key: i }, h("dt", null, r.k), h("dd", { className: r.mono ? "ha-mono" : undefined }, r.v == null || r.v === "" ? h("span", { className: "ha-kv-empty" }, "—") : r.v));
    }));
  }
  function Spinner(p) { return h("span", { className: cx("ha-spinner", p.size === "lg" && "lg"), role: "status", "aria-label": p.label || L("Loading") }); }
  function Collapsible(p) {
    var o = useControlled(p.open, !!p.defaultOpen, p.onOpenChange);
    return h("div", { className: cx("ha-collapse", o[0] && "open", p.className) },
      h("button", { type: "button", className: "ha-collapse-head", "aria-expanded": o[0], onClick: function () { o[1](!o[0]); } }, h(Icon, { name: "chevronRight", size: 14, className: "ha-collapse-chev" }), h("b", null, p.title), p.meta && h("span", { className: "ha-collapse-meta" }, p.meta)),
      o[0] && h("div", { className: "ha-collapse-body ha-in" }, p.children));
  }
  function ContextMenu(p) {
    var pos = React.useState(null), ref = React.useRef(null), lp = React.useRef(null);
    useOutside(ref, !!pos[0], function () { pos[1](null); });
    function openAt(x, y) { var r = ref.current.getBoundingClientRect(); pos[1]({ x: x - r.left, y: y - r.top }); }
    return h("div", { ref: ref, className: "ha-ctx", onContextMenu: function (e) { e.preventDefault(); openAt(e.clientX, e.clientY); },
      onTouchStart: function (e) { var t = e.touches[0]; lp.current = setTimeout(function () { openAt(t.clientX, t.clientY); }, 500); }, onTouchEnd: function () { clearTimeout(lp.current); } },
      p.children,
      pos[0] && h("div", { className: "ha-ctx-menu", style: { left: pos[0].x, top: pos[0].y } }, h(Menu, { items: (p.items || []).map(function (it) { return it === "-" ? it : Object.assign({}, it, { onClick: function () { pos[1](null); it.onClick && it.onClick(); } }); }) })));
  }
  function SplitPane(p) {
    var key = p.storageKey && "ha-split-" + p.storageKey, init = p.defaultSize || 360;
    try { if (key && localStorage.getItem(key)) init = +localStorage.getItem(key); } catch (e) {}
    var size = React.useState(init), wrap = React.useRef(null), drag = React.useRef(false);
    function set(v) { v = Math.max(p.min || 200, Math.min(p.max || 720, v)); size[1](v); try { key && localStorage.setItem(key, v); } catch (e) {} }
    React.useEffect(function () {
      function mv(e) { if (!drag.current) return; var r = wrap.current.getBoundingClientRect(); set(e.clientX - r.left); }
      function up() { drag.current = false; document.body.style.cursor = ""; }
      window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
      return function () { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
    }, []);
    return h("div", { ref: wrap, className: cx("ha-split", p.className), style: { "--split": size[0] + "px" } },
      h("div", { className: "ha-split-a" }, p.left),
      h("div", { className: "ha-split-handle", role: "separator", "aria-orientation": "vertical", "aria-valuenow": size[0], tabIndex: 0, onPointerDown: function (e) { e.preventDefault(); drag.current = true; document.body.style.cursor = "col-resize"; }, onDoubleClick: function () { set(p.defaultSize || 360); },
        onKeyDown: function (e) { if (e.key === "ArrowLeft") set(size[0] - 16); if (e.key === "ArrowRight") set(size[0] + 16); } }),
      h("div", { className: "ha-split-b" }, p.right));
  }
  function TreeView(p) {
    var open = React.useState(p.defaultOpen || []), sel = useControlled(p.selected, null, p.onSelect);
    function node(n, depth) {
      var kids = n.children && n.children.length, isOpen = open[0].indexOf(n.id) > -1;
      return h("li", { key: n.id, role: "treeitem", "aria-expanded": kids ? isOpen : undefined, "aria-selected": sel[0] === n.id },
        h("div", { className: cx("ha-tree-row", sel[0] === n.id && "on"), style: { paddingLeft: 8 + depth * 16 }, tabIndex: 0, onClick: function () { sel[1](n.id); if (kids) open[1](isOpen ? open[0].filter(function (x) { return x !== n.id; }) : open[0].concat([n.id])); },
          onKeyDown: function (e) { if (e.key === "ArrowRight" && kids && !isOpen) open[1](open[0].concat([n.id])); if (e.key === "ArrowLeft" && isOpen) open[1](open[0].filter(function (x) { return x !== n.id; })); if (e.key === "Enter") sel[1](n.id); } },
          kids ? h(Icon, { name: "chevronRight", size: 13, className: cx("ha-tree-chev", isOpen && "open") }) : h("span", { className: "ha-tree-sp" }),
          n.icon && h(Icon, { name: n.icon, size: 15 }), h("span", { className: "ha-tree-label" }, n.label), n.meta != null && h("span", { className: "ha-tree-meta" }, n.meta)),
        kids && isOpen && h("ul", { role: "group" }, n.children.map(function (c) { return node(c, depth + 1); })));
    }
    return h("ul", { className: "ha-tree", role: "tree", "aria-label": p.label }, (p.items || []).map(function (n) { return node(n, 0); }));
  }
  function InlineEdit(p) {
    var ed = React.useState(false), v = React.useState(p.value);
    function save() { ed[1](false); if (v[0] !== p.value) p.onSave && p.onSave(v[0]); }
    if (!ed[0]) return h("span", { className: cx("ha-inline", p.mono && "ha-mono", p.align === "right" && "right"), tabIndex: 0, role: "button", "aria-label": p.label, onDoubleClick: function () { v[1](p.value); ed[1](true); }, onKeyDown: function (e) { if (e.key === "Enter") { v[1](p.value); ed[1](true); } } }, p.display ? p.display(p.value) : p.value, h(Icon, { name: "edit", size: 12, className: "ha-inline-ico" }));
    return p.options ? h("select", { className: "ha-input ha-inline-input", autoFocus: true, value: v[0], onChange: function (e) { v[1](e.target.value); }, onBlur: save, onKeyDown: function (e) { if (e.key === "Enter") save(); if (e.key === "Escape") ed[1](false); } }, p.options.map(function (o) { return h("option", { key: o, value: o }, o); }))
      : h("input", { className: cx("ha-input ha-inline-input", p.mono && "ha-mono"), autoFocus: true, value: v[0], type: p.type || "text", onChange: function (e) { v[1](e.target.value); }, onBlur: save, onKeyDown: function (e) { if (e.key === "Enter") save(); if (e.key === "Escape") ed[1](false); } });
  }
  function LogView(p) {
    var ref = React.useRef(null), hover = React.useRef(false);
    React.useEffect(function () { if (p.follow !== false && !hover.current && ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [(p.lines || []).length]);
    return h("div", { className: cx("ha-log", p.className), style: { maxHeight: p.maxHeight } },
      p.title && h("div", { className: "ha-code-head" }, h("span", null, p.title), p.right),
      h("pre", { ref: ref, onPointerEnter: function () { hover.current = true; }, onPointerLeave: function () { hover.current = false; } }, (p.lines || []).map(function (l, i) {
        var r = typeof l === "string" ? { text: l } : l;
        return h("span", { key: i, className: cx("ha-log-line", r.level && "lv-" + r.level, r.fresh && "fresh") }, p.numbers !== false && h("i", null, i + 1), r.time && h("em", null, r.time), r.text, "\n");
      })));
  }
  function CodeViewer(p) {
    var code = typeof p.value === "string" ? p.value : JSON.stringify(p.value, null, 2);
    return h(CodeBlock, { code: code, lang: p.lang || (typeof p.value === "string" ? "text" : "json") });
  }
  function SecretField(p) {
    var shown = React.useState(false), copied = React.useState(false);
    var masked = (p.prefix || "") + "••••••••" + (p.last4 || "");
    return h("div", { className: "ha-secret" },
      h(Icon, { name: "key", size: 15 }), h("span", { className: "ha-mono ha-secret-val" }, shown[0] && p.value ? p.value : masked),
      p.meta && h("span", { className: "ha-secret-meta" }, p.meta),
      h("span", { className: "ha-row", style: { flexWrap: "nowrap", gap: 4 } },
        p.onReveal && h(Tooltip, { label: shown[0] ? L("Hide") : L("Reveal") }, h("button", { type: "button", className: "ha-iconbtn ha-iconbtn-ghost ha-iconbtn-sm", "aria-label": shown[0] ? L("Hide") : L("Reveal"), onClick: function () { if (shown[0]) return shown[1](false); Promise.resolve(p.onReveal()).then(function (ok) { if (ok !== false) shown[1](true); }); } }, h(Icon, { name: "eye", size: 14 }))),
        p.onCopy && h(Tooltip, { label: copied[0] ? L("Copied") : L("Copy") }, h("button", { type: "button", className: "ha-iconbtn ha-iconbtn-ghost ha-iconbtn-sm", "aria-label": L("Copy"), onClick: function () { p.onCopy(); copied[1](true); setTimeout(function () { copied[1](false); }, 1400); } }, h(Icon, { name: copied[0] ? "check" : "file", size: 14 }))),
        p.onRotate && h(Button, { size: "sm", variant: "soft", icon: "refresh", onClick: p.onRotate }, L("Rotate"))));
  }
  function MoneyInput(p) {
    var id = useId("mi"), v = useControlled(p.value, p.defaultValue != null ? p.defaultValue : null, p.onChange), txt = React.useState(v[0] != null ? fmtNum(v[0], { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "");
    var dec = (fmtNum(1.5).match(/[^0-9]/) || ["."])[0];
    function parse(s) { var t = s.replace(new RegExp("[^0-9" + (dec === "," ? "," : ".") + "-]", "g"), "").replace(",", "."); var n = parseFloat(t); return isNaN(n) ? null : Math.round(n * 100) / 100; }
    var sym = fmtMoney(0, p.currency).replace(/[\d.,\s]/g, "");
    return h(FormField, { id: id, label: p.label, hint: p.hint, error: p.error, required: p.required },
      h("div", { className: "ha-money" },
        h("span", { className: "ha-inputwrap", style: { flex: 1 } }, h("input", { id: id, className: "ha-input ha-money-input", inputMode: "decimal", value: txt[0], placeholder: fmtNum(0, { minimumFractionDigits: 2 }), onChange: function (e) { txt[1](e.target.value); }, onBlur: function () { var n = parse(txt[0]); v[1](n); txt[1](n == null ? "" : fmtNum(n, { minimumFractionDigits: 2, maximumFractionDigits: 2 })); } }), h("span", { className: "ha-input-suffix" }, sym)),
        p.vatOptions && h("select", { className: "ha-input ha-money-vat", "aria-label": L("VAT rate"), value: p.vat, onChange: function (e) { p.onVat && p.onVat(e.target.value); } }, p.vatOptions.map(function (o) { var r = typeof o === "object" ? o : { value: o, label: o + " %" }; return h("option", { key: r.value, value: r.value }, r.label); }))),
      p.showGross && v[0] != null && p.vat != null && !isNaN(+p.vat) && h("span", { className: "ha-field-hint" }, L("Gross {amount}", { amount: fmtMoney(v[0] * (1 + p.vat / 100), p.currency, { minimumFractionDigits: 2 }) })));
  }
  function SettingsLayout(p) {
    return h("div", { className: "ha-settings" }, (p.sections || []).map(function (s, i) {
      return h("section", { key: s.id || i, className: "ha-settings-row" }, h("div", { className: "ha-settings-label" }, h("b", null, s.title), s.text && h("span", null, s.text), s.badge), h("div", { className: "ha-settings-ctl" }, s.children));
    }), p.footer && h("div", { className: "ha-settings-foot" }, p.footer));
  }
  function ShortcutsOverlay(p) {
    React.useEffect(function () { if (!p.open) return; function k(e) { if (e.key === "Escape") p.onClose && p.onClose(); } document.addEventListener("keydown", k); return function () { document.removeEventListener("keydown", k); }; }, [p.open]);
    if (!p.open) return null;
    return portal(h("div", { className: "ha-overlay" }, h("div", { className: "ha-backdrop", onClick: p.onClose }),
      h("div", { className: "ha-modal ha-shortcuts", role: "dialog", "aria-modal": "true", "aria-label": p.title || L("Keyboard shortcuts") },
        h("div", { className: "ha-row", style: { justifyContent: "space-between" } }, h("h2", { className: "ha-modal-title" }, p.title || L("Keyboard shortcuts")), h(IconButton, { icon: "x", label: L("Close"), size: "sm", onClick: p.onClose })),
        h("div", { className: "ha-shortcuts-grid" }, (p.groups || []).map(function (g) {
          return h("div", { key: g.title, className: "ha-shortcuts-group" }, h("span", { className: "ha-menu-label" }, g.title), g.items.map(function (it) { return h("div", { key: it[0], className: "ha-shortcut" }, h("span", null, it[0]), h(Kbd, { keys: it[1] })); }));
        })))));
  }
  function StatCell(p) {
    var up = p.delta != null && p.delta >= 0, good = p.invert ? !up : up;
    return h("div", { className: cx("ha-statcell", p.tint && "ha-bg-" + p.tint, p.className) },
      h("div", { className: "ha-statcell-top" }, h("span", { className: "ha-statcell-label" }, p.label), p.icon && h(TintIcon, { icon: p.icon, tint: p.iconTint || "plain" })),
      h("div", { className: "ha-statcell-mid" }, h("div", { style: { minWidth: 0 } }, h(CountUp, { className: "ha-statcell-value", value: p.value }),
        p.delta != null && h("div", { className: cx("ha-delta", good ? "good" : "bad") }, h("span", { "aria-hidden": true }, up ? "▲" : "▼"), " ", (p.deltaText || fmtNum(Math.abs(p.delta), { maximumFractionDigits: 1 }) + "%") + (p.compare ? " " + p.compare : ""))),
        p.spark && h("div", { className: "ha-statcell-spark" }, h(Sparkline, { values: p.spark, tint: good ? "mint" : "blush", width: 88, height: 32 }))));
  }
  function UptimeBar(p) {
    var days = p.days || [], hov = React.useState(null);
    return h("div", { className: "ha-uptime" },
      h("div", { className: "ha-uptime-bar", onPointerLeave: function () { hov[1](null); } }, days.map(function (d, i) { var r = typeof d === "string" ? { status: d } : d; return h("i", { key: i, className: "st-" + (r.status || "none"), onPointerEnter: function () { hov[1](i); } }); })),
      h("div", { className: "ha-uptime-foot" }, h("span", null, hov[0] != null ? (days[hov[0]].label || L("{n} days ago", { n: days.length - hov[0] - 1 })) + (days[hov[0]].note ? " · " + days[hov[0]].note : "") : p.caption || L("Last {n} days", { n: days.length })), p.uptime != null && h("b", { className: "ha-mono" }, fmtNum(p.uptime, { maximumFractionDigits: 2 }) + " %")));
  }
  function Meter(p) {
    var pct = Math.max(0, Math.min(100, (p.value || 0) / (p.max || 100) * 100)), tone = p.tone || (pct >= (p.danger || 90) ? "blush" : pct >= (p.warn || 75) ? "butter" : "mint");
    return h("div", { className: "ha-meter" }, h("div", { className: "ha-usage-top" }, h("span", null, p.label), h("b", null, p.text || Math.round(pct) + " %")), h("span", { className: "ha-usage-track" }, h("span", { className: "ha-usage-fill ha-sf-" + tone, style: { width: pct + "%" } })));
  }

  /* ── Agents ── */
  function AgentCard(p) {
    return h("div", { className: cx("ha-agentcard", p.onClick && "click"), onClick: p.onClick, tabIndex: p.onClick ? 0 : undefined },
      h("div", { className: "ha-agentcard-top" }, h(AgentMark, { tint: p.tint, live: p.status === "running", size: 40 }), h("div", { className: "ha-option-text" }, h("b", null, p.name), h("small", null, p.role)), p.onChat && h(IconButton, { icon: "mail", label: L("Chat with {name}", { name: p.name }), size: "sm", onClick: function (e) { e.stopPropagation(); p.onChat(); } })),
      h(StatusIndicator, { status: p.status, label: p.statusLabel }),
      h(KeyValue, { dense: true, items: [[L("Model"), p.model], [L("Cost today"), p.cost, true], [L("Last action"), p.last]].filter(function (r) { return r[1] != null; }) }));
  }
  function AgentDetails(p) {
    return h("div", { className: "ha-agentdetails" },
      h("div", { className: "ha-agentdetails-id" }, h(AgentMark, { tint: p.tint, size: 56, live: p.status === "running" }), h("b", null, p.name), h("span", { className: "ha-card-desc" }, p.role), h(StatusIndicator, { status: p.status, label: p.statusLabel })),
      (p.sections || []).map(function (s, i) { return h(Collapsible, { key: i, title: s.title, meta: s.meta, defaultOpen: s.open !== false }, s.items ? h(KeyValue, { dense: true, items: s.items }) : s.children); }),
      p.actions && h("div", { className: "ha-col", style: { gap: 8 } }, p.actions));
  }
  function ChatList(p) {
    var q = React.useState("");
    var groups = (p.groups || []).map(function (g) { return Object.assign({}, g, { items: g.items.filter(function (c) { return !q[0] || (c.name + " " + (c.sub || "")).toLowerCase().indexOf(q[0].toLowerCase()) > -1; }) }); }).filter(function (g) { return g.items.length; });
    return h("div", { className: "ha-chatlist" },
      h(SearchField, { placeholder: p.searchPlaceholder || L("Search chats"), value: q[0], onChange: function (e) { q[1](e.target.value); p.onSearch && p.onSearch(e.target.value); } }),
      p.filters,
      h("div", { className: "ha-chatlist-scroll" }, groups.length === 0 ? h("p", { className: "ha-card-desc", style: { padding: 12 } }, L("No chats match")) : groups.map(function (g) {
        return h("div", { key: g.title, className: "ha-chatlist-group" }, h("div", { className: "ha-menu-label" }, g.mark && h("i", { className: "ha-sw ha-sw-" + g.mark }), g.title),
          g.items.map(function (c) {
            return h("button", { key: c.id, type: "button", className: cx("ha-chatrow", c.id === p.selected && "on"), onClick: function () { p.onSelect && p.onSelect(c.id); } },
              c.avatar ? h(Avatar, { name: c.name, size: 36 }) : h(AgentMark, { tint: c.tint, live: c.status === "running", size: 36 }),
              h("span", { className: "ha-chatrow-text" }, h("span", { className: "ha-chatrow-top" }, h("b", null, c.name), h("small", null, c.time)), h("span", { className: "ha-chatrow-sub" }, c.status && h(StatusShape, { status: c.status }), c.sub)),
              c.unread ? h("span", { className: "ha-nav-count" }, c.unread) : c.pinned ? h(Icon, { name: "star", size: 13, className: "ha-chatrow-pin" }) : null);
          }));
      })));
  }
  function ChatWorkspace(p) {
    return h("div", { className: cx("ha-chatws", p.details && "with-details", p.className) }, h("div", { className: "ha-chatws-list" }, p.list), h("div", { className: "ha-chatws-thread" }, p.thread), p.details && h("div", { className: "ha-chatws-details" }, p.details));
  }
  function SearchHits(p) {
    return h("div", { className: "ha-hits" }, (p.items || []).length === 0 ? h(EmptyState, { icon: "search", title: L("Nothing found"), text: p.emptyText }) : p.items.map(function (x) {
      var parts = String(x.text).split(new RegExp("(" + (p.query || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"));
      return h("button", { key: x.id, type: "button", className: "ha-hit", onClick: function () { p.onOpen && p.onOpen(x); } }, h("span", { className: "ha-hit-top" }, h("b", null, x.chat), h("small", null, x.time)), h("span", { className: "ha-hit-text" }, x.who && h("b", null, x.who + ": "), parts.map(function (t, i) { return i % 2 ? h("mark", { key: i }, t) : t; })));
    }));
  }
  function ThinkingLine(p) { return h("div", { className: "ha-thinking", role: "status" }, h(TypingDots, null), h("span", null, p.text || L("Thinking…"))); }
  function FeedbackRating(p) {
    var v = useControlled(p.value, null, p.onRate), c = React.useState(""), sent = React.useState(false);
    if (sent[0]) return h("span", { className: "ha-feedback-done" }, h(Icon, { name: "check", size: 13 }), p.thanks || L("Thanks, noted"));
    return h("div", { className: "ha-feedback" },
      h("div", { className: "ha-row", style: { gap: 4, flexWrap: "nowrap" } }, p.label && h("span", { className: "ha-card-desc" }, p.label),
        h("button", { type: "button", className: cx("ha-msg-act", v[0] === "up" && "on"), "aria-pressed": v[0] === "up", "aria-label": L("Good"), onClick: function () { v[1]("up"); if (!p.askOnUp) { sent[1](true); p.onSubmit && p.onSubmit("up", ""); } } }, h(Icon, { name: "thumbUp", size: 14 })),
        h("button", { type: "button", className: cx("ha-msg-act", v[0] === "down" && "on"), "aria-pressed": v[0] === "down", "aria-label": L("Not good"), onClick: function () { v[1]("down"); } }, h(Icon, { name: "thumbDown", size: 14 }))),
      v[0] === "down" && h("form", { className: "ha-feedback-form ha-in", onSubmit: function (e) { e.preventDefault(); sent[1](true); p.onSubmit && p.onSubmit("down", c[0]); } }, h("input", { className: "ha-input", autoFocus: true, placeholder: p.placeholder || L("What should be different?"), value: c[0], onChange: function (e) { c[1](e.target.value); } }), h(Button, { type: "submit", size: "sm" }, L("Send"))));
  }
  function ActivityFeed(p) {
    return h("div", { className: "ha-activity" }, (p.groups || [{ items: p.items || [] }]).map(function (g, gi) {
      return h("div", { key: gi, className: "ha-activity-group" }, g.title && h("div", { className: "ha-menu-label" }, g.title), h("ol", null, g.items.map(function (it, i) {
        return h("li", { key: i, className: "ha-activity-item" }, h("span", { className: "ha-activity-time ha-mono" }, it.time), h("span", { className: "ha-activity-spine" }, h(StatusShape, { status: it.status || "ok" })), h("span", { className: "ha-activity-text" }, it.actor && h("b", null, it.actor + " "), it.text, it.link && h("span", null, " ", it.link)));
      })));
    }));
  }
  function DailyBriefing(p) {
    return h("div", { className: "ha-briefing" },
      h("div", { className: "ha-briefing-head" }, h(AgentMark, { tint: p.tint || "lilac", size: 40 }), h("div", { className: "ha-option-text" }, h("b", null, p.title), h("small", null, p.time))),
      h("p", { className: "ha-briefing-text" }, p.summary),
      p.attention && p.attention.length > 0 && h("div", { className: "ha-col", style: { gap: 8 } }, h("span", { className: "ha-menu-label", style: { padding: 0 } }, p.attentionTitle || L("Needs you")), p.attention.map(function (a, i) { return h("button", { key: i, type: "button", className: "ha-briefing-item", onClick: a.onClick }, h(StatusShape, { status: a.status || "signal" }), h("span", null, a.text), h(Icon, { name: "chevronRight", size: 14 })); })),
      p.suggestions && p.suggestions.length > 0 && h("div", { className: "ha-col", style: { gap: 8 } }, h("span", { className: "ha-menu-label", style: { padding: 0 } }, p.suggestionsTitle || L("Suggestions")), h("ul", { className: "ha-briefing-sugg" }, p.suggestions.map(function (s, i) { return h("li", { key: i }, s); }))));
  }
  function BudgetStop(p) {
    return h("div", { className: "ha-budgetstop" },
      h(Alert, { tone: "danger", title: p.title || L("Budget used up · agents paused"), action: p.onRaise && h(Button, { size: "sm", variant: "secondary", onClick: p.onRaise }, p.actionLabel || L("Raise budget")) }, p.text || L("Everything is kept. Agents continue where they stopped once the budget allows it.")),
      h(Meter, { label: L("Spent this month"), value: p.spent, max: p.budget, text: fmtMoney(p.spent) + " / " + fmtMoney(p.budget), tone: "blush" }),
      p.paused && h(KeyValue, { dense: true, items: [[L("Paused"), p.paused], [L("Still running"), p.running || L("Nothing")]] }));
  }
  function MemoryViewer(p) {
    var q = React.useState(""), scope = React.useState(null);
    var scopes = []; (p.items || []).forEach(function (m) { if (scopes.indexOf(m.scope) < 0) scopes.push(m.scope); });
    var list = (p.items || []).filter(function (m) { return (!scope[0] || m.scope === scope[0]) && (!q[0] || m.text.toLowerCase().indexOf(q[0].toLowerCase()) > -1); });
    return h("div", { className: "ha-memory" },
      h("div", { className: "ha-filterbar" }, h(SearchField, { placeholder: L("Search memory"), value: q[0], onChange: function (e) { q[1](e.target.value); }, style: { flex: "1 1 200px", minWidth: 0 } }), scopes.map(function (s) { return h(Chip, { key: s, selected: scope[0] === s, onClick: function () { scope[1](scope[0] === s ? null : s); } }, s); })),
      list.length === 0 ? h("p", { className: "ha-card-desc" }, L("Nothing remembered here yet.")) : list.map(function (m) {
        return h("div", { key: m.id, className: "ha-memitem" }, h("p", null, m.text), h("div", { className: "ha-memitem-meta" }, h(Badge, { tone: "neutral", dot: false }, m.scope), m.source && h("span", null, m.source), m.date && h("span", null, m.date),
          h("span", { className: "ha-row", style: { marginLeft: "auto", gap: 4, flexWrap: "nowrap" } }, p.onEdit && h(IconButton, { icon: "edit", label: L("Edit"), size: "sm", variant: "ghost", onClick: function () { p.onEdit(m); } }), p.onDelete && h(IconButton, { icon: "trash", label: L("Forget"), size: "sm", variant: "ghost", onClick: function () { p.onDelete(m); } }))));
      }));
  }
  function OverrideDiff(p) {
    var a = String(p.before || "").split("\n"), b = String(p.after || "").split("\n"), rows = [], i = 0, j = 0;
    while (i < a.length || j < b.length) { if (a[i] === b[j]) { rows.push([" ", a[i]]); i++; j++; } else if (j < b.length && a.indexOf(b[j], i) < 0) { rows.push(["+", b[j]]); j++; } else if (i < a.length) { rows.push(["-", a[i]]); i++; } else { rows.push(["+", b[j]]); j++; } }
    return h("div", { className: "ha-diff" },
      h("div", { className: "ha-diff-head" }, h("div", { className: "ha-option-text" }, h("b", null, p.title), h("small", null, [p.versions, p.by].filter(Boolean).join(" · "))), h("span", { className: "ha-row", style: { flexWrap: "nowrap" } }, p.onDiscard && h(Button, { size: "sm", variant: "ghost", onClick: p.onDiscard }, p.discardLabel || L("Discard override")), p.onPromote && h(Button, { size: "sm", variant: "soft", icon: "branch", onClick: p.onPromote }, p.promoteLabel || L("Move to code")))),
      h("pre", { className: "ha-diff-body" }, rows.map(function (r, k) { return h("span", { key: k, className: r[0] === "+" ? "add" : r[0] === "-" ? "del" : "" }, h("i", null, r[0]), r[1], "\n"); })));
  }
  var TRIGGER_ICON = { schedule: "clock", event: "zap", webhook: "link", mail: "mail" };
  function TriggerList(p) {
    return h("div", { className: "ha-triggers" }, (p.items || []).map(function (t) {
      return h("div", { key: t.id, className: cx("ha-trigger", t.enabled === false && "off") },
        h(TintIcon, { icon: TRIGGER_ICON[t.type] || "zap", tint: t.enabled === false ? "plain" : "sky" }),
        h("span", { className: "ha-option-text" }, h("b", null, t.rule), h("small", null, [t.agent, t.by].filter(Boolean).join(" · "))),
        h("span", { className: "ha-trigger-next" }, t.next), p.onToggle && h("input", { type: "checkbox", role: "switch", className: "ha-switch", checked: t.enabled !== false, "aria-label": t.rule, onChange: function () { p.onToggle(t); } }),
        p.onRun && h(Tooltip, { label: L("Run now") }, h("button", { type: "button", className: "ha-iconbtn ha-iconbtn-soft ha-iconbtn-sm", "aria-label": L("Run now"), onClick: function () { p.onRun(t); } }, h(Icon, { name: "play", size: 12 }))));
    }));
  }
  function ScheduleCalendar(p) {
    var from = p.from != null ? p.from : 6, to = p.to != null ? p.to : 22, hours = []; for (var i = from; i < to; i++) hours.push(i);
    var days = p.days || weekdays(), rowH = 32;
    return h("div", { className: "ha-sched", style: { "--rows": hours.length, "--row-h": rowH + "px" } },
      h("span"), days.map(function (d, i) { return h("span", { key: i, className: "ha-sched-day" }, d); }),
      h("div", { className: "ha-sched-times" }, hours.map(function (hh) { return h("span", { key: hh }, (hh < 10 ? "0" : "") + hh + ":00"); })),
      days.map(function (_, di) {
        return h("div", { key: di, className: "ha-sched-col" }, (p.events || []).filter(function (e) { return e.day === di; }).map(function (e, k) {
          var top = (e.start - from) * rowH, ht = Math.max(rowH / 2, (e.end - e.start) * rowH - 4);
          return h("button", { key: k, type: "button", className: cx("ha-sched-ev", "ha-bg-" + (e.tint || "sky"), e.self && "self"), style: { top: top, height: ht }, title: e.title || e.label, onClick: function () { p.onOpen && p.onOpen(e); } }, h("b", null, e.label), ht > 30 && e.sub && h("small", null, e.sub));
        }));
      }));
  }
  function OrgChart(p) {
    function node(n) {
      return h("li", { key: n.id || n.name }, h("div", { className: cx("ha-org-node", n.root && "root") }, n.avatar ? h(Avatar, { name: n.name, size: 32 }) : h(AgentMark, { tint: n.tint, size: 32, live: n.status === "running" }), h("span", { className: "ha-option-text" }, h("b", null, n.name), h("small", null, n.role)), n.status && h(StatusShape, { status: n.status })),
        n.children && n.children.length > 0 && h("ul", null, n.children.map(node)));
    }
    return h("div", { className: "ha-org" }, h("ul", null, node(Object.assign({ root: true }, p.root))));
  }
  function VoiceMode(p) {
    var st = p.state || "listening", bars = []; for (var i = 0; i < 24; i++) bars.push(i);
    return h("div", { className: cx("ha-voice", "is-" + st) },
      h(AgentMark, { tint: p.tint || "lilac", size: 72, live: st !== "idle" }),
      h("b", { className: "ha-voice-name" }, p.name), h("span", { className: "ha-voice-state" }, p.stateLabel || L(st === "listening" ? "Listening…" : st === "thinking" ? "Thinking…" : st === "speaking" ? "Speaking…" : "Paused")),
      h("div", { className: "ha-voice-wave", "aria-hidden": true }, bars.map(function (b) { return h("i", { key: b, style: { animationDelay: (b * 47 % 600) + "ms", height: st === "idle" ? 4 : undefined } }); })),
      p.transcript && h("p", { className: "ha-voice-transcript" }, p.transcript),
      h("div", { className: "ha-row", style: { justifyContent: "center" } }, p.onMute && h(IconButton, { icon: p.muted ? "x" : "user", label: p.muted ? L("Unmute") : L("Mute"), variant: "soft", size: "lg", onClick: p.onMute }), p.onEnd && h("button", { type: "button", className: "ha-voice-end", onClick: p.onEnd, "aria-label": L("End conversation") }, h(Icon, { name: "x", size: 20 }))));
  }

  /* ── Operations ── */
  function ConnectionCard(p) {
    var tone = { connected: "ok", expiring: "warn", error: "danger", missing: "idle" }[p.status] || "idle";
    return h("div", { className: "ha-conn" }, h("span", { className: "ha-conn-ico" }, p.logo || h(Icon, { name: p.icon || "link", size: 18 })),
      h("span", { className: "ha-option-text" }, h("b", null, p.name), h("small", null, p.text)),
      h(StatusIndicator, { status: tone, label: p.statusLabel }), p.action && h("span", { className: "ha-conn-act" }, p.action));
  }
  function ConnectionBanner(p) {
    if (!p.state || p.state === "online") return null;
    return h("div", { className: cx("ha-connbanner", p.state), role: "status" }, h(StatusShape, { status: p.state === "offline" ? "danger" : "warn" }), h("span", null, p.text || (p.state === "offline" ? L("Offline. Changes are kept and sent when you’re back.") : L("Connection lost. Retrying in {s} s", { s: p.seconds != null ? p.seconds : "…" }))), p.onRetry && h("button", { type: "button", className: "ha-linkbtn", onClick: p.onRetry }, L("Retry now")));
  }
  function ServerCard(p) {
    return h("div", { className: "ha-server" },
      h("div", { className: "ha-server-top" }, h("span", { className: "ha-conn-ico" }, p.logo || h(Icon, { name: "server", size: 18 })), h("span", { className: "ha-option-text" }, h("b", null, p.name), h("small", { className: "ha-mono" }, [p.provider, p.address].filter(Boolean).join(" · "))), h(StatusIndicator, { status: p.status, label: p.statusLabel })),
      h("div", { className: "ha-col", style: { gap: 12 } }, (p.meters || []).map(function (m) { return m.value == null ? h("div", { key: m.label, className: "ha-usage-top" }, h("span", null, m.label), h("b", null, m.unknown || L("Unknown"))) : h(Meter, { key: m.label, label: m.label, value: m.value, max: m.max, text: m.text }); })),
      p.uptime && h(UptimeBar, p.uptime), p.foot && h("div", { className: "ha-server-foot" }, p.foot));
  }
  function DeployPipeline(p) {
    return h("ol", { className: "ha-pipeline" }, (p.stages || []).map(function (s, i) {
      return h("li", { key: i, className: cx("ha-stage", "st-" + (s.status || "idle")) }, h(StatusShape, { status: s.status === "done" ? "ok" : s.status || "idle" }), h("b", null, s.name), h("small", { className: "ha-mono" }, s.duration || "—"), s.action);
    }));
  }
  function DnsRecordTable(p) {
    return h(DataTable, { rows: p.records || [], rowKey: "id", columnToggle: false, selectable: p.selectable, bulkActions: p.bulkActions, toolbar: p.toolbar,
      columns: [{ key: "type", label: L("Type"), sortable: true, render: function (r) { return h(Badge, { tone: "neutral", dot: false, className: "ha-mono" }, r.type); } },
        { key: "name", label: L("Name"), sortable: true, render: function (r) { return h("span", { className: "ha-mono" }, r.name); } },
        { key: "content", label: L("Content"), render: function (r) { return h(Tooltip, { label: r.content }, h("span", { className: "ha-mono ha-trunc", tabIndex: 0 }, r.content)); } },
        { key: "ttl", label: L("TTL"), align: "right", render: function (r) { return h("span", { className: "ha-mono" }, r.ttl); } },
        { key: "proxy", label: L("Proxy"), render: function (r) { return r.proxy == null ? "—" : h(StatusIndicator, { status: r.proxy ? "ok" : "idle", label: r.proxy ? L("Proxied") : L("DNS only") }); } },
        { key: "x", label: "", align: "right", hideable: false, render: function (r) { return p.rowMenu ? h(Popover, { align: "end", flush: true, width: 200, trigger: function (s) { return h("button", { type: "button", className: "ha-iconbtn ha-iconbtn-ghost ha-iconbtn-sm", "aria-label": L("Actions"), onClick: s.toggle }, h(Icon, { name: "more" })); } }, function (s) { return h(Menu, { items: p.rowMenu(r).map(function (it) { return it === "-" ? it : Object.assign({}, it, { onClick: function () { s.close(); it.onClick && it.onClick(); } }); }) }); }) : null; } }] });
  }
  function DomainList(p) {
    return h("div", { className: "ha-domains" }, (p.items || []).slice().sort(function (a, b) { return (a.days == null ? 9999 : a.days) - (b.days == null ? 9999 : b.days); }).map(function (d) {
      var st = d.days == null ? "idle" : d.days < 7 ? "danger" : d.days < 30 ? "warn" : "ok";
      return h("button", { key: d.name, type: "button", className: "ha-domainrow", onClick: function () { p.onOpen && p.onOpen(d); } },
        h(StatusShape, { status: st }), h("span", { className: "ha-option-text" }, h("b", { className: "ha-mono" }, d.name), h("small", null, [d.registrar, d.dns].filter(Boolean).join(" · "))),
        h("span", { className: "ha-domainrow-cell" }, h("small", null, L("Expires")), h("b", { className: "ha-mono" }, d.days == null ? "—" : L("{n} days", { n: d.days }))),
        h("span", { className: "ha-domainrow-cell" }, h("small", null, L("SSL")), h(StatusIndicator, { status: d.ssl || "idle", label: d.sslLabel })));
    }));
  }
  function MailAuthStatus(p) {
    var cols = p.columns || ["MX", "SPF", "DKIM", "DMARC"];
    return h("div", { className: "ha-scroll-x" }, h("table", { className: "ha-table ha-mailauth" }, h("thead", null, h("tr", null, h("th", null, L("Domain")), cols.map(function (c) { return h("th", { key: c }, c); }))),
      h("tbody", null, (p.rows || []).map(function (r) {
        return h("tr", { key: r.domain }, h("td", { className: "ha-mono" }, r.domain), cols.map(function (c) { var v = r[c.toLowerCase()] || { status: "idle" }; return h("td", { key: c }, h("button", { type: "button", className: "ha-mailauth-cell", onClick: function () { p.onOpen && p.onOpen(r, c); } }, h(StatusIndicator, { status: v.status, label: v.label }))); }));
      }))));
  }
  function LedgerTable(p) {
    var cur = p.currency;
    return h(DataTable, { rows: p.rows || [], selectable: p.selectable, bulkActions: p.bulkActions, toolbar: p.toolbar, stickyHeader: true, maxHeight: p.maxHeight, columnToggle: p.columnToggle,
      columns: [{ key: "date", label: L("Date"), sortable: true, render: function (r) { return h("span", { className: "ha-mono" }, r.date); } }, { key: "ref", label: L("Ref."), render: function (r) { return h("span", { className: "ha-mono" }, r.ref); } },
        { key: "text", label: L("Description"), render: function (r) { return h("span", { className: "ha-option-text" }, h("b", null, r.text), r.suggested && h("small", null, h(StatusShape, { status: "signal" }), " ", L("Suggested by {name}", { name: r.suggested }))); } },
        { key: "category", label: L("Category"), render: function (r) { return p.categories ? h(InlineEdit, { value: r.category, options: p.categories, onSave: function (v) { p.onEdit && p.onEdit(r, { category: v }); } }) : r.category; } },
        { key: "project", label: L("Project"), render: function (r) { return r.project && h("span", { className: "ha-row", style: { gap: 8, flexWrap: "nowrap" } }, h("i", { className: "ha-sw ha-sw-" + (r.projectTint || "ink") }), r.project); } },
        { key: "net", label: L("Net"), align: "right", sortable: true, render: function (r) { return fmtMoney(r.net, cur, { minimumFractionDigits: 2 }); } }, { key: "vat", label: L("VAT"), align: "right", render: function (r) { return fmtMoney(r.vat || 0, cur, { minimumFractionDigits: 2 }); } },
        { key: "gross", label: L("Gross"), align: "right", sortable: true, render: function (r) { return h("b", { className: r.gross < 0 ? "ha-neg" : undefined }, fmtMoney(r.gross, cur, { minimumFractionDigits: 2 })); } },
        { key: "status", label: L("Status"), render: function (r) { return h(StatusIndicator, { status: r.status || "ok", label: r.statusLabel }); } }] });
  }
  function PnLStatement(p) {
    var cols = p.columns || [];
    return h("div", { className: "ha-scroll-x" }, h("table", { className: "ha-table ha-pnl" },
      h("thead", null, h("tr", null, h("th", null, p.label || ""), cols.map(function (c) { return h("th", { key: c, className: "ha-num" }, c); }), p.total !== false && h("th", { className: "ha-num" }, L("Total")))),
      h("tbody", null, (p.rows || []).map(function (r, i) {
        var tot = (r.values || []).reduce(function (a, b) { return a + (b || 0); }, 0);
        return h("tr", { key: i, className: r.kind }, h("td", null, r.label), r.kind === "section" ? h("td", { colSpan: cols.length + (p.total !== false ? 1 : 0) }) : cols.map(function (c, k) { var v = (r.values || [])[k]; return h("td", { key: k, className: cx("ha-num", v < 0 && "ha-neg") }, v == null ? "—" : fmtMoney(v, p.currency)); }), r.kind !== "section" && p.total !== false && h("td", { className: cx("ha-num", tot < 0 && "ha-neg") }, h("b", null, fmtMoney(tot, p.currency))));
      }))));
  }
  function ReceiptSuggestion(p) {
    return h("div", { className: "ha-receipt" },
      h("div", { className: "ha-receipt-src" }, h(TintIcon, { icon: "paperclip", tint: "sky" }), h("span", { className: "ha-option-text" }, h("b", null, p.file), h("small", null, p.source))),
      h("div", { className: "ha-receipt-grid" }, (p.fields || []).map(function (f) { return h("div", { key: f.label, className: "ha-receipt-field" }, h("small", null, f.label), h("b", { className: f.mono ? "ha-mono" : undefined }, f.value), f.confidence != null && h("span", { className: cx("ha-conf", f.confidence < 0.8 && "low") }, Math.round(f.confidence * 100) + " %")); })),
      p.suggestion && h("div", { className: "ha-receipt-sugg" }, h(StatusShape, { status: "signal" }), h("span", null, p.suggestion)),
      p.children,
      h("div", { className: "ha-row", style: { justifyContent: "flex-end" } }, p.onDiscard && h(Button, { variant: "ghost", size: "sm", onClick: p.onDiscard }, p.discardLabel || L("Not a receipt")), p.onConfirm && h(Button, { size: "sm", icon: "check", onClick: p.onConfirm }, p.confirmLabel || L("Book it"))));
  }

  /* ── Mail ── */
  function AccountSwitcher(p) {
    var q = React.useState(""), list = (p.accounts || []).filter(function (a) { return !q[0] || a.address.toLowerCase().indexOf(q[0].toLowerCase()) > -1; });
    var cur = (p.accounts || []).find(function (a) { return a.address === p.value; });
    return h(Popover, { width: 320, trigger: function (s) { return h("button", { type: "button", className: "ha-acct", onClick: s.toggle, "aria-haspopup": "dialog", "aria-expanded": s.open }, h("span", { className: "ha-option-text" }, h("b", { className: cur ? "ha-mono" : undefined }, cur ? cur.address : p.allLabel || L("All inboxes")), h("small", null, cur ? cur.domain : L("{n} addresses", { n: (p.accounts || []).length }))), h(Icon, { name: "chevronDown", size: 14 })); } },
      function (s) { return h("div", { className: "ha-col", style: { gap: 8 } }, h(SearchField, { placeholder: L("Find an address"), value: q[0], onChange: function (e) { q[1](e.target.value); } }),
        h("div", { className: "ha-acct-list" }, h("button", { type: "button", className: cx("ha-option", !p.value && "on"), onClick: function () { p.onChange && p.onChange(null); s.close(); } }, h(Icon, { name: "inbox", size: 15 }), h("span", { className: "ha-option-text" }, p.allLabel || L("All inboxes")), p.unread != null && h("span", { className: "ha-nav-count" }, p.unread)),
          list.map(function (a) { return h("button", { key: a.address, type: "button", className: cx("ha-option", a.address === p.value && "on"), onClick: function () { p.onChange && p.onChange(a.address); s.close(); } }, h("span", { className: "ha-option-text" }, h("span", { className: "ha-mono" }, a.address), h("small", null, a.domain)), a.unread ? h("span", { className: "ha-nav-count" }, a.unread) : null); }))); });
  }
  function InboxList(p) {
    return h("div", { className: "ha-inboxlist", role: "list" }, (p.items || []).map(function (m) {
      return h("button", { key: m.id, type: "button", role: "listitem", className: cx("ha-mailrow", m.unread && "unread", m.id === p.selected && "on"), onClick: function () { p.onOpen && p.onOpen(m); } },
        h("span", { className: "ha-mailrow-dot", "aria-label": m.unread ? L("Unread") : undefined }), h("span", { className: "ha-mailrow-main" },
          h("span", { className: "ha-mailrow-top" }, h("b", null, m.from), h("small", { className: "ha-mono" }, m.time)),
          h("span", { className: "ha-mailrow-subject" }, m.subject), h("span", { className: "ha-mailrow-snippet" }, m.snippet),
          (m.to || m.tags || m.agent) && h("span", { className: "ha-mailrow-tags" }, m.to && h("span", { className: "ha-mono" }, m.to), m.agent && h(Badge, { tone: m.agent.tone || "highlight" }, m.agent.label), (m.tags || []).map(function (t) { return h(Badge, { key: t, tone: "neutral", dot: false }, t); }))));
    }));
  }
  function MailThread(p) {
    var open = React.useState((p.messages || []).length ? [p.messages[p.messages.length - 1].id] : []);
    return h("div", { className: "ha-thread" }, p.subject && h("h3", { className: "ha-thread-subject" }, p.subject), (p.messages || []).map(function (m) {
      var o = open[0].indexOf(m.id) > -1;
      return h("div", { key: m.id, className: cx("ha-threadmsg", o && "open", m.agent && "agent") },
        h("button", { type: "button", className: "ha-threadmsg-head", "aria-expanded": o, onClick: function () { open[1](o ? open[0].filter(function (x) { return x !== m.id; }) : open[0].concat([m.id])); } },
          m.agent ? h(AgentMark, { tint: m.tint, size: 32 }) : h(Avatar, { name: m.from, size: 32 }), h("span", { className: "ha-option-text" }, h("b", null, m.from, m.agentNote && h("span", { className: "ha-threadmsg-note" }, " · " + m.agentNote)), h("small", null, o ? m.to : m.snippet)), h("small", { className: "ha-mono" }, m.time)),
        o && h("div", { className: "ha-threadmsg-body" }, m.body, m.attachments && h("div", { className: "ha-msg-attach" }, m.attachments.map(function (a) { return h("span", { key: a.name, className: "ha-attach-chip" }, h(Icon, { name: "paperclip", size: 13 }), a.name, a.size && h("small", null, a.size)); }))));
    }), p.reply);
  }
  function SignatureEditor(p) {
    var v = useControlled(p.value, p.defaultValue || {}, p.onChange), fields = p.fields || [["name", L("Name")], ["role", L("Role")], ["company", L("Company")], ["phone", L("Phone")], ["website", L("Website")]];
    function set(k, x) { var n = Object.assign({}, v[0]); n[k] = x; v[1](n); }
    return h("div", { className: "ha-sig" }, h("div", { className: "ha-col", style: { gap: 12 } }, fields.map(function (f) { return h(TextField, { key: f[0], label: f[1], value: v[0][f[0]] || "", onChange: function (e) { set(f[0], e.target.value); } }); }), p.extra),
      h("div", { className: "ha-sig-preview" }, h("span", { className: "ha-menu-label", style: { padding: 0 } }, p.previewLabel || L("Preview")), h("div", { className: "ha-paper ha-sig-paper" }, h("p", null, "—"), h("b", null, v[0].name), v[0].role && h("div", null, v[0].role + (v[0].company ? " · " + v[0].company : "")), v[0].phone && h("div", null, v[0].phone), v[0].website && h("div", null, v[0].website), p.note && h("small", null, p.note))));
  }
  function AttachmentPreview(p) {
    return h(Drawer, { title: p.name, subtitle: p.meta, onClose: p.onClose, width: p.width || 820, inline: p.inline },
      h("div", { className: "ha-attprev" }, h("div", { className: "ha-attprev-doc" }, p.children), h("div", { className: "ha-col", style: { gap: 16 } }, p.facts && h(KeyValue, { items: p.facts }), p.found, p.actions && h("div", { className: "ha-col", style: { gap: 8 } }, p.actions))));
  }

  /* ── App chrome ── */
  function MobileTabBar(p) {
    return h("nav", { className: "ha-tabbar", "aria-label": p.label || L("Main") }, (p.items || []).map(function (it) {
      var on = it.id === p.active;
      return h("button", { key: it.id, type: "button", className: cx("ha-tabbar-item", on && "on"), "aria-current": on ? "page" : undefined, onClick: function () { p.onPick && p.onPick(it.id); } }, h("span", { className: "ha-tabbar-ico" }, h(Icon, { name: it.icon, size: 20 }), it.count ? h("span", { className: "ha-dotcount" }, it.count) : null), h("span", null, it.label));
    }));
  }
  function PushNotification(p) {
    return h("div", { className: "ha-push" }, h("div", { className: "ha-push-top" }, h("span", { className: "ha-push-app" }, p.app), h("small", null, p.time)),
      h("b", null, p.title), h("p", null, p.text), p.actions && h("div", { className: "ha-push-actions" }, p.actions.map(function (a) { return h("button", { key: a.label, type: "button", onClick: a.onClick }, a.label); })));
  }
  function ConfigPRSummary(p) {
    var ICON = { project: "grid", team: "users", agent: "bot", tool: "zap", trigger: "clock", file: "file" };
    return h("div", { className: "ha-prsum" },
      h("div", { className: "ha-prsum-head" }, h(TintIcon, { icon: "branch", tint: "lilac" }), h("span", { className: "ha-option-text" }, h("b", null, p.title), h("small", null, p.meta)), p.status && h(StatusIndicator, { status: p.status, label: p.statusLabel })),
      p.summary && h("p", { className: "ha-card-desc", style: { margin: 0, fontSize: 14, lineHeight: "22px" } }, p.summary),
      h("ul", { className: "ha-prsum-list" }, (p.items || []).map(function (it, i) { return h("li", { key: i, className: "op-" + (it.op || "add") }, h("span", { className: "ha-prsum-op" }, it.op === "remove" ? "−" : it.op === "change" ? "~" : "+"), h(Icon, { name: ICON[it.kind] || "file", size: 14 }), h("span", { className: "ha-option-text" }, h("b", null, it.name), it.detail && h("small", null, it.detail))); })),
      p.actions && h("div", { className: "ha-row", style: { justifyContent: "flex-end" } }, p.actions));
  }
  function ModuleRegistry(p) {
    return h("div", { className: "ha-modules" }, (p.items || []).map(function (m) {
      return h("div", { key: m.id, className: "ha-module" }, h(TintIcon, { icon: m.icon || "grid", tint: m.core ? "plain" : m.enabled ? "mint" : "plain" }),
        h("span", { className: "ha-option-text" }, h("b", null, m.name, " ", h("span", { className: "ha-mono ha-module-v" }, m.version)), h("small", null, m.text)),
        m.adds && h("span", { className: "ha-module-adds" }, m.adds.map(function (a) { return h(Badge, { key: a, tone: "neutral", dot: false }, a); })),
        m.core ? h(Tooltip, { label: p.coreLabel || L("Core module, always on") }, h("span", { className: "ha-module-lock", tabIndex: 0 }, h(Icon, { name: "lock", size: 14 }))) : h("input", { type: "checkbox", role: "switch", className: "ha-switch", checked: !!m.enabled, "aria-label": m.name, onChange: function () { p.onToggle && p.onToggle(m); } }));
    }));
  }

  /* ════════ Kit 5: admin (FollowerPilot) and real-estate (Capitaso) components ════════ */
  var P5 = {
    image: "M4 5h16v14H4zM4 15.5l4.5-4.5 4 4 2.5-2.5 5 5M15.5 9.5h.01", pin: "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11zM12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
    map: "M9 4.5L3.5 6.5v13L9 17.5l6 2 5.5-2v-13L15 6.5l-6-2zM9 4.5v13M15 6.5v13", upload: "M12 15.5V4M7.5 8.5L12 4l4.5 4.5M4.5 15v4.5h15V15",
    copy: "M8.5 8.5h11v11h-11zM15.5 8.5v-4h-11v11h4", bed: "M3.5 18.5v-12M3.5 13.5h17v5M20.5 18.5v-3M7.5 10.5a1.5 1.5 0 1 0 0 .01M10.5 13.5v-3h7a3 3 0 0 1 3 3",
    ruler: "M3.5 15.5l12-12 5 5-12 12zM7 12l2 2M10 9l2 2M13 6l2 2", wallet: "M4 7.5h15.5v12H4zM4 7.5l12-3.5v3.5M15.5 13.5h.01", ban: "M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM6 6l12 12",
    list: "M8.5 6.5h12M8.5 12h12M8.5 17.5h12M4 6.5h.01M4 12h.01M4 17.5h.01", layers: "M12 3.5l8.5 4.5L12 12.5 3.5 8 12 3.5zM3.5 12l8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5",
    bold: "M7 4.5h6a3.5 3.5 0 0 1 0 7H7zM7 11.5h7a3.75 3.75 0 0 1 0 7.5H7z", italic: "M10 4.5h8M6 19.5h8M14.5 4.5l-5 15", underline: "M7 4v7a5 5 0 0 0 10 0V4M5 20h14",
    olist: "M10 6.5h10.5M10 12h10.5M10 17.5h10.5M4 5l1.5-1v5M4 14.5a1.5 1.5 0 1 1 2.5 1L4 18h3", heading: "M6 4.5v15M18 4.5v15M6 12h12", quote: "M5 17.5c0-4 1.5-7 5-9M14 17.5c0-4 1.5-7 5-9M5 17.5h3.5v-4H5zM14 17.5h3.5v-4H14z",
    undo: "M9 6L4 11l5 5M4.5 11h10a5 5 0 0 1 0 10h-2", redo: "M15 6l5 5-5 5M19.5 11h-10a5 5 0 0 0 0 10h2", monitor: "M3.5 4.5h17v11h-17zM8.5 20h7M12 15.5V20", phone: "M7.5 3h9v18h-9zM11 18h2",
    expand: "M4.5 9.5v-5h5M19.5 9.5v-5h-5M4.5 14.5v5h5M19.5 14.5v5h-5", sun: "M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4",
    cookie: "M12 3.5a8.5 8.5 0 1 0 8.5 8.5 3 3 0 0 1-3.5-3.5 3 3 0 0 1-3.5-3.5 3 3 0 0 1-1.5-1.5zM8.5 10h.01M14.5 15h.01M9.5 15.5h.01", webhook: "M9 8.5a3.5 3.5 0 1 1 5.5 2.9L17 16M7 19.5a3.5 3.5 0 0 1-1-6.8M17 19.5H10M6 12.7L9.5 7"
  };
  Object.keys(P5).forEach(function (k) { P[k] = P5[k]; }); Icon.names = Object.keys(P);

  function cbox(o) {
    return h("span", { className: "ha-checkbox" }, h("input", { type: "checkbox", checked: o.checked, onChange: o.onChange, disabled: o.disabled, "aria-label": o.label, ref: o.indeterminate != null ? function (el) { if (el) el.indeterminate = o.indeterminate; } : undefined }),
      h("span", { className: "ha-checkbox-box", "aria-hidden": true }, h("svg", { viewBox: "0 0 24 24", width: 14, height: 14, fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: o.indeterminate ? "M6 12h12" : "M5 12.5l4.5 4.5L19 7.5" }))));
  }

  /* ── Shared: range slider, bar list, status select, tile picker ── */
  function RangeSlider(p) {
    var id = useId("rs"), min = p.min || 0, max = p.max != null ? p.max : 100, step = p.step || 1, f = p.format || fmtNum;
    var v = useControlled(p.value, p.defaultValue || [min, max], p.onChange), lo = v[0][0], hi = v[0][1];
    function pc(x) { return (x - min) / (max - min) * 100; }
    function set(i, x) { x = Math.max(min, Math.min(max, Number(x))); var n = v[0].slice(); n[i] = x; if (n[0] > n[1]) n = i ? [x, x] : [x, x]; v[1](n); }
    return h(FormField, { id: id, label: p.label, hint: p.hint },
      h("div", { className: "ha-range" },
        h("div", { className: "ha-range-track" }, h("span", { style: { left: pc(lo) + "%", width: (pc(hi) - pc(lo)) + "%" } }),
          h("input", { type: "range", min: min, max: max, step: step, value: lo, "aria-label": L("Minimum"), onChange: function (e) { set(0, e.target.value); } }),
          h("input", { type: "range", min: min, max: max, step: step, value: hi, "aria-label": L("Maximum"), onChange: function (e) { set(1, e.target.value); } })),
        p.inputs !== false ? h("div", { className: "ha-range-inputs" },
          h("label", { className: "ha-range-num" }, h("small", null, L("Min")), h("input", { id: id, className: "ha-input", inputMode: "numeric", value: fmtNum(lo), onChange: function (e) { set(0, e.target.value.replace(/\D/g, "") || min); } }), p.unit && h("span", null, p.unit)),
          h("span", { className: "ha-range-dash", "aria-hidden": true }, "–"),
          h("label", { className: "ha-range-num" }, h("small", null, L("Max")), h("input", { className: "ha-input", inputMode: "numeric", value: fmtNum(hi), onChange: function (e) { set(1, e.target.value.replace(/\D/g, "") || max); } }), p.unit && h("span", null, p.unit)))
          : h("div", { className: "ha-range-vals" }, h("span", null, f(lo)), h("span", null, hi >= max && p.openEnd ? f(hi) + "+" : f(hi)))));
  }
  function BarList(p) {
    var items = p.items || [], max = Math.max.apply(null, items.map(function (i) { return i.value; }).concat([1])), f = p.format || fmtNum;
    return h("div", { className: "ha-barlist", role: "list", "aria-label": p.label },
      items.map(function (it, i) {
        return h("div", { key: it.id || it.label, role: "listitem", className: cx("ha-barlist-row", p.onPick && "is-btn"), onClick: p.onPick && function () { p.onPick(it); } },
          h("span", { className: cx("ha-barlist-bar", it.tint && "ha-t-" + it.tint), style: { width: (it.value / max * 100) + "%" } }),
          h("span", { className: "ha-barlist-label" }, it.mark && h("span", { className: "ha-barlist-mark", "aria-hidden": true }, it.mark), it.label),
          h("span", { className: "ha-barlist-val" }, f(it.value), it.share != null && h("small", null, fmtNum(it.share, { style: "percent", maximumFractionDigits: 1 }))));
      }));
  }
  function StatusSelect(p) {
    var opts = p.options || [], v = useControlled(p.value, p.defaultValue != null ? p.defaultValue : opts[0] && opts[0].value, p.onChange), cur = opts.find(function (o) { return o.value === v[0]; }) || opts[0] || {};
    return h(Popover, { width: p.width || 220, trigger: function (s) {
      return h("button", { type: "button", className: cx("ha-statussel", p.size === "sm" && "sm"), "aria-haspopup": "listbox", "aria-expanded": s.open, "aria-label": p.label, onClick: function (e) { e.stopPropagation(); s.toggle(); } },
        h(StatusShape, { status: cur.status || "idle" }), h("span", null, cur.label), h(Icon, { name: "chevronDown", size: 13 }));
    } }, function (s) {
      return h("div", { className: "ha-menu", role: "listbox", "aria-label": p.label }, opts.map(function (o) {
        return h("button", { key: o.value, type: "button", role: "option", "aria-selected": o.value === v[0], className: cx("ha-menu-item", o.value === v[0] && "on"), onClick: function () { v[1](o.value); s.close && s.close(); } },
          h(StatusShape, { status: o.status || "idle" }), h("span", { style: { flex: 1 } }, o.label), o.value === v[0] && h(Icon, { name: "check", size: 14 }));
      }));
    });
  }
  function TilePicker(p) {
    var multi = !!p.multiple, v = useControlled(p.value, p.defaultValue != null ? p.defaultValue : (multi ? [] : null), p.onChange);
    function on(x) { return multi ? v[0].indexOf(x) > -1 : v[0] === x; }
    function pick(x) { if (!multi) return v[1](x); v[1](on(x) ? v[0].filter(function (y) { return y !== x; }) : v[0].concat([x])); }
    return h("div", { className: "ha-tiles", role: multi ? "group" : "radiogroup", "aria-label": p.label, style: { gridTemplateColumns: "repeat(auto-fill, minmax(" + (p.min || 120) + "px, 1fr))" } },
      (p.options || []).map(function (o) {
        return h("button", { key: o.value, type: "button", role: multi ? "checkbox" : "radio", "aria-checked": on(o.value), disabled: o.disabled, className: cx("ha-tile", on(o.value) && "on"), onClick: function () { pick(o.value); } },
          h("span", { className: cx("ha-tile-art", o.tint && "ha-t-" + o.tint), style: o.color ? { background: o.color } : undefined }, o.image ? h("img", { src: o.image, alt: "" }) : o.icon ? h(Icon, { name: o.icon, size: 22 }) : o.art),
          h("span", { className: "ha-tile-label" }, o.label, o.meta && h("small", null, o.meta)), on(o.value) && h("span", { className: "ha-tile-check", "aria-hidden": true }, h(Icon, { name: "check", size: 12 })));
      }));
  }

  /* ── Live feed ── */
  function LiveFeed(p) {
    var paused = useControlled(p.paused, false, p.onPause), held = React.useRef(null), filter = React.useState(null);
    if (!paused[0] || !held.current) held.current = p.items || [];
    var shown = (paused[0] ? held.current : p.items || []).filter(function (it) { return !filter[0] || it.type === filter[0]; }), waiting = paused[0] ? Math.max(0, (p.items || []).length - held.current.length) : 0;
    var types = p.types || [];
    return h("div", { className: "ha-livefeed" },
      h("div", { className: "ha-livefeed-head" },
        h("span", { className: cx("ha-live", paused[0] && "off") }, h("span", { className: "ha-live-dot", "aria-hidden": true }), paused[0] ? L("Paused") : L("Live")),
        types.length > 0 && h("div", { className: "ha-row", style: { gap: 4 } }, h(Chip, { selected: !filter[0], onClick: function () { filter[1](null); } }, L("All")), types.map(function (t) { return h(Chip, { key: t.value, selected: filter[0] === t.value, onClick: function () { filter[1](filter[0] === t.value ? null : t.value); } }, t.label); })),
        h("span", { style: { flex: 1 } }),
        waiting > 0 && h("button", { type: "button", className: "ha-livefeed-new", onClick: function () { paused[1](false); } }, L("{n} new", { n: waiting })),
        h(IconButton, { icon: paused[0] ? "play" : "pause", size: "sm", label: paused[0] ? L("Resume") : L("Pause"), onClick: function () { paused[1](!paused[0]); } })),
      h("div", { className: "ha-livefeed-list", role: "log", "aria-live": paused[0] ? "off" : "polite", style: p.maxHeight ? { maxHeight: p.maxHeight } : undefined },
        shown.length === 0 ? h("p", { className: "ha-card-desc", style: { padding: 16 } }, p.emptyText || L("Waiting for events…")) :
        shown.map(function (it) {
          return h("div", { key: it.id, className: cx("ha-livefeed-row", it.fresh && "fresh") },
            h(TintIcon, { icon: it.icon || "zap", tint: it.tint || "sky", size: 32 }),
            h("span", { className: "ha-livefeed-text" }, h("b", null, it.title), it.text && h("small", null, it.text)),
            it.amount != null && h("span", { className: cx("ha-livefeed-amt", it.amount < 0 && "neg") }, (it.amount > 0 ? "+" : "") + fmtMoney(it.amount, it.currency)),
            h("span", { className: "ha-livefeed-time" }, it.time));
        })));
  }

  var WORLD = "0000000001fe03ff000000000000000000000000000079f7ffff8001c01000070000000000000010439fffff0002c0000000000000000000007cdf007fff00000001800ffc01e000000003c4af003ffe0000000408ffffe0000001f8001e67f83ffc000070001bffffffff0083ffffc67e5c1fe00003ff2ffbffffffffff67fffffff83a1f01c007bcffffffffffffff03ffffffe0080e00001e7fffffffffffffff03fbffffc0700200003e5ffffffffffffc6000403fffe07e000002063fffffffffff018001001ffffc7f0000021cfffffffffffc038000000ffffe7fc0000f3fffffffffffff8200000003ffffff0000027fffffffffffff4000000003fffffce00003ffffffffffffff0000000003ffffff000000fbf5e7fffffffe0000000003fffff000000f8de0e7fffffffcc000000003ffffc000000f12eff7ffffff708000000001ffff8000000f00dff3fffffe300000000000ffffc0000001f043ffffffff1700000000007fff0000000ff803ffffffff0800000000001ffe0000000ffeffffffffff8000000000003f810000001fffffe7ffffff0000000000001f810000003ffffdfbffffff00000000000007800000007ffffcff0ffffe80000000400003884000007ffffefe07e7e000000000000001f83400003ffffe7e07c3e0800000000000005c0000007fffff780701e0800000000000000e0000007fffffc00301f0c0000000000000023900003ffffff003016040000000000000017f00001ffffff000810060000000000000007fc0000f3ffff000008200000000000000007ff000000fffe00001860000000000000000fff000000fffc000008ec000000000000000fffc00000fff800000ce8400000000000000ffff80000fff0000004003c0000000000000ffffc00007ff0000002801e00000000000007fffc00007ff0000000000808000000000007fff800007ff0000000000000000000000007fff000007ff100000002c000000000000001fff000007ff300000007ec00000000000000fff000007fc300000007fe00000000000000fff000003fc60000003fff02000000000000ffc000003fc60000007fff80000000000000ff8000003f800000003fff80000000000001ff0000001f800000003fff80000000000001ff0000001f000000003fff80000000000001fe0000001800000000303f80000000000001f80000000000000000000f00000000000001f00000000000000000000200200000000003c00000000000000000000200400000000001c000000000000000000000008000000000038000000000000000000000010000000000038000000000000000000000000000000000030800000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
  var worldPath = null;
  function WorldDots() {
    if (!worldPath) { var d = [], cols = 144; for (var i = 0; i < WORLD.length; i++) { var v = parseInt(WORLD[i], 16); for (var b = 0; b < 4; b++) if (v & (8 >> b)) { var k = i * 4 + b, x = k % cols, y = Math.floor(k / cols); d.push("M" + (x + .5) + " " + (y + .5) + "h0"); } } worldPath = d.join(""); }
    return h("svg", { className: "ha-map-world", viewBox: "0 0 144 58", preserveAspectRatio: "none", "aria-hidden": true }, h("path", { d: worldPath }));
  }
  /* ── Map with pins (background is yours: tiles, an SVG, an image) ── */
  function MapView(p) {
    var b = p.bounds || { n: 84, s: -60, w: -180, e: 180 }, sel = useControlled(p.selected, null, p.onSelect), Hh = p.height || 320;
    var pts = p.points || [], maxV = Math.max.apply(null, pts.map(function (x) { return x.value || 1; }).concat([1]));
    function xy(pt) { return { x: (pt.lng - b.w) / (b.e - b.w) * 100, y: (b.n - pt.lat) / (b.n - b.s) * 100 }; }
    var cur = pts.find(function (x) { return x.id === sel[0]; });
    return h("div", { className: cx("ha-map", p.className), style: { height: Hh }, role: "region", "aria-label": p.label || L("Map") },
      p.background || (!p.bounds ? h(WorldDots) : null) || h("svg", { className: "ha-map-grid", viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": true }, [10, 20, 30, 40, 50, 60, 70, 80, 90].map(function (g) { return h("g", { key: g }, h("line", { x1: g, x2: g, y1: 0, y2: 100 }), h("line", { y1: g, y2: g, x1: 0, x2: 100 })); })),
      pts.map(function (pt) {
        var c = xy(pt), r = p.bubbles ? 10 + Math.sqrt((pt.value || 1) / maxV) * 26 : null;
        return h("button", { key: pt.id, type: "button", className: cx(p.bubbles ? "ha-map-bubble" : "ha-map-pin", "ha-t-" + (pt.tint || "sky"), sel[0] === pt.id && "on", pt.pulse && "pulse"), style: { left: c.x + "%", top: c.y + "%", width: r || undefined, height: r || undefined }, "aria-label": pt.label + (pt.value != null ? ", " + fmtNum(pt.value) : ""), onClick: function () { sel[1](sel[0] === pt.id ? null : pt.id); } },
          p.bubbles ? null : pt.text != null ? h("span", null, pt.text) : h(Icon, { name: "pin", size: 14 }));
      }),
      cur && h("div", { className: "ha-map-pop", style: { left: Math.min(72, Math.max(28, xy(cur).x)) + "%", top: xy(cur).y + "%" } }, p.renderPopup ? p.renderPopup(cur) : h("div", { className: "ha-option-text" }, h("b", null, cur.label), cur.sub && h("small", null, cur.sub))),
      p.legend && h("div", { className: "ha-map-legend" }, p.legend),
      p.controls && h("div", { className: "ha-map-ctl" }, p.controls));
  }

  /* ── Rich text editor (Selection/Range based, no execCommand) ── */
  var RTE_ALLOWED = { P: 1, H3: 1, BLOCKQUOTE: 1, UL: 1, OL: 1, LI: 1, B: 1, STRONG: 1, I: 1, EM: 1, U: 1, A: 1, BR: 1 };
  var RTE_BLOCKS = { P: 1, H3: 1, BLOCKQUOTE: 1, UL: 1, OL: 1 };
  function rteClean(html) {
    var box = document.createElement("div"); box.innerHTML = html || "";
    (function walk(n) {
      Array.prototype.slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 3) return;
        if (c.nodeType !== 1 || !RTE_ALLOWED[c.tagName]) { if (c.nodeType === 1 && !/^(SCRIPT|STYLE|IFRAME|OBJECT)$/.test(c.tagName)) { walk(c); while (c.firstChild) n.insertBefore(c.firstChild, c); } n.removeChild(c); return; }
        var href = c.tagName === "A" ? c.getAttribute("href") : null;
        Array.prototype.slice.call(c.attributes).forEach(function (a) { c.removeAttribute(a.name); });
        if (c.tagName === "A") { if (href && /^(https?:|mailto:|tel:|\/|#|\{)/i.test(href)) { c.setAttribute("href", href); c.setAttribute("rel", "noopener noreferrer"); } }
        walk(c);
      });
    })(box);
    Array.prototype.slice.call(box.childNodes).forEach(function (c) { if (c.nodeType === 3 ? c.textContent.trim() : !RTE_BLOCKS[c.tagName]) { var p = document.createElement("p"); box.insertBefore(p, c); p.appendChild(c); } else if (c.nodeType === 3) box.removeChild(c); });
    return box.innerHTML;
  }
  function RichTextEditor(p) {
    var ref = React.useRef(null), count = React.useState(0), active = React.useState({}), linkOpen = React.useState(false), linkUrl = React.useState(""), saved = React.useRef(null), hist = React.useRef({ stack: [], i: -1, t: null });
    function root() { return ref.current; }
    function range() { var s = window.getSelection(); if (!s.rangeCount) return null; var r = s.getRangeAt(0); return root() && root().contains(r.commonAncestorContainer) ? r : null; }
    function select(r) { var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
    function up(node, test) { while (node && node !== root()) { if (node.nodeType === 1 && test(node)) return node; node = node.parentNode; } return null; }
    function blockOf(node, off) {
      if (node === root()) { var kids = root().childNodes; return kids[Math.max(0, Math.min(kids.length - 1, (off || 0) - (off ? 1 : 0)))] || null; }
      while (node && node.parentNode !== root()) node = node.parentNode; return node && node !== root() ? node : null;
    }
    function keep(fn) {
      var r = range(), m = r && { sc: r.startContainer, so: r.startOffset, ec: r.endContainer, eo: r.endOffset };
      fn(r);
      if (m && root().contains(m.sc) && root().contains(m.ec)) { try { var nr = document.createRange(); nr.setStart(m.sc, m.so); nr.setEnd(m.ec, m.eo); select(nr); } catch (e) {} }
      changed(true);
    }
    function snapshot(now) {
      var hs = hist.current; clearTimeout(hs.t);
      function push() { var html = root().innerHTML; if (hs.stack[hs.i] === html) return; hs.stack = hs.stack.slice(0, hs.i + 1).concat([html]).slice(-100); hs.i = hs.stack.length - 1; }
      if (now) push(); else hs.t = setTimeout(push, 400);
    }
    function emit() { var el = root(); if (!el) return; count[1](el.innerText.trim().length); p.onChange && p.onChange(rteClean(el.innerHTML)); }
    function changed(now) { snapshot(now); emit(); state(); }
    function state() {
      var r = range(); if (!r) return active[1]({});
      var n = r.startContainer, b = blockOf(n), li = up(n, function (e) { return e.tagName === "UL" || e.tagName === "OL"; });
      active[1]({ bold: !!up(n, function (e) { return e.tagName === "B" || e.tagName === "STRONG"; }), italic: !!up(n, function (e) { return e.tagName === "I" || e.tagName === "EM"; }), underline: !!up(n, function (e) { return e.tagName === "U"; }), link: !!up(n, function (e) { return e.tagName === "A"; }), heading: !!b && b.tagName === "H3", quote: !!b && b.tagName === "BLOCKQUOTE", list: !!li && li.tagName === "UL", olist: !!li && li.tagName === "OL" });
    }
    React.useEffect(function () {
      root().innerHTML = rteClean(p.defaultValue || p.value || "") || "<p><br></p>"; count[1](root().innerText.trim().length); snapshot(true);
      document.addEventListener("selectionchange", state); return function () { document.removeEventListener("selectionchange", state); };
    }, []);
    function unwrap(el) { var par = el.parentNode; while (el.firstChild) par.insertBefore(el.firstChild, el); par.removeChild(el); }
    function mark(tag, alt) {
      var r = range(); if (!r) return; var hit = up(r.startContainer, function (e) { return e.tagName === tag || e.tagName === alt; });
      if (hit) { unwrap(hit); return changed(true); }
      if (r.collapsed) return;
      var el = document.createElement(tag); el.appendChild(r.extractContents());
      Array.prototype.slice.call(el.querySelectorAll(tag + (alt ? "," + alt : ""))).forEach(unwrap);
      r.insertNode(el); var nr = document.createRange(); nr.selectNodeContents(el); select(nr); changed(true);
    }
    function blocks(r) { var a = blockOf(r.startContainer, r.startOffset), b = blockOf(r.endContainer, r.endOffset), out = [], n = a; while (n) { out.push(n); if (n === b) break; n = n.nextSibling; } return out; }
    function setBlock(tag) {
      if (!range()) return; keep(function (r) { var bs = blocks(r), off = bs.every(function (b) { return b.tagName === tag; });
      bs.forEach(function (b) {
        var items = b.tagName === "UL" || b.tagName === "OL" ? Array.prototype.slice.call(b.children) : [b];
        items.forEach(function (it) { var nb = document.createElement(off ? "P" : tag); while (it.firstChild) nb.appendChild(it.firstChild); root().insertBefore(nb, b); });
        root().removeChild(b);
      }); });
    }
    function setList(tag) {
      if (!range()) return; keep(function (r) { var bs = blocks(r);
      if (bs.length === 1 && bs[0].tagName === tag) { Array.prototype.slice.call(bs[0].children).forEach(function (li) { var pp = document.createElement("P"); while (li.firstChild) pp.appendChild(li.firstChild); root().insertBefore(pp, bs[0]); }); root().removeChild(bs[0]); return; }
      var list = document.createElement(tag); root().insertBefore(list, bs[0]);
      bs.forEach(function (b) { var items = b.tagName === "UL" || b.tagName === "OL" ? Array.prototype.slice.call(b.children) : [b]; items.forEach(function (it) { var li = document.createElement("LI"); while (it.firstChild) li.appendChild(it.firstChild); list.appendChild(li); }); root().removeChild(b); }); });
    }
    function openLink() { var r = range(); if (!r) return; saved.current = r.cloneRange(); var a = up(r.startContainer, function (e) { return e.tagName === "A"; }); linkUrl[1](a ? a.getAttribute("href") : ""); linkOpen[1](true); }
    function applyLink(remove) {
      var r = saved.current; linkOpen[1](false); if (!r) return; root().focus(); select(r);
      var a = up(r.startContainer, function (e) { return e.tagName === "A"; }), url = linkUrl[0].trim();
      if (url && !/^(https?:|mailto:|tel:|\/|#|\{)/i.test(url)) url = "https://" + url;
      if (remove || !url) { if (a) unwrap(a); return changed(true); }
      if (a) { a.setAttribute("href", url); return changed(true); }
      var el = document.createElement("A"); el.setAttribute("href", url); el.setAttribute("rel", "noopener noreferrer");
      if (r.collapsed) el.textContent = url; else el.appendChild(r.extractContents());
      r.insertNode(el); changed(true);
    }
    function insertText(t) { var r = range(); if (!r) { root().focus(); r = range(); } if (!r) return; r.deleteContents(); var tn = document.createTextNode(t); r.insertNode(tn); var nr = document.createRange(); nr.setStartAfter(tn); nr.collapse(true); select(nr); changed(true); }
    function restore(d) { var hs = hist.current; snapshot(true); var j = hs.i + d; if (j < 0 || j >= hs.stack.length) return; hs.i = j; root().innerHTML = hs.stack[j]; var nr = document.createRange(); nr.selectNodeContents(root()); nr.collapse(false); select(nr); emit(); }
    function key(e) {
      var m = e.metaKey || e.ctrlKey; if (!m) return; var k = e.key.toLowerCase();
      if (k === "b") { e.preventDefault(); mark("B", "STRONG"); } else if (k === "i") { e.preventDefault(); mark("I", "EM"); } else if (k === "u") { e.preventDefault(); mark("U"); }
      else if (k === "k") { e.preventDefault(); openLink(); } else if (k === "z") { e.preventDefault(); restore(e.shiftKey ? 1 : -1); } else if (k === "y") { e.preventDefault(); restore(1); }
    }
    function paste(e) { e.preventDefault(); var t = (e.clipboardData || window.clipboardData).getData("text/plain"); var lines = t.replace(/\r/g, "").split("\n"); insertText(lines[0]); if (lines.length > 1) { var r = range(), b = r && blockOf(r.startContainer, r.startOffset), after = b; if (!after) return changed(true); lines.slice(1).forEach(function (l) { var pp = document.createElement("P"); pp.textContent = l; after.parentNode.insertBefore(pp, after.nextSibling); after = pp; }); var nr = document.createRange(); nr.selectNodeContents(after); nr.collapse(false); select(nr); changed(true); } }
    function input() { var el = root(); if (!el.firstChild || el.innerHTML === "<br>") el.innerHTML = "<p><br></p>"; Array.prototype.slice.call(el.childNodes).forEach(function (c) { if (c.nodeType === 3 && c.textContent.trim()) { var pp = document.createElement("P"); el.insertBefore(pp, c); pp.appendChild(c); var nr = document.createRange(); nr.selectNodeContents(pp); nr.collapse(false); select(nr); } }); changed(false); }
    var tools = [["bold", function () { mark("B", "STRONG"); }, L("Bold"), "B"], ["italic", function () { mark("I", "EM"); }, L("Italic"), "I"], ["underline", function () { mark("U"); }, L("Underline"), "U"], "-", ["heading", function () { setBlock("H3"); }, L("Heading")], ["quote", function () { setBlock("BLOCKQUOTE"); }, L("Quote")], ["list", function () { setList("UL"); }, L("Bulleted list")], ["olist", function () { setList("OL"); }, L("Numbered list")], "-", ["link", openLink, L("Link"), "K"], "-", ["undo", function () { restore(-1); }, L("Undo"), "Z"], ["redo", function () { restore(1); }, L("Redo")]];
    var over = p.maxLength && count[0] > p.maxLength, keyMod = /Mac|iPhone|iPad/.test(navigator.platform || "") ? "⌘" : "Ctrl+";
    return h(FormField, { label: p.label, hint: p.hint, error: p.error },
      h("div", { className: cx("ha-rte", over && "invalid") },
        h("div", { className: "ha-rte-bar", role: "toolbar", "aria-label": L("Formatting") },
          tools.map(function (t, i) {
            if (t === "-") return h("span", { key: i, className: "ha-rte-sep", "aria-hidden": true });
            var btn = h("button", { key: i, type: "button", className: cx("ha-rte-btn", active[0][t[0]] && "on"), title: t[2] + (t[3] ? " (" + keyMod + t[3] + ")" : ""), "aria-label": t[2], "aria-pressed": t[0] === "undo" || t[0] === "redo" ? undefined : !!active[0][t[0]], disabled: p.disabled, onMouseDown: function (e) { e.preventDefault(); }, onClick: t[1] }, h(Icon, { name: t[0], size: 15 }));
            return t[0] === "link" ? h(Popover, { key: i, width: 300, open: linkOpen[0], onOpenChange: linkOpen[1], trigger: btn },
              h("form", { className: "ha-col", style: { gap: 8 }, onSubmit: function (e) { e.preventDefault(); applyLink(false); } },
                h("input", { className: "ha-input", autoFocus: true, value: linkUrl[0], onChange: function (e) { linkUrl[1](e.target.value); }, placeholder: L("Link address"), "aria-label": L("Link address"), inputMode: "url" }),
                h("div", { className: "ha-row", style: { justifyContent: "flex-end", gap: 8 } }, active[0].link && h(Button, { size: "sm", variant: "ghost", onClick: function () { applyLink(true); } }, L("Remove link")), h(Button, { size: "sm", type: "submit" }, L("Apply"))))) : btn;
          }),
          p.variables && p.variables.length > 0 && h(Popover, { width: 240, trigger: function (s) { return h("button", { type: "button", className: "ha-rte-var", onMouseDown: function (e) { e.preventDefault(); }, onClick: s.toggle, "aria-expanded": s.open }, "{ }", h("span", null, L("Insert field"))); } },
            function (s) { return h("div", { className: "ha-menu" }, p.variables.map(function (v) { return h("button", { key: v.key, type: "button", className: "ha-menu-item", onMouseDown: function (e) { e.preventDefault(); }, onClick: function () { insertText("{" + v.key + "}"); s.close && s.close(); } }, h("span", { style: { flex: 1 } }, v.label), h("code", null, "{" + v.key + "}")); })); })),
        h("div", { ref: ref, className: "ha-rte-area", contentEditable: !p.disabled, role: "textbox", "aria-multiline": "true", "aria-label": p.label || L("Text"), "data-placeholder": p.placeholder || "", suppressContentEditableWarning: true, onInput: input, onKeyDown: key, onPaste: paste, onBlur: emit, style: { minHeight: p.minHeight || 160 } }),
        (p.maxLength || p.footer) && h("div", { className: "ha-rte-foot" }, p.footer, p.maxLength && h("span", { className: cx("ha-rte-count", over && "over") }, fmtNum(count[0]) + " / " + fmtNum(p.maxLength)))));
  }

  /* ── Email and ad previews ── */
  function EmailPreview(p) {
    var dev = useControlled(p.device, "desktop", p.onDevice);
    return h("div", { className: "ha-mailprev" },
      h("div", { className: "ha-mailprev-head" },
        h("div", { className: "ha-mailprev-inbox" }, h(Avatar, { name: p.fromName || p.from, size: 36 }),
          h("div", { className: "ha-option-text" }, h("b", null, p.fromName || p.from), h("span", { className: "ha-mailprev-subj" }, h("b", null, p.subject || L("(No subject)")), p.preheader && h("span", null, " — " + p.preheader)))),
        h(Segmented, { size: "sm", value: dev[0], onChange: dev[1], label: L("Device"), options: [{ value: "desktop", label: L("Desktop") }, { value: "mobile", label: L("Mobile") }] })),
      h("div", { className: cx("ha-mailprev-stage", dev[0]) },
        h("div", { className: "ha-mailprev-frame" }, p.html != null ? h("iframe", { title: L("Email preview"), sandbox: "", srcDoc: p.html }) : h("div", { className: "ha-mailprev-body" }, p.children))),
      p.checks && h("div", { className: "ha-mailprev-checks" }, p.checks.map(function (c, i) { return h(StatusIndicator, { key: i, status: c.status, label: c.label, size: "sm" }); })));
  }
  function SearchAdPreview(p) {
    var dev = useControlled(p.device, "mobile", p.onDevice), hl = (p.headlines || []).filter(Boolean).slice(0, 3), ds = (p.descriptions || []).filter(Boolean).slice(0, 2);
    var lim = [["headlines", 30], ["descriptions", 90], ["paths", 15]], warn = [];
    lim.forEach(function (x) { (p[x[0]] || []).forEach(function (s, i) { if (s && s.length > x[1]) warn.push(L("{field} {n} is {len} characters, the limit is {max}", { field: x[0] === "headlines" ? L("Headline") : x[0] === "descriptions" ? L("Description") : L("Path"), n: i + 1, len: s.length, max: x[1] })); }); });
    var url = (p.domain || "") + (p.paths || []).filter(Boolean).map(function (x) { return " › " + x; }).join("");
    return h("div", { className: "ha-adprev" },
      h("div", { className: "ha-row", style: { justifyContent: "space-between" } }, h("span", { className: "ha-menu-label", style: { padding: 0 } }, L("Preview")), h(Segmented, { size: "sm", value: dev[0], onChange: dev[1], label: L("Device"), options: [{ value: "mobile", label: L("Mobile") }, { value: "desktop", label: L("Desktop") }] })),
      h("div", { className: cx("ha-adprev-card", dev[0]) },
        h("div", { className: "ha-adprev-top" }, h("span", { className: "ha-adprev-fav", "aria-hidden": true }, (p.name || p.domain || "?").charAt(0).toUpperCase()), h("div", { className: "ha-option-text" }, h("b", null, p.name || p.domain), h("small", null, url)), h("span", { className: "ha-adprev-tag" }, p.sponsoredLabel || L("Sponsored"))),
        h("a", { className: "ha-adprev-hl", href: "#", onClick: function (e) { e.preventDefault(); } }, hl.join(" | ") || L("Your headline")),
        h("p", { className: "ha-adprev-desc" }, ds.join(" ") || L("Your description")),
        p.sitelinks && p.sitelinks.length > 0 && h("div", { className: "ha-adprev-links" }, p.sitelinks.map(function (s, i) { return h("span", { key: i }, s); }))),
      warn.length > 0 && h("div", { className: "ha-col", style: { gap: 4 } }, warn.map(function (w, i) { return h(StatusIndicator, { key: i, status: "warn", label: w, size: "sm" }); })));
  }

  /* ── Money and operations for admins ── */
  function BalanceCard(p) {
    var days = p.perDay > 0 ? Math.floor(p.balance / p.perDay) : null, low = p.low != null && p.balance <= p.low, st = p.status || (p.balance <= 0 ? "danger" : low ? "warn" : "ok");
    return h("div", { className: cx("ha-balance", "is-" + st) },
      h("div", { className: "ha-balance-head" }, p.logo || h(TintIcon, { icon: p.icon || "wallet", tint: p.tint || "butter", size: 36 }), h("div", { className: "ha-option-text" }, h("b", null, p.name), p.sub && h("small", null, p.sub)), h(StatusIndicator, { status: st, label: p.statusLabel || (st === "danger" ? L("Empty") : low ? L("Low") : L("OK")), size: "sm" })),
      h("div", { className: "ha-balance-main" }, h("div", { className: "ha-col", style: { gap: 2 } }, h("span", { className: "ha-balance-amt" }, fmtMoney(p.balance, p.currency, { maximumFractionDigits: 2 })),
        h("span", { className: "ha-balance-meta" }, [p.perDay != null && L("{amount} per day", { amount: fmtMoney(p.perDay, p.currency) }), days != null && p.balance > 0 && L("lasts about {n} days", { n: days })].filter(Boolean).join(" · ")),
          p.low != null && h("span", { className: "ha-balance-meta" }, L("Warns below {amount}", { amount: fmtMoney(p.low, p.currency) }))),
        p.spark && h(Sparkline, { values: p.spark, width: 96, height: 32, tint: st === "ok" ? "mint" : st === "warn" ? "butter" : "blush" })),
      (p.onTopUp || p.action) && h("div", { className: "ha-row", style: { justifyContent: "flex-end" } }, p.action, p.onTopUp && h(Button, { size: "sm", variant: low ? "primary" : "soft", icon: "plus", onClick: p.onTopUp }, p.topUpLabel || L("Top up"))));
  }
  function ServiceMonitor(p) {
    return h("div", { className: "ha-svcmon", role: "list", "aria-label": p.label },
      (p.items || []).map(function (s) {
        return h("div", { key: s.id || s.name, role: "listitem", className: "ha-svcmon-row" },
          h(StatusShape, { status: s.status }), h("span", { className: "ha-option-text" }, h("b", null, s.name), h("small", null, s.statusLabel || s.status)),
          s.history && h("span", { className: "ha-svcmon-hist", "aria-hidden": true }, s.history.map(function (x, i) { return h("i", { key: i, className: "ha-st-" + x }); })),
          h("span", { className: "ha-svcmon-num" }, s.latency != null ? fmtNum(s.latency) + " ms" : "—"),
          h("span", { className: cx("ha-svcmon-num", s.errorRate > 1 && "bad") }, s.errorRate != null ? fmtNum(s.errorRate / 100, { style: "percent", maximumFractionDigits: 1 }) : "—"),
          h("span", { className: "ha-svcmon-time" }, s.checked));
      }));
  }
  function RunHistory(p) {
    var open = React.useState(null);
    return h("div", { className: "ha-runs", role: "list", "aria-label": p.label },
      (p.items || []).map(function (r) {
        var on = open[0] === r.id;
        return h("div", { key: r.id, role: "listitem", className: cx("ha-runs-row", on && "open") },
          h("button", { type: "button", className: "ha-runs-main", "aria-expanded": r.detail ? on : undefined, onClick: r.detail ? function () { open[1](on ? null : r.id); } : undefined },
            h(StatusShape, { status: r.status }), h("span", { className: "ha-option-text" }, h("b", null, r.name), h("small", null, [r.started, r.duration, r.by].filter(Boolean).join(" · "))),
            h("span", { className: "ha-runs-counts" }, (r.counts || []).map(function (c, i) { return h("span", { key: i, className: c.tone ? "ha-tone-" + c.tone : undefined }, h("b", null, fmtNum(c.value)), " ", c.label); })),
            r.detail && h(Icon, { name: on ? "chevronDown" : "chevronRight", size: 14 })),
          on && h("div", { className: "ha-runs-detail" }, r.detail));
      }));
  }
  function WebhookEndpoint(p) {
    var open = React.useState(!!p.defaultOpen);
    return h("div", { className: "ha-hook" },
      h("div", { className: "ha-hook-head" }, h(TintIcon, { icon: "webhook", tint: "lilac", size: 36 }),
        h("div", { className: "ha-option-text", style: { minWidth: 0, flex: 1 } }, h("b", { className: "ha-mono ha-hook-url" }, p.url), h("small", null, (p.events || []).join(", "))),
        h(StatusIndicator, { status: p.status || "ok", label: p.statusLabel, size: "sm" }),
        p.successRate != null && h("span", { className: "ha-hook-rate" }, fmtNum(p.successRate / 100, { style: "percent", maximumFractionDigits: 1 })),
        p.onToggle && h(Switch, { checked: p.enabled !== false, onChange: p.onToggle }),
        p.menu && h(Popover, { width: 200, trigger: function (s) { return h(IconButton, { icon: "more", size: "sm", label: L("More"), onClick: s.toggle }); } }, function () { return h(Menu, { items: p.menu }); })),
      p.secret && p.secret,
      (p.deliveries || []).length > 0 && h(Collapsible, { title: L("Recent deliveries"), meta: fmtNum(p.deliveries.length), open: open[0], onOpenChange: open[1] },
        h("div", { className: "ha-hook-dl" }, p.deliveries.map(function (d) {
          var ok = d.code >= 200 && d.code < 300;
          return h("div", { key: d.id, className: "ha-hook-dl-row" }, h("span", { className: cx("ha-hook-code", ok ? "ok" : "bad") }, d.code || "—"), h("span", { className: "ha-mono" }, d.event), h("span", { className: "ha-hook-dl-time" }, d.time, d.ms != null && " · " + fmtNum(d.ms) + " ms"), !ok && p.onRetry && h(Button, { size: "sm", variant: "soft", icon: "refresh", onClick: function () { p.onRetry(d); } }, L("Retry")));
        }))));
  }
  function BackupList(p) {
    return h("div", { className: "ha-backups", role: "list", "aria-label": p.label },
      (p.items || []).map(function (b) {
        return h("div", { key: b.id, role: "listitem", className: "ha-backups-row" },
          h(StatusShape, { status: b.status || "ok" }),
          h("span", { className: "ha-option-text" }, h("b", null, b.name || b.time), h("small", null, [b.kind, b.where, b.retention].filter(Boolean).join(" · "))),
          h("span", { className: "ha-backups-size" }, b.size),
          h("span", { className: "ha-row", style: { gap: 4 } }, p.onDownload && h(IconButton, { icon: "download", size: "sm", label: L("Download"), onClick: function () { p.onDownload(b); } }), p.onRestore && h(Button, { size: "sm", variant: "secondary", onClick: function () { p.onRestore(b); } }, L("Restore"))));
      }),
      p.footer && h("div", { className: "ha-backups-foot" }, p.footer));
  }
  function BlockList(p) {
    var q = React.useState("");
    var list = (p.items || []).filter(function (b) { return !q[0] || (b.value + " " + (b.reason || "")).toLowerCase().indexOf(q[0].toLowerCase()) > -1; });
    return h("div", { className: "ha-col", style: { gap: 12 } },
      h("div", { className: "ha-filterbar" }, h(SearchField, { placeholder: p.searchPlaceholder || L("Search blocked entries"), value: q[0], onChange: function (e) { q[1](e.target.value); }, style: { flex: "1 1 220px", minWidth: 0 } }), p.onAdd && h(Button, { size: "sm", icon: "plus", onClick: p.onAdd }, p.addLabel || L("Block"))),
      list.length === 0 ? h("p", { className: "ha-card-desc" }, p.emptyText || L("Nothing blocked.")) :
      h("div", { className: "ha-blocks", role: "list" }, list.map(function (b) {
        return h("div", { key: b.id, role: "listitem", className: "ha-blocks-row" },
          h(Icon, { name: "ban", size: 15 }), h("span", { className: "ha-option-text", style: { minWidth: 0 } }, h("b", { className: "ha-mono" }, b.value), h("small", null, [b.kind, b.reason].filter(Boolean).join(" · "))),
          h("span", { className: "ha-blocks-meta" }, [b.by, b.until ? L("until {date}", { date: b.until }) : L("permanent")].filter(Boolean).join(" · ")),
          p.onRemove && h(Button, { size: "sm", variant: "ghost", onClick: function () { p.onRemove(b); } }, p.removeLabel || L("Unblock")));
      })));
  }

  /* ── Reviews and coupons ── */
  function ReviewCard(p) {
    var reply = React.useState(false), txt = React.useState(p.reply || "");
    var st = { pending: ["signal", L("Waiting")], published: ["ok", L("Published")], hidden: ["idle", L("Hidden")], flagged: ["warn", L("Flagged")] }[p.state || "pending"];
    return h("article", { className: cx("ha-review", "is-" + (p.state || "pending")) },
      h("div", { className: "ha-review-head" }, h(Avatar, { name: p.author, size: 36 }), h("div", { className: "ha-option-text", style: { flex: 1 } }, h("b", null, p.author, p.verified && h("span", { className: "ha-review-ver" }, " · ", L("Verified purchase"))), h("small", null, [p.product, p.date].filter(Boolean).join(" · "))), h(Rating, { value: p.rating }), h(StatusIndicator, { status: st[0], label: p.stateLabel || st[1], size: "sm" })),
      p.title && h("b", { className: "ha-review-title" }, p.title),
      h("p", { className: "ha-review-text" }, p.highlight ? markWords(p.text, p.highlight) : p.text),
      p.reply && !reply[0] && h("div", { className: "ha-review-reply" }, h("small", null, p.replyLabel || L("Your reply")), p.reply),
      reply[0] && h("div", { className: "ha-col", style: { gap: 8 } }, h("textarea", { className: "ha-input", rows: 3, value: txt[0], onChange: function (e) { txt[1](e.target.value); }, placeholder: L("Write a public reply"), "aria-label": L("Reply") }),
        h("div", { className: "ha-row", style: { justifyContent: "flex-end" } }, h(Button, { size: "sm", variant: "ghost", onClick: function () { reply[1](false); } }, L("Cancel")), h(Button, { size: "sm", icon: "send", onClick: function () { p.onReply && p.onReply(txt[0]); reply[1](false); } }, L("Post reply")))),
      !reply[0] && h("div", { className: "ha-review-actions" },
        p.state !== "published" && p.onPublish && h(Button, { size: "sm", icon: "check", onClick: p.onPublish }, L("Publish")),
        p.state !== "hidden" && p.onHide && h(Button, { size: "sm", variant: "secondary", icon: "eye", onClick: p.onHide }, L("Hide")),
        p.onReply && h(Button, { size: "sm", variant: "ghost", icon: "reply", onClick: function () { reply[1](true); } }, p.reply ? L("Edit reply") : L("Reply"))));
  }
  function markWords(text, words) {
    var re = new RegExp("(" + words.map(function (w) { return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")", "gi");
    return String(text).split(re).map(function (part, i) { return i % 2 ? h("mark", { key: i }, part) : part; });
  }
  function CouponCard(p) {
    var used = p.used || 0, st = p.status || (p.limit && used >= p.limit ? "idle" : "ok");
    return h("div", { className: cx("ha-coupon", st !== "ok" && "off") },
      h("div", { className: "ha-coupon-val" }, h("b", null, p.kind === "fixed" ? fmtMoney(p.value, p.currency) : fmtNum(p.value / 100, { style: "percent" })), h("small", null, p.kind === "fixed" ? L("off") : L("off"))),
      h("div", { className: "ha-coupon-main" },
        h("div", { className: "ha-row", style: { gap: 8 } }, h("button", { type: "button", className: "ha-coupon-code", title: L("Copy"), onClick: function () { try { navigator.clipboard.writeText(p.code); } catch (e) {} toast && toast({ title: L("Copied") }); p.onCopy && p.onCopy(); } }, p.code, h(Icon, { name: "copy", size: 13 })), h(StatusIndicator, { status: st, label: p.statusLabel, size: "sm" })),
        p.text && h("small", { className: "ha-coupon-text" }, p.text),
        h(Meter, { value: used, max: p.limit || Math.max(used, 1), text: p.limit ? L("{used} of {limit} used", { used: fmtNum(used), limit: fmtNum(p.limit) }) : L("{used} used", { used: fmtNum(used) }), tone: "sky", warn: 101, danger: 101 }),
        h("span", { className: "ha-coupon-foot" }, [p.until && L("Valid until {date}", { date: p.until }), p.min != null && L("from {amount}", { amount: fmtMoney(p.min, p.currency) }), p.revenue != null && L("{amount} revenue", { amount: fmtMoney(p.revenue, p.currency) })].filter(Boolean).join(" · "))),
      p.menu && h(Popover, { width: 200, trigger: function (s) { return h(IconButton, { icon: "more", size: "sm", label: L("More"), onClick: s.toggle }); } }, function () { return h(Menu, { items: p.menu }); }));
  }

  /* ── Locale, workspace and translations ── */
  function LocaleField(p) {
    var locs = p.locales || [], v = useControlled(p.value, p.defaultValue || {}, p.onChange), cur = React.useState(p.active || (locs[0] && locs[0].code)), id = useId("lf");
    var base = p.source || (locs[0] && locs[0].code), val = v[0][cur[0]] || "";
    function set(t) { var n = Object.assign({}, v[0]); n[cur[0]] = t; v[1](n); }
    var done = locs.filter(function (l) { return (v[0][l.code] || "").trim(); }).length;
    return h(FormField, { id: id, label: p.label, hint: p.hint, error: p.error },
      h("div", { className: "ha-locfield" },
        h("div", { className: "ha-locfield-tabs", role: "tablist", "aria-label": L("Languages") },
          locs.map(function (l) { var has = (v[0][l.code] || "").trim(); return h("button", { key: l.code, type: "button", role: "tab", "aria-selected": cur[0] === l.code, className: cx("ha-locfield-tab", cur[0] === l.code && "on", !has && "missing"), onClick: function () { cur[1](l.code); } }, l.flag && h("span", { "aria-hidden": true }, l.flag), l.label || l.code.toUpperCase(), !has && h("span", { className: "ha-locfield-miss", title: L("Missing") })); }),
          h("span", { className: "ha-locfield-done" }, L("{n} of {total}", { n: done, total: locs.length }))),
        p.multiline ? h("textarea", { id: id, className: "ha-input", rows: p.rows || 3, value: val, onChange: function (e) { set(e.target.value); }, placeholder: cur[0] !== base ? v[0][base] || "" : p.placeholder })
          : h("input", { id: id, className: "ha-input", value: val, onChange: function (e) { set(e.target.value); }, placeholder: cur[0] !== base ? v[0][base] || "" : p.placeholder }),
        cur[0] !== base && h("div", { className: "ha-row", style: { gap: 8 } },
          h(Button, { size: "sm", variant: "ghost", icon: "copy", onClick: function () { set(v[0][base] || ""); } }, L("Copy from {lang}", { lang: (locs.find(function (l) { return l.code === base; }) || {}).label || base })),
          p.onTranslate && h(Button, { size: "sm", variant: "ghost", icon: "sparkle", onClick: function () { Promise.resolve(p.onTranslate(v[0][base] || "", cur[0])).then(function (t) { if (t) set(t); }); } }, L("Translate")))));
  }
  function LocaleSwitcher(p) {
    var lang = useControlled(p.language, p.languages && p.languages[0] && p.languages[0].code, p.onLanguage), cur = useControlled(p.currency, p.currencies && p.currencies[0], p.onCurrency);
    var L0 = (p.languages || []).find(function (l) { return l.code === lang[0]; }) || {};
    return h(Popover, { width: 280, trigger: function (s) {
      return h("button", { type: "button", className: cx("ha-locsw", p.variant === "frame" && "on-frame"), "aria-haspopup": "dialog", "aria-expanded": s.open, onClick: s.toggle, "aria-label": L("Language and currency") }, L0.flag ? h("span", { "aria-hidden": true }, L0.flag) : h(Icon, { name: "globe", size: 15 }), h("span", null, (L0.short || lang[0] || "").toUpperCase()), cur[0] && h("span", { className: "ha-locsw-cur" }, cur[0]), h(Icon, { name: "chevronDown", size: 13 }));
    } }, function (s) {
      return h("div", { className: "ha-col", style: { gap: 12 } },
        p.languages && h("div", { className: "ha-col", style: { gap: 4 } }, h("span", { className: "ha-menu-label", style: { padding: "0 8px" } }, L("Language")), h("div", { className: "ha-menu", style: { padding: 0, boxShadow: "none" } }, p.languages.map(function (l) { return h("button", { key: l.code, type: "button", className: cx("ha-menu-item", l.code === lang[0] && "on"), onClick: function () { lang[1](l.code); } }, l.flag && h("span", { "aria-hidden": true }, l.flag), h("span", { style: { flex: 1 } }, l.label), l.code === lang[0] && h(Icon, { name: "check", size: 14 })); }))),
        p.currencies && h("div", { className: "ha-col", style: { gap: 6 } }, h("span", { className: "ha-menu-label", style: { padding: "0 8px" } }, L("Currency")), h(Segmented, { size: "sm", block: true, value: cur[0], onChange: cur[1], options: p.currencies })));
    });
  }
  function WorkspaceSwitcher(p) {
    var items = p.items || [], v = useControlled(p.value, items[0] && items[0].id, p.onChange), cur = items.find(function (x) { return x.id === v[0]; }) || {};
    return h(Popover, { width: p.width || 300, trigger: function (s) {
      return h("button", { type: "button", className: cx("ha-wssw", p.variant === "frame" && "on-frame"), "aria-haspopup": "listbox", "aria-expanded": s.open, onClick: s.toggle },
        cur.logo || h("span", { className: cx("ha-wssw-mark", "ha-t-" + (cur.tint || "sky")) }, (cur.name || "?").charAt(0)), h("span", { className: "ha-option-text" }, h("b", null, cur.name), cur.sub && h("small", null, cur.sub)), h(Icon, { name: "chevronDown", size: 14 }));
    } }, function (s) {
      return h("div", { className: "ha-col", style: { gap: 8 } }, p.label && h("span", { className: "ha-menu-label", style: { padding: "0 8px" } }, p.label),
        h("div", { className: "ha-menu", role: "listbox", style: { padding: 0, boxShadow: "none" } }, items.map(function (x) {
          return h("button", { key: x.id, type: "button", role: "option", "aria-selected": x.id === v[0], className: cx("ha-menu-item", x.id === v[0] && "on"), onClick: function () { v[1](x.id); s.close && s.close(); } },
            x.logo || h("span", { className: cx("ha-wssw-mark sm", "ha-t-" + (x.tint || "sky")) }, x.name.charAt(0)), h("span", { className: "ha-option-text", style: { flex: 1 } }, h("span", null, x.name), x.sub && h("small", null, x.sub)), x.id === v[0] && h(Icon, { name: "check", size: 14 }));
        })), p.footer);
    });
  }

  /* ── Export and 2FA ── */
  function ExportDialog(p) {
    var fmt = React.useState(p.format || (p.formats || ["csv"])[0]), cols = React.useState((p.columns || []).filter(function (c) { return c.default !== false; }).map(function (c) { return c.key; })), range = React.useState(p.range || null), st = React.useState("form"), prog = React.useState(0);
    if (!p.open && !p.inline) return null;
    function start() {
      st[1]("running"); prog[1](0);
      var res = p.onExport && p.onExport({ format: fmt[0], columns: cols[0], range: range[0] }, function (x) { prog[1](x); });
      Promise.resolve(res).then(function () { prog[1](100); st[1]("done"); });
    }
    var body = h("div", { className: "ha-modal ha-export", role: "dialog", "aria-modal": p.inline ? undefined : "true", "aria-label": p.title || L("Export") },
      h("span", { className: "ha-modal-close" }, h(IconButton, { icon: "x", label: L("Close"), size: "sm", onClick: p.onClose })),
      h("div", null, h("h2", { className: "ha-modal-title" }, p.title || L("Export")), h("p", { className: "ha-modal-text", style: { marginTop: 6 } }, p.text || L("{n} rows match your filters.", { n: fmtNum(p.count || 0) }))),
      st[0] === "form" ? h(React.Fragment, null,
        h(FormField, { label: L("Format") }, h(Segmented, { block: true, value: fmt[0], onChange: fmt[1], options: (p.formats || ["csv", "xlsx", "json"]).map(function (f) { return { value: f, label: f.toUpperCase() }; }) })),
        p.ranges !== false && h(DatePicker, { label: L("Period"), range: true, value: range[0], onChange: range[1], placeholder: L("All time") }),
        (p.columns || []).length > 0 && h(FormField, { label: L("Columns"), hint: L("{n} selected", { n: cols[0].length }) }, h("div", { className: "ha-export-cols" }, p.columns.map(function (c) { var on = cols[0].indexOf(c.key) > -1; return h("label", { key: c.key, className: "ha-check" }, cbox({ checked: on, onChange: function () { cols[1](on ? cols[0].filter(function (k) { return k !== c.key; }) : cols[0].concat([c.key])); } }), c.label); }))),
        p.note && h("p", { className: "ha-card-desc", style: { margin: 0 } }, p.note),
        h("div", { className: "ha-modal-foot" }, h(Button, { variant: "ghost", onClick: p.onClose }, L("Cancel")), h(Button, { icon: "download", disabled: !cols[0].length && (p.columns || []).length > 0, onClick: start }, L("Export")))) :
      st[0] === "running" ? h("div", { className: "ha-col", style: { gap: 8 } }, h(Progress, { value: prog[0], label: L("Export progress") }), h("span", { className: "ha-card-desc" }, L("Preparing the file…") + " " + Math.round(prog[0]) + "%")) :
      h(React.Fragment, null, h(StatusIndicator, { status: "ok", label: p.doneText || L("Your file is ready.") }), h("div", { className: "ha-modal-foot" }, h(Button, { variant: "ghost", onClick: function () { st[1]("form"); } }, L("New export")), p.download || h(Button, { icon: "download", onClick: p.onDownload }, L("Download")))));
    return p.inline ? body : portal(h("div", { className: "ha-overlay" }, h("div", { className: "ha-backdrop", onClick: p.onClose }), body));
  }
  function TwoFactorSetup(p) {
    var step = React.useState(p.step || 0), err = React.useState(null), saved = React.useState(false);
    var steps = [L("Scan"), L("Confirm"), L("Save codes")];
    return h("div", { className: "ha-2fa" },
      h("ol", { className: "ha-2fa-steps" }, steps.map(function (s, i) { return h("li", { key: i, className: cx(i === step[0] && "on", i < step[0] && "done") }, h("span", null, i < step[0] ? h(Icon, { name: "check", size: 12 }) : i + 1), s); })),
      step[0] === 0 && h("div", { className: "ha-2fa-scan" },
        h("div", { className: "ha-2fa-qr", "aria-label": L("QR code") }, p.qr || h(Icon, { name: "grid", size: 48 })),
        h("div", { className: "ha-col", style: { gap: 12, minWidth: 0 } }, h("p", { className: "ha-card-desc", style: { margin: 0 } }, p.scanText || L("Scan the code with your authenticator app. If you can't scan it, enter the key by hand.")),
          h("button", { type: "button", className: "ha-2fa-key", onClick: function () { try { navigator.clipboard.writeText(p.secret); } catch (e) {} toast && toast({ title: L("Copied") }); } }, h("span", { className: "ha-mono" }, (p.secret || "").replace(/(.{4})/g, "$1 ").trim()), h(Icon, { name: "copy", size: 14 })),
          h("div", null, h(Button, { onClick: function () { step[1](1); } }, L("Next"))))),
      step[0] === 1 && h("div", { className: "ha-col", style: { gap: 12 } }, h("p", { className: "ha-card-desc", style: { margin: 0 } }, L("Enter the 6-digit code from the app.")),
        h(OtpInput, { error: !!err[0], onComplete: function (c) { Promise.resolve(p.onVerify ? p.onVerify(c) : true).then(function (ok) { if (ok) { err[1](null); step[1](2); } else err[1](L("That code didn't work. Try the current one.")); }); } }),
        err[0] && h("span", { className: "ha-field-error" }, err[0]), h("div", null, h(Button, { variant: "ghost", onClick: function () { step[1](0); } }, L("Back")))),
      step[0] === 2 && h("div", { className: "ha-col", style: { gap: 12 } }, h("p", { className: "ha-card-desc", style: { margin: 0 } }, p.codesText || L("Each code works once if you lose your phone. Keep them somewhere safe.")),
        h("div", { className: "ha-2fa-codes" }, (p.codes || []).map(function (c) { return h("code", { key: c }, c); })),
        h("div", { className: "ha-row" }, h(Button, { variant: "secondary", icon: "copy", onClick: function () { try { navigator.clipboard.writeText((p.codes || []).join("\n")); } catch (e) {} toast && toast({ title: L("Copied") }); } }, L("Copy")), p.onDownload && h(Button, { variant: "secondary", icon: "download", onClick: p.onDownload }, L("Download"))),
        h(Checkbox, { checked: saved[0], onChange: function () { saved[1](!saved[0]); } }, L("I saved the recovery codes")),
        h("div", null, h(Button, { icon: "check", disabled: !saved[0], onClick: p.onDone }, L("Turn on two-factor")))));
  }

  /* ── Media ── */
  function ImageVariants(p) {
    var sel = useControlled(p.selected, (p.variants || [])[0] && p.variants[0].id, p.onSelect), cur = (p.variants || []).find(function (v) { return v.id === sel[0]; }) || {};
    return h("div", { className: "ha-imgvar" },
      h("div", { className: "ha-imgvar-stage", style: cur.ratio ? { aspectRatio: cur.ratio } : undefined }, cur.src ? h("img", { src: cur.src, alt: p.alt || "" }) : h("div", { className: cx("ha-imgvar-ph", "ha-t-" + (p.tint || "sky")) }, h(Icon, { name: "image", size: 32 })), cur.label && h("span", { className: "ha-imgvar-tag" }, cur.label)),
      h("div", { className: "ha-imgvar-list", role: "listbox", "aria-label": L("Variants") }, (p.variants || []).map(function (v) {
        return h("button", { key: v.id, type: "button", role: "option", "aria-selected": v.id === sel[0], className: cx("ha-imgvar-item", v.id === sel[0] && "on"), onClick: function () { sel[1](v.id); } },
          h("span", { className: "ha-imgvar-thumb", style: v.ratio ? { aspectRatio: v.ratio } : undefined }, v.src ? h("img", { src: v.src, alt: "" }) : h(Icon, { name: "image", size: 14 })),
          h("span", { className: "ha-option-text" }, h("b", null, v.label), h("small", { className: "ha-mono" }, [v.size, v.format, v.weight].filter(Boolean).join(" · "))), v.status && h(StatusShape, { status: v.status }));
      })),
      p.actions && h("div", { className: "ha-row", style: { justifyContent: "flex-end" } }, p.actions));
  }
  function Gallery(p) {
    var items = p.items || [], i = React.useState(p.start || 0), full = React.useState(false), n = items.length, cur = items[i[0]] || {};
    function go(d) { i[1]((i[0] + d + n) % n); }
    React.useEffect(function () { if (!full[0]) return; function k(e) { if (e.key === "Escape") full[1](false); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); } document.addEventListener("keydown", k); return function () { document.removeEventListener("keydown", k); }; });
    function pic(it, cls) { return it.src ? h("img", { className: cls, src: it.src, alt: it.alt || "" }) : h("div", { className: cx(cls, "ha-gallery-ph", "ha-t-" + (it.tint || "sky")) }, it.art || h(Icon, { name: "image", size: 28 })); }
    var stage = h("div", { className: "ha-gallery-stage", style: { aspectRatio: p.ratio || "3 / 2" } }, pic(cur, "ha-gallery-img"),
      n > 1 && h(IconButton, { icon: "chevronLeft", label: L("Previous image"), className: "ha-gallery-prev", onClick: function () { go(-1); } }), n > 1 && h(IconButton, { icon: "chevronRight", label: L("Next image"), className: "ha-gallery-next", onClick: function () { go(1); } }),
      h("span", { className: "ha-gallery-count" }, (i[0] + 1) + " / " + n), !full[0] && p.fullscreen !== false && h(IconButton, { icon: "expand", label: L("Full screen"), className: "ha-gallery-full", onClick: function () { full[1](true); } }), p.badge && h("span", { className: "ha-gallery-badge" }, p.badge));
    return h("div", { className: "ha-gallery" }, stage,
      p.thumbs !== false && n > 1 && h("div", { className: "ha-gallery-thumbs", role: "tablist", "aria-label": L("Images") }, items.map(function (it, k) { return h("button", { key: k, type: "button", role: "tab", "aria-selected": k === i[0], className: cx(k === i[0] && "on"), onClick: function () { i[1](k); }, "aria-label": L("Image {n}", { n: k + 1 }) }, pic(it, "ha-gallery-thumb")); })),
      full[0] && portal(h("div", { className: "ha-lightbox", role: "dialog", "aria-modal": "true", "aria-label": L("Images") }, h(IconButton, { icon: "x", label: L("Close"), className: "ha-lightbox-close", onClick: function () { full[1](false); } }), h("div", { className: "ha-lightbox-stage" }, pic(cur, "ha-gallery-img"), n > 1 && h(IconButton, { icon: "chevronLeft", label: L("Previous image"), className: "ha-gallery-prev", onClick: function () { go(-1); } }), n > 1 && h(IconButton, { icon: "chevronRight", label: L("Next image"), className: "ha-gallery-next", onClick: function () { go(1); } })), h("span", { className: "ha-lightbox-cap" }, (cur.caption ? cur.caption + " · " : "") + (i[0] + 1) + " / " + n))));
  }
  function BeforeAfter(p) {
    var pos = React.useState(p.start != null ? p.start : 50), ref = React.useRef(null), drag = React.useRef(false);
    function at(e) { var r = ref.current.getBoundingClientRect(); pos[1](Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100))); }
    function pane(x, cls) { return x && x.src ? h("img", { className: cls, src: x.src, alt: x.alt || "" }) : h("div", { className: cx(cls, "ha-ba-ph", x && x.tint && "ha-t-" + x.tint) }, x && x.art); }
    return h("div", { ref: ref, className: "ha-ba", style: { aspectRatio: p.ratio || "3 / 2" }, onPointerDown: function (e) { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); at(e); }, onPointerMove: function (e) { if (drag.current) at(e); }, onPointerUp: function () { drag.current = false; } },
      pane(p.after, "ha-ba-img"),
      h("div", { className: "ha-ba-before", style: { clipPath: "inset(0 " + (100 - pos[0]) + "% 0 0)" } }, pane(p.before, "ha-ba-img")),
      h("span", { className: "ha-ba-tag left" }, p.beforeLabel || L("Before")), h("span", { className: "ha-ba-tag right" }, p.afterLabel || L("After")),
      h("div", { className: "ha-ba-line", style: { left: pos[0] + "%" } }, h("span", { className: "ha-ba-knob", role: "slider", tabIndex: 0, "aria-label": L("Compare before and after"), "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(pos[0]), onKeyDown: function (e) { if (e.key === "ArrowLeft") pos[1](Math.max(0, pos[0] - 5)); if (e.key === "ArrowRight") pos[1](Math.min(100, pos[0] + 5)); } }, h(Icon, { name: "chevronLeft", size: 12 }), h(Icon, { name: "chevronRight", size: 12 }))));
  }

  /* ── Real estate ── */
  function listingFacts(x) {
    return [x.area != null && [h(Icon, { key: "i", name: "ruler", size: 14 }), fmtNum(x.area) + " m²"], x.rooms != null && [h(Icon, { key: "i", name: "bed", size: 14 }), L("{n} rooms", { n: fmtNum(x.rooms) })], x.place && [h(Icon, { key: "i", name: "pin", size: 14 }), x.place]].filter(Boolean)
      .map(function (f, i) { return h("span", { key: i }, f); });
  }
  function listingPrice(x) {
    if (x.price == null) return h("b", { className: "ha-listing-price" }, L("Price on request"));
    return h("b", { className: "ha-listing-price" }, fmtMoney(x.price, x.currency), x.rent && h("small", null, " ", L("/ month")));
  }
  function ListingCard(p) {
    var x = p.listing || p;
    return h("article", { className: cx("ha-listing", p.layout === "row" && "row", p.selected && "selected", x.status === "unread" && "unread"), onClick: p.onOpen && function () { p.onOpen(x); } },
      h("div", { className: "ha-listing-media" }, x.image ? h("img", { src: x.image, alt: "" }) : h("div", { className: cx("ha-listing-ph", "ha-t-" + (x.tint || "sky")) }, h(Icon, { name: "image", size: 24 })),
        x.isNew && h("span", { className: "ha-listing-new" }, L("New")), x.photos > 1 && h("span", { className: "ha-listing-photos" }, h(Icon, { name: "image", size: 12 }), fmtNum(x.photos)),
        p.onSelect && h("label", { className: "ha-listing-sel", onClick: function (e) { e.stopPropagation(); } }, cbox({ checked: !!p.selected, onChange: function () { p.onSelect(x); }, label: L("Select") }))),
      h("div", { className: "ha-listing-body" },
        h("div", { className: "ha-listing-top" }, listingPrice(x), x.pricePerSqm != null && h("span", { className: "ha-listing-ppsqm" }, fmtMoney(x.pricePerSqm, x.currency) + " / m²"), p.onWish && h(IconButton, { icon: "heart", size: "sm", label: x.wished ? L("Remove from saved") : L("Save"), className: cx("ha-listing-wish", x.wished && "on"), onClick: function (e) { e.stopPropagation(); p.onWish(x); } })),
        h("b", { className: "ha-listing-title" }, x.title),
        h("div", { className: "ha-listing-facts" }, listingFacts(x)),
        h("div", { className: "ha-listing-foot" },
          x.source && h("span", { className: "ha-listing-src" }, x.source),
          x.seller && h(Badge, { tone: x.seller === "private" ? "success" : "neutral", dot: false }, x.sellerLabel || (x.seller === "private" ? L("Private seller") : L("Agent"))),
          x.phone && h("span", { className: "ha-listing-flag", title: L("Phone number available") }, h(Icon, { name: "phone", size: 13 })),
          h("span", { style: { flex: 1 } }), x.age && h("span", { className: "ha-listing-age" }, x.age),
          p.statusOptions && h("span", { onClick: function (e) { e.stopPropagation(); } }, h(StatusSelect, { size: "sm", options: p.statusOptions, value: x.status, onChange: function (s) { p.onStatus && p.onStatus(x, s); }, label: L("Status") })))));
  }
  function ResultsToolbar(p) {
    var all = p.total > 0 && p.selected === p.total, some = p.selected > 0 && !all;
    return h("div", { className: "ha-results" },
      p.onSelectAll && h("label", { className: "ha-check" }, cbox({ checked: all, indeterminate: some, onChange: function () { p.onSelectAll(!all); }, label: all ? L("Deselect all") : L("Select all") })),
      h("div", { className: "ha-option-text", style: { marginRight: "auto" } }, h("b", null, p.selected > 0 ? L("{n} selected", { n: fmtNum(p.selected) }) : p.title || L("Results")), h("small", null, L("{n} found", { n: fmtNum(p.total || 0) }) + (p.meta ? " · " + p.meta : ""))),
      p.selected > 0 && (p.bulkActions || []).map(function (a, i) { return h(Button, { key: i, size: "sm", variant: a.variant || "secondary", icon: a.icon, disabled: a.busy, onClick: a.onClick }, a.busy ? (a.busyLabel || L("Working…")) : a.label); }),
      p.sortOptions && h("label", { className: "ha-results-sort" }, h("span", null, L("Sort")), h("select", { className: "ha-input", value: p.sort, onChange: function (e) { p.onSort && p.onSort(e.target.value); } }, p.sortOptions.map(function (o) { return h("option", { key: o.value, value: o.value }, o.label); }))),
      p.views && h(Segmented, { size: "sm", value: p.view, onChange: p.onView, label: L("View"), options: p.views.map(function (v) { return { value: v, icon: v === "grid" ? "grid" : v === "map" ? "map" : "list", label: v === "grid" ? L("Grid") : v === "map" ? L("Map") : L("List") }; }) }));
  }
  function SavedSearch(p) {
    return h("div", { className: cx("ha-saved", p.enabled === false && "off") },
      h("div", { className: "ha-saved-head" }, h(TintIcon, { icon: p.icon || "search", tint: p.tint || "sky", size: 36 }),
        h("div", { className: "ha-option-text", style: { flex: 1, minWidth: 0 } }, h("b", null, p.name), h("small", null, [p.lastRun && L("Checked {time}", { time: p.lastRun }), p.frequency].filter(Boolean).join(" · "))),
        p.newCount > 0 && h("span", { className: "ha-nav-count" }, fmtNum(p.newCount)), p.onToggle && h(Switch, { checked: p.enabled !== false, onChange: p.onToggle })),
      h("div", { className: "ha-saved-crit" }, (p.criteria || []).map(function (c, i) { return h("span", { key: i, className: "ha-saved-chip" }, c); })),
      (p.onOpen || p.onEdit) && h("div", { className: "ha-row", style: { justifyContent: "flex-end" } }, p.onEdit && h(Button, { size: "sm", variant: "ghost", icon: "edit", onClick: p.onEdit }, L("Edit")), p.onOpen && h(Button, { size: "sm", variant: "soft", onClick: p.onOpen }, p.openLabel || L("Show results"))));
  }
  function ValuationCard(p) {
    var lo = p.low, hi = p.high, v = p.value, span = hi - lo || 1, pos = (v - lo) / span * 100;
    var conf = p.confidence, cl = conf == null ? null : conf >= 0.75 ? ["ok", L("High confidence")] : conf >= 0.5 ? ["warn", L("Medium confidence")] : ["danger", L("Low confidence")];
    return h("div", { className: "ha-valuation" },
      h("div", { className: "ha-valuation-head" }, h("span", { className: "ha-menu-label", style: { padding: 0 } }, p.title || L("Estimated value")), cl && h(StatusIndicator, { status: cl[0], label: p.confidenceLabel || cl[1], size: "sm" })),
      h("div", { className: "ha-valuation-val" }, fmtMoney(v, p.currency)), p.perSqm != null && h("span", { className: "ha-valuation-sub" }, fmtMoney(p.perSqm, p.currency) + " / m²" + (p.compare ? " · " + p.compare : "")),
      h("div", { className: "ha-valuation-range", role: "img", "aria-label": L("Range {low} to {high}", { low: fmtMoney(lo, p.currency), high: fmtMoney(hi, p.currency) }) },
        h("div", { className: "ha-valuation-bar" }, p.asking != null && h("span", { className: "ha-valuation-ask", style: { left: Math.max(0, Math.min(100, (p.asking - lo) / span * 100)) + "%" }, title: L("Asking price") }), h("span", { className: "ha-valuation-mark", style: { left: pos + "%" } })),
        h("div", { className: "ha-valuation-ends" }, h("span", null, fmtMoney(lo, p.currency)), h("span", null, fmtMoney(hi, p.currency)))),
      p.asking != null && h("span", { className: cx("ha-valuation-diff", p.asking > hi ? "bad" : p.asking < lo ? "good" : "") }, L("Asking price {price}", { price: fmtMoney(p.asking, p.currency) }) + " · " + (p.asking > v ? "+" : "") + fmtNum((p.asking - v) / v, { style: "percent", maximumFractionDigits: 1 })),
      p.facts && h(KeyValue, { dense: true, items: p.facts }),
      p.note && h("p", { className: "ha-card-desc", style: { margin: 0 } }, p.note), p.action);
  }
  var ENERGY = ["A+", "A", "B", "C", "D", "E", "F", "G", "H"];
  function EnergyClass(p) {
    var scale = p.scale || ENERGY, i = scale.indexOf(p.value);
    return h("div", { className: "ha-energy", role: "img", "aria-label": L("Energy class {value}", { value: p.value }) + (p.kwh != null ? ", " + fmtNum(p.kwh) + " kWh/(m²·a)" : "") },
      h("div", { className: "ha-energy-scale", style: { gridTemplateColumns: "repeat(" + scale.length + ", 1fr)" } }, scale.map(function (c, k) { return h("span", { key: c, className: cx("ha-energy-c", k === i && "on"), style: { "--e": k / (scale.length - 1) } }, c); })),
      (p.kwh != null || p.kind) && h("span", { className: "ha-energy-meta" }, [p.kwh != null && fmtNum(p.kwh) + " kWh/(m²·a)", p.kind].filter(Boolean).join(" · ")));
  }

  /* ── Site chrome: assistant launcher, cookie consent, announcement ── */
  function ChatLauncher(p) {
    var open = useControlled(p.open, false, p.onOpenChange);
    return h("div", { className: cx("ha-launch", open[0] && "open", p.inline && "inline") },
      open[0] && h("div", { className: "ha-launch-panel", role: "dialog", "aria-label": p.title || L("Assistant") },
        h("div", { className: "ha-launch-head" }, h(AgentMark, { tint: p.tint || "lilac", size: 32 }), h("div", { className: "ha-option-text", style: { flex: 1 } }, h("b", null, p.title || L("Assistant")), p.context && h("small", null, p.context)), p.headerAction, h(IconButton, { icon: "x", size: "sm", label: L("Close"), onClick: function () { open[1](false); } })),
        h("div", { className: "ha-launch-body" }, p.children),
        p.composer && h("div", { className: "ha-launch-foot" }, p.composer)),
      h("button", { type: "button", className: "ha-launch-btn", "aria-label": open[0] ? L("Close assistant") : (p.title || L("Open assistant")), "aria-expanded": open[0], onClick: function () { open[1](!open[0]); } }, h(Icon, { name: open[0] ? "x" : "sparkle", size: 22 }), !open[0] && p.unread > 0 && h("span", { className: "ha-nav-count" }, p.unread)));
  }
  function CookieConsent(p) {
    var more = React.useState(false), cats = React.useState((p.categories || []).reduce(function (a, c) { a[c.id] = !!(c.required || c.default); return a; }, {}));
    if (p.open === false) return null;
    function done(all) { var v = Object.assign({}, cats[0]); (p.categories || []).forEach(function (c) { if (all === true) v[c.id] = true; if (all === false) v[c.id] = !!c.required; }); p.onSave && p.onSave(v); }
    return h("div", { className: cx("ha-cookie", p.inline && "inline"), role: "dialog", "aria-label": p.title || L("Privacy settings") },
      h("div", { className: "ha-row", style: { gap: 12, alignItems: "flex-start", flexWrap: "nowrap" } }, h(TintIcon, { icon: "cookie", tint: "butter", size: 36 }), h("div", { className: "ha-col", style: { gap: 4 } }, h("b", null, p.title || L("Privacy settings")), h("p", { className: "ha-card-desc", style: { margin: 0 } }, p.text || L("We use cookies to run this site and, with your consent, to measure and improve it."), p.policy && h(React.Fragment, null, " ", p.policy)))),
      more[0] && h("div", { className: "ha-cookie-cats" }, (p.categories || []).map(function (c) { return h("div", { key: c.id, className: "ha-cookie-cat" }, h("div", { className: "ha-option-text", style: { flex: 1 } }, h("b", null, c.label), c.text && h("small", null, c.text)), c.required ? h("span", { className: "ha-card-desc" }, L("Always on")) : h(Switch, { checked: !!cats[0][c.id], onChange: function () { var n = Object.assign({}, cats[0]); n[c.id] = !n[c.id]; cats[1](n); } })); })),
      h("div", { className: "ha-cookie-actions" }, more[0] ? h(Button, { variant: "secondary", onClick: function () { done(null); } }, L("Save choice")) : h(Button, { variant: "ghost", onClick: function () { more[1](true); } }, L("Settings")), h(Button, { variant: "secondary", onClick: function () { done(false); } }, L("Only necessary")), h(Button, { onClick: function () { done(true); } }, L("Accept all"))));
  }
  function AnnouncementBar(p) {
    var shut = React.useState(false);
    if (shut[0]) return null;
    return h("div", { className: cx("ha-announce", "ha-t-" + (p.tint || "butter")), role: "status" }, p.icon !== false && h(Icon, { name: p.icon || "sparkle", size: 15 }), h("span", null, p.children), p.action, p.onDismiss !== false && h("button", { type: "button", className: "ha-announce-x", "aria-label": L("Dismiss"), onClick: function () { shut[1](true); p.onDismiss && p.onDismiss(); } }, h(Icon, { name: "x", size: 14 })));
  }
  function ColorField(p) {
    var id = useId("cf"), v = useControlled(p.value, p.defaultValue || "#000000", p.onChange);
    function lum(hx) { var m = /^#?([0-9a-f]{6})$/i.exec(hx || ""); if (!m) return null; var n = parseInt(m[1], 16), c = [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (x) { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
    var a = lum(v[0]), b = lum(p.against || "#ffffff"), ratio = a != null && b != null ? (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) : null;
    return h(FormField, { id: id, label: p.label, hint: p.hint },
      h("div", { className: "ha-colorf" }, h("label", { className: "ha-colorf-sw", style: { background: v[0] } }, h("input", { type: "color", value: /^#[0-9a-f]{6}$/i.test(v[0]) ? v[0] : "#000000", onChange: function (e) { v[1](e.target.value); }, "aria-label": L("Pick a colour") })),
        h("input", { id: id, className: "ha-input ha-mono", value: v[0], onChange: function (e) { v[1](e.target.value); }, spellCheck: false }),
        ratio != null && p.against !== false && h("span", { className: cx("ha-colorf-ratio", ratio >= 4.5 ? "ok" : ratio >= 3 ? "warn" : "bad"), title: L("Contrast against {color}", { color: p.against || "#ffffff" }) }, fmtNum(ratio, { maximumFractionDigits: 1 }) + ":1 " + (ratio >= 4.5 ? "AA" : ratio >= 3 ? L("AA large") : L("Fails")))));
  }


  /* Page helper: mounts a page with a Replay control that re-runs all entrance motion */
  function mountPage(App, el) {
    function Host() {
      var k = React.useState(0);
      return h(F, null, h(App, { key: k[0] }), h("button", { type: "button", className: "ha-replay", onClick: function () { k[1](k[0] + 1); } }, h(Icon, { name: "play", size: 11 }), L("Replay motion")));
    }
    ReactDOM.createRoot(el || document.getElementById("root")).render(h(Host));
  }

  window.Halo = Object.assign(window.Halo || {}, {
    StatusShape: StatusShape, StatusIndicator: StatusIndicator, ApprovalInbox: ApprovalInbox, Kbd: Kbd, KeyValue: KeyValue, Spinner: Spinner, Collapsible: Collapsible, ContextMenu: ContextMenu, SplitPane: SplitPane, TreeView: TreeView, InlineEdit: InlineEdit, LogView: LogView, CodeViewer: CodeViewer, SecretField: SecretField, MoneyInput: MoneyInput, SettingsLayout: SettingsLayout, ShortcutsOverlay: ShortcutsOverlay, StatCell: StatCell, UptimeBar: UptimeBar, Meter: Meter, AgentCard: AgentCard, AgentDetails: AgentDetails, ChatList: ChatList, ChatWorkspace: ChatWorkspace, SearchHits: SearchHits, ThinkingLine: ThinkingLine, FeedbackRating: FeedbackRating, ActivityFeed: ActivityFeed, DailyBriefing: DailyBriefing, BudgetStop: BudgetStop, MemoryViewer: MemoryViewer, OverrideDiff: OverrideDiff, TriggerList: TriggerList, ScheduleCalendar: ScheduleCalendar, OrgChart: OrgChart, VoiceMode: VoiceMode, ConnectionCard: ConnectionCard, ConnectionBanner: ConnectionBanner, ServerCard: ServerCard, DeployPipeline: DeployPipeline, DnsRecordTable: DnsRecordTable, DomainList: DomainList, MailAuthStatus: MailAuthStatus, LedgerTable: LedgerTable, PnLStatement: PnLStatement, ReceiptSuggestion: ReceiptSuggestion, AccountSwitcher: AccountSwitcher, InboxList: InboxList, MailThread: MailThread, SignatureEditor: SignatureEditor, AttachmentPreview: AttachmentPreview, MobileTabBar: MobileTabBar, PushNotification: PushNotification, ConfigPRSummary: ConfigPRSummary, ModuleRegistry: ModuleRegistry, RangeSlider: RangeSlider, BarList: BarList, StatusSelect: StatusSelect, TilePicker: TilePicker, LiveFeed: LiveFeed, MapView: MapView, RichTextEditor: RichTextEditor, EmailPreview: EmailPreview, SearchAdPreview: SearchAdPreview, BalanceCard: BalanceCard, ServiceMonitor: ServiceMonitor, RunHistory: RunHistory, WebhookEndpoint: WebhookEndpoint, BackupList: BackupList, BlockList: BlockList, ReviewCard: ReviewCard, CouponCard: CouponCard, LocaleField: LocaleField, LocaleSwitcher: LocaleSwitcher, WorkspaceSwitcher: WorkspaceSwitcher, ExportDialog: ExportDialog, TwoFactorSetup: TwoFactorSetup, ImageVariants: ImageVariants, Gallery: Gallery, BeforeAfter: BeforeAfter, ListingCard: ListingCard, ResultsToolbar: ResultsToolbar, SavedSearch: SavedSearch, ValuationCard: ValuationCard, EnergyClass: EnergyClass, ChatLauncher: ChatLauncher, CookieConsent: CookieConsent, AnnouncementBar: AnnouncementBar, ColorField: ColorField,
    L: L, Lx: Lx, setLabels: setLabels, setLocale: setLocale, formatNumber: fmtNum, formatMoney: fmtMoney, formatDate: fmtDate,
    RichText: RichText, CodeBlock: CodeBlock, TypingDots: TypingDots, AgentMark: AgentMark, ChatMessage: ChatMessage, ToolCall: ToolCall, Reasoning: Reasoning, ApprovalCard: ApprovalCard, PromptStarters: PromptStarters, ModelPicker: ModelPicker, Composer: Composer, AgentStatus: AgentStatus, RunTrace: RunTrace, UsageMeter: UsageMeter, ProductArt: ProductArt, Price: Price, Rating: Rating, StockBadge: StockBadge, ProductCard: ProductCard, VariantPicker: VariantPicker, CartLine: CartLine, OrderSummary: OrderSummary, CheckoutSteps: CheckoutSteps, OrderTimeline: OrderTimeline, StatusScreen: StatusScreen, PlanCard: PlanCard, AuthCard: AuthCard, money: money,
    FormField: FormField, TextField: TextField, RadioGroup: RadioGroup, Segmented: Segmented, Popover: Popover, Tooltip: Tooltip, Combobox: Combobox, TagInput: TagInput, Calendar: Calendar, DatePicker: DatePicker, NumberInput: NumberInput, Slider: Slider, OtpInput: OtpInput, FileDrop: FileDrop, Alert: Alert, ConfirmDialog: ConfirmDialog, Toaster: Toaster, FilterBar: FilterBar, DataTable: DataTable, StackedBarChart: StackedBarChart, AreaChart: AreaChart, Heatmap: Heatmap, Funnel: Funnel, Gauge: Gauge, Legend: Legend, toast: toast,
    Icon: Icon, Button: Button, IconButton: IconButton, Chip: Chip, Badge: Badge, TintIcon: TintIcon, Avatar: Avatar, AvatarStack: AvatarStack,
    Input: Input, Select: Select, Textarea: Textarea, SearchField: SearchField, Checkbox: Checkbox, Switch: Switch,
    Tabs: Tabs, Breadcrumb: Breadcrumb, Pagination: Pagination, StatTile: StatTile, CountUp: CountUp, Card: Card, EventCard: EventCard, Panel: Panel, PageHeader: PageHeader,
    TopBar: TopBar, SideRail: SideRail, Dock: Dock, AppShell: AppShell, Stagger: Stagger, Table: Table, ListRow: ListRow, Timeline: Timeline, FileRow: FileRow, KanbanColumn: KanbanColumn,
    Progress: Progress, ProgressRing: ProgressRing, BarChart: BarChart, LineChart: LineChart, Sparkline: Sparkline, Donut: Donut, Skeleton: Skeleton,
    Menu: Menu, Modal: Modal, Toast: Toast, EmptyState: EmptyState, mountPage: mountPage, NAV: NAV, SubNav: SubNav, Drawer: Drawer, CommandPalette: CommandPalette, NotificationList: NotificationList, Flow: Flow, FileCard: FileCard, FileThumb: FileThumb, Wizard: Wizard, PermissionMatrix: PermissionMatrix, InvoicePreview: InvoicePreview, TransactionRow: TransactionRow, useTrap: useTrap
  });
})();
