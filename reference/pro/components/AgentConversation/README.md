# AgentConversation
Read along while agents talk to each other: delegations, questions, results. Every agent-to-agent exchange is a thread, inside a project or across projects via the Main Brain.

- Header: paired avatars, "Head Agent ↔ Texter", project, message count, cost of the thread.
- Messages come from both agents; each keeps its own avatar and role. Handoffs and tool calls render as in ChatThread.
- Bottom bar `.hq-readonly`: "Du liest mit" plus **Eingreifen**. Stepping in turns the bar into a composer; the message goes to both agents and the thread becomes a group chat with you in it.
- Cross-project threads always show the Main Brain as a participant, because projects never talk directly.
