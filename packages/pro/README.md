# @twentyfirstmedia/pro

**Pro**: sharp, dense and dark-first: monochrome cells on a hairline grid, square corners, Geist, and colour only for state. One of the two [Twentyfirst UI](https://ui.twentyfirst.media) kits: 241 accessible React components and 40 complete screens with exactly the same API as [Halo](https://www.npmjs.com/package/@twentyfirstmedia/halo).

[Website](https://ui.twentyfirst.media) · [Halo docs](https://ui.twentyfirst.media/halo/) · [Pro docs](https://ui.twentyfirst.media/pro/) · [GitHub](https://github.com/twentyfirstmedia/ui) · [llms.txt](https://ui.twentyfirst.media/llms.txt)

![Pro](https://raw.githubusercontent.com/twentyfirstmedia/ui/main/.github/assets/hero-pro.png)

## Install

```sh
npx @twentyfirstmedia/ui init --kit pro   # sets up styles, provider and layout
# or
npm install @twentyfirstmedia/pro
```

```tsx
import "@twentyfirstmedia/pro/styles.css";
import { Button, UIProvider } from "@twentyfirstmedia/pro";

export function App() {
  return (
    <UIProvider theme="system">
      <Button variant="primary">Save</Button>
    </UIProvider>
  );
}
```

## What you get

- Every component of `@twentyfirstmedia/ui-core`, re-exported.
- `styles.css`: self-hosted fonts, tokens for light and dark, all component styles.
- `tailwind.css`: a Tailwind v4 preset that maps every token (`bg-surface`, `text-ink`, `shadow-card`).
- `tokens.css`, `tokens.json`, `fonts.css` and `scoped.css` (scoped under `[data-kit="pro"]`) for custom setups.

Need both looks in one app? Import `@twentyfirstmedia/ui-core/themes.css` and switch with `<UIProvider kit="halo">`.

## Coding agents

```sh
npx @twentyfirstmedia/ui mcp init
```

Gives Claude Code, Cursor and VS Code an MCP server with every component, its props and examples. See [AI agents and MCP](https://ui.twentyfirst.media/pro/ai/).

## License

[MIT](https://github.com/twentyfirstmedia/ui/blob/main/LICENSE) © Twentyfirst Media. Fonts under the SIL Open Font License 1.1.
