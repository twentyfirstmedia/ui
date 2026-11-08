---
title: CLI
description: "npx @twentyfirstmedia/ui sets up a kit, copies components into your app when you want to change them and runs the MCP server for coding agents."
---

## init

Installs the kit, imports its styles (and the Tailwind preset when the app uses Tailwind), creates `components/ui-root.tsx` with the `UIProvider`, wraps the Next.js layout and sets `data-kit` on `<html>`. Running it again changes nothing.

```sh
npx @twentyfirstmedia/ui init --kit {{kit}}
npx @twentyfirstmedia/ui init --kit {{kit}} --both   # load both kits and switch at runtime
```

## add

Copies a component, with the private helpers it needs, into `components/ui`. Everything public stays an import from `@twentyfirstmedia/ui-core`, so the copy keeps working in both kits.

```sh
npx @twentyfirstmedia/ui add ApprovalCard DataTable
```

## list and diff

`list` shows every component by group and marks the ones you copied. `diff` compares your copy with the current package source, so updates are easy to merge by hand.

```sh
npx @twentyfirstmedia/ui list
npx @twentyfirstmedia/ui diff ApprovalCard
```

## mcp

`mcp` runs the MCP server on stdio; `mcp init` writes the config for Claude Code, Cursor and VS Code and adds the kit rules to `AGENTS.md`. See [AI agents and MCP](/{{kit}}/ai/).

```sh
npx @twentyfirstmedia/ui mcp init --kit {{kit}}
npx @twentyfirstmedia/ui mcp init --client cursor --no-rules
```
