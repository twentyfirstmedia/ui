# RecordTimeline

Everything that happened on a record, newest first and grouped by day: emails, calls, meetings,
notes, tasks, stage changes, documents and system events.

- Pinned entries stay on top. Chips filter by type (`filters={false}` hides them).
- `onAdd(type, text)` shows a composer for a note, a call or a task.
- "Today" and "Yesterday" come from `Intl.RelativeTimeFormat`; pass `now` for stable output.
