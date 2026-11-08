Webmail pieces: `AccountSwitcher` (one login, every address), `InboxList` (with agent state per mail), `MailThread`, `SignatureEditor`, `AttachmentPreview`.

AccountSwitcher: `accounts` ({address, domain, unread}), `value` (null = all inboxes), `onChange`, `unread`, `allLabel`.
InboxList: `items` ({id, from, time, subject, snippet, unread, to, agent: {label, tone}, tags}), `selected`, `onOpen`.
MailThread: `subject`, `messages` ({id, from, to, time, snippet, body, agent, tint, agentNote, attachments}), `reply` (node). Oldest collapsed, newest open; agent mails carry a signal edge.
SignatureEditor: `value` / `onChange` ({name, role, company, phone, website}), `fields`, `note`, `extra`.
AttachmentPreview: `name`, `meta`, children (the document on paper), `facts` (KeyValue), `found`, `actions`, `onClose`.
