---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/ui": minor
---

English only: the label system, the German label set and the locale props are removed; numbers, money, percentages and dates format with Intl in en-US (`formatNumber`, `formatMoney`, `formatPercent`, `formatDate`). `init --locale` is gone.

New components in both kits: Accordion, Separator, AspectRatio, Label, Toggle, ToggleGroup, ButtonGroup, ScrollArea, HoverCard, Carousel, Menubar, NavigationMenu, Sidebar, SelectMenu, Form and ResizablePanels. Menu gains keyboard navigation, typeahead, submenus, checkbox/radio and disabled items; Tabs render panels; Drawer takes `side`; Popover flips when there is no room; CommandPalette takes `loading`, `empty` and `onQueryChange`; Button and IconButton take `asChild`; inputs take `id`, `name` and `required`.
