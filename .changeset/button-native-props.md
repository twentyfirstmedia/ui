---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/elements": minor
---

`Button` and `IconButton` pass native attributes on to their `<button>` (or, with `asChild`, to the child): `id`, `name`, `value`, `form`, `title`, `tabIndex`, `autoFocus`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-expanded`, `aria-controls`, `aria-haspopup`, `aria-pressed`, `aria-current` (documented as `NativeButtonProps`), plus any other `<button>` attribute, `data-*`, event handlers and, in React 19, `ref`. `type` also takes `"reset"`, and `IconButton` takes `type`. On `IconButton`, `aria-label` or `title` override the ones `label` sets. With `asChild`, `onClick` and the other attributes now reach the child as well.

In `@twentyfirstmedia/elements`, `<tf-button>` and `<tf-icon-button>` take these as attributes; `aria-*` attributes move from the host to the inner button. The docs and the MCP server list them with both components.
