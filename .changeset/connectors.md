---
"@twentyfirstmedia/ui-core": minor
"@twentyfirstmedia/halo": minor
"@twentyfirstmedia/pro": minor
"@twentyfirstmedia/ui": minor
"@twentyfirstmedia/elements": minor
---

Connectors: UI for assistants that read from and act in your services.

- `ServiceMark`: a service's brand logo, your own logo or a monogram (for brands without an open logo), with a state dot that screen readers hear in words.
- `ConnectorGallery`: every service by category with search and chips; Connect, Connected, Needs attention (Reconnect) and Coming soon.
- `ConnectionList`: connected services with account, state, how fresh the data is, Manage and Reconnect.
- `SyncStatus`: "Synced 6 minutes ago", the next sync, what it brought and why it failed, with "Sync now".
- `AgentActivity`: what agents read and changed, grouped by day, with waiting, declined, undone and failed states, "Review" and "Undo".
- `ConsentList` scopes take `level` (`read`, `act`, `money`) and `asksFirst`; the header uses `ServiceMark`.
- `formatRelative` and `useFormat().formatRelative`: "6 minutes ago", "in 1 hour", "yesterday" with `Intl.RelativeTimeFormat`.
- 72 more brand logos (Gmail, Google Calendar, Docs, Sheets, Photos, Maps, Home, Tesla, Commerzbank, N26, tado°, SmartThings, Booking.com, Netflix, Strava, Garmin, Philips Hue, Deutsche Bahn …) and 18 line icons for home, devices and travel.
- Patterns Connections, Connect a service and Agent activity in a new docs group "Connectors".
