# AppShell
The HQ frame: sidebar, topbar and main area, all divided by hairlines.

`.hq-shell` is a HairlineGrid with `sidebar-w` + 1fr columns and a `topbar-h` row. The main area sits on `bg-000` so its own HairlineGrid cells (`bg-100`) stand out. Below 768px the sidebar is replaced by the MobileTabBar and the topbar keeps breadcrumbs + search icon + approvals.
