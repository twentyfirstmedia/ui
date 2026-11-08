# CommandPalette
⌘K overlay to jump anywhere and run any action: open a module, an agent, a mailbox, a domain, or ask the Main Brain.

- 560px wide, centered top-third, `shadow-overlay`, over `scrim`.
- 44px input without border; results grouped by eyebrow (Springen, Aktionen, Agents, Postfächer, Domains).
- Rows: icon, label, meta in mono, shortcut right; active row `bg-300`. Arrow keys move, Enter runs, Esc closes.
- The last group is always "Main Brain fragen: …" with the typed text, so a question never dead-ends.
- Modules contribute commands through their manifest.
