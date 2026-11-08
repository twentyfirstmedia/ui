---
title: Introduction
description: "{{Kit}} is one of the two Twentyfirst UI kits: React components, tokens and complete screens with the same API as {{Other}}."
---

Twentyfirst UI is two React UI kits with one component API.

- **Halo** is soft, rounded and light-first: big white cards on a warm canvas, five pastel tints that carry meaning and ink as the only accent.
- **Pro** is sharp, dense and dark-first: monochrome cells on a visible hairline grid, square corners, Geist, and colour only for state.

Both kits have exactly the same components, props, markup, classes and tokens. Only tokens and CSS differ, so an app can load both and switch at runtime with `data-kit`, without changing markup or losing state.

## What is in the box

- {{componentCount}} components on {{componentPages}} pages: foundations, navigation, forms, data, charts, overlays, AI (chat, agents, approvals), commerce, admin, real estate and media.
- {{patternCount}} patterns: complete screens built only from kit parts.
- Tokens for colour, type, space, radius, shadow and motion in light and dark, as CSS variables and as a Tailwind v4 preset.
- A CLI that sets up an app and copies components when you want to own them, and an MCP server so coding agents know every component.

## Principles

- **Mobile first.** Every component works from a 320px screen up: shells collapse, tables scroll, dialogs become sheets and inputs never zoom.
- **Accessible.** Keyboard paths, focus rings and ARIA follow the WAI-ARIA practices; axe (WCAG 2.1 AA) runs on every example of both kits, light and dark.
- **Tokens only.** No colour literals in component CSS.
- **Private.** Fonts are self-hosted, nothing phones home and components make no requests of their own.
- **English, formatted with Intl.** Built-in text is plain English and overridable through props; numbers, money, percentages and dates go through `formatNumber`, `formatMoney`, `formatPercent` and `formatDate`.

## Quick start

```sh
npx @twentyfirstmedia/ui init --kit {{kit}}
```

```tsx
import "@twentyfirstmedia/{{kit}}/styles.css";
import { UIProvider, Button } from "@twentyfirstmedia/{{kit}}";

export function App() {
  return (
    <UIProvider>
      <Button variant="primary">Save</Button>
    </UIProvider>
  );
}
```

Next: [Installation](/{{kit}}/installation/), [CLI](/{{kit}}/cli/), [Theming and tokens](/{{kit}}/theming/), [AI agents and MCP](/{{kit}}/ai/) and [all components](/{{kit}}/components/).
