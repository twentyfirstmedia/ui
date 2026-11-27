# RichText

The Markdown subset agents write, rendered in the kit's type: what `ChatMessage` uses for answers, on its own for notes, briefings and logs.

- Paragraphs (single line breaks stay), headings (`#` to `######`), **bold**, *italic*, ~~strike~~, `inline code`, links and bare URLs.
- Lists, nested by indenting, numbered lists keep their start, task lists (`- [x]`, `- [ ]`) with a checked or open box.
- Quotes (`>`), rules (`---`), tables with alignment (`:--`, `--:`, `:-:`) that scroll sideways on their own when they are wider than the screen.
- Fenced code blocks with the language and a copy button.
- Links are safe: only http(s), mailto, tel and relative links become links (`safeHref`); `javascript:`, `data:` and the like stay text. External links open in a new tab; relative ones use `linkAs` (your router).
- Long words and URLs wrap instead of widening the page.
- `highlight` marks the words of a search; `streaming` shows the caret and keeps an unfinished code block open.
