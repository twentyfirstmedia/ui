# LogView
Monospace log with line numbers for deploys, tool output and agent traces.

`pre.hq-log` with one `span` per line. Highlight with `.t` (timestamps, `fg-300`), `.ok`, `.warn`, `.err`, `.hl` (`fg-100`). Sits on `bg-000`. Long lines scroll horizontally inside the block, never wrap the page. Link to the Langfuse trace from the panel header, not from inside the log.
