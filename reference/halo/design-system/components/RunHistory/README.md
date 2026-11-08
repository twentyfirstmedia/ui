Background work: `RunHistory` (scraping jobs, cron, imports) and `WebhookEndpoint` (an outgoing or incoming hook with its deliveries).

RunHistory: `items` ({id, name, status, started, duration, by, counts: {value, label, tone}, detail (node; makes the row expandable)}), `label`.
WebhookEndpoint: `url`, `events`, `status` + `statusLabel`, `successRate`, `enabled` + `onToggle`, `secret` (node, e.g. SecretField), `deliveries` ({id, code, event, time, ms}), `onRetry(delivery)`, `menu`, `defaultOpen`.
