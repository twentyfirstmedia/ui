# FileDrop

Dashed drop zone plus an upload list. Click, Enter or drop to add files.

- `onFiles(files)` hands over the real `File` objects the person picked or dropped, after `accept` and `multiple`; upload them yourself. Dropped files that do not match `accept` go to `onReject`; say so with an inline Alert, not a toast.
- Progress is yours to report: control `files` (`{ id, name, size, progress, file }`) and set `progress` from your upload. Below 100 a row shows a progress bar and a cancel button, at 100 it reads "uploaded". With `onFiles` and no `files`, rows show only the size. `onRemove` tells you a file was removed or its upload cancelled.
- Without `onFiles` the list animates made-up progress, as a demo of the look (`simulateProgress` turns that on or off).
- The zone turns mint while a file is held over it, so people know the drop will land.
- Say what is accepted in the hint (types, size).
