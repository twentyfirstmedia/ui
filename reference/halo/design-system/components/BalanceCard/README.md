Prepaid balances at providers and the health of the services the shop depends on: `BalanceCard` and `ServiceMonitor`.

BalanceCard: `name`, `sub`, `logo` or `icon` + `tint`, `balance`, `currency`, `perDay` (burn rate → "lasts about n days"), `low` (warning threshold), `spark`, `status` / `statusLabel` (override), `onTopUp`, `topUpLabel`, `action`.
ServiceMonitor: `items` ({id, name, status, statusLabel, latency (ms), errorRate (%), checked, history (statuses, oldest first)}), `label`.
