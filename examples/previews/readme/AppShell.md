# AppShell

The frame of an app: navigation on the frame (a sidebar with `navigation="sidebar"`, or a top bar)
and the page on a sheet beside it, with an optional side panel and dock.

- `sidebarGroups`, `active` and `onNavigate` drive the sidebar; `workspaces` puts a workspace switcher
  and `user` with `userMenu` a user menu on it.
- The shell reflows by its own width (container queries), so it also works inside a smaller area.
- `fill` makes the shell the whole page: at least the viewport's height (`100dvh`), no outer radius,
  the sheet takes the rest of the height. On desktop the sidebar stays in view while the page
  scrolls; on phones the sheet starts right under the sidebar's bar.

```tsx
// app/admin/layout.tsx: the shell is the page
<AppShell fill navigation="sidebar" brand="Admin" sidebarGroups={groups} active={section}
  user={{ name, email }} dock={false}>
  {children}
</AppShell>
```
