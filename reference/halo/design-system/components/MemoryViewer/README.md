What an agent remembers (`MemoryViewer`) and how its runtime settings differ from code (`OverrideDiff`).

MemoryViewer: `items` ({id, scope, source, date, text}), `onEdit(item)`, `onDelete(item)`. Search and scope chips built in.
OverrideDiff: `title`, `versions`, `by`, `before`, `after` (text, diffed by line), `onDiscard`, `onPromote`, `discardLabel`, `promoteLabel`.
