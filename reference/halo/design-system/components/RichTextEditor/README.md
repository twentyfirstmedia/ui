Formatted text for newsletters, product descriptions, legal pages and canned replies: toolbar, placeholder fields and a character count.

Props: `label`, `defaultValue` (HTML), `onChange(html)`, `placeholder`, `variables` ({key, label}: inserted as `{key}`), `maxLength`, `minHeight`, `footer`, `hint`, `error`, `disabled`.

- The toolbar keeps to bold, italic, underline, heading, quote, lists, link, undo/redo. Anything richer belongs in a dedicated editor.
- Built on Selection/Range, no `execCommand`. Shortcuts: ⌘/Ctrl B, I, U, K (link), Z and ⇧Z (undo, redo).
- Links open a small field instead of a browser prompt; addresses without a scheme get https://.
- Pasting inserts plain text; `onChange` returns HTML limited to p, h3, blockquote, ul, ol, li, b, i, u, a and br.
- Still sanitize on the server before you send or store it.
