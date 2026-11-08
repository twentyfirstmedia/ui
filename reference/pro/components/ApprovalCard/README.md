# ApprovalCard
The human-in-the-loop decision: what an agent wants to do, with the exact payload, and the four answers A–D.

**Anatomy**
- Header on `signal-bg`: diamond + "Freigabe nötig", agent and project, risk family badge (Geld, Infrastruktur, Eigene Apps, Kommunikation), age.
- Body: the action in one bold sentence, the reason in `fg-200`, the payload verbatim in a `bg-000` box (mail text, amount, command, DNS change).
- Options as full-width rows with their letter key: **A Ja, so ausführen** (primary), **B Ja, mit Änderung**, **C Nein, verwerfen**, **D Andere Anweisung**. B and D open a text field inline.
- Footer: escalation time ("Eskaliert an Lukas in 1:52 h"), link to the trace.

**Rules**
- The payload is exactly what will be executed; never a summary of it.
- A–D work as keyboard shortcuts when the card has focus, and as actions in the push notification.
- On mobile the card fills the screen and options stay at the bottom within thumb reach.
- After a decision the card collapses to one line with the decider and time (audit).
