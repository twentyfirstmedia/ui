---
"@twentyfirstmedia/ui-core": minor
---

`Gallery` and `BeforeAfter` load images lazily and take `loading` and `referrerPolicy`.

- `Gallery`: the main image loads lazily by default (`loading="eager"` for a gallery at the top of the page), thumbnails always lazily, all images decode asynchronously; `referrerPolicy` applies to every image (new type `ImageReferrerPolicy`).
- `BeforeAfter`: the slider has an `aria-valuetext` ("Before 40%, After 60%", with `beforeLabel`/`afterLabel`), overridable with `valueText(percent)`; its accessible name is `label`. Page Up/Down, Home and End move the slider; arrow keys no longer scroll the page while it has focus. Both images take `loading` (default lazy) and `referrerPolicy`.
