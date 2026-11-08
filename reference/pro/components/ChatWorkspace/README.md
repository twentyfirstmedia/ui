# ChatWorkspace
The chat-first alternative to the city: every agent, the Main Brain and every agent-to-agent conversation in one messenger-style workspace with full history.

**Layout:** three columns joined by hairlines. ChatList (300px) | ChatThread (fluid) | AgentDetails (300px, toggle with `]` or the panel button, hidden below 900px). Top bar carries the ViewSwitcher (Stadt / Chats), so both views are one keystroke apart.

**Behavior**
- Opens on the last conversation; `/` focuses the search, `↑` `↓` move through the list, `↵` opens, `Esc` clears the search.
- Selecting a chat marks it read. An open approval in a chat pins the chat into the Freigaben filter until decided.
- Messages stream in live (SSE); the list re-sorts by last activity inside its group.
- "In der Stadt zeigen" jumps to the agent's desk in the OfficeFloor; the city's agent chat jumps back here with the same thread.
- Deep links: `/chats/<agentId>`, `/chats/a2a/<threadId>`, `/chats?q=…`.

**Consumer provides:** the conversation index (agents, threads, last message, unread, approvals), paged history per conversation, the SSE stream, send handler. History loads newest first, 50 messages per page, older pages on scroll up.
