Admin safety lists: `BackupList` (snapshots with restore) and `BlockList` (blocked IPs, emails, accounts).

BackupList: `items` ({id, name, kind, where, retention, size, status}), `onDownload`, `onRestore`, `footer`. Restore is always confirmed (ConfirmDialog) by the app.
BlockList: `items` ({id, value, kind, reason, by, until}), `onAdd`, `onRemove`, `addLabel`, `removeLabel`, `searchPlaceholder`, `emptyText`.
