---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/ui": minor
"@twentyfirstmedia/elements": minor
---

Glass for the Life components, and fluid action rows.

- `VitalTile`, `JournalEntry`, `GoalCard`, `InsightCard`, `ConsentList`, `NetWorthCard` and `PolicyCard` take `surface` and turn to glass inside `<UIProvider surface="glass">`, like panels and cards. Nested in a panel they stay clear (no glass on glass).
- On glass an `InsightCard` takes a faint wash of its tone (info, success, warning, highlight).
- A sidebar on the AppShell frame is no longer a second pane of glass on the glass shell.
- The Health, Habits & journal and Life overview patterns are glass over `Ambient`.
- Action rows (dialog, card and approval footers, review, cookie, push, insight and journal actions, and a `.tf-row` of buttons placed directly in a panel, card, dialog, popover or form) measure themselves: when narrow, their buttons wrap and share the full width; when very narrow, each button takes a line.
