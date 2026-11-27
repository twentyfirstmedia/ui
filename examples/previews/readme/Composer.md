# Composer

Message input for agents and people: grows with the text, attachments, `@` mentions, slash commands, dictation, voice messages, a model picker, and Send that turns into Stop while the agent works.

Props: `value` / `onChange`, `onSend(text, files, { mentions, dictated })`, `busy`, `onStop`, `placeholder`, `models` + `model` + `onModel`, `commands` + `onCommand`, `attachments` + `onAttach(files)` + `onRemoveAttachment(i)`, `camera`, `hint`, `left`.

- **Mentions**: `mentionOptions` ({id, label, kind: "agent" | "person", group, role, tint}) open on `@` anywhere in the text, grouped, by keyboard (↑ ↓ Enter, Esc closes) and mouse. A pick becomes a tinted chip in the field and stays one: Backspace removes it whole. The mentions travel with the text as `{id, label, start, end}` (`mentions` / `onMentionsChange` to control them) and `ChatMessage mentions` draws them in the sent message.
- **Attachments**: the paperclip, dropping files on the composer and pasting images or files all call `onAttach`. Images show a thumbnail; items take `progress` (0 to 1) and `error`. `camera` adds a camera button on touch screens.
- **Dictation**: your app turns speech into text (on your server; the kit sends nothing anywhere). `onDictate` shows the microphone and toggles (also ⌥ Space); `dictation` ({active, interim, error}) shows the recording state and the words heard so far, greyed after the text. Put the final words into `value`; `onSend` reports `dictated`.
- **Voice messages**: with `onVoiceMessage(blob, durationMs)`, holding the microphone records in the browser, sliding away cancels, letting go sends. With both, a tap dictates and a hold records. By keyboard the microphone starts and sends a recording.
- **Typing**: `typing` (names) shows who is typing; `onTyping` tells yours, at most every `typingInterval` ms.
- **Reading along**: `readOnly` shows "You are reading along" with "Step in" (`onStepIn`) instead of the field.
- Text is 16px on touch screens, so phones do not zoom in.

Also here: `PromptStarters`, `ModelPicker`, `AgentStatus`, `UsageMeter`, `AgentMark`, `TypingDots`.

- Enter sends, Shift+Enter adds a line; "/" at the start opens commands.
- Stop must always work: cancel streaming and mark running tools as stopped.
- Show starters only on an empty conversation, three or four, written as things people actually ask.
