# ExportDialog

Export a table or a period as a file: format, period, columns, progress and the finished download.

- `formats`, `columns` (with `default: false` for opt-in columns), `ranges` and `count` shape the form;
  `onExport(options, progress)` does the work and may report progress and return a Promise.

**Accounting export (e.g. DATEV).** For bookkeeping exports the dialog adds what an accountant checks first:

- `check`: the pre-check: how many bookings go in, their sum (`currency`), the drafts left out, and your
  own lines (`items` with a tone).
- `missing`: settings the export needs (a consultant or client number, the chart of accounts …), each with
  a link (`href`, with `linkAs`) or `onClick` to fix it. While any is listed, Export stays off.
- `lockPeriod` adds "Lock the month with the export"; `onExport` then gets `lock: true | false`.
