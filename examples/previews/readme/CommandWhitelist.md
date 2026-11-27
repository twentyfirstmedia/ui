# CommandWhitelist

The commands an agent may run, per server: the template with its `{parameters}` marked, what each parameter accepts (fixed values or a pattern), the risk (read only, changes, critical) and whether it needs an approval (by default everything that is not read only). `blocked` lists patterns refused on every server; `actions(command, server)` adds row controls. On phones the risk and approval move under the command.
