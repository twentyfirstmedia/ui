# ViewSwitcher
Switch between the city and the chats (and the list view) from the top bar. It is always there, so neither view is a dead end.

- SegmentedControl with icons: **Stadt** (`G` then `S`), **Chats** (`G` then `C`), **Liste** (`G` then `L`). The chats segment carries the unread count, approvals stay on the Freigaben button.
- Context carries over: switching from a selected building opens that project's group in the chats; switching from a chat focuses the agent's desk in the city.
- The user's last choice becomes the start view.
