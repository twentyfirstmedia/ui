---
"@twentyfirstmedia/ui-core": minor
---

Every built-in string is overridable, and numbers follow a locale.

- `UIProvider messages`: replace any text a component shows on its own (accessible names such as "Close", "Send", "Previous image", "Select row", button texts, placeholders, status words, validation messages). Partial and nested; props such as `title` or `label` still win. English stays the default and no translations ship. `useUIStrings()`, `DEFAULT_STRINGS`, the `UIStrings` and `UIMessages` types, and one exported group per component file (`MEDIA_STRINGS` …).
- `UIProvider locale` (BCP 47, default `en-US`): every number, amount, percentage and date in components, calendar month and weekday names. `useFormat()` returns the helpers bound to it; `formatNumber`, `formatMoney`, `formatPercent` and `formatDate` take an optional locale as their last argument.
- `CountUp` and `StatTile` read string values in the provider locale ("13,05 €/m²" in de-DE counts to 13.05 instead of showing "1,305"). New helpers `parseFormatted`, `formatLike`, `numberSeparators`.
- `SearchField` takes `label` (accessible name).
- Fixed: `VoiceMode` with `stateLabel` showed "Listening…".
