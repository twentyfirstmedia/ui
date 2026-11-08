---
title: AI agents and MCP
description: Give Claude Code, Cursor, VS Code and other coding agents the complete kit docs, so they build with real components instead of guessing.
---

The kits are newer than most models' training data, and the exact props matter. Two things fix that: an MCP server that answers from the docs of the exact version you installed, and plain Markdown for every page of this site.

## MCP server

The CLI includes an MCP server (stdio, no network access, the docs are bundled). One command sets it up for the clients you use and adds the kit rules to `AGENTS.md`:

```sh
npx @twentyfirstmedia/ui mcp init --kit {{kit}}
```

It writes `.mcp.json` (Claude Code), `.cursor/mcp.json` (Cursor) and `.vscode/mcp.json` (VS Code). Pick clients with `--client claude,cursor,vscode` and skip the rules with `--no-rules`.

Or add it by hand. Claude Code:

```sh
claude mcp add twentyfirst-ui -- npx -y @twentyfirstmedia/ui mcp --kit {{kit}}
```

Cursor (`.cursor/mcp.json`), Windsurf and Claude Desktop use the same shape:

```json
{
  "mcpServers": {
    "twentyfirst-ui": {
      "command": "npx",
      "args": ["-y", "@twentyfirstmedia/ui", "mcp", "--kit", "{{kit}}"]
    }
  }
}
```

VS Code (`.vscode/mcp.json`):

```json
{
  "servers": {
    "twentyfirst-ui": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@twentyfirstmedia/ui", "mcp", "--kit", "{{kit}}"]
    }
  }
}
```

Codex (`~/.codex/config.toml`):

```toml
[mcp_servers.twentyfirst-ui]
command = "npx"
args = ["-y", "@twentyfirstmedia/ui", "mcp", "--kit", "{{kit}}"]
```

### Tools

| Tool | What it returns |
| --- | --- |
| `search_docs` | Components, patterns, guides, tokens and icons that match a query |
| `list_components` | Every component page by group with a one-line summary |
| `get_component` | Description, import line, example code and props of a component |
| `get_pattern` | A complete screen built from kit parts, with its code |
| `get_guide` | Installation, CLI, theming, status and approvals, this page |
| `get_tokens` | Token names with Halo and Pro values, by group |
| `list_icons` | Every valid icon name |
| `check_usage` | Checks code: unknown components, props and icons, missing required props, colour literals |

Every page is also a resource (`twentyfirst-ui://components/ApprovalCard`, `twentyfirst-ui://guides/theming`), and the prompts `build_screen` and `review_ui` start the two most common jobs.

## Rules for agents

`mcp init` adds these to `AGENTS.md` (and `CLAUDE.md` when it exists); you can copy them by hand:

```md
{{rules}}
```

## Markdown and llms.txt

- [/llms.txt]({{site}}/llms.txt): what the kits are, the rules, and a link to every page.
- [/llms-full.txt]({{site}}/llms-full.txt): every guide and component page in one file.
- Every page has a Markdown twin: append `.md` to its path, e.g. [/{{kit}}/components/ApprovalCard.md]({{site}}/{{kit}}/components/ApprovalCard.md). The "Markdown" button at the top of each page copies it.
