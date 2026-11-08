The human-in-the-loop decision: what an agent wants to do, the exact payload, and the four answers A–D.

Props: `title` (the action as one sentence), `text` (why), children (the payload, verbatim), `agent`, `project`, `family` ("money" | "infra" | "comms" | "marketing" | "apps" | "legal") or `familyLabel`, `age`, `escalation`, `trace` (node), `note`, `heading`, `onDecide(key, text)`, `decision` ({key, by, at, text}: renders the one-line record), `options` (override A–D; each {key, label, input}), `approveLabel` (relabels A), `compact`. Legacy `onApprove` / `onDeny` / `onEdit` and `state` still work.

- Always four answers in this order: **A** yes, as shown · **B** yes, with a change · **C** no, discard · **D** different instruction. B and D open a text field; ⌘/Ctrl+Enter sends.
- A–D work as keys while the card has focus.
- The payload is exactly what will run: the full mail, the amount and recipient, the command, the DNS change before and after. Never a summary.
- Show the risk family, the age and the escalation time. Nothing runs automatically when time is up.
- After a decision the card collapses to one line: letter, who, when (and the change or instruction).
- All texts come from labels (see Labels); A–D wording can be changed per app.
