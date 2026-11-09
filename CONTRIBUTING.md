# Contributing to Twentyfirst UI

Thanks for helping. Bug reports, fixes, docs improvements and new components are all welcome. This page explains how the repository works and the few rules that keep Halo and Pro identical.

## Ground rules

- **One API, two looks.** Components live once in `packages/core` and never branch on the kit in JavaScript. Halo and Pro differ only in tokens and CSS, and every component, class and token must exist in both kits. A parity test fails the build otherwise.
- **Tokens only.** No colour literals in component CSS and no arbitrary Tailwind values in kit code. Tokens come from `packages/<kit>/tokens.json`; run `pnpm tokens` after changing them.
- **Accessible.** Every interactive component needs a keyboard path, a visible focus ring and the right ARIA. axe runs on every docs example in both kits, light and dark.
- **Mobile first.** Everything works from 320px up; the e2e suite checks for sideways scrolling and the control height scale (Halo 32/40/48px, Pro 24/28/34px).
- **English, formatted with `Intl`.** Built-in text is plain English and overridable through props and `UIProvider messages`: add every new string to `packages/core/src/strings.ts` (the group of the component's file) and read it with `useStrings`. Numbers, money, percentages and dates use `useFormat()` (the provider's locale) or `formatNumber`, `formatMoney`, `formatPercent` and `formatDate`.
- **Private by default.** No telemetry and no network requests from components. Fonts are self-hosted.
- **TypeScript strict, ESM only.** Exact versions for fast-moving dependencies.

## Setup

You need Node 22 or newer and pnpm (the version is pinned in `package.json`; `corepack enable` picks it up).

```sh
pnpm install
pnpm dev          # the docs site with live reload
```

## Where things live

| Path | What |
| --- | --- |
| `packages/core` | All components, hooks, icons and formatters (`src/components`) |
| `packages/halo/css`, `packages/halo/tokens.json` | Halo's look; the source of truth for component CSS |
| `packages/pro` | Pro's tokens and look; most Pro CSS is derived from Halo by `scripts/pro-css.ts` |
| `packages/cli` | The CLI and the MCP server |
| `packages/elements` | Custom elements for plain HTML and other frameworks, generated from ui-core's props |
| `examples/previews` | One live example per docs page; descriptions of new components in `readme/` |
| `apps/docs` | The website; guides are Markdown in `apps/docs/content` |
| `e2e` | Playwright: axe, screenshots, mobile, control sizes, landing page, SEO |
| `reference/` | The original design references. Read-only. |

## Making a change

1. Branch from `main`.
2. Make the change in both kits when it touches the look. For a new component: the component in `packages/core`, its props in `types.ts`, CSS in Halo (Pro follows), an example in `examples/previews` and a description in `examples/previews/readme`.
3. Run the checks:

   ```sh
   pnpm check        # format, lint, typecheck, unit tests
   pnpm test:e2e     # the full browser suite
   ```

   Screenshot baselines are recorded on CI's runner image, because font rasterising differs between systems, so screenshot tests may differ by a few pixels of text width on your machine. If a change is meant to alter screenshots, run the **Update screenshots** workflow on your branch (Actions tab), download its artifact into `e2e/screenshots.spec.ts-snapshots` and review the images before committing.
4. Describe the change for the changelog: `pnpm changeset`.
5. Open a pull request. Keep it focused; one feature or fix per PR.

## Releases

Merging to `main` opens or updates a "Version packages" pull request. Merging that one publishes all five packages to npm together, with provenance.

## Questions

Open an [issue](https://github.com/twentyfirstmedia/ui/issues). By contributing you agree that your contributions are licensed under the [MIT license](LICENSE) and that you follow the [Code of Conduct](CODE_OF_CONDUCT.md).
