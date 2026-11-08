# VoiceMode
Talk to the Main Brain or any agent instead of typing. Same agent, same tools, same approvals, same thread: voice is just another channel.

**Start:** waveform button in the composer or the chat header, the city side panel, or on the phone. The chat area turns into `.hq-voice`; the conversation list and details stay where they are.

**States** (`data-state`)
- `listening` · *Hört zu*: live waveform of your mic, your words appear in grey as you speak.
- `thinking` · *Denkt nach*: the avatar breathes; tool calls run like in text (visible later in the thread).
- `speaking` · *Spricht*: rings in the project colour, the sentence being spoken is shown large. **You can interrupt any time by just talking** (barge-in) or with **Unterbrechen**.
- `approval` · *Wartet auf deine Entscheidung*: an approval comes up as the usual card; you answer by voice ("A", "B, aber nur 50 Euro", "C", "D: erst mit Lukas abstimmen") or tap. Money, legal and infra approvals ask for a spoken confirmation of the amount or target before executing.

**Controls:** Stumm (mic off, agent keeps talking), Unterbrechen, Zum Text-Chat (ends voice, keeps context), timer, **Beenden** (red). Keyboard: `Space` hold to talk when muted, `Esc` ends.

**After the call** the thread gets a collapsible record (VoiceInThread) with the full transcript; results, delegations and approvals appear as normal messages. Audio is not stored by default, only the transcript (setting per project).

**Phone:** full screen with big controls (Stumm, Lautsprecher, Tippen, Beenden); keeps running with the screen locked via the Web Audio session, push brings you back.

**Tech (decided in the plan):** streaming STT → agent → streaming TTS with voice activity detection and barge-in, EU-hosted or DSGVO-compliant providers, one voice per agent configurable (Main Brain neutral, project agents in their brand tone).
