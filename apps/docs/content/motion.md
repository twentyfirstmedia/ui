---
title: Motion
description: "Choreographed page entrances, data that draws itself, layers that animate in and out, page transitions and reveal on scroll, with one switch: off, standard or expressive."
---

Both kits move with purpose: the shell settles in, cards rise one after another, charts draw and numbers count up once their card is there, and menus, dialogs, drawers and toasts animate in and out. One switch sets how much:

| Level | Halo | Pro |
| --- | --- | --- |
| `standard` (default) | Soft and springy: 520ms entrances, 55ms between cards | Quick and quiet: 140ms, no stagger, no springs |
| `expressive` | Orchestrated: 760ms entrances, 90ms between cards, more travel, a short focus-in blur | Crisp: 360ms entrances, 45ms between cards, sharp easing, no blur or springs |
| `off` | Nothing moves; values and layers appear at once | The same |

```tsx
import { UIProvider } from "@twentyfirstmedia/{{kit}}";

<UIProvider motion="expressive">{children}</UIProvider>;
// a setting in your app
<UIProvider motion={settings.reduceMotion ? "off" : "standard"}>{children}</UIProvider>;
```

The level is an attribute, so it works without React too: `data-motion="expressive"` on `<html>` or any subtree. The reader's reduced-motion setting always wins and turns motion off, whatever the app sets.

## The choreography

- **Shell**: the top bar drops in, side panels slide in, the dock springs up and its buttons pop in turn.
- **Content**: wrap a page's sections in `Stagger` and they rise one after another. Below the fold a `Stagger` waits until it scrolls into view (`reveal={false}` plays at once).
- **Data**: bars grow, lines draw, areas and dots fade in, gauges and progress bars fill and `CountUp` counts, each waiting for the card it sits in. New values count from the old one.
- **Layers**: popovers, menus, tooltips, hover cards, comboboxes, dialogs, drawers, the command palette and toasts animate out as well as in. `Modal`, `Drawer` and `CommandPalette` take an optional `open` prop for that; without it, render them only while open, as before.

```tsx
<Stagger className="tf-grid" style={{ "--cols": "repeat(3, minmax(0, 1fr))" } as CSSProperties}>
  <StatTile value="1,284" label="Orders" />
  <Panel title="Revenue">
    <LineChart labels={days} series={series} />
  </Panel>
  …
</Stagger>
<Drawer open={open} title="Order 1042" onClose={() => setOpen(false)}>…</Drawer>
```

## Page transitions

`startViewTransition(update)` runs a route change or a big update as a view transition: the old page fades out and the new one rises in, in the kit's motion. Browsers without view transitions, and motion `off`, get a plain update.

```tsx
import { startViewTransition } from "@twentyfirstmedia/{{kit}}";

startViewTransition(() => router.push("/orders"));
```

The kits style `::view-transition-old(root)` and `::view-transition-new(root)`, so transitions started another way (Next.js `experimental.viewTransition` with React's `<ViewTransition>`, Astro, plain `document.startViewTransition`) look the same.

## Your own animations

- `useMotion()` returns the level in effect (`"off"` while the reader asks for reduced motion).
- `usePresence(open)` keeps your own layer mounted while it animates out: render while `mounted`, spread `leaving(closing)` on its root (sets `data-closing` and `inert`).
- The motion tokens drive everything: `--dur-fast`, `--dur-base`, `--dur-enter`, `--dur-slow`, `--dur-exit`, `--stagger-step`, `--ease-out`, `--ease-spring`, `--motion-time` (delays), `--motion-travel` (distances) and `--motion-blur`. Set them like any other token for a motion style of your own.

Only `transform`, `opacity` and the short expressive blur animate; layout never moves under the reader.
