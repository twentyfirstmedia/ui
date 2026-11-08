# Badge
Small label for categories, counts and metadata: Projekt, Familie, DNS-Typ, Kontoname.

- default: `bg-200` fill, `fg-200` text, `line-200` border.
- `--mono` for codes (MX, TXT, RE-2026-0142, claude-sonnet-5-5).
- `--outline` for low-emphasis metadata.
- status variants (`--ok --warn --danger --info --signal`) tint with the matching `*-bg` and always carry a StatusIndicator shape.
- `.hq-count` is a numeric badge (nav counts); `.hq-count--signal` only for open approvals.
- `.hq-dotchip` = a project's CI color square + name. CI colors are data from the project config, the only place brand colors enter the UI.
