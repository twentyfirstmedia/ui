Halo is a soft, friendly admin-dashboard system with motion built in: a dark app frame around a warm off-white workspace, big rounded white cards, five pastel tints that carry meaning, and solid ink as the only accent. Build every dashboard screen from these tokens and the `Halo` components; never introduce a new hue, radius or shadow.

## Content fundamentals

- Write in sentence case everywhere: "New project", "Needs review", never Title Case or ALL CAPS (the `caption` style is the one uppercase exception, for eyebrows and table headers).
- Address the user as "you", plainly and briefly. Page subtitles say what the page is for in one line: "Everything that needs a decision today".
- Buttons are verbs, two words max: "Approve", "New invoice", "Reply".
- Numbers are the hero: stat values in `number-xl`, money with currency and thousands separators ("$48,210"), dates as "Tue, 14.04", times 24h ("17:00").
- No emoji in UI copy or headings; let tints and icons carry tone.

## Visual foundations

**Layout.** The app is a `frame` shell (radius `radius-xl`) holding the TopBar and a `canvas` sheet. The sheet is a three-column grid: SideRail (44px) · main column · a 300px side Panel, with `space-6` gaps and padding. The Dock floats bottom-center over the main column. Card grids are three across, stat tiles four across, gaps `space-4`.

**Color.** Neutrals do the work: `canvas` behind, `surface` for cards and panels, `surface-sunken` for tracks, search and soft buttons. `ink` for all text on surfaces and on every tint; `ink-muted` for descriptions and meta. The accent is `accent` (ink, inverted in dark), used for primary buttons, the selected chip and confirm discs. The five tints each have a job and an `-ink` partner for icons and dots:

| Tint | Meaning | Use for | Badge tone |
| --- | --- | --- | --- |
| `mint` / `mint-ink` | done, live, healthy | Live, Active, Paid, Running, Succeeded, Valid | `success` |
| `sky` / `sky-ink` | in progress, waiting on someone else | Pending, Building, Renewing, Invited, Due | `info` |
| `butter` / `butter-ink` | money, attention soon | revenue tiles, Expiring, Away, Watch | `warning` |
| `blush` / `blush-ink` | failed, overdue, destructive | Error, Failed, Overdue, Suspended | `danger` |
| `lilac` / `lilac-ink` | needs your review | Review, Needs review; the ONE featured card per grid | `highlight` |
| none (`surface-sunken`) | inactive | Draft, Paused, Archived, Canceled | `neutral` |

One status word always maps to the same tone on every page. Badges are 24px tall, 8px side inset, a 6px dot in the tint's `-ink`, label in `ink`. Counts are a different thing from status: a count of work waiting is always a `signal` pill (20px, 11px bold; 16px with 10px in a corner dot), in the TopBar, SubNav and on icons alike; a plain total (kanban column) is a neutral `surface` pill of the same size. On the always-dark `frame` use the `on-frame-*` colors, never a theme tint.

Text on a tint is always `ink`, never the tint's `-ink` (that is for icons and dots only). Never place two cards of the same tint side by side, and never tint more than one card in a grid.

**Type.** Plus Jakarta Sans (`font-sans`, Google Fonts) for everything, IBM Plex Mono (`font-mono`) only for logs, DNS records, IDs and code. One fixed scale, nothing in between: 40 · 32 · 28 · 20 · 16 · 14 · 13 · 12 · 11 · 10. `h1` page titles, `h2` panel titles, `h3` card titles (wrap, don't truncate), `body` for inputs and short copy, `body-long` (14/22) for reading text like mails and chat, `body-sm` in `ink-muted` for descriptions, `label` (13, 600) for anything clickable, `small` (12) for meta and timestamps, `caption` (11, uppercase, +0.06em) for eyebrows and table heads, `micro` (10) only for counts in dots. Weights: 500 text, 600 labels, 700 headings and numbers; nothing else. Line heights come from the scale (11/14, 12/16, 13/18, 14/20, 16/22, 20/26, 28/34, 32/36, 40/44). Tight negative tracking on headings and numbers is part of the look.

**Shape.** Everything clickable is a pill (`radius-pill`): buttons, chips, tabs, inputs, search, badges, the dock. Containers step up in radius with size: `radius-sm` small tiles, `radius-md` stat tiles and event cards, `radius-lg` cards and panels, `radius-xl` the sheet and frame. Round icon buttons (40px, 32px small, 36px in the TopBar) are the default secondary control.

**Depth.** Cards rest on `shadow-card`, lift to `shadow-lift` on hover with a 2px rise; only the Dock and Toast use `shadow-float`. Borders are rare: `line` for table rules, `line-strong` for inputs and the dashed placeholder tile.

**Motion.** Halo moves like it is settling into place: things rise a little, fade in and land softly, one after another, top to bottom. Every animation uses the `duration` and `easing` tokens, and all of it switches off under `prefers-reduced-motion`.

| Moment | What happens | Tokens |
| --- | --- | --- |
| Page load | TopBar drops in, the sheet fades, rail buttons pop in from the top | `dur-enter`, `ease-out`, `ease-spring` |
| Content groups | Wrap grids and lists in `Stagger`: each child rises 14px and fades in, `stagger-step` apart; later groups start later via `delay` | `dur-enter`, `stagger-step` |
| Side panel | Slides in from the right after the main column starts | `dur-enter`, `ease-out` |
| Dock | Springs up from below, then each button pops in | `ease-spring` |
| Numbers | StatTile values, ring and donut centres count up from zero, keeping currency and separators | `dur-slow`, `ease-out` |
| Charts | Bars grow from the baseline in sequence, lines draw left to right, areas fade in after, rings and donut segments sweep | `dur-slow` |
| Progress | Bars fill from the left | `dur-slow` |
| Tabs, switches | Indicator and knob slide between positions | `dur-base`, `ease-in-out` |
| Overlays | Modal, Menu and Toast pop in with a small overshoot; the modal backdrop fades and blurs | `dur-base`, `ease-spring` |
| Hover and press | Cards lift 2px on hover and press back to .99; buttons press to .97 | `dur-fast`, `dur-base` |
| Loading | Skeletons shimmer, then real content arrives with the normal staggered entrance | |

Order a page so the eye travels top-left to bottom-right: header first (`ha-in`), then stats (`Stagger delay={80}`), filters, the grid (`delay` 300+), the side panel last. Entrances total under a second. Nothing loops except the shimmer and a `live` badge's pulse. Use `Halo.mountPage(App)` in demos to get a "Replay motion" button.

**States.** Focus is a solid 2px `focus` ring with a 2px offset on every interactive element. Disabled is 45% opacity. Selected chips and the current rail button invert to `accent` / `on-accent`; the current TopBar item gains a translucent pill and shows its label.

**Dark theme.** Same structure; surfaces go near-black, tints deepen and their `-ink` partners lighten. Ink stays the text color on tints in both themes.

## Spacing

Everything sits on a 4px grid; 2px and 6px appear only inside badges, kbd keys and tags.

- **Layout rhythm:** 24 between page sections, 16 between cards in a grid, 12 between stacked lines inside a card, 8 between inline items, 4 for tight pairs (label + value).
- **Insets:** panel 24, card 20, compact tile 16. Lists and tables use `ha-panel ha-panel-flush` (8px); rows and cells bring their own 16px, so their content still lines up at 24 with every other panel. Add `ha-panel-list` for 4px between rows.
- **Controls:** 40px tall (32px small, 36px in the TopBar), 16–20px horizontal padding, 8px icon-to-label gap.
- **Form controls:** inputs, selects, search and buttons share one height scale (40 / 32 sm) and a 16px text inset; entered text is 14px, button labels 13px. Inputs: 1px border, darker on hover, 2px ink on focus, focus ring on keyboard focus, 45% opacity when disabled. Textareas switch to `radius-md` with a 12px top inset.
- **Layout widths:** SubNav 208px, side panel 304px.
- **Concentric radii:** a nested shape uses outer radius minus the padding between them, so corners stay parallel.
- Never pass ad-hoc padding to a Panel; pick one of the insets above.

## Text and locale

The kit ships no fixed copy. Every visible string, aria-label and placeholder goes through `Halo.L()`; numbers, money and dates go through `Intl`.

- `Halo.setLabels(map, replace?)` maps the built-in English text to yours (`{ "Copy": "Kopieren", "Remove {name}": "{name} entfernen" }`). `components/labels.json` lists every key.
- `Halo.setLocale(tag, { currency, weekStart })` drives `formatMoney`, `formatNumber`, `formatDate`, calendar names and MoneyInput parsing. Without a tag the browser's locale is used.
- Main texts are also props (`title`, `label`, `placeholder`, `approveLabel` …); props win over labels.
- The English built-ins exist so previews read. Example content is English.

## Status

State is shape plus colour, so it reads without colour vision: ok = dot (`ok`), running = pulsing dot (`info`), signal = diamond (`signal`, waits for a human), warn = triangle (`warn`), danger = square (`danger`), idle = ring (`idle`). Use `StatusIndicator` with a word; badges use the same shapes and also accept these names as `tone`. Only `signal` may draw attention unasked; warnings and errors never animate.

## Approvals

Everything an agent may not do alone goes through `ApprovalCard` with four answers in this order: **A** yes, as shown · **B** yes, with a change · **C** no, discard · **D** different instruction. The card shows the risk family (money, infra, comms, marketing, apps, legal), agent and project, the age and the escalation time, and the exact payload that will run. A–D work as keys. Once decided it collapses to one line with letter, person and time. `ApprovalInbox` lists open approvals oldest first; J/K move. Money, legal and infrastructure need a fresh passkey step in the app before A is sent.

## Agents and operations

Agent pages: `AgentCard`, `AgentDetails`, `ChatWorkspace` + `ChatList`, `SearchHits`, `ThinkingLine`, `FeedbackRating`, `ActivityFeed`, `DailyBriefing`, `BudgetStop`, `MemoryViewer`, `OverrideDiff`, `TriggerList`, `ScheduleCalendar`, `OrgChart`, `VoiceMode`. Operations: `ConnectionCard`, `ConnectionBanner`, `ServerCard`, `Meter`, `UptimeBar`, `DeployPipeline`, `LogView`, `CodeViewer`, `DnsRecordTable`, `DomainList`, `MailAuthStatus`, `SecretField`. Money: `LedgerTable`, `PnLStatement`, `ReceiptSuggestion`, `MoneyInput`, `StatCell`. Mail: `AccountSwitcher`, `InboxList`, `MailThread`, `SignatureEditor`, `AttachmentPreview`. Platform: `ConfigPRSummary`, `ModuleRegistry`, `SettingsLayout`, `ShortcutsOverlay`, `MobileTabBar`, `PushNotification`. Building blocks: `Kbd`, `KeyValue`, `Spinner`, `Collapsible`, `ContextMenu`, `SplitPane`, `TreeView`, `InlineEdit`.

Document previews (invoices, PDFs, mail bodies) sit on `paper` and stay white in dark mode.

## Semantic token layer

Besides the palette, `tokens.css` defines semantic names: `bg-000…300`, `fg-100…400`, `line-100…300`, the status pairs `ok/info/warn/danger/signal` (+ `-bg`) and `idle`, `diff-add/del` (+ `-bg`), `chart-1/2/grid`, `paper`/`paper-ink`, control and row heights and z-index steps. Apps written against these names render in Halo unchanged. The count pill on nav items uses `count`/`on-count`. A few tokens are fixed in both themes on purpose: overlays on the dark frame (`frame-hover/active/strong`), text on photos (`media-scrim`, `media-ink`), the image viewer (`lightbox`), document text on `paper` and the neutral search-ad preview (`serp-*`). Components use no colour literals at all.

## Admin and real estate

Admin pages (FollowerPilot and similar shops): `LiveFeed`, `BarList`, `MapView` (built-in dotted world or your own map underneath), `BalanceCard`, `ServiceMonitor`, `RunHistory`, `WebhookEndpoint`, `BackupList`, `BlockList`, `ReviewCard`, `CouponCard`, `RichTextEditor`, `EmailPreview`, `SearchAdPreview`, `LocaleField`, `LocaleSwitcher`, `WorkspaceSwitcher`, `ExportDialog`, `TwoFactorSetup`, `ImageVariants`, `ColorField`.

Real-estate apps (Capitaso): `ListingCard` (card or row), `ResultsToolbar`, `RangeSlider`, `StatusSelect`, `SavedSearch`, `ValuationCard`, `EnergyClass`, `MapView` with price pins, `Gallery`, `BeforeAfter` and `TilePicker` for virtual staging, plus `ChatLauncher`, `CookieConsent` and `AnnouncementBar` for the public site.

- Personal data (emails, IPs) starts unchecked in exports and is masked in lists unless the page is about it.
- Restores, unblocks and deletes are confirmed with ConfirmDialog by the app; the components only ask.

## Forms, feedback and data

- **Forms:** `TextField` (label, required/optional, hint, error, success, icon, suffix) for every text input; `RadioGroup` and `Segmented` for one-of-few; `Combobox` (search, multi, create) and `TagInput` for long lists and free tags; `DatePicker` (single or range with presets); `NumberInput`, `Slider`, `OtpInput`; `FileDrop` for uploads. Validate on blur, then live while fixing.
- **Feedback:** inline `Alert` for a state the page is in; `Halo.toast()` + one `<Toaster/>` for something that just happened, with Undo for reversible deletes; `ConfirmDialog` only when undo is impossible (type-to-confirm for whole things). `Tooltip` names icon buttons; `Popover` holds small interactive panels.
- **Data:** `DataTable` (sort, select + bulk bar, column toggles, sticky head, expandable rows) under a `FilterBar` (search, removable filter chips, Clear all).
- **Charts:** `StackedBarChart` and `AreaChart` (hover tooltips, legend), `Heatmap` (one hue, five steps), `Funnel` (share + step conversion), `Gauge` (value vs max, thresholds).

## AI chat and agents

- **Conversation:** `ChatMessage` (user pill right, agent rich text left, sources, attachments, copy / regenerate / feedback), `RichText` + `CodeBlock` for Markdown and code, `TypingDots`, `AgentMark`.
- **Transparency:** `Reasoning` (the plan, collapsed) and `ToolCall` (one line per tool, input and output on demand) go above the answer; `RunTrace` shows a whole run as a waterfall with tokens and cost.
- **Control:** `ApprovalCard` shows the exact payload and waits; after a decision post a system message. `AgentStatus` (Running, Thinking, Waiting for approval, Idle, Paused, Error), `UsageMeter` for context and budget.
- **Input:** `Composer` (auto-grow, Enter to send, / commands, attachments, `ModelPicker`, Stop while busy) and `PromptStarters` on empty chats.
- Agents always get a tint and the bot mark; people get Avatars. Never let an agent act on email, money, deletion or production without an approval unless its autonomy says so.

## Commerce

- **Catalog:** `ProductCard` built from `ProductArt` (or your image), `Price` (sale shows struck price and −%), `Rating`, `StockBadge` (in stock, low with count, out).
- **Product page:** `VariantPicker` for colour swatches and size pills; sold-out options stay visible and disabled.
- **Cart and checkout:** `CartLine`, `OrderSummary` (discount code, free-shipping progress, VAT line), `CheckoutSteps` (Cart, Details, Shipping, Payment). Removing a line is instant with Undo.
- **Back office:** `OrderTimeline` (Placed → Paid → Packed → Shipped → Delivered) and DataTable with bulk actions for products and orders; `PlanCard` for pricing pages.
- Order status tones: Placed neutral, Paid and Packed info, Shipped highlight, Delivered success, Refunded and Cancelled danger.

## System screens

`StatusScreen` for 404, 403, 500, maintenance and offline; `AuthCard` for sign-in, password reset and two-step codes; `EmptyState` in every list. Each says what happened, that data is safe, and the next step.

## Navigation model

The TopBar and the SubNav have different jobs and never repeat each other.

- **TopBar = areas.** Workspace, Customers, Agents, Mail, Code, Domains, Finance, Files, Account. It also holds the Search button (⌘K) and the notification bell, then the profile menu.
- **SubNav = pages of the current area**, plus the one create action that area is about (New invoice, Compose, New agent, Upload). Counts on pages mark work waiting there, never totals.
- **CommandPalette** reaches every page, every create action and every record from anywhere. Anything you can create must also be in the palette.
- Records open in a **Drawer** when people want to glance and go back to the list (a customer, a run). They get a full page when people work in them for long (an invoice being written).

## Overlays and focus

Modal, Drawer, CommandPalette and Wizard trap keyboard focus while open (`useTrap`), close on Esc and on a backdrop click, and return focus to whatever opened them. Only one is open at a time. The NotificationList and the profile Menu are popovers: they close on outside click and Esc and do not trap focus.

## Workspace patterns

- **Agents** always show who did what. Agent avatars are tinted bot marks and never photos. Agent output that leaves the company (mail, payments, publishing) passes an approval step in its Flow first.
- **Finance** shows net amounts in tables and gross amounts only on invoices and bank rows. VAT is broken out per rate. Dates use DD.MM.YYYY. A partial month is marked with an asterisk and "month to date".
- **Roles** use the PermissionMatrix. Agents get their own service role, and every permission change is written to the audit log.

## Composition rules

- A dashboard page is: PageHeader (title, subtitle, SearchField) → four StatTiles → a Chip filter row with the primary Button on the right → a three-column Card grid. The right Panel holds block Tabs and a stack of EventCards.
- Card footers: a Badge left, actions right in the order `more` · `x` · `check` (solid). A request card swaps the trio for one `soft` "Reply" button.
- Card corners hold one TintIcon showing the item's kind, or a `play` IconButton for previewable content.
- Use a `placeholder` StatTile for the one count that needs action (drafts, reviews).
- Tables live inside a `surface` Panel, numbers right-aligned in tabular figures, status as Badges; Pagination sits under them.
- Build every app page inside `AppShell` (TopBar, SideRail, main column, optional `side` Panel, optional Dock). Pass `dock: false` on focused pages (Analytics, Inbox, Calendar, Settings).
- Charts: ink by default, one tinted highlight (the peak, today, the primary series). LineChart takes two series max; Donut five segments max. Put each chart in its own Panel with a title and one-line subtitle that says what to notice.
- Overlays: one Modal at a time over a blurred backdrop; Menus open from a `more` button; one Toast at a time, bottom-right or above the Dock.

## Screens

The Pages group shows complete screens built only from Halo parts. Start new screens from the closest one:

| Screen | Use it for |
| --- | --- |
| Dashboard | A home or overview page: stats, filters, card grid, schedule panel, dock |
| AnalyticsScreen | Reporting: KPI cards with sparklines, line, bar and donut charts, a ranked table |
| PeopleScreen | Any directory or admin list with roles, statuses and pagination |
| InboxScreen | Messaging, support or notifications: list, thread, details |
| BillingScreen | Money: tiles, card on file, invoices, plan and usage |
| CalendarScreen | Scheduling: week grid of tinted events and a mini month |
| BoardScreen | Kanban workflows |
| ProjectScreen | Any detail page: breadcrumb, progress, tasks, files, activity |
| SettingsScreen | Settings and preferences with a section list |
| SignInScreen | Auth and onboarding |
| LoadingScreen | Skeleton states and the hand-off to content |
| InviteModalScreen | A dialog over a page, plus a toast |
| MobileScreens | Phone layouts: stacked tiles, single-column cards, dock as tab bar |
| CustomersScreen | CRM lists with a record Drawer; shows the TopBar + SubNav navigation model |
| WorkflowScreen | Agent workflows: Flow builder with a test run that waits at the approval |
| InvoiceScreen | Writing a document with a live preview; bank matching |
| FilesScreen | File grids by folder, with the CommandPalette open |
| SetupScreen | First-run setup Wizard over the app |

## Iconography

Halo ships its own line icon set in the `Icon` component: 24px grid, 2px round-capped strokes, `currentColor`. Use 16px by default, 14px inside chips, badges and event bars, 20px in nav. Icons alone always get an accessible `label` (IconButton requires one). Don't mix in another icon family; if a glyph is missing, add it to the set in the same style. Tinted marks use `TintIcon` with a tint from the table above.

## Logo

Halo has no logo mark yet: the brand is set in `font-sans` at 700 weight with a small `mint` dot, as in the TopBar.
