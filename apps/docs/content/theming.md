---
title: Theming and tokens
description: "Theme both kits like shadcn/ui: the same variables (primary, secondary, muted, accent, destructive, border, ring, radius, charts, sidebar) restyle every component, light and dark."
---

Both kits use shadcn/ui's theme variables. A theme is any CSS that sets them, so a theme from ui.shadcn.com/themes, tweakcn or your own design system works as it is, and every component follows it: buttons, fields, menus, tables, charts, the Sidebar, in Halo and in Pro, light and dark.

```css
@import "@twentyfirstmedia/{{kit}}/styles.css";

:root {
  --primary: oklch(0.546 0.245 262.881);
  --primary-foreground: oklch(0.985 0 0);
  --ring: oklch(0.546 0.245 262.881);
  --radius: 0.75rem;
}
.dark,
[data-theme="dark"] {
  --primary: oklch(0.707 0.165 254.624);
  --primary-foreground: oklch(0.145 0 0);
}
```

The kits define their variables with zero specificity, so your theme wins in any order. Dark mode follows `data-theme="dark"` or the `.dark` class on `<html>` (next-themes works as it is), and `data-theme="system"` follows the operating system.

## The variables

| Variable | Used for |
| --- | --- |
| `--background`, `--foreground` | Page background and default text |
| `--card`, `--card-foreground` | Cards, panels, fields, the workspace sheet |
| `--popover`, `--popover-foreground` | Menus, popovers, select lists, command palette, hover cards, dialogs |
| `--primary`, `--primary-foreground` | Primary buttons, checked boxes and radios, switches, selected chips and days, progress, current marks |
| `--secondary`, `--secondary-foreground` | Soft buttons and icon buttons |
| `--muted`, `--muted-foreground` | Quiet fills (tracks, search fields, code) and secondary text |
| `--accent`, `--accent-foreground` | The highlight under the pointer or keyboard: menu items, rows, options, nav items |
| `--destructive`, `--destructive-foreground` | Danger buttons, error text and icons |
| `--border`, `--input`, `--ring` | Hairlines, field and checkbox borders, focus rings |
| `--radius` | The base corner radius; every corner derives from it |
| `--chart-1` … `--chart-5` | Chart series (lines, dots, legends) |
| `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring` | The Sidebar |

The kits' own names (`--canvas`, `--surface`, `--ink`, `--line`, Pro's `--bg-000` … `--fg-400` scale) point at these, and the in-between shades are mixed from them, so you only set the variables above. Outside the theme on purpose: the five tints and status colours (they carry meaning), Halo's dark app frame, paper (e-mail and invoice previews) and media overlays. Halo draws chart bars in soft fills of the series colours (`--chart-sky` … `--chart-blush`); the theme builder and `twentyfirst-ui theme` set them for you when the charts change.

## Presets, CLI and builder

Six brand presets keep each kit's neutrals and change the brand colour: blue, violet, emerald, orange, rose and teal.

```css
@import "@twentyfirstmedia/{{kit}}/styles.css";
@import "@twentyfirstmedia/{{kit}}/themes/violet.css";
/* both kits loaded: @twentyfirstmedia/ui-core/themes/violet.css */
```

The CLI writes a theme into your app and imports it: a preset, a brand colour (light, optionally dark) or a shadcn theme file.

```sh
npx @twentyfirstmedia/ui theme violet
npx @twentyfirstmedia/ui theme "#2563eb,#60a5fa"
npx @twentyfirstmedia/ui theme ./shadcn-theme.css
```

The [theme builder](/{{kit}}/themes/) shows a theme live on real components and gives you the CSS.

## Themes at runtime

For a brand per customer or a colour the user picks, `UIProvider` takes the same variables. One set applies in both modes; `{ light, dark }` picks by the current theme.

```tsx
import { UIProvider, brandTheme } from "@twentyfirstmedia/{{kit}}";

<UIProvider tokens={{ primary: tenant.color, ring: tenant.color }}>{children}</UIProvider>;
<UIProvider tokens={brandTheme("#2563eb", "#60a5fa")}>{children}</UIProvider>;
```

`themeCss(theme, { kit })` writes the CSS for a theme (for a server-rendered `<style>`), `parseThemeCss(css)` reads a shadcn theme, and `brandTheme(color)` picks readable text for a brand colour.

## Tailwind

The preset maps the variables to shadcn's utility names, so `bg-primary text-primary-foreground`, `bg-muted text-muted-foreground`, `border-border`, `ring-ring` and `bg-sidebar` work, plus the kits' own names (`bg-surface`, `text-ink`).

## Light, dark and density

Theme and density are attributes: `data-theme="light|dark|system"` and `data-density="compact|comfortable"` on `<html>` or any subtree, or the `theme` and `density` props of `UIProvider`. Halo follows the system theme and is comfortable by default; Pro is dark and compact by default.

```tsx
<UIProvider theme="dark" density="compact">…</UIProvider>
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
