# DealCard

One deal: title, company, value, probability, close date, owner, days in its stage and the next
step.

- A deal that sat `staleAfter` days (14 by default) in its stage is marked stale, in words too.
- `stages` with `onMove(id, stage)` adds a "Move to" menu, the keyboard path for the Pipeline.
