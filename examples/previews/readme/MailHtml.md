# MailHtml

An HTML mail in a sandboxed frame. Nothing in it runs and nothing loads:

- The frame has no `allow-scripts` and no `allow-forms`; its own Content-Security-Policy allows only inline styles and `data:`/`cid:` images, no forms and no base URL.
- Remote images (tracking pixels included) stay blocked until the reader presses "Load images" (`images`/`onImagesChange`, `onLoadImages` to remember the sender).
- Links open in a new tab without a referrer.
- The height follows the content.
- `appearance="paper"` (default) keeps the mail on light paper in every theme, as senders design it; `"theme"` paints plain mails in the page's colours, dark in the dark theme.

Sanitise the HTML on your server as well; the frame is the second line of defence.
