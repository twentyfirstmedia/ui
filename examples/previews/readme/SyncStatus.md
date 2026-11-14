# SyncStatus

When a connected service last synced, in words ("Synced 6 minutes ago"), when it syncs next, what
the last sync brought ("1,204 emails") and why a sync failed, with "Sync now".

- States `synced`, `syncing`, `error`, `paused` and `never`; `compact` keeps one line.
- Pass `now` so server and client render the same relative times (`formatRelative`).
