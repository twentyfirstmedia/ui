---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/ui": minor
"@twentyfirstmedia/elements": minor
---

Forms, media, maps and fonts.

- `TextField`: `type="password"` gets a show/hide button (`reveal={false}` turns it off), an interactive `action` slot that stays next to error marks, `onKeyDown`.
- `Checkbox`: a 24px hit area around the same box (WCAG 2.2 target size).
- `SearchField`: forwards `id`, `name`, `defaultValue`, `onKeyDown`, `onFocus`, `onBlur`, `autoFocus` and `inputProps` (combobox ARIA); `bindShortcut` focuses it with ⌘/Ctrl + the hint's key; the hint is hidden on touch screens.
- `FileDrop`: `disabled`, `name` (the listed files take part in a form), `onFiles` can return `false` or the files to list.
- `OtpInput`: empties its cells when `error` turns on (`clearOnError`), `ref.current.reset()`.
- New `QrCode` (encoded on the device, no service); `TwoFactorSetup` draws it from `qrValue` and offers `trustDevice`.
- `TilePicker layout="list"`.
- `CookieConsent`: `equalChoice`, `id`, `aria-describedby` on its text, category texts may hold links.
- `Gallery`: controlled `index`/`onIndexChange`, `label`, arrow keys on the stage and the thumbnails, focus moves into the lightbox and back.
- `BeforeAfter`: the page scrolls vertically over it on touch screens, drags end on pointer cancel.
- `CountUp`: renders its final value on the server and counts up on the client; `animate={false}`.
- `PlanCard`: `price` takes any node, `pricePrefix`, `priceNote`, `href`/`linkAs` for the action, a "Current plan" badge.
- `FloatingLayout`: `controls` and `attribution` in the free corner, `startWidth`/`endWidth`, `--floating-safe-*` variables with the space its slots take, the `end` slot as a bottom sheet below 720px (`endSheet`).
- Tokens `ramp-1`…`ramp-5` in both kits: a calm sequential ramp for maps and heatmaps.
- Static WOFF fonts under `fonts/og/` for share images (`next/og`) and PDF tools.
