# ApprovalCard

The human-in-the-loop decision: what an agent wants to do, the exact payload, and the four answers A–D.

Props: `title` (the action as one sentence), `text` (why), children (the payload, verbatim, usually one of the previews below), `agent`, `project`, `family` ("money" | "infra" | "comms" | "marketing" | "apps" | "legal") or `familyLabel`, `age`, `escalation`, `trace` (node), `note`, `heading`, `onDecide(key, text)`, `decision` ({key, by, at, text}: renders the one-line record), `options` (override A–D; each {key, label, input}), `approveLabel` (relabels A), `compact`, `stepUp`, `busy`, `error`, `screen`, `href` / `linkAs`. Legacy `onApprove` / `onDeny` / `onEdit` and `state` still work.

- Always four answers in this order: **A** yes, as shown · **B** yes, with a change · **C** no, discard · **D** different instruction. B and D open a text field; ⌘/Ctrl+Enter sends.
- A–D work as keys while the card has focus.
- The payload is exactly what will run: the full message, the amount and recipient, the command, the change before and after. Never a summary. Use `ChangePreview`, `CommandPreview`, `MessagePreview`, `CampaignPreview`, `DocumentPreview`, `EventPreview` or `MoneyPreview` as children.
- Show the risk family, the age and the escalation time. Nothing runs automatically when time is up.
- `onDecide` may return a Promise: the pressed answer spins and all answers wait until it settles. A rejection shows an error (a rejected string as is) and keeps the card open; once it resolves, a card without a `decision` prop collapses to one line.
- `stepUp` for money, legal and infrastructure: A and B say "Needs your passkey" and, while `onDecide` runs your WebAuthn step-up, "Confirm with passkey". Reject when the passkey fails.
- `compact` for side panels: tighter, answers in a row, the payload one click away behind "Show what runs"; `href` links the title to the full approval.
- `screen` fills its container (a deep link on a phone): the content scrolls and A–D stay at the bottom, full width, in thumb reach. On touch screens every answer is at least 48px tall.
- After a decision the card collapses to one line: letter, who, when (and the change or instruction).
- Every built-in text comes from `UIProvider messages`; the A–D wording can also be changed through `options`.
