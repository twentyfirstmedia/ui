Health at a glance: `UptimeBar` (a bar per day), `Meter` (usage against a limit), `ServerCard`, `DeployPipeline`.

UptimeBar: `days` ("ok" | "warn" | "danger" | "none" or {status, label, note}), `uptime` (percent), `caption`. Hover shows the day.
Meter: `label`, `value`, `max`, `text`, `warn` (75), `danger` (90), `tone`.
ServerCard: `name`, `provider`, `address`, `logo`, `status`, `statusLabel`, `meters` ({label, value, max, text, unknown}; value null shows "Unknown"), `uptime` (UptimeBar props), `foot`.
DeployPipeline: `stages` ({name, status: "done" | "running" | "signal" | "danger" | "idle", duration, action}).
