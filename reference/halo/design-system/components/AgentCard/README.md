One agent at a glance (`AgentCard`) and everything about it beside a chat (`AgentDetails`).

AgentCard: `name`, `role`, `tint`, `status` + `statusLabel`, `model`, `cost`, `last`, `onClick`, `onChat`.
AgentDetails: `name`, `role`, `tint`, `status` + `statusLabel`, `sections` ({title, meta, items (KeyValue) or children, open}), `actions`.
