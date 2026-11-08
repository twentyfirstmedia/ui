# Status and approvals

The vocabulary every screen uses for agent and system state, and the rules for asking a human.

## One state model

| State | Shape | Token | Agent wording | System wording |
| --- | --- | --- | --- | --- |
| Running | pulsing dot | `info` | Arbeitet | Läuft, Synchronisiert |
| Needs a human | diamond | `signal` | Wartet auf Freigabe | Bestätigung nötig |
| Done / healthy | dot | `ok` | Erledigt | Online, Gültig, Gebucht |
| Warning | triangle | `warn` | Pausiert · Budget | Läuft ab, Budget 82 % |
| Error | square | `danger` | Fehler | Fehlgeschlagen, Offline |
| Idle | ring | `fg-300` | Bereit | Inaktiv, Pausiert |

Use exactly these words. A state is always shape + word, except in dense columns whose header already names the state.

## Approvals

- An approval shows **what will be executed, verbatim**: the full mail, the exact amount and recipient, the exact command, the DNS change before and after.
- Four answers, always in this order and with these keys: **A** Ja, so ausführen · **B** Ja, mit Änderung · **C** Nein, verwerfen · **D** Andere Anweisung.
- The risk family is visible on every approval: Kommunikation, Marketing, Infrastruktur, Eigene Apps, Geld.
- The escalation time is visible ("Eskaliert an Lukas in 1:52 h"). Nothing is ever executed automatically when time runs out.
- Approvals appear in four places with the same content: ApprovalInbox, inline in AgentChat, as a beacon on the building in the city, and as a push notification with A–D actions.
- A decided approval collapses to one line: decision, who, when. It stays in the audit log.

## Attention budget

Only `signal` may pull attention without the user asking. If a screen shows more than one signal element per object, merge them. Warnings and errors stay in their own area (banner, row) and do not animate.
