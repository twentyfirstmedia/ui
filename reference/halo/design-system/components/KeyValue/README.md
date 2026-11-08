Small building blocks for detail panels: `KeyValue` (label/value list), `Kbd` (keyboard keys), `Spinner`, `Collapsible`.

KeyValue: `items` ([label, value, mono] or {k, v, mono}), `dense`. Empty values show a dash.
Kbd: `keys` (array). Spinner: `size` ("lg"), `label`. Collapsible: `title`, `meta`, `defaultOpen` / `open` + `onOpenChange`, children.

- Keep keys short nouns; values that are codes, IDs or addresses use `mono`.
- Show a spinner only after ~300 ms; inside a button it replaces the icon.
