# BulkActionBar

The bar for selected items: how many are selected, "Clear" and the actions that work on all of them. DataTable shows it for its own selection; on its own it serves mail lists, file browsers and any list with checkboxes.

- `count` hides the bar at 0; `onClear` shows "Clear".
- `actions`: label, icon, `danger`, `disabled`. Extra controls (a menu) go in `children`.
- Floats sticky at the bottom of its scroll area by default; `floating={false}` keeps it in the flow, e.g. above a list.
