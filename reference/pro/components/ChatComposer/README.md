# ChatComposer
The one input for every chat with an agent: Chats, the agent page, the city side panel, AgentConversation after **Eingreifen**, and the phone. All of them have the same four actions.

**Anatomy:** `.hq-composer` > optional `.files` (attachment chips) > `textarea` > `.row` with **Anhängen** (`label.hq-btn` wrapping a hidden `input[type=file] multiple`), **Diktieren** (`mic`), **Sprachgespräch** (`audio-lines`), `.vsep`, model badge, hint, **Senden** (primary).

**Attachments**
- Three ways in: the paperclip, dragging files onto the thread (the whole thread shows `.hq-drop`), pasting (screenshots straight from the clipboard).
- Each file becomes a `.hq-file` chip: thumbnail for images, type label otherwise, name, size. Uploading shows `.bar` with progress; a file the agent can't read shows `.is-error` with the reason. `×` removes it before sending.
- Files upload to R2 while you type; Send waits for running uploads. Limits: 25 MB per file, 10 files per message. Images and PDFs go to the model directly; Office files and CSV are converted to text first.
- Sent attachments render under the message as linked chips (`a.hq-file`), and the agent can reference them in tools (e.g. attach the PDF to a reply mail).

**Dictation**
- Click the mic or hold `⌥ Space`. The composer gets `.is-dictating`: a red record dot, timer, live waveform. Text streams into the textarea while you speak, so you can see and fix it.
- **Fertig** keeps the text (it is not sent automatically), **Verwerfen** throws it away. `Esc` = Verwerfen.
- Messages written by dictation carry a small `.via` marker (mic + "diktiert") so you know where typos come from.

**Voice conversation** opens VoiceMode for this agent; see there.

**Phone:** `+` attaches files or photos (camera included), the mic dictates on tap and records a **voice note** while held (slide left to discard); the agent gets the transcript plus the audio.
