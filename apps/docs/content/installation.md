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
import { UIProvider } from "@twentyfirstmedia/{{kit}}";

<UIProvider kit={userPrefersPro ? "pro" : "halo"}>{children}</UIProvider>;
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
