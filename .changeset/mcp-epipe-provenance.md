---
"@twentyfirstmedia/ui": patch
---

The MCP server (`twentyfirst-ui mcp`) now stops quietly when the client closes the connection, instead of crashing with an unhandled `EPIPE` error. Releases are now published with npm provenance, so every package version links back to the GitHub workflow run that built it.
