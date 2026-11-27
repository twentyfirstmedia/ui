# InvoiceEditor

An outgoing invoice as a form beside the InvoicePreview it becomes: customer picker, line items with
quantity, unit, unit price, VAT rate and discount, a discount on the whole invoice, the note and the
totals per rate. The preview updates as you type; below 900px wide the form and the preview become tabs.

- `value` / `onChange` (or `defaultValue`) hold the draft: `customer`, `lines` (`id`, `description`,
  `quantity`, `price`, `vat`, `discount`, `unit`), `discount` and `note`.
- `vatRates` are data (default 19 %, 7 % and 0 %): pass your country's rates. `units` adds the unit column.
- Sums come from `invoiceTotals(lines, { discount })`: each line rounded to cents, VAT once per rate on
  the rate's net. Run the same function on your server and the numbers match to the cent.
- Numbers are typed in the provider's locale (`1,5` in German) and money is formatted with `Intl`.
- `preview` passes InvoicePreview's own props (number, from, dates, brand); `preview={false}` hides it.
  `head` adds fields at the top, `actions` the buttons under the totals.
