# EventInvite

An invitation inside a mail: date, time, place, organizer and guests, what else is in the calendar at that time (`others`, `[]` for "nothing else"), and Accept, Maybe and Decline with "Add to calendar".

- `status="updated"` marks changes from the organizer (`changes` says what), `status="cancelled"` strikes it through and offers "Remove from calendar" (`onRemove`) when it is in the calendar.
- `response`/`onRespond` (or `defaultResponse`) hold your reply; `busy` while it is being sent.
