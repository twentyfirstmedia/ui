# Sidebar

App navigation down the side: groups with headings, counts and badges, one level of nested pages,
links, item menus and a collapsed mode with icons only.

- Three looks: `variant="floating"` (default, a card with a gap to the edge), `"attached"` (flush
  with the left edge, full height, a hairline to the content) and `"shell"` (on the dark frame;
  `AppShell navigation="sidebar"` uses it).
- Items with `href` render as links; pass your router's link as `linkAs` (Next.js `Link`, React
  Router `Link`). `external` opens in a new tab and says so to screen readers.
- Extras per item: `count`, `badge` (`"dot"` for new activity or a short word like `"New"`),
  `disabled`, `actions` (a "…" menu on hover and focus) and `items` for nested pages. Groups take
  `collapsible`, `defaultOpen` and an `action` such as "New project".
- A parent with `items` opens and shuts its pages. Give it an `href` as well when it is a page of
  its own (Orders with SMM Orders below it): its label becomes a link to that page and the chevron
  a separate button ("Show Orders pages" / "Hide Orders pages", from the strings `showPages` and
  `hidePages`) with `aria-expanded`. Tab reaches both. Opening the parent page or one of its
  children opens the parent, also when `current` changes later; parents the reader opened stay
  open. A parent without `href` keeps one button for the whole row. Collapsed, a click on the
  parent's icon opens its page, and hover or → shows the flyout with the parent page first, then
  its children.
- Collapsed, every label is a tooltip; a parent opens a flyout with its pages on hover, click or
  →. Pass `storageKey` to remember the state (also with a controlled `collapsed`: the stored value
  reaches `onCollapsedChange` on mount) and `shortcut` for ⌘B / Ctrl+B.
- `header` and `footer` take nodes or a function of `{ collapsed }`, e.g. a `WorkspaceSwitcher`
  and a `UserMenu` that turn compact.
- On phones (≤ 760px) the sidebar becomes an off-canvas drawer behind a menu button: Escape and the
  scrim close it, focus stays inside and returns to the button. Control it with `mobileOpen` and
  `onMobileOpenChange`.
- For filters, use `as="aside"`: items with `checked` become checkbox (or, with the group's
  `select: "single"`, radio) options with counts, and a group's `content` holds sliders or date
  fields. See the Filter Sidebar pattern.
