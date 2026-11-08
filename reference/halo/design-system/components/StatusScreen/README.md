Full-page states for errors and interruptions: `code` "404", "500", "403", "maintenance", "offline", or your own `title` / `text` / `icon` / `tint`.

Props: `code`, `title`, `text`, `icon`, `tint`, `extra` (search field, progress), `actions` (defaults to Back to overview + Contact support), `onHome`, `onContact`, `reference` (request id for support).

- Say what happened, that the person's data is safe, and what to do next, in that order.
- Show a request reference on server errors so support can find it.
- Keep the TopBar when you can (404, 403); go full screen only when the app itself is down.
