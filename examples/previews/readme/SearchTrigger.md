# SearchTrigger

A search field that opens your search instead of taking text: the `topStart` of the standard top
bar, opening a `CommandPalette`. It looks like `SearchField` and says it opens a dialog.

- `shortcut="⌘K"` shows the key hint (hidden on touch screens); `bindShortcut` opens it with
  ⌘/Ctrl + the hint's last key, except while the reader types in a field.
- On phones the top bar shows `topStartCompact` instead: pass an `IconButton` that opens the same
  search.

```tsx
<AppShell navigation="sidebar" topbar
  topStart={<SearchTrigger placeholder="Search…" shortcut="⌘K" bindShortcut onClick={() => setOpen(true)} />}
  topStartCompact={<IconButton icon="search" label="Search" variant="ghost" onClick={() => setOpen(true)} />}
  …
/>
<CommandPalette open={open} onClose={() => setOpen(false)} items={pages} />
```
