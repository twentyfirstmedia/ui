# ChatThread
One conversation with full history: the human view of a single agent or the Main Brain.

**Parts**
- `.hq-chathead`: avatar with status, name, role · project, status, model, cost today, actions (search in chat, show in city, details).
- `.hq-daysep`: day separators (Heute, Gestern, then dates). `.is-new` marks where unread starts.
- Messages: `.hq-msg` (agent), `.hq-msg--human` (Robin, Lukas), `.hq-handoff` lines for delegations, `.hq-tool` for tool calls, inline ApprovalCard; after a decision the card collapses to one line ("Robin · A Ja, so ausführen").
- Typing: `.hq-thinking` dots while the agent works; streamed text with `.hq-caret`.
- `.hq-composer` (see ChatComposer): attach files (button, drag onto the thread, paste), dictate, start a voice conversation, model badge, send. `@` mentions another agent (it is added to the conversation), `/` opens commands (/trace, /model, /pause, /neu). Enter sends.

**Rules:** the history is the real log of the agent's runs, not a summary. Tool payloads stay collapsed. Older messages load on scroll up with a "Ältere Nachrichten laden" anchor; position never jumps.
