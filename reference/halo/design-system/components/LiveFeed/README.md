Real-time activity: `LiveFeed` (events as they happen, with pause and filters) and `BarList` (ranked values with inline bars, e.g. top countries or services).

LiveFeed: `items` ({id, type, icon, tint, title, text, amount, currency, time, fresh}), `types` ({value, label} filter chips), `paused` / `onPause`, `maxHeight`, `emptyText`. While paused, new events are held back and counted.
BarList: `items` ({id, label, mark, value, share (0–1), tint}), `format`, `onPick(item)`, `label`.

- Show at most ~50 events; older ones belong in a table.
- `fresh` slides a row in once; it never blinks or repeats.
