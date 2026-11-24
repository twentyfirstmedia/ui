---
title: Moving from shadcn/ui
description: "Move a shadcn/ui app to {{Kit}} page by page: one stylesheet dresses shadcn's buttons, inputs, cards, dialogs, menus, tables and tabs in the kit, so old and new pages look the same while you port them."
---

Apps built with shadcn/ui do not have to switch in one go. `@twentyfirstmedia/ui-core/shadcn.css` dresses shadcn's primitives in the kit by their `data-slot` attributes. Set `data-kit` on the part of the app you are moving and everything inside looks like {{Kit}}: the pages you already rebuilt with kit components and the shadcn pages you have not touched yet. Outside `[data-kit]` nothing changes.

## Setup

Load the kit, then the bridge, after your Tailwind CSS:

```css
/* app/globals.css */
@import "tailwindcss";
@import "@twentyfirstmedia/ui-core/themes.css"; /* both kits, switch with data-kit */
@import "@twentyfirstmedia/ui-core/shadcn.css";
```

```tsx
// app/admin/layout.tsx: the admin is moving to the kit, the rest of the app is not (yet)
import { UIProvider } from "@twentyfirstmedia/ui-core";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-kit="{{kit}}">
      <UIProvider>{children}</UIProvider>
    </div>
  );
}
```

Colours need nothing extra: both kits define shadcn's variables (`--background`, `--foreground`, `--primary`, `--border`, `--ring` …), so shadcn's utilities pick up the kit's colours in light and dark. The bridge adds what those variables do not carry.

## What it covers

| shadcn part | data-slot | From the kit |
| --- | --- | --- |
| Button | `button` with `data-variant`, `data-size` | control height of the density, button radius, type, hover, focus ring |
| Input, Textarea, Select | `input`, `textarea`, `select-trigger`, `select-content`, `select-item` | field height and radius, inset border, focus and error ring |
| Card | `card`, `card-header`, `card-title`, `card-description`, `card-content`, `card-footer` | panel surface, radius, shadow, padding and gap (v3's padded parts and v4's gap look the same), title type |
| Dialog, Alert dialog, Sheet | `…-content`, `…-overlay`, `…-title`, `…-description` | overlay surface and shadow, scrim, title type |
| Dropdown menu, Popover, Tooltip | `dropdown-menu-content`, `dropdown-menu-item`, `popover-content`, `tooltip-content` | menu surface, item height and highlight, tooltip on the frame colour |
| Badge | `badge` with `data-variant` | badge height and radius, status colours |
| Table | `table`, `table-head`, `table-row`, `table-cell` | row height of the density, header type, hover and selected rows |
| Tabs | `tabs-list`, `tabs-trigger` | the kit's segmented track |
| Checkbox, Switch, Label | `checkbox`, `switch`, `switch-thumb`, `label` | shapes, checked state, label type |
| Separator, Progress, Alert, Skeleton | `separator`, `progress`, `progress-indicator`, `alert`, `skeleton` | lines, bars, alerts in the status colours by tone |

Switches take the kit's geometry, not only its colours: the track, the inset and the knob that moves inside it are the same as the kit's own `Switch` (Halo's round 40×24 switch, Pro's 28×16 hairline switch), for shadcn's sizes in both v3 and v4. On glass the knob stays solid.

<!-- demo: shadcn-switch -->

Alerts take the kit's status colours. shadcn's Alert sets no `data-variant`, so its `destructive` variant is found by its `text-destructive` class; for the other tones set `data-tone`: `danger`, `warning` or `success` (without one an alert is info). The icon takes the alert's colour, and on glass the alert is a translucent tint of its tone with a thin edge.

<!-- demo: shadcn-alerts -->

```tsx
<Alert data-tone="warning">
  <TriangleAlert />
  <AlertTitle>Payout delayed</AlertTitle>
</Alert>
```

On glass, dropdowns, selects, popovers and context menus are glass like the kit's own menus; with `<UIProvider surface="glass" floating="solid">` (or `data-floating="solid"`) they stay solid.

It follows the kit's settings: compact and comfortable density, light and dark, and glass. Inside `<UIProvider surface="glass">` cards, dialogs, sheets, menus and popovers turn to glass like the kit's own surfaces, and back to solid for people who ask for less transparency.

The file is not in a CSS layer on purpose: it wins over Tailwind's utilities, which live in `@layer utilities`, so a button keeps the kit's height even when its classes say `h-9`. Utilities for other properties (width, margins, grid and flex) keep working.

## Fields with an icon

Fields get the kit's horizontal padding one side at a time, and a side the field sets itself wins. A shadcn search field keeps its `pl-9` (also `ps-*`, `p-*` and variants like `md:pl-9`), so the icon in front does not sit on the placeholder; the other side still gets the kit's padding. A field without Tailwind classes asks for room with `data-icon`:

```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />
  <Input className="pl-9" placeholder="Search customers" />
</div>

<input data-slot="input" data-icon="leading" />  {/* or "trailing" */}
```

## Tailwind colours in ported pages

Pages written for shadcn often colour states with Tailwind's palette: `bg-green-100 text-green-800` for paid, `text-red-600` for failed. Add `data-kit-colors="status"` next to `data-kit` and those utilities draw the kit's status colours:

```tsx
<div data-kit="{{kit}}" data-kit-colors="status">…</div>
```

- green, emerald, lime, teal → ok
- red, rose → danger
- amber, yellow, orange → warn
- blue, sky, cyan, indigo → info
- purple, violet, fuchsia, pink → signal

Shades 50–200 and 950 become the soft background (`--ok-bg` …), 300–900 the colour itself, so pairs like `bg-green-100 text-green-800` keep their contrast in both themes. It is opt-in because charts and illustrations may use the palette on purpose.

## Page by page

1. Wrap the area you move (`/admin`) in `data-kit` and load the bridge. The shadcn pages there now look like the kit.
2. Rebuild one page at a time with kit components: `DataTable` for lists, `RecordHeader` and `PropertyList` for detail pages, `Form` and the field controls for settings. Both kinds of page sit side by side without a visible seam.
3. When a page no longer renders shadcn parts, it no longer needs the bridge; when none do, remove the import.
