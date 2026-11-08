Message input for agents: grows with the text, attachments, slash commands, a model picker, and Send that turns into Stop while the agent works.

Composer props: `value` / `onChange`, `onSend(text, attachments)`, `busy`, `onStop`, `placeholder`, `models` ({id, label, hint}) + `model` + `onModel`, `commands` ({name, hint, icon, insert}) + `onCommand`, `attachments` + `onAttach(FileList)` + `onRemoveAttachment(i)`, `hint`, `left` (extra tools).
Also here: `PromptStarters` (`items` {icon, tint, title, text, prompt}, `onPick`), `ModelPicker`, `AgentStatus` (`status`, `step`), `UsageMeter` (`used`, `limit`, `format`, `label`, `caption`), `AgentMark`, `TypingDots`.

- Enter sends, Shift+Enter adds a line; typing "/" opens commands (↑ ↓ Enter).
- Drop files anywhere on the composer to attach them.
- Stop must always work: cancel streaming and mark running tools as stopped.
- Show starters only on an empty conversation, three or four, written as things people actually ask.
