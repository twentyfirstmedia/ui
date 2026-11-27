# ChatMessage

One turn in a conversation with an agent: the user's message on the right, the agent's answer as rich text on the left, system lines in the middle.

Props: `role` ("user" | "assistant" | "system"), `id` (what `ChatThread jumpTo` scrolls to), `name`, `time`, `model`, `text`, `streaming`, `tint`, `sources`, `attachments` ({name, size, kind: "image", url, thumb}), `mentions` (from `Composer`), `highlight` (search words), `voice` ({src, duration, transcript}), `dictated`, `inVoice`, `usage`, `before` / `after` (slots), `linkAs`.

Actions, on hover and focus (always on touch screens and on the last answer):

- **Copy** on every message.
- **Edit** on the user's own message with `onEdit(text)`: the bubble turns into a `MessageEditor` (Enter sends, Shift+Enter is a new line, Esc cancels). `editing` / `onEditingChange` control it.
- **Regenerate** on the last answer with `onRetry`.
- **Versions** "‹ 1/2 ›" on an edited message or a regenerated answer: `versionCount`, `versionIndex`, `onVersionChange`, `versionBusy`.
- **Thumbs** up and down (`feedback` / `onFeedback`); thumbs down asks what should be different (`onFeedbackComment(value, comment)`). A second press takes it back.

`actionsVisible` ("always" | "hover") overrides when the row shows; `actions={false}` hides it.

- An answer that needs a decision carries the `ApprovalCard` in `after`; a tool call or reasoning goes in `before` (`ToolCall` takes `traceHref` for its "Trace" link). The payload in the card is exactly what will run.
- Images show as thumbnails that open the file, other files as chips with a download link.
- "Dictated" and "In voice conversation" mark how a message came in.
- `RichText` and `CodeBlock` are exported on their own for docs, notes and logs.
