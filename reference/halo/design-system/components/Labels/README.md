The kit ships no fixed copy. Every visible string, aria-label and placeholder goes through `Halo.L()`, and numbers, money and dates through `Intl` with your locale.

- `Halo.setLabels(map, replace?)`: map from the built-in English text to yours, e.g. `{ "Copy": "Kopieren", "Remove {name}": "{name} entfernen" }`. Pass `replace: true` to swap the whole set (language switch).
- `Halo.setLocale(tag, { currency, weekStart })`: `"de-DE"`, `{ currency: "EUR", weekStart: 1 }`. Drives `formatMoney`, `formatNumber`, `formatDate`, the calendar's month and weekday names and MoneyInput's parsing.
- Placeholders in braces (`{name}`, `{n}`) are filled at runtime; `Halo.Lx()` does the same with React nodes.
- Most components also take explicit props for their main texts (`title`, `label`, `placeholder`, `approveLabel` …); props win over labels.
- The English built-ins exist only so previews read; ship your own map per app. `labels.json` in this folder lists every key.
