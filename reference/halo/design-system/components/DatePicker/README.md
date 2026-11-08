Date field that opens a month calendar in a Popover. `range` picks a from–to span and adds presets.

Props: `label`, `value`/`defaultValue` (Date, or {from, to} with `range`), `onChange`, `range`, `presets` (false to hide), `min`, `max`, `today`, `placeholder`, `hint`, `error`, `required`. `Calendar` is the bare month grid for inline use.

- Weeks start on Monday; dates read DD.MM.YYYY. Today has a dot under the number.
- A range closes after the second click; a single date closes after one.
- Presets cover the ranges people actually pick (7, 30, 90 days, this year); keep them to four.
