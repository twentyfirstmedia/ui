# VoiceNote and VoiceLog

Voice in a text thread.

**VoiceNote**: a recorded voice message: play and pause, seek on the bars (a slider for keyboards and screen readers), the length, and the transcript behind "Show transcript". `src`, `duration` (seconds; read from the file if left out), `transcript`, `transcriptOpen` / `onTranscriptOpenChange`, `peaks` (loudness 0 to 1 for the bars), `mine` (the user's own, on the primary colour). `ChatMessage voice` uses it.

**VoiceLog**: after a voice conversation (`VoiceMode`), one folded record in the thread: `title` (default "Voice conversation"), `duration`, `time`, `turns` ({who, name, text}), `audio` (the recording, if it was kept), `open` / `defaultOpen` / `onOpenChange`.
