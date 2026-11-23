# CommandPalette

Jump anywhere by typing: results grouped by section, arrow keys to move, Enter to run, Escape to close.

- Keep it mounted and open it with `open` (⌘K from a `SearchField` with `bindShortcut`, or a
  button): focus moves into the search field each time it opens, Tab stays inside, Escape calls
  `onClose`, and focus returns to the element that had it.
- `loading` shows a row while an async search runs; `empty` replaces the text when nothing matches.
- Items with `searchOnly` appear only once someone types.

```tsx
const [open, setOpen] = useState(false);

<SearchField placeholder="Search" shortcut="⌘K" bindShortcut onFocus={() => setOpen(true)} />
<CommandPalette open={open} onClose={() => setOpen(false)} items={items} />
```
