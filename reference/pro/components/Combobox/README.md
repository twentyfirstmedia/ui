# Combobox
Searchable single or multi select for long lists: agents, domains, mailboxes, tools, projects.

- Field `hq-chipfield`: selected values as `hq-chip` with a remove button, then a text input that filters.
- Listbox `hq-layer hq-menu` below: matches grouped by eyebrow, matched text in `fg-100`, a check on selected rows, the active row `bg-300`.
- Backspace in an empty input removes the last chip. Enter toggles the active row. Esc closes.
- For fixed lists under ~8 items use Select or Checkbox instead.
