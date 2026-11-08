Platform structure: `ConfigPRSummary` (a proposed config change in plain language) and `ModuleRegistry` (installed modules).

ConfigPRSummary: `title`, `meta`, `status` + `statusLabel`, `summary`, `items` ({kind: "project" | "team" | "agent" | "tool" | "trigger" | "file", name, detail, op: "add" | "change" | "remove"}), `actions`.
ModuleRegistry: `items` ({id, name, version, text, icon, core, enabled, adds}), `onToggle(module)`, `coreLabel`.
