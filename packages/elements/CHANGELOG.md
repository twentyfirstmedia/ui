# @twentyfirstmedia/elements

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
