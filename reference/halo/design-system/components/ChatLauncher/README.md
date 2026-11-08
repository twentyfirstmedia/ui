Site-wide chrome for customer-facing apps: `ChatLauncher` (floating assistant with page context), `CookieConsent` and `AnnouncementBar`.

ChatLauncher: `title`, `context` (what the assistant is looking at), `tint`, `open` / `onOpenChange`, `unread`, `headerAction`, children (the thread), `composer`, `inline` (for previews; fixed bottom-right by default).
CookieConsent: `title`, `text`, `policy` (link), `categories` ({id, label, text, required, default}), `onSave(choices)`, `open`, `inline`. "Accept all" and "Only necessary" carry equal weight.
AnnouncementBar: children, `tint`, `icon`, `action`, `onDismiss` (false hides the close button).
