---
title: Installation
description: "Install one kit from npm, import its styles once and wrap the app in UIProvider. React 18.3 or 19; works with Next.js, Vite and any React setup."
---

## 1. The kit

The packages are on npm under the MIT license. Install a kit with the CLI (it also sets up styles, the provider and the Next.js layout) or by hand:

```sh
npx @twentyfirstmedia/ui init --kit {{kit}}
# or
pnpm add @twentyfirstmedia/{{kit}}
```

## 2. Styles and provider

Import `styles.css` once. It brings the self-hosted fonts, the tokens (light, dark, density) and every component style; no `data-kit` attribute is needed.

```tsx
import "@twentyfirstmedia/{{kit}}/styles.css";
import { UIProvider, Button } from "@twentyfirstmedia/{{kit}}";

export function App() {
  return (
    <UIProvider theme="system">
      <Button variant="primary">Save</Button>
    </UIProvider>
  );
}
```

## 3. The standard app frame

Apps built with the kit share one frame: the brand, a search that opens the command palette and the look menu in a bar across the top, the navigation in a sidebar below it, the page on the sheet. `AppearanceProvider` stands in for `UIProvider` and keeps what the reader chooses in the `AppearanceMenu` (theme, density, glass, motion, and with both kits the kit) in this browser. It is the default, not a rule: every part can be left out or replaced.

```tsx
// app/layout.tsx: the stored look before the first paint, so a reload does not flash
<head>
  <script dangerouslySetInnerHTML={{ __html: appearanceScript() }} />
</head>
<body>
  <AppearanceProvider>{children}</AppearanceProvider>
</body>

// app/(app)/layout.tsx
<AppShell fill navigation="sidebar" topbar dock={false} brand="Acme"
  topStart={<SearchTrigger placeholder="Search…" shortcut="⌘K" bindShortcut onClick={openSearch} />}
  topStartCompact={<IconButton icon="search" label="Search" variant="ghost" onClick={openSearch} />}
  topEnd={<AppearanceMenu />}
  sidebarGroups={groups} active={section} sidebar={{ linkAs: Link, storageKey: "nav" }}
  user={{ name, email }} userMenu={account}>
  {children}
</AppShell>
<CommandPalette open={searchOpen} onClose={closeSearch} items={pages} />
```

`twentyfirst-ui init` sets up the provider this way. To keep the look per account instead, pass `initial` (the stored value) and `onChange` (save it) to `AppearanceProvider`, and a `hint` such as "Saved for your account" to `AppearanceMenu`. See [AppShell](/{{kit}}/components/AppShell/) and [AppearanceMenu](/{{kit}}/components/AppearanceMenu/).

## Tailwind v4

The kit ships a preset that maps every token to Tailwind and clears the default palette, so utilities can only use kit values.

```css
@import "tailwindcss";
@import "@twentyfirstmedia/{{kit}}/tailwind.css";
```

## Both kits in one app

Import `@twentyfirstmedia/ui-core/themes.css` instead (both kits, scoped under `[data-kit="…"]`) and switch with `<UIProvider kit="pro">` or the attribute on `<html>`. Markup, props and state stay as they are.

```tsx
import "@twentyfirstmedia/ui-core/themes.css";
import { AppearanceProvider } from "@twentyfirstmedia/{{kit}}";

// the reader picks the kit in the AppearanceMenu; or set it yourself: <UIProvider kit="pro">
<AppearanceProvider kits={["halo", "pro"]}>{children}</AppearanceProvider>;
```

## Fonts for share images

Tools that cannot read woff2 or variable fonts, such as `next/og` (Satori) or PDF generators, get static WOFF files under `fonts/og/`: Halo ships Plus Jakarta Sans (400–800) and IBM Plex Mono (500, 600), Pro ships Geist (400–700) and Geist Mono (500, 600), latin subset.

```tsx
// app/opengraph-image.tsx
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const font = await readFile(
  require.resolve("@twentyfirstmedia/halo/fonts/og/plus-jakarta-sans-latin-700-normal.woff"),
);
// new ImageResponse(<div>…</div>, { fonts: [{ name: "Plus Jakarta Sans", data: font, weight: 700 }] })
```

## Coding agents

Give Claude Code, Cursor or VS Code the kit's docs with the MCP server, see [AI agents and MCP](/{{kit}}/ai/):

```sh
npx @twentyfirstmedia/ui mcp init
```
