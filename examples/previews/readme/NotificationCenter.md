# NotificationCenter

The bell for the top bar: an unread count on it, and behind it the `NotificationList` in a popover (a bottom sheet on phones). Items with a `date` are grouped by day ("Today", "Yesterday", the date in the provider's locale), unread ones are marked, each can link to what it is about (`href`, rendered through `linkAs` or `UIProvider linkAs`), and "Mark all read" calls `onReadAll`.

- `items`, `onOpen`, `onReadAll`: the list; opening an item closes the panel.
- `unread` overrides the count on the bell (default: the unread items); above 99 it shows "99+".
- `open` / `onOpenChange` make it controlled; `sheet={false}` keeps the popover on phones.
- `hideFilter` drops the "All / Unread" tabs.
- In `AppShell`, `notifications={{ items, onReadAll }}` puts it at the end of the top bar.
- The bell's accessible name says how many are unread (`notificationsUnread` in `UIProvider messages`).
