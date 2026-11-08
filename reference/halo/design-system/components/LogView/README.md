Monospace output: `LogView` for logs with line numbers and levels, `CodeViewer` for JSON, YAML and code.

LogView: `lines` (strings or {time, text, level: "ok" | "warn" | "err" | "hl", fresh}), `title`, `right`, `numbers` (false hides them), `follow` (default true: sticks to the newest line unless the pointer is over it), `maxHeight`.
CodeViewer: `value` (string or object, pretty-printed as JSON), `lang`. Built on CodeBlock with copy.
