---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/elements": minor
"@twentyfirstmedia/ui": minor
---

AppShell: a top bar on the frame in sidebar mode. `topbar` adds a bar across the top; the brand (or `workspaces`) moves into its start and is exactly as wide as the sidebar below it, expanded or collapsed, `topStart` follows it (a search field or palette trigger), `topEnd` sits at the end and `topExtra` joins it. Frame, bar and sidebar form one L around the sheet (Halo: the dark frame, the sheet rounded where it meets them; Pro: bg-100 with a hairline to the sheet). With `fill` bar and sidebar stay in view while the sheet scrolls. On phones the bar is the sidebar's bar with `topEnd` on the right and `topStart` behind an icon button that opens it over the bar (`topStartIcon`, `topStartLabel`, or your own `topStartCompact`). On glass the bar sits on the glass frame. Without `topbar` nothing changes.
