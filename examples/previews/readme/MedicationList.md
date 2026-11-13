# MedicationList

Today's doses in order, each with its time, name, dose, a status in words and a "taken" button.

- `status` is set by the app, which knows the clock: `taken`, `due`, `missed` or `upcoming`.
- `onTake(id)` adds a button named "Mark Ramipril as taken" to doses that are due or missed.
