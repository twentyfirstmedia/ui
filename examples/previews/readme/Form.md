# Form

Validation for native forms. Give `rules` by field `name`; on submit the form checks them, shows
each message under its field, marks the field `aria-invalid` and focuses the first one. After the
first submit, fields re-check as they change.

- Rules: `required`, `email`, `minLength`/`maxLength`, `min`/`max`, `pattern`, and `validate` for
  anything else. Messages can be set per rule.
- `onSubmit` receives the values by name; `errors` shows messages from the server.
- Works with `TextField`, `Input`, `Select`, `Textarea`, `SelectMenu`, `Checkbox` and `Switch`.
