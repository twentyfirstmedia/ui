---
"@twentyfirstmedia/ui-core": patch
"@twentyfirstmedia/halo": patch
"@twentyfirstmedia/pro": patch
"@twentyfirstmedia/elements": patch
"@twentyfirstmedia/ui": patch
---

AppShell and Sidebar fixes from the FollowerPilot admin:

- Glass top bar: with `fill` on glass the bar was an almost opaque band next to the sidebar. The shell's backdrop-filter made it the backdrop root of the bar, so the bar's own glass painted the shell's tint a second time. The pane of a filling shell with a top bar is now drawn on a layer behind the shell's content; the bar adds no tint and only blurs what scrolls under it (new token `--glass-blur`). Bar and sidebar look the same at the top and with content under the bar, in both kits, light and dark; glass cards inside the shell look as before. The L also drops the top-edge sheen, which lit the bar but not the sidebar.
- Sidebar `storageKey` no longer overwrites the stored state on mount: with a controlled `collapsed`, or under StrictMode, the sidebar came back expanded after a reload.
- `brandDot={false}` on AppShell (and TopBar) drops the status dot after the brand.
- Docs: with `fill`, use `overflow-x: clip` instead of `hidden` on `html`/`body`, or the sticky bar and sidebar scroll away.
