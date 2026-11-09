---
"@twentyfirstmedia/ui-core": minor
---

`FileDrop` hands over the real files.

- New `onFiles(files: File[])` with the `File` objects the person picked or dropped, after `accept` and `multiple`. Added list entries carry their `file` too, so `onChange` gets them as well.
- Progress only when the app reports it: with `onFiles`, nothing is simulated; set `progress` on controlled `files` to show a bar (now a labelled `progressbar`). An uncontrolled list with `onFiles` shows each file with its size only.
- `accept` is checked on drop as well; `onReject` receives what did not match. `onRemove` reports removed or cancelled files.
- `simulateProgress` keeps the old demo animation; it stays the default without `onFiles`, so existing code behaves as before. Running simulations stop on unmount.
