# ChatList

The conversations of a chat workspace: grouped, with unread counts, the agent's state as a dot, the last message and when it came.

Props: `groups` ({title, mark, items}), `selected`, `onSelect`, `query` / `onQueryChange`, `onSearch(q, parsed)`, `filter`, `filters`, `searchPlaceholder`, `linkAs`.

Items: `id`, `name`, `sub` (the last message), `time` or `date` (shown relative), `tint`, `avatar` / `avatarSrc` (people), `status` ("ok", "running", "signal" for waiting on you, "warn", "danger", "idle"), `unread`, `pinned`, `project`, `from`, `href` (rows become links; with `linkAs` your router's).

- Groups in the order people scan: pinned, then the agents of each project, then people.
- Search tokens: `from:Atlas` (the name or `from`), `in:Northwind` (the project or the group), `before:2026-04-15` and `after:…` (the `date`), plus free words. Tokens show as chips under the field; their × removes them.
- `onSearch` hands the parsed tokens to your server (`parseChatQuery` does the same); `filter={false}` leaves the filtering to it.
