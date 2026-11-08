---
title: Theming and tokens
description: "Both kits define exactly the same token names. Pro maps its own scale onto Halo's names; references like {bg-000} point at other tokens."
---

Theme and density are attributes: `data-theme="light|dark|system"` and `data-density="compact|comfortable"` on `<html>` or any subtree, or the `theme` and `density` props of `UIProvider`. Halo follows the system theme and is comfortable by default; Pro is dark and compact by default.

```tsx
<UIProvider theme="dark" density="compact">…</UIProvider>
// Tailwind: bg-surface text-ink rounded-lg shadow-card text-h2
```

## Layout and breakpoints

The kits are mobile first: every component works from a 320px wide screen up, and from 1181px on the full desktop layout applies. Phones (up to 760px) get one column: the shell stacks, rail and page nav become scrolling rows, the dock sticks to the bottom, tables scroll inside their box, dialogs open as bottom sheets and popovers stay on screen. Tablets (761–1180px) move asides below the main column. On touch screens text fields use 16px so browsers do not zoom in, and a compact kit (Pro) switches to comfortable hit targets unless `data-density` is set.

For your own grids, `tf-grid` takes its columns from custom properties: `--cols` on desktop, `--cols-md` on tablets (defaults to `--cols`) and `--cols-sm` on phones (defaults to one column).

```tsx
<div
  className="tf-grid"
  style={{ "--cols": "repeat(4, minmax(0, 1fr))", "--cols-sm": "1fr 1fr" } as React.CSSProperties}
>
  <StatTile value="18" label="Projects" />
  …
</div>
```

## Control sizes

Every control sits on one height scale: Halo 32 / 40 / 48px (sm / md / lg), Pro 24 / 28 / 34px. Mix sizes only on purpose; a row of controls uses one size.
