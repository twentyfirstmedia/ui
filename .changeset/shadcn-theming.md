---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/ui": minor
---

shadcn-style theming in both kits. The kits use shadcn/ui's theme variables (`background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `radius`, `chart-1` … `chart-5`, `sidebar-*`) and every component reads them, so a pasted shadcn theme restyles everything, light and dark. The old `--accent`/`--on-accent`/`--accent-hover` are now `--primary`/`--primary-foreground`/`--primary-hover`; `--accent` is the highlight under the pointer, as in shadcn. Token blocks have zero specificity and dark mode also follows the `.dark` class. New: `themeCss`, `parseThemeCss`, `brandTheme`, `THEME_PRESETS` and preset CSS files (`themes/blue.css` …), `UIProvider tokens`, `twentyfirst-ui theme`, Tailwind utilities with shadcn's names.
