# Ambient

A calm, living background for glass UI: soft colour fields from the kit (pastels in Halo, a faint aurora in Pro) that drift slowly, a photo or video under a scrim, or your own layer.

- Put it first inside a container: it fills the container (or the window with `fixed`) and sits behind the content.
- With `<UIProvider surface="glass">` around it, panels, cards, tiles, the app shell and floating layers turn into glass over it; text keeps 4.5:1 over any backdrop.
- The fields drift only with `transform`, stop with motion off or reduced motion and pause off screen. `animate={false}` keeps them still.
- `colors` takes any CSS colours (brand colours, `var(--chart-1)`); by default the kit's `--ambient-1…4`, themable like every token.
- `src` shows a photo, `src` with `video` a muted looping video; children replace both with your own layer (canvas, WebGL, a map).
