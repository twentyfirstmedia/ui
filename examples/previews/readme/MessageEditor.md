# MessageEditor and VersionSwitch

Editing a sent message in place, and stepping between the versions it leaves behind. `ChatMessage` uses both (`onEdit`, `versionCount`); they work on their own too.

**MessageEditor**: `value` / `defaultValue` / `onChange`, `onSubmit(text)`, `onCancel`, `hint` (default "The conversation runs again from here"), `submitLabel`, `busy`, `autoFocus`.

- Enter sends, Shift+Enter adds a line, Esc cancels. The field grows with the text and opens with the caret at the end.
- Say what happens: sending an edit runs the conversation again from that message.

**VersionSwitch**: "‹ 2/3 ›". `count`, `index` (0-based, default the newest) / `defaultIndex` / `onChange`, `busy` (the arrows wait while a new version is made), `label`.

- Show it on an edited user message and on a regenerated answer; the answer below follows the version shown.
