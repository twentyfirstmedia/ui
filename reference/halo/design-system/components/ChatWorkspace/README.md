Messenger-style workspace for agents and people: `ChatWorkspace` (list | thread | details), `ChatList`, `SearchHits`, `ThinkingLine`, `FeedbackRating`.

ChatWorkspace: `list`, `thread`, `details` (third column, hidden on narrow screens).
ChatList: `groups` ({title, mark (tint), items: {id, name, sub, time, tint, avatar, status, unread, pinned}}), `selected`, `onSelect`, `onSearch`, `filters`, `searchPlaceholder`. Order: pinned first, then one group per project, then people.
SearchHits: `items` ({id, chat, time, who, text}), `query` (marked), `onOpen`.
ThinkingLine: `text` ("Reading 3 mails…"). FeedbackRating: `value` / `onRate`, `onSubmit(value, comment)`, `label`, `placeholder`, `thanks`, `askOnUp`.
