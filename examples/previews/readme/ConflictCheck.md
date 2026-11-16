# ConflictCheck

A conflict-of-interest check before a firm takes on a matter: the parties to check, what was found
in earlier matters (possible or real conflicts, with the reason) and the decision.

- `onParties` makes the parties editable as tags; `onCheck` runs the check again.
- The result says it in words: "No conflicts found" or "1 conflict, 2 possible".
- `onDecide("cleared" | "declined")` records the decision, which then replaces the buttons.
