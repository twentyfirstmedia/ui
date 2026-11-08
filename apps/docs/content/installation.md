---
title: Installation
description: The packages are private and live in GitHub Packages. One kit is the normal case.
---

## 1. Registry and token

Point the `@twentyfirstmedia` scope at GitHub Packages in your app's `.npmrc` and keep a token with `read:packages` in the environment as `NPM_TOKEN`.

```ini
@twentyfirstmedia:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

## 2. The kit

Install it with the CLI (it also sets up styles and the provider) or by hand:

```sh
npx @twentyfirstmedia/ui init --kit {{kit}}
# or
pnpm add @twentyfirstmedia/{{kit}}
```

## 3. Styles and provider

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

## Coding agents

Give Claude Code, Cursor or VS Code the kit's docs with the MCP server, see [AI agents and MCP](/{{kit}}/ai/):

```sh
npx @twentyfirstmedia/ui mcp init
```
