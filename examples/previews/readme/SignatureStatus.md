# SignatureStatus

A document out for e-signature: how many have signed, each signer's state (waiting, sent, viewed,
signed, declined) with the time, and reminders.

- `ordered` numbers the signers when they sign one after the other.
- `onRemind(id)` shows "Remind" for signers who have the document but have not signed;
  `onVoid` withdraws it.
