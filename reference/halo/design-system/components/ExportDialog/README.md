Exporting a filtered list: format, period, columns, progress and download.

Props: `open` / `onClose` (or `inline`), `title`, `text`, `count`, `formats`, `columns` ({key, label, default: false = off}), `ranges` (false hides the period), `range`, `note`, `onExport(options, progress)` (return a promise; call `progress(0–100)`), `onDownload` or `download` (node), `doneText`.

- Columns with personal data start unchecked.
