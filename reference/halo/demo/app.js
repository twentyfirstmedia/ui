(function () {
  var H = window.Halo, h = React.createElement, useState = React.useState, useMemo = React.useMemo, useEffect = React.useEffect;
  H.setLocale("en-US", { currency: "EUR", weekStart: 1 });

  /* ───────── Demo data (seeded, so every visit shows the same workspace) ───────── */
  var seed = 21;
  function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  function pick(a) { return a[Math.floor(rnd() * a.length)]; }
  function int(a, b) { return Math.floor(a + rnd() * (b - a + 1)); }
  var FIRST = ['Mara', 'Jonah', 'Sun', 'Rui', 'Ava', 'Ida', 'Theo', 'Lena', 'Omar', 'Priya', 'Felix', 'Nora', 'Kai', 'Elif', 'Marco', 'Yuki', 'Sofia', 'Ben', 'Amara', 'Lucas', 'Hana', 'Noah', 'Zoe', 'Malik', 'Clara', 'Emil', 'Leila', 'Arjun', 'Freya', 'Tom'];
  var LAST = ['Ellis', 'Petit', 'Lee', 'Costa', 'Brandt', 'Nolan', 'Marsh', 'Vogel', 'Haddad', 'Raman', 'Berg', 'Quinn', 'Sato', 'Demir', 'Rossi', 'Tanaka', 'Silva', 'Ward', 'Okafor', 'Meyer'];
  var TEAMS = ['Design', 'Growth', 'Support', 'Finance', 'Sales', 'Engineering'];
  var ROLES = ['Admin', 'Editor', 'Editor', 'Editor', 'Viewer', 'Viewer'];
  var COMPANIES = ['Northwind', 'Blue Fern', 'Copperline', 'Harbor & Co', 'Lumen Labs', 'Orbit Foods', 'Kestrel Bank', 'Pinegate', 'Sable Studio', 'Tidewater', 'Morrow Health', 'Ferro Works', 'Quill Media', 'Atlas Freight', 'Juniper Legal'];

  var members = [{ id: 0, name: 'Mara Ellis', email: 'mara@halo.app', role: 'Owner', team: 'Leadership', status: 'Active', last: 0 }];
  for (var i = 1; i < 40; i++) {
    var fn = FIRST[i % FIRST.length], ln = pick(LAST), st = rnd();
    members.push({ id: i, name: fn + ' ' + ln, email: (fn + '.' + ln).toLowerCase() + '@halo.app', role: pick(ROLES), team: pick(TEAMS), status: st < 0.78 ? 'Active' : st < 0.88 ? 'Away' : st < 0.95 ? 'Invited' : 'Suspended', last: int(0, 60 * 24 * 9) });
  }
  var PROJ = [['Quarterly onboarding', 'Welcome flow for new workspace admins.', 'book', 'mint'], ['Pricing page refresh', 'New tiers and a comparison table for annual plans.', 'card', 'butter'], ['Partner referral program', 'Track invites, payouts and partner tiers.', 'users', 'sky'], ['Help center migration', 'Move 140 articles to the new docs layout.', 'file', 'mint'], ['Mobile app beta', 'TestFlight build for 200 early customers.', 'zap', 'lilac'], ['Churn interviews', 'Ten calls with customers who left in Q1.', 'mail', 'blush'], ['Status page', 'Public uptime page with incident history.', 'globe', 'sky'], ['Annual report', 'Numbers, highlights and the roadmap for 2027.', 'chart', 'butter'], ['SSO for Business', 'SAML and SCIM for the top plan.', 'lock', 'lilac'], ['Invoice redesign', 'Clearer totals and tax lines on PDF invoices.', 'card', 'butter'], ['Community forum', 'A place for customers to share templates.', 'users', 'sky'], ['Accessibility audit', 'Keyboard, contrast and screen reader pass.', 'eye', 'mint'], ['Data export v2', 'Scheduled CSV exports to S3 and email.', 'download', 'sky'], ['Spring campaign', 'Email, social and partner push for April.', 'send', 'blush'], ['Integrations hub', 'One page for Slack, Drive and calendar apps.', 'link', 'lilac']];
  var PSTAT = ['Live', 'Live', 'Live', 'Draft', 'Review', 'Archived'];
  var projects = PROJ.map(function (p, i) { return { id: i, title: p[0], desc: p[1], icon: p[2], tint: p[3], owner: members[int(0, 12)].name, status: i === 1 ? 'Review' : pick(PSTAT), steps: int(3, 16), users: int(0, 900), progress: int(5, 100), featured: i === 1 }; });

  /* 120 days of revenue + sign-ups with a gentle upward trend and weekly rhythm */
  var days = [];
  var today = new Date(2026, 3, 16);
  for (var d = 119; d >= 0; d--) {
    var dt = new Date(today); dt.setDate(today.getDate() - d);
    var wk = [0.7, 1.05, 1.1, 1.08, 1.12, 0.95, 0.6][dt.getDay()], growth = 1 + (119 - d) / 160;
    days.push({ date: dt, revenue: Math.round((1100 + rnd() * 380) * wk * growth), signups: Math.round((22 + rnd() * 14) * wk * growth), churn: Math.round(1 + rnd() * 3), visits: Math.round((1800 + rnd() * 500) * wk * growth) });
  }

  var invoices = [];
  for (var k = 0; k < 48; k++) {
    var idt = new Date(today); idt.setDate(today.getDate() - k * 2 - int(0, 1));
    var age = (today - idt) / 864e5, r = rnd();
    invoices.push({ id: 2096 - k, company: COMPANIES[k % COMPANIES.length], date: idt, amount: pick([420, 860, 1240, 2150, 3900, 640, 1780, 96 * int(4, 30)]), status: age < 6 ? (r < 0.5 ? 'Due' : 'Paid') : age < 30 ? (r < 0.85 ? 'Paid' : 'Overdue') : (r < 0.95 ? 'Paid' : 'Overdue') });
  }

  var threads = [
    { id: 1, who: 'Jonah Petit', subject: 'Pricing page refresh', unread: true, time: '09:12', msgs: [['Jonah Petit', 'Morning! The comparison table is ready for a look.', '09:02'], ['Jonah Petit', 'Can we move the pricing review to Thursday? Growth wants to join.', '09:12']] },
    { id: 2, who: 'Northwind · Ida', subject: 'Seat upgrade before renewal', unread: true, time: '08:40', msgs: [['Northwind · Ida', 'Hi! We need 40 more seats before our renewal on 1 May. Can you send a quote?', '08:40']] },
    { id: 3, who: 'Billing', icon: 'bell', tint: 'butter', subject: 'Card ending 4417 expires this month', unread: false, time: 'Yesterday', msgs: [['Billing', 'Your default card ending 4417 expires on 30 April. Add a new card to avoid failed payments.', 'Yesterday']] },
    { id: 4, who: 'Sun Lee', subject: 'Payout file for March', unread: false, time: 'Yesterday', msgs: [['Sun Lee', 'Payout file for March is attached. 57 partners, all verified.', 'Yesterday'], ['Mara Ellis', 'Thanks! I will approve it this afternoon.', 'Yesterday']] },
    { id: 5, who: 'Blue Fern · Leo', subject: 'Export works now', unread: false, time: 'Mon', msgs: [['Blue Fern · Leo', 'Thanks, the export works now! Saved us a whole afternoon.', 'Mon']] },
    { id: 6, who: 'Incident #88', icon: 'flag', tint: 'blush', subject: 'Webhooks delayed in EU region', unread: false, time: 'Sun', msgs: [['Incident #88', 'Webhook delivery in the EU region was delayed by up to 14 minutes between 02:10 and 03:05. Resolved.', 'Sun']] }];

  var TASKS = [
    { id: 1, col: 'todo', title: 'Write FAQ for annual plans', tag: 'Copy', who: ['Ava Brandt'] }, { id: 2, col: 'todo', title: 'Localise tiers for DE and FR', tag: 'i18n', tone: 'info', who: ['Sun Lee', 'Ida Nolan'] }, { id: 3, col: 'todo', title: 'Plan migration emails', tag: 'Email', who: ['Rui Costa'] },
    { id: 4, col: 'doing', title: 'Comparison table component', tag: 'Focus', tone: 'highlight', who: ['Jonah Petit', 'Mara Ellis'], featured: true }, { id: 5, col: 'doing', title: 'Checkout seat selector', tag: 'Blocked', tone: 'warning', who: ['Rui Costa'] },
    { id: 6, col: 'review', title: 'Billing settings flow', tag: 'Review', tone: 'highlight', who: ['Mara Ellis', 'Sun Lee'] }, { id: 7, col: 'review', title: 'Empty states for reports', tag: 'Changes', tone: 'warning', who: ['Jonah Petit'] },
    { id: 8, col: 'done', title: 'Pricing research recap', tag: 'Done', tone: 'success', who: ['Sun Lee'] }, { id: 9, col: 'done', title: 'New tier names', tag: 'Done', tone: 'success', who: ['Mara Ellis'] }];
  var COLS = [['todo', 'To do', 'sky'], ['doing', 'In progress', 'butter'], ['review', 'In review', 'lilac'], ['done', 'Done', 'mint']];

  var EVENTS = [
    { d: 0, s: 9, e: 10, t: 'Standup', tint: 'sky', who: 'Team' }, { d: 0, s: 13, e: 14.5, t: 'Hiring panel', tint: 'lilac', who: 'Design' },
    { d: 1, s: 10.5, e: 12, t: 'Team sync', tint: 'sky', who: 'Growth + Design' }, { d: 1, s: 15, e: 16, t: 'Partner call', tint: 'mint', who: 'Northwind' },
    { d: 2, s: 9, e: 10, t: 'Standup', tint: 'sky', who: 'Team' }, { d: 2, s: 14, e: 15.5, t: 'Design review', tint: 'lilac', who: 'Billing flow' },
    { d: 3, s: 11, e: 12.5, t: 'Pricing review', tint: 'butter', who: 'Moved from Wed' }, { d: 3, s: 16, e: 17, t: 'Incident retro', tint: 'blush', who: 'Webhooks #88' },
    { d: 4, s: 9, e: 10, t: 'Standup', tint: 'sky', who: 'Team' }, { d: 4, s: 15.5, e: 17, t: 'Q2 invoices due', tint: 'butter', who: 'Finance' }];

  /* ───────── helpers ───────── */
  function money(n) { return '€' + Math.round(n).toLocaleString('en-US'); }
  function fmtDate(d) { return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear(); }
  function ago(min) { if (min < 2) return 'Now'; if (min < 60) return min + ' min ago'; if (min < 1440) return Math.round(min / 60) + ' h ago'; var dd = Math.round(min / 1440); return dd === 1 ? 'Yesterday' : dd + ' days ago'; }
  var TONE = { Live: 'success', Active: 'success', Paid: 'success', Draft: 'neutral', Review: 'highlight', Archived: 'neutral', Away: 'warning', Invited: 'info', Suspended: 'danger', Due: 'info', Overdue: 'danger' };
  function sum(a, f) { return a.reduce(function (s, x) { return s + f(x); }, 0); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem('halo-demo-' + k)); localStorage.setItem('halo-demo-' + k, JSON.stringify(v)); } catch (e) { return null; } }

  var VIEWS = [['Home', 'home', 'overview'], ['People', 'users', 'people'], ['Projects', 'grid', 'board'], ['Inbox', 'mail', 'inbox'], ['Calendar', 'calendar', 'calendar'], ['Billing', 'card', 'billing'], ['Reports', 'chart', 'reports'], ['Account', 'settings', 'account']];
  var NAV = VIEWS.map(function (v) { return { label: v[0], icon: v[1] }; });

  function Section(p) { return h('div', { className: 'ha-in', style: { '--d': (p.d || 0) + 'ms', minWidth: 0 } }, p.children); }
  function Scroll(p) { return h('div', { className: 'demo-scroll' }, p.children); }

  /* ───────── Overview ───────── */
  function Overview(p) {
    var f = useState('All'), list = p.projects.filter(function (x) { return (f[0] === 'All' || x.status === f[0]) && (!p.q || (x.title + x.desc + x.owner).toLowerCase().indexOf(p.q.toLowerCase()) > -1); });
    var rev = sum(days.slice(-16), function (d) { return d.revenue; });
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Good morning, Mara', subtitle: 'Everything that needs a decision today · Thu, 16 April', actions: [h(H.SearchField, { key: 's', placeholder: 'Search projects', value: p.q, onChange: function (e) { p.setQ(e.target.value); } })] })),
      h(H.Stagger, { className: 'ha-grid demo-4', delay: 80 },
        h(H.StatTile, { tint: 'sky', value: String(p.projects.length), label: 'All projects' }),
        h(H.StatTile, { tint: 'mint', value: String(p.projects.filter(function (x) { return x.status === 'Live'; }).length), label: 'Live' }),
        h(H.StatTile, { tint: 'placeholder', value: String(p.projects.filter(function (x) { return x.status === 'Review'; }).length), label: 'Needs review' }),
        h(H.StatTile, { tint: 'butter', value: money(rev), label: 'Revenue (MTD)' })),
      h(Section, { d: 260 }, h('div', { className: 'demo-bar' },
        h('div', { className: 'ha-row' }, ['All', 'Live', 'Review', 'Draft', 'Archived'].map(function (t) { return h(H.Chip, { key: t, selected: f[0] === t, count: t === 'All' ? null : p.projects.filter(function (x) { return x.status === t; }).length, onClick: function () { f[1](t); } }, t); })),
        h(H.Button, { icon: 'plus', onClick: p.onNew }, 'New project'))),
      list.length ? h(H.Stagger, { key: f[0], className: 'ha-grid demo-3', delay: 300 }, list.map(function (x) {
        var acts = x.status === 'Review' ? [h(H.IconButton, { key: 1, icon: 'x', label: 'Send back to draft', size: 'sm', onClick: function (e) { e.stopPropagation(); p.setStatus(x, 'Draft'); } }), h(H.IconButton, { key: 2, icon: 'check', label: 'Approve and publish', size: 'sm', variant: 'solid', onClick: function (e) { e.stopPropagation(); p.setStatus(x, 'Live'); } })]
          : x.status === 'Draft' ? [h(H.Button, { key: 1, size: 'sm', variant: 'soft', onClick: function (e) { e.stopPropagation(); p.setStatus(x, 'Review'); } }, 'Submit')]
          : x.status === 'Live' ? [h(H.IconButton, { key: 1, icon: 'folder', label: 'Archive', size: 'sm', onClick: function (e) { e.stopPropagation(); p.setStatus(x, 'Archived'); } })]
          : [h(H.Button, { key: 1, size: 'sm', variant: 'soft', onClick: function (e) { e.stopPropagation(); p.setStatus(x, 'Draft'); } }, 'Restore')];
        return h(H.Card, { key: x.id, tint: x.status === 'Review' ? 'lilac' : null, onClick: function () { p.open(x); }, title: x.title, description: x.desc, meta: [x.owner, x.steps + ' steps', x.users + ' users'], corner: h(H.TintIcon, { icon: x.icon, tint: x.tint }), status: h(H.Badge, { tone: TONE[x.status] }, x.status), actions: acts });
      })) : h(H.EmptyState, { title: 'No projects match', text: p.q ? 'Nothing matches "' + p.q + '". Try another word or clear the search.' : 'There are no projects with this status yet.', icon: 'search', tint: 'sky', action: h(H.Button, { variant: 'soft', onClick: function () { f[1]('All'); p.setQ(''); } }, 'Show all projects') }));
  }

  /* ───────── Reports ───────── */
  function Kpi(p) {
    return h('div', { className: 'ha-card', style: { minHeight: 0, gap: 4 } },
      h('div', { className: 'ha-row', style: { justifyContent: 'space-between' } }, h('span', { className: 'ha-card-desc' }, p.label), h(H.TintIcon, { icon: p.icon, tint: p.tint })),
      h('div', { className: 'ha-row', style: { justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'nowrap' } },
        h('div', { style: { minWidth: 0 } }, h(H.CountUp, { className: 'ha-stat-value demo-kpi-val', value: p.value }), h('div', { style: { font: '600 12px/16px var(--font-sans)', color: 'var(--' + (p.good ? 'mint' : 'blush') + '-ink)', marginTop: 4 } }, p.delta)),
        h('div', { style: { flex: '0 1 80px', minWidth: 48 } }, h(H.Sparkline, { values: p.spark, tint: p.good ? 'mint' : 'blush', width: 80, height: 32 }))));
  }
  function Reports() {
    var r = useState(store('range') || '30 days'), n = { '7 days': 7, '30 days': 30, '90 days': 90 }[r[0]] || 30;
    var cur = days.slice(-n), prev = days.slice(-2 * n, -n);
    function pct(a, b) { var v = (a - b) / (b || 1) * 100; return (v >= 0 ? '+' : '') + v.toFixed(1) + '% vs previous'; }
    var rev = sum(cur, function (d) { return d.revenue; }), prevRev = sum(prev, function (d) { return d.revenue; });
    var su = sum(cur, function (d) { return d.signups; }), prevSu = sum(prev, function (d) { return d.signups; });
    var vis = sum(cur, function (d) { return d.visits; }), conv = su / vis * 100, prevConv = prevSu / sum(prev, function (d) { return d.visits; }) * 100;
    var ch = sum(cur, function (d) { return d.churn; }), prevCh = sum(prev, function (d) { return d.churn; });
    var buckets = n === 7 ? cur.map(function (d) { return [['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.date.getDay()], [d]]; }) : (function () { var size = n === 30 ? 5 : 15, out = []; for (var i = 0; i < cur.length; i += size) { var g = cur.slice(i, i + size); out.push([g[0].date.getDate() + '.' + (g[0].date.getMonth() + 1), g]); } return out; })();
    var peak = Math.max.apply(null, buckets.map(function (b) { return sum(b[1], function (d) { return d.signups; }); }));
    var weeklySpark = function (key) { var out = []; for (var i = 0; i < cur.length; i += Math.max(1, Math.floor(n / 8))) out.push(sum(cur.slice(i, i + Math.max(1, Math.floor(n / 8))), function (d) { return d[key]; })); return out; };
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Reports', subtitle: 'Demo data · last ' + n + ' days compared with the ' + n + ' before', actions: [h(H.Segmented, { key: 't', label: 'Range', options: ['7 days', '30 days', '90 days'], value: r[0], onChange: function (v) { r[1](v); store('range', v); } })] })),
      h(H.Stagger, { className: 'ha-grid demo-4', delay: 80 },
        h(Kpi, { label: 'Revenue', value: money(rev), delta: pct(rev, prevRev), good: rev >= prevRev, icon: 'card', tint: 'butter', spark: weeklySpark('revenue') }),
        h(Kpi, { label: 'Sign-ups', value: su.toLocaleString('en-US'), delta: pct(su, prevSu), good: su >= prevSu, icon: 'users', tint: 'sky', spark: weeklySpark('signups') }),
        h(Kpi, { label: 'Conversion', value: conv.toFixed(1) + '%', delta: (conv - prevConv >= 0 ? '+' : '') + (conv - prevConv).toFixed(2) + ' pts', good: conv >= prevConv, icon: 'trend', tint: 'mint', spark: weeklySpark('signups') }),
        h(Kpi, { label: 'Cancellations', value: String(ch), delta: pct(ch, prevCh), good: ch <= prevCh, icon: 'flag', tint: 'blush', spark: weeklySpark('churn') })),
      h(H.Stagger, { key: 'a' + r[0], className: 'ha-grid demo-21', delay: 120 },
        h(H.Panel, { title: 'Revenue per day', subtitle: 'Weekdays carry the business; Sundays dip' },
          h(H.LineChart, { height: 180, labels: buckets.map(function (b) { return b[0]; }), format: function (v) { return '€' + (v / 1000).toFixed(1) + 'k'; }, series: [{ values: buckets.map(function (b) { return Math.round(sum(b[1], function (d) { return d.revenue; }) / b[1].length); }), tint: 'mint', area: true }] })),
        h(H.Panel, { title: 'Plan mix', subtitle: '1,284 paying members' },
          h(H.Donut, { size: 140, stroke: 18, center: '1,284', caption: 'members', data: [{ label: 'Team', value: 54, tint: 'sky' }, { label: 'Starter', value: 26, tint: 'mint' }, { label: 'Business', value: 14, tint: 'lilac' }, { label: 'Trial', value: 6, tint: 'butter' }] }))),
      h(H.Stagger, { key: 'b' + r[0], className: 'ha-grid demo-12', delay: 220 },
        h(H.Panel, { title: 'Sign-ups', subtitle: 'The busiest ' + (n === 7 ? 'day' : 'period') + ' is highlighted' },
          h(H.BarChart, { height: 150, data: buckets.map(function (b) { var v = sum(b[1], function (d) { return d.signups; }); return { label: b[0], value: v, tint: v === peak ? 'lilac' : null }; }) })),
        h(H.Panel, { title: 'Top channels' }, h(Scroll, null,
          h(H.Table, { columns: [
            { key: 'ch', label: 'Channel', render: function (x) { return h('span', { className: 'ha-row', style: { flexWrap: 'nowrap' } }, h(H.TintIcon, { icon: x.icon, tint: x.tint }), x.ch); } },
            { key: 'v', label: 'Visits', align: 'right', render: function (x) { return Math.round(vis * x.share).toLocaleString('en-US'); } },
            { key: 'c', label: 'Conv.', align: 'right' },
            { key: 't', label: 'Trend', align: 'right', render: function (x) { return h(H.Sparkline, { values: x.s, tint: x.up ? 'mint' : 'blush', width: 64, height: 22 }); } }],
            rows: [{ ch: 'Organic search', icon: 'search', tint: 'sky', share: 0.44, c: '5.2%', s: [3, 4, 4, 5, 6, 6, 7], up: true }, { ch: 'Newsletter', icon: 'mail', tint: 'butter', share: 0.19, c: '7.9%', s: [2, 2, 3, 5, 4, 6, 7], up: true }, { ch: 'Partners', icon: 'users', tint: 'mint', share: 0.14, c: '6.1%', s: [5, 5, 4, 5, 6, 6, 6], up: true }, { ch: 'Paid social', icon: 'globe', tint: 'blush', share: 0.13, c: '2.3%', s: [6, 5, 5, 4, 4, 3, 3], up: false }] }))))      ,
      h(H.Stagger, { key: 'c' + r[0], className: 'ha-grid demo-21', delay: 300 },
        h(H.Panel, { title: 'Revenue by plan', subtitle: 'Stacked per ' + (n === 7 ? 'day' : 'period') + ' · hover for the split' },
          h(H.StackedBarChart, { height: 180, labels: buckets.map(function (b) { return b[0]; }), format: function (v) { return '€' + (v / 1000).toFixed(1) + 'k'; },
            series: [['Starter', 'sky', 0.18], ['Team', 'mint', 0.52], ['Business', 'lilac', 0.30]].map(function (s) { return { name: s[0], tint: s[1], values: buckets.map(function (b, i) { return Math.round(sum(b[1], function (d) { return d.revenue; }) * (s[2] + ((i * 7 + s[0].length) % 5 - 2) / 100)); }) }; }) })),
        h(H.Panel, { title: 'Monthly goal', subtitle: 'Revenue against the ' + money(75000) + ' target' },
          h('div', { style: { display: 'grid', placeItems: 'center', paddingTop: 8 } }, h(H.Gauge, { value: Math.min(75000, Math.round(rev / n * 30)), max: 75000, size: 220, caption: Math.round(Math.min(1, rev / n * 30 / 75000) * 100) + '% of target', format: function (v) { return '€' + Math.round(v / 1000) + 'k'; }, tint: 'mint' })))),
      h(H.Stagger, { key: 'd' + r[0], className: 'ha-grid demo-12', delay: 380 },
        h(H.Panel, { title: 'Trial to paid', subtitle: 'Where people drop off this period' },
          h(H.Funnel, { steps: [{ label: 'Visited pricing', value: Math.round(su * 5.4) }, { label: 'Started trial', value: Math.round(su * 2.6) }, { label: 'Invited a teammate', value: Math.round(su * 1.6) }, { label: 'Became paying', value: su }] })),
        h(H.Panel, { title: 'Visitors by channel', subtitle: 'Stacked, per ' + (n === 7 ? 'day' : 'period') },
          h(H.AreaChart, { height: 180, labels: buckets.map(function (b) { return b[0]; }), format: function (v) { return (v / 1000).toFixed(1) + 'k'; },
            series: [['Organic', 'sky', 0.44], ['Newsletter', 'butter', 0.19], ['Partners', 'mint', 0.14]].map(function (s) { return { name: s[0], tint: s[1], values: buckets.map(function (b) { return Math.round(sum(b[1], function (d) { return d.visits; }) / b[1].length * s[2]); }) }; }) }))),
      h(Section, { d: 460 }, h(H.Panel, { title: 'When people sign up', subtitle: 'Sign-ups by weekday and hour, all time' },
        h(H.Heatmap, { rows: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], cols: Array.from({ length: 24 }, function (_, i) { return (i < 10 ? '0' : '') + i; }), colEvery: 3, caption: 'Hover a cell for the count', format: function (v) { return v + ' sign-ups'; },
          values: [0, 1, 2, 3, 4, 5, 6].map(function (d) { return Array.from({ length: 24 }, function (_, hr) { var work = d < 5 ? 1 : 0.35, curve = Math.exp(-Math.pow((hr - 11) / 3.2, 2)) + 0.7 * Math.exp(-Math.pow((hr - 16) / 2.6, 2)); return Math.round(48 * work * curve + ((d * 31 + hr * 17) % 7)); }); }) }))));
  }

  /* ───────── People ───────── */
  function People(p) {
    var q = useState(''), flt = useState({}), confirm = useState(null);
    var f = flt[0];
    var list = p.members.filter(function (m) { return (!f.Role || m.role === f.Role) && (!f.Team || m.team === f.Team) && (!f.Status || m.status === f.Status) && (!q[0] || (m.name + m.email + m.team).toLowerCase().indexOf(q[0].toLowerCase()) > -1); });
    var teams = {}; p.members.forEach(function (m) { teams[m.team] = (teams[m.team] || 0) + 1; });
    var TT = { Design: 'lilac', Growth: 'mint', Support: 'sky', Finance: 'butter', Sales: 'blush', Engineering: 'ink', Leadership: 'ink' };
    function roleAll(rows, role, clear) { var ids = rows.filter(function (m) { return m.role !== 'Owner'; }).map(function (m) { return m.id; }), before = p.members; p.setAll(function (a) { return a.map(function (y) { return ids.indexOf(y.id) >= 0 ? Object.assign({}, y, { role: role }) : y; }); }, ids.length + (ids.length === 1 ? ' person is' : ' people are') + ' now ' + role, function () { p.setAll(function () { return before; }); }); clear(); }
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'People', subtitle: p.members.length + ' people with access · demo data', actions: [h(H.Button, { key: 'b', icon: 'users', onClick: p.onInvite }, 'Invite')] })),
      h(H.Stagger, { className: 'ha-grid demo-4', delay: 80 },
        h(H.StatTile, { tint: 'sky', value: String(p.members.length), label: 'Members' }), h(H.StatTile, { tint: 'mint', value: String(p.members.filter(function (m) { return m.status === 'Active'; }).length), label: 'Active' }),
        h(H.StatTile, { tint: 'placeholder', value: String(p.members.filter(function (m) { return m.status === 'Invited'; }).length), label: 'Pending invites' }), h(H.StatTile, { tint: 'lilac', value: String(p.members.filter(function (m) { return m.role === 'Admin' || m.role === 'Owner'; }).length), label: 'Admins' })),
      h(Section, { d: 240 }, h(H.FilterBar, { search: 'Search name, email or team', query: q[0], onQuery: q[1], value: f, onChange: flt[1], filters: [
        { key: 'Role', label: 'Role', icon: 'key', options: ['Owner', 'Admin', 'Editor', 'Viewer'] },
        { key: 'Team', label: 'Team', icon: 'users', options: Object.keys(teams).sort() },
        { key: 'Status', label: 'Status', icon: 'flag', options: ['Active', 'Invited', 'Away', 'Suspended'] }] })),
      h('div', { className: 'demo-split' },
        h(Section, { d: 300 }, h('div', { className: 'ha-panel ha-panel-flush' },
          h(H.DataTable, { rows: list, selectable: true, stickyHeader: true, maxHeight: 640, defaultSort: { key: 'name', dir: 'asc' },
            toolbar: h('span', { className: 'ha-card-desc' }, list.length === p.members.length ? 'Everyone · ' + list.length : list.length + ' of ' + p.members.length + ' shown'),
            empty: h('span', null, 'Nobody matches. ', h('button', { type: 'button', className: 'ha-linkbtn', onClick: function () { flt[1]({}); q[1](''); } }, 'Clear filters')),
            bulkActions: [
              { label: 'Make editor', icon: 'edit', onClick: function (rows, clear) { roleAll(rows, 'Editor', clear); } },
              { label: 'Make viewer', icon: 'eye', onClick: function (rows, clear) { roleAll(rows, 'Viewer', clear); } },
              { label: 'Remove', icon: 'trash', danger: true, onClick: function (rows, clear) { confirm[1]({ rows: rows.filter(function (m) { return m.role !== 'Owner'; }), clear: clear }); } }],
            renderExpanded: function (m) { return h('div', { className: 'demo-member-detail' },
              h('div', null, h('span', null, 'Email'), h('b', null, m.email)), h('div', null, h('span', null, 'Team'), h('b', null, m.team)),
              h('div', null, h('span', null, 'Last active'), h('b', null, ago(m.last))), h('div', null, h('span', null, 'Can'), h('b', null, m.role === 'Viewer' ? 'View projects and reports' : m.role === 'Editor' ? 'Edit projects, files and mail' : 'Everything, incl. billing and roles'))); },
            columns: [
              { key: 'name', label: 'Name', sortable: true, hideable: false, render: function (m) { return h('span', { className: 'ha-row', style: { flexWrap: 'nowrap' } }, h(H.Avatar, { name: m.name, size: 32 }), h('span', null, h('div', { style: { fontWeight: 700 } }, m.name), h('div', { style: { fontSize: 12, color: 'var(--ink-muted)' } }, m.email))); } },
              { key: 'role', label: 'Role', sortable: true, render: function (m) { return m.role === 'Owner' ? 'Owner' : h('select', { className: 'demo-inline-select', 'aria-label': 'Role for ' + m.name, value: m.role, onChange: function (e) { p.update(m, { role: e.target.value }, m.name + ' is now ' + e.target.value); } }, ['Admin', 'Editor', 'Viewer'].map(function (o) { return h('option', { key: o }, o); })); } },
              { key: 'team', label: 'Team', sortable: true },
              { key: 'status', label: 'Status', sortable: true, render: function (m) { return h(H.Badge, { tone: TONE[m.status] }, m.status); } },
              { key: 'last', label: 'Last active', sortable: true, sortValue: function (m) { return -(+new Date(m.last)); }, render: function (m) { return ago(m.last); } }] }))),
        h(H.Panel, { side: true, title: 'Teams', subtitle: Object.keys(teams).length + ' teams' },
          h(H.Donut, { size: 120, stroke: 16, legend: false, center: String(p.members.length), caption: 'people', data: Object.keys(teams).map(function (t) { return { label: t, value: teams[t], tint: TT[t] }; }) }),
          h('div', { className: 'ha-col', style: { gap: 8 } }, Object.keys(teams).sort(function (a, b) { return teams[b] - teams[a]; }).map(function (t) { return h('button', { key: t, type: 'button', className: 'ha-legend demo-legend-btn', 'aria-pressed': f.Team === t, onClick: function () { var n = Object.assign({}, f); if (n.Team === t) delete n.Team; else n.Team = t; flt[1](n); }, style: { justifyContent: 'space-between' } }, h('span', null, h('i', { style: { background: 'var(--' + TT[t] + (TT[t] === 'ink' ? '' : '-ink') + ')' } }), t), h('b', { style: { color: 'var(--ink)' } }, teams[t])); })))),
      h(H.ConfirmDialog, { open: !!confirm[0], danger: true, title: confirm[0] ? 'Remove ' + confirm[0].rows.length + (confirm[0].rows.length === 1 ? ' person?' : ' people?') : '', text: 'They lose access right away. Their projects and files stay in the workspace.', confirmLabel: 'Remove', onCancel: function () { confirm[1](null); },
        onConfirm: function () { var c = confirm[0], ids = c.rows.map(function (m) { return m.id; }), before = p.members; confirm[1](null); c.clear(); p.setAll(function (a) { return a.filter(function (y) { return ids.indexOf(y.id) < 0; }); }, ids.length + (ids.length === 1 ? ' person' : ' people') + ' removed', function () { p.setAll(function () { return before; }); }, 'blush', 'trash'); } }));
  }

  /* ───────── Billing ───────── */
  function Billing(p) {
    var f = useState('All'), list = p.invoices.filter(function (x) { return f[0] === 'All' || x.status === f[0]; });
    var paid = sum(p.invoices.filter(function (x) { return x.status === 'Paid' && (today - x.date) / 864e5 <= 30; }), function (x) { return x.amount; });
    var open = sum(p.invoices.filter(function (x) { return x.status !== 'Paid'; }), function (x) { return x.amount; });
    var over = p.invoices.filter(function (x) { return x.status === 'Overdue'; });
    var months = []; for (var m = 5; m >= 0; m--) { var md = new Date(2026, 3 - m, 1); months.push({ label: md.toLocaleString('en-US', { month: 'short' }), value: Math.round(sum(days.filter(function (d) { return d.date.getMonth() === md.getMonth(); }), function (d) { return d.revenue; }) || (24000 + m * -1800)) }); }
    months[5].tint = 'butter';
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Billing', subtitle: 'Invoices, net amounts · demo data', actions: [h(H.Button, { key: 'n', icon: 'plus', onClick: p.onInvoice }, 'New invoice')] })),
      h(H.Stagger, { className: 'ha-grid demo-4', delay: 80 },
        h(H.StatTile, { tint: 'butter', value: money(paid), label: 'Collected (30 days)' }), h(H.StatTile, { tint: 'sky', value: money(open), label: 'Outstanding' }),
        h(H.StatTile, { tint: over.length ? 'blush' : 'mint', value: String(over.length), label: 'Overdue invoices' }), h(H.StatTile, { tint: 'mint', value: (100 - over.length / p.invoices.length * 100).toFixed(1) + '%', label: 'On-time rate' })),
      h('div', { className: 'demo-split' },
        h(Section, { d: 300 }, h('div', { className: 'ha-panel ha-panel-flush' },
          h('div', { className: 'ha-row', style: { padding: '8px 16px 0' } }, ['All', 'Due', 'Overdue', 'Paid'].map(function (t) { return h(H.Chip, { key: t, selected: f[0] === t, count: t === 'All' ? null : p.invoices.filter(function (x) { return x.status === t; }).length, onClick: function () { f[1](t); } }, t); })),
          h(Scroll, null, h(H.Table, { key: f[0], columns: [{ key: 'id', label: 'Invoice', render: function (x) { return '#' + x.id; } }, { key: 'company', label: 'Customer', render: function (x) { return h('span', { className: 'ha-row', style: { flexWrap: 'nowrap' } }, h(H.Avatar, { name: x.company, size: 26 }), x.company); } }, { key: 'date', label: 'Issued', render: function (x) { return fmtDate(x.date); } }, { key: 'status', label: 'Status', render: function (x) { return h(H.Badge, { tone: TONE[x.status] }, x.status); } }, { key: 'amount', label: 'Net', align: 'right', render: function (x) { return eur(x.amount, true); } }, { key: 'x', label: '', align: 'right', render: function (x) { return x.status === 'Paid' ? h('span', { className: 'ha-card-desc' }, '—') : h(H.Button, { size: 'sm', variant: 'soft', onClick: function () { p.markPaid(x); } }, 'Mark paid'); } }], rows: list.slice(0, 12) })),
          list.length > 12 && h('p', { className: 'ha-card-desc', style: { padding: '0 16px 8px' } }, 'Showing the 12 newest of ' + list.length + '.'))),
        h(H.Panel, { side: true, title: 'Collected per month' },
          h(H.BarChart, { height: 120, barWidth: 20, format: function (v) { return '€' + Math.round(v / 1000) + 'k'; }, data: months }),
          h('div', { className: 'ha-card', style: { minHeight: 0, background: 'var(--frame)', color: 'var(--on-frame)', boxShadow: 'none' } },
            h('div', { className: 'ha-row', style: { justifyContent: 'space-between' } }, h('span', { style: { font: '600 12px/16px var(--font-sans)', color: 'var(--on-frame-muted)' } }, 'Card on file (example)'), h(H.Icon, { name: 'card', size: 20 })),
            h('div', { style: { font: '700 18px/24px var(--font-sans)', letterSpacing: '.08em' } }, '•••• 4417'),
            h('div', { className: 'ha-row', style: { justifyContent: 'space-between', color: 'var(--on-frame-muted)', fontSize: 13 } }, h('span', null, 'Mara Ellis'), h('span', null, 'Expires 04/26'))),
          h('div', null, h('div', { className: 'ha-row', style: { justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 8 } }, h('span', null, 'Seats used'), h('span', null, '38 / 42')), h(H.Progress, { value: 90, tint: 'butter', label: 'Seats used' })))));
  }

  /* ───────── Board ───────── */
  function Board(p) {
    var drag = useState(null);
    function move(t, dir) { var i = COLS.map(function (c) { return c[0]; }).indexOf(t.col) + dir; if (i < 0 || i >= COLS.length) return; p.moveTask(t, COLS[i][0]); }
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { crumbs: ['Projects', 'Pricing page refresh'], title: 'Sprint board', subtitle: p.tasks.length + ' tasks · drag cards or use the arrows', actions: [h(H.Button, { key: 'n', icon: 'plus', onClick: function () { p.onTask('todo'); } }, 'New task')] })),
      h('div', { className: 'demo-board' }, COLS.map(function (c, ci) {
        var items = p.tasks.filter(function (t) { return t.col === c[0]; });
        return h('div', { key: c[0], className: 'demo-col' + (drag[0] && drag[0].over === c[0] ? ' over' : ''), onDragOver: function (e) { e.preventDefault(); if (drag[0] && drag[0].over !== c[0]) drag[1]({ id: drag[0].id, over: c[0] }); }, onDrop: function (e) { e.preventDefault(); var t = p.tasks.filter(function (x) { return x.id === (drag[0] && drag[0].id); })[0]; if (t && t.col !== c[0]) p.moveTask(t, c[0]); drag[1](null); } },
          h(H.KanbanColumn, { title: c[1], dot: c[2], delay: 120 + ci * 90, onAdd: function () { p.onTask(c[0]); } }, items.map(function (t) {
            return h('div', { key: t.id, draggable: true, onDragStart: function () { drag[1]({ id: t.id, over: null }); }, onDragEnd: function () { drag[1](null); }, style: { cursor: 'grab' } },
              h(H.Card, { tint: t.featured ? 'lilac' : null, title: t.title, status: h(H.Badge, { tone: t.tone || 'neutral' }, t.tag), actions: [h(H.AvatarStack, { key: 'a', names: t.who, size: 22 }), h(H.IconButton, { key: 'l', icon: 'chevronLeft', label: 'Move to ' + (ci > 0 ? COLS[ci - 1][1] : ''), size: 'sm', disabled: ci === 0, onClick: function () { move(t, -1); } }), h(H.IconButton, { key: 'r', icon: 'chevronRight', label: 'Move to ' + (ci < COLS.length - 1 ? COLS[ci + 1][1] : ''), size: 'sm', disabled: ci === COLS.length - 1, onClick: function () { move(t, 1); } })] }));
          })));
      })));
  }

  /* ───────── Calendar ───────── */
  function Calendar(p) {
    var wk = useState(0), START = 8, END = 18, ROW = 46, base = new Date(2026, 3, 13 + wk[0] * 7), hours = [];
    for (var i = START; i < END; i++) hours.push(i);
    var dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(function (n, i) { var d = new Date(base); d.setDate(base.getDate() + i); return { label: n + ' ' + d.getDate(), today: wk[0] === 0 && i === 3 }; });
    var ev = wk[0] === 0 ? EVENTS : EVENTS.filter(function (e) { return e.t === 'Standup' || (wk[0] > 0 && e.t === 'Team sync'); });
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Calendar', subtitle: 'Week of ' + base.getDate() + ' ' + base.toLocaleString('en-US', { month: 'long' }) + ' · ' + ev.length + ' events', actions: [h('div', { key: 'n', className: 'ha-row', style: { gap: 4 } }, h(H.IconButton, { icon: 'chevronLeft', label: 'Previous week', onClick: function () { wk[1](wk[0] - 1); } }), h(H.Button, { variant: 'soft', onClick: function () { wk[1](0); } }, 'This week'), h(H.IconButton, { icon: 'chevronRight', label: 'Next week', onClick: function () { wk[1](wk[0] + 1); } }))] })),
      h(Section, { d: 120 }, h('div', { className: 'ha-panel', style: { padding: 16, gap: 0 } }, h(Scroll, null, h('div', { key: wk[0], style: { minWidth: 640 } },
        h('div', { className: 'demo-cal-row', style: { paddingBottom: 10 } }, h('span'), dayNames.map(function (d) { return h('div', { key: d.label, className: 'demo-cal-day' + (d.today ? ' today' : '') }, d.label); })),
        h('div', { className: 'demo-cal-row' },
          h('div', null, hours.map(function (hr) { return h('div', { key: hr, style: { height: ROW, font: '600 11px/1 var(--font-sans)', color: 'var(--ink-muted)', fontVariantNumeric: 'tabular-nums' } }, (hr < 10 ? '0' : '') + hr + ':00'); })),
          dayNames.map(function (d, di) {
            return h('div', { key: di, style: { position: 'relative', height: ROW * (END - START), backgroundImage: 'repeating-linear-gradient(to bottom, var(--line) 0 1px, transparent 1px ' + ROW + 'px)', borderRadius: 12 } },
              ev.filter(function (e) { return e.d === di; }).map(function (e, i) {
                return h('button', { key: i, type: 'button', className: 'ha-in demo-ev ha-bg-' + e.tint, onClick: function () { p.toast(e.t + ' · ' + d.label + ', ' + Math.floor(e.s) + ':' + (e.s % 1 ? '30' : '00')); }, style: { '--d': (160 + di * 60 + i * 50) + 'ms', top: (e.s - START) * ROW + 2, height: (e.e - e.s) * ROW - 4 } },
                  h('div', { style: { font: '700 12.5px/16px var(--font-sans)' } }, e.t), h('div', { style: { font: '500 11.5px/15px var(--font-sans)', opacity: .8 } }, e.who));
              }));
          })))))));
  }

  /* ───────── Account ───────── */
  var TZ = ['Europe/Berlin (UTC+1)', 'Europe/London (UTC+0)', 'Europe/Paris (UTC+1)', 'Asia/Dubai (UTC+4)', 'Asia/Singapore (UTC+8)', 'America/New_York (UTC−5)', 'America/Los_Angeles (UTC−8)', 'Australia/Sydney (UTC+11)'];
  function Account(p) {
    var prefs = p.prefs, name = useState('Mara Ellis'), email = useState('mara@halo.app'), touched = useState({}), tz = useState(prefs.tz || 'Europe/Berlin (UTC+1)'), skills = useState(prefs.skills || ['Leadership', 'Pricing', 'Hiring']);
    var otpOk = useState(!!prefs.twofa), otpErr = useState(false), otpKey = useState(0), ooo = useState(null), reset = useState(false), langs = useState(['English', 'German']);
    function setPref(k, v) { var n = Object.assign({}, prefs); n[k] = v; p.setPrefs(n); }
    var emailErr = !email[0] ? 'Email is required' : !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email[0]) ? 'That doesn’t look like an email address' : null, nameErr = name[0].trim().length < 2 ? 'Enter at least 2 characters' : null;
    function blur(k) { var n = Object.assign({}, touched[0]); n[k] = true; touched[1](n); }
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Account', subtitle: 'Your profile, security and how this demo looks' })),
      h(H.Stagger, { className: 'ha-col', style: { gap: 16, maxWidth: 820 }, delay: 100 },
        !otpOk[0] && h(H.Alert, { tone: 'warning', title: 'Two-step sign-in is off', action: h(H.Button, { size: 'sm', variant: 'secondary', onClick: function () { var el = document.getElementById('sec-2fa'); el && el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }, 'Turn on') }, 'Anyone with your password can sign in. It takes a minute to set up.'),
        h(H.Panel, { title: 'Appearance', subtitle: 'Saved in this browser only' },
          h(H.RadioGroup, { cards: true, value: prefs.theme, onChange: function (v) { setPref('theme', v); }, options: [{ value: 'System', label: 'System', hint: 'Follows your device' }, { value: 'Light', label: 'Light', hint: 'Bright sheet, dark frame' }, { value: 'Dark', label: 'Dark', hint: 'Easy on the eyes at night' }] }),
          h('div', { className: 'ha-row', style: { justifyContent: 'space-between' } }, h('span', { style: { fontWeight: 600 } }, 'Density'), h(H.Segmented, { label: 'Density', value: prefs.density || 'Comfortable', options: ['Comfortable', 'Compact'], onChange: function (v) { setPref('density', v); } }))),
        h(H.Panel, { title: 'Profile', subtitle: 'Fields check themselves when you leave them' },
          h('form', { className: 'demo-form', noValidate: true, onSubmit: function (e) { e.preventDefault(); touched[1]({ name: true, email: true }); if (emailErr || nameErr) { H.toast({ text: 'Check the highlighted fields', tone: 'danger' }); return; } setPref('tz', tz[0]); setPref('skills', skills[0]); p.toast('Profile saved'); } },
            h('div', { className: 'ha-row', style: { gap: 16 } }, h(H.Avatar, { name: name[0] || '?', size: 56 }), h('div', null, h('div', { style: { fontWeight: 700 } }, name[0] || 'Your name'), h('div', { className: 'ha-card-desc' }, 'Owner · Leadership'))),
            h('div', { className: 'ha-grid demo-2' },
              h(H.TextField, { label: 'Full name', required: true, value: name[0], onChange: function (e) { name[1](e.target.value); }, onBlur: function () { blur('name'); }, error: touched[0].name && nameErr, success: touched[0].name && !nameErr ? 'Looks good' : null, autoComplete: 'name' }),
              h(H.TextField, { label: 'Email', required: true, type: 'email', icon: 'mail', value: email[0], onChange: function (e) { email[1](e.target.value); }, onBlur: function () { blur('email'); }, error: touched[0].email && emailErr, hint: 'Used for sign-in and invoices', autoComplete: 'email' }),
              h(H.Combobox, { label: 'Time zone', options: TZ, value: tz[0], onChange: tz[1], placeholder: 'Search time zones' }),
              h(H.Combobox, { label: 'Languages', multiple: true, options: ['English', 'German', 'French', 'Spanish', 'Arabic', 'Italian', 'Dutch', 'Polish'], value: langs[0], onChange: langs[1], placeholder: 'Add a language' })),
            h(H.TagInput, { label: 'Skills', value: skills[0], onChange: skills[1], hint: 'Press Enter or comma to add. Teammates see these on your profile.' }),
            h('div', { className: 'ha-row', style: { justifyContent: 'flex-end' } }, h(H.Button, { type: 'submit', icon: 'check' }, 'Save profile')))),
        h(H.Panel, { title: 'Availability', subtitle: 'Agents and teammates plan around this' },
          h('div', { className: 'ha-grid demo-2' },
            h(H.DatePicker, { label: 'Out of office', range: true, value: ooo[0] || { from: null, to: null }, onChange: function (v) { ooo[1](v); if (v.from && v.to) p.toast('Out of office ' + v.from.toLocaleDateString('de-DE') + ' – ' + v.to.toLocaleDateString('de-DE')); }, today: new Date(2026, 3, 16), hint: 'Mail gets an automatic reply' }),
            h(H.NumberInput, { label: 'Focus blocks per week', value: prefs.focus != null ? prefs.focus : 4, min: 0, max: 10, onChange: function (v) { setPref('focus', v); }, hint: '2-hour blocks kept free of meetings' })),
          h(H.Slider, { label: 'Monthly agent budget', min: 0, max: 500, step: 10, value: prefs.budget != null ? prefs.budget : 120, onChange: function (v) { setPref('budget', v); }, format: function (v) { return '€' + v; }, hint: 'Agents pause and ask you once they reach it' })),
        h('div', { id: 'sec-2fa' }, h(H.Panel, { title: 'Two-step sign-in', subtitle: otpOk[0] ? 'On · codes come from your authenticator app' : 'Enter the 6-digit code from your authenticator app (demo code: 246810)' },
          otpOk[0] ? h('div', { className: 'ha-row', style: { justifyContent: 'space-between' } }, h(H.Badge, { tone: 'success' }, 'Protected'), h(H.Button, { variant: 'ghost', size: 'sm', onClick: function () { otpOk[1](false); setPref('twofa', false); otpKey[1](otpKey[0] + 1); p.toast('Two-step sign-in turned off'); } }, 'Turn off'))
            : h('div', { className: 'ha-col', style: { gap: 12 } }, h(H.OtpInput, { key: otpKey[0], error: otpErr[0], onComplete: function (c) { if (c === '246810') { otpOk[1](true); otpErr[1](false); setPref('twofa', true); H.toast({ text: 'Two-step sign-in is on', tone: 'success', icon: 'lock' }); } else { otpErr[1](true); setTimeout(function () { otpKey[1](function (k) { return k + 1; }); }, 420); } } }),
              otpErr[0] ? h('span', { className: 'ha-field-error' }, 'That code didn’t match. Try again.') : h('span', { className: 'ha-field-hint' }, 'Paste works too')))),
        h(H.Panel, { title: 'Notifications' },
          h('div', { className: 'ha-col', style: { gap: 16 } }, [['approvals', 'Approvals waiting on me'], ['invoices', 'Invoices paid or overdue'], ['digest', 'Weekly reports digest']].map(function (x) { return h(H.Switch, { key: x[0], spread: true, checked: !!prefs[x[0]], onChange: function (e) { setPref(x[0], e.target.checked); p.toast(x[1] + (e.target.checked ? ' on' : ' off')); } }, x[1]); }))),
        h(H.Alert, { tone: 'danger', icon: 'swap', title: 'Reset demo', action: h(H.Button, { variant: 'secondary', size: 'sm', icon: 'swap', onClick: function () { reset[1](true); } }, 'Reset demo') }, 'Puts every project, invoice, message and task back to the start.')),
      h(H.ConfirmDialog, { open: reset[0], danger: true, icon: 'swap', title: 'Reset the whole demo?', text: 'Everything you changed in this browser is replaced with the starting data. This can’t be undone.', confirmText: 'RESET', confirmLabel: 'Reset demo', onCancel: function () { reset[1](false); }, onConfirm: function () { reset[1](false); p.reset(); } }));
  }

  /* ───────── Side schedule (overview) ───────── */
  function Schedule(p) {
    var t = useState('Events');
    var waiting = p.projects.filter(function (x) { return x.status === 'Review'; });
    return h(H.Panel, { side: true, title: 'Today', subtitle: '3 events · ' + waiting.length + ' approvals' },
      h(H.Tabs, { block: true, items: ['Events', 'Approvals'], value: t[0], onChange: t[1] }),
      t[0] === 'Events' ? h(H.Stagger, { key: 'e', className: 'ha-col', delay: 200 },
        h(H.EventCard, { kind: 'review', label: 'Pricing review', date: 'Thu, 16.04', time: '11:00', tint: 'butter', icon: 'card', actions: false }, 'Moved from Wednesday so Growth can join.'),
        h(H.EventCard, { kind: 'incident', label: 'Incident retro', date: 'Thu, 16.04', time: '16:00', actions: false }, 'What delayed EU webhooks and how we stop it.'),
        h(H.EventCard, { kind: 'meeting', label: 'Team sync', date: 'Fri, 17.04', time: '10:30', actions: false }, 'Roadmap check-in with design and growth.'))
        : h(H.Stagger, { key: 'a', className: 'ha-list' }, waiting.length ? waiting.map(function (x) { return h(H.ListRow, { key: x.id, icon: x.icon, tint: x.tint, title: x.title, subtitle: x.owner, onClick: function () { p.open(x); }, trailing: h(H.Badge, { tone: 'highlight' }, 'Review') }); }) : h('p', { className: 'ha-card-desc' }, 'Nothing waiting. Nice.')));
  }

  /* ───────── Modals ───────── */
  var FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function useTrap(ref) {
    useEffect(function () {
      var root = ref.current, before = document.activeElement;
      if (!root) return;
      if (!root.contains(document.activeElement)) { var auto = root.querySelector('[autofocus], input:not([type="checkbox"]), textarea'); var first = auto || root.querySelector(FOCUSABLE); if (first && first.focus) first.focus(); }
      function k(e) { if (e.key !== 'Tab') return; var els = Array.prototype.filter.call(root.querySelectorAll(FOCUSABLE), function (x) { return x.offsetParent !== null; }); if (!els.length) return; var a = els[0], z = els[els.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
      root.addEventListener('keydown', k);
      return function () { root.removeEventListener('keydown', k); if (before && before.focus && document.contains(before)) before.focus(); };
    }, []);
  }
  function Overlay(p) {
    var ref = React.useRef(null); useTrap(ref);
    useEffect(function () { function k(e) { if (e.key === 'Escape') p.onClose(); } document.addEventListener('keydown', k); return function () { document.removeEventListener('keydown', k); }; }, []);
    return h('div', { ref: ref, className: 'demo-overlay', onMouseDown: function (e) { if (e.target === e.currentTarget || e.target.classList.contains('ha-backdrop')) p.onClose(); } }, p.children);
  }
  function FormModal(p) {
    return h(Overlay, { onClose: p.onClose }, h(H.Modal, { icon: p.icon, tint: p.tint, title: p.title, text: p.text, onClose: p.onClose },
      h('form', { className: 'demo-form', onSubmit: function (e) { e.preventDefault(); var fd = {}; Array.prototype.forEach.call(e.target.elements, function (el) { if (el.name) fd[el.name] = el.value; }); p.onSubmit(fd); } }, p.children,
        h('div', { className: 'ha-modal-foot' }, h(H.Button, { variant: 'ghost', onClick: p.onClose }, 'Cancel'), h(H.Button, { type: 'submit', icon: p.submitIcon || 'check' }, p.submit)))));
  }
  function Field(p) { return h('label', { className: 'ha-field' }, h('span', { className: 'ha-field-label' }, p.label), p.options ? h('select', { className: 'ha-input', name: p.name, id: 'f-' + p.name, defaultValue: p.value }, p.options.map(function (o) { return h('option', { key: o }, o); })) : h('input', { className: 'ha-input', name: p.name, id: 'f-' + p.name, required: p.required, type: p.type || 'text', placeholder: p.placeholder, defaultValue: p.value, min: p.min })); }
  function ProjectModal(p) {
    var x = p.project;
    return h(Overlay, { onClose: p.onClose }, h(H.Modal, { icon: x.icon, tint: x.tint, title: x.title, text: x.desc, onClose: p.onClose },
      h('div', { className: 'ha-row' }, h(H.Badge, { tone: TONE[x.status] }, x.status), h(H.Badge, { dot: false }, 'Owner: ' + x.owner)),
      h('div', { className: 'ha-row', style: { gap: 18, flexWrap: 'nowrap' } }, h(H.ProgressRing, { value: x.progress, size: 76, stroke: 8, tint: x.tint }), h('div', { className: 'ha-col', style: { gap: 4 } }, h('div', { style: { fontWeight: 700 } }, x.steps + ' steps · ' + x.users + ' users'), h('div', { className: 'ha-card-desc' }, x.progress + '% of the plan is done.'))),
      h('div', { className: 'ha-modal-foot' }, x.status === 'Review' && h(H.Button, { variant: 'ghost', onClick: function () { p.setStatus(x, 'Draft'); p.onClose(); } }, 'Send back'), x.status === 'Review' ? h(H.Button, { icon: 'check', onClick: function () { p.setStatus(x, 'Live'); p.onClose(); } }, 'Approve') : h(H.Button, { variant: 'soft', onClick: p.onClose }, 'Close'))));
  }

  /* ───────── More demo data: agents, code, domains, mail ───────── */
  var AGENTS = [
    { id: 'atlas', name: 'Atlas', role: 'Support triage', model: 'Claude Sonnet 5.5', status: 'Running', tint: 'sky', tasks: 142, success: 97.2, cost: 18.4, tools: ['Mailbox', 'Knowledge base', 'Ticket labels'], desc: 'Reads new support mail, tags it and drafts replies for a human to approve.', autonomy: 'Drafts only' },
    { id: 'ledger', name: 'Ledger', role: 'Invoice reconciliation', model: 'Claude Haiku 5.5', status: 'Running', tint: 'butter', tasks: 64, success: 99.1, cost: 3.9, tools: ['Billing', 'Bank feed', 'Spreadsheets'], desc: 'Matches payments to invoices every hour and flags anything that does not add up.', autonomy: 'Acts, then reports' },
    { id: 'patch', name: 'Patch', role: 'Code review', model: 'Claude Opus 5.5', status: 'Running', tint: 'lilac', tasks: 23, success: 91.3, cost: 26.7, tools: ['Repositories', 'Deployments', 'Logs'], desc: 'Reviews pull requests, runs checks and comments with suggested fixes.', autonomy: 'Comments only' },
    { id: 'nova', name: 'Nova', role: 'Lead research', model: 'Claude Sonnet 5.5', status: 'Needs review', tint: 'mint', tasks: 37, success: 94.6, cost: 9.2, tools: ['Web search', 'CRM', 'Mailbox'], desc: 'Researches new sign-ups and writes a short account brief for sales.', autonomy: 'Drafts only' },
    { id: 'scout', name: 'Scout', role: 'Domain & SSL monitor', model: 'Claude Haiku 5.5', status: 'Paused', tint: 'sky', tasks: 0, success: 100, cost: 0, tools: ['Domains', 'DNS', 'Certificates'], desc: 'Watches expiry dates, DNS changes and certificates; renews when allowed.', autonomy: 'Acts, then reports' },
    { id: 'echo', name: 'Echo', role: 'Release notes writer', model: 'Claude Sonnet 5.5', status: 'Error', tint: 'blush', tasks: 4, success: 75, cost: 1.1, tools: ['Repositories', 'Docs'], desc: 'Turns merged pull requests into weekly release notes.', autonomy: 'Drafts only', error: 'Docs connection expired. Reconnect it to resume.' }];
  var STAT_TONE = { Running: 'success', 'Needs review': 'highlight', Paused: 'neutral', Error: 'danger', Succeeded: 'success', Failed: 'danger', Building: 'info', Ready: 'success', Canceled: 'neutral', Active: 'success', Expiring: 'warning', Pending: 'info', Valid: 'success', Renewing: 'info' };

  var RUN_TASKS = { atlas: ['Triage 12 new support emails', 'Draft reply to Northwind seat question', 'Tag billing questions'], ledger: ['Match 31 bank payments', 'Flag duplicate invoice #2079', 'Reconcile March payouts'], patch: ['Review PR #418 checkout seats', 'Review PR #421 DNS editor', 'Run lint on halo-web'], nova: ['Research 8 new trial sign-ups', 'Write brief for Kestrel Bank'], scout: ['Check certificate expiry'], echo: ['Write release notes for week 15'] };
  var runs = [];
  for (var ri = 0; ri < 26; ri++) {
    var ag = AGENTS[ri % AGENTS.length]; if (ag.id === 'scout' && ri > 4) ag = AGENTS[0];
    var rr = rnd(), st2 = ri === 0 ? 'Running' : ri === 2 ? 'Needs review' : (ag.id === 'echo' ? 'Failed' : rr < 0.86 ? 'Succeeded' : rr < 0.94 ? 'Needs review' : 'Failed');
    var tok = int(2400, 48000);
    runs.push({ id: 9120 - ri, agent: ag.id, task: pick(RUN_TASKS[ag.id]), status: st2, mins: ri * 23 + int(1, 20), dur: int(8, 240), tokens: tok, cost: tok / 1e6 * (ag.model.indexOf('Opus') > -1 ? 15 : ag.model.indexOf('Haiku') > -1 ? 1 : 3) * 4 });
  }
  function trace(run) {
    var a = AGENTS.filter(function (x) { return x.id === run.agent; })[0], t = 0, out = [];
    function add(kind, label, meta, ms, detail, status) { out.push({ kind: kind, label: label, meta: meta, start: t, ms: ms, detail: detail, status: status }); t += ms + 40; }
    add('message', 'Task received', run.task, 30, 'Trigger: schedule · every hour\nInput: ' + run.task);
    add('model', 'Planned the work', a.model + ' · ' + Math.round(run.tokens * 0.2).toLocaleString('en-US') + ' tokens', 900 + run.dur * 4, '1. Read what is new\n2. Look up anything missing\n3. Draft the result\n4. Ask before acting if needed');
    add('tool', a.tools[0], 'Fetched ' + (4 + run.id % 26) + ' items', 400 + (run.id % 9) * 120, JSON.stringify({ tool: a.tools[0], args: { limit: 25, since: '1h' }, result: { items: 4 + run.id % 26 } }, null, 2));
    add('search', (a.tools[1] || 'Knowledge base'), 'Looked up ' + (2 + run.id % 7) + ' references', 300 + (run.id % 5) * 160, 'Top match: “' + run.task + '” (score 0.91)');
    if (run.status === 'Failed') add('error', 'Stopped', a.error || 'A tool returned an error after 3 retries.', 1200, (a.error || 'HTTP 401 Unauthorized') + '\nRetried 3 times with backoff 1s, 2s, 4s', 'error');
    else if (run.status === 'Needs review') { add('model', 'Wrote the draft', Math.round(run.tokens * 0.6).toLocaleString('en-US') + ' tokens', 1800 + run.dur * 6, 'Draft saved to Mail › Drafts'); add('approval', 'Waiting for approval', 'Autonomy: ' + a.autonomy, 0, null, 'running'); }
    else if (run.status === 'Running') add('model', 'Working', 'Step 4 of about 6', 2400, null, 'running');
    else { add('model', 'Wrote the result', Math.round(run.tokens * 0.6).toLocaleString('en-US') + ' tokens', 1600 + run.dur * 5, 'Summary posted to #ops'); add('memory', 'Saved to memory', '2 facts', 120, '• Northwind renews on 1 May\n• Ida prefers short replies'); }
    return out;
  }
  function steps(run) {
    var a = AGENTS.filter(function (x) { return x.id === run.agent; })[0];
    var s = [{ t: 'Read the task', d: run.task, icon: 'file', ok: true }, { t: 'Used ' + a.tools[0], d: 'Fetched ' + int(4, 30) + ' items', icon: 'database', ok: true }, { t: 'Used ' + (a.tools[1] || a.tools[0]), d: 'Looked up ' + int(2, 9) + ' references', icon: 'search', ok: true }];
    if (run.status === 'Failed') s.push({ t: 'Stopped', d: a.error || 'A tool returned an error after 3 retries.', icon: 'x', ok: false });
    else if (run.status === 'Needs review') s.push({ t: 'Waiting for approval', d: 'Draft saved. A person needs to approve before anything is sent.', icon: 'eye', ok: null });
    else if (run.status === 'Running') s.push({ t: 'Working', d: 'Step 4 of about 6', icon: 'refresh', ok: null });
    else s.push({ t: 'Finished', d: 'Result saved and summary posted to the team.', icon: 'check', ok: true });
    return s;
  }
  var KNOW = [
    { name: 'Help center', kind: 'Website', items: '142 articles', synced: '12 min ago', status: 'Valid', icon: 'globe', tint: 'sky' },
    { name: 'Pricing & plans', kind: 'Document', items: '6 pages', synced: '2 h ago', status: 'Valid', icon: 'book', tint: 'butter' },
    { name: 'Support macros', kind: 'Spreadsheet', items: '58 rows', synced: 'Yesterday', status: 'Valid', icon: 'chart', tint: 'mint' },
    { name: 'Engineering handbook', kind: 'Repository', items: '214 files', synced: '3 days ago', status: 'Expiring', icon: 'code', tint: 'lilac' },
    { name: 'Refund policy', kind: 'Document', items: '2 pages', synced: 'Syncing…', status: 'Pending', icon: 'file', tint: 'blush' }];
  var CHAT_SEED = {
    atlas: [{ id: 1, role: 'assistant', time: '08:02', text: 'Morning, Mara. **12 new support emails** overnight. I tagged 9 and drafted 4 replies that need your approval.', model: 'Claude Sonnet 5.5' }],
    ledger: [{ id: 1, role: 'assistant', time: '07:40', text: 'All 31 payments from yesterday are matched. Invoice **#2079** looks like a duplicate of #2077, so I paused it.', model: 'Claude Haiku 5.5' }],
    patch: [], nova: [{ id: 1, role: 'assistant', time: '07:55', text: 'I researched 8 new trial sign-ups. **Kestrel Bank** looks like the strongest fit: 400 staff, already uses two of our integrations.' }],
    scout: [{ id: 1, role: 'system', text: 'Scout is paused' }], echo: [{ id: 1, role: 'assistant', time: 'Yesterday', text: 'I couldn’t reach the docs workspace. Reconnect it and I’ll finish the week 15 notes.' }]
  };

  var REPLIES = [
    { k: ['draft', 'reply', 'email', 'mail'], tools: [['Mailbox', 'Read 3 messages in the thread'], ['Knowledge base', 'Found "Seat upgrades" article']], text: 'Here is a draft: "Hi Ida, happy to add 40 seats before your renewal on 1 May. I have attached a quote; reply to confirm and the seats go live the same day." Want me to send it or keep it as a draft?' },
    { k: ['invoice', 'payment', 'paid', 'overdue'], tools: [['Billing', 'Checked 48 invoices'], ['Bank feed', 'Matched 31 payments']], text: 'Three invoices are overdue: #2041 Harbor & Co (€860), #2058 Pinegate (€1,240) and #2063 Orbit Foods (€420). I can send polite reminders to all three.' },
    { k: ['deploy', 'build', 'release', 'pr', 'code', 'bug'], tools: [['Repositories', 'Read the diff of PR #418'], ['Deployments', 'Checked the last 5 builds']], text: 'The last production build is green. PR #418 adds the seat selector; I left two comments. Once they are fixed it is safe to merge and deploy.' },
    { k: ['domain', 'dns', 'ssl', 'certificate'], tools: [['Domains', 'Checked 6 domains'], ['Certificates', 'Read expiry dates']], text: 'halo.dev expires in 18 days and auto-renew is off. Everything else renews automatically, and all certificates are valid for at least 60 days.' },
    { k: ['summary', 'today', 'status', 'what'], tools: [['Runs', 'Read today’s 26 runs']], text: 'Today so far: 26 runs, 22 succeeded, 2 need your review and 2 failed because the docs connection expired. Total cost €4.18.' }];

  var REPOS = [
    { name: 'halo-web', lang: 'TypeScript', color: 'sky', desc: 'The main app and marketing pages.', branch: 'main', ci: 'Ready', prs: 4, stars: 128, updated: '12 min ago' },
    { name: 'halo-api', lang: 'Go', color: 'mint', desc: 'Public REST API and webhooks.', branch: 'main', ci: 'Ready', prs: 2, stars: 64, updated: '2 h ago' },
    { name: 'agent-runtime', lang: 'Python', color: 'butter', desc: 'Runs agents, tools and schedules.', branch: 'main', ci: 'Building', prs: 3, stars: 91, updated: 'Now' },
    { name: 'design-system', lang: 'TypeScript', color: 'lilac', desc: 'Halo tokens and components.', branch: 'main', ci: 'Ready', prs: 1, stars: 47, updated: 'Yesterday' },
    { name: 'infra', lang: 'HCL', color: 'blush', desc: 'Servers, DNS and certificates as code.', branch: 'main', ci: 'Failed', prs: 1, stars: 12, updated: '3 days ago' }];
  var COMMITS = [['Mara Ellis', 'Add seat selector to checkout', 'halo-web', '12 min ago'], ['Patch (agent)', 'Suggest loading state for seat selector', 'halo-web', '20 min ago'], ['Jonah Petit', 'Comparison table: mobile layout', 'design-system', 'Yesterday'], ['Sun Lee', 'Retry webhooks with backoff', 'halo-api', 'Yesterday'], ['Rui Costa', 'Rotate EU load balancer cert', 'infra', '3 days ago']];
  var deploys = [
    { id: 'dpl_8f2a', repo: 'halo-web', env: 'Production', branch: 'main', commit: 'Add seat selector to checkout', status: 'Ready', dur: '1m 42s', when: '12 min ago', by: 'Mara Ellis' },
    { id: 'dpl_8e91', repo: 'agent-runtime', env: 'Preview', branch: 'tools-retry', commit: 'Retry tool calls on 429', status: 'Building', dur: '—', when: 'Now', by: 'Sun Lee', progress: 40 },
    { id: 'dpl_8d10', repo: 'halo-api', env: 'Production', branch: 'main', commit: 'Retry webhooks with backoff', status: 'Ready', dur: '58s', when: 'Yesterday', by: 'Sun Lee' },
    { id: 'dpl_8c77', repo: 'infra', env: 'Production', branch: 'main', commit: 'Rotate EU load balancer cert', status: 'Failed', dur: '3m 05s', when: '3 days ago', by: 'Rui Costa' },
    { id: 'dpl_8b02', repo: 'design-system', env: 'Preview', branch: 'table-mobile', commit: 'Comparison table: mobile layout', status: 'Ready', dur: '49s', when: 'Yesterday', by: 'Jonah Petit' },
    { id: 'dpl_8a64', repo: 'halo-web', env: 'Production', branch: 'main', commit: 'Pricing copy updates', status: 'Ready', dur: '1m 38s', when: '2 days ago', by: 'Jonah Petit' }];
  var BUILD_LOG = ['Cloning repository…', 'Installing dependencies (pnpm 9.12)', 'Dependencies installed in 14.2s', 'Running type check', 'Type check passed', 'Building app (412 modules)', 'Optimizing images', 'Generating static pages (38/38)', 'Uploading build output', 'Assigning domains', 'Deployment ready'];

  var domains = [
    { name: 'halo.app', status: 'Active', expires: '14.02.2028', renew: true, ssl: 'Valid', sslDays: 71, registrar: 'Halo Domains', dns: 'Halo DNS' },
    { name: 'halo.dev', status: 'Expiring', expires: '04.05.2026', renew: false, ssl: 'Valid', sslDays: 18, registrar: 'Halo Domains', dns: 'Halo DNS' },
    { name: 'gethalo.io', status: 'Active', expires: '30.09.2027', renew: true, ssl: 'Valid', sslDays: 64, registrar: 'Halo Domains', dns: 'Halo DNS' },
    { name: 'halo-status.com', status: 'Active', expires: '11.11.2026', renew: true, ssl: 'Renewing', sslDays: 2, registrar: 'Halo Domains', dns: 'Halo DNS' },
    { name: 'halostatic.net', status: 'Pending', expires: '—', renew: true, ssl: 'Pending', sslDays: 0, registrar: 'External', dns: 'Waiting for nameservers' }];
  var DNS0 = {
    'halo.app': [['A', '@', '76.76.21.21', '3600'], ['CNAME', 'www', 'halo.app', '3600'], ['CNAME', 'api', 'api.halo-edge.net', '3600'], ['MX', '@', '10 mx1.halomail.net', '3600'], ['MX', '@', '20 mx2.halomail.net', '3600'], ['TXT', '@', 'v=spf1 include:_spf.halomail.net ~all', '3600'], ['TXT', '_dmarc', 'v=DMARC1; p=quarantine', '3600']],
    'halo.dev': [['A', '@', '76.76.21.22', '3600'], ['CNAME', 'docs', 'docs.halo-edge.net', '3600']],
    'gethalo.io': [['CNAME', '@', 'halo.app', '3600']],
    'halo-status.com': [['CNAME', '@', 'status.halo-edge.net', '300']],
    'halostatic.net': [] };
  function availability(name) { var h0 = 0; for (var i = 0; i < name.length; i++) h0 = (h0 * 31 + name.charCodeAt(i)) >>> 0; return h0 % 3 !== 0; }

  var MAIL0 = [
    { id: 1, folder: 'Inbox', from: 'Ida Nolan', email: 'ida@northwind.co', subject: 'Seat upgrade before renewal', body: ['Hi Mara,', 'We are growing faster than planned and need 40 more seats before our renewal on 1 May. Could you send a quote for the Team plan?', 'Thanks a lot,\nIda'], date: '08:40', unread: true, starred: true, label: 'Customers', att: null },
    { id: 2, folder: 'Inbox', from: 'Atlas (agent)', email: 'atlas@agents.halo.app', subject: '4 replies waiting for your approval', body: ['Good morning,', 'I triaged 12 new support emails overnight. 4 drafts need your approval before I send them. Open Agents → Runs to review them.', '— Atlas'], date: '07:55', unread: true, starred: false, label: 'Agents', att: null },
    { id: 3, folder: 'Inbox', from: 'Jonah Petit', email: 'jonah@halo.app', subject: 'Pricing review → Thursday?', body: ['Hey,', 'Can we move the pricing review to Thursday? Growth wants to join and Sun is out on Wednesday.', 'J'], date: 'Yesterday', unread: false, starred: false, label: 'Team', att: null },
    { id: 4, folder: 'Inbox', from: 'Halo Domains', email: 'no-reply@halodomains.net', subject: 'halo.dev expires in 18 days', body: ['Your domain halo.dev expires on 04.05.2026 and auto-renew is off.', 'Turn on auto-renew in Domains to keep it.'], date: 'Yesterday', unread: false, starred: false, label: 'Domains', att: null },
    { id: 5, folder: 'Inbox', from: 'Sun Lee', email: 'sun@halo.app', subject: 'March partner payouts', body: ['Hi Mara,', 'Payout file for March is attached. 57 partners, all verified by Ledger.', 'Sun'], date: 'Mon', unread: false, starred: true, label: 'Finance', att: ['payouts-march.xlsx', '96 KB'] },
    { id: 6, folder: 'Inbox', from: 'Leo Brandt', email: 'leo@bluefern.io', subject: 'Export works now, thank you!', body: ['Just wanted to say thanks, the scheduled export works perfectly now. Saved us a whole afternoon every week.', 'Leo'], date: 'Mon', unread: false, starred: false, label: 'Customers', att: null },
    { id: 7, folder: 'Inbox', from: 'Halo Status', email: 'status@halo-status.com', subject: 'Resolved: EU webhook delays', body: ['Between 02:10 and 03:05 UTC, webhook delivery in the EU region was delayed by up to 14 minutes.', 'The issue is resolved and all queued webhooks were delivered.'], date: 'Sun', unread: false, starred: false, label: 'Status', att: ['incident-88.pdf', '182 KB'] },
    { id: 8, folder: 'Sent', from: 'Mara Ellis', email: 'mara@halo.app', to: 'jonah@halo.app', subject: 'Re: Comparison table', body: ['Looks great. Ship the mobile layout behind a flag first.', 'M'], date: 'Tue', unread: false, starred: false, label: 'Team', att: null },
    { id: 9, folder: 'Drafts', from: 'Mara Ellis', email: 'mara@halo.app', to: 'ida@northwind.co', subject: 'Re: Seat upgrade before renewal', body: ['Hi Ida, happy to help. Quote attached…'], date: 'Draft', unread: false, starred: false, label: 'Customers', att: null },
    { id: 10, folder: 'Spam', from: 'Prize Desk', email: 'win@prize-desk.biz', subject: 'You have been selected!!!', body: ['Claim your reward now.'], date: 'Sat', unread: false, starred: false, label: null, att: null }];
  var MAIL_FOLDERS = [['Inbox', 'inbox'], ['Starred', 'star'], ['Sent', 'send'], ['Drafts', 'file'], ['Archive', 'archive'], ['Spam', 'shield'], ['Trash', 'trash']];
  var LABEL_TINT = { Customers: 'sky', Agents: 'lilac', Team: 'mint', Domains: 'butter', Finance: 'butter', Status: 'blush' };

  /* ───────── Areas (top bar) and pages (side nav) ───────── */
  var AREAS = [
    { label: 'Workspace', icon: 'home', pages: [['Overview', 'home', 'overview'], ['Projects', 'grid', 'board'], ['Calendar', 'calendar', 'calendar'], ['People', 'users', 'people'], ['Reports', 'chart', 'reports']], action: ['New project', 'plus', 'new'] },
    { label: 'Customers', icon: 'users', pages: [['Companies', 'grid', 'companies'], ['Pipeline', 'trend', 'pipeline'], ['Contacts', 'user', 'contacts']], action: ['New deal', 'plus', 'deal'] },
    { label: 'Shop', icon: 'cart', pages: [['Overview', 'chart', 'shop'], ['Products', 'package', 'products'], ['Orders', 'truck', 'orders'], ['Storefront', 'cart', 'storefront']], action: ['Add product', 'plus', 'product'] },
    { label: 'Agents', icon: 'bot', pages: [['Fleet', 'bot', 'agents'], ['Chat', 'mail', 'agent-chat'], ['Builder', 'settings', 'agent-builder'], ['Workflows', 'zap', 'workflows'], ['Runs', 'refresh', 'runs'], ['Knowledge', 'book', 'knowledge'], ['Usage & cost', 'chart', 'usage']], action: ['New agent', 'plus', 'agent'] },
    { label: 'Mail', icon: 'mail', pages: null, action: ['Compose', 'edit', 'compose'] },
    { label: 'Code', icon: 'code', pages: [['Repositories', 'code', 'repos'], ['Deployments', 'zap', 'deployments']], action: ['Redeploy main', 'refresh', 'redeploy'] },
    { label: 'Domains', icon: 'globe', pages: [['Domains', 'globe', 'domains'], ['DNS records', 'server', 'dns'], ['Certificates', 'lock', 'certificates']], action: ['Add domain', 'plus', 'domain'] },
    { label: 'Finance', icon: 'card', pages: [['Overview', 'chart', 'finance'], ['Invoices', 'card', 'billing'], ['Expenses', 'file', 'expenses'], ['Bank', 'swap', 'bank'], ['VAT return', 'flag', 'vat'], ['Profit & loss', 'trend', 'pnl']], action: ['New invoice', 'plus', 'invoice-new'] },
    { label: 'Files', icon: 'folder', pages: [['All files', 'folder', 'files']], action: ['Upload', 'paperclip', 'upload'] },
    { label: 'Account', icon: 'settings', pages: [['Profile & theme', 'user', 'account'], ['Roles & access', 'lock', 'roles'], ['Audit log', 'shield', 'audit'], ['Setup guide', 'sparkle', 'setup'], ['Plan & billing', 'card', 'pricing'], ['System screens', 'grid', 'system']], action: null }];
  function areaOf(page) { if (page === 'invoice-new') page = 'billing'; for (var i = 0; i < AREAS.length; i++) { var a = AREAS[i]; if (a.label === 'Mail' && page.indexOf('mail-') === 0) return a; if (a.pages && a.pages.some(function (p) { return p[2] === page; })) return a; } return AREAS[0]; }

  function SubNav(p) {
    var a = p.area, items = a.label === 'Mail' ? MAIL_FOLDERS.map(function (f) { return [f[0], f[1], 'mail-' + f[0].toLowerCase()]; }) : a.pages;
    return h('nav', { className: 'demo-subnav', 'aria-label': a.label + ' pages' },
      h('div', { className: 'demo-subnav-head' }, h('span', { className: 'demo-subnav-eyebrow' }, a.label), a.action && h('button', { type: 'button', className: 'demo-subnav-action', onClick: function () { p.onAction(a.action[2]); }, title: a.action[0] }, h(H.Icon, { name: a.action[1], size: 15 }), h('span', null, a.action[0]))),
      h('div', { className: 'demo-subnav-list' }, items.map(function (it) {
        var c = p.counts[it[2]];
        return h('button', { key: it[2], type: 'button', className: 'demo-subnav-item', 'aria-current': p.page === it[2] ? 'page' : undefined, title: it[0], onClick: function () { p.onPick(it[2]); } }, h(H.Icon, { name: it[1], size: 17 }), h('span', { className: 'demo-subnav-label' }, it[0]), c ? h('span', { className: 'demo-subnav-count' }, c) : null);
      })),
      a.label === 'Mail' && h('div', { className: 'demo-subnav-labels' }, h('span', { className: 'demo-subnav-eyebrow' }, 'Labels'), Object.keys(LABEL_TINT).map(function (l) { return h('span', { key: l, className: 'demo-subnav-tag' }, h('i', { style: { background: 'var(--' + LABEL_TINT[l] + '-ink)' } }), l); })));
  }

  /* ───────── Agents ───────── */
  function AgentFleet(p) {
    var f = useState('All');
    var list = p.agents.filter(function (a) { return f[0] === 'All' || a.status === f[0]; });
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Agents', subtitle: p.agents.length + ' agents · demo data', actions: [h(H.Button, { key: 'n', icon: 'plus', onClick: p.onNew }, 'New agent')] })),
      h(H.Stagger, { className: 'ha-grid demo-4', delay: 80 },
        h(H.StatTile, { tint: 'mint', value: String(p.agents.filter(function (a) { return a.status === 'Running'; }).length), label: 'Running' }),
        h(H.StatTile, { tint: 'placeholder', value: String(p.runs.filter(function (r) { return r.status === 'Needs review'; }).length), label: 'Waiting for you' }),
        h(H.StatTile, { tint: 'sky', value: String(sum(p.agents, function (a) { return a.tasks; })), label: 'Tasks today' }),
        h(H.StatTile, { tint: 'butter', value: '€' + sum(p.agents, function (a) { return a.cost; }).toFixed(2), label: 'Cost today' })),
      h(Section, { d: 240 }, h('div', { className: 'ha-row' }, ['All', 'Running', 'Needs review', 'Paused', 'Error'].map(function (t) { return h(H.Chip, { key: t, selected: f[0] === t, onClick: function () { f[1](t); } }, t); }))),
      h(H.Stagger, { key: f[0], className: 'ha-grid demo-3', delay: 280 }, list.map(function (a) {
        var running = a.status === 'Running' || a.status === 'Needs review';
        return h(H.Card, { key: a.id, onClick: function () { p.chat(a.id); }, eyebrow: a.role, title: a.name, description: a.error || a.desc, meta: [a.model, a.autonomy], corner: h('span', { className: 'demo-agent-mark ha-t-' + a.tint + (a.status === 'Running' ? ' live' : '') }, h(H.Icon, { name: 'bot', size: 18 })),
          status: h(H.Badge, { tone: STAT_TONE[a.status], live: a.status === 'Running' }, a.status),
          actions: [h(H.IconButton, { key: 'c', icon: 'mail', label: 'Chat with ' + a.name, size: 'sm', onClick: function (e) { e.stopPropagation(); p.chat(a.id); } }), a.status === 'Error' ? h(H.Button, { key: 'f', size: 'sm', variant: 'soft', onClick: function (e) { e.stopPropagation(); p.fix(a); } }, 'Reconnect') : h(H.IconButton, { key: 'p', icon: running ? 'pause' : 'play', label: running ? 'Pause ' + a.name : 'Resume ' + a.name, size: 'sm', variant: 'solid', onClick: function (e) { e.stopPropagation(); p.toggle(a); } })] },
          h('div', { className: 'demo-agent-stats' }, h('span', null, h('b', null, a.tasks), ' tasks'), h('span', null, h('b', null, a.success + '%'), ' success'), h('span', null, h('b', null, '€' + a.cost.toFixed(2)), ' today')),
          h('div', { className: 'ha-row', style: { gap: 4 } }, a.tools.map(function (t) { return h('span', { key: t, className: 'demo-tool' }, t); })));
      })));
  }

  function Runs(p) {
    var f = useState('All'), open = useState(null);
    var list = p.runs.filter(function (r) { return f[0] === 'All' || r.status === f[0]; });
    function agent(id) { return p.agents.filter(function (a) { return a.id === id; })[0]; }
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Runs', subtitle: 'Every task an agent worked on today · demo data' })),
      h(Section, { d: 80 }, h('div', { className: 'ha-row' }, ['All', 'Running', 'Needs review', 'Succeeded', 'Failed'].map(function (t) { return h(H.Chip, { key: t, selected: f[0] === t, count: t === 'All' ? null : p.runs.filter(function (r) { return r.status === t; }).length, onClick: function () { f[1](t); } }, t); }))),
      h(H.Stagger, { key: f[0], className: 'ha-col', style: { gap: 8 }, delay: 140 }, list.map(function (r) {
        var a = agent(r.agent), isOpen = open[0] === r.id;
        return h('div', { key: r.id, className: 'demo-run' + (isOpen ? ' open' : '') },
          h('button', { type: 'button', className: 'demo-run-head', 'aria-expanded': isOpen ? 'true' : 'false', onClick: function () { open[1](isOpen ? null : r.id); } },
            h('span', { className: 'demo-agent-mark sm ha-t-' + a.tint }, h(H.Icon, { name: 'bot', size: 14 })),
            h('span', { className: 'demo-run-title' }, h('b', null, r.task), h('span', null, a.name + ' · #' + r.id + ' · ' + ago(r.mins))),
            h('span', { className: 'demo-run-meta' }, h('span', null, (r.tokens / 1000).toFixed(1) + 'k tokens'), h('span', null, '€' + r.cost.toFixed(3)), h('span', null, r.dur + 's')),
            h(H.Badge, { tone: STAT_TONE[r.status], live: r.status === 'Running' }, r.status), h(H.Icon, { name: isOpen ? 'chevronDown' : 'chevronRight', size: 15 })),
          isOpen && h('div', { className: 'demo-run-body' },
            h(H.RunTrace, { steps: trace(r), defaultOpen: 0, footer: h(React.Fragment, null, h('span', null, 'Model ', h('b', null, a.model)), h('span', null, 'Tokens ', h('b', null, r.tokens.toLocaleString('en-US'))), h('span', null, 'Cost ', h('b', null, '€' + r.cost.toFixed(3))), h('span', null, 'Run ', h('b', null, '#' + r.id))) }),
            r.status === 'Needs review' && h(H.ApprovalCard, { title: 'Send the draft from ' + a.name + '?', text: r.task, agent: a.name, project: a.role, family: 'comms', age: ago(r.mins), escalation: 'Escalates to the owner in 1:52 h', onDecide: function (k) { if (k === 'A' || k === 'B') p.decide(r, 'Succeeded', 'Approved. ' + a.name + ' sent it'); else p.decide(r, 'Failed', k === 'D' ? 'New instruction sent to ' + a.name : 'Draft discarded'); } }, h('div', { className: 'ha-approval-mail' }, 'Hi Ida,\n\nthanks for flagging this. I’ve added 40 seats to your plan, prorated to your renewal on 1 May. The quote is attached.\n\nBest,\nMara')),
            r.status === 'Failed' && h('div', { className: 'ha-row', style: { justifyContent: 'flex-end' } }, h(H.Button, { size: 'sm', variant: 'soft', icon: 'refresh', onClick: function () { p.decide(r, 'Running', 'Run #' + r.id + ' restarted'); } }, 'Retry'))));
      })));
  }

  function Knowledge(p) {
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Knowledge', subtitle: 'What your agents can read when they answer', actions: [h(H.Button, { key: 'a', icon: 'plus', onClick: p.onAdd }, 'Add source')] })),
      h(H.Stagger, { className: 'ha-grid demo-3', delay: 100 }, p.sources.map(function (s, i) {
        return h(H.Card, { key: s.name, title: s.name, eyebrow: s.kind, description: s.items + ' · synced ' + s.synced, corner: h(H.TintIcon, { icon: s.icon, tint: s.tint }), status: h(H.Badge, { tone: STAT_TONE[s.status] }, s.status === 'Valid' ? 'Up to date' : s.status === 'Expiring' ? 'Stale' : 'Syncing'), actions: [h(H.IconButton, { key: 'r', icon: 'refresh', label: 'Sync ' + s.name, size: 'sm', onClick: function () { p.sync(i); } })] }, h('div', { className: 'ha-card-desc' }, 'Used by ' + ['Atlas, Nova', 'Atlas, Ledger', 'Atlas', 'Patch, Echo', 'Atlas'][i % 5]));
      })));
  }

  function Usage(p) {
    var perAgent = p.agents.map(function (a) { return { label: a.name, value: Math.round(sum(p.runs.filter(function (r) { return r.agent === a.id; }), function (r) { return r.tokens; }) / 1000), tint: a.id === 'patch' ? 'lilac' : null }; });
    var spend = sum(p.agents, function (a) { return a.cost; });
    var daily = days.slice(-14).map(function (d, i) { return Math.round(d.signups * 3.1 + 40 + i * 4); });
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Usage & cost', subtitle: 'Demo data · this month' })),
      h(H.Stagger, { className: 'ha-grid demo-4', delay: 80 },
        h(H.StatTile, { tint: 'butter', value: '€' + (spend * 16).toFixed(2), label: 'Spent this month' }),
        h(H.StatTile, { tint: 'sky', value: '4.2M', label: 'Tokens used' }),
        h(H.StatTile, { tint: 'mint', value: '1,812', label: 'Runs' }),
        h(H.StatTile, { tint: 'lilac', value: '94.8%', label: 'Success rate' })),
      h(H.Stagger, { className: 'ha-grid demo-21', delay: 260 },
        h(H.Panel, { title: 'Cost per day', subtitle: 'Last 14 days, in euros' }, h(H.LineChart, { height: 170, labels: days.slice(-14).map(function (d, i) { return i % 2 ? '' : d.date.getDate() + '.' + (d.date.getMonth() + 1); }), format: function (v) { return '€' + Math.round(v); }, series: [{ values: daily, tint: 'butter', area: true }] })),
        h(H.Panel, { title: 'Monthly budget', subtitle: '€500 cap · alerts at 80%' }, h('div', { className: 'ha-row', style: { gap: 16 } }, h(H.ProgressRing, { value: Math.min(100, Math.round(spend * 16 / 5)), size: 110, stroke: 11, tint: 'butter', caption: 'used' }), h('div', { className: 'ha-col', style: { gap: 4, flex: '1 1 140px', minWidth: 0 } }, h('b', null, '€' + (spend * 16).toFixed(0) + ' of €500'), h('span', { className: 'ha-card-desc' }, 'At this pace you land near €' + Math.round(spend * 30) + ' by month end.'))))),
      h(Section, { d: 420 }, h(H.Panel, { title: 'Tokens per agent', subtitle: 'Thousands of tokens today; Patch uses the largest model' }, h(H.BarChart, { height: 150, data: perAgent }))));
  }

  /* ───────── Code ───────── */
  function Repos(p) {
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Repositories', subtitle: REPOS.length + ' repositories · demo data', actions: [h(H.SearchField, { key: 's', placeholder: 'Search code' })] })),
      h(H.Stagger, { className: 'ha-grid demo-3', delay: 80 }, REPOS.map(function (r) {
        return h(H.Card, { key: r.name, onClick: function () { p.go('deployments'); }, title: r.name, description: r.desc, corner: h(H.TintIcon, { icon: 'code', tint: r.color }), meta: [r.lang, r.branch, r.prs + ' open PRs', 'Updated ' + r.updated], status: h(H.Badge, { tone: STAT_TONE[r.ci], live: r.ci === 'Building' }, r.ci === 'Ready' ? 'Checks pass' : r.ci === 'Building' ? 'Building' : 'Checks failing'), actions: [h(H.IconButton, { key: 'b', icon: 'branch', label: 'Branches', size: 'sm' })] });
      })),
      h(Section, { d: 380 }, h(H.Panel, { title: 'Recent commits' }, h(H.Timeline, { delay: 420, items: COMMITS.map(function (c) { return { avatar: c[0].indexOf('agent') > -1 ? null : c[0], icon: 'bot', tint: 'lilac', text: h('span', null, h('b', null, c[0]), ' · ', c[1], ' ', h('span', { className: 'demo-mono' }, c[2])), time: c[3] }; }) }))));
  }
  function Deployments(p) {
    var open = useState(p.deploys[0].id);
    var cur = p.deploys.filter(function (d) { return d.id === open[0]; })[0] || p.deploys[0];
    var logLines = cur.status === 'Building' ? BUILD_LOG.slice(0, Math.max(1, Math.round((cur.progress || 0) / 100 * (BUILD_LOG.length - 1)))) : cur.status === 'Failed' ? BUILD_LOG.slice(0, 5).concat(['Error: terraform apply failed', 'Certificate for eu-lb.halo.app is still in use', 'Build failed after 3m 05s']) : BUILD_LOG;
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Deployments', subtitle: 'Builds across all repositories', actions: [h(H.Button, { key: 'r', icon: 'refresh', onClick: p.redeploy }, 'Redeploy main')] })),
      h('div', { className: 'demo-split-wide' },
        h(Section, { d: 80 }, h('div', { className: 'ha-panel ha-panel-flush ha-panel-list' }, h(H.Stagger, { className: 'ha-list', delay: 100 }, p.deploys.map(function (d) {
          return h(H.ListRow, { key: d.id, active: d.id === cur.id, onClick: function () { open[1](d.id); }, leading: h(H.TintIcon, { icon: d.env === 'Production' ? 'zap' : 'eye', tint: d.status === 'Failed' ? 'blush' : d.status === 'Building' ? 'sky' : 'mint' }), title: h('span', { className: 'demo-ellipsis' }, d.commit), subtitle: d.repo + ' · ' + d.branch + ' · ' + d.when, trailing: h(H.Badge, { tone: STAT_TONE[d.status], live: d.status === 'Building' }, d.status) });
        })))),
        h(Section, { d: 160 }, h('div', { className: 'ha-panel', style: { gap: 16 } },
          h('div', { className: 'ha-header' }, h('div', { style: { minWidth: 0 } }, h('div', { className: 'ha-panel-title' }, cur.repo), h('div', { className: 'ha-panel-sub' }, cur.env + ' · ' + cur.branch + ' · by ' + cur.by)), h(H.Badge, { tone: STAT_TONE[cur.status], live: cur.status === 'Building' }, cur.status)),
          cur.status === 'Building' && h(H.Progress, { key: 'pg' + cur.progress, value: cur.progress || 0, tint: 'sky', label: 'Build progress' }),
          h('div', { className: 'demo-kv' }, [['Deployment', cur.id], ['Commit', cur.commit], ['Duration', cur.dur], ['URL', cur.env === 'Production' ? cur.repo.replace('halo-', '') + '.halo.app' : cur.id + '.preview.halo.app']].map(function (kv) { return h('div', { key: kv[0] }, h('span', null, kv[0]), h('b', { className: kv[0] === 'Deployment' || kv[0] === 'URL' ? 'demo-mono' : null }, kv[1])); })),
          h('div', { className: 'demo-log', role: 'log', 'aria-label': 'Build log' }, logLines.map(function (l, i) { return h('div', { key: i, className: /Error|failed/i.test(l) ? 'err' : /ready|passed/i.test(l) ? 'ok' : null }, h('span', null, ('0' + (i * 7 % 60)).slice(-2) + 's'), l); }), cur.status === 'Building' && h('div', { className: 'demo-cursor' }, h('span', null, ''), '▍')),
          cur.status === 'Failed' && h('div', { className: 'ha-row', style: { justifyContent: 'flex-end' } }, h(H.Button, { variant: 'soft', icon: 'refresh', onClick: function () { p.retry(cur); } }, 'Retry build'))))));
  }

  /* ───────── Domains ───────── */
  function Domains(p) {
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Domains', subtitle: p.domains.length + ' domains · demo data', actions: [h(H.Button, { key: 'a', icon: 'plus', onClick: p.onAdd }, 'Add domain')] })),
      h(H.Stagger, { className: 'ha-grid demo-4', delay: 80 },
        h(H.StatTile, { tint: 'mint', value: String(p.domains.filter(function (d) { return d.status === 'Active'; }).length), label: 'Active' }),
        h(H.StatTile, { tint: 'butter', value: String(p.domains.filter(function (d) { return d.status === 'Expiring'; }).length), label: 'Expiring soon' }),
        h(H.StatTile, { tint: 'placeholder', value: String(p.domains.filter(function (d) { return d.status === 'Pending'; }).length), label: 'Waiting for DNS' }),
        h(H.StatTile, { tint: 'sky', value: String(p.domains.filter(function (d) { return d.ssl === 'Valid'; }).length), label: 'Valid certificates' })),
      p.domains.filter(function (d) { return d.status === 'Expiring' && !d.renew; }).map(function (d) { return h(Section, { key: d.name, d: 240 }, h(H.Alert, { tone: 'warning', title: d.name + ' expires on ' + d.expires, action: h(H.Button, { size: 'sm', variant: 'secondary', onClick: function () { p.setRenew(d, true); } }, 'Turn on auto-renew') }, 'Auto-renew is off. If it lapses, mail and the site on this domain stop working.')); }),
      h(Section, { d: 280 }, h('div', { className: 'ha-panel ha-panel-flush' }, h(Scroll, null, h(H.Table, { columns: [
        { key: 'name', label: 'Domain', render: function (d) { return h('button', { type: 'button', className: 'demo-link', onClick: function () { p.openDns(d.name); } }, h(H.TintIcon, { icon: 'globe', tint: d.status === 'Expiring' ? 'butter' : d.status === 'Pending' ? 'plain' : 'mint' }), d.name); } },
        { key: 'status', label: 'Status', render: function (d) { return h(H.Badge, { tone: STAT_TONE[d.status] }, d.status); } },
        { key: 'ssl', label: 'Certificate', render: function (d) { return h(H.Badge, { tone: STAT_TONE[d.ssl], dot: true }, d.ssl === 'Valid' ? d.sslDays + ' days left' : d.ssl); } },
        { key: 'expires', label: 'Expires' },
        { key: 'renew', label: 'Auto-renew', render: function (d) { return h('input', { type: 'checkbox', role: 'switch', className: 'ha-switch', 'aria-label': 'Auto-renew ' + d.name, checked: d.renew, disabled: d.status === 'Pending', onChange: function (e) { p.setRenew(d, e.target.checked); } }); } },
        { key: 'x', label: '', align: 'right', render: function (d) { return h(H.Button, { size: 'sm', variant: 'soft', iconRight: 'chevronRight', onClick: function () { p.openDns(d.name); } }, 'DNS'); } }], rows: p.domains })))));
  }
  function DnsRecords(p) {
    var dom = p.domain, recs = p.dns[dom] || [], add = useState(false), checking = useState(false);
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { crumbs: ['Domains', dom], title: 'DNS records', subtitle: recs.length + ' records · changes apply in demo only', actions: [h('select', { key: 'd', className: 'demo-inline-select', 'aria-label': 'Domain', value: dom, onChange: function (e) { p.pick(e.target.value); } }, p.domains.map(function (d) { return h('option', { key: d.name }, d.name); })), h(H.Button, { key: 'v', variant: 'secondary', icon: 'refresh', disabled: checking[0], onClick: function () { checking[1](true); setTimeout(function () { checking[1](false); p.toast(dom + ': all records resolve correctly'); }, 1400); } }, checking[0] ? 'Checking…' : 'Check propagation'), h(H.Button, { key: 'a', icon: 'plus', onClick: function () { add[1](true); } }, 'Add record')] })),
      add[0] && h(Section, null, h('form', { className: 'ha-panel demo-dns-form', onSubmit: function (e) { e.preventDefault(); var el = e.target.elements; p.addRec(dom, [el.type.value, el.name.value || '@', el.value.value, el.ttl.value]); add[1](false); } },
        h('label', { className: 'ha-field' }, h('span', { className: 'ha-field-label' }, 'Type'), h('select', { className: 'ha-input', name: 'type', id: 'dns-type' }, ['A', 'AAAA', 'CNAME', 'MX', 'TXT'].map(function (t) { return h('option', { key: t }, t); }))),
        h('label', { className: 'ha-field' }, h('span', { className: 'ha-field-label' }, 'Name'), h('input', { className: 'ha-input', name: 'name', id: 'dns-name', placeholder: '@ or subdomain' })),
        h('label', { className: 'ha-field', style: { gridColumn: 'span 2' } }, h('span', { className: 'ha-field-label' }, 'Value'), h('input', { className: 'ha-input', name: 'value', id: 'dns-value', required: true, placeholder: 'e.g. 76.76.21.21' })),
        h('label', { className: 'ha-field' }, h('span', { className: 'ha-field-label' }, 'TTL'), h('select', { className: 'ha-input', name: 'ttl', id: 'dns-ttl' }, ['300', '3600', '86400'].map(function (t) { return h('option', { key: t }, t); }))),
        h('div', { className: 'ha-row', style: { alignSelf: 'end', justifyContent: 'flex-end' } }, h(H.Button, { variant: 'ghost', onClick: function () { add[1](false); } }, 'Cancel'), h(H.Button, { type: 'submit', icon: 'check' }, 'Save')))),
      h(Section, { d: 120 }, h('div', { className: 'ha-panel ha-panel-flush' }, recs.length ? h(Scroll, null, h(H.Table, { key: dom, columns: [
        { key: 0, label: 'Type', render: function (r) { return h('span', { className: 'demo-rtype' }, r[0]); } }, { key: 1, label: 'Name', render: function (r) { return h('span', { className: 'demo-mono' }, r[1]); } }, { key: 2, label: 'Value', render: function (r) { return h('span', { className: 'demo-mono demo-ellipsis', title: r[2] }, r[2]); } }, { key: 3, label: 'TTL', align: 'right', render: function (r) { return h('span', { className: 'demo-mono' }, r[3]); } },
        { key: 4, label: '', align: 'right', render: function (r) { return h(H.IconButton, { icon: 'trash', label: 'Delete record', size: 'sm', onClick: function () { p.delRec(dom, r); } }); } }], rows: recs })) : h(H.EmptyState, { title: 'No records yet', text: 'Point the nameservers of ' + dom + ' to Halo DNS, then add an A or CNAME record.', icon: 'server', tint: 'sky', action: h(H.Button, { variant: 'soft', icon: 'plus', onClick: function () { add[1](true); } }, 'Add record') }))));
  }
  function Certificates(p) {
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Certificates', subtitle: 'Issued and renewed automatically · demo data' })),
      h(H.Stagger, { className: 'ha-grid demo-3', delay: 80 }, p.domains.map(function (d) {
        var pct = d.ssl === 'Valid' ? Math.round(d.sslDays / 90 * 100) : d.ssl === 'Renewing' ? 4 : 0;
        return h(H.Card, { key: d.name, title: d.name, eyebrow: 'Let’s Encrypt · RSA 2048', corner: h(H.TintIcon, { icon: 'lock', tint: d.ssl === 'Valid' ? (d.sslDays < 21 ? 'butter' : 'mint') : 'plain' }), status: h(H.Badge, { tone: d.ssl === 'Valid' ? (d.sslDays < 21 ? 'warning' : 'success') : STAT_TONE[d.ssl], live: d.ssl === 'Renewing' }, d.ssl === 'Valid' ? d.sslDays + ' days left' : d.ssl), actions: [h(H.Button, { key: 'r', size: 'sm', variant: 'soft', disabled: d.ssl === 'Pending', onClick: function () { p.renew(d); } }, 'Renew now')] }, h(H.Progress, { value: pct, tint: d.sslDays < 21 ? 'butter' : 'mint', label: 'Time left' }));
      })));
  }

  /* ───────── Mail ───────── */
  function Mail(p) {
    var folder = p.folder, q = useState(''), sel = useState(null), reply = useState('');
    var list = p.mail.filter(function (m) { return (folder === 'Starred' ? m.starred && m.folder !== 'Trash' : m.folder === folder) && (!q[0] || (m.from + m.subject + m.body.join(' ')).toLowerCase().indexOf(q[0].toLowerCase()) > -1); });
    var cur = list.filter(function (m) { return m.id === sel[0]; })[0];
    useEffect(function () { if (cur && cur.unread) p.set(cur, { unread: false }); }, [cur && cur.id]);
    useEffect(function () { sel[1](null); }, [folder]);
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: folder, subtitle: list.length + ' conversations · mara@halo.app · demo mailbox', actions: [h(H.SearchField, { key: 's', placeholder: 'Search mail', value: q[0], onChange: function (e) { q[1](e.target.value); } }), h(H.Button, { key: 'c', icon: 'edit', onClick: p.compose }, 'Compose')] })),
      h('div', { className: 'demo-mail' + (cur ? ' reading' : '') },
        h(Section, { d: 80 }, h('div', { className: 'ha-panel ha-panel-flush ha-panel-list demo-mail-list' }, list.length ? h(H.Stagger, { key: folder + q[0], className: 'ha-list', delay: 100 }, list.map(function (m) {
          return h('div', { key: m.id, className: 'demo-mail-row' + (m.unread ? ' unread' : '') + (cur && cur.id === m.id ? ' active' : '') },
            h('button', { type: 'button', className: 'demo-mail-open', onClick: function () { sel[1](m.id); reply[1](''); } },
              h(H.Avatar, { name: m.folder === 'Sent' || m.folder === 'Drafts' ? (m.to || '') : m.from, size: 34 }),
              h('span', { className: 'demo-mail-text' }, h('span', { className: 'demo-mail-from' }, m.unread && h('span', { className: 'ha-unread' }), m.folder === 'Sent' || m.folder === 'Drafts' ? 'To: ' + m.to : m.from, h('span', { className: 'demo-mail-date' }, m.date)), h('span', { className: 'demo-mail-subj' }, m.subject), h('span', { className: 'demo-mail-prev' }, m.body.join(' ').replace(/\n/g, ' ')))),
            h('button', { type: 'button', className: 'demo-star' + (m.starred ? ' on' : ''), 'aria-label': m.starred ? 'Unstar' : 'Star', 'aria-pressed': m.starred ? 'true' : 'false', onClick: function () { p.set(m, { starred: !m.starred }); } }, h(H.Icon, { name: 'star', size: 15 })));
        })) : h(H.EmptyState, { title: q[0] ? 'Nothing found' : folder + ' is empty', text: q[0] ? 'No mail matches "' + q[0] + '".' : 'Mail you move here shows up in this list.', icon: 'inbox', tint: 'sky' }))),
        h(Section, { d: 160 }, h('div', { className: 'ha-panel demo-mail-read' }, cur ? h('div', { key: cur.id, className: 'ha-col ha-in', style: { gap: 16 } },
          h('div', { className: 'demo-mail-toolbar' }, h(H.IconButton, { icon: 'chevronLeft', label: 'Back to list', className: 'demo-mail-back', onClick: function () { sel[1](null); } }), h('span', { style: { flex: 1 } }), h(H.IconButton, { icon: 'reply', label: 'Reply', onClick: function () { var el = document.getElementById('mail-reply'); if (el) el.focus(); } }), h(H.IconButton, { icon: 'archive', label: 'Archive', onClick: function () { p.move(cur, 'Archive'); sel[1](null); } }), h(H.IconButton, { icon: 'mail', label: 'Mark as unread', onClick: function () { p.set(cur, { unread: true }); sel[1](null); } }), h(H.IconButton, { icon: 'trash', label: 'Move to trash', onClick: function () { p.move(cur, 'Trash'); sel[1](null); } })),
          h('h2', { className: 'ha-panel-title', style: { fontSize: 20, lineHeight: '28px' } }, cur.subject),
          h('div', { className: 'ha-row', style: { flexWrap: 'nowrap' } }, h(H.Avatar, { name: cur.from, size: 38 }), h('div', { style: { minWidth: 0, flex: 1 } }, h('div', { style: { fontWeight: 700 } }, cur.from), h('div', { className: 'ha-card-desc demo-ellipsis' }, cur.email + (cur.to ? ' → ' + cur.to : ' → mara@halo.app'))), h('span', { className: 'ha-card-desc' }, cur.date), cur.label && h(H.Badge, { tone: { sky: 'info', lilac: 'highlight', mint: 'success', butter: 'warning', blush: 'danger' }[LABEL_TINT[cur.label]] }, cur.label)),
          h('div', { className: 'demo-mail-body' }, cur.body.map(function (para, i) { return h('p', { key: i }, para); })),
          cur.att && h(H.FileRow, { name: cur.att[0], meta: cur.att[1], kind: /xlsx/.test(cur.att[0]) ? 'sheet' : 'pdf' }),
          cur.folder !== 'Sent' && cur.folder !== 'Drafts' && h('form', { className: 'demo-mail-reply', onSubmit: function (e) { e.preventDefault(); if (!reply[0].trim()) return; p.send({ to: cur.email, subject: 'Re: ' + cur.subject, body: reply[0] }); reply[1](''); } },
            h('textarea', { id: 'mail-reply', className: 'ha-input', rows: 3, placeholder: 'Reply to ' + cur.from + '…', value: reply[0], onChange: function (e) { reply[1](e.target.value); } }),
            h('div', { className: 'ha-row', style: { justifyContent: 'space-between' } }, h(H.Button, { variant: 'ghost', size: 'sm', icon: 'bot', onClick: function () { reply[1]('Hi ' + cur.from.split(' ')[0] + ',\n\nThanks for your message. ' + (/seat/i.test(cur.subject) ? 'Happy to add the seats; a quote is attached and they go live as soon as you confirm.' : 'I have noted this and will follow up shortly.') + '\n\nBest,\nMara'); } }, 'Draft with Atlas'), h(H.Button, { type: 'submit', icon: 'send', size: 'sm' }, 'Send reply'))))
          : h('div', { className: 'demo-mail-empty' }, h(H.TintIcon, { icon: 'mail', tint: 'sky', size: 44 }), h('b', null, 'Select a conversation'), h('span', { className: 'ha-card-desc' }, list.filter(function (m) { return m.unread; }).length + ' unread in ' + folder))))));
  }

  /* ───────── Finance & accounting ───────── */
  var EXP_CATS = { Software: ['sky', 'code'], Hosting: ['lilac', 'server'], Office: ['butter', 'home'], Travel: ['mint', 'globe'], Marketing: ['blush', 'send'], Contractors: ['ink', 'users'], 'Bank fees': ['butter', 'card'] };
  var VENDORS = [['Figma', 'Software', 19], ['GitHub', 'Software', 19], ['Notion', 'Software', 19], ['Hetzner', 'Hosting', 19], ['Vercel', 'Hosting', 19], ['Cloudflare', 'Hosting', 19], ['Office supplies', 'Office', 19], ['Deutsche Bahn', 'Travel', 7], ['Hotel Hamburg', 'Travel', 7], ['LinkedIn Ads', 'Marketing', 19], ['Studio Nordlicht', 'Contractors', 19], ['Kai Silva (freelance)', 'Contractors', 19], ['Bank fees', 'Bank fees', 0]];
  var expenses = [];
  for (var ei = 0; ei < 34; ei++) {
    var v = VENDORS[int(0, VENDORS.length - 1)], edt = new Date(today); edt.setDate(today.getDate() - ei * 3 - int(0, 2));
    var gross = v[1] === 'Contractors' ? int(900, 3800) : v[1] === 'Bank fees' ? int(9, 24) : v[1] === 'Travel' ? int(80, 620) : v[1] === 'Marketing' ? int(300, 1400) : int(12, 240) + 0.99;
    expenses.push({ id: 'E-' + (4180 - ei), vendor: v[0], cat: v[1], vat: v[2], gross: Math.round(gross * 100) / 100, date: edt, status: ei < 4 ? 'To review' : 'Booked', receipt: ei % 7 !== 3 });
  }
  function netOf(e) { return e.gross / (1 + e.vat / 100); }
  function vatOf(e) { return e.gross - netOf(e); }
  function eur(n, dec) { return (n < 0 ? '−€' : '€') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: dec ? 2 : 0, maximumFractionDigits: dec ? 2 : 0 }); }

  function buildBank(invs, exps) {
    var tx = [];
    invs.filter(function (x) { return x.status === 'Paid'; }).slice(0, 18).forEach(function (x, i) { var d = new Date(x.date); d.setDate(d.getDate() + int(2, 9)); if (d > today) d = new Date(today); tx.push({ id: 'T' + (9000 + i), date: d, text: x.company + ' · Invoice ' + x.id, amount: Math.round(x.amount * 1.19 * 100) / 100, match: { kind: 'invoice', ref: '#' + x.id } }); });
    exps.filter(function (e) { return e.status === 'Booked'; }).slice(0, 22).forEach(function (e, i) { tx.push({ id: 'T' + (9100 + i), date: e.date, text: e.vendor.toUpperCase() + ' ' + ['SEPA', 'CARD', 'DD'][i % 3], amount: -e.gross, match: { kind: 'expense', ref: e.id } }); });
    tx.push({ id: 'T9201', date: new Date(2026, 3, 15), text: 'STRIPE PAYOUT 0415', amount: 2318.40, match: null, hint: 'Payout for 3 card payments: invoices #2093, #2094, #2095' });
    tx.push({ id: 'T9202', date: new Date(2026, 3, 14), text: 'APPLE.COM/BILL', amount: -11.99, match: null, hint: 'Looks like a software subscription. Create an expense under Software?' });
    tx.push({ id: 'T9203', date: new Date(2026, 3, 12), text: 'FINANZAMT HAMBURG UST', amount: -6412.00, match: null, hint: 'VAT payment for March. Book it against the VAT clearing account?' });
    tx.push({ id: 'T9204', date: new Date(2026, 3, 11), text: 'UNKNOWN TRANSFER REF 88219', amount: 450.00, match: null, hint: 'No matching invoice. Ask the customer for a reference?' });
    return tx.sort(function (a, b) { return b.date - a.date; });
  }
  var MONTH_REV = { '2025-10': 24800, '2025-11': 26300, '2025-12': 27900, '2026-0': 28600, '2026-1': 30200, '2026-2': 32100 };
  function monthRevenue(m) { var k = m.getFullYear() + '-' + m.getMonth(); if (MONTH_REV[k]) return MONTH_REV[k]; return Math.round(sum(days.filter(function (d) { return d.date.getMonth() === m.getMonth() && d.date.getFullYear() === m.getFullYear(); }), function (d) { return d.revenue; })); }
  function monthLabel(m) { return m.toLocaleString('en-US', { month: 'short' }) + (m.getMonth() === today.getMonth() && m.getFullYear() === today.getFullYear() ? '*' : ''); }
  function quarterOf(d) { return 'Q' + (Math.floor(d.getMonth() / 3) + 1) + ' ' + d.getFullYear(); }

  function FinanceOverview(p) {
    var balance = 84200 + sum(p.bank, function (t) { return t.amount; });
    var months = []; for (var mi = 5; mi >= 0; mi--) { var md = new Date(2026, 3 - mi, 1); months.push(md); }
    function inMonth(d, m) { return d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear(); }
    var inc = months.map(monthRevenue);
    var out = months.map(function (m) { return Math.round(sum(p.expenses.filter(function (e) { return inMonth(e.date, m); }), function (e) { return netOf(e); }) + 9800); });
    var profit = inc[5] - out[5], burn = out[5], runway = balance / burn;
    var open = p.invoices.filter(function (x) { return x.status === 'Due' || x.status === 'Overdue'; });
    var cats = {}; p.expenses.forEach(function (e) { cats[e.cat] = (cats[e.cat] || 0) + netOf(e); });
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Finance', subtitle: 'April 2026 · demo books in EUR', actions: [h(H.Button, { key: 'e', variant: 'secondary', icon: 'file', onClick: function () { p.go('expenses'); } }, 'Add receipt'), h(H.Button, { key: 'n', icon: 'plus', onClick: function () { p.go('invoice-new'); } }, 'New invoice')] })),
      h(H.Stagger, { className: 'ha-grid demo-4', delay: 80 },
        h(H.StatTile, { tint: 'sky', value: eur(balance), label: 'Bank balance' }),
        h(H.StatTile, { tint: 'mint', value: eur(profit), label: 'Profit this month' }),
        h(H.StatTile, { tint: 'butter', value: eur(sum(open, function (x) { return x.amount * 1.19; })), label: open.length + ' open invoices' }),
        h(H.StatTile, { tint: 'placeholder', value: runway.toFixed(1), label: 'Months of runway' })),
      h(H.Stagger, { className: 'ha-grid demo-21', delay: 260 },
        h(H.Panel, { title: 'Income vs. expenses', subtitle: 'Net, per month · * month to date', action: h('div', { className: 'ha-legend' }, h('span', null, h('i', { style: { background: 'var(--mint-ink)' } }), 'Income'), h('span', null, h('i', { style: { background: 'var(--blush-ink)' } }), 'Expenses')) },
          h(H.LineChart, { height: 180, labels: months.map(monthLabel), format: function (v) { return '€' + Math.round(v / 1000) + 'k'; }, series: [{ values: inc, tint: 'mint', area: true }, { values: out, tint: 'blush' }] })),
        h(H.Panel, { title: 'Where money goes', subtitle: 'Expenses by category, net' }, h(H.Donut, { size: 130, stroke: 17, center: eur(sum(Object.keys(cats), function (k) { return cats[k]; })), caption: 'total', data: Object.keys(cats).sort(function (a, b) { return cats[b] - cats[a]; }).slice(0, 5).map(function (k) { return { label: k, value: Math.round(cats[k]), tint: EXP_CATS[k][0] }; }) }))),
      h(H.Stagger, { className: 'ha-grid demo-3', delay: 420 },
        h(FinTodo, { icon: 'file', tint: 'butter', n: p.expenses.filter(function (e) { return e.status === 'To review'; }).length, label: 'receipts to review', go: function () { p.go('expenses'); } }),
        h(FinTodo, { icon: 'swap', tint: 'sky', n: p.bank.filter(function (t) { return !t.match; }).length, label: 'bank transactions to match', go: function () { p.go('bank'); } }),
        h(FinTodo, { icon: 'flag', tint: 'blush', n: p.invoices.filter(function (x) { return x.status === 'Overdue'; }).length, label: 'overdue invoices', go: function () { p.go('billing'); } })));
  }
  function FinTodo(p) {
    return h('button', { type: 'button', className: 'ha-card ha-card-interactive demo-fintodo', onClick: p.go }, h(H.TintIcon, { icon: p.icon, tint: p.n ? p.tint : 'mint', size: 40 }), h('span', { className: 'demo-fintodo-n' }, p.n ? p.n : h(H.Icon, { name: 'check', size: 22 })), h('span', { className: 'ha-card-desc' }, p.n ? p.label : 'All done: no ' + p.label), h('span', { className: 'demo-fintodo-go' }, 'Open', h(H.Icon, { name: 'chevronRight', size: 14 })));
  }

  function InvoiceEditor(p) {
    var cust = useState(COMPANIES[0]), terms = useState('14'), lines = useState([{ d: 'Halo Team plan · 40 seats · May 2026', q: 40, u: 24, v: 19 }, { d: 'Onboarding workshop (half day)', q: 1, u: 650, v: 19 }]), note = useState('Thank you for your business.');
    var nextId = Math.max.apply(null, p.invoices.map(function (x) { return x.id; })) + 1;
    var net = sum(lines[0], function (l) { return l.q * l.u; }), vatGroups = {};
    lines[0].forEach(function (l) { vatGroups[l.v] = (vatGroups[l.v] || 0) + l.q * l.u * l.v / 100; });
    var vat = sum(Object.keys(vatGroups), function (k) { return vatGroups[k]; }), due = new Date(today); due.setDate(due.getDate() + parseInt(terms[0], 10));
    function set(i, k, val) { lines[1](lines[0].map(function (l, j) { if (j !== i) return l; var n = Object.assign({}, l); n[k] = k === 'd' ? val : Math.max(0, parseFloat(val) || 0); return n; })); }
    function save(status) { if (!lines[0].length || net <= 0) { p.toast('Add at least one line with a price'); return; } p.create({ id: nextId, company: cust[0], date: today, amount: Math.round(net * 100) / 100, status: status }); }
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { crumbs: ['Finance', 'Invoices', 'New'], title: 'Invoice #' + nextId, subtitle: 'Totals update as you type', actions: [h(H.Button, { key: 'c', variant: 'ghost', onClick: function () { p.go('billing'); } }, 'Cancel'), h(H.Button, { key: 'd', variant: 'secondary', onClick: function () { save('Draft'); } }, 'Save draft'), h(H.Button, { key: 's', icon: 'send', onClick: function () { save('Due'); } }, 'Create & send')] })),
      h('div', { className: 'demo-inv' },
        h(Section, { d: 80 }, h('div', { className: 'ha-panel', style: { gap: 24 } },
          h('div', { className: 'ha-grid demo-2' },
            h('label', { className: 'ha-field' }, h('span', { className: 'ha-field-label' }, 'Customer'), h('select', { className: 'ha-input', id: 'inv-cust', value: cust[0], onChange: function (e) { cust[1](e.target.value); } }, COMPANIES.map(function (c) { return h('option', { key: c }, c); }))),
            h('label', { className: 'ha-field' }, h('span', { className: 'ha-field-label' }, 'Payment terms'), h('select', { className: 'ha-input', id: 'inv-terms', value: terms[0], onChange: function (e) { terms[1](e.target.value); } }, [['7', '7 days'], ['14', '14 days'], ['30', '30 days']].map(function (t) { return h('option', { key: t[0], value: t[0] }, t[1]); })))),
          h('div', { className: 'demo-lines' },
            h('div', { className: 'demo-line demo-line-head' }, h('span', null, 'Description'), h('span', null, 'Qty'), h('span', null, 'Unit €'), h('span', null, 'VAT'), h('span', { style: { textAlign: 'right' } }, 'Net'), h('span')),
            lines[0].map(function (l, i) {
              return h('div', { key: i, className: 'demo-line ha-in' },
                h('input', { className: 'ha-input', id: 'l-d-' + i, 'aria-label': 'Description', value: l.d, onChange: function (e) { set(i, 'd', e.target.value); } }),
                h('input', { className: 'ha-input', id: 'l-q-' + i, 'aria-label': 'Quantity', type: 'number', min: 0, value: l.q, onChange: function (e) { set(i, 'q', e.target.value); } }),
                h('input', { className: 'ha-input', id: 'l-u-' + i, 'aria-label': 'Unit price', type: 'number', min: 0, step: '0.01', value: l.u, onChange: function (e) { set(i, 'u', e.target.value); } }),
                h('select', { className: 'ha-input', id: 'l-v-' + i, 'aria-label': 'VAT rate', value: l.v, onChange: function (e) { set(i, 'v', e.target.value); } }, [19, 7, 0].map(function (r) { return h('option', { key: r, value: r }, r + '%'); })),
                h('b', { className: 'demo-line-sum' }, eur(l.q * l.u, true)),
                h(H.IconButton, { icon: 'trash', label: 'Remove line', size: 'sm', onClick: function () { lines[1](lines[0].filter(function (_, j) { return j !== i; })); } }));
            }),
            h('button', { type: 'button', className: 'ha-kanban-add', onClick: function () { lines[1](lines[0].concat([{ d: '', q: 1, u: 0, v: 19 }])); } }, h(H.Icon, { name: 'plus', size: 14 }), 'Add line')),
          h('label', { className: 'ha-field' }, h('span', { className: 'ha-field-label' }, 'Note on invoice'), h('input', { className: 'ha-input', id: 'inv-note', value: note[0], onChange: function (e) { note[1](e.target.value); } })))),
        h(Section, { d: 160 }, h('div', { className: 'demo-paper' },
          h('div', { className: 'demo-paper-top' }, h('div', null, h('div', { className: 'ha-brand', style: { color: 'var(--ink)', fontSize: 18 } }, 'Halo', h('span', { className: 'ha-brand-dot' })), h('div', { className: 'demo-paper-small' }, 'Halo Workspace GmbH · Example Street 1 · 20457 Hamburg')), h('div', { style: { textAlign: 'right' } }, h('div', { className: 'demo-paper-kind' }, 'Invoice'), h('div', { className: 'demo-mono' }, '#' + nextId))),
          h('div', { className: 'demo-paper-meta' }, h('div', null, h('span', null, 'Bill to'), h('b', null, cust[0])), h('div', null, h('span', null, 'Issued'), h('b', null, fmtDate(today))), h('div', null, h('span', null, 'Due'), h('b', null, fmtDate(due)))),
          h('div', { className: 'demo-paper-lines' }, lines[0].map(function (l, i) { return h('div', { key: i }, h('span', null, (l.d || 'Untitled line') + (l.q !== 1 ? ' × ' + l.q : '')), h('b', null, eur(l.q * l.u, true))); })),
          h('div', { className: 'demo-paper-totals' }, h('div', null, h('span', null, 'Net'), h('b', null, eur(net, true))), Object.keys(vatGroups).filter(function (k) { return +k > 0; }).map(function (k) { return h('div', { key: k }, h('span', null, 'VAT ' + k + '%'), h('b', null, eur(vatGroups[k], true))); }), h('div', { className: 'grand' }, h('span', null, 'Total due'), h('b', null, eur(net + vat, true)))),
          h('div', { className: 'demo-paper-small' }, note[0] + ' Please pay within ' + terms[0] + ' days to DE00 0000 0000 0000 0000 00 (example).')))));
  }

  function Expenses(p) {
    var f = useState('All'), fileRef = React.useRef(null);
    var list = p.expenses.filter(function (e) { return f[0] === 'All' || (f[0] === 'To review' ? e.status === 'To review' : e.cat === f[0]); });
    var month = p.expenses.filter(function (e) { return e.date.getMonth() === today.getMonth(); });
    function upload(e) { var file = e.target.files && e.target.files[0]; if (!file) return; p.upload(file.name.replace(/\.[^.]+$/, '')); e.target.value = ''; }
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Expenses', subtitle: 'Receipts and costs · Ledger suggests categories', actions: [h('input', { key: 'f', ref: fileRef, type: 'file', accept: 'image/*,application/pdf', hidden: true, id: 'receipt-upload', onChange: upload }), h(H.Button, { key: 'u', icon: 'paperclip', onClick: function () { fileRef.current && fileRef.current.click(); } }, 'Upload receipt')] })),
      h(H.Stagger, { className: 'ha-grid demo-4', delay: 80 },
        h(H.StatTile, { tint: 'blush', value: eur(sum(month, function (e) { return e.gross; })), label: 'Spent in April' }),
        h(H.StatTile, { tint: 'placeholder', value: String(p.expenses.filter(function (e) { return e.status === 'To review'; }).length), label: 'To review' }),
        h(H.StatTile, { tint: 'sky', value: eur(sum(month, vatOf)), label: 'Input VAT (April)' }),
        h(H.StatTile, { tint: 'butter', value: String(p.expenses.filter(function (e) { return !e.receipt; }).length), label: 'Missing receipts' })),
      h(Section, { d: 240 }, h('div', { className: 'ha-row' }, ['All', 'To review'].concat(Object.keys(EXP_CATS)).map(function (t) { return h(H.Chip, { key: t, selected: f[0] === t, count: t === 'To review' ? p.expenses.filter(function (e) { return e.status === 'To review'; }).length : null, onClick: function () { f[1](t); } }, t); }))),
      h(Section, { d: 300 }, h('div', { className: 'ha-panel ha-panel-flush' }, h(Scroll, null, h(H.Table, { key: f[0], columns: [
        { key: 'vendor', label: 'Vendor', render: function (e) { return h('span', { className: 'ha-row', style: { flexWrap: 'nowrap' } }, h(H.TintIcon, { icon: EXP_CATS[e.cat][1], tint: EXP_CATS[e.cat][0] }), h('span', null, h('div', { style: { fontWeight: 700 } }, e.vendor), h('div', { style: { fontSize: 12, color: 'var(--ink-muted)' } }, e.id + ' · ' + fmtDate(e.date)))); } },
        { key: 'cat', label: 'Category', render: function (e) { return h('select', { className: 'demo-inline-select', 'aria-label': 'Category for ' + e.vendor, value: e.cat, onChange: function (ev) { p.set(e, { cat: ev.target.value }); } }, Object.keys(EXP_CATS).map(function (c) { return h('option', { key: c }, c); })); } },
        { key: 'receipt', label: 'Receipt', render: function (e) { return e.receipt ? h(H.Badge, { tone: 'success', dot: false }, 'Attached') : h(H.Button, { size: 'sm', variant: 'soft', icon: 'paperclip', onClick: function () { p.set(e, { receipt: true }, 'Receipt attached to ' + e.id); } }, 'Attach'); } },
        { key: 'vat', label: 'VAT', align: 'right', render: function (e) { return e.vat + '% · ' + eur(vatOf(e), true); } },
        { key: 'gross', label: 'Gross', align: 'right', render: function (e) { return h('b', null, eur(e.gross, true)); } },
        { key: 'status', label: '', align: 'right', render: function (e) { return e.status === 'Booked' ? h(H.Badge, { tone: 'success' }, 'Booked') : e.status === 'Reading' ? h(H.Badge, { tone: 'info', live: true }, 'Ledger is reading…') : h(H.Button, { size: 'sm', icon: 'check', onClick: function () { p.set(e, { status: 'Booked' }, e.vendor + ' booked as ' + e.cat); } }, 'Book'); } }], rows: list.slice(0, 16) })),
        list.length > 16 && h('p', { className: 'ha-card-desc', style: { padding: '0 16px 8px' } }, 'Showing the 16 newest of ' + list.length + '.'))));
  }

  function Bank(p) {
    var f = useState('All'), open = useState(null);
    var list = p.bank.filter(function (t) { return f[0] === 'All' || (f[0] === 'To match' ? !t.match : f[0] === 'Incoming' ? t.amount > 0 : t.amount < 0); });
    var balance = 84200 + sum(p.bank, function (t) { return t.amount; });
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Bank', subtitle: 'Business account · synced 4 min ago (demo)', actions: [h(H.Button, { key: 'r', variant: 'secondary', icon: 'refresh', onClick: function () { p.toast('Bank feed is up to date'); } }, 'Sync')] })),
      h('div', { className: 'demo-split' },
        h('div', { className: 'ha-col', style: { gap: 16, minWidth: 0 } },
          h(Section, { d: 80 }, h('div', { className: 'ha-row' }, ['All', 'To match', 'Incoming', 'Outgoing'].map(function (t) { return h(H.Chip, { key: t, selected: f[0] === t, count: t === 'To match' ? p.bank.filter(function (x) { return !x.match; }).length : null, onClick: function () { f[1](t); } }, t); }))),
          h(H.Stagger, { key: f[0], className: 'ha-col', style: { gap: 8 }, delay: 140 }, list.slice(0, 18).map(function (t) {
            var isOpen = open[0] === t.id;
            return h('div', { key: t.id, className: 'demo-tx' + (t.match ? '' : ' unmatched') },
              h('div', { className: 'demo-tx-row' },
                h(H.TintIcon, { icon: t.amount > 0 ? 'download' : 'send', tint: t.amount > 0 ? 'mint' : 'plain' }),
                h('div', { className: 'demo-tx-text' }, h('b', { className: 'demo-mono demo-ellipsis' }, t.text), h('span', null, fmtDate(t.date) + (t.match ? ' · matched to ' + t.match.ref : ''))),
                h('b', { className: 'demo-tx-amt ' + (t.amount > 0 ? 'in' : 'out') }, (t.amount > 0 ? '+' : '') + eur(t.amount, true)),
                t.match ? h(H.Badge, { tone: 'success' }, 'Matched') : h(H.Button, { size: 'sm', variant: isOpen ? 'soft' : 'primary', onClick: function () { open[1](isOpen ? null : t.id); } }, isOpen ? 'Close' : 'Match')),
              isOpen && h('div', { className: 'demo-tx-suggest ha-in' }, h('span', { className: 'demo-agent-mark sm ha-t-butter' }, h(H.Icon, { name: 'bot', size: 14 })), h('span', { style: { flex: 1, minWidth: 0 } }, h('b', null, 'Ledger: '), t.hint), h(H.Button, { size: 'sm', icon: 'check', onClick: function () { p.match(t); open[1](null); } }, 'Accept'), h(H.Button, { size: 'sm', variant: 'ghost', onClick: function () { open[1](null); } }, 'Skip')));
          }))),
        h(H.Panel, { side: true, title: 'Business account', subtitle: 'DE00 •••• 4417 (example)' },
          h('div', { className: 'ha-card', style: { minHeight: 0, background: 'var(--frame)', color: 'var(--on-frame)', boxShadow: 'none', gap: 4 } }, h('span', { style: { font: '600 12px/16px var(--font-sans)', color: 'var(--on-frame-muted)' } }, 'Available balance'), h(H.CountUp, { className: 'ha-stat-value', value: eur(balance) })),
          h('div', null, h('div', { className: 'ha-row', style: { justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 8 } }, h('span', null, 'Reconciled'), h('span', null, p.bank.filter(function (t) { return t.match; }).length + ' / ' + p.bank.length)), h(H.Progress, { value: Math.round(p.bank.filter(function (t) { return t.match; }).length / p.bank.length * 100), tint: 'mint', label: 'Reconciled' })),
          h('div', { className: 'demo-kv' }, h('div', null, h('span', null, 'In (30 days)'), h('b', null, eur(sum(p.bank.filter(function (t) { return t.amount > 0 && (today - t.date) / 864e5 <= 30; }), function (t) { return t.amount; })))), h('div', null, h('span', null, 'Out (30 days)'), h('b', null, eur(-sum(p.bank.filter(function (t) { return t.amount < 0 && (today - t.date) / 864e5 <= 30; }), function (t) { return t.amount; }))))))));
  }

  function Vat(p) {
    var qs = ['Q2 2026', 'Q1 2026', 'Q4 2025'], q = useState('Q1 2026');
    var invs = p.invoices.filter(function (x) { return quarterOf(x.date) === q[0] && x.status !== 'Draft'; });
    var exps = p.expenses.filter(function (e) { return quarterOf(e.date) === q[0] && e.status === 'Booked'; });
    var base = q[0] === 'Q4 2025' ? 58400 : 0, outNet = sum(invs, function (x) { return x.amount; }) + base, outVat = outNet * 0.19, inVat = sum(exps, vatOf) + (base ? 4100 : 0), payable = outVat - inVat;
    var filed = p.filed[q[0]], deadline = { 'Q1 2026': '10.04.2026', 'Q2 2026': '10.07.2026', 'Q4 2025': '10.01.2026' }[q[0]];
    var rows = [['81', 'Taxable sales at 19% (net)', outNet], ['', 'Output VAT on those sales', outVat], ['66', 'Input VAT from receipts', -inVat], ['83', filed || q[0] !== 'Q2 2026' ? 'VAT payable' : 'VAT payable so far', payable]];
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'VAT return', subtitle: 'Quarterly advance return (Umsatzsteuer-Voranmeldung) · demo figures', actions: [h(H.Tabs, { key: 't', items: qs, value: q[0], onChange: q[1] })] })),
      h(H.Stagger, { key: q[0], className: 'ha-grid demo-4', delay: 80 },
        h(H.StatTile, { tint: 'mint', value: eur(outVat), label: 'Output VAT' }), h(H.StatTile, { tint: 'sky', value: eur(inVat), label: 'Input VAT' }),
        h(H.StatTile, { tint: 'butter', value: eur(payable), label: 'Payable to tax office' }), h(H.StatTile, { tint: filed ? 'mint' : 'placeholder', value: filed ? 'Filed' : deadline, label: filed ? 'on ' + filed : 'Deadline' })),
      h('div', { className: 'demo-split' },
        h(Section, { d: 260 }, h(H.Panel, { title: 'Return for ' + q[0], subtitle: invs.length + ' invoices · ' + exps.length + ' booked receipts' },
          h('div', { className: 'demo-vat' }, rows.map(function (r, i) { return h('div', { key: i, className: 'demo-vat-row' + (r[0] === '83' ? ' total' : '') }, h('span', { className: 'demo-vat-kz' }, r[0] ? 'Kz ' + r[0] : ''), h('span', { className: 'demo-vat-label' }, r[1]), h('b', null, eur(r[2], true))); })),
          h('div', { className: 'ha-row', style: { justifyContent: 'space-between' } }, h('span', { className: 'ha-card-desc' }, filed ? 'Submitted to the tax office (demo).' : q[0] === 'Q2 2026' ? 'The quarter is still running.' : 'Check the numbers, then mark as filed.'), filed ? h(H.Badge, { tone: 'success' }, 'Filed ' + filed) : h(H.Button, { icon: 'check', disabled: q[0] === 'Q2 2026', onClick: function () { p.file(q[0]); } }, 'Mark as filed')))),
        h(H.Panel, { side: true, title: 'Before you file' },
          h('div', { className: 'ha-col', style: { gap: 12 } },
            h(Check, { ok: p.expenses.filter(function (e) { return e.status === 'To review' && quarterOf(e.date) === q[0]; }).length === 0, text: 'All receipts of the quarter are booked' }),
            h(Check, { ok: p.bank.filter(function (t) { return !t.match; }).length === 0, text: 'Every bank transaction is matched' }),
            h(Check, { ok: p.expenses.filter(function (e) { return !e.receipt && quarterOf(e.date) === q[0]; }).length === 0, text: 'No receipts missing' }),
            h(Check, { ok: true, text: 'Invoices numbered without gaps' })),
          h('p', { className: 'ha-card-desc', style: { margin: 0 } }, 'Demo only. Real returns go through ELSTER or your tax advisor.'))));
  }
  function Check(p) { return h('div', { className: 'ha-row', style: { flexWrap: 'nowrap', alignItems: 'flex-start' } }, h('span', { className: 'demo-step-mark ' + (p.ok ? 'ok' : 'wait') }, h(H.Icon, { name: p.ok ? 'check' : 'clock', size: 13 })), h('span', { style: { font: '500 13px/20px var(--font-sans)' } }, p.text)); }

  function Pnl(p) {
    var months = []; for (var mi = 5; mi >= 0; mi--) months.push(new Date(2026, 3 - mi, 1));
    function inMonth(d, m) { return d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear(); }
    var revenue = months.map(monthRevenue);
    var cats = Object.keys(EXP_CATS), byCat = {};
    cats.forEach(function (c) { byCat[c] = months.map(function (m) { return Math.round(sum(p.expenses.filter(function (e) { return e.cat === c && inMonth(e.date, m); }), netOf)); }); });
    var salaries = months.map(function () { return 9800; });
    var totalCost = months.map(function (_, i) { return salaries[i] + sum(cats, function (c) { return byCat[c][i]; }); });
    var profit = months.map(function (_, i) { return revenue[i] - totalCost[i]; });
    function row(label, vals, cls) { return h('tr', { key: label, className: cls }, h('td', null, label), vals.map(function (v, i) { return h('td', { key: i, className: 'ha-num' }, eur(v)); }), h('td', { className: 'ha-num' }, h('b', null, eur(sum(vals, function (x) { return x; }))))); }
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Profit & loss', subtitle: 'Net figures, last 6 months · demo books', actions: [h(H.Button, { key: 'x', variant: 'secondary', icon: 'download', onClick: function () { p.toast('Export is not available in the demo'); } }, 'Export for tax advisor')] })),
      h(H.Stagger, { className: 'ha-grid demo-4', delay: 80 },
        h(H.StatTile, { tint: 'mint', value: eur(sum(revenue, function (x) { return x; })), label: 'Revenue (6 months)' }), h(H.StatTile, { tint: 'blush', value: eur(sum(totalCost, function (x) { return x; })), label: 'Costs (6 months)' }),
        h(H.StatTile, { tint: 'sky', value: eur(sum(profit, function (x) { return x; })), label: 'Profit before tax' }), h(H.StatTile, { tint: 'butter', value: Math.round(sum(profit, function (x) { return x; }) / sum(revenue, function (x) { return x; }) * 100) + '%', label: 'Margin' })),
      h(Section, { d: 260 }, h(H.Panel, { title: 'Profit per month', subtitle: '* April is month to date' }, h(H.BarChart, { height: 140, format: function (v) { return '€' + Math.round(v / 1000) + 'k'; }, data: months.map(function (m, i) { return { label: monthLabel(m), value: Math.max(0, profit[i]), tint: i === 4 ? 'mint' : null }; }) }))),
      h(Section, { d: 380 }, h('div', { className: 'ha-panel ha-panel-flush' }, h(Scroll, null, h('table', { className: 'ha-table demo-pnl' },
        h('thead', null, h('tr', null, h('th', null, ''), months.map(function (m, i) { return h('th', { key: i, className: 'ha-num' }, monthLabel(m)); }), h('th', { className: 'ha-num' }, 'Total'))),
        h('tbody', null, row('Revenue', revenue, 'strong'), row('Salaries (estimate)', salaries), cats.map(function (c) { return row(c, byCat[c]); }), row('Total costs', totalCost, 'strong'), row('Profit', profit, 'grand')))))));
  }

  /* ───────── CRM ───────── */
  var INDUSTRIES = ['Logistics', 'Design studio', 'Manufacturing', 'Retail', 'Research', 'Food', 'Banking', 'Hospitality', 'Agency', 'Shipping', 'Health', 'Industrial', 'Media', 'Freight', 'Legal'];
  var CITIES = ['Hamburg', 'Berlin', 'Munich', 'Cologne', 'Vienna', 'Zurich', 'Frankfurt', 'Dubai', 'Amsterdam', 'Copenhagen'];
  var companies = COMPANIES.map(function (c, i) {
    var plan = ['Team', 'Business', 'Starter', 'Team', 'Business'][i % 5];
    return { name: c, industry: INDUSTRIES[i % INDUSTRIES.length], city: CITIES[i % CITIES.length], plan: plan, seats: int(6, 80), mrr: { Starter: 190, Team: 1240, Business: 3900 }[plan] + int(-80, 300), owner: members[i % 6].name, health: i % 6 === 3 ? 'At risk' : i % 5 === 2 ? 'Watch' : 'Good', since: 2021 + (i % 5) };
  });
  var STAGES = [['lead', 'Lead', 'sky', 10], ['qualified', 'Qualified', 'mint', 30], ['proposal', 'Proposal', 'lilac', 60], ['negotiation', 'Negotiation', 'butter', 80], ['won', 'Won', 'mint', 100]];
  var deals = [
    ['Northwind', 'Seat upgrade · +40', 11520, 'negotiation'], ['Kestrel Bank', 'Business plan pilot', 46800, 'proposal'], ['Juniper Legal', 'Team plan + SSO', 18200, 'qualified'], ['Atlas Freight', 'Agent automation add-on', 9600, 'lead'],
    ['Morrow Health', 'DSGVO audit & rollout', 24000, 'proposal'], ['Orbit Foods', 'Renewal 2027', 14880, 'negotiation'], ['Pinegate', 'Starter → Team', 5400, 'qualified'], ['Quill Media', 'Content agents', 7200, 'lead'],
    ['Ferro Works', 'Shop-floor assistant', 31000, 'lead'], ['Sable Studio', 'Design seats', 3600, 'won'], ['Tidewater', 'API usage tier', 8400, 'won'], ['Lumen Labs', 'Onboarding workshop', 2600, 'qualified']
  ].map(function (d, i) { return { id: i + 1, company: d[0], title: d[1], value: d[2], stage: d[3], owner: members[(i * 3) % 8].name, close: (i % 3 ? 'May ' : 'Apr ') + (10 + i) }; });
  var ROLES_C = ['CEO', 'Head of Ops', 'Finance lead', 'IT admin', 'Office manager', 'Product lead'];
  var contacts = [];
  for (var ci = 0; ci < 26; ci++) { var co = COMPANIES[ci % COMPANIES.length], fn2 = FIRST[(ci * 7 + 3) % FIRST.length], ln2 = LAST[(ci * 5 + 1) % LAST.length]; contacts.push({ id: ci, name: fn2 + ' ' + ln2, company: co, role: ROLES_C[ci % ROLES_C.length], email: fn2.toLowerCase() + '@' + co.toLowerCase().replace(/[^a-z]/g, '') + '.example', phone: '+49 40 555 ' + (1000 + ci * 37), last: int(1, 40) }); }
  contacts[0] = Object.assign(contacts[0], { name: 'Ida Nolan', company: 'Northwind', role: 'Head of Ops', email: 'ida@northwind.example' });
  var HEALTH_TONE = { Good: 'success', Watch: 'warning', 'At risk': 'danger' };

  function Companies(p) {
    var q = useState(''), f = useState('All');
    var list = p.companies.filter(function (c) { return (f[0] === 'All' || c.health === f[0] || c.plan === f[0]) && (!q[0] || (c.name + c.industry + c.city).toLowerCase().indexOf(q[0].toLowerCase()) > -1); });
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Companies', subtitle: p.companies.length + ' customers · demo data', actions: [h(H.SearchField, { key: 's', placeholder: 'Search companies', value: q[0], onChange: function (e) { q[1](e.target.value); } }), h(H.Button, { key: 'd', icon: 'plus', onClick: p.onDeal }, 'New deal')] })),
      h(H.Stagger, { className: 'ha-grid demo-4', delay: 80 },
        h(H.StatTile, { tint: 'butter', value: eur(sum(p.companies, function (c) { return c.mrr; })), label: 'Monthly recurring revenue' }),
        h(H.StatTile, { tint: 'sky', value: String(p.companies.length), label: 'Customers' }),
        h(H.StatTile, { tint: 'placeholder', value: String(p.companies.filter(function (c) { return c.health !== 'Good'; }).length), label: 'Need attention' }),
        h(H.StatTile, { tint: 'mint', value: eur(sum(p.deals.filter(function (d) { return d.stage !== 'won'; }), function (d) { return d.value; })), label: 'Open pipeline' })),
      h(Section, { d: 240 }, h('div', { className: 'ha-row' }, ['All', 'Good', 'Watch', 'At risk', 'Business', 'Team', 'Starter'].map(function (t) { return h(H.Chip, { key: t, selected: f[0] === t, onClick: function () { f[1](t); } }, t); }))),
      h(Section, { d: 300 }, h('div', { className: 'ha-panel ha-panel-flush' }, h(Scroll, null, h(H.Table, { key: f[0] + q[0], columns: [
        { key: 'name', label: 'Company', render: function (c) { return h('button', { type: 'button', className: 'demo-link', onClick: function () { p.open(c.name); } }, h(H.Avatar, { name: c.name, size: 30 }), h('span', null, h('div', null, c.name), h('div', { style: { font: '500 12px/16px var(--font-sans)', color: 'var(--ink-muted)' } }, c.industry + ' · ' + c.city))); } },
        { key: 'plan', label: 'Plan', render: function (c) { return h(H.Badge, { tone: c.plan === 'Business' ? 'highlight' : c.plan === 'Team' ? 'info' : 'neutral', dot: false }, c.plan + ' · ' + c.seats + ' seats'); } },
        { key: 'mrr', label: 'MRR', align: 'right', render: function (c) { return eur(c.mrr); } },
        { key: 'health', label: 'Health', render: function (c) { return h(H.Badge, { tone: HEALTH_TONE[c.health] }, c.health); } },
        { key: 'owner', label: 'Owner', render: function (c) { return h('span', { className: 'ha-row', style: { flexWrap: 'nowrap' } }, h(H.Avatar, { name: c.owner, size: 24 }), c.owner.split(' ')[0]); } },
        { key: 'x', label: '', align: 'right', render: function (c) { return h(H.IconButton, { icon: 'chevronRight', label: 'Open ' + c.name, size: 'sm', onClick: function () { p.open(c.name); } }); } }], rows: list })))));
  }

  function Pipeline(p) {
    var drag = useState(null);
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Pipeline', subtitle: 'Weighted ' + eur(sum(p.deals, function (d) { return d.value * STAGES.filter(function (s) { return s[0] === d.stage; })[0][3] / 100; })) + ' · drag deals between stages', actions: [h(H.Button, { key: 'd', icon: 'plus', onClick: p.onDeal }, 'New deal')] })),
      h('div', { className: 'demo-board demo-board-5' }, STAGES.map(function (s, si) {
        var items = p.deals.filter(function (d) { return d.stage === s[0]; });
        return h('div', { key: s[0], className: 'demo-col' + (drag[0] && drag[0].over === s[0] ? ' over' : ''), onDragOver: function (e) { e.preventDefault(); if (drag[0] && drag[0].over !== s[0]) drag[1]({ id: drag[0].id, over: s[0] }); }, onDrop: function (e) { e.preventDefault(); var d = p.deals.filter(function (x) { return x.id === (drag[0] && drag[0].id); })[0]; if (d && d.stage !== s[0]) p.move(d, s[0]); drag[1](null); } },
          h('section', { className: 'ha-kanban' },
            h('div', { className: 'ha-kanban-head' }, h('span', { className: 'ha-row', style: { gap: 8, flexWrap: 'nowrap' } }, h('span', { className: 'demo-dot', style: { background: 'var(--' + s[2] + '-ink)' } }), s[1], h('span', { className: 'ha-kanban-count' }, items.length)), h('span', { className: 'demo-stage-sum' }, eur(sum(items, function (d) { return d.value; })))),
            h(H.Stagger, { className: 'ha-col', style: { gap: 8 }, delay: 120 + si * 80 }, items.map(function (d) {
              return h('div', { key: d.id, draggable: true, onDragStart: function () { drag[1]({ id: d.id, over: null }); }, onDragEnd: function () { drag[1](null); }, style: { cursor: 'grab' } },
                h(H.Card, { tint: s[0] === 'won' ? 'mint' : null, eyebrow: d.company, title: d.title, onClick: function () { p.open(d.company); }, status: h('b', { className: 'demo-deal-val' }, eur(d.value)), actions: [h(H.Avatar, { key: 'a', name: d.owner, size: 22 }), h(H.IconButton, { key: 'l', icon: 'chevronLeft', label: 'Move back', size: 'sm', disabled: si === 0, onClick: function (e) { e.stopPropagation(); p.move(d, STAGES[si - 1][0]); } }), h(H.IconButton, { key: 'r', icon: 'chevronRight', label: 'Move forward', size: 'sm', disabled: si === STAGES.length - 1, onClick: function (e) { e.stopPropagation(); p.move(d, STAGES[si + 1][0]); } })] }, h('span', { className: 'ha-card-desc' }, 'Close ' + d.close + ' · ' + s[3] + '% likely')));
            }))));
      })));
  }

  function Contacts(p) {
    var q = useState('');
    var list = p.contacts.filter(function (c) { return !q[0] || (c.name + c.company + c.role + c.email).toLowerCase().indexOf(q[0].toLowerCase()) > -1; });
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Contacts', subtitle: p.contacts.length + ' people at your customers', actions: [h(H.SearchField, { key: 's', placeholder: 'Search people', value: q[0], onChange: function (e) { q[1](e.target.value); } })] })),
      h(H.Stagger, { key: q[0], className: 'ha-grid demo-3', delay: 80 }, list.slice(0, 18).map(function (c) {
        return h(H.Card, { key: c.id, onClick: function () { p.open(c.company); }, corner: h(H.Avatar, { name: c.name, size: 36 }), eyebrow: c.company, title: c.name, description: c.role, status: h('span', { className: 'ha-card-desc' }, 'Last contact ' + c.last + 'd ago'), actions: [h(H.IconButton, { key: 'm', icon: 'mail', label: 'Write to ' + c.name, size: 'sm', onClick: function (e) { e.stopPropagation(); p.compose(c.email); } })] },
          h('div', { className: 'demo-contact' }, h('span', { className: 'demo-mono demo-ellipsis' }, c.email), h('span', { className: 'demo-mono' }, c.phone)));
      })));
  }

  function CompanyDrawer(p) {
    var c = p.company, tab = useState('Overview');
    var invs = p.invoices.filter(function (x) { return x.company === c.name; }).slice(0, 8);
    var people = p.contacts.filter(function (x) { return x.company === c.name; });
    var mails = p.mail.filter(function (m) { return m.email.indexOf(c.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 6)) > -1 || m.subject.indexOf(c.name) > -1 || m.from.indexOf(c.name) > -1; });
    var ds = p.deals.filter(function (d) { return d.company === c.name; });
    var dref = React.useRef(null); useTrap(dref);
    useEffect(function () { function k(e) { if (e.key === 'Escape') p.onClose(); } document.addEventListener('keydown', k); return function () { document.removeEventListener('keydown', k); }; }, []);
    return h('div', { ref: dref, className: 'demo-drawer-wrap', onMouseDown: function (e) { if (e.target === e.currentTarget) p.onClose(); } },
      h('aside', { className: 'demo-drawer', role: 'dialog', 'aria-modal': 'true', 'aria-label': c.name },
        h('div', { className: 'ha-header', style: { alignItems: 'center' } }, h('div', { className: 'ha-row', style: { flexWrap: 'nowrap', minWidth: 0 } }, h(H.Avatar, { name: c.name, size: 44 }), h('div', { style: { minWidth: 0 } }, h('div', { className: 'ha-panel-title' }, c.name), h('div', { className: 'ha-panel-sub' }, c.industry + ' · ' + c.city + ' · customer since ' + c.since))), h(H.IconButton, { icon: 'x', label: 'Close', onClick: p.onClose })),
        h('div', { className: 'ha-row' }, h(H.Badge, { tone: HEALTH_TONE[c.health] }, c.health), h(H.Badge, { tone: 'info', dot: false }, c.plan + ' · ' + c.seats + ' seats'), h(H.Badge, { dot: false }, 'Owner: ' + c.owner)),
        h(H.Tabs, { block: true, items: ['Overview', 'Invoices', 'Mail', 'Agent brief'], value: tab[0], onChange: tab[1] }),
        h('div', { key: tab[0], className: 'ha-col ha-in', style: { gap: 14 } },
          tab[0] === 'Overview' && h(React.Fragment, null,
            h('div', { className: 'ha-grid demo-2' }, h(H.StatTile, { tint: 'butter', value: eur(c.mrr), label: 'MRR' }), h(H.StatTile, { tint: 'mint', value: eur(sum(p.invoices.filter(function (x) { return x.company === c.name && x.status === 'Paid'; }), function (x) { return x.amount; })), label: 'Paid to date (demo)' })),
            ds.length > 0 && h('div', { className: 'ha-col', style: { gap: 8 } }, h('b', null, 'Open deals'), ds.map(function (d) { return h('div', { key: d.id, className: 'demo-file' }, h(H.TintIcon, { icon: 'trend', tint: 'lilac' }), h('div', { style: { flex: 1, minWidth: 0 } }, h('div', { className: 'ha-file-name' }, d.title), h('div', { className: 'ha-file-meta' }, STAGES.filter(function (s) { return s[0] === d.stage; })[0][1] + ' · close ' + d.close)), h('b', null, eur(d.value))); })),
            h('div', { className: 'ha-col', style: { gap: 8 } }, h('b', null, 'People'), people.length ? people.map(function (x) { return h(H.ListRow, { key: x.id, avatar: x.name, title: x.name, subtitle: x.role + ' · ' + x.email, onClick: function () { p.compose(x.email); }, trailing: h(H.Icon, { name: 'mail', size: 15 }) }); }) : h('span', { className: 'ha-card-desc' }, 'No contacts yet.'))),
          tab[0] === 'Invoices' && (invs.length ? h(H.Table, { animate: true, columns: [{ key: 'id', label: 'Invoice', render: function (x) { return '#' + x.id; } }, { key: 'date', label: 'Issued', render: function (x) { return fmtDate(x.date); } }, { key: 'status', label: 'Status', render: function (x) { return h(H.Badge, { tone: TONE[x.status] || 'neutral' }, x.status); } }, { key: 'amount', label: 'Net', align: 'right', render: function (x) { return eur(x.amount, true); } }], rows: invs }) : h('span', { className: 'ha-card-desc' }, 'No invoices yet.')),
          tab[0] === 'Mail' && (mails.length ? mails.map(function (m) { return h(H.ListRow, { key: m.id, avatar: m.from, title: m.subject, subtitle: m.from + ' · ' + m.date, onClick: function () { p.goMail(); } }); }) : h('span', { className: 'ha-card-desc' }, 'No mail with ' + c.name + ' in the demo mailbox.')),
          tab[0] === 'Agent brief' && h('div', { className: 'demo-brief' }, h('div', { className: 'ha-row', style: { flexWrap: 'nowrap' } }, h('span', { className: 'demo-agent-mark sm ha-t-mint' }, h(H.Icon, { name: 'bot', size: 14 })), h('b', null, 'Nova · account brief')),
            h('p', null, c.name + ' (' + c.industry.toLowerCase() + ', ' + c.city + ') has been a customer since ' + c.since + ' on the ' + c.plan + ' plan with ' + c.seats + ' seats.'),
            h('p', null, c.health === 'Good' ? 'Usage is healthy and growing. Good moment to suggest the next plan or an agent add-on.' : c.health === 'Watch' ? 'Logins dropped about 20% in the last month. A short check-in call would help.' : 'Two support tickets about billing and falling usage. Treat as a renewal risk and reach out this week.'),
            h('div', { className: 'ha-row' }, h(H.Button, { size: 'sm', variant: 'soft', icon: 'edit', onClick: function () { p.compose(people[0] ? people[0].email : ''); } }, 'Draft check-in mail'), h(H.Button, { size: 'sm', variant: 'ghost', icon: 'refresh', onClick: function () { p.toast('Nova refreshed the brief'); } }, 'Refresh'))))));
  }

  /* ───────── Command palette ───────── */
  function Palette(p) {
    var q = useState(''), idx = useState(0), inputRef = React.useRef(null), listRef = React.useRef(null), pref = React.useRef(null); useTrap(pref);
    useEffect(function () { if (inputRef.current) inputRef.current.focus(); }, []);
    var all = p.items, ql = q[0].toLowerCase().trim();
    var res = ql ? all.filter(function (it) { return ql.split(/\s+/).every(function (w) { return (it.label + ' ' + (it.hint || '') + ' ' + it.group).toLowerCase().indexOf(w) > -1; }); }) : all.filter(function (it) { return it.group !== 'Records'; });
    res = res.slice(0, 40);
    var cur = Math.min(idx[0], Math.max(0, res.length - 1));
    useEffect(function () { var el = listRef.current && listRef.current.querySelector('[data-i="' + cur + '"]'); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' }); }, [cur, ql]);
    function key(e) { if (e.key === 'ArrowDown') { e.preventDefault(); idx[1](Math.min(res.length - 1, cur + 1)); } else if (e.key === 'ArrowUp') { e.preventDefault(); idx[1](Math.max(0, cur - 1)); } else if (e.key === 'Enter') { e.preventDefault(); if (res[cur]) { p.onClose(); res[cur].run(); } } else if (e.key === 'Escape') p.onClose(); }
    var groups = []; res.forEach(function (it, i) { if (!groups.length || groups[groups.length - 1].g !== it.group) groups.push({ g: it.group, items: [] }); groups[groups.length - 1].items.push([it, i]); });
    return h('div', { ref: pref, className: 'demo-palette-wrap', onMouseDown: function (e) { if (e.target === e.currentTarget) p.onClose(); } },
      h('div', { className: 'demo-palette', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Command palette' },
        h('div', { className: 'demo-palette-input' }, h(H.Icon, { name: 'search', size: 18 }), h('input', { ref: inputRef, id: 'palette-q', placeholder: 'Search pages, actions, customers, invoices…', 'aria-label': 'Search', value: q[0], onChange: function (e) { q[1](e.target.value); idx[1](0); }, onKeyDown: key, role: 'combobox', 'aria-expanded': 'true', 'aria-controls': 'palette-list' }), h('kbd', null, 'Esc')),
        h('div', { id: 'palette-list', ref: listRef, className: 'demo-palette-list', role: 'listbox' }, res.length ? groups.map(function (g) { return h('div', { key: g.g }, h('div', { className: 'demo-palette-group' }, g.g), g.items.map(function (pair) { var it = pair[0], i = pair[1]; return h('button', { key: it.id, type: 'button', role: 'option', 'aria-selected': i === cur ? 'true' : 'false', 'data-i': i, className: 'demo-palette-item', onMouseMove: function () { if (i !== cur) idx[1](i); }, onClick: function () { p.onClose(); it.run(); } }, h(H.TintIcon, { icon: it.icon, tint: it.tint || 'plain' }), h('span', { className: 'demo-palette-label' }, h('b', null, it.label), it.hint && h('span', null, it.hint)), i === cur && h('kbd', null, '↵')); })); }) : h('div', { className: 'demo-palette-empty' }, 'Nothing matches "' + q[0] + '". Try a page name, a customer or an invoice number.')),
        h('div', { className: 'demo-palette-foot' }, h('span', null, h('kbd', null, '↑'), h('kbd', null, '↓'), ' to move'), h('span', null, h('kbd', null, '↵'), ' to open'), h('span', null, h('kbd', null, '⌘'), h('kbd', null, 'K'), ' anywhere'))));
  }

  /* ───────── Notifications ───────── */
  var NOTES0 = [
    { id: 1, icon: 'bot', tint: 'lilac', title: 'Atlas needs your approval', text: '4 reply drafts are waiting', page: 'runs', time: '07:55', unread: true },
    { id: 2, icon: 'flag', tint: 'blush', title: 'Invoice #2041 is overdue', text: 'Harbor & Co · €860', page: 'billing', time: '07:30', unread: true },
    { id: 3, icon: 'zap', tint: 'sky', title: 'agent-runtime is building', text: 'Preview for tools-retry', page: 'deployments', time: '07:12', unread: true },
    { id: 4, icon: 'globe', tint: 'butter', title: 'halo.dev expires in 18 days', text: 'Auto-renew is off', page: 'domains', time: 'Yesterday', unread: true },
    { id: 5, icon: 'swap', tint: 'mint', title: '4 bank transactions to match', text: 'Ledger has suggestions ready', page: 'bank', time: 'Yesterday', unread: false },
    { id: 6, icon: 'trend', tint: 'mint', title: 'Northwind moved to Negotiation', text: 'Seat upgrade · €11,520', page: 'pipeline', time: 'Mon', unread: false },
    { id: 7, icon: 'x', tint: 'blush', title: 'Echo stopped', text: 'Docs connection expired', page: 'agents', time: 'Mon', unread: false },
    { id: 8, icon: 'users', tint: 'sky', title: 'Ava Brandt joined', text: 'Invited as Viewer', page: 'people', time: 'Sun', unread: false }];
  function NotePanel(p) {
    var f = useState('All'), list = p.notes.filter(function (n) { return f[0] === 'All' || n.unread; });
    return h('div', { className: 'demo-notes', role: 'dialog', 'aria-label': 'Notifications' },
      h('div', { className: 'ha-header', style: { alignItems: 'center', padding: '8px 12px 0' } }, h('b', { style: { fontSize: 16 } }, 'Notifications'), h(H.Button, { variant: 'ghost', size: 'sm', icon: 'check', disabled: !p.notes.some(function (n) { return n.unread; }), onClick: p.readAll }, 'Mark all read')),
      h('div', { style: { padding: '0 8px' } }, h(H.Tabs, { block: true, items: ['All', 'Unread'], value: f[0], onChange: f[1] })),
      h('div', { className: 'demo-notes-list' }, list.length ? list.map(function (n) {
        return h('button', { key: n.id, type: 'button', className: 'demo-note' + (n.unread ? ' unread' : ''), onClick: function () { p.open(n); } }, h(H.TintIcon, { icon: n.icon, tint: n.tint }), h('span', { className: 'demo-note-text' }, h('b', null, n.title), h('span', null, n.text)), h('span', { className: 'demo-note-time' }, n.time, n.unread && h('span', { className: 'ha-unread' })));
      }) : h('div', { className: 'demo-mail-empty', style: { minHeight: 160 } }, h(H.TintIcon, { icon: 'check', tint: 'mint', size: 40 }), h('b', null, 'You are all caught up'))));
  }

  /* ───────── Workflows ───────── */
  var STEP_KINDS = { trigger: ['zap', 'sky', 'When'], agent: ['bot', 'lilac', 'Agent'], approval: ['user', 'butter', 'Approval'], action: ['send', 'mint', 'Then'], condition: ['filter', 'blush', 'If'] };
  var WORKFLOWS0 = [
    { id: 'w1', name: 'Support replies', enabled: true, runs: 214, steps: [{ k: 'trigger', t: 'New email arrives in Inbox' }, { k: 'condition', t: 'Label is Customers' }, { k: 'agent', t: 'Atlas drafts a reply from the knowledge base', agent: 'atlas' }, { k: 'approval', t: 'Mara approves the draft' }, { k: 'action', t: 'Send the reply and log it on the company' }] },
    { id: 'w2', name: 'Receipt to booking', enabled: true, runs: 96, steps: [{ k: 'trigger', t: 'Receipt uploaded to Expenses' }, { k: 'agent', t: 'Ledger reads vendor, amount and VAT', agent: 'ledger' }, { k: 'condition', t: 'Amount is over €500' }, { k: 'approval', t: 'Finance lead approves' }, { k: 'action', t: 'Book the expense and match the bank transaction' }] },
    { id: 'w3', name: 'Lead research', enabled: false, runs: 37, steps: [{ k: 'trigger', t: 'New trial sign-up' }, { k: 'agent', t: 'Nova writes an account brief', agent: 'nova' }, { k: 'action', t: 'Create a Lead deal in the pipeline' }] },
    { id: 'w4', name: 'Domain watch', enabled: true, runs: 12, steps: [{ k: 'trigger', t: 'Every morning at 07:00' }, { k: 'agent', t: 'Scout checks domains and certificates', agent: 'scout' }, { k: 'condition', t: 'Something expires within 30 days' }, { k: 'action', t: 'Send a notification to Mara' }] }];
  var STEP_TEMPLATES = { agent: 'Atlas summarises the result', approval: 'A person approves before continuing', action: 'Post a summary to the team', condition: 'Only continue if the amount is over €100' };
  function Workflows(p) {
    var sel = useState(p.flows[0].id), run = useState(null), edit = useState(null);
    var w = p.flows.filter(function (x) { return x.id === sel[0]; })[0] || p.flows[0];
    useEffect(function () {
      if (!run[0] || run[0].wait) return;
      if (run[0].i >= w.steps.length) { var tt = setTimeout(function () { run[1](null); p.toast('Test run of "' + w.name + '" finished'); }, 900); return function () { clearTimeout(tt); }; }
      var t = setTimeout(function () { var st = w.steps[run[0].i]; if (st.k === 'approval') run[1]({ i: run[0].i, wait: true }); else run[1]({ i: run[0].i + 1 }); }, 850);
      return function () { clearTimeout(t); };
    }, [run[0], w.id]);
    function upd(steps) { p.setFlow(w.id, { steps: steps }); }
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Workflows', subtitle: 'Chain agents, approvals and actions · test runs are simulated', actions: [h(H.Button, { key: 'n', icon: 'plus', onClick: function () { var id = 'w' + Date.now(); p.addFlow({ id: id, name: 'New workflow', enabled: false, runs: 0, steps: [{ k: 'trigger', t: 'New email arrives in Inbox' }, { k: 'agent', t: 'Atlas drafts a reply', agent: 'atlas' }, { k: 'approval', t: 'You approve the draft' }] }); sel[1](id); } }, 'New workflow')] })),
      h('div', { className: 'demo-split-wide' },
        h(Section, { d: 80 }, h('div', { className: 'ha-panel ha-panel-flush ha-panel-list' }, h(H.Stagger, { className: 'ha-list', delay: 100 }, p.flows.map(function (x) { return h(H.ListRow, { key: x.id, active: x.id === w.id, onClick: function () { sel[1](x.id); run[1](null); }, leading: h(H.TintIcon, { icon: 'zap', tint: x.enabled ? 'mint' : 'plain' }), title: x.name, subtitle: x.steps.length + ' steps · ' + x.runs + ' runs', trailing: h(H.Badge, { tone: x.enabled ? 'success' : 'neutral' }, x.enabled ? 'On' : 'Off') }); })))),
        h(Section, { d: 160 }, h('div', { className: 'ha-panel', style: { gap: 16 } },
          h('div', { className: 'ha-header', style: { alignItems: 'center' } },
            h('input', { className: 'demo-title-input', id: 'wf-name-' + w.id, 'aria-label': 'Workflow name', value: w.name, onChange: function (e) { p.setFlow(w.id, { name: e.target.value }); } }),
            h('div', { className: 'ha-row' }, h(H.Switch, { checked: w.enabled, onChange: function (e) { p.setFlow(w.id, { enabled: e.target.checked }); p.toast(w.name + (e.target.checked ? ' is on' : ' is off')); } }, w.enabled ? 'On' : 'Off'), h(H.Button, { variant: 'soft', icon: 'play', disabled: !!run[0], onClick: function () { run[1]({ i: 0 }); } }, run[0] ? 'Running…' : 'Test run'))),
          h('ol', { className: 'demo-flow' }, w.steps.map(function (s, i) {
            var k = STEP_KINDS[s.k], state = !run[0] ? '' : i < run[0].i ? 'done' : i === run[0].i ? (run[0].wait ? 'wait' : 'active') : '';
            return h('li', { key: i + s.k, className: 'demo-node ' + state + ' ha-in', style: { '--d': (200 + i * 70) + 'ms' } },
              h('span', { className: 'demo-node-icon ha-t-' + k[1] }, h(H.Icon, { name: state === 'done' ? 'check' : k[0], size: 16 })),
              h('div', { className: 'demo-node-card' },
                h('div', { className: 'demo-node-kind' }, k[2], state === 'active' && h('span', { className: 'demo-node-live' }, 'running'), state === 'wait' && h('span', { className: 'demo-node-live wait' }, 'waiting for you')),
                edit[0] === i ? h('input', { className: 'ha-input', id: 'wf-step-' + i, autoFocus: true, value: s.t, 'aria-label': 'Step text', onChange: function (e) { upd(w.steps.map(function (x, j) { return j === i ? Object.assign({}, x, { t: e.target.value }) : x; })); }, onBlur: function () { edit[1](null); }, onKeyDown: function (e) { if (e.key === 'Enter') edit[1](null); } }) : h('div', { className: 'demo-node-text' }, s.t),
                state === 'wait' && h('div', { className: 'ha-row', style: { marginTop: 8 } }, h(H.Button, { size: 'sm', icon: 'check', onClick: function () { run[1]({ i: i + 1 }); } }, 'Approve'), h(H.Button, { size: 'sm', variant: 'ghost', onClick: function () { run[1](null); p.toast('Test run stopped at the approval step'); } }, 'Reject'))),
              s.k !== 'trigger' && !run[0] && h('div', { className: 'demo-node-tools' }, h(H.IconButton, { icon: 'edit', label: 'Edit step', size: 'sm', onClick: function () { edit[1](i); } }), h(H.IconButton, { icon: 'trash', label: 'Remove step', size: 'sm', onClick: function () { upd(w.steps.filter(function (_, j) { return j !== i; })); } })));
          })),
          !run[0] && h('div', { className: 'demo-flow-add' }, h('span', { className: 'ha-card-desc' }, 'Add a step'), ['agent', 'condition', 'approval', 'action'].map(function (kk) { return h(H.Chip, { key: kk, icon: STEP_KINDS[kk][0], onClick: function () { upd(w.steps.concat([{ k: kk, t: STEP_TEMPLATES[kk] }])); } }, STEP_KINDS[kk][2]); }))))));
  }

  /* ───────── Roles & audit ───────── */
  var PERM_AREAS = ['Workspace', 'Customers', 'Agents', 'Mail', 'Code', 'Domains', 'Finance', 'Files'];
  var LEVELS = ['None', 'View', 'Edit', 'Full'];
  var ROLES0 = [
    { name: 'Owner', people: 1, locked: true, p: [3, 3, 3, 3, 3, 3, 3, 3] },
    { name: 'Admin', people: 5, p: [3, 3, 3, 2, 3, 3, 2, 3] },
    { name: 'Editor', people: 18, p: [2, 2, 1, 2, 2, 1, 0, 2] },
    { name: 'Viewer', people: 12, p: [1, 1, 1, 0, 1, 0, 0, 1] },
    { name: 'Accountant', people: 1, p: [1, 1, 0, 0, 0, 0, 3, 2] },
    { name: 'Agents (service)', people: 6, p: [1, 1, 0, 2, 1, 1, 2, 1] }];
  var LEVEL_TONE = ['plain', 'sky', 'mint', 'lilac'];
  function Roles(p) {
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Roles & access', subtitle: 'Click a cell to change what a role can do · demo only' })),
      h(Section, { d: 80 }, h('div', { className: 'ha-legend' }, LEVELS.map(function (l, i) { return h('span', { key: l }, h('i', { style: { background: i ? 'var(--' + LEVEL_TONE[i] + '-ink)' : 'var(--line-strong)' } }), l); }))),
      h(Section, { d: 160 }, h('div', { className: 'ha-panel ha-panel-flush' }, h(Scroll, null, h('table', { className: 'ha-table demo-perm' },
        h('thead', null, h('tr', null, h('th', null, 'Role'), PERM_AREAS.map(function (a) { return h('th', { key: a }, a); }))),
        h('tbody', { className: 'ha-stagger', style: { '--base': '200ms' } }, p.roles.map(function (r, ri) {
          return h('tr', { key: r.name }, h('td', null, h('div', { style: { fontWeight: 700 } }, r.name), h('div', { className: 'ha-card-desc' }, r.people + (r.people === 1 ? ' member' : ' members'))),
            r.p.map(function (lv, ai) { return h('td', { key: ai }, h('button', { type: 'button', className: 'demo-perm-cell lv' + lv, disabled: r.locked, 'aria-label': r.name + ' · ' + PERM_AREAS[ai] + ': ' + LEVELS[lv] + (r.locked ? '' : '. Click to change'), onClick: function () { p.cycle(ri, ai); } }, LEVELS[lv])); }));
        })))))),
      h(Section, { d: 300 }, h('p', { className: 'ha-card-desc', style: { margin: 0 } }, 'Agents get their own service role, so you can see and limit what automation may touch. Owner access cannot be reduced.')));
  }
  function Audit(p) {
    var f = useState('All'), q = useState('');
    var list = p.audit.filter(function (a) { return (f[0] === 'All' || (f[0] === 'Agents' ? a.agent : a.area === f[0])) && (!q[0] || (a.who + a.what + a.area).toLowerCase().indexOf(q[0].toLowerCase()) > -1); });
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Audit log', subtitle: 'Every change by people and agents · your actions in this demo appear here too', actions: [h(H.SearchField, { key: 's', placeholder: 'Search the log', value: q[0], onChange: function (e) { q[1](e.target.value); } })] })),
      h(Section, { d: 80 }, h('div', { className: 'ha-row' }, ['All', 'Agents', 'Workspace', 'Agents area', 'Finance', 'Mail', 'Domains', 'Account'].filter(function (x) { return x !== 'Agents area'; }).map(function (t) { return h(H.Chip, { key: t, selected: f[0] === t, onClick: function () { f[1](t); } }, t); }))),
      h(Section, { d: 160 }, h('div', { className: 'ha-panel ha-panel-flush' }, h(Scroll, null, h(H.Table, { key: f[0] + q[0] + p.audit.length, columns: [
        { key: 'time', label: 'When', render: function (a) { return h('span', { className: 'demo-mono' }, a.time); } },
        { key: 'who', label: 'Who', render: function (a) { return h('span', { className: 'ha-row', style: { flexWrap: 'nowrap' } }, a.agent ? h('span', { className: 'demo-agent-mark sm ha-t-lilac' }, h(H.Icon, { name: 'bot', size: 13 })) : h(H.Avatar, { name: a.who, size: 26 }), a.who); } },
        { key: 'what', label: 'What happened' },
        { key: 'area', label: 'Area', render: function (a) { return h(H.Badge, { dot: false }, a.area); } },
        { key: 'ip', label: 'Source', render: function (a) { return h('span', { className: 'demo-mono ha-card-desc' }, a.ip); } }], rows: list.slice(0, 30) })))));
  }
  var AUDIT0 = [
    ['10:12', 'Atlas', true, 'Drafted 4 replies (waiting for approval)', 'Mail', 'agent'], ['09:58', 'Ledger', true, 'Matched 31 bank transactions', 'Finance', 'agent'], ['09:41', 'Jonah Petit', false, 'Changed Ava Brandt to Viewer', 'Account', '84.17.x.x'],
    ['09:20', 'Mara Ellis', false, 'Approved project "Mobile app beta"', 'Workspace', '91.73.x.x'], ['08:55', 'Patch', true, 'Commented on PR #418', 'Code', 'agent'], ['08:31', 'Sun Lee', false, 'Started deployment of agent-runtime', 'Code', '84.17.x.x'],
    ['Yesterday', 'Rui Costa', false, 'Exported invoices for March', 'Finance', '62.214.x.x'], ['Yesterday', 'Scout', true, 'Paused by Mara Ellis', 'Agents', 'agent'], ['Yesterday', 'Mara Ellis', false, 'Added DNS record CNAME api', 'Domains', '91.73.x.x'], ['Mon', 'Mara Ellis', false, 'Signed in from a new device', 'Account', '91.73.x.x']
  ].map(function (a, i) { return { id: i, time: a[0], who: a[1], agent: a[2], what: a[3], area: a[4], ip: a[5] }; });

  /* ───────── Files ───────── */
  var FILE_KIND = { pdf: ['file', 'blush'], doc: ['book', 'sky'], sheet: ['chart', 'mint'], fig: ['sparkle', 'lilac'], img: ['eye', 'butter'], zip: ['folder', 'butter'] };
  var FOLDERS = ['All', 'Contracts', 'Receipts', 'Design', 'Agent knowledge', 'Exports'];
  var FILES0 = [
    ['Northwind – master agreement.pdf', 'pdf', '412 KB', 'Contracts', 'Mara Ellis', 'Today', true], ['Kestrel Bank – proposal v3.pdf', 'pdf', '1.8 MB', 'Contracts', 'Ida Nolan', 'Yesterday', true], ['DPA template (DSGVO).doc', 'doc', '96 KB', 'Contracts', 'Mara Ellis', 'Mon', false],
    ['hetzner-april.pdf', 'pdf', '88 KB', 'Receipts', 'Ledger', 'Today', false], ['figma-q2.pdf', 'pdf', '74 KB', 'Receipts', 'Ledger', 'Yesterday', false], ['db-ticket-hamburg-berlin.pdf', 'pdf', '120 KB', 'Receipts', 'Rui Costa', 'Mon', false],
    ['pricing-tiers.fig', 'fig', '18 MB', 'Design', 'Jonah Petit', 'Today', true], ['dashboard-shots.png', 'img', '2.4 MB', 'Design', 'Jonah Petit', 'Yesterday', false], ['brand-assets.zip', 'zip', '36 MB', 'Design', 'Jonah Petit', 'Apr 2', true],
    ['help-center-export.doc', 'doc', '2.2 MB', 'Agent knowledge', 'Atlas', '12 min ago', false], ['support-macros.sheet', 'sheet', '58 KB', 'Agent knowledge', 'Sun Lee', 'Yesterday', false], ['refund-policy.doc', 'doc', '24 KB', 'Agent knowledge', 'Mara Ellis', 'Mon', false],
    ['invoices-march.sheet', 'sheet', '140 KB', 'Exports', 'Rui Costa', 'Yesterday', false], ['pnl-q1-2026.sheet', 'sheet', '92 KB', 'Exports', 'Ledger', 'Apr 1', true], ['audit-log-q1.sheet', 'sheet', '310 KB', 'Exports', 'Mara Ellis', 'Apr 1', false]
  ].map(function (f, i) { return { id: i, name: f[0], kind: f[1], size: f[2], folder: f[3], owner: f[4], updated: f[5], shared: f[6] }; });
  function kindOf(name, type) { var n = name.toLowerCase(); if (/\.pdf$/.test(n)) return 'pdf'; if (/\.(png|jpe?g|gif|webp|heic)$/.test(n) || /^image\//.test(type || '')) return 'img'; if (/\.(xlsx?|csv|numbers)$/.test(n)) return 'sheet'; if (/\.(fig|sketch)$/.test(n)) return 'fig'; if (/\.(zip|rar|7z)$/.test(n)) return 'zip'; return 'doc'; }
  function fmtSize(b) { return b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB'; }
  function Files(p) {
    var folder = useState('All'), view = useState('grid'), q = useState(''), over = useState(false), prev = useState(null);
    var list = p.files.filter(function (f) { return (folder[0] === 'All' || f.folder === folder[0]) && (!q[0] || f.name.toLowerCase().indexOf(q[0].toLowerCase()) > -1); });
    function drop(e) { e.preventDefault(); over[1](false); if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) p.add(e.dataTransfer.files, folder[0] === 'All' ? 'Receipts' : folder[0]); }
    return h('div', { className: 'demo-files' + (over[0] ? ' dragging' : ''), onDragOver: function (e) { if (e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') > -1) { e.preventDefault(); over[1](true); } }, onDragLeave: function (e) { if (e.currentTarget === e.target) over[1](false); }, onDrop: drop },
      h(Section, null, h(H.PageHeader, { title: 'Files', subtitle: p.files.length + ' files · drop files anywhere here to upload', actions: [h(H.SearchField, { key: 's', placeholder: 'Search files', value: q[0], onChange: function (e) { q[1](e.target.value); } }), h(H.Tabs, { key: 'v', items: ['Grid', 'List'], value: view[0] === 'grid' ? 'Grid' : 'List', onChange: function (v) { view[1](v.toLowerCase()); } }), h(H.Button, { key: 'u', icon: 'paperclip', onClick: p.pick }, 'Upload')] })),
      h(Section, { d: 80 }, h('div', { className: 'ha-row' }, FOLDERS.map(function (t) { return h(H.Chip, { key: t, icon: t === 'All' ? null : 'folder', selected: folder[0] === t, count: t === 'All' ? null : p.files.filter(function (f) { return f.folder === t; }).length, onClick: function () { folder[1](t); } }, t); }))),
      over[0] && h('div', { className: 'demo-dropzone ha-in' }, h(H.TintIcon, { icon: 'download', tint: 'sky', size: 44 }), h('b', null, 'Drop to upload into ' + (folder[0] === 'All' ? 'Receipts' : folder[0]))),
      list.length === 0 ? h(H.EmptyState, { title: 'No files here', text: 'Upload a file or drop it on this page.', icon: 'folder', tint: 'butter', action: h(H.Button, { variant: 'soft', icon: 'paperclip', onClick: p.pick }, 'Upload') })
        : view[0] === 'grid' ? h(H.Stagger, { key: folder[0] + q[0] + view[0], className: 'ha-grid demo-files-grid', delay: 140 }, list.map(function (f) {
          var k = FILE_KIND[f.kind];
          return h('button', { key: f.id, type: 'button', className: 'demo-filecard', onClick: function () { prev[1](f); } }, h('span', { className: 'demo-thumb ha-bg-' + k[1] }, h(Thumb, { f: f })), h('span', { className: 'demo-filecard-name' }, f.name), h('span', { className: 'demo-filecard-meta' }, f.size + ' · ' + f.updated, f.shared && h(H.Icon, { name: 'users', size: 12 })));
        }))
        : h(Section, { d: 140 }, h('div', { className: 'ha-panel ha-panel-flush' }, h(Scroll, null, h(H.Table, { key: folder[0] + q[0], columns: [
          { key: 'name', label: 'Name', render: function (f) { return h('button', { type: 'button', className: 'demo-link', onClick: function () { prev[1](f); } }, h(H.TintIcon, { icon: FILE_KIND[f.kind][0], tint: FILE_KIND[f.kind][1] }), f.name); } },
          { key: 'folder', label: 'Folder' }, { key: 'owner', label: 'Owner' }, { key: 'updated', label: 'Updated' }, { key: 'size', label: 'Size', align: 'right' },
          { key: 'shared', label: '', align: 'right', render: function (f) { return f.shared ? h(H.Badge, { tone: 'info', dot: false }, 'Shared') : null; } }], rows: list })))),
      prev[0] && h(Overlay, { onClose: function () { prev[1](null); } }, h('div', { className: 'ha-modal-wrap' }, h('div', { className: 'ha-backdrop' }), h('div', { className: 'ha-modal demo-preview', role: 'dialog', 'aria-modal': 'true', 'aria-label': prev[0].name },
        h('div', { className: 'ha-header', style: { alignItems: 'center' } }, h('div', { className: 'ha-row', style: { flexWrap: 'nowrap', minWidth: 0 } }, h(H.TintIcon, { icon: FILE_KIND[prev[0].kind][0], tint: FILE_KIND[prev[0].kind][1] }), h('div', { style: { minWidth: 0 } }, h('b', { className: 'demo-ellipsis' }, prev[0].name), h('div', { className: 'ha-card-desc' }, prev[0].size + ' · ' + prev[0].folder + ' · ' + prev[0].owner))), h(H.IconButton, { icon: 'x', label: 'Close preview', onClick: function () { prev[1](null); } })),
        h('div', { className: 'demo-preview-body ha-bg-' + FILE_KIND[prev[0].kind][1] }, h(Thumb, { f: prev[0], big: true })),
        h('div', { className: 'ha-row', style: { justifyContent: 'space-between' } },
          h(H.Switch, { checked: prev[0].shared, onChange: function (e) { var v = e.target.checked; p.set(prev[0], { shared: v }); prev[1](Object.assign({}, prev[0], { shared: v })); } }, 'Shared with team'),
          h('div', { className: 'ha-row' }, h(H.Button, { variant: 'ghost', icon: 'trash', onClick: function () { p.remove(prev[0]); prev[1](null); } }, 'Delete'), h(H.Button, { variant: 'soft', icon: 'link', onClick: function () { p.toast('Link copied (demo)'); } }, 'Copy link')))))));
  }
  function Thumb(p) {
    var f = p.f, big = p.big;
    if (f.kind === 'sheet') return h('span', { className: 'demo-t-sheet' }, Array.from({ length: big ? 7 : 4 }, function (_, r) { return h('span', { key: r }, Array.from({ length: 4 }, function (_, c) { return h('i', { key: c, style: { opacity: r === 0 ? 1 : .55 } }); })); }));
    if (f.kind === 'img' || f.kind === 'fig') return h('span', { className: 'demo-t-art' + (f.kind === 'fig' ? ' fig' : '') }, h('i'), h('i'), h('i'));
    if (f.kind === 'zip') return h('span', { className: 'demo-t-zip' }, ['logo.svg', 'colors.json', 'fonts/'].map(function (x) { return h('span', { key: x }, h(H.Icon, { name: 'file', size: 11 }), x); }));
    return h('span', { className: 'demo-t-doc' }, h('b', null, f.name.replace(/\.[^.]+$/, '')), Array.from({ length: big ? 9 : 4 }, function (_, i) { return h('i', { key: i, style: { width: (60 + (i * 37) % 40) + '%' } }); }));
  }

  /* ───────── Onboarding ───────── */
  var SETUP = [['workspace', 'Name your workspace', 'grid'], ['team', 'Invite your team', 'users'], ['mail', 'Connect your mailbox', 'mail'], ['domain', 'Connect a domain', 'globe'], ['bank', 'Connect your bank', 'card'], ['agent', 'Create your first agent', 'bot']];
  function Setup(p) {
    var done = SETUP.filter(function (s) { return p.setup[s[0]]; }).length;
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Setup guide', subtitle: done + ' of ' + SETUP.length + ' steps done', actions: [h(H.Button, { key: 'o', icon: 'play', onClick: function () { p.open(0); } }, done ? 'Continue setup' : 'Start setup')] })),
      h('div', { className: 'demo-split' },
        h(H.Stagger, { className: 'ha-col', style: { gap: 8 }, delay: 80 }, SETUP.map(function (s, i) { var ok = p.setup[s[0]]; return h('button', { key: s[0], type: 'button', className: 'demo-setup-row' + (ok ? ' ok' : ''), onClick: function () { p.open(i); } }, h('span', { className: 'demo-step-mark ' + (ok ? 'ok' : 'wait') }, h(H.Icon, { name: ok ? 'check' : s[2], size: 13 })), h('span', { style: { flex: 1, minWidth: 0 } }, h('b', null, s[1]), h('span', { className: 'ha-card-desc', style: { display: 'block' } }, ok ? 'Done' : 'About 1 minute')), h(H.Icon, { name: 'chevronRight', size: 15 })); })),
        h(H.Panel, { side: true, title: 'Progress' }, h(H.ProgressRing, { value: Math.round(done / SETUP.length * 100), size: 120, stroke: 12, tint: 'mint', caption: 'set up' }), h('p', { className: 'ha-card-desc', style: { margin: 0 } }, done === SETUP.length ? 'Everything is connected. Nice work.' : 'Each step unlocks more of Halo. You can skip any step and come back later.'))));
  }
  function Wizard(p) {
    var i = useState(p.start || 0), busy = useState(false), val = useState({ name: 'Halo Workspace', tint: 'mint', emails: '', mail: null, domain: '', bank: null, agent: null });
    var s = SETUP[i[0]], v = val[0];
    function set(k, x) { var n = Object.assign({}, v); n[k] = x; val[1](n); }
    function complete() { busy[1](true); setTimeout(function () { busy[1](false); p.done(s[0]); if (i[0] < SETUP.length - 1) i[1](i[0] + 1); else p.onClose(true); }, s[0] === 'domain' || s[0] === 'bank' || s[0] === 'mail' ? 900 : 300); }
    var body;
    if (s[0] === 'workspace') body = h('div', { className: 'ha-col', style: { gap: 16 } }, h('label', { className: 'ha-field' }, h('span', { className: 'ha-field-label' }, 'Workspace name'), h('input', { className: 'ha-input', id: 'ob-name', value: v.name, onChange: function (e) { set('name', e.target.value); } })), h('div', null, h('div', { className: 'ha-field-label', style: { marginBottom: 8 } }, 'Colour'), h('div', { className: 'ha-row' }, ['mint', 'sky', 'lilac', 'butter', 'blush'].map(function (t) { return h('button', { key: t, type: 'button', className: 'demo-swatch ha-bg-' + t + (v.tint === t ? ' on' : ''), 'aria-label': t, 'aria-pressed': v.tint === t ? 'true' : 'false', onClick: function () { set('tint', t); } }); }))), h('div', { className: 'demo-ob-preview' }, h('span', { className: 'demo-agent-mark ha-t-' + v.tint }, (v.name || 'H').charAt(0).toUpperCase()), h('b', null, v.name || 'Untitled workspace')));
    else if (s[0] === 'team') body = h('label', { className: 'ha-field' }, h('span', { className: 'ha-field-label' }, 'Email addresses'), h('textarea', { className: 'ha-input', id: 'ob-emails', rows: 4, placeholder: 'jonah@company.com, sun@company.com', value: v.emails, onChange: function (e) { set('emails', e.target.value); } }), h('span', { className: 'ha-field-hint' }, 'Demo only: nobody gets an email.'));
    else if (s[0] === 'mail') body = h('div', { className: 'ha-grid demo-2' }, ['Google Workspace', 'Microsoft 365', 'IMAP / SMTP', 'Halo Mail'].map(function (m) { return h('button', { key: m, type: 'button', className: 'demo-choice' + (v.mail === m ? ' on' : ''), 'aria-pressed': v.mail === m ? 'true' : 'false', onClick: function () { set('mail', m); } }, h(H.TintIcon, { icon: 'mail', tint: v.mail === m ? 'mint' : 'plain' }), m); }));
    else if (s[0] === 'domain') body = h('div', { className: 'ha-col', style: { gap: 12 } }, h('label', { className: 'ha-field' }, h('span', { className: 'ha-field-label' }, 'Your domain'), h('input', { className: 'ha-input', id: 'ob-domain', placeholder: 'company.com', value: v.domain, onChange: function (e) { set('domain', e.target.value); } })), h('div', { className: 'demo-log', style: { maxHeight: 'none' } }, h('div', null, h('span', null, 'TXT'), 'halo-verify=7f3a91c2'), h('div', null, h('span', null, 'MX'), '10 mx1.halomail.net')), h('span', { className: 'ha-field-hint' }, 'Add these records at your registrar, then press Verify.'));
    else if (s[0] === 'bank') body = h('div', { className: 'ha-grid demo-2' }, ['Business bank (example)', 'Online bank (example)', 'Savings bank (example)', 'Upload CSV instead'].map(function (m) { return h('button', { key: m, type: 'button', className: 'demo-choice' + (v.bank === m ? ' on' : ''), 'aria-pressed': v.bank === m ? 'true' : 'false', onClick: function () { set('bank', m); } }, h(H.TintIcon, { icon: m.indexOf('CSV') > -1 ? 'file' : 'card', tint: v.bank === m ? 'mint' : 'plain' }), m); }));
    else body = h('div', { className: 'ha-grid demo-2' }, AGENTS.slice(0, 4).map(function (a) { return h('button', { key: a.id, type: 'button', className: 'demo-choice tall' + (v.agent === a.id ? ' on' : ''), 'aria-pressed': v.agent === a.id ? 'true' : 'false', onClick: function () { set('agent', a.id); } }, h('span', { className: 'demo-agent-mark ha-t-' + a.tint }, h(H.Icon, { name: 'bot', size: 16 })), h('b', null, a.role), h('span', { className: 'ha-card-desc' }, a.desc)); }));
    var ready = s[0] === 'workspace' ? !!v.name.trim() : s[0] === 'mail' ? !!v.mail : s[0] === 'domain' ? /\./.test(v.domain) : s[0] === 'bank' ? !!v.bank : s[0] === 'agent' ? !!v.agent : true;
    var verb = { workspace: 'Save', team: v.emails.trim() ? 'Send invites' : 'Skip for now', mail: 'Connect', domain: 'Verify', bank: 'Connect', agent: 'Create agent' }[s[0]];
    return h(Overlay, { onClose: function () { p.onClose(false); } }, h('div', { className: 'ha-modal-wrap' }, h('div', { className: 'ha-backdrop' }),
      h('div', { className: 'demo-wizard', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Set up Halo' },
        h('aside', { className: 'demo-wizard-rail' }, h('span', { className: 'ha-brand', style: { color: 'var(--on-frame)' } }, 'Halo', h('span', { className: 'ha-brand-dot' })), h('ol', null, SETUP.map(function (x, j) { var ok = p.setup[x[0]]; return h('li', { key: x[0] }, h('button', { type: 'button', className: 'demo-wizard-step' + (j === i[0] ? ' cur' : '') + (ok ? ' ok' : ''), onClick: function () { i[1](j); } }, h('span', null, ok ? h(H.Icon, { name: 'check', size: 12 }) : j + 1), x[1])); }))),
        h('div', { className: 'demo-wizard-main' },
          h('div', { className: 'ha-header', style: { alignItems: 'center' } }, h('span', { className: 'ha-card-desc' }, 'Step ' + (i[0] + 1) + ' of ' + SETUP.length), h(H.IconButton, { icon: 'x', label: 'Close setup', onClick: function () { p.onClose(false); } })),
          h('div', { key: i[0], className: 'demo-wizard-body' }, h(H.TintIcon, { icon: s[2], tint: 'sky', size: 44 }), h('h2', { className: 'ha-modal-title' }, s[1]), body),
          h('div', { className: 'ha-modal-foot', style: { justifyContent: 'space-between' } }, h(H.Button, { variant: 'ghost', disabled: i[0] === 0, icon: 'chevronLeft', onClick: function () { i[1](Math.max(0, i[0] - 1)); } }, 'Back'), h(H.Button, { icon: busy[0] ? 'refresh' : i[0] === SETUP.length - 1 ? 'check' : 'chevronRight', disabled: !ready || busy[0], onClick: complete }, busy[0] ? 'Working…' : verb))))));
  }

  /* ───────── App ───────── */
  var DATE_KEYS = { date: 1 };
  function loadSaved() { try { var raw = localStorage.getItem('halo-demo-db-v3'); if (!raw) return null; return JSON.parse(raw, function (k, v) { return DATE_KEYS[k] && typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v) ? new Date(v) : v; }); } catch (e) { return null; } }
  function initial() {
    var cl = function (a) { return a.map(function (x) { return Object.assign({}, x); }); };
    return { projects: cl(projects), members: cl(members), invoices: cl(invoices), tasks: cl(TASKS), agents: cl(AGENTS), runs: cl(runs), sources: cl(KNOW), deploys: cl(deploys), domains: cl(domains), expenses: cl(expenses), companies: cl(companies), deals: cl(deals), contacts: cl(contacts), flows: JSON.parse(JSON.stringify(WORKFLOWS0)), roles: JSON.parse(JSON.stringify(ROLES0)), audit: cl(AUDIT0), files: cl(FILES0), notes: cl(NOTES0), setup: { workspace: true, team: true }, filed: { 'Q4 2025': '08.01.2026' }, mail: MAIL0.map(function (m) { return Object.assign({}, m, { body: m.body.slice() }); }), chats: JSON.parse(JSON.stringify(CHAT_SEED)), products: cl(PRODUCTS), orders: cl(orders), cart: [], dns: JSON.parse(JSON.stringify(DNS0)), bank: buildBank(invoices, expenses) };
  }
  var PAGE_TOKENS = ['shop', 'products', 'orders', 'storefront', 'agent-builder', 'pricing', 'system', 'not-found', 'overview', 'board', 'calendar', 'people', 'reports', 'agents', 'agent-chat', 'runs', 'knowledge', 'usage', 'repos', 'deployments', 'domains', 'dns', 'certificates', 'billing', 'finance', 'expenses', 'bank', 'vat', 'pnl', 'invoice-new', 'account', 'companies', 'pipeline', 'contacts', 'workflows', 'files', 'roles', 'audit', 'setup', 'mail-inbox', 'mail-starred', 'mail-sent', 'mail-drafts', 'mail-archive', 'mail-spam', 'mail-trash'];
  var FS_TOKENS = ['signin', 'forgot', 'twofa', '404', '500', 'maintenance', 'offline', '403'];
  function pageFromHash() { var t = (location.hash || '').slice(1); return !t ? 'overview' : PAGE_TOKENS.indexOf(t) > -1 || t.indexOf('mail-') === 0 ? t : FS_TOKENS.indexOf(t) > -1 ? 'overview' : 'not-found'; }
  function fsFromHash() { var t = (location.hash || '').slice(1); return FS_TOKENS.indexOf(t) > -1 ? t : null; }

  /* ═════════ Kit 3 pages: AI chat, agent builder, shop, pricing, system screens ═════════ */
  var MODELS = [{ id: 'Claude Opus 5.5', label: 'Claude Opus 5.5', hint: 'Deepest reasoning · slower · €15 / M tokens' }, { id: 'Claude Sonnet 5.5', label: 'Claude Sonnet 5.5', hint: 'Balanced default · €3 / M tokens' }, { id: 'Claude Haiku 5.5', label: 'Claude Haiku 5.5', hint: 'Fast and cheap · €1 / M tokens' }];
  var CMDS = [{ name: 'summarize', hint: 'Summarize today for me', icon: 'file', insert: 'Summarize today' }, { name: 'draft', hint: 'Draft a reply to the latest email', icon: 'edit', insert: 'Draft a reply to Northwind' }, { name: 'search', hint: 'Search the knowledge base', icon: 'search', insert: 'Search the knowledge base for' }, { name: 'clear', hint: 'Start a new conversation', icon: 'trash' }];
  var STARTERS = {
    atlas: [{ icon: 'edit', tint: 'sky', title: 'Draft a reply to Northwind', text: 'Seat upgrade before renewal' }, { icon: 'file', tint: 'mint', title: 'Summarize today', text: 'What happened in support' }, { icon: 'search', tint: 'butter', title: 'How do refunds work?', text: 'From the knowledge base' }],
    ledger: [{ icon: 'card', tint: 'butter', title: 'Which invoices are overdue?', text: 'With amounts and contacts' }, { icon: 'file', tint: 'mint', title: 'Summarize today' }, { icon: 'swap', tint: 'sky', title: 'Match yesterday’s payments' }],
    patch: [{ icon: 'code', tint: 'lilac', title: 'Is PR #418 safe to deploy?', text: 'Review the diff and checks' }, { icon: 'zap', tint: 'sky', title: 'Any failing builds?' }, { icon: 'file', tint: 'mint', title: 'Summarize today' }]
  };
  function nowT() { var d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function scriptFor(text, a) {
    var low = text.toLowerCase();
    if (a.status === 'Paused') return { text: 'I’m paused right now. Resume me in **Fleet** and I’ll pick this up straight away.' };
    if (a.status === 'Error') return { text: a.error + '\n\nReconnect it under **Knowledge**, then ask me again.' };
    if (/draft|reply|email|mail|northwind/.test(low)) return {
      reason: ['Find the latest thread from Northwind', 'Check seat pricing and the renewal date', 'Draft a short, friendly reply with a quote', 'Ask Mara before sending anything'],
      tools: [{ name: 'Mailbox', icon: 'mail', summary: 'Read 3 messages in “Seat upgrade before renewal”', input: { query: 'from:ida@northwind.io', limit: 3 }, output: { messages: 3, latest: 'We need 40 more seats before 1 May.' }, ms: 820 },
        { name: 'Knowledge base', icon: 'book', summary: 'Found “Seat upgrades” (pricing v4)', input: { q: 'seat upgrade mid-term pricing' }, output: { article: 'Seat upgrades', price_per_seat: 24, prorated: true }, ms: 640 }],
      text: 'I drafted a reply to **Ida Nolan**. It quotes **40 seats at €24** prorated to 1 May and keeps the tone short.',
      sources: [{ title: 'Seat upgrades · pricing v4', icon: 'book' }, { title: 'Thread: Seat upgrade before renewal', icon: 'mail' }],
      approval: { title: 'Send this email to ida@northwind.io?', text: 'Atlas is set to “Drafts only”, so it needs your OK.', body: 'Hi Ida,\n\nhappy to add 40 seats before your renewal on 1 May. Prorated, that’s €24 per seat for the rest of the term; the quote is attached.\n\nReply “go” and they’re live within the hour.\n\nBest,\nMara' } };
    if (/invoice|overdue|payment|paid/.test(low)) return {
      tools: [{ name: 'Billing', icon: 'card', summary: 'Checked 48 invoices', input: { status: 'due', older_than_days: 0 }, output: { overdue: 3, total_eur: 2520 }, ms: 540 }, { name: 'Bank feed', icon: 'swap', summary: 'Matched 31 payments', ms: 910 }],
      text: 'Three invoices are overdue, **€2,520** in total:\n\n- **#2041** Harbor & Co · €860 · 12 days late\n- **#2058** Pinegate · €1,240 · 6 days late\n- **#2063** Orbit Foods · €420 · 2 days late\n\nWant me to send polite reminders to all three?',
      sources: [{ title: 'Invoices · due', icon: 'card' }] };
    if (/deploy|build|pr|code|bug|safe/.test(low)) return {
      reason: ['Read the diff of PR #418', 'Run the test suite and type checks', 'Compare with the last green build'],
      tools: [{ name: 'Repositories', icon: 'code', summary: 'Read the diff of PR #418 (+182 −41)', ms: 1200 }, { name: 'Run checks', icon: 'terminal', summary: '146 tests passed · 1 type error', input: 'pnpm test && pnpm typecheck', output: 'src/checkout/Seats.tsx:42  Type \'string\' is not assignable to type \'number\'.', status: 'error', ms: 4200 }],
      text: 'Not yet. One type error blocks it: `seats` arrives as a string from the form. This fixes it:\n\n```ts\nconst seats = Number(form.get("seats"));\nif (!Number.isInteger(seats) || seats < 1) return error("Pick at least one seat");\nawait updatePlan({ seats });\n```\n\nEverything else is green. Once that lands it’s safe to merge.' };
    if (/summar|today|status|what/.test(low)) return {
      tools: [{ name: 'Runs', icon: 'refresh', summary: 'Read today’s 26 runs', ms: 380 }],
      text: '**Today so far**\n\n- 26 runs, 22 succeeded\n- 2 need your review (both email drafts)\n- 2 failed: the docs connection expired\n\nTotal cost **€4.18**, well under the €120 monthly budget.' };
    return { tools: [{ name: 'Knowledge base', icon: 'book', summary: 'Searched 4 sources', ms: 700 }], text: 'I checked everything I have access to. Nothing urgent came up; I’ll flag it here if that changes.', sources: [{ title: 'Help center', icon: 'book' }] };
  }
  function AgentChat(p) {
    var sel = useState(p.agentId || 'atlas'), draft = useState(''), busy = useState(false), files = useState([]), model = useState(null), endRef = React.useRef(null), timers = React.useRef([]);
    var a = p.agents.filter(function (x) { return x.id === sel[0]; })[0];
    var msgs = (p.chats[a.id] || []).filter(function (m) { return m && typeof m === 'object' && !Array.isArray(m); });
    var mdl = model[0] || a.model;
    useEffect(function () { if (endRef.current) endRef.current.scrollTop = endRef.current.scrollHeight; });
    useEffect(function () { return function () { timers.current.forEach(clearTimeout); timers.current.forEach(clearInterval); }; }, []);
    function later(fn, ms) { var t = setTimeout(fn, ms); timers.current.push(t); }
    function stop() { timers.current.forEach(function (t) { clearTimeout(t); clearInterval(t); }); timers.current = []; busy[1](false); p.edit(a.id, function (m) { return m.streaming || (m.reason && m.reason.streaming) || (m.tools && m.tools.some(function (t) { return t.status === 'running'; })) ? Object.assign({}, m, { streaming: false, stopped: true, text: (m.text || '') + (m.text ? ' …' : '_Stopped._'), reason: m.reason && Object.assign({}, m.reason, { streaming: false }), tools: (m.tools || []).map(function (t) { return t.status === 'running' ? Object.assign({}, t, { status: 'error', output: 'Stopped by you' }) : t; }) }) : m; }); }
    function ask(text, att) {
      if ((!text.trim() && !(att || []).length) || busy[0]) return;
      if (text.trim() === '/clear') { p.set(a.id, []); return; }
      var id = Date.now();
      p.push(a.id, { id: id, role: 'user', text: text, time: nowT(), attachments: (att || []).map(function (f) { return { name: f.name, size: f.size ? Math.max(1, Math.round(f.size / 1024)) + ' KB' : null }; }) });
      files[1]([]); busy[1](true);
      var s = scriptFor(text, a), rid = id + 1, t0 = 300;
      p.push(a.id, { id: rid, role: 'assistant', text: '', streaming: true, time: nowT(), model: mdl, reason: s.reason ? { steps: s.reason, streaming: true } : null, tools: [] });
      if (s.reason) { t0 += 1400; later(function () { p.edit(a.id, function (m) { return m.id === rid ? Object.assign({}, m, { reason: { steps: s.reason, streaming: false, duration: '1.4 s' } }) : m; }); }, t0); }
      (s.tools || []).forEach(function (tool, i) {
        later(function () { p.edit(a.id, function (m) { return m.id === rid ? Object.assign({}, m, { tools: m.tools.concat([Object.assign({}, tool, { status: 'running', output: null })]) }) : m; }); }, t0 + 200);
        t0 += 200 + Math.min(tool.ms || 700, 1400);
        later(function () { p.edit(a.id, function (m) { return m.id === rid ? Object.assign({}, m, { tools: m.tools.map(function (x, k) { return k === i ? Object.assign({}, tool, { status: tool.status || 'done', duration: ((tool.ms || 700) / 1000).toFixed(1) + ' s' }) : x; }) }) : m; }); }, t0);
      });
      later(function () {
        var words = s.text.split(/(\s+)/), n = 0;
        var iv = setInterval(function () {
          n += 6; var done = n >= words.length;
          p.edit(a.id, function (m) { return m.id === rid ? Object.assign({}, m, { text: words.slice(0, n).join(''), streaming: !done, sources: done ? s.sources : null, approval: done && s.approval ? Object.assign({ state: 'pending' }, s.approval) : null, usage: done ? (1200 + s.text.length * 3).toLocaleString('en-US') + ' tokens · €0.0' + (2 + (s.text.length % 7)) : null }) : m; });
          if (done) { clearInterval(iv); busy[1](false); }
        }, 40); timers.current.push(iv);
      }, t0 + 250);
    }
    function decide(m, ok, k, t) {
      p.edit(a.id, function (x) { return x.id === m.id ? Object.assign({}, x, { approval: Object.assign({}, x.approval, { decision: { key: k || (ok ? 'A' : 'C'), by: 'Mara Ellis', at: nowT(), text: t } }) }) : x; });
      p.push(a.id, { id: Date.now(), role: 'system', text: ok ? (k === 'B' ? 'You approved with a change · email sent to ida@northwind.io' : 'You approved · email sent to ida@northwind.io') : k === 'D' ? 'You gave a different instruction' : 'You declined · nothing was sent' });
      H.toast({ text: ok ? 'Email sent to Ida Nolan' : 'Draft discarded', tone: ok ? 'success' : 'info', icon: ok ? 'send' : 'trash' });
    }
    var ctx = 18000 + msgs.reduce(function (n, m) { return n + (m.text || '').length * 4; }, 0);
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Agent chat', subtitle: 'Simulated agents · nothing leaves this page' })),
      h('div', { className: 'demo-chat' },
        h(Section, { d: 80 }, h('div', { className: 'ha-panel ha-panel-flush ha-panel-list demo-chat-list' }, h(H.Stagger, { className: 'ha-list', delay: 100 }, p.agents.map(function (x) {
          var last = (p.chats[x.id] || []).filter(function (m) { return m && m.role === 'assistant'; }).slice(-1)[0];
          return h(H.ListRow, { key: x.id, leading: h(H.AgentMark, { tint: x.tint, live: x.status === 'Running', size: 36 }), title: x.name, subtitle: x.role, meta: h(H.Badge, { tone: STAT_TONE[x.status], dot: true }, x.status), active: x.id === a.id, onClick: function () { stop(); sel[1](x.id); model[1](null); } });
        })))),
        h(Section, { d: 160 }, h('div', { className: 'ha-panel demo-chat-main' },
          h('div', { className: 'demo-chat-head' },
            h(H.AgentMark, { tint: a.tint, live: busy[0], size: 40 }),
            h('div', { style: { minWidth: 0, flex: 1 } }, h('div', { className: 'ha-card-title', style: { padding: 0 } }, a.name), h(H.AgentStatus, { status: busy[0] ? 'Thinking' : a.status === 'Needs review' ? 'Waiting for approval' : a.status, step: busy[0] ? 'Working on your request' : a.autonomy })),
            h('div', { className: 'demo-chat-ctx' }, h(H.UsageMeter, { label: 'Context', used: Math.round(ctx / 1000), limit: 200, format: function (v) { return v + 'k'; } })),
            h(H.Tooltip, { label: 'Configure ' + a.name }, h('button', { type: 'button', className: 'ha-iconbtn ha-iconbtn-soft', 'aria-label': 'Configure ' + a.name, onClick: function () { p.configure(a.id); } }, h(H.Icon, { name: 'settings' })))),
          h('div', { ref: endRef, className: 'demo-chat-scroll' },
            msgs.length === 0 ? h('div', { className: 'demo-chat-empty' }, h(H.AgentMark, { tint: a.tint, size: 56 }), h('b', null, 'Ask ' + a.name + ' anything'), h('span', { className: 'ha-card-desc' }, a.desc), h(H.PromptStarters, { items: STARTERS[a.id] || STARTERS.atlas, onPick: function (t) { ask(t); } }))
            : msgs.map(function (m) {
              return h(H.ChatMessage, { key: m.id, role: m.role, name: m.role === 'user' ? 'Mara Ellis' : a.name, tint: a.tint, time: m.time, model: m.model, text: m.text, streaming: m.streaming, sources: m.sources, attachments: m.attachments, usage: m.usage,
                onRetry: m.role === 'assistant' && !busy[0] ? function () { var prev = msgs[msgs.indexOf(m) - 1]; if (prev && prev.role === 'user') ask(prev.text); } : null,
                onFeedback: function (v) { H.toast({ text: v === 'up' ? 'Thanks, noted' : 'Thanks. ' + a.name + ' will learn from this', tone: 'info', icon: v === 'up' ? 'thumbUp' : 'thumbDown' }); },
                before: (m.reason || (m.tools && m.tools.length)) ? h('div', { className: 'ha-col', style: { gap: 8 } }, m.reason && h(H.Reasoning, { steps: m.reason.steps, streaming: m.reason.streaming, duration: m.reason.duration }), (m.tools || []).map(function (t, i) { return h(H.ToolCall, { key: i, name: t.name, icon: t.icon, summary: t.summary, status: t.status, input: t.input, output: t.output, duration: t.duration }); })) : null,
                after: m.approval ? h(H.ApprovalCard, { title: m.approval.title, text: m.approval.text, agent: a.name, project: 'Support', family: 'comms', age: 'Just now', escalation: 'Escalates to the owner in 2:00 h', decision: m.approval.decision, onDecide: function (k, t) { if (k === 'D') { decide(m, false, k, t); ask(t); } else decide(m, k === 'A' || k === 'B', k, t); } }, h('div', { className: 'ha-approval-mail' }, m.approval.body)) : null });
            })),
          h(H.Composer, { value: draft[0], onChange: draft[1], onSend: function (t, f) { ask(t, f); }, busy: busy[0], onStop: stop, placeholder: 'Ask ' + a.name + ' something, or type / for commands', models: MODELS, model: mdl, onModel: function (v) { model[1](v); H.toast({ text: a.name + ' now uses ' + v + ' in this chat', tone: 'info', icon: 'sparkle' }); },
            commands: CMDS, onCommand: function (c) { if (c.name === 'clear') { p.set(a.id, []); H.toast({ text: 'New conversation', tone: 'info', icon: 'trash' }); } else draft[1](c.insert + ' '); },
            attachments: files[0], onAttach: function (fl) { files[1](files[0].concat(Array.prototype.slice.call(fl))); }, onRemoveAttachment: function (i) { files[1](files[0].filter(function (_, k) { return k !== i; })); } })))));
  }

  /* ── Agent builder ── */
  var ALL_TOOLS = [['Mailbox', 'mail', 'Read and draft email'], ['Knowledge base', 'book', 'Search help articles and docs'], ['Billing', 'card', 'Read invoices and customers'], ['Bank feed', 'swap', 'Read transactions'], ['Repositories', 'code', 'Read code and pull requests'], ['Deployments', 'zap', 'Start and roll back builds'], ['Web search', 'globe', 'Search the public web'], ['CRM', 'users', 'Read and update companies'], ['Domains', 'globe', 'Renew domains, edit DNS']];
  function AgentBuilder(p) {
    var a = p.agents.filter(function (x) { return x.id === p.agentId; })[0] || p.agents[0];
    var instr = useState(a.instructions || ('You are ' + a.name + ', the ' + a.role.toLowerCase() + ' agent for Halo.\n\n- ' + a.desc + '\n- Be brief and friendly. Use the customer’s name.\n- Never promise refunds or discounts; hand those to a person.')), tools = useState(a.tools.slice()), autonomy = useState(a.autonomy), mdl = useState(a.model), budget = useState(a.budget || 40), approvals = useState(a.approvals || ['Sending email', 'Spending money']), temp = useState(30), test = useState([]), dirty = useState(false);
    function touch(set) { return function (v) { set(v); dirty[1](true); }; }
    function save() { p.save(a.id, { instructions: instr[0], tools: tools[0], autonomy: autonomy[0], model: mdl[0], budget: budget[0], approvals: approvals[0] }); dirty[1](false); }
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { crumbs: ['Agents', a.name], title: 'Configure ' + a.name, subtitle: a.role + ' · changes apply to new runs', actions: [h(H.Combobox, { key: 'pick', options: p.agents.map(function (x) { return { value: x.id, label: x.name, hint: x.role }; }), value: a.id, onChange: function (v) { p.pick(v); } }), h(H.Button, { key: 's', icon: 'check', disabled: !dirty[0], onClick: save }, 'Save changes')] })),
      dirty[0] && h(Section, null, h(H.Alert, { tone: 'info', title: 'Unsaved changes', action: h(H.Button, { size: 'sm', variant: 'secondary', onClick: save }, 'Save') }, 'Test them on the right first; the live agent keeps its old setup until you save.')),
      h('div', { className: 'demo-builder' },
        h(H.Stagger, { className: 'ha-col', style: { gap: 16, minWidth: 0 }, delay: 80 },
          h(H.Panel, { title: 'Instructions', subtitle: 'What the agent does, how it talks, and what it must never do' },
            h('textarea', { className: 'ha-input demo-instr', value: instr[0], onChange: function (e) { touch(instr[1])(e.target.value); }, rows: 8, 'aria-label': 'Instructions' }),
            h('div', { className: 'ha-row', style: { justifyContent: 'space-between' } }, h('span', { className: 'ha-field-hint' }, instr[0].length + ' characters · plain language works best'), h(H.Button, { size: 'sm', variant: 'soft', icon: 'sparkle', onClick: function () { touch(instr[1])(instr[0] + '\n- If unsure, ask one short question instead of guessing.'); H.toast({ text: 'Added a clarifying-question rule', tone: 'highlight', icon: 'sparkle' }); } }, 'Improve with AI'))),
          h(H.Panel, { title: 'Model' },
            h(H.RadioGroup, { cards: true, value: mdl[0], onChange: touch(mdl[1]), options: MODELS.map(function (m) { return { value: m.id, label: m.label.replace('Claude ', ''), hint: m.hint }; }) }),
            h(H.Slider, { label: 'Creativity', min: 0, max: 100, step: 5, value: temp[0], onChange: touch(temp[1]), format: function (v) { return v < 34 ? 'Precise · ' + v : v < 67 ? 'Balanced · ' + v : 'Creative · ' + v; }, marks: false, hint: 'Keep it low for support and finance, higher for writing' })),
          h(H.Panel, { title: 'Tools', subtitle: tools[0].length + ' of ' + ALL_TOOLS.length + ' connected' },
            h('div', { className: 'demo-toolgrid' }, ALL_TOOLS.map(function (t) {
              var on = tools[0].indexOf(t[0]) > -1;
              return h('label', { key: t[0], className: 'demo-toolcard' + (on ? ' on' : '') }, h(H.TintIcon, { icon: t[1], tint: on ? 'mint' : 'plain' }), h('span', { className: 'ha-option-text' }, h('b', null, t[0]), h('small', null, t[2])),
                h('input', { type: 'checkbox', role: 'switch', className: 'ha-switch', checked: on, onChange: function () { touch(tools[1])(on ? tools[0].filter(function (x) { return x !== t[0]; }) : tools[0].concat([t[0]])); }, 'aria-label': t[0] }));
            }))),
          h(H.Panel, { title: 'Guardrails', subtitle: 'What needs a person, and how much it may spend' },
            h(H.Segmented, { label: 'Autonomy', value: autonomy[0], onChange: touch(autonomy[1]), options: ['Drafts only', 'Acts, then reports', 'Fully autonomous'] }),
            h(H.Combobox, { label: 'Always ask before', multiple: true, value: approvals[0], onChange: touch(approvals[1]), options: ['Sending email', 'Spending money', 'Deleting anything', 'Deploying to production', 'Changing DNS', 'Contacting a customer'] }),
            h(H.NumberInput, { label: 'Monthly budget', value: budget[0], onChange: touch(budget[1]), min: 0, max: 500, step: 10, unit: '€', hint: 'The agent pauses and asks once it reaches this' }))),
        h(Section, { d: 200 }, h('div', { className: 'ha-panel demo-builder-test' },
          h('div', null, h('h3', { className: 'ha-panel-title' }, 'Test'), h('p', { className: 'ha-panel-sub' }, 'Uses your unsaved setup · not logged as a run')),
          h('div', { className: 'demo-chat-scroll' }, test[0].length ? test[0].map(function (m, i) { return h(H.ChatMessage, { key: i, role: m.role, name: m.role === 'user' ? 'Mara Ellis' : a.name, tint: a.tint, text: m.text, streaming: m.streaming, actions: false, before: m.tool ? h(H.ToolCall, { name: m.tool, icon: 'book', summary: 'Checked with the new instructions', status: 'done', duration: '0.4 s' }) : null }); })
            : h('div', { className: 'demo-chat-empty sm' }, h(H.AgentMark, { tint: a.tint, size: 40 }), h('span', { className: 'ha-card-desc' }, 'Try a real request to see how ' + a.name + ' behaves with these settings.'))),
          h(H.Composer, { placeholder: 'Test a message…', hint: '', onSend: function (t) {
            var tl = tools[0][0]; test[1](test[0].concat([{ role: 'user', text: t }, { role: 'assistant', text: '', streaming: true, tool: tl }]));
            setTimeout(function () { test[1](function (x) { return x.slice(0, -1).concat([{ role: 'assistant', tool: tl, text: autonomy[0] === 'Drafts only' ? 'Here’s a draft. I won’t send it until you approve, because **' + approvals[0][0] + '** needs a person.' : 'Done. I used **' + tl + '** and reported back in the run log.' }]); }); }, 900);
          } })))));
  }

  /* ── Shop data ── */
  var PRODUCTS = [
    { id: 'p1', name: 'Halo Cotton Tee', cat: 'Apparel', art: 'tee', tint: 'sky', price: 32, compareAt: 39, stock: 84, sold: 312, rating: 4.7, reviews: 128, status: 'Active', badge: 'Bestseller', colors: [['Sky', '#9fc3f0'], ['Ink', '#1d1d1f'], ['Bone', '#ece6d9'], ['Moss', '#7d9a5e']], sizes: ['XS', 'S', 'M', 'L', 'XL'], soldOut: ['XS'] },
    { id: 'p2', name: 'Studio Mug', cat: 'Home', art: 'mug', tint: 'butter', price: 18, stock: 6, sold: 208, rating: 4.9, reviews: 96, status: 'Active' },
    { id: 'p3', name: 'Field Bottle', cat: 'Outdoor', art: 'bottle', tint: 'mint', price: 28, stock: 41, sold: 174, rating: 4.6, reviews: 61, status: 'Active', badge: 'New' },
    { id: 'p4', name: 'Canvas Tote', cat: 'Bags', art: 'tote', tint: 'lilac', price: 24, stock: 0, sold: 260, rating: 4.8, reviews: 143, status: 'Active' },
    { id: 'p5', name: 'Six-panel Cap', cat: 'Apparel', art: 'cap', tint: 'blush', price: 26, compareAt: 32, stock: 23, sold: 98, rating: 4.4, reviews: 37, status: 'Active' },
    { id: 'p6', name: 'Court Sneaker', cat: 'Footwear', art: 'sneaker', tint: 'sky', price: 119, stock: 9, sold: 66, rating: 4.5, reviews: 52, status: 'Active' },
    { id: 'p7', name: 'Desk Lamp', cat: 'Home', art: 'lamp', tint: 'butter', price: 64, stock: 17, sold: 44, rating: 4.3, reviews: 18, status: 'Draft' },
    { id: 'p8', name: 'Field Watch', cat: 'Accessories', art: 'watch', tint: 'mint', price: 149, compareAt: 179, stock: 12, sold: 39, rating: 4.8, reviews: 24, status: 'Active', badge: 'Limited' }];
  var ORDER_STATUS = ['Placed', 'Paid', 'Packed', 'Shipped', 'Delivered'];
  var ORDER_TONE = { Placed: 'neutral', Paid: 'info', Packed: 'info', Shipped: 'highlight', Delivered: 'success', Refunded: 'danger', Cancelled: 'danger' };
  var SHOP_PEOPLE = ['Lena Fischer', 'Jonas Becker', 'Mia Schulz', 'Noah Wagner', 'Emma Hoffmann', 'Leon Koch', 'Hanna Richter', 'Paul Klein', 'Lea Wolf', 'Finn Neumann', 'Clara Braun', 'Ben Zimmer'];
  var CITIES = ['Hamburg', 'Berlin', 'Munich', 'Cologne', 'Vienna', 'Zurich', 'Amsterdam', 'Copenhagen'];
  var orders = [];
  for (var oi = 0; oi < 36; oi++) {
    var nl = 1 + (oi % 3), lines = [];
    for (var li = 0; li < nl; li++) { var pr = PRODUCTS[(oi * 3 + li * 5) % PRODUCTS.length]; lines.push({ pid: pr.id, name: pr.name, art: pr.art, tint: pr.tint, price: pr.price, qty: 1 + ((oi + li) % 2), variant: pr.sizes ? 'M · ' + pr.colors[(oi + li) % 4][0] : null }); }
    var st3 = oi < 3 ? 'Placed' : oi < 7 ? 'Paid' : oi < 11 ? 'Packed' : oi < 17 ? 'Shipped' : oi === 22 ? 'Refunded' : oi === 29 ? 'Cancelled' : 'Delivered';
    orders.push({ id: 10482 - oi, who: SHOP_PEOPLE[oi % SHOP_PEOPLE.length], city: CITIES[oi % CITIES.length], lines: lines, total: lines.reduce(function (s, l) { return s + l.price * l.qty; }, 0) + (oi % 4 === 0 ? 4.9 : 0), status: st3, mins: oi * 97 + 12, channel: ['Online store', 'Online store', 'Instagram', 'Marketplace'][oi % 4], pay: ['Card', 'Card', 'PayPal', 'Invoice'][oi % 4] });
  }

  /* ── Shop overview ── */
  function ShopOverview(p) {
    var o = p.orders, rev = sum(o.filter(function (x) { return x.status !== 'Refunded' && x.status !== 'Cancelled'; }), function (x) { return x.total; }), open = o.filter(function (x) { return ['Placed', 'Paid', 'Packed'].indexOf(x.status) > -1; });
    var low = p.products.filter(function (x) { return x.stock <= 10 && x.status === 'Active'; });
    var labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Shop', subtitle: 'Halo Goods · last 7 days · demo data', actions: [h(H.Button, { key: 's', variant: 'secondary', icon: 'arrowUpRight', onClick: function () { p.go('storefront'); } }, 'View store'), h(H.Button, { key: 'n', icon: 'plus', onClick: function () { p.go('products'); } }, 'Add product')] })),
      low.length > 0 && h(Section, null, h(H.Alert, { tone: 'warning', title: low.length + ' products are running low', action: h(H.Button, { size: 'sm', variant: 'secondary', onClick: function () { p.go('products'); } }, 'Review stock') }, low.map(function (x) { return x.name + (x.stock ? ' (' + x.stock + ' left)' : ' (sold out)'); }).join(', ') + '.')),
      h(H.Stagger, { className: 'ha-grid demo-4', delay: 80 },
        h(H.StatTile, { tint: 'butter', value: H.money(Math.round(rev)), label: 'Revenue' }), h(H.StatTile, { tint: 'sky', value: String(o.length), label: 'Orders' }),
        h(H.StatTile, { tint: 'mint', value: H.money(Math.round(rev / o.length)), label: 'Average order' }), h(H.StatTile, { tint: 'placeholder', value: String(open.length), label: 'To fulfil' })),
      h(H.Stagger, { className: 'ha-grid demo-21', delay: 160 },
        h(H.Panel, { title: 'Sales by channel', subtitle: 'Per day, net' }, h(H.StackedBarChart, { height: 180, labels: labels, format: function (v) { return '€' + Math.round(v); }, series: [{ name: 'Online store', tint: 'sky', values: [420, 380, 510, 460, 620, 840, 760] }, { name: 'Instagram', tint: 'lilac', values: [120, 160, 140, 210, 260, 380, 300] }, { name: 'Marketplace', tint: 'butter', values: [90, 110, 80, 130, 150, 170, 160] }] })),
        h(H.Panel, { title: 'Conversion', subtitle: 'Store visitors to orders' }, h(H.Funnel, { steps: [{ label: 'Visited', value: 8420 }, { label: 'Viewed product', value: 3910 }, { label: 'Added to cart', value: 812 }, { label: 'Ordered', value: 214 }] }))),
      h(H.Stagger, { className: 'ha-grid demo-12', delay: 240 },
        h(H.Panel, { title: 'Top products' }, h('div', { className: 'ha-col', style: { gap: 12 } }, p.products.slice().sort(function (a, b) { return b.sold - a.sold; }).slice(0, 5).map(function (x, i) {
          return h('div', { key: x.id, className: 'demo-toprow' }, h('span', { className: 'demo-rank' }, i + 1), h(H.ProductArt, { kind: x.art, tint: x.tint, size: 40 }), h('span', { className: 'ha-option-text' }, h('b', null, x.name), h('small', null, x.sold + ' sold')), h('b', null, H.money(x.sold * x.price)));
        }))),
        h(H.Panel, { title: 'Recent orders', action: h(H.Button, { size: 'sm', variant: 'soft', iconRight: 'chevronRight', onClick: function () { p.go('orders'); } }, 'All orders') },
          h('div', { className: 'ha-col', style: { gap: 4 } }, o.slice(0, 6).map(function (x) {
            return h(H.ListRow, { key: x.id, avatar: x.who, title: '#' + x.id + ' · ' + x.who, subtitle: x.lines.length + (x.lines.length > 1 ? ' items' : ' item') + ' · ' + x.city + ' · ' + ago(x.mins), meta: h('span', { className: 'ha-row', style: { flexWrap: 'nowrap' } }, h('b', null, H.money(x.total)), h(H.Badge, { tone: ORDER_TONE[x.status] }, x.status)), onClick: function () { p.go('orders'); } });
          })))));
  }

  /* ── Products ── */
  function Products(p) {
    var q = useState(''), f = useState({}), edit = useState(null);
    var list = p.products.filter(function (x) { return (!f[0].Category || x.cat === f[0].Category) && (!f[0].Stock || (f[0].Stock === 'Out of stock' ? x.stock === 0 : f[0].Stock === 'Low' ? x.stock > 0 && x.stock <= 10 : x.stock > 10)) && (!f[0].Status || x.status === f[0].Status) && (!q[0] || x.name.toLowerCase().indexOf(q[0].toLowerCase()) > -1); });
    var cats = []; p.products.forEach(function (x) { if (cats.indexOf(x.cat) < 0) cats.push(x.cat); });
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Products', subtitle: p.products.length + ' products · ' + sum(p.products, function (x) { return x.stock; }) + ' units in stock', actions: [h(H.Button, { key: 'n', icon: 'plus', onClick: function () { edit[1]({ id: 'new', name: '', cat: 'Apparel', art: 'tote', tint: 'sky', price: 25, stock: 10, status: 'Draft', rating: 0, reviews: 0, sold: 0 }); } }, 'Add product')] })),
      h(Section, { d: 80 }, h(H.FilterBar, { search: 'Search products', query: q[0], onQuery: q[1], value: f[0], onChange: f[1], filters: [{ key: 'Category', label: 'Category', icon: 'tag', options: cats }, { key: 'Stock', label: 'Stock', icon: 'package', options: ['In stock', 'Low', 'Out of stock'] }, { key: 'Status', label: 'Status', icon: 'flag', options: ['Active', 'Draft'] }] })),
      h(Section, { d: 160 }, h('div', { className: 'ha-panel ha-panel-flush' }, h(H.DataTable, { rows: list, selectable: true, defaultSort: { key: 'sold', dir: 'desc' }, toolbar: h('span', { className: 'ha-card-desc' }, list.length + ' shown'),
        bulkActions: [{ label: 'Set active', icon: 'check', onClick: function (rows, clear) { p.setMany(rows, { status: 'Active' }, rows.length + ' products active'); clear(); } }, { label: 'Move to draft', icon: 'eye', onClick: function (rows, clear) { p.setMany(rows, { status: 'Draft' }, rows.length + ' products moved to draft'); clear(); } }, { label: 'Restock +20', icon: 'package', onClick: function (rows, clear) { rows.forEach(function (r) { p.setMany([r], { stock: r.stock + 20 }); }); H.toast({ text: 'Restocked ' + rows.length + ' products', tone: 'success', icon: 'package' }); clear(); } }],
        renderExpanded: function (x) { return h('div', { className: 'demo-member-detail' }, h('div', null, h('span', null, 'Sold'), h('b', null, x.sold + ' units · ' + H.money(x.sold * x.price))), h('div', null, h('span', null, 'Rating'), h(H.Rating, { value: x.rating, count: x.reviews })), h('div', null, h('span', null, 'Variants'), h('b', null, x.sizes ? x.sizes.length + ' sizes · ' + x.colors.length + ' colours' : 'None')), h('div', null, h('span', null, 'Margin'), h('b', null, Math.round(48 + (x.price % 17)) + '%'))); },
        columns: [
          { key: 'name', label: 'Product', sortable: true, hideable: false, render: function (x) { return h('button', { type: 'button', className: 'demo-link', onClick: function () { edit[1](x); } }, h(H.ProductArt, { kind: x.art, tint: x.tint, size: 40 }), h('span', { className: 'ha-option-text' }, h('b', null, x.name), h('small', null, x.cat))); } },
          { key: 'status', label: 'Status', sortable: true, render: function (x) { return h(H.Badge, { tone: x.status === 'Active' ? 'success' : 'neutral' }, x.status); } },
          { key: 'stock', label: 'Inventory', sortable: true, render: function (x) { return h(H.StockBadge, { stock: x.stock, compact: true }); } },
          { key: 'price', label: 'Price', align: 'right', sortable: true, render: function (x) { return h(H.Price, { value: x.price, compareAt: x.compareAt, showSave: false }); } },
          { key: 'sold', label: 'Sold', align: 'right', sortable: true },
          { key: 'rating', label: 'Rating', sortable: true, hidden: true, render: function (x) { return h(H.Rating, { value: x.rating, size: 12 }); } }] }))),
      edit[0] && h(ProductDrawer, { product: edit[0], onClose: function () { edit[1](null); }, save: function (x) { p.save(x); edit[1](null); } }));
  }
  function ProductDrawer(p) {
    var x = useState(Object.assign({}, p.product)), d = x[0], err = !d.name.trim();
    function set(k, v) { var n = Object.assign({}, d); n[k] = v; x[1](n); }
    return h(H.Drawer, { title: p.product.id === 'new' ? 'New product' : d.name, subtitle: d.cat + ' · ' + d.status, onClose: p.onClose },
      h('div', { className: 'ha-col', style: { gap: 16 } },
        h('div', { style: { display: 'grid', gridTemplateColumns: '96px 1fr', gap: 16, alignItems: 'center' } }, h(H.ProductArt, { kind: d.art, tint: d.tint, size: 96 }),
          h('div', { className: 'ha-col', style: { gap: 8 } }, h('span', { className: 'ha-field-label' }, 'Image'), h(H.Segmented, { size: 'sm', value: d.tint, onChange: function (v) { set('tint', v); }, options: ['sky', 'mint', 'lilac', 'butter', 'blush'].map(function (t) { return { value: t, label: t[0].toUpperCase() + t.slice(1) }; }) }))),
        h(H.TextField, { label: 'Name', required: true, value: d.name, onChange: function (e) { set('name', e.target.value); }, error: err ? 'Give it a name' : null }),
        h('div', { className: 'ha-grid demo-2' }, h(H.TextField, { label: 'Price', suffix: 'EUR', value: String(d.price), onChange: function (e) { set('price', parseFloat(e.target.value) || 0); } }), h(H.TextField, { label: 'Compare-at price', optional: true, suffix: 'EUR', value: d.compareAt ? String(d.compareAt) : '', onChange: function (e) { set('compareAt', parseFloat(e.target.value) || null); }, hint: 'Shows as a sale' })),
        h('div', { className: 'ha-grid demo-2' }, h(H.NumberInput, { label: 'Stock', value: d.stock, min: 0, onChange: function (v) { set('stock', v); } }), h(H.Combobox, { label: 'Category', options: ['Apparel', 'Home', 'Outdoor', 'Bags', 'Footwear', 'Accessories'], value: d.cat, onChange: function (v) { set('cat', v); }, creatable: true })),
        h(H.RadioGroup, { label: 'Status', value: d.status, onChange: function (v) { set('status', v); }, options: [{ value: 'Active', label: 'Active', hint: 'Visible in the store' }, { value: 'Draft', label: 'Draft', hint: 'Only you can see it' }] }),
        h('div', { className: 'ha-row', style: { justifyContent: 'flex-end' } }, h(H.Button, { variant: 'ghost', onClick: p.onClose }, 'Cancel'), h(H.Button, { icon: 'check', disabled: err, onClick: function () { p.save(d); } }, 'Save product'))));
  }

  /* ── Orders ── */
  function Orders(p) {
    var q = useState(''), f = useState({}), conf = useState(null);
    var list = p.orders.filter(function (x) { return (!f[0].Status || x.status === f[0].Status) && (!f[0].Channel || x.channel === f[0].Channel) && (!q[0] || (x.id + x.who + x.city).toLowerCase().indexOf(q[0].toLowerCase()) > -1); });
    function next(x) { var i = ORDER_STATUS.indexOf(x.status); return i > -1 && i < ORDER_STATUS.length - 1 ? ORDER_STATUS[i + 1] : null; }
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Orders', subtitle: p.orders.length + ' orders · demo data' })),
      h(H.Stagger, { className: 'ha-grid demo-4', delay: 60 }, ['Paid', 'Packed', 'Shipped', 'Delivered'].map(function (s, i) { return h(H.StatTile, { key: s, tint: ['sky', 'butter', 'lilac', 'mint'][i], value: String(p.orders.filter(function (x) { return x.status === s; }).length), label: s === 'Paid' ? 'To pack' : s === 'Packed' ? 'To ship' : s === 'Shipped' ? 'On the way' : 'Delivered' }); })),
      h(Section, { d: 140 }, h(H.FilterBar, { search: 'Search order, customer or city', query: q[0], onQuery: q[1], value: f[0], onChange: f[1], filters: [{ key: 'Status', label: 'Status', icon: 'flag', options: ORDER_STATUS.concat(['Refunded', 'Cancelled']) }, { key: 'Channel', label: 'Channel', icon: 'globe', options: ['Online store', 'Instagram', 'Marketplace'] }] })),
      h(Section, { d: 200 }, h('div', { className: 'ha-panel ha-panel-flush' }, h(H.DataTable, { rows: list, selectable: true, stickyHeader: true, maxHeight: 640, toolbar: h('span', { className: 'ha-card-desc' }, list.length + ' orders'),
        bulkActions: [{ label: 'Mark packed', icon: 'package', onClick: function (rows, clear) { var ok = rows.filter(function (r) { return r.status === 'Paid'; }); p.setMany(ok, { status: 'Packed' }, ok.length + ' orders packed'); clear(); } }, { label: 'Mark shipped', icon: 'truck', onClick: function (rows, clear) { var ok = rows.filter(function (r) { return r.status === 'Packed'; }); p.setMany(ok, { status: 'Shipped' }, ok.length + ' orders shipped'); clear(); } }, { label: 'Print labels', icon: 'file', onClick: function (rows) { H.toast({ text: rows.length + ' shipping labels ready (demo)', tone: 'info', icon: 'file' }); } }],
        renderExpanded: function (x) {
          var n = next(x);
          return h('div', { className: 'demo-order-detail' },
            h(H.OrderTimeline, { status: x.status, times: { Placed: ago(x.mins), Paid: x.status !== 'Placed' ? ago(Math.max(1, x.mins - 4)) : null } }),
            h('div', { className: 'demo-order-cols' },
              h('div', { className: 'ha-col', style: { gap: 0, minWidth: 0 } }, x.lines.map(function (l, i) { return h(H.CartLine, { key: i, name: l.name, art: l.art, tint: l.tint, price: l.price, qty: l.qty, variant: l.variant }); })),
              h('div', { className: 'ha-col', style: { gap: 12 } },
                h('div', { className: 'demo-member-detail' }, h('div', null, h('span', null, 'Ship to'), h('b', null, x.who + ', ' + x.city)), h('div', null, h('span', null, 'Payment'), h('b', null, x.pay + ' · ' + H.money(x.total)))),
                h('div', { className: 'ha-row' }, n && h(H.Button, { size: 'sm', icon: n === 'Shipped' ? 'truck' : n === 'Packed' ? 'package' : 'check', onClick: function () { p.setMany([x], { status: n }, '#' + x.id + ' marked ' + n.toLowerCase()); } }, 'Mark ' + n.toLowerCase()),
                  x.status !== 'Refunded' && x.status !== 'Cancelled' && h(H.Button, { size: 'sm', variant: 'ghost', onClick: function () { conf[1](x); } }, 'Refund')))));
        },
        columns: [
          { key: 'id', label: 'Order', sortable: true, hideable: false, render: function (x) { return h('span', { className: 'ha-option-text' }, h('b', null, '#' + x.id), h('small', null, ago(x.mins))); } },
          { key: 'who', label: 'Customer', sortable: true, render: function (x) { return h('span', { className: 'ha-row', style: { flexWrap: 'nowrap' } }, h(H.Avatar, { name: x.who, size: 28 }), h('span', { className: 'ha-option-text' }, h('b', null, x.who), h('small', null, x.city))); } },
          { key: 'items', label: 'Items', render: function (x) { return h('span', { className: 'demo-thumbs' }, x.lines.map(function (l, i) { return h(H.ProductArt, { key: i, kind: l.art, tint: l.tint, size: 32 }); })); } },
          { key: 'channel', label: 'Channel', sortable: true },
          { key: 'status', label: 'Status', sortable: true, sortValue: function (x) { return ORDER_STATUS.indexOf(x.status); }, render: function (x) { return h(H.Badge, { tone: ORDER_TONE[x.status] }, x.status); } },
          { key: 'total', label: 'Total', align: 'right', sortable: true, render: function (x) { return h('b', null, H.money(x.total)); } }] }))),
      h(H.ConfirmDialog, { open: !!conf[0], danger: true, icon: 'swap', title: conf[0] ? 'Refund order #' + conf[0].id + '?' : '', text: conf[0] ? H.money(conf[0].total) + ' goes back to ' + conf[0].who + '’s ' + conf[0].pay.toLowerCase() + '. Stock is returned to inventory.' : '', confirmLabel: 'Refund', onCancel: function () { conf[1](null); }, onConfirm: function () { var x = conf[0]; conf[1](null); p.setMany([x], { status: 'Refunded' }, '#' + x.id + ' refunded'); } }));
  }

  /* ── Storefront (customer view): catalog → product → cart → checkout ── */
  function Storefront(p) {
    var view = useState('catalog'), cur = useState(null), cat = useState('All'), wish = useState([]), cart = p.cart, step = useState(0), disc = useState(null), color = useState('Sky'), size = useState('M'), payM = useState('card'), placed = useState(null), ship = useState('standard');
    var prods = p.products.filter(function (x) { return x.status === 'Active' && (cat[0] === 'All' || x.cat === cat[0]); });
    var count = cart.reduce(function (n, l) { return n + l.qty; }, 0);
    function add(x, variant) { var key = x.id + (variant || ''), ex = cart.filter(function (l) { return l.key === key; })[0]; p.setCart(ex ? cart.map(function (l) { return l.key === key ? Object.assign({}, l, { qty: l.qty + 1 }) : l; }) : cart.concat([{ key: key, pid: x.id, name: x.name, art: x.art, tint: x.tint, price: x.price, qty: 1, variant: variant }])); H.toast({ text: x.name + ' added to cart', tone: 'success', icon: 'cart', action: { label: 'View cart', onClick: function () { view[1]('cart'); } } }); }
    var codes = { HALO10: { code: 'HALO10', pct: 10, label: '10% off everything' }, WELCOME: { code: 'WELCOME', amount: 5, label: '€5 off your first order' } };
    var ship$ = ship[0] === 'express' ? 9.9 : null;
    var header = h('div', { className: 'demo-store-head' },
      h('button', { type: 'button', className: 'demo-store-brand', onClick: function () { view[1]('catalog'); } }, 'Halo Goods'),
      h('div', { className: 'ha-row', style: { flexWrap: 'nowrap' } }, h(H.Tooltip, { label: 'Saved' }, h('button', { type: 'button', className: 'ha-iconbtn ha-iconbtn-soft', 'aria-label': 'Saved items, ' + wish[0].length }, h(H.Icon, { name: 'heart' }))),
        h('button', { type: 'button', className: 'ha-btn ha-btn-primary demo-cartbtn', onClick: function () { view[1]('cart'); } }, h(H.Icon, { name: 'cart', size: 15 }), 'Cart', count > 0 && h('span', { className: 'ha-nav-count' }, count))));
    var body;
    if (placed[0]) body = h('div', { className: 'ha-status-screen' }, h(H.TintIcon, { icon: 'check', tint: 'mint', size: 56 }), h('h1', null, 'Thanks, order #' + placed[0] + ' is in'), h('p', null, 'We sent a confirmation to lena@example.com. It ships within 24 hours.'), h(H.OrderTimeline, { status: 'Paid', times: { Placed: 'Just now', Paid: 'Just now' } }), h('div', { className: 'ha-row', style: { justifyContent: 'center' } }, h(H.Button, { onClick: function () { placed[1](null); view[1]('catalog'); } }, 'Keep shopping'), h(H.Button, { variant: 'secondary', onClick: function () { p.go('orders'); } }, 'See it in Orders')));
    else if (view[0] === 'product' && cur[0]) {
      var x = cur[0];
      body = h('div', { className: 'demo-pdp ha-in' },
        h('div', { className: 'demo-pdp-media' }, h(H.ProductArt, { kind: x.art, tint: x.tint }), h('div', { className: 'demo-pdp-thumbs' }, ['sky', 'mint', 'butter', 'lilac'].map(function (t, i) { return h('button', { key: t, type: 'button', className: i === 0 ? 'on' : '', 'aria-label': 'Image ' + (i + 1) }, h(H.ProductArt, { kind: x.art, tint: i === 0 ? x.tint : t })); }))),
        h('div', { className: 'demo-pdp-info' },
          h(H.Breadcrumb, { items: ['Shop', x.cat, x.name] }),
          h('div', { className: 'ha-col', style: { gap: 8 } }, h('h1', { className: 'demo-pdp-title' }, x.name), h(H.Rating, { value: x.rating, count: x.reviews })),
          h(H.Price, { value: x.price, compareAt: x.compareAt, size: 'lg' }),
          h('p', { className: 'ha-card-desc', style: { margin: 0, fontSize: 14, lineHeight: '22px' } }, 'Made to last, in small batches. Free returns within 30 days, free shipping from €75.'),
          x.colors && h(H.VariantPicker, { label: 'Colour', type: 'color', value: color[0], onChange: color[1], options: x.colors.map(function (c) { return { value: c[0], label: c[0], color: c[1] }; }) }),
          x.sizes && h(H.VariantPicker, { label: 'Size', value: size[0], onChange: size[1], options: x.sizes.map(function (s) { return { value: s, label: s, disabled: (x.soldOut || []).indexOf(s) > -1 }; }) }),
          h(H.StockBadge, { stock: x.stock }),
          h('div', { className: 'ha-row', style: { flexWrap: 'nowrap' } }, h(H.Button, { icon: 'cart', disabled: x.stock === 0, className: 'demo-grow', onClick: function () { add(x, x.sizes ? size[0] + ' · ' + color[0] : null); } }, x.stock === 0 ? 'Sold out' : 'Add to cart · ' + H.money(x.price)),
            h(H.Tooltip, { label: wish[0].indexOf(x.id) > -1 ? 'Saved' : 'Save for later' }, h('button', { type: 'button', className: 'ha-iconbtn ha-iconbtn-outline', 'aria-pressed': wish[0].indexOf(x.id) > -1, 'aria-label': 'Save ' + x.name, onClick: function () { wish[1](wish[0].indexOf(x.id) > -1 ? wish[0].filter(function (i) { return i !== x.id; }) : wish[0].concat([x.id])); } }, h(H.Icon, { name: 'heart' })))),
          h('div', { className: 'demo-perks' }, [['truck', 'Ships in 24 h'], ['swap', '30-day returns'], ['lock', 'Secure checkout']].map(function (k) { return h('span', { key: k[1] }, h(H.Icon, { name: k[0], size: 15 }), k[1]); }))));
    } else if (view[0] === 'cart') {
      body = cart.length === 0 ? h(H.EmptyState, { icon: 'cart', tint: 'sky', title: 'Your cart is empty', text: 'Things you add show up here.', action: h(H.Button, { onClick: function () { view[1]('catalog'); } }, 'Browse products') })
        : h('div', { className: 'demo-checkout ha-in' },
          h('div', { className: 'ha-col', style: { gap: 24, minWidth: 0 } },
            h(H.CheckoutSteps, { steps: ['Cart', 'Details', 'Shipping', 'Payment'], current: step[0], onPick: step[1] }),
            step[0] === 0 && h('div', { className: 'ha-panel' }, h('h3', { className: 'ha-panel-title' }, 'Cart'), h('div', null, cart.map(function (l) { return h(H.CartLine, { key: l.key, name: l.name, art: l.art, tint: l.tint, price: l.price, qty: l.qty, variant: l.variant, onQty: function (n) { p.setCart(cart.map(function (z) { return z.key === l.key ? Object.assign({}, z, { qty: n }) : z; })); }, onRemove: function () { var before = cart; p.setCart(cart.filter(function (z) { return z.key !== l.key; })); H.toast({ text: l.name + ' removed', tone: 'info', icon: 'trash', undo: function () { p.setCart(before); } }); } }); }))),
            step[0] === 1 && h('div', { className: 'ha-panel' }, h('h3', { className: 'ha-panel-title' }, 'Your details'), h('div', { className: 'ha-grid demo-2' }, h(H.TextField, { label: 'Email', type: 'email', icon: 'mail', defaultValue: 'lena@example.com', required: true, autoComplete: 'email' }), h(H.TextField, { label: 'Phone', optional: true, placeholder: '+49 …', hint: 'Only for delivery questions' }), h(H.TextField, { label: 'First name', defaultValue: 'Lena', required: true }), h(H.TextField, { label: 'Last name', defaultValue: 'Fischer', required: true })), h(H.TextField, { label: 'Street and number', defaultValue: 'Am Sandtorkai 5', required: true }), h('div', { className: 'ha-grid demo-2' }, h(H.TextField, { label: 'Postcode', defaultValue: '20457', required: true }), h(H.TextField, { label: 'City', defaultValue: 'Hamburg', required: true })), h(H.Checkbox, { defaultChecked: true }, 'Billing address is the same')),
            step[0] === 2 && h('div', { className: 'ha-panel' }, h('h3', { className: 'ha-panel-title' }, 'Shipping'), h(H.RadioGroup, { cards: true, value: ship[0], onChange: ship[1], options: [{ value: 'standard', label: 'Standard · free from €75', hint: 'DHL · 2–3 working days' }, { value: 'express', label: 'Express · €9.90', hint: 'Next working day before 12:00' }] })),
            step[0] === 3 && h('div', { className: 'ha-panel' }, h('h3', { className: 'ha-panel-title' }, 'Payment'), h(H.RadioGroup, { cards: true, value: payM[0], onChange: payM[1], options: [{ value: 'card', label: 'Card', hint: 'Visa, Mastercard, Amex' }, { value: 'paypal', label: 'PayPal', hint: 'You’ll confirm in a new window' }, { value: 'invoice', label: 'Pay later', hint: 'Invoice, due in 14 days' }] }), payM[0] === 'card' && h('div', { className: 'ha-grid demo-2' }, h(H.TextField, { label: 'Card number', icon: 'card', placeholder: '4242 4242 4242 4242', hint: 'Demo: nothing is charged' }), h('div', { className: 'ha-grid demo-2' }, h(H.TextField, { label: 'Expiry', placeholder: 'MM / YY' }), h(H.TextField, { label: 'CVC', placeholder: '123' }))))),
          h('div', { className: 'ha-panel demo-checkout-side' }, h(H.OrderSummary, { lines: cart, showLines: step[0] > 0, discount: disc[0], shipping: ship$, freeShippingFrom: 75, onCoupon: function (c) { if (c === null) { disc[1](null); return; } if (!codes[c]) return false; disc[1](codes[c]); H.toast({ text: codes[c].label + ' applied', tone: 'success', icon: 'tag' }); },
            action: h('div', { className: 'ha-col', style: { gap: 8 } }, h(H.Button, { icon: step[0] === 3 ? 'lock' : null, iconRight: step[0] < 3 ? 'chevronRight' : null, onClick: function () { if (step[0] < 3) step[1](step[0] + 1); else { var id = 10483 + Math.floor(Math.random() * 90); p.placeOrder(id, cart); p.setCart([]); placed[1](id); step[1](0); disc[1](null); } } }, ['Continue to details', 'Continue to shipping', 'Continue to payment', 'Pay now'][step[0]]), h('span', { className: 'ha-field-hint', style: { textAlign: 'center' } }, 'Try code HALO10')) })));
    } else body = h(React.Fragment, null,
      h('div', { className: 'demo-store-hero ha-in' }, h('div', null, h(H.Badge, { tone: 'highlight', dot: false }, 'Spring drop'), h('h1', null, 'Everyday things, made to last'), h('p', null, 'Small batches, honest prices. Free shipping from €75.'), h(H.Button, { iconRight: 'chevronRight', onClick: function () { cur[1](p.products[0]); view[1]('product'); } }, 'Shop the tee')), h(H.ProductArt, { kind: 'tee', tint: 'sky' })),
      h('div', { className: 'ha-row' }, ['All', 'Apparel', 'Home', 'Bags', 'Outdoor', 'Accessories', 'Footwear'].map(function (c) { return h(H.Chip, { key: c, selected: cat[0] === c, onClick: function () { cat[1](c); } }, c); })),
      h(H.Stagger, { key: cat[0], className: 'demo-products', delay: 60 }, prods.map(function (x) { return h(H.ProductCard, { key: x.id, name: x.name, meta: x.cat, art: x.art, tint: x.tint, price: x.price, compareAt: x.compareAt, rating: x.rating, reviews: x.reviews, badge: x.stock === 0 ? 'Sold out' : x.badge, badgeTone: x.stock === 0 ? 'neutral' : 'highlight', stock: x.stock, wished: wish[0].indexOf(x.id) > -1, onWish: function () { wish[1](wish[0].indexOf(x.id) > -1 ? wish[0].filter(function (i) { return i !== x.id; }) : wish[0].concat([x.id])); }, onClick: function () { cur[1](x); view[1]('product'); color[1](x.colors ? x.colors[0][0] : null); }, onAdd: function () { if (x.sizes) { cur[1](x); view[1]('product'); } else add(x); } }); })));
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Storefront', subtitle: 'What customers see · orders you place here show up in Orders', actions: [h(H.Segmented, { key: 'v', label: 'Store view', value: view[0] === 'product' ? 'catalog' : view[0], onChange: function (v) { placed[1](null); view[1](v); }, options: [{ value: 'catalog', label: 'Catalog', icon: 'grid' }, { value: 'cart', label: 'Cart' + (count ? ' · ' + count : ''), icon: 'cart' }] })] })),
      h(Section, { d: 80 }, h('div', { className: 'demo-store' }, header, h('div', { className: 'demo-store-body' }, body))));
  }

  /* ── Pricing / plan ── */
  function Pricing(p) {
    var yearly = useState(true), seats = useState(12), cancel = useState(false);
    var plans = [{ name: 'Starter', price: yearly[0] ? 9 : 12, was: yearly[0] ? 12 : null, text: 'For small teams getting organised', features: ['3 projects', '1 agent · Haiku only', 'Shop with up to 50 products', 'Email support', '-Approvals and audit log', '-SSO'] },
      { name: 'Team', price: yearly[0] ? 24 : 29, was: yearly[0] ? 29 : null, text: 'Everything a growing company runs on', featured: true, current: true, features: ['Unlimited projects', '10 agents · all models', 'Unlimited products, 3 channels', 'Approvals and audit log', 'Priority support', '-SSO'] },
      { name: 'Business', price: null, text: 'Security, control and an SLA', features: ['Everything in Team', 'Unlimited agents', 'SSO and SCIM', 'Data residency in the EU', '99.9% uptime SLA', 'Named success manager'], cta: 'Talk to sales' }];
    var monthly = seats[0] * (yearly[0] ? 24 : 29);
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'Plan & billing', subtitle: 'You’re on Team · renews on 1 May 2026', actions: [h(H.Segmented, { key: 'y', label: 'Billing period', value: yearly[0] ? 'Yearly' : 'Monthly', onChange: function (v) { yearly[1](v === 'Yearly'); }, options: ['Monthly', { value: 'Yearly', label: 'Yearly · save 17%' }] })] })),
      h(H.Stagger, { className: 'ha-plans', delay: 80 }, plans.map(function (pl) { return h(H.PlanCard, Object.assign({ key: pl.name, per: 'per seat / month' + (yearly[0] ? ', billed yearly' : ''), onPick: function () { H.toast({ text: pl.price == null ? 'Sales will reach out within a day (demo)' : 'Switched to ' + pl.name + ' (demo)', tone: 'info', icon: 'sparkle' }); } }, pl)); })),
      h(H.Stagger, { className: 'ha-grid demo-21', delay: 240 },
        h(H.Panel, { title: 'Seats', subtitle: 'You pay for people with access; agents are billed by usage' },
          h('div', { className: 'ha-row', style: { justifyContent: 'space-between', alignItems: 'flex-end' } }, h(H.NumberInput, { label: 'Seats', value: seats[0], min: 1, max: 500, onChange: seats[1] }), h('div', { style: { textAlign: 'right' } }, h('div', { className: 'ha-card-desc' }, 'New monthly total'), h('div', { className: 'ha-stat-value' }, H.money(monthly)))),
          h(H.UsageMeter, { label: 'Agent usage this month', used: 84, limit: 120, format: function (v) { return '€' + v; }, caption: 'Included up to €120 · then €3 per million tokens' })),
        h(H.Panel, { title: 'Payment method' },
          h('div', { className: 'demo-paycard' }, h(H.Icon, { name: 'card', size: 20 }), h('span', { className: 'ha-option-text' }, h('b', null, 'Visa ending 4242'), h('small', null, 'Expires 08/28')), h(H.Button, { size: 'sm', variant: 'soft' }, 'Update')),
          h('button', { type: 'button', className: 'ha-linkbtn', style: { alignSelf: 'flex-start', color: 'var(--blush-ink)' }, onClick: function () { cancel[1](true); } }, 'Cancel subscription'))),
      h(H.ConfirmDialog, { open: cancel[0], danger: true, title: 'Cancel your Team plan?', text: 'You keep everything until 1 May 2026. After that the workspace becomes read-only; nothing is deleted for 90 days.', confirmLabel: 'Cancel plan', cancelLabel: 'Keep my plan', onCancel: function () { cancel[1](false); }, onConfirm: function () { cancel[1](false); H.toast({ text: 'Plan ends on 1 May 2026', tone: 'warning', icon: 'flag', undo: function () { H.toast('Welcome back'); } }); } }));
  }

  /* ── System screens gallery + full-screen views ── */
  var SYS = [['signin', 'Sign in', 'lock', 'sky'], ['forgot', 'Forgot password', 'key', 'butter'], ['twofa', 'Two-step sign-in', 'shield', 'mint'], ['404', 'Page not found', 'search', 'sky'], ['500', 'Server error', 'x', 'blush'], ['maintenance', 'Maintenance', 'settings', 'butter'], ['offline', 'Offline', 'globe', 'lilac'], ['403', 'No access', 'lock', 'lilac']];
  function SystemGallery(p) {
    return h(React.Fragment, null,
      h(Section, null, h(H.PageHeader, { title: 'System screens', subtitle: 'Sign-in, errors and empty states · open one to see it full screen' })),
      h(H.Stagger, { className: 'ha-grid demo-4', delay: 60 }, SYS.map(function (s) { return h('button', { key: s[0], type: 'button', className: 'ha-card demo-syscard', onClick: function () { p.open(s[0]); } }, h(H.TintIcon, { icon: s[2], tint: s[3], size: 40 }), h('b', null, s[1]), h('span', { className: 'ha-card-desc' }, '#' + s[0])); })),
      h(Section, { d: 200 }, h(H.Panel, { title: 'Empty states', subtitle: 'Every list says what goes there and offers the first step' },
        h('div', { className: 'ha-grid demo-3' },
          h('div', { className: 'demo-emptybox' }, h(H.EmptyState, { icon: 'cart', tint: 'sky', title: 'No orders yet', text: 'Share your store link to get the first one.', action: h(H.Button, { size: 'sm', icon: 'link' }, 'Copy store link') })),
          h('div', { className: 'demo-emptybox' }, h(H.EmptyState, { icon: 'bot', tint: 'lilac', title: 'No agents yet', text: 'Start with a template; it begins in drafts-only mode.', action: h(H.Button, { size: 'sm', icon: 'plus' }, 'New agent') })),
          h('div', { className: 'demo-emptybox' }, h(H.EmptyState, { icon: 'search', tint: 'butter', title: 'Nothing matches “zebra”', text: 'Check the spelling or remove a filter.', action: h(H.Button, { size: 'sm', variant: 'secondary' }, 'Clear filters') }))))));
  }
  function FullScreen(p) {
    var code = useState(''), err = useState(false), sent = useState(false), done = useState(false);
    var back = h('button', { type: 'button', className: 'ha-btn ha-btn-ghost demo-fs-back', onClick: p.onExit }, h(H.Icon, { name: 'chevronLeft', size: 15 }), 'Back to the demo');
    var inner;
    if (p.kind === 'signin') inner = h(H.AuthCard, { title: 'Welcome back', text: 'Sign in to the Halo workspace.', foot: h('span', null, 'New here? ', h('a', { href: '#', onClick: function (e) { e.preventDefault(); } }, 'Create a workspace')) },
      h('form', { className: 'ha-col', style: { gap: 16 }, onSubmit: function (e) { e.preventDefault(); p.go('twofa'); } }, h(H.TextField, { label: 'Email', type: 'email', icon: 'mail', defaultValue: 'mara@halo.app', autoComplete: 'email' }), h(H.TextField, { label: 'Password', type: 'password', icon: 'lock', defaultValue: 'demo-password', autoComplete: 'current-password' }),
        h('div', { className: 'ha-row', style: { justifyContent: 'space-between' } }, h(H.Checkbox, { defaultChecked: true }, 'Keep me signed in'), h('button', { type: 'button', className: 'ha-linkbtn', onClick: function () { p.go('forgot'); } }, 'Forgot password?')),
        h(H.Button, { type: 'submit' }, 'Sign in'), h('div', { className: 'demo-or' }, h('span', null, 'or')), h(H.Button, { variant: 'secondary', icon: 'key', onClick: function () { p.go('twofa'); } }, 'Sign in with a passkey')));
    else if (p.kind === 'forgot') inner = sent[0] ? h(H.AuthCard, { icon: 'mail', tint: 'mint', title: 'Check your inbox', text: 'If mara@halo.app has an account, a reset link is on its way. It works for 30 minutes.', foot: h('button', { type: 'button', className: 'ha-linkbtn', onClick: function () { p.go('signin'); } }, 'Back to sign in') }, h(H.Button, { variant: 'secondary', onClick: function () { H.toast({ text: 'Sent again', tone: 'info', icon: 'mail' }); } }, 'Resend link'))
      : h(H.AuthCard, { icon: 'key', tint: 'butter', title: 'Reset your password', text: 'Enter your email and we’ll send a link to choose a new one.', foot: h('button', { type: 'button', className: 'ha-linkbtn', onClick: function () { p.go('signin'); } }, 'Back to sign in') },
        h('form', { className: 'ha-col', style: { gap: 16 }, onSubmit: function (e) { e.preventDefault(); sent[1](true); } }, h(H.TextField, { label: 'Email', type: 'email', icon: 'mail', defaultValue: 'mara@halo.app' }), h(H.Button, { type: 'submit', icon: 'send' }, 'Send reset link')));
    else if (p.kind === 'twofa') inner = h(H.AuthCard, { icon: done[0] ? 'check' : 'shield', tint: done[0] ? 'mint' : 'sky', title: done[0] ? 'You’re in' : 'Enter your code', text: done[0] ? 'Taking you to the workspace…' : 'Open your authenticator app and type the 6-digit code for Halo (demo: 246810).', foot: !done[0] && h('button', { type: 'button', className: 'ha-linkbtn', onClick: function () { H.toast({ text: 'Recovery codes are in your password manager (demo)', tone: 'info', icon: 'key' }); } }, 'Use a recovery code instead') },
      !done[0] && h('div', { className: 'ha-col', style: { gap: 12, alignItems: 'center' } }, h(H.OtpInput, { key: code[0], error: err[0], onComplete: function (c) { if (c === '246810') { done[1](true); setTimeout(p.onExit, 1100); } else { err[1](true); setTimeout(function () { err[1](false); code[1](String(Date.now())); }, 420); } } }), err[0] && h('span', { className: 'ha-field-error' }, 'That code didn’t match')));
    else inner = h('div', { className: 'demo-fs-status' }, h(H.StatusScreen, { code: p.kind, reference: p.kind === '500' ? 'req_8f2a91c4' : null, onHome: p.onExit, onContact: function () { H.toast({ text: 'Support chat opened (demo)', tone: 'info', icon: 'mail' }); },
      extra: p.kind === 'maintenance' ? h('div', { style: { width: '100%', maxWidth: 320 } }, h(H.UsageMeter, { label: 'Upgrade progress', used: 72, limit: 100, format: function (v) { return v + '%'; }, caption: 'About 4 minutes left' })) : p.kind === '404' ? h(H.SearchField, { placeholder: 'Search the workspace', style: { width: '100%', maxWidth: 360 } }) : null }));
    return h('div', { className: 'demo-fullscreen' }, back, inner);
  }

  function App() {
    var fsv = useState(fsFromHash()), db = useState(function () { var saved = loadSaved(), base = initial(); return saved ? Object.assign(base, saved) : base; }), page = useState(pageFromHash()), q = useState(''), modal = useState(null), toast = useState(null), ver = useState(0), menu = useState(false), chatAgent = useState('atlas'), dnsDom = useState('halo.app'), pal = useState(false), notesOpen = useState(false), drawer = useState(null), wizard = useState(null), fileInput = React.useRef(null);
    var prefs = useState(function () { return store('prefs') || { theme: 'System', approvals: true, invoices: true, digest: false }; });
    var D = db[0];
    useEffect(function () { var t = prefs[0].theme; if (t === 'System') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t.toLowerCase()); store('prefs', prefs[0]); }, [prefs[0]]);
    useEffect(function () { var t = setTimeout(function () { try { localStorage.setItem('halo-demo-db-v3', JSON.stringify(D)); } catch (e) {} }, 400); return function () { clearTimeout(t); }; }, [D]);
    useEffect(function () { if (!toast[0]) return; var t = setTimeout(function () { toast[1](null); }, 4200); return function () { clearTimeout(t); }; }, [toast[0]]);
    useEffect(function () { if (!menu[0]) return; function close(e) { if (!e.target.closest('.demo-usermenu') && !e.target.closest('.ha-user')) menu[1](false); } function key(e) { if (e.key === 'Escape') menu[1](false); } document.addEventListener('mousedown', close); document.addEventListener('keydown', key); return function () { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', key); }; }, [menu[0]]);
    useEffect(function () { function k(e) { if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); pal[1](function (x) { return !x; }); } } document.addEventListener('keydown', k); return function () { document.removeEventListener('keydown', k); }; }, []);
    useEffect(function () { if (!notesOpen[0]) return; function close(e) { if (!e.target.closest('.demo-notes') && !e.target.closest('.demo-bell')) notesOpen[1](false); } function key(e) { if (e.key === 'Escape') notesOpen[1](false); } document.addEventListener('mousedown', close); document.addEventListener('keydown', key); return function () { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', key); }; }, [notesOpen[0]]);
    /* live build: advance any building deployment */
    useEffect(function () {
      var building = D.deploys.some(function (d) { return d.status === 'Building'; });
      if (!building) return;
      var t = setTimeout(function () {
        var done = null;
        patch('deploys', function (a) { return a.map(function (d) { if (d.status !== 'Building') return d; var pr = Math.min(100, (d.progress || 0) + 12); if (pr >= 100) { done = d; return Object.assign({}, d, { status: 'Ready', progress: 100, dur: '1m ' + int(20, 50) + 's', when: 'Now' }); } return Object.assign({}, d, { progress: pr }); }); });
        if (done) { say(done.repo + ' is live', null, 'mint', 'zap', true); patch('notes', function (n) { return [{ id: Date.now(), icon: 'zap', tint: 'mint', title: done.repo + ' is live', text: done.commit, page: 'deployments', time: 'Now', unread: true }].concat(n); }); }
      }, 900);
      return function () { clearTimeout(t); };
    }, [D.deploys]);

    function patch(k, fn) { db[1](function (s) { var n = Object.assign({}, s); n[k] = fn(s[k]); return n; }); }
    function say(msg, undo, tint, icon, quiet) { H.toast({ text: msg, undo: undo || undefined, tone: { mint: 'success', sky: 'info', butter: 'warning', blush: 'danger', lilac: 'highlight' }[tint] || 'success', icon: icon || (tint ? undefined : 'check') }); if (!quiet) { var d = new Date(); db[1](function (st) { return Object.assign({}, st, { audit: [{ id: Date.now() + Math.random(), time: ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2), who: 'Mara Ellis', agent: false, what: msg.replace(/ \(demo( only)?\)$/, ''), area: areaOf(page[0]).label, ip: 'this browser' }].concat(st.audit) }); }); } }
    function openFs(k) { fsv[1](k); try { history.replaceState(null, '', '#' + k); } catch (e) {} window.scrollTo(0, 0); }
    function exitFs() { fsv[1](null); try { history.replaceState(null, '', '#' + page[0]); } catch (e) {} }
    function go(pg) { page[1](pg); menu[1](false); notesOpen[1](false); try { history.replaceState(null, '', '#' + pg); } catch (e) {} window.scrollTo(0, 0); }
    function setStatus(x, s) {
      var before = x.status;
      patch('projects', function (a) { return a.map(function (y) { return y.id === x.id ? Object.assign({}, y, { status: s }) : y; }); });
      say(x.title + (s === 'Live' ? ' is live' : s === 'Archived' ? ' archived' : s === 'Review' ? ' sent for review' : ' moved to ' + s.toLowerCase()), function () { patch('projects', function (a) { return a.map(function (y) { return y.id === x.id ? Object.assign({}, y, { status: before }) : y; }); }); }, s === 'Live' ? 'mint' : 'sky');
    }
    function action(kind) {
      if (kind === 'redeploy') { patch('deploys', function (a) { return [{ id: 'dpl_' + Math.random().toString(16).slice(2, 6), repo: 'halo-web', env: 'Production', branch: 'main', commit: 'Redeploy of main', status: 'Building', dur: '—', when: 'Now', by: 'Mara Ellis', progress: 0 }].concat(a); }); go('deployments'); say('Build started for halo-web', null, 'sky', 'refresh'); return; }
      if (kind === 'invoice-new') { go('invoice-new'); return; }
      if (kind === 'product') { go('products'); return; }
      if (kind === 'upload') { if (fileInput.current) fileInput.current.click(); if (page[0] !== 'files') go('files'); return; }
      modal[1]({ kind: kind });
    }

    var area = areaOf(page[0]), pg = page[0], common = { toast: function (m) { say(m); } };
    var mailUnread = D.mail.filter(function (m) { return m.folder === 'Inbox' && m.unread; }).length;
    var review = D.runs.filter(function (r) { return r.status === 'Needs review'; }).length;
    var counts = { orders: (D.orders || []).filter(function (o) { return o.status === 'Paid' || o.status === 'Packed'; }).length || null, 'mail-inbox': mailUnread, 'mail-drafts': D.mail.filter(function (m) { return m.folder === 'Drafts'; }).length, runs: review, board: D.tasks.filter(function (t) { return t.col !== 'done'; }).length, domains: D.domains.filter(function (d) { return d.status !== 'Active'; }).length, deployments: D.deploys.filter(function (d) { return d.status === 'Building'; }).length || null, billing: D.invoices.filter(function (x) { return x.status === 'Overdue'; }).length, expenses: D.expenses.filter(function (e) { return e.status !== 'Booked'; }).length, bank: D.bank.filter(function (t) { return !t.match; }).length, pipeline: D.deals.filter(function (d) { return d.stage === 'negotiation'; }).length || null, companies: D.companies.filter(function (c) { return c.health === 'At risk'; }).length || null, setup: SETUP.length - SETUP.filter(function (x) { return D.setup[x[0]]; }).length || null };

    var setupDone = SETUP.filter(function (x) { return D.setup[x[0]]; }).length, unreadNotes = D.notes.filter(function (n) { return n.unread; }).length;
    var content, side = null;
    if (pg === 'overview') { content = h(React.Fragment, null, setupDone < SETUP.length && h('button', { type: 'button', className: 'demo-setupcard ha-in', onClick: function () { wizard[1]({ start: SETUP.findIndex(function (x) { return !D.setup[x[0]]; }) }); } }, h(H.ProgressRing, { value: Math.round(setupDone / SETUP.length * 100), size: 52, stroke: 6, tint: 'mint' }), h('span', { style: { flex: 1, minWidth: 0 } }, h('b', null, 'Finish setting up Halo'), h('span', { className: 'ha-card-desc', style: { display: 'block' } }, setupDone + ' of ' + SETUP.length + ' done · next: ' + SETUP.filter(function (x) { return !D.setup[x[0]]; })[0][1])), h('span', { className: 'demo-fintodo-go' }, 'Continue', h(H.Icon, { name: 'chevronRight', size: 14 }))), h(Overview, { projects: D.projects, q: q[0], setQ: q[1], setStatus: setStatus, open: function (x) { modal[1]({ kind: 'project', project: x }); }, onNew: function () { modal[1]({ kind: 'new' }); } })); side = h(Schedule, { projects: D.projects, open: function (x) { modal[1]({ kind: 'project', project: x }); } }); }
    else if (pg === 'reports') content = h(Reports);
    else if (pg === 'people') content = h(People, { members: D.members, setAll: function (fn, msg, undo, tint, icon) { patch('members', fn); if (msg) say(msg, undo, tint, icon); }, onInvite: function () { modal[1]({ kind: 'invite' }); }, update: function (m, ch, msg) { patch('members', function (a) { return a.map(function (y) { return y.id === m.id ? Object.assign({}, y, ch) : y; }); }); say(msg); } });
    else if (pg === 'finance') content = h(FinanceOverview, { invoices: D.invoices, expenses: D.expenses, bank: D.bank, go: go });
    else if (pg === 'invoice-new') content = h(InvoiceEditor, Object.assign({ invoices: D.invoices, go: go, create: function (x) { patch('invoices', function (a) { return [x].concat(a); }); go('billing'); say('Invoice #' + x.id + (x.status === 'Draft' ? ' saved as draft' : ' created and sent (demo)'), null, 'mint', 'card'); } }, common));
    else if (pg === 'expenses') content = h(Expenses, { expenses: D.expenses,
      set: function (e, ch, msg) { patch('expenses', function (a) { return a.map(function (x) { return x.id === e.id ? Object.assign({}, x, ch) : x; }); }); if (msg) say(msg, null, 'mint', 'check'); },
      upload: function (fname) { var id = 'E-' + (4200 + Math.floor(Math.random() * 99)), guess = VENDORS[Math.floor(Math.random() * 6)]; patch('expenses', function (a) { return [{ id: id, vendor: fname || 'New receipt', cat: 'Office', vat: 19, gross: 0, date: today, status: 'Reading', receipt: true }].concat(a); }); setTimeout(function () { patch('expenses', function (a) { return a.map(function (x) { return x.id === id ? Object.assign({}, x, { vendor: guess[0], cat: guess[1], vat: guess[2], gross: Math.round((40 + Math.random() * 180) * 100) / 100, status: 'To review' }) : x; }); }); say('Ledger read the receipt: ' + guess[0] + ', ' + guess[1], null, 'butter', 'bot'); }, 1600); } });
    else if (pg === 'bank') content = h(Bank, Object.assign({ bank: D.bank, match: function (t) { patch('bank', function (a) { return a.map(function (x) { return x.id === t.id ? Object.assign({}, x, { match: { kind: 'manual', ref: t.amount > 0 ? 'income' : 'expense' } }) : x; }); }); say('Transaction matched', null, 'mint', 'check'); } }, common));
    else if (pg === 'vat') content = h(Vat, { invoices: D.invoices, expenses: D.expenses, bank: D.bank, filed: D.filed, file: function (q) { patch('filed', function (f) { var n = Object.assign({}, f); n[q] = fmtDate(today); return n; }); say('VAT return ' + q + ' marked as filed', null, 'mint', 'check'); } });
    else if (pg === 'pnl') content = h(Pnl, Object.assign({ invoices: D.invoices, expenses: D.expenses }, common));
    else if (pg === 'billing') content = h(Billing, { invoices: D.invoices, onInvoice: function () { go('invoice-new'); }, markPaid: function (x) { var before = x.status; patch('invoices', function (a) { return a.map(function (y) { return y.id === x.id ? Object.assign({}, y, { status: 'Paid' }) : y; }); }); say('Invoice #' + x.id + ' marked as paid', function () { patch('invoices', function (a) { return a.map(function (y) { return y.id === x.id ? Object.assign({}, y, { status: before }) : y; }); }); }, 'mint'); } });
    else if (pg === 'board') content = h(Board, { tasks: D.tasks, onTask: function (col) { modal[1]({ kind: 'task', col: col || 'todo' }); }, moveTask: function (t, col) { patch('tasks', function (a) { return a.map(function (y) { return y.id === t.id ? Object.assign({}, y, { col: col }, col === 'done' ? { tag: 'Done', tone: 'success' } : {}) : y; }); }); say(t.title + ' → ' + COLS.filter(function (c) { return c[0] === col; })[0][1]); } });
    else if (pg === 'calendar') content = h(Calendar, common);
    else if (pg === 'account') content = h(Account, Object.assign({ prefs: prefs[0], setPrefs: prefs[1], reset: function () { try { localStorage.removeItem('halo-demo-db-v3'); } catch (e) {} db[1](initial()); ver[1](ver[0] + 1); say('Demo reset to its starting data', null, 'sky', 'swap'); } }, common));
    else if (pg === 'companies') content = h(Companies, { companies: D.companies, deals: D.deals, open: function (n) { drawer[1](n); }, onDeal: function () { modal[1]({ kind: 'deal' }); } });
    else if (pg === 'pipeline') content = h(Pipeline, { deals: D.deals, open: function (n) { drawer[1](n); }, onDeal: function () { modal[1]({ kind: 'deal' }); }, move: function (d, st) { var before = d.stage; patch('deals', function (a) { return a.map(function (x) { return x.id === d.id ? Object.assign({}, x, { stage: st }) : x; }); }); var sn = STAGES.filter(function (x) { return x[0] === st; })[0][1]; say(d.company + ' moved to ' + sn, function () { patch('deals', function (a) { return a.map(function (x) { return x.id === d.id ? Object.assign({}, x, { stage: before }) : x; }); }); }, st === 'won' ? 'mint' : 'sky', st === 'won' ? 'star' : 'trend'); } });
    else if (pg === 'contacts') content = h(Contacts, { contacts: D.contacts, open: function (n) { drawer[1](n); }, compose: function (to) { modal[1]({ kind: 'compose', to: to }); } });
    else if (pg === 'workflows') content = h(Workflows, Object.assign({ flows: D.flows, setFlow: function (id, ch) { patch('flows', function (a) { return a.map(function (x) { return x.id === id ? Object.assign({}, x, ch) : x; }); }); }, addFlow: function (w) { patch('flows', function (a) { return a.concat([w]); }); say('Workflow created'); } }, common));
    else if (pg === 'files') content = h(Files, Object.assign({ files: D.files, pick: function () { if (fileInput.current) fileInput.current.click(); }, add: function (list, folder) { addFiles(list, folder); }, set: function (f, ch) { patch('files', function (a) { return a.map(function (x) { return x.id === f.id ? Object.assign({}, x, ch) : x; }); }); }, remove: function (f) { patch('files', function (a) { return a.filter(function (x) { return x.id !== f.id; }); }); say(f.name + ' deleted', function () { patch('files', function (a) { return [f].concat(a); }); }, 'blush', 'trash'); } }, common));
    else if (pg === 'roles') content = h(Roles, { roles: D.roles, cycle: function (ri, ai) { var r = D.roles[ri]; if (r.locked) return; var nv = (r.p[ai] + 1) % 4; patch('roles', function (a) { return a.map(function (x, j) { if (j !== ri) return x; var pp = x.p.slice(); pp[ai] = nv; return Object.assign({}, x, { p: pp }); }); }); say(r.name + ' · ' + PERM_AREAS[ai] + ': ' + LEVELS[nv], null, 'lilac', 'lock'); } });
    else if (pg === 'audit') content = h(Audit, { audit: D.audit });
    else if (pg === 'setup') content = h(Setup, { setup: D.setup, open: function (i) { wizard[1]({ start: i }); } });
    else if (pg === 'agents') content = h(AgentFleet, { agents: D.agents, runs: D.runs, onNew: function () { modal[1]({ kind: 'agent' }); }, chat: function (id) { chatAgent[1](id); go('agent-chat'); },
      toggle: function (a) { var run = a.status === 'Running' || a.status === 'Needs review'; patch('agents', function (l) { return l.map(function (x) { return x.id === a.id ? Object.assign({}, x, { status: run ? 'Paused' : 'Running' }) : x; }); }); say(a.name + (run ? ' paused' : ' resumed'), null, run ? 'butter' : 'mint', run ? 'pause' : 'play'); },
      fix: function (a) { patch('agents', function (l) { return l.map(function (x) { return x.id === a.id ? Object.assign({}, x, { status: 'Running', error: null }) : x; }); }); say('Docs reconnected. ' + a.name + ' is running again', null, 'mint', 'link'); } });
    else if (pg === 'agent-chat') content = h(AgentChat, { key: chatAgent[0], agents: D.agents, agentId: chatAgent[0], chats: D.chats, configure: function (id) { chatAgent[1](id); go('agent-builder'); },
      push: function (id, m) { patch('chats', function (c) { var n = Object.assign({}, c); n[id] = (c[id] || []).concat([m]); return n; }); },
      edit: function (id, fn) { patch('chats', function (c) { var n = Object.assign({}, c); n[id] = (c[id] || []).map(fn); return n; }); },
      set: function (id, arr) { patch('chats', function (c) { var n = Object.assign({}, c); n[id] = arr; return n; }); } });
    else if (pg === 'agent-builder') content = h(AgentBuilder, { key: chatAgent[0], agents: D.agents, agentId: chatAgent[0], pick: function (id) { chatAgent[1](id); }, save: function (id, ch) { patch('agents', function (a) { return a.map(function (x) { return x.id === id ? Object.assign({}, x, ch) : x; }); }); say('Saved. New runs use the updated setup', null, 'mint', 'check'); } });
    else if (pg === 'shop') content = h(ShopOverview, { orders: D.orders, products: D.products, go: go });
    else if (pg === 'products') content = h(Products, { products: D.products, setMany: function (rows, ch, msg) { var ids = rows.map(function (r) { return r.id; }); patch('products', function (a) { return a.map(function (x) { return ids.indexOf(x.id) > -1 ? Object.assign({}, x, ch) : x; }); }); if (msg) say(msg); }, save: function (x) { if (x.id === 'new') { var nx = Object.assign({}, x, { id: 'p' + Date.now() }); patch('products', function (a) { return [nx].concat(a); }); say(x.name + ' added'); } else { patch('products', function (a) { return a.map(function (y) { return y.id === x.id ? x : y; }); }); say(x.name + ' saved'); } } });
    else if (pg === 'orders') content = h(Orders, { orders: D.orders, setMany: function (rows, ch, msg) { var ids = rows.map(function (r) { return r.id; }); patch('orders', function (a) { return a.map(function (x) { return ids.indexOf(x.id) > -1 ? Object.assign({}, x, ch) : x; }); }); if (msg) say(msg, null, ch.status === 'Refunded' ? 'blush' : 'mint', ch.status === 'Shipped' ? 'truck' : ch.status === 'Packed' ? 'package' : null); } });
    else if (pg === 'storefront') content = h(Storefront, { products: D.products, cart: D.cart || [], setCart: function (v) { patch('cart', function () { return v; }); }, go: go, placeOrder: function (id, cart) { patch('orders', function (a) { return [{ id: id, who: 'Lena Fischer', city: 'Hamburg', lines: cart.map(function (l) { return { pid: l.pid, name: l.name, art: l.art, tint: l.tint, price: l.price, qty: l.qty, variant: l.variant }; }), total: cart.reduce(function (n, l) { return n + l.price * l.qty; }, 0), status: 'Paid', mins: 0, channel: 'Online store', pay: 'Card' }].concat(a); }); patch('products', function (a) { return a.map(function (x) { var q = cart.filter(function (l) { return l.pid === x.id; }).reduce(function (n, l) { return n + l.qty; }, 0); return q ? Object.assign({}, x, { stock: Math.max(0, x.stock - q), sold: x.sold + q }) : x; }); }); say('New order #' + id + ' from the storefront', null, 'mint', 'cart'); } });
    else if (pg === 'pricing') content = h(Pricing);
    else if (pg === 'system') content = h(SystemGallery, { open: openFs });
    else if (pg === 'not-found') content = h(H.StatusScreen, { code: '404', onHome: function () { go('overview'); }, onContact: function () { go('mail-inbox'); } });
    else if (pg === 'runs') content = h(Runs, { runs: D.runs, agents: D.agents, decide: function (r, s, msg) { patch('runs', function (a) { return a.map(function (x) { return x.id === r.id ? Object.assign({}, x, { status: s }) : x; }); }); say(msg, null, s === 'Failed' ? 'blush' : 'mint'); } });
    else if (pg === 'knowledge') content = h(Knowledge, { sources: D.sources, onAdd: function () { modal[1]({ kind: 'source' }); }, sync: function (i) { patch('sources', function (a) { return a.map(function (s, j) { return j === i ? Object.assign({}, s, { synced: 'Just now', status: 'Valid' }) : s; }); }); say(D.sources[i].name + ' synced', null, 'mint', 'refresh'); } });
    else if (pg === 'usage') content = h(Usage, { agents: D.agents, runs: D.runs });
    else if (pg === 'repos') content = h(Repos, { go: go });
    else if (pg === 'deployments') content = h(Deployments, { deploys: D.deploys, redeploy: function () { action('redeploy'); }, retry: function (d) { patch('deploys', function (a) { return a.map(function (x) { return x.id === d.id ? Object.assign({}, x, { status: 'Building', progress: 0, when: 'Now' }) : x; }); }); say('Retrying ' + d.repo, null, 'sky', 'refresh'); } });
    else if (pg === 'domains') content = h(Domains, { domains: D.domains, onAdd: function () { modal[1]({ kind: 'domain' }); }, openDns: function (n) { dnsDom[1](n); go('dns'); }, setRenew: function (d, v) { patch('domains', function (a) { return a.map(function (x) { return x.name === d.name ? Object.assign({}, x, { renew: v, status: v && x.status === 'Expiring' ? 'Active' : x.status }) : x; }); }); say('Auto-renew ' + (v ? 'on' : 'off') + ' for ' + d.name, null, v ? 'mint' : 'butter'); } });
    else if (pg === 'dns') content = h(DnsRecords, Object.assign({ key: dnsDom[0], domain: dnsDom[0], domains: D.domains, dns: D.dns, pick: dnsDom[1], addRec: function (dom, r) { patch('dns', function (d) { var n = Object.assign({}, d); n[dom] = (d[dom] || []).concat([r]); return n; }); say(r[0] + ' record added to ' + dom, null, 'mint', 'server'); }, delRec: function (dom, r) { patch('dns', function (d) { var n = Object.assign({}, d); n[dom] = d[dom].filter(function (x) { return x !== r; }); return n; }); say('Record deleted', function () { patch('dns', function (d) { var n = Object.assign({}, d); n[dom] = d[dom].concat([r]); return n; }); }, 'blush', 'trash'); } }, common));
    else if (pg === 'certificates') content = h(Certificates, { domains: D.domains, renew: function (d) { patch('domains', function (a) { return a.map(function (x) { return x.name === d.name ? Object.assign({}, x, { ssl: 'Valid', sslDays: 90 }) : x; }); }); say('New certificate issued for ' + d.name, null, 'mint', 'lock'); } });
    else if (pg.indexOf('mail-') === 0) {
      var folder = MAIL_FOLDERS.filter(function (f) { return 'mail-' + f[0].toLowerCase() === pg; })[0][0];
      content = h(Mail, { folder: folder, mail: D.mail, compose: function () { modal[1]({ kind: 'compose' }); },
        set: function (m, ch) { patch('mail', function (a) { return a.map(function (x) { return x.id === m.id ? Object.assign({}, x, ch) : x; }); }); },
        move: function (m, f) { var before = m.folder; patch('mail', function (a) { return a.map(function (x) { return x.id === m.id ? Object.assign({}, x, { folder: f }) : x; }); }); say('Moved to ' + f, function () { patch('mail', function (a) { return a.map(function (x) { return x.id === m.id ? Object.assign({}, x, { folder: before }) : x; }); }); }, f === 'Trash' ? 'blush' : 'sky', f === 'Trash' ? 'trash' : 'archive'); },
        send: function (m) { patch('mail', function (a) { return [{ id: Date.now(), folder: 'Sent', from: 'Mara Ellis', email: 'mara@halo.app', to: m.to, subject: m.subject, body: m.body.split('\n'), date: 'Now', unread: false, starred: false, label: null, att: null }].concat(a); }); say('Sent to ' + m.to + ' (demo only)', null, 'mint', 'send'); } });
    }

    function addFiles(list, folder) { var arr = Array.prototype.slice.call(list || []); if (!arr.length) return; patch('files', function (a) { return arr.map(function (f, i) { return { id: Date.now() + i, name: f.name, kind: kindOf(f.name, f.type), size: fmtSize(f.size || 0), folder: folder || 'Receipts', owner: 'Mara Ellis', updated: 'Just now', shared: false }; }).concat(a); }); say(arr.length === 1 ? arr[0].name + ' uploaded' : arr.length + ' files uploaded', null, 'sky', 'paperclip'); }
    var palItems = [];
    AREAS.forEach(function (a) { (a.label === 'Mail' ? MAIL_FOLDERS.map(function (f) { return [f[0], f[1], 'mail-' + f[0].toLowerCase()]; }) : a.pages).forEach(function (pp) { palItems.push({ id: 'p-' + pp[2], group: 'Pages', label: pp[0], hint: a.label, icon: pp[1], tint: 'plain', run: function () { go(pp[2]); } }); }); });
    [['New invoice', 'card', 'butter', function () { go('invoice-new'); }], ['New project', 'grid', 'mint', function () { modal[1]({ kind: 'new' }); }], ['New deal', 'trend', 'mint', function () { modal[1]({ kind: 'deal' }); }], ['New agent', 'bot', 'lilac', function () { modal[1]({ kind: 'agent' }); }], ['Compose mail', 'edit', 'sky', function () { modal[1]({ kind: 'compose' }); }], ['Add domain', 'globe', 'mint', function () { modal[1]({ kind: 'domain' }); }], ['Invite teammate', 'users', 'sky', function () { modal[1]({ kind: 'invite' }); }], ['Redeploy main', 'refresh', 'sky', function () { action('redeploy'); }], ['Upload files', 'paperclip', 'butter', function () { go('files'); setTimeout(function () { if (fileInput.current) fileInput.current.click(); }, 0); }], ['Open setup guide', 'sparkle', 'lilac', function () { wizard[1]({ start: 0 }); }], ['Switch theme', 'moon', 'plain', function () { var dark = prefs[0].theme === 'Dark' || (prefs[0].theme === 'System' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches); prefs[1](Object.assign({}, prefs[0], { theme: dark ? 'Light' : 'Dark' })); }]].forEach(function (x) { palItems.push({ id: 'a-' + x[0], group: 'Actions', label: x[0], icon: x[1], tint: x[2], run: x[3] }); });
    D.companies.forEach(function (c) { palItems.push({ id: 'c-' + c.name, group: 'Records', label: c.name, hint: 'Customer · ' + c.plan, icon: 'users', tint: 'sky', run: function () { go('companies'); drawer[1](c.name); } }); });
    D.invoices.slice(0, 30).forEach(function (x) { palItems.push({ id: 'i-' + x.id, group: 'Records', label: 'Invoice #' + x.id, hint: x.company + ' · ' + x.status, icon: 'card', tint: 'butter', run: function () { go('billing'); } }); });
    D.projects.forEach(function (x) { palItems.push({ id: 'pr-' + x.id, group: 'Records', label: x.title, hint: 'Project · ' + x.status, icon: x.icon, tint: x.tint, run: function () { go('overview'); modal[1]({ kind: 'project', project: x }); } }); });
    D.agents.forEach(function (x) { palItems.push({ id: 'ag-' + x.id, group: 'Records', label: x.name, hint: 'Agent · ' + x.role, icon: 'bot', tint: 'lilac', run: function () { chatAgent[1](x.id); go('agent-chat'); } }); });
    D.mail.forEach(function (x) { palItems.push({ id: 'm-' + x.id, group: 'Records', label: x.subject, hint: 'Mail · ' + x.from, icon: 'mail', tint: 'plain', run: function () { go('mail-' + x.folder.toLowerCase()); } }); });
    var m = modal[0], modalEl = null, close = function () { modal[1](null); };
    if (m && m.kind === 'project') modalEl = h(ProjectModal, { project: D.projects.filter(function (x) { return x.id === m.project.id; })[0], onClose: close, setStatus: setStatus });
    if (m && m.kind === 'new') modalEl = h(FormModal, { icon: 'grid', tint: 'mint', title: 'New project', text: 'It starts as a draft so you can review it before going live.', submit: 'Create project', onClose: close, onSubmit: function (fd) { var x = { id: Date.now(), title: fd.title, desc: fd.desc || 'No description yet.', icon: 'sparkle', tint: 'mint', owner: fd.owner, status: 'Draft', steps: 1, users: 0, progress: 0 }; patch('projects', function (a) { return [x].concat(a); }); close(); go('overview'); say(fd.title + ' created as a draft', null, 'mint', 'sparkle'); } },
      h(Field, { label: 'Project name', name: 'title', required: true, placeholder: 'e.g. Spring launch' }), h(Field, { label: 'Short description', name: 'desc', placeholder: 'One line about the goal' }), h(Field, { label: 'Owner', name: 'owner', options: D.members.slice(0, 12).map(function (x) { return x.name; }) }));
    if (m && m.kind === 'invite') modalEl = h(FormModal, { icon: 'users', tint: 'sky', title: 'Invite a teammate', text: 'Demo only: no email is sent.', submit: 'Add invite', submitIcon: 'send', onClose: close, onSubmit: function (fd) { var nm = fd.email.split('@')[0].split(/[._-]/).map(function (s) { return s.charAt(0).toUpperCase() + s.slice(1); }).join(' '); patch('members', function (a) { return a.concat([{ id: Date.now(), name: nm, email: fd.email, role: fd.role, team: fd.team, status: 'Invited', last: 99999 }]); }); close(); say(nm + ' invited as ' + fd.role, null, 'sky', 'send'); } },
      h(Field, { label: 'Email address', name: 'email', type: 'email', required: true, placeholder: 'name@company.com' }), h('div', { className: 'ha-grid demo-2' }, h(Field, { label: 'Role', name: 'role', options: ['Editor', 'Viewer', 'Admin'] }), h(Field, { label: 'Team', name: 'team', options: TEAMS })));
    if (m && m.kind === 'invoice') modalEl = h(FormModal, { icon: 'card', tint: 'butter', title: 'New invoice', text: 'Adds a due invoice to the demo ledger.', submit: 'Create invoice', onClose: close, onSubmit: function (fd) { var id = Math.max.apply(null, D.invoices.map(function (x) { return x.id; })) + 1; patch('invoices', function (a) { return [{ id: id, company: fd.company, date: today, amount: Math.max(1, parseFloat(fd.amount) || 0), status: 'Due' }].concat(a); }); close(); go('billing'); say('Invoice #' + id + ' created', null, 'butter', 'card'); } },
      h(Field, { label: 'Customer', name: 'company', options: COMPANIES }), h(Field, { label: 'Amount (EUR, net)', name: 'amount', type: 'number', min: '1', required: true, value: '1240' }));
    if (m && m.kind === 'task') modalEl = h(FormModal, { icon: 'plus', tint: 'lilac', title: 'New task', submit: 'Add task', onClose: close, onSubmit: function (fd) { var col = m.col || 'todo'; patch('tasks', function (a) { return a.concat([{ id: Date.now(), col: col, title: fd.title, tag: fd.tag || 'Task', tone: col === 'done' ? 'success' : null, who: [fd.who] }]); }); close(); say('Task added to ' + COLS.filter(function (c) { return c[0] === col; })[0][1]); } },
      h(Field, { label: 'Task', name: 'title', required: true, placeholder: 'What needs doing?' }), h('div', { className: 'ha-grid demo-2' }, h(Field, { label: 'Label', name: 'tag', placeholder: 'e.g. Design' }), h(Field, { label: 'Assignee', name: 'who', options: D.members.slice(0, 10).map(function (x) { return x.name; }) })));
    if (m && m.kind === 'agent') modalEl = h(FormModal, { icon: 'bot', tint: 'lilac', title: 'New agent', text: 'Agents start in drafts-only mode until you trust them.', submit: 'Create agent', onClose: close, onSubmit: function (fd) { var a = { id: 'a' + Date.now(), name: fd.name, role: fd.role || 'Assistant', model: fd.model, status: 'Running', tint: pick(['sky', 'mint', 'lilac', 'butter']), tasks: 0, success: 100, cost: 0, tools: [fd.tool], desc: fd.instructions || 'No instructions yet.', autonomy: 'Drafts only' }; patch('agents', function (l) { return l.concat([a]); }); patch('chats', function (c) { var n = Object.assign({}, c); n[a.id] = [['agent', 'Hi Mara, I am ' + a.name + '. I can use ' + fd.tool + '. What should I start with?', null]]; return n; }); close(); go('agents'); say(fd.name + ' is running', null, 'mint', 'bot'); } },
      h('div', { className: 'ha-grid demo-2' }, h(Field, { label: 'Name', name: 'name', required: true, placeholder: 'e.g. Iris' }), h(Field, { label: 'Job', name: 'role', placeholder: 'e.g. Onboarding helper' })),
      h('div', { className: 'ha-grid demo-2' }, h(Field, { label: 'Model', name: 'model', options: ['Claude Sonnet 5.5', 'Claude Haiku 5.5', 'Claude Opus 5.5'] }), h(Field, { label: 'Main tool', name: 'tool', options: ['Mailbox', 'Knowledge base', 'Billing', 'Repositories', 'Domains', 'CRM'] })),
      h('label', { className: 'ha-field' }, h('span', { className: 'ha-field-label' }, 'Instructions'), h('textarea', { className: 'ha-input', name: 'instructions', id: 'f-instructions', rows: 3, placeholder: 'What should this agent do, and what must it never do?' })));
    if (m && m.kind === 'source') modalEl = h(FormModal, { icon: 'book', tint: 'butter', title: 'Add knowledge source', submit: 'Add and sync', onClose: close, onSubmit: function (fd) { patch('sources', function (a) { return a.concat([{ name: fd.name, kind: fd.kind, items: 'Indexing…', synced: 'Just now', status: 'Pending', icon: fd.kind === 'Website' ? 'globe' : 'file', tint: 'sky' }]); }); close(); say(fd.name + ' is syncing', null, 'sky', 'refresh'); } },
      h(Field, { label: 'Name', name: 'name', required: true, placeholder: 'e.g. Onboarding guide' }), h(Field, { label: 'Type', name: 'kind', options: ['Website', 'Document', 'Spreadsheet', 'Repository'] }), h(Field, { label: 'Address', name: 'url', placeholder: 'https://…' }));
    if (m && m.kind === 'domain') modalEl = h(DomainModal, { onClose: close, taken: D.domains.map(function (d) { return d.name; }), add: function (name) { patch('domains', function (a) { return a.concat([{ name: name, status: 'Pending', expires: '—', renew: true, ssl: 'Pending', sslDays: 0, registrar: 'Halo Domains', dns: 'Waiting for nameservers' }]); }); patch('dns', function (d) { var n = Object.assign({}, d); n[name] = []; return n; }); close(); go('domains'); say(name + ' added. Waiting for DNS', null, 'sky', 'globe'); } });
    if (m && m.kind === 'deal') modalEl = h(FormModal, { icon: 'trend', tint: 'mint', title: 'New deal', text: 'Starts in the stage you pick.', submit: 'Create deal', onClose: close, onSubmit: function (fd) { patch('deals', function (a) { return a.concat([{ id: Date.now(), company: fd.company, title: fd.title, value: Math.max(0, parseFloat(fd.value) || 0), stage: fd.stage, owner: 'Mara Ellis', close: 'May 30' }]); }); close(); go('pipeline'); say('Deal "' + fd.title + '" added for ' + fd.company, null, 'mint', 'trend'); } },
      h(Field, { label: 'Company', name: 'company', options: COMPANIES }), h(Field, { label: 'Deal name', name: 'title', required: true, placeholder: 'e.g. Team plan + SSO' }), h('div', { className: 'ha-grid demo-2' }, h(Field, { label: 'Value (EUR)', name: 'value', type: 'number', min: '0', required: true, value: '12000' }), h(Field, { label: 'Stage', name: 'stage', options: STAGES.map(function (x) { return x[0]; }) })));
    if (m && m.kind === 'compose') modalEl = h(FormModal, { icon: 'edit', tint: 'sky', title: 'New message', text: 'Demo mailbox: messages go to Sent, nothing is delivered.', submit: 'Send', submitIcon: 'send', onClose: close, onSubmit: function (fd) { patch('mail', function (a) { return [{ id: Date.now(), folder: 'Sent', from: 'Mara Ellis', email: 'mara@halo.app', to: fd.to, subject: fd.subject || '(no subject)', body: (fd.body || '').split('\n'), date: 'Now', unread: false, starred: false, label: null, att: null }].concat(a); }); close(); say('Sent to ' + fd.to + ' (demo only)', null, 'mint', 'send'); } },
      h(Field, { label: 'To', name: 'to', type: 'email', required: true, placeholder: 'name@company.com', value: m.to }), h(Field, { label: 'Subject', name: 'subject', placeholder: 'What is it about?' }),
      h('label', { className: 'ha-field' }, h('span', { className: 'ha-field-label' }, 'Message'), h('textarea', { className: 'ha-input', name: 'body', id: 'f-body', rows: 6, placeholder: 'Write your message…' })));

    var nav = AREAS.map(function (a) { return { label: a.label, icon: a.icon, count: a.label === 'Mail' ? mailUnread || null : a.label === 'Agents' ? review || null : a.label === 'Finance' ? (counts.expenses + counts.bank) || null : a.label === 'Shop' ? counts.orders : null }; });
    var hasDock = pg === 'overview' || pg === 'board' || pg === 'agents';
    if (fsv[0]) return h(React.Fragment, null, h(FullScreen, { key: fsv[0], kind: fsv[0], go: openFs, onExit: exitFs }), h(H.Toaster));
    return h(React.Fragment, null,
      h('div', { className: 'demo-banner' }, h(H.Badge, { tone: 'info' }, 'Demo'), 'Everything here is generated example data. Your changes are saved in this browser; reset them under Account.'),
      h('div', { className: 'ha-shell demo-shell' },
        h(H.TopBar, { brand: 'Halo', tag: 'Admin', active: area.label, items: nav, onNavigate: function (label) { var a = AREAS.filter(function (x) { return x.label === label; })[0]; go(a.label === 'Mail' ? 'mail-inbox' : a.pages[0][2]); }, user: { name: 'Mara Ellis', email: 'mara@halo.app' }, userOpen: menu[0], onUser: function () { menu[1](!menu[0]); notesOpen[1](false); },
          extra: [h('button', { key: 's', type: 'button', className: 'ha-topbtn demo-searchbtn', onClick: function () { pal[1](true); }, 'aria-label': 'Search (Command K)' }, h(H.Icon, { name: 'search', size: 15 }), h('span', { className: 'demo-searchbtn-label' }, 'Search'), h('kbd', null, '⌘K')),
            h('button', { key: 'n', type: 'button', className: 'ha-topbtn icon demo-bell', 'aria-label': 'Notifications' + (unreadNotes ? ', ' + unreadNotes + ' unread' : ''), 'aria-expanded': notesOpen[0] ? 'true' : 'false', onClick: function () { notesOpen[1](!notesOpen[0]); menu[1](false); } }, h(H.Icon, { name: 'bell', size: 17 }), unreadNotes ? h('span', { className: 'ha-nav-count' }, unreadNotes) : null)] }),
        notesOpen[0] && h(NotePanel, { notes: D.notes, readAll: function () { patch('notes', function (a) { return a.map(function (n) { return Object.assign({}, n, { unread: false }); }); }); }, open: function (n) { patch('notes', function (a) { return a.map(function (x) { return x.id === n.id ? Object.assign({}, x, { unread: false }) : x; }); }); go(n.page); } }),
        menu[0] && h('div', { className: 'demo-usermenu' },
          h('div', { className: 'demo-usermenu-head' }, h(H.Avatar, { name: 'Mara Ellis', size: 40 }), h('div', null, h('b', null, 'Mara Ellis'), h('div', { className: 'ha-card-desc' }, 'Owner · Halo workspace'))),
          h(H.Menu, { items: [{ label: 'Profile & theme', icon: 'user', onClick: function () { go('account'); } }, { label: 'Finance', icon: 'card', onClick: function () { go('finance'); } }, { label: prefs[0].theme === 'Dark' || (prefs[0].theme === 'System' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'Switch to light' : 'Switch to dark', icon: 'moon', onClick: function () { var dark = prefs[0].theme === 'Dark' || (prefs[0].theme === 'System' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches); prefs[1](Object.assign({}, prefs[0], { theme: dark ? 'Light' : 'Dark' })); menu[1](false); } }, { label: 'Keyboard shortcuts', icon: 'help', shortcut: '?', onClick: function () { menu[1](false); say('Shortcuts: G then I for inbox, C to compose (demo)'); } }, '-', { label: 'Sign out', icon: 'logout', danger: true, onClick: function () { menu[1](false); openFs('signin'); } }] })),
        h('div', { className: 'demo-sheet' + (side ? ' has-side' : '') },
          h(SubNav, { area: area, page: pg, counts: counts, onPick: go, onAction: action }),
          h('main', { key: pg + ver[0], className: 'ha-main demo-main' + (hasDock ? ' ha-main-dock' : '') }, content),
          side)),
      hasDock && h('div', { className: 'ha-dock-float' }, h(H.Dock, { items: [{ label: 'New project', icon: 'grid', tint: 'mint', onClick: function () { modal[1]({ kind: 'new' }); } }, { label: 'New agent', icon: 'bot', tint: 'lilac', onClick: function () { modal[1]({ kind: 'agent' }); } }, { label: 'Compose mail', icon: 'edit', tint: 'sky', onClick: function () { modal[1]({ kind: 'compose' }); } }, { label: 'New invoice', icon: 'card', tint: 'butter', onClick: function () { go('invoice-new'); } }, { label: 'Redeploy', icon: 'refresh', onClick: function () { action('redeploy'); } }] })),
      h('input', { ref: fileInput, type: 'file', multiple: true, hidden: true, id: 'global-upload', onChange: function (e) { addFiles(e.target.files, 'Receipts'); e.target.value = ''; } }),
      drawer[0] && h(CompanyDrawer, { company: D.companies.filter(function (c) { return c.name === drawer[0]; })[0], invoices: D.invoices, contacts: D.contacts, mail: D.mail, deals: D.deals, onClose: function () { drawer[1](null); }, compose: function (to) { modal[1]({ kind: 'compose', to: to }); }, goMail: function () { drawer[1](null); go('mail-inbox'); }, toast: function (x) { say(x); } }),
      pal[0] && h(Palette, { items: palItems, onClose: function () { pal[1](false); } }),
      wizard[0] && h(Wizard, { start: wizard[0].start, setup: D.setup, done: function (k) { patch('setup', function (st) { var n = Object.assign({}, st); n[k] = true; return n; }); }, onClose: function (finished) { wizard[1](null); if (finished) say('Setup complete. Welcome to Halo', null, 'mint', 'sparkle'); } }),
      modalEl,
      h(H.Toaster));
  }

  function DomainModal(p) {
    var name = useState(''), res = useState(null), busy = useState(false);
    function check(e) { e.preventDefault(); var n = name[0].trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, ''); if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(n)) { res[1]({ n: n, err: 'Enter a domain like example.com' }); return; } busy[1](true); res[1](null); setTimeout(function () { busy[1](false); res[1]({ n: n, ok: p.taken.indexOf(n) < 0 && availability(n) }); }, 700); }
    return h(Overlay, { onClose: p.onClose }, h(H.Modal, { icon: 'globe', tint: 'mint', title: 'Add a domain', text: 'Check if it is free, then add it to the workspace. Prices are examples.', onClose: p.onClose },
      h('form', { className: 'demo-form', onSubmit: check }, h('div', { className: 'demo-reply', style: { marginTop: 0 } }, h('input', { id: 'f-domain', placeholder: 'yourname.com', 'aria-label': 'Domain name', value: name[0], onChange: function (e) { name[1](e.target.value); res[1](null); } }), h(H.Button, { type: 'submit', icon: 'search', disabled: busy[0] }, busy[0] ? 'Checking…' : 'Check'))),
      res[0] && (res[0].err ? h('p', { className: 'ha-field-error' }, res[0].err) : h('div', { className: 'demo-domain-result ha-in ' + (res[0].ok ? 'ok' : 'no') }, h(H.TintIcon, { icon: res[0].ok ? 'check' : 'x', tint: res[0].ok ? 'mint' : 'blush' }), h('div', { style: { flex: 1, minWidth: 0 } }, h('b', { className: 'demo-mono' }, res[0].n), h('div', { className: 'ha-card-desc' }, res[0].ok ? 'Available · €14/year (example price)' : 'Already registered. Try another ending.')), res[0].ok && h(H.Button, { icon: 'plus', onClick: function () { p.add(res[0].n); } }, 'Add')))));
  }

  ReactDOM.createRoot(document.getElementById('app')).render(h(App));
})();
