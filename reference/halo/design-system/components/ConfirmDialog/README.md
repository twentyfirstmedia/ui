Asks before a destructive or hard-to-undo action. Focus starts on Cancel; Esc cancels.

Props: `open`, `title` (a question naming the thing), `text` (what happens), `danger`, `icon`, `confirmLabel` (a verb: "Delete domain", never "OK"), `cancelLabel`, `confirmText` (type-to-confirm), `onConfirm`, `onCancel`.

- Prefer undo over confirm: removing a list item is instant with an Undo toast; confirm only when undo is impossible or the blast radius is large.
- Use `confirmText` only for irreversible deletes of whole things (a domain, a workspace).
- Renders into document.body, so it sits above every stacking context.
