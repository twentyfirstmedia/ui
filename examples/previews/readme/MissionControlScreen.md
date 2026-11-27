# Mission control

The home page of a multi-agent workspace: a direct chat with the orchestrating agent in the middle and, around it, live, what is coordinated where.

- **Centre**: the main agent's chat (`ChatThread`, `ChatMessage`, `Composer` with `@` mentions of the leads); `PromptStarters` while it is empty.
- **Beside it**: open approvals as compact `ApprovalCard`s (money with `MoneyPreview` and the passkey step), today's costs against the budget (`UsageMeter`).
- **Below**: `AgentNetwork` with handoffs moving along the lines and `CoordinationTicker` with the latest handoffs, runs and approvals.
- **Phones**: the chat first, the rest as tabs (Agents, Activity, Approvals, Costs).
- **Glass**: switch glass on in the look menu; `AppearanceProvider` paints `Ambient` behind the frame and every panel turns to glass.
