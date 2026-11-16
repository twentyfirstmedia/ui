# PropertyList

A record's fields as a definition list, each value formatted by its `type` (email and phone as
links, money and percent through `Intl`, dates, tags, people) and edited in place.

- With `onChange(id, value)` every field that is not `readOnly` gets an edit button: Enter or
  leaving the field saves, Escape cancels. `select` fields edit with their `options`.
- Empty values show a dash; `hint` adds a short line under the value.
