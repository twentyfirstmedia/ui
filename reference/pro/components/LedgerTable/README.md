# LedgerTable
Bookings for a company and period, with project allocation and agent suggestions awaiting confirmation.

`.hq-table--grid` with vertical hairlines. Columns: Datum (mono), Beleg-Nr. (mono), Beschreibung, Kategorie, Projekt (CI dot), Netto, USt, Brutto (all `.num`), Status. Agent suggestions show "Vorschlag" (signal) with a one-click confirm; confirmed bookings "Gebucht" (ok). Expenses negative in `danger` with minus sign. Footer totals. Filters above: Firma, Zeitraum, Projekt, Status.
