# SelectMenu

A styled select: the button shows the choice, the list opens below it with groups, icons, hints
and disabled options. Use the native `Select` when the system picker is preferred (long lists on
phones).

- Keyboard: ↑/↓/Enter/Space open, arrows move, Home/End jump, typing jumps to a match, Enter picks,
  Escape closes.
- Inside a `Form` it submits its value under `name` and shows its validation message.

- `hideLabel` hides the label visually and keeps it as the accessible name, for filter bars that
  must stay one row: `<SelectMenu label="Status" hideLabel options={…} />`.
