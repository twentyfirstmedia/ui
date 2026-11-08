Inline banner for a state the page is in: a warning, a failure, a note. Lives in the page, unlike a toast.

Props: `tone` ("info" | "success" | "warning" | "danger" | "highlight"), `title`, children (one sentence), `icon` (override), `action` (one small Button), `onDismiss`.

- One alert per page section, at the top of what it concerns. Two warnings: merge them.
- Title says the state, body says the consequence or the next step.
- Warning and danger are announced to screen readers; info and success are polite.
- Never use an alert for something that already happened and needs no action: that's a toast.
