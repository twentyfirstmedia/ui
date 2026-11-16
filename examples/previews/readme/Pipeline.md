# Pipeline

Deals in columns per stage, each column with its count, total and weighted value (value times the
stage's probability).

- Deals move by drag and drop or by each card's "Move to" menu; both call `onMove(id, stage)`.
- On narrow screens the columns scroll sideways inside the pipeline, never the page.
