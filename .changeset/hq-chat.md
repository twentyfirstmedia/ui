---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/elements": minor
"@twentyfirstmedia/ui": minor
---

Chat that works as well on a phone as on a desktop.

New:

- `ChatThread`: the scrolling log of a conversation; follows the newest message while it streams, offers "jump to the latest" when scrolled up, and `jumpTo` scrolls to a message (a search hit) and marks it.
- `MessageEditor` (edit a sent message in place: Enter sends, Shift+Enter is a new line, Esc cancels) and `VersionSwitch` ("‹ 1/2 ›", controlled, with a busy state).
- Thread lines: `HandoffLine` (agent A → agent B with the reason), `SystemLine`, `VoiceNote` (player, length, transcript), `VoiceLog` (a finished voice conversation folded into one record), `TypingIndicator`, `ReadOnlyBar` ("You are reading along" with "Step in"), `MentionText`.
- `parseChatQuery` (chat search tokens `from:`, `in:`, `before:`, `after:`), `safeHref`, `shiftMentions`-backed mentions in `Composer`.
- Kit icons `mic`, `micOff` and `camera` (still exported from the icon library for existing imports).

Extended:

- `RichText`: the full Markdown subset: tables with alignment (scrolling on their own), nested and task lists, quotes, rules, italic and strike, bare URLs, safe links only (no `javascript:` or `data:`), long words and URLs wrap; `highlight` marks search words, `linkAs` for relative links.
- `ChatMessage`: copy on every message, edit in place on one's own (`onEdit`), regenerate, versions (`versionCount`, `versionIndex`, `onVersionChange`, `versionBusy`), thumbs with a comment on thumbs down (`onFeedbackComment`, via `FeedbackRating`), actions on hover and focus (always on touch and on the last answer, `actionsVisible`), `mentions`, `highlight`, `voice`, `dictated` and `inVoice` markers, image thumbnails and file downloads, `id` for jumping.
- `ToolCall`: a "Trace" link (`traceHref`, `onTrace`, `traceLabel`, `linkAs`).
- `Composer`: `@` mentions (grouped suggestions by keyboard and mouse, tinted chips in the field through a mirror layer, removed whole by Backspace, sent as `{id, label, start, end}`), attachments by paste and drop with thumbnails, progress and errors, a camera button on touch screens, dictation run by the app (`dictation`, `onDictate`, ⌥ Space; the kit sends nothing anywhere), voice messages (hold to record, slide away to cancel, let go to send: `onVoiceMessage`), `typing` / `onTyping`, `readOnly` / `onStepIn`; `onSend` now also gets `{ mentions, dictated }`.
- `FeedbackRating`: `inline` for action rows, `upLabel` / `downLabel`; it moved to the chat components (same import).
- `ChatList`: search tokens shown as removable chips, controlled `query`, `onSearch(q, parsed)`, `filter={false}` for server search, rows as links (`href`, `linkAs`), `date` shown relative, unread counts with an accessible name, avatars for people.
- `ChatWorkspace`: one pane at a time on phones (list → thread with a back button: `view`, `onViewChange`), a resizable details pane on desktop (`detailsWidth`), layout by its own width (container queries).
- `SearchHits`: marks every word of the query; hits carry `messageId` for `ChatThread jumpTo`.
- `VoiceMode`: live `turns`, the barge-in state ("interrupted"), "connecting", `onInterrupt`, full screen on phones (`fullscreen`).
