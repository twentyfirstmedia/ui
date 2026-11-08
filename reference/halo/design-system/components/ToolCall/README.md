Shows what an agent did between your question and its answer. `ToolCall` is one tool use; `Reasoning` is the agent's plan.

ToolCall props: `name`, `icon`, `status` ("running" | "done" | "error" | "waiting"), `summary` (one line, past tense when done), `duration`, `input`, `output` (string or object, shown as JSON), `defaultOpen`.
Reasoning props: `steps` (string[]) or `text`, `duration`, `streaming` (shimmering "Thinking…"), `defaultOpen`.

- Collapsed by default: the one-line summary is what people read; details are there when they doubt it.
- Status icon colors follow the status map: mint done, sky running, butter waiting, blush error.
- Put them in ChatMessage's `before` slot, reasoning first, tools in the order they ran.
