A KPI with its comparison: label, value, ▲/▼ delta that names what it compares to, optional sparkline.

Props: `label`, `value`, `delta` (percent, signed), `deltaText` (override), `compare` ("vs last Friday"), `invert` (down is good: refunds, failures, cost), `spark` (numbers), `icon` + `iconTint`, `tint`.

- Use 3–5 in a row, only when those numbers are the point of the screen.
- Always say what the delta compares to; good is mint, bad is blush, decided by `invert`.
