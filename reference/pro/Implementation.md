# Implementation

How to build the HQ app (Next.js, Tailwind, shadcn/ui) on this system.

## Tokens

- Generate CSS variables from `tokens.json` (the page compiles them to `tokens.css`: dark values on `:root, [data-theme="dark"]`, light values on `[data-theme="light"]`). Commit the generated file to the app; never hand-copy values.
- Theme switch sets `data-theme` on `<html>`; default `dark`, "System" follows `prefers-color-scheme`.
- Density switch sets `data-density="compact" | "comfortable"` on `<html>` and persists per user.

## Tailwind

Map tokens to the theme instead of using arbitrary values:

```ts
// tailwind.config.ts (excerpt)
colors: {
  bg: { 0: "var(--bg-000)", 1: "var(--bg-100)", 2: "var(--bg-200)", 3: "var(--bg-300)" },
  line: { 1: "var(--line-100)", 2: "var(--line-200)", 3: "var(--line-300)" },
  fg: { 1: "var(--fg-100)", 2: "var(--fg-200)", 3: "var(--fg-300)", 4: "var(--fg-400)" },
  accent: { DEFAULT: "var(--accent)", hover: "var(--accent-hover)", fg: "var(--on-accent)" },
  ok: { DEFAULT: "var(--ok)", bg: "var(--ok-bg)" },
  warn: { DEFAULT: "var(--warn)", bg: "var(--warn-bg)" },
  danger: { DEFAULT: "var(--danger)", bg: "var(--danger-bg)" },
  info: { DEFAULT: "var(--info)", bg: "var(--info-bg)" },
  signal: { DEFAULT: "var(--signal)", bg: "var(--signal-bg)" },
},
borderRadius: { none: "0", sm: "var(--radius-1)", full: "var(--radius-full)", DEFAULT: "var(--radius-1)" },
fontFamily: { sans: "var(--font-sans)", mono: "var(--font-mono)" },
boxShadow: { overlay: "var(--shadow-overlay)" },
```

Disable Tailwind's default palette (`colors` replaced, not extended) so off-system colors cannot sneak in.

## shadcn/ui

Use shadcn as the behavior layer (Radix primitives), restyled to this system:

- Set the shadcn CSS variables from these tokens (`--background` → `bg-000`, `--card`/`--popover` → `bg-100`, `--muted` → `bg-200`, `--accent` → `bg-300`, `--border` → `line-200`, `--input` → `line-300`, `--ring` → `focus`, `--primary` → `accent`, `--primary-foreground` → `on-accent`, `--destructive` → `danger`, `--radius` → `2px`).
- Remove default shadows from Card; Cards are replaced by `HairlineGrid` cells.
- Button heights follow density (`--hq-ctl`), table rows `--hq-row`.
- Command palette: `cmdk`. Toasts: `sonner`, restyled per the Toast component. Charts: a thin wrapper over Recharts or visx using only `chart-*` tokens.

## Icons

- `lucide-react` (pin the version), `strokeWidth={1.5}`, `size={16}` default.
- `@icons-pack/react-simple-icons` or the `simple-icons` package for brand marks, `color="currentColor"`.

## Fonts

`geist` npm package (`GeistSans`, `GeistMono` via `next/font`) in the app; Google Fonts in previews. Enable `font-variant-numeric: tabular-nums` on every numeric column.

## Component naming

Use the component names of this system (`ApprovalCard`, `AgentChat`, `LedgerTable` …) for the React components in the app, so agents and humans share one vocabulary. Each module package (`modules/<id>`) imports shared components from the UI package and may add module-specific ones following the same tokens.
