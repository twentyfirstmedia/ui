Searchable select for long lists, single or multiple, with optional create. `TagInput` is the free-text sibling for tags.

Combobox props: `label`, `options` (strings or {value, label, hint, icon, avatar}), `value`/`defaultValue`, `onChange`, `multiple`, `creatable`, `placeholder`, `hint`, `error`, `required`.
TagInput props: `label`, `value`/`defaultValue` (string[]), `onChange`, `placeholder`, `hint`.

- Keyboard: ↑ ↓ to move, Enter to pick, Esc to close, Backspace removes the last token.
- Up to five fixed options without search: use RadioGroup or a native Select instead.
- Selected items in `multiple` show as tokens inside the field; keep their labels short.
- Show a `hint` on people (team, email) so two people with the same name can be told apart.
