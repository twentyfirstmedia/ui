---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/elements": minor
"@twentyfirstmedia/ui": minor
---

Sidebar: parents that are pages themselves. A `SidebarItem` with `items` and an `href` now splits: its label (icon, label, count, badge) is a link to `href` (with `linkAs`, calling `onPick`), and the chevron is its own button that shows and hides the pages below it (`aria-expanded`, `aria-controls`, named "Show Orders pages" / "Hide Orders pages" from the new strings `showPages` and `hidePages`). Tab reaches both. The parent is current on its own page and shows "contains the current page" when a child is. Opening a parent page or one of its children opens the parent, also when `current` changes later, without shutting parents the reader opened. Collapsed, a click on the parent's icon opens its page and hover or → shows the flyout with the parent page first, then its children. In the phone drawer the label navigates and closes the drawer, the chevron only toggles. Parents without `href` keep one button for the whole row.
