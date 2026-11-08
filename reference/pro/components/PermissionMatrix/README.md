# PermissionMatrix
Which agent may use which tool, and whether it needs approval: agents × tool families at a glance.

Rows: agents (grouped by project). Columns: tools, grouped by family (Kommunikation, Marketing, Infrastruktur, Eigene Apps, Geld). Cells: `check` = allowed, signal diamond on `signal-bg` = allowed with approval, `–` = not assigned. Read-only in HQ: assignments change through config PRs. A Geld or Infrastruktur cell without approval is impossible by design.
