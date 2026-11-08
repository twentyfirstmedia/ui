# Chart
Monochrome charts: one emphasized series in `chart-1`, comparison in `chart-2`, gridlines in `chart-grid`.

- Bars are flat rectangles (radius 0), 1px apart from nothing; lines 1.25px with an emphasized endpoint.
- Axis labels in `mono-sm`, `fg-300`. Only label values the chart reaches; 3–5 gridlines.
- No color for decoration. A status color appears only to mark a threshold breach (budget line in `warn`).
- Every chart sits in a HairlineGrid cell with an eyebrow title and the current value.
