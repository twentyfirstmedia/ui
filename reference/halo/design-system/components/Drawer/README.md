Right-side sheet for a record's details, sliding in over the page.

Props: `title`, `subtitle`, `avatar` (name for an Avatar), `onClose`, `width`, `inline` (render inside a positioned container, for previews), children.

- Use for a record you look at without leaving the list: a customer, an invoice, a run.
- Traps keyboard focus, closes on Esc and backdrop click, returns focus to the opener.
- Put Tabs right under the badges when the record has more than one view.
