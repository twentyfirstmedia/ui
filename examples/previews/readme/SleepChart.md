# SleepChart

A night as sleep stages over time, one lane per stage (awake, REM, light, deep), with the time
asleep and the time per stage.

- `segments` are `{ stage, start, end }` in order; times as `Date`, ISO string or timestamp.
- The chart has one accessible description with every total; `summary={false}` hides the totals.
