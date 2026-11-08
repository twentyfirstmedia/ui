Dashed drop zone plus an upload list with progress. Click, Enter or drop to add files.

Props: `files`/`onChange` (controlled list of {id, name, size, progress}), `title`, `hint`, `accept`, `multiple` (default true).

- The zone turns mint while a file is held over it, so people know the drop will land.
- Each row shows percent while uploading and size when done; the trailing button cancels, then removes.
- Say what is accepted in the hint (types, size). Reject the rest with an inline Alert, not a toast.
