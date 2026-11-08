# VoiceInThread
What voice leaves behind in a chat.

- **Sprachgespräch record** (`details.hq-voicelog`): one collapsed line per call (who, time, duration). Open it for the full transcript; lines where the agent acted (delegated, asked for approval, called a tool) are highlighted (`.is-act`). Searchable like any message.
- **Diktiert** (`.via`): text messages written by dictation carry a small mic marker.
- **Sprachnachricht** (`.hq-voicenote`): voice notes from the phone play inline with waveform and duration; the agent works with the transcript, which sits under the note.
