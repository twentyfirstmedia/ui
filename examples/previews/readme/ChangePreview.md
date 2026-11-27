# ChangePreview

Before and after of a change, exactly as it will run: DNS records, zone and cloud settings, mailboxes, a server's state, any API call. Goes inside an `ApprovalCard`.

- `fields`: `{label, before, after, mono}`; changed rows are marked (signal edge, the new value highlighted, the old one struck through), unchanged rows stay muted. `null` or an empty value shows "Empty" (created or deleted). Multi-line values keep their lines.
- `facts`: provider, account, region, target above the table. `onlyChanged` hides unchanged rows.
- `diff`: `{before, after, context}` adds a line diff below (`-`, `+`, ` `), folding long unchanged runs into "… 12 unchanged lines". `LineDiff` and `diffLines()` work on their own too.
- `warnings`: your own words, shown as warnings.
- Narrow (under 480px) each row stacks: field, then before and after with their labels.
