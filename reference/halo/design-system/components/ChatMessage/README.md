One turn in a conversation with an agent: user bubble on the right, agent reply as rich text on the left.

Props: `role` ("user" | "assistant" | "system"), `name`, `time`, `model`, `text` (Markdown subset: paragraphs, **bold**, `code`, - lists, 1. lists, ### headings, links, ``` code blocks), `streaming` (blinking caret, no actions yet), `tint` (agent color), `sources` ({title, icon, url | onClick}), `attachments` ({name, size}), `usage` (tokens · cost text), `onRetry`, `onFeedback("up" | "down")`, `actions` (false hides the row), `before` / `after` (slots for tool calls, reasoning, approvals).

- User messages are ink pills, agent replies are plain text on the surface: the agent's words get the space.
- Actions (copy, regenerate, thumbs) appear once streaming ends.
- Number sources in the order they were used; keep titles short.
- `RichText` and `CodeBlock` are exported on their own for docs, notes and logs.
