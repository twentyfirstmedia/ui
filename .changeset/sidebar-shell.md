---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/ui": minor
"@twentyfirstmedia/elements": minor
---

Sidebar overhaul and an app shell with a sidebar.

- `Sidebar`: `variant` (`floating`, `attached`, `shell`); links with `href`, `linkAs` and `external`; `badge` (`"dot"` or a word), `disabled`, item `actions` ("…" menu); collapsible groups with an `action`; tooltips and flyouts when collapsed; `storageKey` and `shortcut` (⌘B / Ctrl+B); an off-canvas drawer on phones (`mobileOpen`, `onMobileOpenChange`); `header`/`footer` as a function of `{ collapsed }`.
- Fixed: more room between a group heading and a selected first item; counts no longer jump to the corner in narrow shells.
- New `UserMenu`; `WorkspaceSwitcher` takes `compact`.
- `AppShell navigation="sidebar"` with `sidebarGroups`, `workspaces`, `userMenu` and `sidebar`.
