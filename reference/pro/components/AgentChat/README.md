# AgentChat
The conversation view for the Main Brain, a head agent or any single agent, including agent-to-agent hand-offs and tool calls.

**Parts**
- `.hq-msg`: avatar, name, role, time (mono), text in `body`. Human messages sit on `bg-000` (`--human`); agent messages on `bg-100`.
- `.hq-handoff`: one mono line when work moves between agents ("Head Sales → Lead Researcher · Auftrag"). This is how users watch agents talk to each other.
- `.hq-tool`: collapsible tool call (`details`), name in `fg-100`, duration and cost right, result in the body. Status shape shows success, failure or "waiting for approval".
- Inline ApprovalCard when a tool call needs a human.
- `.hq-composer`: attach (`paperclip`, also drag and paste), dictation (`mic`), voice conversation (`audio-lines`, opens VoiceMode), model badge, send (primary). Enter sends, Shift+Enter breaks a line. Full states in ChatComposer.

**Consumer provides:** the message stream from the API (SSE), agent identity, the composer's submit handler. Messages stream token by token; never show a skeleton for streaming text.
