---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/elements": minor
"@twentyfirstmedia/ui": minor
---

Files, finance and brand studio components.

New:

- `FileBrowser`: a folder as a grid or a list with breadcrumbs, search, an image or PDF preview drawer, upload by drop and picker with progress per file (also in parts), new folder, rename in place (F2), move through a folder picker, trash after a confirmation, the bulk action bar for a selection and keyboard paths. View, selection, search and preview work controlled or uncontrolled. `fileKindOf(item)` works out a file's kind.
- `InvoiceEditor`: customer picker, line items with quantity, unit, unit price, VAT rate (data, default 19 %, 7 %, 0 %) and discount, a discount on the whole invoice, totals per rate, beside a live `InvoicePreview` (tabs below 900px). Numbers are typed in the provider's locale.
- `invoiceTotals(lines, { discount })` and `roundMoney`: invoice sums rounded per line and once per VAT rate, for the editor, the preview and your server.
- `ImportSuggestions`: bank statement lines with a suggested category and booking, select all, an optional category picker, and the selection booked in one step (`onConfirm(ids)` with a pending state).
- `PeriodLock`: a month open or locked, with lock and unlock after a confirmation ("Confirm with passkey" with `stepUp`) and a pending state while your callback's Promise runs.
- `PaletteSwatches`: a palette as data with HEX and OKLCH (click to copy) and the WCAG contrast on light and dark. The maths is exported: `contrastRatio`, `wcagLevel`, `hexToOklch`, `formatOklch`, `relativeLuminance`, `parseHex`.
- `AssetCard`: a generated image or asset with its state (queued, generating, ready, failed), a watermark badge, a version stepper, make current, regenerate with a prompt and download.

Extended:

- `ExportDialog` gains the accounting export (e.g. DATEV): `check` (bookings, sum, drafts left out, own lines), `missing` settings with a link to fix them (Export stays off while any is listed, `linkAs` for router links) and `lockPeriod` ("Lock the month with the export", passed to `onExport` as `lock`).
- `InvoicePreview` takes a `discount` per line and on the whole invoice and now rounds VAT once per rate with `invoiceTotals`.
- The FilesScreen and InvoiceScreen patterns use `FileBrowser` and `InvoiceEditor`.
