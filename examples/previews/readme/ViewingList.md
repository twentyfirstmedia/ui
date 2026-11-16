# ViewingList

Viewings of a property in date order: who comes, how many, the state (requested, confirmed,
done, cancelled, no-show) and the feedback afterwards as stars and a quote.

- `onConfirm(id)` shows "Confirm" on requested viewings; `onFeedback(id)` shows "Add feedback" on
  done viewings that have none yet.
