What starts agents and when: `TriggerList` and the week view `ScheduleCalendar`.

TriggerList: `items` ({id, type: "schedule" | "event" | "webhook" | "mail", rule, agent, by, next, enabled}), `onToggle(item)`, `onRun(item)`.
ScheduleCalendar: `events` ({day 0–6, start, end (hours), label, sub, tint, self}), `from`, `to`, `days` (labels; defaults to the locale's weekdays), `onOpen(event)`. Events an agent created for itself get a signal outline.
