# FloatingLayout

UI floating over a full-bleed background: a map, a 3D scene, a video or a photo. Four slots sit along the edges (`top`, `start`, `end`, `bottom`) and everything in them is glass by default, translucent and blurred over what is behind.

- The background stays interactive wherever no slot sits on it: drag the map, click a pin.
- `controls` (zoom, compass, locate) and `attribution` (the map's source notes) sit in the free corner above the bottom bar, clear of the panels and the dock.
- `startWidth` and `endWidth` size the side columns (320px and 340px by default).
- The layout publishes `--floating-safe-top`, `-start`, `-end` and `-bottom` (px): how far its slots reach in. Use them to keep a map library's own controls clear, e.g. `.maplibregl-ctrl-bottom-right { right: var(--floating-safe-end); bottom: var(--floating-safe-bottom) }`.
- Below 720px of width the slots stack (top, start, the background, bottom) and the layout grows with them; the `end` slot becomes a bottom sheet over the background whose handle expands and collapses it (`endSheet={false}` stacks it instead).
- `surface="solid"` turns the glass off; `surface="solid"` on a single Panel or Card opts just that one out.
- Panels, cards, the dock, map legends and controls, and loose controls (search field, chips, icon buttons, segmented controls) turn into glass inside it; menus, popovers and dialogs take the stronger glass fill.
- Text on glass keeps 4.5:1 over any backdrop. Reduced transparency, more contrast and forced colours fall back to solid surfaces.
