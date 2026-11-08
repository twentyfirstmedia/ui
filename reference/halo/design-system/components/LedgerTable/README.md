Bookkeeping: `LedgerTable` (bookings with project and agent suggestions), `PnLStatement` and `ReceiptSuggestion`.

LedgerTable: `rows` ({id, date, ref, text, category, project, projectTint, net, vat, gross, suggested, status, statusLabel}), `categories` (makes the category editable in place) + `onEdit(row, change)`, `currency`, `selectable`, `bulkActions`, `toolbar`, `maxHeight`.
PnLStatement: `columns` (months), `rows` ({kind: "section" | "subtotal" | "total", label, values}), `currency`, `total` (false hides it).
ReceiptSuggestion: `file`, `source`, `fields` ({label, value, mono, confidence 0–1}), `suggestion`, `onConfirm`, `onDiscard`, `confirmLabel`, `discardLabel`, children.

- Agent suggestions carry the signal diamond until a person confirms them.
- Negative amounts are blush; amounts use the locale's currency format.
