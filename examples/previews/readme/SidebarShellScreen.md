# SidebarShellScreen

The app shell with a labelled sidebar instead of the icon rail: `AppShell navigation="sidebar"`.

- The sidebar sits on the dark frame, the page on the light sheet, with the side panel and dock as
  in every other shell.
- `sidebarGroups` takes the same groups as `Sidebar`; without it, `nav` becomes one group.
- `workspaces` puts a `WorkspaceSwitcher` at the top, `user` and `userMenu` a `UserMenu` at the
  foot; both turn compact when the sidebar collapses. Further `Sidebar` props go in `sidebar`
  (`storageKey`, `shortcut`, `linkAs`).
- On phones the sidebar becomes a drawer behind a menu button above the page.
