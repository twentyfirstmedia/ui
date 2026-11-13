# HabitTracker

Habits with their last days as a row of marks: done, missed or no entry, today's mark a toggle.

- `days` is one entry per day, oldest first and today last: `true`, `false` or `null`.
- `streak` shows "12-day streak"; `goal` a short target ("8 glasses").
- `onToggle(id, done)` makes today's mark a button; the other days are read-only and named for
  screen readers ("Mon Done").
- Day labels default to weekday initials ending today; pass `dayLabels` to set them yourself.
