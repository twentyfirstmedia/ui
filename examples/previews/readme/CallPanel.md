# CallPanel

A call in progress, for a dialer or a softphone: who it is, the state and timer, mute, hold,
record and end, notes and the outcome.

- Mute, hold and record are toggle buttons with fixed labels and `aria-pressed`.
- The timer counts from `startedAt` and ticks every second; pass `now` for a fixed render.
- `state="ringing"` with `onAnswer` shows "Answer" instead of the call controls.
