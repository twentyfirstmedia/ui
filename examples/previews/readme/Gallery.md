# Gallery

Images: `Gallery` (photos with thumbnails and full screen), `BeforeAfter` (drag to compare, e.g. virtual staging or upscaling) and `ImageVariants` (the sizes and formats generated from one image).

Gallery: `items` ({src, alt, caption, art, tint}), `start`, `ratio`, `thumbs`, `fullscreen`, `badge`, `loading`, `referrerPolicy`. Arrow keys and Esc work in full screen.
BeforeAfter: `before`, `after` ({src, alt} or {art}), `start` (0–100), `ratio`, `beforeLabel`, `afterLabel`, `label`, `valueText`, `loading`, `referrerPolicy`. Drag, click or use ← → (Page Up/Down for bigger steps, Home and End for the ends).
ImageVariants: `variants` ({id, label, src, size, format, weight, ratio, status}), `selected` / `onSelect`, `alt`, `tint`, `actions`.

- Images load lazily (`loading="eager"` for a gallery at the top of the page; thumbnails always load lazily) and decode off the main thread.
- `referrerPolicy="no-referrer"` keeps your page address from hosts the photos come from.
- The compare slider tells screen readers both shares ("Before 40%, After 60%", with your labels); `valueText` words it your way.
