# InlineEdit
Edit a single cell in place: category, project, amount corrections, labels.

Double-click or Enter on a focused cell turns it into an input with a 1px `focus` ring (`.hq-cell-edit`); Enter saves, Esc cancels, Tab moves to the next editable cell. Saved cells flash nothing; errors keep the editor open with a hint. Values with legal weight (booked amounts) are not inline-editable.
