---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/ui": minor
"@twentyfirstmedia/elements": minor
---

An icon library: 567 more icons in the kit's style, from passkeys and security to social and brand logos, files, media, commerce, places, home and health.

- `@twentyfirstmedia/halo/icons` (and `/pro/icons`, `@twentyfirstmedia/ui-core/icons`) exports each icon by name: `fingerprint`, `scanFace`, `keyRound`, `shieldCheck`, `brandX`, `brandInstagram`, `brandGithub` … Register what you use once with `registerIcons({ fingerprint, brandGithub })` (or `registerIcons(ICON_LIBRARY)`), then use the names in `Icon` and every `icon` prop. Only registered icons are bundled.
- Line icons are drawn on the kit's 24px grid with 2px round strokes (from Lucide, ISC); brand logos are filled (from Simple Icons, CC0). Licence notices ship in `ICONS-LICENSE`.
- Your own icons: `registerIcons({ acme: "M…" })`, typed through the `CustomIcons` interface. The 93 built-in icons work as before and cannot be replaced.
- An unknown icon name now logs a warning once instead of silently drawing a placeholder.
- `@twentyfirstmedia/elements` registers the whole library, so `<tf-button icon="fingerprint">` works in plain HTML; it also exports `registerIcons`.
- New docs page "Icons": every icon with search, categories and copy on click. The MCP server's `list_icons`, `search_docs` and `check_usage` know the library.
