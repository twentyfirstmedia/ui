Table with the features list pages need: sorting, row selection with a bulk action bar, column toggles, sticky header and expandable rows. `FilterBar` sits above it.

DataTable props: `columns` ({key, label, render, align, sortable, sortValue(row), hideable, hidden, width}), `rows`, `rowKey` ("id"), `selectable`, `bulkActions` ({label, icon, danger, onClick(rows, clear)}), `renderExpanded(row)`, `stickyHeader`, `maxHeight`, `defaultSort` ({key, dir}), `toolbar`, `columnToggle` (false hides), `empty`.
FilterBar props: `filters` ({key, label, icon, options}), `value` / `onChange` ({key: option}), `search` (placeholder), `query` / `onQuery`, `right`.

- Sort cycles ascending → descending → off; the arrow only shows on the sorted or hovered column.
- The bulk bar floats at the bottom of the table while rows are selected; destructive actions are red and go through an Undo toast or ConfirmDialog.
- Active filters are ink chips you can click to change or × to remove. "Clear all" appears from two filters on.
- The header checkbox shows a dash when some, not all, rows are selected.
- Put it in `ha-panel ha-panel-flush` so cells line up at 24px with other panels.
