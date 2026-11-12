---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/ui": minor
"@twentyfirstmedia/elements": minor
---

Fluid layouts and root props.

- Every component now puts `className` and `style` on its root element (about 160 ignored one or both); a test renders every reference preview and checks it.
- Nothing pushes past its container: segmented controls, tabs and toggle groups shrink with ellipsis labels (`ToggleGroup block` is new); `MobileTabBar` shares its width evenly; the `TopBar` nav switches to icons as soon as its labels no longer fit, the account button cuts name and address with an ellipsis (the full text in `title`) and the search field shrinks; `CheckoutSteps` stay on one row and show numbers only when narrow (`compact` forces it); an `Alert`'s actions move under the text when narrow; chat source chips grow to two lines and take a `detail` tooltip; `RangeSlider` fields fit narrow columns.
- `TopBar` and `AppShell` take a node as `brand` (a logo mark with the name).
- `SideRail`: `expanded`/`defaultExpanded`/`onExpandedChange` show names next to the icons, `toggle` adds the button, every button has a real tooltip while collapsed.
- `Breadcrumb` (and `PageHeader crumbs`): items with `href` (with `linkAs`) or `onClick`, `onNavigate`, `label`; plain labels are no longer fake `#` links; 24px targets.
- `Pagination`: link mode (`href` per page, `linkAs`), `label`, previous/next disabled at the ends.
- `ListRow`: `href`/`linkAs`, `actions` outside the clickable area (no nested buttons), a non-interactive row without `onClick`/`href`, `titleLines`/`subtitleLines`.
- `SelectMenu size="sm"`; `Table stack` shows rows as labelled cards when the table is narrow.
