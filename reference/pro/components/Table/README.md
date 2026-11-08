# Table
Dense data table: the workhorse for ledgers, DNS records, triggers, agents and mail lists.

**Rules**
- Row height follows density (`row-dense` 28px / `row-comfy` 36px). Column headers in `eyebrow` style, sticky.
- Row separators `line-100`; the header rule `line-200`. `.hq-table--grid` adds vertical hairlines for spreadsheet-like data (finance).
- The row's key column `.key` in `fg-100`; other cells `fg-200`.
- Numbers: `.num` (mono, tabular, right-aligned). Negative amounts `.neg` in `danger` with a minus sign, never parentheses alone.
- Hover `bg-200`; selected `aria-selected="true"` → `bg-300`. Selection checkbox column `.sel`.
- Wrap in `.hq-tablewrap` for horizontal scroll on narrow screens.
- `tfoot` for totals, `tr.subtotal`, `tr.section` for grouped statements.
