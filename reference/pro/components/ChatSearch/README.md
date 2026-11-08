# ChatSearch
Search across names and the full history of every conversation, including agent-to-agent threads and tool payloads.

- Typing in the ChatList search replaces the thread pane with results, newest first, grouped by conversation when more than 3 hits share one.
- Each hit: avatar, conversation, time, a one-line snippet with the match in `mark` (bg-300 + 1px underline, no colour).
- Filters as tokens in the query: `von:support`, `projekt:jd`, `typ:freigabe`, `vor:7d`. ↵ on a hit opens the conversation scrolled to that message, which flashes once.
