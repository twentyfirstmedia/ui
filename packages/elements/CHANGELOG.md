# @twentyfirstmedia/elements

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
