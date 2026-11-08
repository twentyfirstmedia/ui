---
"@twentyfirstmedia/ui": minor
"@twentyfirstmedia/ui-core": patch
---

The CLI ships an MCP server for coding agents: `twentyfirst-ui mcp` (stdio, offline, the docs are bundled) with the tools `search_docs`, `list_components`, `get_component`, `get_pattern`, `get_guide`, `get_tokens`, `list_icons` and `check_usage`, every page as a resource, and the prompts `build_screen` and `review_ui`. `twentyfirst-ui mcp init` registers it for Claude Code, Cursor and VS Code and adds the kit rules to `AGENTS.md`.
