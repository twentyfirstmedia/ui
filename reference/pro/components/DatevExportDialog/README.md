# DatevExportDialog
Export bookings for the tax advisor: company, period, format, and a pre-check before the file is built.

Dialog with company and period (DatePicker presets: Monat, Quartal, Jahr), format (DATEV-Buchungsstapel CSV, mit Belegbildern), and a check list: unbooked suggestions, missing receipts, unassigned categories. Problems link to the filtered ledger. The export runs as a background job (Progress) and lands in the NotificationCenter.
