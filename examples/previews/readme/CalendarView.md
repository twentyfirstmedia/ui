# CalendarView

A full calendar: day, week, month and agenda, for several calendars at once.

- **Calendars**: each with a tint and a visibility toggle (`hidden`/`onHiddenChange`); `readOnly` calendars such as public holidays show without reply or actions.
- **Day and week**: an all-day row, hours from `hours` (widened to fit the events), overlapping events side by side and a line at the current time.
- **Creating**: click an empty slot (an hour), drag over a range (snapped to 15 minutes) or press Enter on a focused slot; `onCreate` gets `{ start, end, allDay }`. Arrow keys move between slots and days, Home/End to the first and last hour.
- **Details**: a popover next to the event on desktop and a sheet from the bottom on phones, with place, calendar, description, guests and their replies, "Going?" (`onRsvp`) and your own buttons (`eventActions`).
- **Phones**: under 640 px a week or month shows as a list of days (the agenda).
- **Controlled**: `view`, `date`, `selected`, `hidden`; `onRangeChange` reports the visible range (also on mount) so you can load its events.
- Weekday and month names, times and ranges come from `Intl` in the provider's locale; `weekStartsOn={0}` starts weeks on Sunday.
