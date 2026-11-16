# QuoteBuilder

A quote or proposal: line items with quantity, unit, unit price and discount, optional extras the
customer ticks on, and the subtotal, discounts, VAT and total worked out as you type.

- `onChange(lines)` makes quantity, price and discount editable and optional lines tickable;
  without it the quote is read only. `onAdd` and `onRemove` add and remove lines.
- `taxRate` in percent adds the VAT row. Money goes through `Intl` in `currency`.
- Optional lines that are not ticked stay visible but are struck through and not counted.
