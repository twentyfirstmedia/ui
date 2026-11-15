# @twentyfirstmedia/elements

## 0.8.0

### Minor Changes

- [#50](https://github.com/twentyfirstmedia/ui/pull/50) [`9ef8510`](https://github.com/twentyfirstmedia/ui/commit/9ef8510af5849a9ecd4977797a67df379af916b1) Thanks [@robintrepte](https://github.com/robintrepte)! - Widgets for the data that connected services bring.
  
  - `DeviceTile`: a smart-home device (switch, light, thermostat, vacuum, purifier, camera, lock, sensor) with its reading, a switch, a thermostat stepper, battery, quick actions and an offline state.
  - `VehicleCard`: an electric car with charge and limit, range, charging power and finish time, lock and climate as toggle buttons, inside temperature and location.
  - `NowPlaying`: cover, title, device, progress and previous / play-pause / next.
  - `WorkoutCard`: duration, distance, calories, heart rate and minutes per heart-rate zone.
  - `CallLog`: calls by day with direction, length, an assistant's summary and call back.
  - `ReservationCard`: stays, flights, trains, rides, deliveries and tickets with dates, place, booking number and status.
  - `Scorecard`: a golf round with the usual score marks, putts, Out, In and total against par; every score in words for screen readers.
  - `HoldingsList`: portfolio positions with value, change and share.
  - All cards turn to glass inside `<UIProvider surface="glass">`. Patterns Home (in glass), Trips & orders, Golf and Investments.

- [#49](https://github.com/twentyfirstmedia/ui/pull/49) [`d141a0c`](https://github.com/twentyfirstmedia/ui/commit/d141a0cf463439e074b77daa57463e61a3794cae) Thanks [@robintrepte](https://github.com/robintrepte)! - Connectors: UI for assistants that read from and act in your services.
  
  - `ServiceMark`: a service's brand logo, your own logo or a monogram (for brands without an open logo), with a state dot that screen readers hear in words.
  - `ConnectorGallery`: every service by category with search and chips; Connect, Connected, Needs attention (Reconnect) and Coming soon.
  - `ConnectionList`: connected services with account, state, how fresh the data is, Manage and Reconnect.
  - `SyncStatus`: "Synced 6 minutes ago", the next sync, what it brought and why it failed, with "Sync now".
  - `AgentActivity`: what agents read and changed, grouped by day, with waiting, declined, undone and failed states, "Review" and "Undo".
  - `ConsentList` scopes take `level` (`read`, `act`, `money`) and `asksFirst`; the header uses `ServiceMark`.
  - `formatRelative` and `useFormat().formatRelative`: "6 minutes ago", "in 1 hour", "yesterday" with `Intl.RelativeTimeFormat`.
  - 72 more brand logos (Gmail, Google Calendar, Docs, Sheets, Photos, Maps, Home, Tesla, Commerzbank, N26, tado°, SmartThings, Booking.com, Netflix, Strava, Garmin, Philips Hue, Deutsche Bahn …) and 18 line icons for home, devices and travel.
  - Patterns Connections, Connect a service and Agent activity in a new docs group "Connectors".

- [#52](https://github.com/twentyfirstmedia/ui/pull/52) [`d93b13f`](https://github.com/twentyfirstmedia/ui/commit/d93b13f41cb047af965555ec8c86808149ac363b) Thanks [@robintrepte](https://github.com/robintrepte)! - Real provider logos for every connector.
  
  - 23 more brand logos: Apple Health, Apple Fitness, Apple Home, Google Fit, Microsoft Outlook, Microsoft Teams, Scalable Capital, Trade Republic, Getsafe, ottonova, HanseMerkur, Dyson, eufy, Dreame, Wolt, Careem, Oura, WHOOP, Withings, Doctolib, PCCADDIE, Hole19 and Trackman. Most are drawn from the companies' own artwork (sources in `scripts/brands/index.json`); Google Fit, Outlook and Teams come from Material Design Icons (Apache 2.0).
  - Brand logos are trademarks and artwork of their owners and are not covered by the MIT License; `ICONS-LICENSE` says so and now also ships with `@twentyfirstmedia/elements`, which bundles the icons.
  - Wordmark logos carry `wide: true`; `ServiceMark` draws them across most of its tile so the letters stay readable.

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

### Minor Changes

- [#30](https://github.com/twentyfirstmedia/ui/pull/30) [`bef588d`](https://github.com/twentyfirstmedia/ui/commit/bef588d0fb521a5b458113095a7952222efe3c63) Thanks [@robintrepte](https://github.com/robintrepte)! - `Button` and `IconButton` pass native attributes on to their `<button>` (or, with `asChild`, to the child): `id`, `name`, `value`, `form`, `title`, `tabIndex`, `autoFocus`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-expanded`, `aria-controls`, `aria-haspopup`, `aria-pressed`, `aria-current` (documented as `NativeButtonProps`), plus any other `<button>` attribute, `data-*`, event handlers and, in React 19, `ref`. `type` also takes `"reset"`, and `IconButton` takes `type`. On `IconButton`, `aria-label` or `title` override the ones `label` sets. With `asChild`, `onClick` and the other attributes now reach the child as well.
  
  In `@twentyfirstmedia/elements`, `<tf-button>` and `<tf-icon-button>` take these as attributes; `aria-*` attributes move from the host to the inner button. The docs and the MCP server list them with both components.

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

No changes in this release.

## 0.1.0

### Minor Changes

- [#18](https://github.com/twentyfirstmedia/ui/pull/18) [`0f19447`](https://github.com/twentyfirstmedia/ui/commit/0f19447291603a148759d10b7a2bf13ea7e95cb6) Thanks [@robintrepte](https://github.com/robintrepte)! - New package `@twentyfirstmedia/elements`: every component as a custom element (`<tf-button>`, `<tf-data-table>`, `<tf-provider>` …) for plain HTML, Vue, Svelte, Angular, Astro and server templates. Attributes and properties map to props, callbacks become DOM events with the argument in `detail`, and children and `slot="…"` fill content props. Ships ESM and a classic-script bundle with React included, TypeScript types and a Custom Elements Manifest. New guide: Plain HTML and frameworks.
