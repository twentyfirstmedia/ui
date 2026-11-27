# MailComposer

Writing a mail: from (a select when you may send from several addresses), To, Cc and Bcc as `RecipientInput`, subject, the text in the `RichTextEditor`, the signature with a switch, and attachments.

- **Attachments**: `onFiles` gets the files picked on the device; `attachSources` adds places such as "From Drive" (your picker). Uploads show their progress; Send waits for them.
- **Draft**: the whole draft goes to `onChange`; `saved` and `savedAt` show "Draft saved 10:42".
- **Sending**: Send or ⌘/Ctrl+Enter. With `onUndoSend` a toast offers Undo for `undoSeconds` (default 10); hold the mail that long. "Send later" picks a date and time (`onSchedule`).
