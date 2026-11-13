# DeadlineList

Bills, renewals, notice periods and expiring documents in date order, each with "Today",
"In 12 days" or "Overdue by 3 days" in words.

- Set `today` for server rendering and stable output; `soon` (default 14 days) marks what is near.
- `onDone(id)` adds "Mark … done"; done items stay, struck through.
