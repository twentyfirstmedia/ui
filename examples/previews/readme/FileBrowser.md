# FileBrowser

A folder's folders and files as a grid or a list: breadcrumbs, search, preview, upload with progress,
new folder, rename, move, trash and a selection with the bulk action bar. Your app keeps the files and
does the uploads; the component shows them and asks.

- `items` are the current folder's contents (`kind: "folder"` or a file kind; without it the kind comes
  from `mime` or the extension). `path` is the breadcrumb trail; `onNavigate(id)` opens a folder or a
  crumb (crumbs with `href` are links, with `linkAs` for your router).
- A file with an image or PDF `preview` URL opens in a drawer; `onOpen(item)` gets every file. The kit
  loads only the URLs you give it.
- `onUpload(files)` adds Upload and accepts dropped files. Pass `uploads` with `progress` (and `part` /
  `parts` for large files uploaded in pieces) to show each file's state; `onCancelUpload` adds a stop button.
- `onCreateFolder`, `onRename` (in place, also F2), `onMove` with a `folders` tree (a picker dialog),
  `onTrash` (after a confirmation) and `onDownload`. Each may return a Promise.
- Keyboard: arrow keys move between items, Enter opens, Space selects, F2 renames, Delete trashes,
  ⌘/Ctrl+A selects all, Escape clears the selection.
- `view`, `selected`, `query` and `preview` work controlled or uncontrolled. Below 560px the toolbar
  wraps, the grid gets two columns and the list shows size and date under the name.
