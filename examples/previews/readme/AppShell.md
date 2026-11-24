# AppShell

The frame of an app: navigation on the frame (a sidebar with `navigation="sidebar"`, or a top bar)
and the page on a sheet beside it, with an optional side panel and dock.

- `sidebarGroups`, `active` and `onNavigate` drive the sidebar; `workspaces` puts a workspace switcher
  and `user` with `userMenu` a user menu on it.
- The shell reflows by its own width (container queries), so it also works inside a smaller area.
- `fill` makes the shell the whole page: at least the viewport's height (`100dvh`), no outer radius,
  the sheet takes the rest of the height. On desktop the sidebar stays in view while the page
  scrolls; on phones the sheet starts right under the sidebar's bar.
- `brandDot={false}` drops the status dot after the brand, e.g. next to a logo of your own.
- With `fill` the page itself scrolls and the sidebar (and the top bar) stick to it. Do not put
  `overflow-x: hidden` on `html` or `body`: it turns `body` into a scroll container that never
  scrolls, and the sticky parts scroll away with the page. Use `overflow-x: clip` to cut off
  sideways overflow instead.

```tsx
// app/admin/layout.tsx: the shell is the page
<AppShell fill navigation="sidebar" brand="Admin" sidebarGroups={groups} active={section}
  user={{ name, email }} dock={false}>
  {children}
</AppShell>
```

## Top bar

`topbar` adds a bar across the top of the frame in sidebar mode. The brand (or `workspaces`) moves
into its start and is exactly as wide as the sidebar below it, expanded or collapsed, so both read
as one column. `topStart` follows the brand (a `SearchField` or a command palette trigger), `topEnd`
sits at the end (buttons, menus). Frame, bar and sidebar form one L around the sheet; the sheet
starts under the bar, rounded where it meets them.

- With `fill` the bar and the sidebar stay in view while the sheet scrolls under the bar.
- On phones the bar is the sidebar's bar (menu button and brand) with `topEnd` on the right.
  `topStart` sits behind an icon button (`topStartIcon`, `topStartLabel`) and opens over the bar;
  Escape closes it. Pass `topStartCompact` to show something else there, e.g. an `IconButton`
  that opens your command palette.
- Content given to `topbar` itself goes between `topStart` and `topEnd`. `topExtra` goes to the
  bar's end; without the bar it stays at the top of the sheet as before.
- On glass the bar sits on the glass frame like the sidebar: frame, bar and sidebar are one pane.
  With `fill` the sheet scrolls under the bar, so the bar blurs what passes under it
  (`--glass-blur`) without adding a tint of its own. For that the pane is drawn on a layer behind
  the shell's content rather than on the shell itself (a backdrop-filter on the shell would make
  every filter inside it see only the shell).
- On phones the sidebar opens as a drawer over the page; on glass it blurs what lies under it
  (`--glass-filter`), so the page never shows sharply through the menu.

```tsx
<AppShell fill navigation="sidebar" topbar brand="Admin" sidebarGroups={groups} active={section}
  topStart={<SearchField placeholder="Search orders" shortcut="⌘K" bindShortcut />}
  topEnd={<><IconButton icon="bell" label="Notifications" variant="ghost" /><Button size="sm" variant="secondary">New order</Button></>}
  user={{ name, email }} dock={false}>
  {children}
</AppShell>
```
