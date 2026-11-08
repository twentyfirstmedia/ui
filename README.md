# Twentyfirst UI

Two React UI kits with one component API:

- **Halo** (`@twentyfirstmedia/halo`): soft, rounded, light-first.
- **Pro** (`@twentyfirstmedia/pro`): sharp, dense, hairline grid, dark-first.

Both kits ship the same components, props and markup; only tokens and CSS differ. An app can load
both and switch between them at runtime with `data-kit="halo|pro"`.

| Package                     | Contents                                                       |
| --------------------------- | -------------------------------------------------------------- |
| `@twentyfirstmedia/ui-core` | components, hooks, icons, label and locale system, `themes.css` |
| `@twentyfirstmedia/halo`    | re-exports `ui-core`, Halo `styles.css`, tokens, fonts          |
| `@twentyfirstmedia/pro`     | re-exports `ui-core`, Pro `styles.css`, tokens, fonts           |
| `@twentyfirstmedia/ui`      | CLI: `init`, `add`, `list`, `diff`                              |

Docs: `ui.twentyfirst.media/halo` and `/pro`.

## Installation

The packages are private and live in GitHub Packages. Give npm a token that can read packages of
the `twentyfirstmedia` organisation (a classic personal access token with `read:packages`, or
`GITHUB_TOKEN` in Actions) and point the scope at the GitHub registry in your app's `.npmrc`:

```ini
@twentyfirstmedia:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

Keep the token in the environment (`NPM_TOKEN`), never in the repository. Then install one kit:

```sh
pnpm add @twentyfirstmedia/halo   # or @twentyfirstmedia/pro
```

or let the CLI set everything up (package, CSS import, Tailwind preset, `UIProvider`):

```sh
pnpm dlx @twentyfirstmedia/ui init --kit halo
```

```tsx
import "@twentyfirstmedia/halo/styles.css";
import { UIProvider, Button } from "@twentyfirstmedia/halo";

export function App() {
  return (
    <UIProvider kit="halo" locale="de-DE">
      <Button variant="primary">Save</Button>
    </UIProvider>
  );
}
```

To switch kits at runtime, import `@twentyfirstmedia/ui-core/themes.css` (both kits) and change
`kit` on `UIProvider` or `data-kit` on `<html>`.

## Development

Requires Node 24 and pnpm 12.

| Command          | Purpose                                                                    |
| ---------------- | -------------------------------------------------------------------------- |
| `pnpm install`   | install                                                                    |
| `pnpm dev`       | docs site in watch mode (http://localhost:3000/halo/)                      |
| `pnpm check`     | format check, lint, typecheck, unit tests                                  |
| `pnpm test:e2e`  | Playwright: axe and screenshots of every preview, both kits, light/dark    |
| `pnpm tokens`    | regenerate token CSS and Tailwind theme from `tokens.json`                 |
| `pnpm changeset` | describe a change for the next release                                     |

The specification lives in `reference/` (read-only), the build plan in `docs/PLAN.md`.
Releases: merging to `main` publishes pending changesets to GitHub Packages.
