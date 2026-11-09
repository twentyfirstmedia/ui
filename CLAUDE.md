# CLAUDE.md

Twentyfirst UI: two React UI kits with one component API, published as public, MIT-licensed npm packages, plus a docs site and an MCP server for coding agents.

- **Halo** (`@twentyfirstmedia/halo`): soft, rounded, light-first. The gold standard; its look and behaviour are defined by `reference/halo/`.
- **Pro** (`@twentyfirstmedia/pro`): sharp, dense, hairline grid, dark-first. Same components, props and markup as Halo; only tokens and CSS differ. Its look comes from `reference/pro/`.
- Docs site: `ui.twentyfirst.media/halo` and `/pro` (later maybe `twentyfirst.design`).

The kits are independent of any app. HQ, FollowerPilot and Capitaso adopt them later in their own repos; nothing here imports from or mentions those apps in shipped code.

## Start here

1. Read `docs/PLAN.md` (architecture, decisions, phases with checkboxes).
2. Work on the first open phase. One phase (or a clearly cut part of it) = one branch = one PR with a short summary in German. Merge your own PR when CI is green, then continue.
3. Tick the phase's checkboxes in `docs/PLAN.md` in the same PR.
4. Ask Robin only for things you cannot decide: accounts and tokens, DNS, money, legal.

## Rules

- **Reference is the spec.** For behaviour and API, `reference/halo/source/halo.js` and `reference/halo/design-system/components/index.d.ts` win; for the look of each kit, its reference CSS/tokens win. Port faithfully, improve only where the plan says so. `reference/` is read-only.
- **One API, two looks, always 1:1.** Components live once in `packages/core`. They never branch on the kit in JS. Kits differ only in tokens and CSS, and every component, class and token exists in both. An app can load both and switch at runtime via `data-kit`. A parity test enforces this; a change to one kit's CSS without the other fails CI.
- **English by default.** The kits are UI kits, not localisation frameworks: built-in text is plain English and no translations ship. Main texts stay overridable through props such as `title`, `placeholder`, `label`; every other built-in string comes from `useStrings` (defaults in `packages/core/src/strings.ts`, one group per component file) so apps can replace it with `UIProvider messages`. Never hard-code a new string in a component. Numbers, money, percentages and dates go through `Intl` (`formatNumber`, `formatMoney`, `formatPercent`, `formatDate`, or `useFormat()` in components; en-US and euros by default, `UIProvider locale` for others).
- **No colour literals** in component CSS: tokens only. Tokens are generated from `tokens.json` per kit. Tailwind v4 preset via `@theme`, no arbitrary values in kit code.
- **Privacy:** fonts are self-hosted (no Google Fonts CDN), no telemetry (`NEXT_TELEMETRY_DISABLED=1`, `TURBO_TELEMETRY_DISABLED=1`), no external requests from components.
- **Accessibility:** keyboard paths, focus rings and aria as in the reference; axe must pass for every docs preview.
- TypeScript strict, ESM only, React 19, exact versions pinned for fast-moving deps. English for code, comments and docs; German for PR summaries and `docs/PLAN.md` notes.
- Never commit secrets. The npm token (npmjs.com) lives in Actions secrets only (`NPM_TOKEN`).

## Commands (once phase 0 exists)

| Command | Purpose |
|---|---|
| `pnpm install` | install |
| `pnpm dev` | docs site in watch mode |
| `pnpm check` | format check, lint, typecheck, unit tests |
| `pnpm test:e2e` | Playwright: axe + screenshots of every preview, both kits, light/dark, 390/1440 |
| `pnpm tokens` | regenerate token CSS and Tailwind theme from `tokens.json` |
| `pnpm changeset` | describe a change for the next release |
