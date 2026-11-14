# ConnectorGallery

Every service an assistant can connect to, grouped by category, with a search field and category
chips. Each tile shows the mark, a line on what the assistant does with it, a hint such as "Needs
the iPhone app", and its state: Connect, Connected (with Open), Needs attention (with Reconnect)
or Coming soon.

- `categories` sets the order of the groups; `filters={false}` hides search and chips.
- `onConnect(id)` and `onOpen(id)`; on glass the tiles turn to glass like cards.
