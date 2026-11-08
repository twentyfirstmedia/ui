# PnLStatement
GuV (profit and loss) per company and year: grouped rows, monthly columns, subtotals, tax estimates.

Built from the finance engine's statement rows. `tr.section` for groups (Erlöse, Aufwand), `tr.subtotal` with a `line-200` rule above for Rohertrag, Ergebnis vor Steuern, Jahresüberschuss. Month columns `.num`; the current month column header in `fg-100`. Every value is a link to the bookings behind it (trace). Estimated taxes are labelled "geschätzt".
