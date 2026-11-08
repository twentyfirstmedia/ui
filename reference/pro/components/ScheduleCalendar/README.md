# ScheduleCalendar
Week view of all triggers: when which agent runs, so overlaps and gaps are visible.

`hq-sched` grid: time column + 7 day columns, hairlines between cells, events as `bg-300` blocks with the agent name. Events agents created for themselves carry an `info` edge; the event running now has a `focus` ring. Click opens the trigger. Event-based triggers (new mail, webhooks) are listed under the grid, not placed in time.
