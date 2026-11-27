# ApprovalInbox

All open approvals across projects, oldest first, next to the selected ApprovalCard.

Props: `items` ({id, title, agent, project, family, familyLabel, age, ageMin, urgent, decision, href}), `selected` / `defaultSelected`, `onSelect(id)`, `onDecide(id, key)`, `filters` (`true` or a list of "project", "family", "agent"), `filter` / `defaultFilter` / `onFilterChange`, `view` / `defaultView` / `onViewChange` ("open" | "done"), `showDone`, `escalationWarning`, `linkAs`, `emptyTitle`, `emptyText`, `label`.

- Oldest first: the one closest to escalation is on top; `urgent` turns its age into a warning and the inbox warns above the list ("2 approvals escalate soon").
- J / K or ↓ / ↑ move the selection; A–D answer the selected approval through `onDecide` (B and D usually open the text field of the card next to it).
- Items with a `decision` move to the "Done" view with the answer, who and when.
- Filters list the projects, families and agents found in the items; all of them are controlled or uncontrolled.
