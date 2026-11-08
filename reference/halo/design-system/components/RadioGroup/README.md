One choice out of a few, always visible. `RadioGroup` for 2–5 options with labels and hints, `Segmented` for 2–4 short options that switch a value inline.

RadioGroup props: `label`, `options` (strings or {value, label, hint, disabled}), `value`/`defaultValue`, `onChange(value)`, `cards` (bordered tiles in a grid), `hint`.
Segmented props: `options` (strings or {value, label, icon}), `value`/`defaultValue`, `onChange(value)`, `size` ("sm"), `block`, `label` (accessible name).

- Six or more options, or options that need search: use Combobox.
- Segmented sets a value (billing period, density); Tabs switch views of content. Don't mix them up.
- `cards` when each option needs a sentence to explain it (plans, themes).
