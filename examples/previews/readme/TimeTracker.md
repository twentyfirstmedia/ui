# TimeTracker

A start/stop timer for what you are working on, with project and billable, and today's entries
with their total.

- The clock ticks every second while `running`; pass `now` for a fixed render.
- Each control appears only when its handler is passed (`onTask`, `onProject`, `onBillable`).
