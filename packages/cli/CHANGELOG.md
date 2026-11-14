# @twentyfirstmedia/ui

## 0.7.0

### Minor Changes

- [#47](https://github.com/twentyfirstmedia/ui/pull/47) [`23598f6`](https://github.com/twentyfirstmedia/ui/commit/23598f6121300b627e1f5ee1509897fed4440bd9) Thanks [@robintrepte](https://github.com/robintrepte)! - Glass for the Life components, and fluid action rows.
  
  - `VitalTile`, `JournalEntry`, `GoalCard`, `InsightCard`, `ConsentList`, `NetWorthCard` and `PolicyCard` take `surface` and turn to glass inside `<UIProvider surface="glass">`, like panels and cards. Nested in a panel they stay clear (no glass on glass).
  - On glass an `InsightCard` takes a faint wash of its tone (info, success, warning, highlight).
  - A sidebar on the AppShell frame is no longer a second pane of glass on the glass shell.
  - The Health, Habits & journal and Life overview patterns are glass over `Ambient`.
  - Action rows (dialog, card and approval footers, review, cookie, push, insight and journal actions, and a `.tf-row` of buttons placed directly in a panel, card, dialog, popover or form) measure themselves: when narrow, their buttons wrap and share the full width; when very narrow, each button takes a line.

- [#45](https://github.com/twentyfirstmedia/ui/pull/45) [`6afd7a8`](https://github.com/twentyfirstmedia/ui/commit/6afd7a81ebd4a235351bd348da4bb0ef3085f04c) Thanks [@robintrepte](https://github.com/robintrepte)! - Life components for money, insurance, deadlines and documents.
  
  - `BudgetList`: spending per category against its limit, what is left or over in words.
  - `SubscriptionList`: recurring payments with the next charge, trials and cancelled ones, totals per month and year.
  - `NetWorthCard`: assets minus liabilities with the change over a period.
  - `DeadlineList`: dates sorted and counted from `today` (overdue, today, soon, later), "mark done".
  - `PolicyCard`: an insurance policy with insurer, sum insured, premium, deductible, renewal, a maskable policy number and its status.
  - `CoverageMatrix`: which risks are covered, partly or not, as a captioned table.
  - `ClaimTimeline`: a claim's steps with the current one marked.
  - `DocumentList`: documents with their expiry (expired, expiring, valid).
  - Patterns Money, Insurance and Life overview in the docs group "Life".

- [#44](https://github.com/twentyfirstmedia/ui/pull/44) [`2d58fd0`](https://github.com/twentyfirstmedia/ui/commit/2d58fd064f90321a43823885523e585aec80937a) Thanks [@robintrepte](https://github.com/robintrepte)! - Life components for wellbeing and health, and for AI-first apps.
  
  - `HabitTracker`: habits with their last days (done, missed, no entry), streaks, today as a toggle.
  - `MoodPicker`: a five-step scale with faces and words (radio group), `compact`.
  - `VitalTile`: a health value with its healthy range as a band, the status in words, a trend.
  - `ActivityRings`: concentric goal rings with a legend.
  - `SleepChart`: a night as stages over time with totals per stage.
  - `MedicationList`: today's doses with status and "mark as taken".
  - `JournalEntry` and `GoalCard` (number, money or percent; due date, milestones).
  - `InsightCard`: what the assistant noticed, its sources, "Why am I seeing this?", accept/snooze/dismiss.
  - `ConsentList`: per connected source what the assistant may read and do, switchable, revocable.
  - New docs group "Life" with the patterns Health, Habits & journal and Data access.

## 0.6.0

### Minor Changes

- [#42](https://github.com/twentyfirstmedia/ui/pull/42) [`caae958`](https://github.com/twentyfirstmedia/ui/commit/caae958f805737b53dfd465140be42877e3349db) Thanks [@robintrepte](https://github.com/robintrepte)! - Forms, media, maps and fonts.
  
  - `TextField`: `type="password"` gets a show/hide button (`reveal={false}` turns it off), an interactive `action` slot that stays next to error marks, `onKeyDown`.
  - `Checkbox`: a 24px hit area around the same box (WCAG 2.2 target size).
  - `SearchField`: forwards `id`, `name`, `defaultValue`, `onKeyDown`, `onFocus`, `onBlur`, `autoFocus` and `inputProps` (combobox ARIA); `bindShortcut` focuses it with ⌘/Ctrl + the hint's key; the hint is hidden on touch screens.
  - `FileDrop`: `disabled`, `name` (the listed files take part in a form), `onFiles` can return `false` or the files to list.
  - `OtpInput`: empties its cells when `error` turns on (`clearOnError`), `ref.current.reset()`.
  - New `QrCode` (encoded on the device, no service); `TwoFactorSetup` draws it from `qrValue` and offers `trustDevice`.
  - `TilePicker layout="list"`.
  - `CookieConsent`: `equalChoice`, `id`, `aria-describedby` on its text, category texts may hold links.
  - `Gallery`: controlled `index`/`onIndexChange`, `label`, arrow keys on the stage and the thumbnails, focus moves into the lightbox and back.
  - `BeforeAfter`: the page scrolls vertically over it on touch screens, drags end on pointer cancel.
  - `CountUp`: renders its final value on the server and counts up on the client; `animate={false}`.
  - `PlanCard`: `price` takes any node, `pricePrefix`, `priceNote`, `href`/`linkAs` for the action, a "Current plan" badge.
  - `FloatingLayout`: `controls` and `attribution` in the free corner, `startWidth`/`endWidth`, `--floating-safe-*` variables with the space its slots take, the `end` slot as a bottom sheet below 720px (`endSheet`).
  - Tokens `ramp-1`…`ramp-5` in both kits: a calm sequential ramp for maps and heatmaps.
  - Static WOFF fonts under `fonts/og/` for share images (`next/og`) and PDF tools.

- [#42](https://github.com/twentyfirstmedia/ui/pull/42) [`caae958`](https://github.com/twentyfirstmedia/ui/commit/caae958f805737b53dfd465140be42877e3349db) Thanks [@robintrepte](https://github.com/robintrepte)! - Fluid layouts and root props.
  
  - Every component now puts `className` and `style` on its root element (about 160 ignored one or both); a test renders every reference preview and checks it.
  - Nothing pushes past its container: segmented controls, tabs and toggle groups shrink with ellipsis labels (`ToggleGroup block` is new); `MobileTabBar` shares its width evenly; the `TopBar` nav switches to icons as soon as its labels no longer fit, the account button cuts name and address with an ellipsis (the full text in `title`) and the search field shrinks; `CheckoutSteps` stay on one row and show numbers only when narrow (`compact` forces it); an `Alert`'s actions move under the text when narrow; chat source chips grow to two lines and take a `detail` tooltip; `RangeSlider` fields fit narrow columns.
  - `TopBar` and `AppShell` take a node as `brand` (a logo mark with the name).
  - `SideRail`: `expanded`/`defaultExpanded`/`onExpandedChange` show names next to the icons, `toggle` adds the button, every button has a real tooltip while collapsed.
  - `Breadcrumb` (and `PageHeader crumbs`): items with `href` (with `linkAs`) or `onClick`, `onNavigate`, `label`; plain labels are no longer fake `#` links; 24px targets.
  - `Pagination`: link mode (`href` per page, `linkAs`), `label`, previous/next disabled at the ends.
  - `ListRow`: `href`/`linkAs`, `actions` outside the clickable area (no nested buttons), a non-interactive row without `onClick`/`href`, `titleLines`/`subtitleLines`.
  - `SelectMenu size="sm"`; `Table stack` shows rows as labelled cards when the table is narrow.

- [#41](https://github.com/twentyfirstmedia/ui/pull/41) [`ce11edd`](https://github.com/twentyfirstmedia/ui/commit/ce11eddd4524ce9998b1f03453a58f6b7a684131) Thanks [@robintrepte](https://github.com/robintrepte)! - Sidebar overhaul and an app shell with a sidebar.
  
  - `Sidebar`: `variant` (`floating`, `attached`, `shell`); links with `href`, `linkAs` and `external`; `badge` (`"dot"` or a word), `disabled`, item `actions` ("…" menu); collapsible groups with an `action`; tooltips and flyouts when collapsed; `storageKey` and `shortcut` (⌘B / Ctrl+B); an off-canvas drawer on phones (`mobileOpen`, `onMobileOpenChange`); `header`/`footer` as a function of `{ collapsed }`.
  - Fixed: more room between a group heading and a selected first item; counts no longer jump to the corner in narrow shells.
  - Filters: `as="aside"` makes the sidebar a complementary region; items with `checked` are checkbox options (radios in a group with `select: "single"`), a group's `content` holds any control, `collapsible` turns the icons-only mode off.
  - New `UserMenu`; `WorkspaceSwitcher` takes `compact`.
  - `AppShell navigation="sidebar"` with `sidebarGroups`, `workspaces`, `userMenu` and `sidebar`.

## 0.5.0

### Minor Changes

- [#39](https://github.com/twentyfirstmedia/ui/pull/39) [`90fd777`](https://github.com/twentyfirstmedia/ui/commit/90fd7770132dfb102b7bd4e7f7d3cb7f884e573c) Thanks [@robintrepte](https://github.com/robintrepte)! - The icon library grows to 690 icons.
  
  - Everything product apps on the kit use, among them `panelLeftClose`, `circleCheckBig`, `messageSquarePlus`, `replyAll`, `forward`, `lifeBuoy`, `gavel`, `octagonX`, `arrowDownUp` and `grid3x3`.
  - New categories Games (`swords`, `castle`, `pickaxe`, `dices`, `skull`, chess pieces …) and Maps and 3D (`draftingCompass`, `satellite`, `rotate3d`, `axis3d`, `lasso`, `spline` …); more AI icons (`brainCog`, `circuitBoard`, `scanText`, `textSearch`, `orbit`, `infinity` …).
  - More brand logos: AI (`brandOpenai`, `brandGooglegemini`, `brandMistralai`, `brandPerplexity`, `brandDeepseek`, `brandOllama`, `brandCursor`, `brandGithubcopilot`, `brandModelcontextprotocol` …), business and marketing (`brandLinkedin`, `brandMicrosoft`, `brandSlack`, `brandMeta`, `brandGoogleads`, `brandGoogleanalytics`, `brandTrustpilot`), shops, infrastructure and automation (`brandWoocommerce`, `brandShopify`, `brandWordpress`, `brandCloudflare`, `brandHetzner`, `brandSupabase`, `brandN8n`, `brandZapier` …) and payments and crypto (`brandRevolut`, `brandCoinbase`, `brandBinance`, `brandBitcoin`, `brandEthereum`).
  - LinkedIn, Microsoft, Windows, Slack, Skype, Amazon and OpenAI come from Font Awesome Free (CC BY 4.0); the attribution is in `ICONS-LICENSE`.

## 0.4.0

### Minor Changes

- [#37](https://github.com/twentyfirstmedia/ui/pull/37) [`c40834a`](https://github.com/twentyfirstmedia/ui/commit/c40834aa1da2300846808e8ce2f42d3a9e12bda6) Thanks [@robintrepte](https://github.com/robintrepte)! - An icon library: 567 more icons in the kit's style, from passkeys and security to social and brand logos, files, media, commerce, places, home and health.
  
  - `@twentyfirstmedia/halo/icons` (and `/pro/icons`, `@twentyfirstmedia/ui-core/icons`) exports each icon by name: `fingerprint`, `scanFace`, `keyRound`, `shieldCheck`, `brandX`, `brandInstagram`, `brandGithub` … Register what you use once with `registerIcons({ fingerprint, brandGithub })` (or `registerIcons(ICON_LIBRARY)`), then use the names in `Icon` and every `icon` prop. Only registered icons are bundled.
  - Line icons are drawn on the kit's 24px grid with 2px round strokes (from Lucide, ISC); brand logos are filled (from Simple Icons, CC0). Licence notices ship in `ICONS-LICENSE`.
  - Your own icons: `registerIcons({ acme: "M…" })`, typed through the `CustomIcons` interface. The 93 built-in icons work as before and cannot be replaced.
  - An unknown icon name now logs a warning once instead of silently drawing a placeholder.
  - `@twentyfirstmedia/elements` registers the whole library, so `<tf-button icon="fingerprint">` works in plain HTML; it also exports `registerIcons`.
  - New docs page "Icons": every icon with search, categories and copy on click. The MCP server's `list_icons`, `search_docs` and `check_usage` know the library.

## 0.3.1

### Patch Changes

- [#35](https://github.com/twentyfirstmedia/ui/pull/35) [`3a25cd6`](https://github.com/twentyfirstmedia/ui/commit/3a25cd6e9162a69465a5e7794b2f38c970f4ff08) Thanks [@robintrepte](https://github.com/robintrepte)! - `FloatingLayout` on a phone keeps the height it is given: the stacked slot grid counts its padding into the inherited height (`box-sizing: border-box`). Before, the layout grew by twice the padding, and with a fixed height the bottom slot was cut off at the edge. Apps that worked around it with `.tf-floating-ui { box-sizing: border-box; }` can drop that rule.

## 0.3.0

No changes in this release.

## 0.2.1

### Patch Changes

- [#26](https://github.com/twentyfirstmedia/ui/pull/26) [`863179b`](https://github.com/twentyfirstmedia/ui/commit/863179b194fcd8e43bac596039ef555cc294d03e) Thanks [@robintrepte](https://github.com/robintrepte)! - Published through npm Trusted Publishing: the release workflow no longer uses an npm token, and every package carries a provenance statement linking it to the GitHub Actions run that built it. No code changes.

## 0.2.0

### Minor Changes

- [#24](https://github.com/twentyfirstmedia/ui/pull/24) [`4529ab5`](https://github.com/twentyfirstmedia/ui/commit/4529ab565c0de3dadb52b248585f1d4bb0ae0b3c) Thanks [@robintrepte](https://github.com/robintrepte)! - Whole dashboards in glass, in both kits.
  
  - New `Ambient`: a calm, living background of soft colour fields from the kit (pastels in Halo, a faint aurora in Pro) that drift slowly, or a photo or video under a scrim, or your own layer. Still with motion off, paused off screen. New tokens `--ambient-base`, `--ambient-1…4`, `--ambient-scrim`.
  - In a glass region, `AppShell` turns into glass (top bar, rail, sidebar; the sheet clears), and `StatTile` and tinted cards lay their tint over the glass (`--glass-tint`).
  - On glass, the faintest text steps up one shade so secondary text stays readable.
  - `AppShell` applies `className`.
  - New pattern: a wellbeing dashboard in glass.

- [#22](https://github.com/twentyfirstmedia/ui/pull/22) [`beb3043`](https://github.com/twentyfirstmedia/ui/commit/beb30433be7abc8ed1adabf0bae2fc4de526e8f7) Thanks [@robintrepte](https://github.com/robintrepte)! - Glass surfaces for UI that floats over maps, 3D scenes, video or photos, in both kits: translucent, blurred and colour-lifted, soft and milky in Halo, dark with a hairline edge in Pro.
  
  - `surface="glass"` on `Panel`, `Card`, `Dock` and `MapView` (legend, controls, popup), and `<UIProvider surface="glass">` for everything floating in a subtree: top-level surfaces, loose controls, menus, popovers, dialogs and drawers. What sits on glass (inputs, tab tracks, badges, highlights) turns translucent too; `surface="solid"` opts one out. Without React: `class="tf-glass"` or `data-surface="glass"`.
  - New `FloatingLayout`: four slots (`top`, `start`, `end`, `bottom`) over a full-bleed `background`, glass by default; on phones the slots stack and the layout grows with them.
  - New glass tokens in both kits (`--glass`, `--glass-strong`, `--glass-control`, `--glass-well`, `--glass-hover`, `--glass-border`, `--glass-highlight`, `--glass-sheen`, `--shadow-glass`, `--glass-filter`), derived from the theme. Body text on glass keeps 4.5:1 over any backdrop; reduced transparency and forced colours switch to solid surfaces, more contrast to the stronger fill.
  - `MapView` takes `height="100%"` (any CSS length).
  - `Dock` now applies `className` and `style`.
  - A `UIProvider` subtree with its own `tokens` keeps the outer theme, so derived colours follow the tokens even without a `theme` prop.
  - New pattern: a city map with glass controls.

- [#22](https://github.com/twentyfirstmedia/ui/pull/22) [`beb3043`](https://github.com/twentyfirstmedia/ui/commit/beb30433be7abc8ed1adabf0bae2fc4de526e8f7) Thanks [@robintrepte](https://github.com/robintrepte)! - Motion with one switch, in both kits.
  
  - `<UIProvider motion="off" | "standard" | "expressive">` (or `data-motion`): `expressive` gives orchestrated page entrances (Halo: longer, more travel, a short focus-in blur; Pro: crisp and staggered), `off` stops everything, e.g. for a setting in your app. The reader's reduced-motion setting always turns motion off.
  - Choreography: charts, progress bars and `CountUp` wait for the card they sit in; a `Stagger` below the fold waits until it scrolls into view (`reveal={false}` plays at once).
  - Layers animate out as well as in: popovers, tooltips, hover cards, comboboxes, dialogs, drawers, the command palette and toasts. `Modal`, `Drawer` and `CommandPalette` take an optional `open` for that.
  - `startViewTransition(update)` for page transitions (the kits style `::view-transition`), `useMotion()` for the level in effect, `usePresence(open)` and `leaving()` for your own layers.
  - New motion tokens: `--dur-exit`, `--motion-time`, `--motion-travel`, `--motion-blur`.
  - Fixed: with `themes.css` or `scoped.css`, keyframes defined in another file of the kit never ran (spinners, skeleton shimmer, pulses, pop-ins).

### Patch Changes

- [#25](https://github.com/twentyfirstmedia/ui/pull/25) [`688f141`](https://github.com/twentyfirstmedia/ui/commit/688f141210ed82c5c10b375b38c9d06bbc7a7bf2) Thanks [@robintrepte](https://github.com/robintrepte)! - Glass app shell: it keeps the layout of the solid shell and turns its frame into glass, with the top bar and rail sitting on it as they sit on the solid frame (they no longer float as separate pieces). A `ToggleGroup` is only as wide as its items.

## 0.1.1

### Patch Changes

- [#20](https://github.com/twentyfirstmedia/ui/pull/20) [`7bbd5aa`](https://github.com/twentyfirstmedia/ui/commit/7bbd5aaa789e5764558a3875edd4e972c01b9116) Thanks [@robintrepte](https://github.com/robintrepte)! - The MCP server (`twentyfirst-ui mcp`) now stops quietly when the client closes the connection, instead of crashing with an unhandled `EPIPE` error. Releases are now published with npm provenance, so every package version links back to the GitHub workflow run that built it.

## 0.1.0

### Minor Changes

- [#15](https://github.com/twentyfirstmedia/ui/pull/15) [`2c5ddb6`](https://github.com/twentyfirstmedia/ui/commit/2c5ddb6715c7c296a3379ea241158218185e9262) Thanks [@robintrepte](https://github.com/robintrepte)! - The CLI ships an MCP server for coding agents: `twentyfirst-ui mcp` (stdio, offline, the docs are bundled) with the tools `search_docs`, `list_components`, `get_component`, `get_pattern`, `get_guide`, `get_tokens`, `list_icons` and `check_usage`, every page as a resource, and the prompts `build_screen` and `review_ui`. `twentyfirst-ui mcp init` registers it for Claude Code, Cursor and VS Code and adds the kit rules to `AGENTS.md`.

- [#8](https://github.com/twentyfirstmedia/ui/pull/8) [`2db7b83`](https://github.com/twentyfirstmedia/ui/commit/2db7b83266449602d1209c346b44ad62a66c416d) Thanks [@robintrepte](https://github.com/robintrepte)! - First release: every component of the Halo reference in `ui-core`, the Halo and Pro kits with the same components, props and markup (switchable at runtime via `data-kit`), tokens and a Tailwind v4 preset per kit, self-hosted fonts and the CLI (`init`, `add`, `list`, `diff`).

- [#16](https://github.com/twentyfirstmedia/ui/pull/16) [`350ca53`](https://github.com/twentyfirstmedia/ui/commit/350ca53ea6b1a4dd77759449ac4b56bb8ed2a62a) Thanks [@robintrepte](https://github.com/robintrepte)! - Open source under the MIT license and published on npmjs.com: install with `npm i @twentyfirstmedia/halo` (or `pro`), no registry setup or token. `twentyfirst-ui init` no longer writes an `.npmrc`.

- [#13](https://github.com/twentyfirstmedia/ui/pull/13) [`559cb2d`](https://github.com/twentyfirstmedia/ui/commit/559cb2df5ac851e71ad0f3808b1442f7f79a6401) Thanks [@robintrepte](https://github.com/robintrepte)! - English only: built-in text is plain English and overridable through props; numbers, money, percentages and dates format with Intl in en-US (`formatNumber`, `formatMoney`, `formatPercent`, `formatDate`).
  
  New components in both kits: Accordion, Separator, AspectRatio, Label, Toggle, ToggleGroup, ButtonGroup, ScrollArea, HoverCard, Carousel, Menubar, NavigationMenu, Sidebar, SelectMenu, Form and ResizablePanels. Menu gains keyboard navigation, typeahead, submenus, checkbox/radio and disabled items; Tabs render panels; Drawer takes `side`; Popover flips when there is no room; CommandPalette takes `loading`, `empty` and `onQueryChange`; Button and IconButton take `asChild`; inputs take `id`, `name` and `required`.

- [#18](https://github.com/twentyfirstmedia/ui/pull/18) [`0f19447`](https://github.com/twentyfirstmedia/ui/commit/0f19447291603a148759d10b7a2bf13ea7e95cb6) Thanks [@robintrepte](https://github.com/robintrepte)! - shadcn-style theming in both kits. The kits use shadcn/ui's theme variables (`background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `radius`, `chart-1` … `chart-5`, `sidebar-*`) and every component reads them, so a pasted shadcn theme restyles everything, light and dark. The old `--accent`/`--on-accent`/`--accent-hover` are now `--primary`/`--primary-foreground`/`--primary-hover`; `--accent` is the highlight under the pointer, as in shadcn. Token blocks have zero specificity and dark mode also follows the `.dark` class. New: `themeCss`, `parseThemeCss`, `brandTheme`, `THEME_PRESETS` and preset CSS files (`themes/blue.css` …), `UIProvider tokens`, `twentyfirst-ui theme`, Tailwind utilities with shadcn's names.
