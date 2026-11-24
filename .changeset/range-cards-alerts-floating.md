---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/elements": minor
"@twentyfirstmedia/ui": minor
---

Four improvements from the FollowerPilot admin:

- DataTable: Shift+click range selection. A row checkbox toggles its row and becomes the anchor; Shift+click (or Shift+Space) selects every row between the anchor and the clicked one in the order shown on the page, or clears them when the anchor is cleared. Works with controlled `selected` and in `stack`.
- shadcn bridge, Card: v3's padded parts (p-6, pt-0) and v4's gap look the same; the parts keep only their side padding and the card spaces them with the kit's gap.
- shadcn bridge, Alert: the kit's status colours by tone. `data-variant="destructive"`, `data-tone="danger"` or shadcn's `text-destructive` class draw danger, `data-tone="warning"` warn and `data-tone="success"` ok, the rest info. The icon takes the alert's colour; on glass an alert is a translucent tint of its tone with a thin edge.
- `<UIProvider floating="solid">` (or `data-floating="solid"`): on glass, menus, popovers, select lists, hover cards, the navigation menu, the bulk action bar and the bridged dropdown, select, popover and context menu contents stay solid (the popover colour, no blur). Dialogs, drawers and the command palette keep their glass.
