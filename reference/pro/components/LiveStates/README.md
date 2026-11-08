# LiveStates
How a running agent looks while it works: thinking, streaming text, calling a tool, recording a voice message.

- Thinking: three square dots pulsing in `fg-300` plus a word ("Denkt nach …", "Liest 3 Mails …").
- Streaming: text appears token by token with a block caret `hq-caret`; no skeletons.
- Tool running: the tool row shows a Spinner and the elapsed time.
- Voice: `hq-recbar` with a red recording dot, level bars and a timer; stop with Space or the button.
All animations stop under reduced motion; the words still say what is happening.
