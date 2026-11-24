# DataTable

Table with the features list pages need: sorting, row selection with a bulk action bar, column toggles, sticky header and expandable rows. `FilterBar` sits above it.

DataTable props: `columns` ({key, label, render, align, sortable, sortValue(row), hideable, hidden, width}), `rows`, `rowKey` ("id"), `selectable`, `bulkActions` ({label, icon, danger, onClick(rows, clear)}), `renderExpanded(row)`, `stickyHeader`, `maxHeight`, `defaultSort` ({key, dir}), `toolbar`, `columnToggle` (false hides), `empty`.
FilterBar props: `filters` ({key, label, icon, options}), `value` / `onChange` ({key: option}), `search` (placeholder), `query` / `onQuery`, `right`.

- Sort cycles ascending → descending → off; the arrow only shows on the sorted or hovered column.
- The bulk bar floats at the bottom of the table while rows are selected; destructive actions are red and go through an Undo toast or ConfirmDialog.
- Active filters are ink chips you can click to change or × to remove. "Clear all" appears from two filters on.
- The header checkbox shows a dash when some, not all, rows are selected.
- Put it in `tf-panel tf-panel-flush` so cells line up at 24px with other panels.

Since 0.10 it can also do what admin lists need on top of that:

- **Rows as links**: `rowHref(row)` (and `linkAs` for a router link) makes the first cell the row's
  link and the whole row clickable, except its own checkboxes, links, buttons and inputs.
  ⌘/Ctrl-click and middle-click open the row in a new tab; Tab reaches the link and Enter opens it.
  `onRowClick(row, event)` runs on a click (and, without `rowHref`, on Enter on the focusable row).
- **Controlled sort**: with `sort` and `onSortChange` the table draws the sort but leaves the order
  to you, e.g. across all pages or on the server. `defaultSort` keeps sorting it in the table.
- **Controlled selection**: `selected` (row keys) and `onSelectedChange`, so a selection survives
  paging and can be cleared from outside. `bulkActions` still receive the selected rows.
- **Range selection**: a row checkbox toggles its row and becomes the anchor; Shift+click (or
  Shift+Space on a focused checkbox) selects every row between the anchor and the clicked one in
  the order shown on the page, or clears them when the anchor is cleared. Works controlled and in
  `stack`.
- **`stack`**: up to 600px of its own width every row becomes a card with its column labels.
- **Paging**: `pageSize` pages the rows and shows `Pagination` under the table with the range;
  `pageSizes` adds a page-size menu; `page`/`onPageChange` control the page. For server-side
  paging pass `rowCount` (all rows) and only the current page as `rows`.

```tsx
import Link from "next/link";

const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
const [selected, setSelected] = useState<(string | number)[]>([]);
const [page, setPage] = useState(1);
const { rows, total } = useOrders({ sort, page, pageSize: 50 }); // sorted and paged on the server

<DataTable
  columns={columns}
  rows={rows}
  rowCount={total}
  pageSize={50}
  page={page}
  onPageChange={setPage}
  sort={sort}
  onSortChange={setSort}
  selectable
  selected={selected}
  onSelectedChange={setSelected}
  rowHref={(order) => `/admin/orders/${order.id}`}
  linkAs={Link}
  stack
/>
```
