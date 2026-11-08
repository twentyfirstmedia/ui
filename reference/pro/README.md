HQ is the private cockpit of Twentyfirst Media Group: one web app for the agent city, approvals, webmail, domains, mail accounts, servers and finance. It is operated by two admins all day, on a laptop and on a phone. The design serves that: dense, fast, keyboard-first, calm. The only loud thing on screen is something that needs a human.

The look is **Clean Dark Pro**: monochrome surfaces divided by a visible 1px hairline grid, sharp corners, Geist and Geist Mono, color reserved for state. The 3D voxel city is the colorful counterpart; everything around it stays quiet.

## Content fundamentals

- **Language:** German is the default UI language, English is switchable. Write German UI copy; keep code, tokens and component names in English.
- **Address:** neutral and direct. Buttons are verbs in the infinitive ("Freigeben", "Entwurf senden", "Als Beleg verbuchen"), never "OK" or "Ja". Agents speak in the first person ("Ich gebe es an den Head of Content.").
- **Casing:** sentence case for titles, labels and buttons. Uppercase only through the `eyebrow` style (column headers, cell labels).
- **Numbers:** German format. Amounts `1.240,00 €` (symbol after, non-breaking space), negative with a real minus `−142,80`. Percent `82 %`. Time 24h `14:05`, dates `13.10.2026` or short `13.10.`, relative `vor 8 Min.`. All figures in `mono`/`num` with tabular digits.
- **Tone:** short, factual, specific. Say what happened and what to do: "SMTP 550 bei hello@jasondevine.de. Zugangsdaten prüfen." No apologies, no exclamation marks, no emoji.
- **Names:** call things what the admins call them: Stadt, Gebäude, Freigaben, Postfächer, Belege, Auslöser, Main Brain, Head Agent. Not "Workflows" or "Tickets".

## Visual foundations

**Color.** Monochrome. Surfaces climb a four-step ladder: `bg-000` canvas (and input wells), `bg-100` cells and panels, `bg-200` hover, `bg-300` selected. Text uses `fg-100` (primary), `fg-200` (secondary), `fg-300` (meta), `fg-400` (disabled/placeholder only). The accent is `fg-100` itself: primary buttons are the inverted surface (`accent` fill, `on-accent` text). Dark is the default theme; Light is a full equal.

**State colors** appear only for state, always with a shape: `ok` dot, `info` pulsing dot, `signal` diamond, `warn` triangle, `danger` square, idle ring in `fg-300`. `signal` (orange) means "a human is needed" and is the only hue allowed to draw the eye unprompted: approvals, beacons, the approval count. Never use `signal` for decoration or branding.

**Project colors.** Each project's CI color comes from its config and appears only as a small square (`hq-dotchip`, city plates) and inside the 3D city. UI surfaces never take brand colors.

**Hairline grid.** Layout is cells that touch, separated by 1px `line-200` hairlines (`HairlineGrid`). No floating cards, no gaps between panels, no drop shadows on in-flow elements. `line-100` separates rows inside a cell. `line-300` (3:1) is reserved for control borders and crosshair marks. Crosshair marks frame at most one region per screen.

**Shadows** exist only on floating layers (menus, dialogs, sheets, toasts, palette, city HUD): `shadow-overlay` plus a `line-200` border.

**Radius.** `radius-0` for everything structural, `radius-1` (2px) for controls, `radius-full` only for status dots and radios. Avatars are square.

**Type.** Geist for UI, Geist Mono for numbers, IDs, addresses, code, timestamps and eyebrows. Compact density uses `body-sm` (13/18) as the base, comfortable uses `body` (14/20). One `display` per screen at most. Headings use `text-wrap: balance`.

**Density.** Two modes, switchable per user in the top bar and stored per user: compact (default; rows and controls 28px) and comfortable (rows 36px, controls 34px). Set `data-density` on `html`; components read `--hq-row`, `--hq-ctl`, `--hq-pad-x`, `--hq-fs`.

**Spacing.** 4px base (`space-1` … `space-16`). Cell padding `space-4`, overview cells `space-6`, dialog bodies `space-5`. Layout gaps come from the hairline grid, not from margins.

**Motion.** Minimal and fast: `duration-fast` (90ms) for hover/press, `duration-base` (140ms) for overlays entering, one curve `ease-standard`. Only two loops exist: the running pulse and skeletons. Everything honors `prefers-reduced-motion`.

**Focus.** Every interactive element shows a solid 2px `focus` outline with 1px offset (≥3:1 on all surfaces in both themes). Inputs show a 1px ring plus `focus` border.

**Charts.** Monochrome: `chart-1` for the series that matters, `chart-2` for comparison, `chart-grid` gridlines, labels in `mono-sm` `fg-300`. Status color only for a threshold.

**Documents.** Invoices and PDFs render on `paper` with `paper-ink` in both themes.

## Iconography

- **Lucide** for all UI icons: 16px (`icon-md`), 14px (`icon-sm`) in badges and dense cells, stroke 1.5, `currentColor`.
- **Simple Icons** for brand and social marks (Instagram, WhatsApp, TikTok, Stripe, PayPal, DATEV, Cloudflare, Hetzner, AWS, Google Cloud, Vercel, GitHub …), monochrome in `currentColor`. Reference copies are in the "Brands" asset group.
- Approvals use Lucide `diamond`, matching the signal shape. No emoji anywhere.

## Layout and breakpoints

- ≥ 1100px: AppShell with expanded sidebar (`sidebar-w`).
- 768–1099px: sidebar collapses to icons (`sidebar-w-collapsed`).
- < 768px: MobileTabBar replaces the sidebar; Sheets become full-screen; ApprovalCard options sit at the bottom within thumb reach. Inputs use 16px text to avoid iOS zoom.
- Page gutter `space-4` on phones, `space-6` above.

## Logo

There is no drawn wordmark: set "HQ" in type (`Wordmark`). The square app icon in the Logos group is for PWA and iOS home screens and favicons; `hq-icon-dark.svg` on dark grounds, `hq-icon-light.svg` on light grounds.
