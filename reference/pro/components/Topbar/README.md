# Topbar
The 44px bar above every module: breadcrumbs, global search, density and theme switches, approvals.

Left: breadcrumbs (`fg-300` trail, current page `fg-100`). Center/right: the search trigger opens the CommandPalette (⌘K). Right: density SegmentedControl, theme toggle, approvals button with signal count, the user's avatar. Stays sticky (`z-sticky`). Density and theme apply to the whole HQ via `data-density` / `data-theme` on `html`.
