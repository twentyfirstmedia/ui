# SshWhitelist
The exact commands the deploy agent may run on production, and the attempts that were blocked.

Allowed commands as mono rows with the server and who added them; patterns are literal (no `bash`, `sh`, pipes, `&&`, redirects, or wildcards beyond declared arguments) and the editor refuses such entries with a reason. Below, blocked attempts in `danger-bg` with time and agent. Changes to the list are themselves approvals and land in the audit log.
