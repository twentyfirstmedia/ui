Short confirmation that something happened, with optional Undo. Call `Halo.toast(...)` anywhere; render `<Toaster/>` once.

`toast(text)` or `toast({ text, tone, icon, undo, action: {label, onClick}, duration })` returns an id; `toast.dismiss(id)`.
Toaster props: `position` ("bottom" default, "top").

- Tone follows the status map: success for done, info for started, danger for removed or failed.
- Offer `undo` for every reversible destructive action instead of a confirm dialog; Undo toasts last 6 s, others 4 s.
- Hover pauses the timer; the thin line at the bottom shows time left.
- One sentence, past tense, names the thing: "Invoice #2097 sent", not "Success!".
