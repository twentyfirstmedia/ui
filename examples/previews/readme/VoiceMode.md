# VoiceMode

Talking to an agent instead of typing: same agent, same tools, same approvals, same thread. On phones it covers the whole screen (`fullscreen`: "phone" by default, "always" or "never").

Props: `name`, `tint`, `state`, `stateLabel`, `transcript`, `turns`, `muted` / `onMute`, `onInterrupt`, `onEnd`.

- States: "connecting", "listening", "thinking", "speaking" and "interrupted": the person spoke over the agent (barge-in), the agent stops and listens.
- `turns` ({who: "user" | "agent", name, text, live}) show the conversation live; the last one may still be `live`.
- While the agent speaks, `onInterrupt` adds a button to cut in (talking works too).
- Afterwards, put one `VoiceLog` into the thread: the conversation folded into a line with its length and turns, the recording if you keep it.
- Approvals asked by voice still show the ApprovalCard; money needs the passkey on screen.
