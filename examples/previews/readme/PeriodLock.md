# PeriodLock

The state of an accounting period (a month): open or locked, who locked it and when, and the button to
lock or unlock it after a confirmation.

- `month` is formatted in the provider's locale ("October 2026", "Oktober 2026"); `period` takes your own text.
- `locked` / `defaultLocked` / `onLockedChange`. `onLock` and `onUnlock` may return a Promise: the button
  shows the pending state until it settles (for example while your app asks for a passkey), a rejection
  shows its message and keeps the state.
- `stepUp` labels the confirm button "Confirm with passkey"; `confirm={false}` skips the dialog;
  `readOnly` shows the state only.
