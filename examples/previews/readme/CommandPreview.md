# CommandPreview

A shell command an agent wants to run on a server: the command exactly as it runs, word by word (`argv`) when no shell reads it, the server and access, the risk (`read`, `change`, `critical`), the timeout and the state read before asking (a status or log excerpt, verbatim). Ends with "Runs once after A". Pair it with `ApprovalCard stepUp` for critical commands, and `CommandWhitelist` for what may run at all.
