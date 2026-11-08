Waterfall of one agent run: every model call, tool call, search and approval, with timing bars and expandable details.

Props: `steps` ({kind: "model" | "tool" | "search" | "memory" | "approval" | "message" | "error", label, meta, start (ms), ms, detail (string or node), status ("done" | "running" | "error")}), `defaultOpen` (index), `footer`.

- The bar shows when a step ran inside the whole run, so slow tools are obvious at a glance.
- Errors are blush; a running step pulses. Put model, tokens and cost in the footer.
- Use it in run history and when an approval asks "why does the agent want this?".
