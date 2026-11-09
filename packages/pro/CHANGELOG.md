# @twentyfirstmedia/pro

## 0.3.0

### Patch Changes

- Updated dependencies [[`bef588d`](https://github.com/twentyfirstmedia/ui/commit/bef588d0fb521a5b458113095a7952222efe3c63), [`ef1090f`](https://github.com/twentyfirstmedia/ui/commit/ef1090f32204a227ed0ad717e74ea057f6d4da90), [`ece54b1`](https://github.com/twentyfirstmedia/ui/commit/ece54b18c3594f595386608e12c93190aa41d5bb), [`4cf034a`](https://github.com/twentyfirstmedia/ui/commit/4cf034af9d2a7eafae5281252e6f7857a74f8540), [`d408a82`](https://github.com/twentyfirstmedia/ui/commit/d408a82cc5ab0acf5401c56118acf36e62516a81), [`3b0992d`](https://github.com/twentyfirstmedia/ui/commit/3b0992dd44ef4f864e96c9735d55a9dbb18b8747)]:
  - @twentyfirstmedia/ui-core@0.3.0

## 0.2.1

### Patch Changes

- [#26](https://github.com/twentyfirstmedia/ui/pull/26) [`863179b`](https://github.com/twentyfirstmedia/ui/commit/863179b194fcd8e43bac596039ef555cc294d03e) Thanks [@robintrepte](https://github.com/robintrepte)! - Published through npm Trusted Publishing: the release workflow no longer uses an npm token, and every package carries a provenance statement linking it to the GitHub Actions run that built it. No code changes.
- Updated dependencies [[`863179b`](https://github.com/twentyfirstmedia/ui/commit/863179b194fcd8e43bac596039ef555cc294d03e)]:
  - @twentyfirstmedia/ui-core@0.2.1

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
- Updated dependencies [[`4529ab5`](https://github.com/twentyfirstmedia/ui/commit/4529ab565c0de3dadb52b248585f1d4bb0ae0b3c), [`688f141`](https://github.com/twentyfirstmedia/ui/commit/688f141210ed82c5c10b375b38c9d06bbc7a7bf2), [`beb3043`](https://github.com/twentyfirstmedia/ui/commit/beb30433be7abc8ed1adabf0bae2fc4de526e8f7), [`beb3043`](https://github.com/twentyfirstmedia/ui/commit/beb30433be7abc8ed1adabf0bae2fc4de526e8f7)]:
  - @twentyfirstmedia/ui-core@0.2.0

## 0.1.1

### Patch Changes

- Updated dependencies []:
  - @twentyfirstmedia/ui-core@0.1.1

## 0.1.0

### Minor Changes

- [#12](https://github.com/twentyfirstmedia/ui/pull/12) [`2cf6196`](https://github.com/twentyfirstmedia/ui/commit/2cf6196cc8e81afa0668ce36e35dfe01501e44ea) Thanks [@robintrepte](https://github.com/robintrepte)! - Consistency pass over every component in both kits and themes. The app shell responds to its own width (container queries); kit boxes no longer depend on the host's box-sizing; controls and code use the kit fonts; bold stays on the type scale; status shapes, list icons, stat values, pagination and invoice numbers line up; segmented controls and tabs no longer stretch or break mid-word. Gauge, Funnel and ProgressRing now fill when reduced motion is on. Pro follows its reference more closely: decorative tints and chart series are monochrome, bars are flat, in-flow cards use hairlines, badges sit on the corner. New: `formatPercent`.

- [#8](https://github.com/twentyfirstmedia/ui/pull/8) [`2db7b83`](https://github.com/twentyfirstmedia/ui/commit/2db7b83266449602d1209c346b44ad62a66c416d) Thanks [@robintrepte](https://github.com/robintrepte)! - First release: every component of the Halo reference in `ui-core`, the Halo and Pro kits with the same components, props and markup (switchable at runtime via `data-kit`), tokens and a Tailwind v4 preset per kit, self-hosted fonts and the CLI (`init`, `add`, `list`, `diff`).

- [#10](https://github.com/twentyfirstmedia/ui/pull/10) [`532f835`](https://github.com/twentyfirstmedia/ui/commit/532f83532d4ce4098733020d34277299c025fa08) Thanks [@robintrepte](https://github.com/robintrepte)! - Mobile first: every component works from 320px up in both kits (desktop from 1181px unchanged). The shell, rail and page nav reflow on phones, tables scroll in their own box, dialogs open as bottom sheets, popovers and tooltips stay on screen, text fields use 16px on touch screens and Pro switches to comfortable hit targets on touch unless `data-density` is set. New: `tf-grid` columns via `--cols` / `--cols-md` / `--cols-sm`, `tf-sheet-nav` / `tf-sheet-aside`, `tf-table-scroll`, `useKeepInView`, `useScrollFocus`, `Tooltip` `defaultOpen`.

- [#16](https://github.com/twentyfirstmedia/ui/pull/16) [`350ca53`](https://github.com/twentyfirstmedia/ui/commit/350ca53ea6b1a4dd77759449ac4b56bb8ed2a62a) Thanks [@robintrepte](https://github.com/robintrepte)! - Open source under the MIT license and published on npmjs.com: install with `npm i @twentyfirstmedia/halo` (or `pro`), no registry setup or token. `twentyfirst-ui init` no longer writes an `.npmrc`.

- [#13](https://github.com/twentyfirstmedia/ui/pull/13) [`559cb2d`](https://github.com/twentyfirstmedia/ui/commit/559cb2df5ac851e71ad0f3808b1442f7f79a6401) Thanks [@robintrepte](https://github.com/robintrepte)! - English only: built-in text is plain English and overridable through props; numbers, money, percentages and dates format with Intl in en-US (`formatNumber`, `formatMoney`, `formatPercent`, `formatDate`).
  
  New components in both kits: Accordion, Separator, AspectRatio, Label, Toggle, ToggleGroup, ButtonGroup, ScrollArea, HoverCard, Carousel, Menubar, NavigationMenu, Sidebar, SelectMenu, Form and ResizablePanels. Menu gains keyboard navigation, typeahead, submenus, checkbox/radio and disabled items; Tabs render panels; Drawer takes `side`; Popover flips when there is no room; CommandPalette takes `loading`, `empty` and `onQueryChange`; Button and IconButton take `asChild`; inputs take `id`, `name` and `required`.

- [#18](https://github.com/twentyfirstmedia/ui/pull/18) [`0f19447`](https://github.com/twentyfirstmedia/ui/commit/0f19447291603a148759d10b7a2bf13ea7e95cb6) Thanks [@robintrepte](https://github.com/robintrepte)! - shadcn-style theming in both kits. The kits use shadcn/ui's theme variables (`background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `radius`, `chart-1` … `chart-5`, `sidebar-*`) and every component reads them, so a pasted shadcn theme restyles everything, light and dark. The old `--accent`/`--on-accent`/`--accent-hover` are now `--primary`/`--primary-foreground`/`--primary-hover`; `--accent` is the highlight under the pointer, as in shadcn. Token blocks have zero specificity and dark mode also follows the `.dark` class. New: `themeCss`, `parseThemeCss`, `brandTheme`, `THEME_PRESETS` and preset CSS files (`themes/blue.css` …), `UIProvider tokens`, `twentyfirst-ui theme`, Tailwind utilities with shadcn's names.

### Patch Changes

- Updated dependencies [[`2c5ddb6`](https://github.com/twentyfirstmedia/ui/commit/2c5ddb6715c7c296a3379ea241158218185e9262), [`acec782`](https://github.com/twentyfirstmedia/ui/commit/acec782abd5f1d188f9ee5e7c8eb563e6c450031), [`2cf6196`](https://github.com/twentyfirstmedia/ui/commit/2cf6196cc8e81afa0668ce36e35dfe01501e44ea), [`2db7b83`](https://github.com/twentyfirstmedia/ui/commit/2db7b83266449602d1209c346b44ad62a66c416d), [`532f835`](https://github.com/twentyfirstmedia/ui/commit/532f83532d4ce4098733020d34277299c025fa08), [`350ca53`](https://github.com/twentyfirstmedia/ui/commit/350ca53ea6b1a4dd77759449ac4b56bb8ed2a62a), [`559cb2d`](https://github.com/twentyfirstmedia/ui/commit/559cb2df5ac851e71ad0f3808b1442f7f79a6401), [`0f19447`](https://github.com/twentyfirstmedia/ui/commit/0f19447291603a148759d10b7a2bf13ea7e95cb6)]:
  - @twentyfirstmedia/ui-core@0.1.0
