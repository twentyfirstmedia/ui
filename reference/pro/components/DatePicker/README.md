# DatePicker
Picks a date or a date range: booking dates, invoice due dates, report periods, one-off triggers.

- Trigger is an Input-styled button showing the value in German format (`13.10.2026`, range `01.10. – 31.10.2026`) with a Lucide `calendar` icon.
- Popover `hq-layer` with presets on the left (Heute, Diese Woche, Dieser Monat, Letzter Monat, Quartal, Jahr) and a month grid (`hq-cal`).
- Weeks start on Monday. Today has a `line-300` ring, selected days `accent`, days inside a range `bg-300`, other-month days `fg-400`.
- Keyboard: arrows move, PageUp/PageDown change month, Enter selects. Typing a date into the trigger field also works ("13.10.", "heute", "−7").
