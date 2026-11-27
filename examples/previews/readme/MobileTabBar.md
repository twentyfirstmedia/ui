# MobileTabBar

The tab bar along the bottom of a phone app: up to five tabs with an icon, a label and a count.

- Tabs with an `href` are links (through `linkAs` or `UIProvider linkAs`); `active` marks the current one, `onPick` is called with its id.
- `countTone: "signal"` draws a count in the signal colour, e.g. approvals waiting for you.
- `more` lists the pages that do not fit: a "More" tab opens them in a bottom sheet, grouped by their `group`, and shows as current while one of them is. Its badge adds up their counts.
- It keeps clear of the home indicator (`env(safe-area-inset-bottom)`).
- `AppShell` shows one on phones with `tabBar`, built from its pages.
