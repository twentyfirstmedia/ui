# ChatWorkspace

Messenger-style workspace for agents and people: `ChatWorkspace` (list | thread | details) with `ChatList`, `ChatThread`, `Composer`, `SearchHits`, `ThinkingLine` and `FeedbackRating`.

**ChatWorkspace**: `list`, `thread`, `details`.

- Desktop: three panes; drag the details pane's edge (or use the arrow keys on it) to resize it: `detailsWidth` / `defaultDetailsWidth` / `onDetailsWidthChange`. Below 1040px the details pane hides.
- Phones (below 760px): one pane at a time. Picking a chat row opens the thread, the back button returns to the list: `view` ("list" | "thread") / `defaultView` / `onViewChange`, `backLabel`.

**ChatList**: `groups` ({title, mark, items}), `selected`, `onSelect`, `linkAs`. Items: `id`, `name`, `sub` (last message), `time` or `date` (shown relative), `tint`, `avatar` / `avatarSrc` for people, `status` (a dot), `unread`, `pinned`, `project`, `from`, `href`.

- Order the groups as people scan them: pinned first, then the agents of each project, then people.
- Search takes tokens: `from:Atlas`, `in:Northwind`, `before:2026-04-12`, `after:…` and free words; tokens show as chips that remove themselves. `query` / `onQueryChange` control it, `onSearch(q, parsed)` hands you the tokens (`parseChatQuery`) for a server search; `filter={false}` turns the local filter off.

**ChatThread** holds the messages: it follows the newest message while it streams, offers "jump to the latest" when the reader scrolled up, and `jumpTo` (a message `id`) scrolls to a search hit and marks it. **SearchHits** marks the query's words; `onOpen(hit)` with the hit's `messageId` is the jump.

Inside a thread: `DaySeparator` (days and the "New messages" line), `HandoffLine` (agent A → agent B with the reason), `ChatMessage` with `role="system"` or `SystemLine`, `VoiceLog` (a finished voice conversation, folded), `TypingIndicator` and `ReadOnlyBar` (reading along an agent-to-agent conversation, with "Step in").
