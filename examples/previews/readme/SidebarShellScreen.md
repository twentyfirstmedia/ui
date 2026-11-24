# SidebarShellScreen

The standard app frame: `AppShell navigation="sidebar"` with `topbar`.

- The top bar carries the workspace switcher above the sidebar, a `SearchTrigger` that opens the
  `CommandPalette` (⌘K) and the `AppearanceMenu`; the sidebar sits below it on the frame, the page on
  the sheet beside it, with a side panel and no dock.
- `sidebarGroups` takes the same groups as `Sidebar`; without it, `nav` becomes one group.
- `workspaces` puts a `WorkspaceSwitcher` where the brand goes, `user` and `userMenu` a `UserMenu`
  at the foot of the sidebar; both turn compact when the sidebar collapses. Further `Sidebar` props
  go in `sidebar` (`storageKey`, `shortcut`, `linkAs`).
- The app sits in an `AppearanceProvider`, so the look the reader chooses stays.
- On phones the sidebar becomes a drawer behind a menu button, and the search an icon button.
