# ImportSuggestions

Bank statement lines with a suggested category and booking, confirmed in one step: tick the lines that
are right, change a category where it is not, and book the selection with one button.

- `lines`: date, text, counterparty, signed `amount` and a `suggestion` (`category`, `booking`,
  `confidence` 0–1, `reason`). Lines with `state: "duplicate"` or `"booked"` stay visible but cannot be picked.
- Every new line with a suggestion starts selected; "Select all" and `selected` / `onSelectedChange` control it.
- `onConfirm(ids)` books the selection; return a Promise for the pending state (and reject with an
  Error to show its message).
- `categories` with `onCategoryChange` turn the category into a picker; `onEdit(id)` opens your own editor.
- Below 560px each line folds into two rows; the confirm button spans the width.
