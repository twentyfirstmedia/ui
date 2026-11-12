# FilterSidebarScreen

Results with their filters in a sidebar: `Sidebar as="aside"` turns the navigation into a
complementary region for tools beside the content.

- Items with `checked` and `onCheckedChange` are filter options with their `count`; in a group with
  `select: "single"` they are radios (one choice).
- `content` puts anything into a group: a `RangeSlider`, date fields, chips.
- Groups stay collapsible; `collapsible` (default false for an aside) hides the icons-only mode.
- On phones the filters open as a drawer behind a filter button.
