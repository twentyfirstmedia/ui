---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/ui": minor
"@twentyfirstmedia/elements": minor
---

DataTable for admin lists, and a bridge for apps moving from shadcn/ui:

- **Rows as links**: `rowHref(row)` and `linkAs` make the first cell the row's link and the whole row clickable (except checkboxes, links, buttons and inputs inside); ⌘/Ctrl-click and middle-click open a new tab, Tab and Enter work. `onRowClick(row, event)` for rows that open something else; without `rowHref` the row is focusable and opens with Enter. Hover and focus styles in both kits.
- **Controlled sort**: `sort` and `onSortChange`; when controlled the table draws the sort but leaves the order to the caller (all pages, server). `defaultSort` keeps working.
- **Controlled selection**: `selected` (row keys, also of rows on other pages) and `onSelectedChange`; `bulkActions` still receive the rows.
- **`stack`**: up to 600px of its own width every row becomes a card with its column labels; checkbox and row link keep working. Cells without a label (checkbox, expand, actions) no longer get an empty label in `Table`'s and `DataTable`'s stacked cards.
- **Paging**: `pageSize` with `Pagination` and the row range under the table, `pageSizes` for a page-size menu, `page`/`defaultPage`/`onPageChange`, and `rowCount` for server-side paging.
- **`@twentyfirstmedia/ui-core/shadcn.css`**: dresses shadcn/ui primitives in the active kit by their `data-slot` attributes (buttons with `data-variant`/`data-size`, inputs, textareas, selects, cards, badges, tables, tabs, dialogs, alert dialogs, sheets, dropdown menus, popovers, tooltips, checkboxes, switches, labels, separators, progress, alerts, skeletons), only inside `[data-kit]`, unlayered so it wins over Tailwind's utilities, glass included. `data-kit-colors="status"` maps Tailwind's colour scale to the kit's status colours. New guide "Moving from shadcn/ui".
