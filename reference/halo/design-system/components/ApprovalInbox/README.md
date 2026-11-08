All open approvals across projects, oldest first, next to the selected ApprovalCard.

Props: `items` ({id, title, agent, project, family, familyLabel, age, ageMin, urgent}), `selected`, `onSelect(id)`, `emptyTitle`, `emptyText`, `label`.

- Oldest first: the one closest to escalation is on top; `urgent` turns its age into a warning.
- J / K or ↓ / ↑ move the selection; the card next to it takes A–D.
