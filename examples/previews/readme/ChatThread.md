# ChatThread and thread lines

The conversation itself and the lines between its messages.

**ChatThread**: the scrolling log of a conversation. `children` (messages and lines), `jumpTo` (a message `id`: scrolls to it and marks it, e.g. from `SearchHits`), `jumpKey` (to jump to the same one again), `stickToBottom` (default true: follows the newest message while it streams, unless the reader scrolled up; then a button jumps to the latest), `label`.

- **DaySeparator**: "Today", "Yesterday" or the date between days; with `label="New messages"` and `tone="accent"` above the first unread message.
- **HandoffLine**: one agent passes the work to another: `from`, `to` ({name, tint, kind, avatar}), `reason`, `time`, `href` / `onClick` to open their conversation.
- **SystemLine**: what happened around the messages (a model switch, a pause): `icon`, `time`, `tone` ("warning", "danger").
- **VoiceNote**: a voice message: play, seek, length and the transcript behind "Show transcript". `src`, `duration` (seconds), `transcript`, `peaks`, `mine`.
- **VoiceLog**: a finished voice conversation folded into one line: `duration`, `time`, `turns`, `audio` (the recording, if it was kept).
- **TypingIndicator**: "Lena is typing…", "Lena and Noah are typing…", "3 people are typing…".
- **ReadOnlyBar**: in place of the composer while you read along an agent-to-agent conversation, with "Step in".
