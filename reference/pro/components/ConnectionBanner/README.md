# ConnectionBanner
Shows that the live connection to the backend (SSE stream) dropped or the device is offline.

Thin full-width bar under the top bar: `warn` while reconnecting ("Verbindung unterbrochen. Neuer Versuch in 4 s"), `danger` when offline for longer, `ok` briefly on reconnect, then it disappears. While disconnected, live values show their last update time and actions that need the server are disabled with a reason.
