import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PassThrough } from "node:stream";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { run } from "./index.js";
import type { Knowledge } from "./knowledge.js";
import { RULES_END, RULES_START } from "./mcp-init.js";
import {
  createServer,
  LATEST_PROTOCOL_VERSION,
  serveStdio,
  type JsonRpcResponse,
  type McpServer,
  type ToolResult,
} from "./mcp.js";
import type { Logger } from "./util.js";

const PKG = fileURLToPath(new URL("..", import.meta.url));
const ROOT = join(PKG, "../..");
const tmp = mkdtempSync(join(tmpdir(), "tf-mcp-test-"));
let k: Knowledge;
let server: McpServer;
let nextId = 1;

beforeAll(() => {
  const file = join(tmp, "knowledge.json");
  execFileSync(process.execPath, [join(ROOT, "scripts/knowledge.ts"), file], { stdio: "pipe" });
  k = JSON.parse(readFileSync(file, "utf8")) as Knowledge;
  server = createServer(k, { kit: "halo" });
});
afterAll(() => rmSync(tmp, { recursive: true, force: true }));

async function request(method: string, params?: Record<string, unknown>) {
  const res = await server.handle({ jsonrpc: "2.0", id: nextId++, method, params });
  if (!res) throw new Error("no response");
  return res;
}
async function result<T = Record<string, unknown>>(
  method: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const res = await request(method, params);
  if ("error" in res) throw new Error(`${res.error.code} ${res.error.message}`);
  return res.result as T;
}
const errorOf = (res: JsonRpcResponse) => ("error" in res ? res.error : undefined);
async function tool(name: string, args: Record<string, unknown> = {}) {
  const r = await result<ToolResult>("tools/call", { name, arguments: args });
  return { text: r.content.map((c) => c.text).join("\n"), isError: r.isError === true };
}

describe("mcp protocol", () => {
  it("initialize negotiates the protocol version", async () => {
    const r = await result<{
      protocolVersion: string;
      capabilities: Record<string, unknown>;
      serverInfo: { name: string; title: string; version: string };
      instructions: string;
    }>("initialize", {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "test", version: "1" },
    });
    expect(r.protocolVersion).toBe("2025-06-18");
    expect(r.capabilities).toEqual({ tools: {}, resources: {}, prompts: {} });
    expect(r.serverInfo).toEqual({
      name: "twentyfirst-ui",
      title: "Twentyfirst UI",
      version: k.version,
    });
    expect(r.instructions).toContain("@twentyfirstmedia/halo");
    expect(r.instructions).toContain("check_usage");
    for (const v of ["2024-11-05", "2025-03-26", "2025-11-25"])
      expect(
        (await result<{ protocolVersion: string }>("initialize", { protocolVersion: v }))
          .protocolVersion,
      ).toBe(v);
    const future = await result<{ protocolVersion: string }>("initialize", {
      protocolVersion: "2099-01-01",
    });
    expect(future.protocolVersion).toBe(LATEST_PROTOCOL_VERSION);
  });

  it("notifications and responses get no answer", async () => {
    expect(await server.handle({ jsonrpc: "2.0", method: "notifications/initialized" })).toBeNull();
    expect(
      await server.handle({
        jsonrpc: "2.0",
        method: "notifications/cancelled",
        params: { requestId: 1 },
      }),
    ).toBeNull();
    expect(await server.handle({ jsonrpc: "2.0", id: 5, result: {} })).toBeNull();
  });

  it("ping, unknown methods and invalid messages", async () => {
    expect(await result("ping")).toEqual({});
    expect(errorOf(await request("nope/nothing"))?.code).toBe(-32601);
    expect(errorOf((await server.handle({ id: 1, method: "ping" }))!)?.code).toBe(-32600);
    expect(
      errorOf((await server.handle({ jsonrpc: "2.0", id: 1, method: "ping", params: [1] }))!)?.code,
    ).toBe(-32602);
  });

  it("tools/list has all eight tools with schemas and read-only annotations", async () => {
    const { tools } = await result<{
      tools: {
        name: string;
        description: string;
        inputSchema: { type: string; required?: string[] };
        annotations: Record<string, unknown>;
      }[];
    }>("tools/list");
    expect(tools.map((t) => t.name)).toEqual([
      "search_docs",
      "list_components",
      "get_component",
      "get_pattern",
      "get_guide",
      "get_tokens",
      "list_icons",
      "check_usage",
    ]);
    for (const t of tools) {
      expect(t.description.length).toBeGreaterThan(40);
      expect(t.inputSchema.type).toBe("object");
      expect(t.annotations).toMatchObject({ readOnlyHint: true, openWorldHint: false });
    }
    expect(tools.find((t) => t.name === "get_component")?.inputSchema.required).toEqual(["name"]);
  });

  it("tools/call with an unknown tool or bad params is a protocol error", async () => {
    expect(errorOf(await request("tools/call", { name: "rm_rf" }))?.code).toBe(-32602);
    expect(errorOf(await request("tools/call", {}))?.code).toBe(-32602);
    expect(errorOf(await request("tools/call", { name: "list_icons", arguments: "x" }))?.code).toBe(
      -32602,
    );
  });
});

describe("mcp tools", () => {
  it("search_docs ranks hits and names the next tool", async () => {
    const r = await tool("search_docs", { query: "approval", limit: 5 });
    expect(r.isError).toBe(false);
    expect(r.text).toContain("[component] Approval Card");
    expect(r.text).toContain('get_component {"name":"ApprovalCard"}');
    expect(r.text.match(/^\d+\. /gm)).toHaveLength(5);
    expect((await tool("search_docs", { query: "surface" })).text).toContain(
      'get_tokens {"group":"color"}',
    );
    expect((await tool("search_docs", { query: "zzqqxx" })).text).toContain("No results");
    expect((await tool("search_docs", {})).isError).toBe(true);
  });

  it("list_components lists groups and patterns", async () => {
    const all = await tool("list_components");
    expect(all.text).toContain("## Forms");
    expect(all.text).toContain("- DatePicker");
    expect(all.text).toContain("## Patterns");
    expect(all.text).toContain("- SettingsScreen");
    const forms = await tool("list_components", { group: "Forms" });
    expect(forms.text).toContain("## Forms");
    expect(forms.text).not.toContain("## Navigation");
    expect(forms.text).not.toContain("## Patterns");
    expect((await tool("list_components", { group: "Patterns" })).text).not.toContain("## Forms");
    const bad = await tool("list_components", { group: "Spaceships" });
    expect(bad.isError).toBe(true);
    expect(bad.text).toContain("Forms");
  });

  it("get_component returns docs by name, title or kit", async () => {
    const tabs = await tool("get_component", { name: "Tabs" });
    expect(tabs.isError).toBe(false);
    expect(tabs.text).toMatch(/^# Tabs/);
    expect(tabs.text).toContain('from "@twentyfirstmedia/halo"');
    expect(tabs.text).toContain("## Import");
    expect(tabs.text).toContain("## Props");
    const picker = await tool("get_component", { name: "Date picker", kit: "pro" });
    expect(picker.text).toMatch(/^# Date Picker/);
    expect(picker.text).toContain('from "@twentyfirstmedia/pro"');
    expect(picker.text).not.toContain("@twentyfirstmedia/ui-core");
    // a component without a page of its own
    const button = await tool("get_component", { name: "button" });
    expect(button.text).toMatch(/^# Button/);
    expect(button.text).toContain('import { Button } from "@twentyfirstmedia/halo";');
    expect(button.text).toContain("`variant?`");
  });

  it("get_component suggests close names for unknown ones", async () => {
    const typo = await tool("get_component", { name: "Buton" });
    expect(typo.isError).toBe(true);
    expect(typo.text).toContain('No component named "Buton"');
    expect(typo.text).toContain("- Button");
    const tabPanel = await tool("get_component", { name: "TabPanel" });
    expect(tabPanel.text).toContain("- Tabs");
    expect((await tool("get_component", { name: "Tabs", kit: "material" })).isError).toBe(true);
  });

  it("get_pattern returns a screen with its code", async () => {
    const r = await tool("get_pattern", { name: "settings" });
    expect(r.isError).toBe(false);
    expect(r.text).toMatch(/^# Settings/);
    expect(r.text).toContain("## Code");
    expect(r.text).toContain("Pattern · Halo kit");
    expect((await tool("get_pattern", { name: "real-estate" })).text).toMatch(/^# Real estate/);
    const bad = await tool("get_pattern", { name: "Tabs" });
    expect(bad.isError).toBe(true);
    expect(bad.text).toContain("get_component");
    expect(bad.text).toContain("SettingsScreen");
  });

  it("get_guide renders a guide for the kit", async () => {
    const r = await tool("get_guide", { topic: "ai", kit: "pro" });
    expect(r.text).toMatch(/^# AI agents and MCP/);
    expect(r.text).toContain("mcp init --kit pro");
    expect(r.text).not.toContain("{{");
    expect((await tool("get_guide", { topic: "introduction" })).isError).toBe(false);
    const bad = await tool("get_guide", { topic: "astrology" });
    expect(bad.isError).toBe(true);
    expect(bad.text).toContain("installation");
  });

  it("get_tokens returns token tables", async () => {
    const all = await tool("get_tokens");
    expect(all.text).toContain("## Colour");
    expect(all.text).toContain("`--surface`");
    const radius = await tool("get_tokens", { group: "radius" });
    expect(radius.text).toContain("## Radius");
    expect(radius.text).not.toContain("## Colour");
    expect((await tool("get_tokens", { group: "glitter" })).isError).toBe(true);
  });

  it("list_icons lists every icon", async () => {
    const r = await tool("list_icons");
    for (const i of k.icons.slice(0, 5)) expect(r.text).toContain(i);
    expect(r.text).toContain(`${k.icons.length} icons`);
  });

  it("check_usage reports findings with line numbers", async () => {
    const r = await tool("check_usage", {
      code: [
        'import { Button, Fancy } from "@twentyfirstmedia/halo";',
        "",
        'export const A = () => <Button icon="nope" style={{ color: "#ff0000" }}>Go</Button>;',
      ].join("\n"),
    });
    expect(r.isError).toBe(false);
    expect(r.text).toMatch(/^\d+ errors?, \d+ warnings?:/);
    expect(r.text).toContain("- Line 1 · error: `Fancy` is not exported");
    expect(r.text).toContain('- Line 3 · error: Unknown icon "nope"');
    expect(r.text).toContain("- Line 3 · warning: Colour literal");
    const ok = await tool("check_usage", {
      code: 'import { Button } from "@twentyfirstmedia/halo";\nexport const A = () => <Button variant="primary">Go</Button>;',
    });
    expect(ok.text).toContain("No problems found");
    expect((await tool("check_usage", {})).isError).toBe(true);
  });
});

describe("mcp resources and prompts", () => {
  it("lists guides, components, patterns and templates", async () => {
    const { resources } = await result<{ resources: { uri: string; mimeType: string }[] }>(
      "resources/list",
    );
    const uris = resources.map((r) => r.uri);
    expect(uris).toContain("twentyfirst-ui://llms-full");
    expect(uris).toContain("twentyfirst-ui://guides/theming");
    expect(uris).toContain("twentyfirst-ui://components/ApprovalCard");
    expect(uris).toContain("twentyfirst-ui://patterns/SettingsScreen");
    expect(resources.length).toBe(3 + k.guides.length + k.components.length + k.patterns.length);
    expect(resources.every((r) => r.mimeType === "text/markdown")).toBe(true);
    const { resourceTemplates } = await result<{ resourceTemplates: { uriTemplate: string }[] }>(
      "resources/templates/list",
    );
    expect(resourceTemplates.map((t) => t.uriTemplate)).toContain(
      "twentyfirst-ui://components/{name}",
    );
  });

  it("reads resources as Markdown", async () => {
    const read = async (uri: string) =>
      (
        await result<{ contents: { uri: string; mimeType: string; text: string }[] }>(
          "resources/read",
          { uri },
        )
      ).contents[0];
    const card = await read("twentyfirst-ui://components/ApprovalCard");
    expect(card?.uri).toBe("twentyfirst-ui://components/ApprovalCard");
    expect(card?.mimeType).toBe("text/markdown");
    expect(card?.text).toMatch(/^# Approval Card/);
    expect((await read("twentyfirst-ui://components/Button"))?.text).toMatch(/^# Button/);
    expect((await read("twentyfirst-ui://guides/theming"))?.text).toContain("## Colour");
    expect((await read("twentyfirst-ui://patterns/SettingsScreen"))?.text).toMatch(/^# Settings/);
    expect((await read("twentyfirst-ui://llms-full"))?.text).toContain("# Components");
    expect(
      errorOf(await request("resources/read", { uri: "twentyfirst-ui://components/Nope" }))?.code,
    ).toBe(-32002);
    expect(errorOf(await request("resources/read", { uri: "https://example.com" }))?.code).toBe(
      -32002,
    );
    expect(errorOf(await request("resources/read", {}))?.code).toBe(-32602);
  });

  it("prompts build_screen and review_ui", async () => {
    const { prompts } = await result<{
      prompts: { name: string; arguments: { name: string; required: boolean }[] }[];
    }>("prompts/list");
    expect(prompts.map((p) => p.name)).toEqual(["build_screen", "review_ui"]);
    expect(prompts[0]?.arguments).toEqual([
      expect.objectContaining({ name: "description", required: true }),
    ]);
    const build = await result<{
      messages: { role: string; content: { type: string; text: string } }[];
    }>("prompts/get", { name: "build_screen", arguments: { description: "A team settings page" } });
    const text = build.messages[0]?.content.text ?? "";
    expect(build.messages[0]?.role).toBe("user");
    expect(text).toContain("A team settings page");
    for (const t of ["search_docs", "get_component", "get_pattern", "check_usage"])
      expect(text).toContain(t);
    const review = await result<{ messages: { content: { text: string } }[] }>("prompts/get", {
      name: "review_ui",
      arguments: { code: "<Button>Go</Button>" },
    });
    expect(review.messages[0]?.content.text).toContain("<Button>Go</Button>");
    expect(review.messages[0]?.content.text).toContain("check_usage");
    expect(
      errorOf(await request("prompts/get", { name: "build_screen", arguments: {} }))?.code,
    ).toBe(-32602);
    expect(errorOf(await request("prompts/get", { name: "poem" }))?.code).toBe(-32602);
  });
});

describe("mcp stdio", () => {
  it("handles partial lines, several messages per chunk, parse errors and end of input", async () => {
    const input = new PassThrough();
    const output = new PassThrough();
    let written = "";
    output.on("data", (c: Buffer) => (written += c.toString("utf8")));
    const done = serveStdio(createServer(k, { kit: "pro" }), { input, output, onError: () => {} });
    input.write('{"jsonrpc":"2.0","id":1,"method":"pi');
    input.write(
      'ng"}\n{"jsonrpc":"2.0","method":"notifications/initialized"}\n{"jsonrpc":"2.0","id":2,',
    );
    input.write('"method":"tools/list"}\r\nnot json\n\n');
    input.end('{"jsonrpc":"2.0","id":3,"method":"ping"}');
    await done;
    const lines = written
      .trim()
      .split("\n")
      .map((l) => JSON.parse(l) as JsonRpcResponse);
    expect(lines.map((l) => l.id)).toEqual([1, 2, null, 3]);
    expect(errorOf(lines[2]!)?.code).toBe(-32700);
    expect("result" in lines[1]! && (lines[1].result as { tools: unknown[] }).tools).toHaveLength(
      8,
    );
  });

  it("talks to the official MCP client over stdio", async () => {
    // compile the CLI into a temp dir with the bundled docs, like the published package
    const out = join(tmp, "dist");
    const tsc = createRequire(join(PKG, "package.json")).resolve("typescript/bin/tsc");
    execFileSync(
      process.execPath,
      [
        tsc,
        "-p",
        join(PKG, "tsconfig.build.json"),
        "--outDir",
        out,
        "--declaration",
        "false",
        "--declarationMap",
        "false",
        "--sourceMap",
        "false",
      ],
      { stdio: "pipe" },
    );
    execFileSync(
      process.execPath,
      [join(ROOT, "scripts/knowledge.ts"), join(out, "knowledge.json")],
      { stdio: "pipe" },
    );

    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [join(out, "index.js"), "mcp", "--kit", "pro"],
      cwd: tmp,
      stderr: "pipe",
    });
    const client = new Client({ name: "vitest", version: "1.0.0" });
    await client.connect(transport);
    try {
      expect(client.getServerVersion()?.name).toBe("twentyfirst-ui");
      expect(client.getInstructions()).toContain("@twentyfirstmedia/pro");
      const { tools } = await client.listTools();
      expect(tools).toHaveLength(8);
      const r = await client.callTool({
        name: "get_component",
        arguments: { name: "ApprovalCard" },
      });
      const content = r.content as { type: string; text: string }[];
      expect(content[0]?.text).toMatch(/^# Approval Card/);
      expect(content[0]?.text).toContain('from "@twentyfirstmedia/pro"');
      const res = await client.readResource({ uri: "twentyfirst-ui://guides/theming" });
      expect((res.contents[0] as { text: string }).text).toMatch(/^# Theming/);
      const p = await client.getPrompt({
        name: "build_screen",
        arguments: { description: "Billing page" },
      });
      expect((p.messages[0]?.content as { text: string }).text).toContain("Billing page");
    } finally {
      await client.close();
    }
  });
});

describe("mcp init", () => {
  let dir = "";
  const out: string[] = [];
  const log: Logger = { log: (m) => out.push(m), warn: (m) => out.push(m) };
  const json = (p: string) =>
    JSON.parse(readFileSync(join(dir, p), "utf8")) as Record<string, Record<string, unknown>>;
  const text = (p: string) => readFileSync(join(dir, p), "utf8");
  const fresh = () => {
    if (dir) rmSync(dir, { recursive: true, force: true });
    dir = mkdtempSync(join(tmp, "init-"));
  };
  const args = (kit: string) => ["-y", "@twentyfirstmedia/ui", "mcp", "--kit", kit];
  afterAll(() => dir && rmSync(dir, { recursive: true, force: true }));

  it("writes the three client configs and AGENTS.md", () => {
    fresh();
    expect(run(["mcp", "init", "--kit", "pro", "--cwd", dir], log)).toBe(0);
    expect(json(".mcp.json").mcpServers).toEqual({
      "twentyfirst-ui": { command: "npx", args: args("pro") },
    });
    expect(json(".cursor/mcp.json").mcpServers).toEqual({
      "twentyfirst-ui": { command: "npx", args: args("pro") },
    });
    expect(json(".vscode/mcp.json").servers).toEqual({
      "twentyfirst-ui": { type: "stdio", command: "npx", args: args("pro") },
    });
    const agents = text("AGENTS.md");
    expect(agents).toContain(RULES_START);
    expect(agents).toContain("## Twentyfirst UI");
    expect(agents).toContain("@twentyfirstmedia/pro");
    expect(agents).toContain(RULES_END);
    expect(existsSync(join(dir, "CLAUDE.md"))).toBe(false);
    expect(out.join("\n")).toContain(".cursor/mcp.json");
  });

  it("merges with existing configs and is idempotent", () => {
    fresh();
    writeFileSync(
      join(dir, ".mcp.json"),
      JSON.stringify({ mcpServers: { other: { command: "other-mcp" } }, extra: 1 }),
    );
    writeFileSync(
      join(dir, "twentyfirst.json"),
      JSON.stringify({ kit: "pro", components: "components/ui" }),
    );
    writeFileSync(join(dir, "CLAUDE.md"), "# Project\n\nOwn notes.\n");
    expect(run(["mcp", "init", "--cwd", dir], log)).toBe(0);
    const cfg = json(".mcp.json");
    expect(cfg.extra).toBe(1);
    expect(cfg.mcpServers).toEqual({
      other: { command: "other-mcp" },
      "twentyfirst-ui": { command: "npx", args: args("pro") }, // kit from twentyfirst.json
    });
    const claude = text("CLAUDE.md");
    expect(claude.startsWith("# Project\n\nOwn notes.\n\n<!-- twentyfirst-ui:start -->")).toBe(
      true,
    );
    const files = [".mcp.json", ".cursor/mcp.json", ".vscode/mcp.json", "AGENTS.md", "CLAUDE.md"];
    const before = files.map(text);
    out.length = 0;
    expect(run(["mcp", "init", "--cwd", dir], log)).toBe(0);
    expect(files.map(text)).toEqual(before);
    expect(out.join("\n")).toContain("unchanged");
  });

  it("replaces the rules block instead of adding a second one", () => {
    expect(run(["mcp", "init", "--kit", "halo", "--cwd", dir], log)).toBe(0);
    for (const f of ["AGENTS.md", "CLAUDE.md"]) {
      const t = text(f);
      expect(t.split(RULES_START)).toHaveLength(2);
      expect(t).toContain("@twentyfirstmedia/halo");
      expect(t).not.toContain("`@twentyfirstmedia/pro`");
    }
    expect(text("CLAUDE.md")).toContain("Own notes.");
    expect(
      (json(".mcp.json").mcpServers as Record<string, { args: string[] }>)["twentyfirst-ui"]?.args,
    ).toEqual(args("halo"));
  });

  it("--no-rules skips AGENTS.md and --client picks clients", () => {
    fresh();
    expect(run(["mcp", "init", "--client", "cursor", "--no-rules", "--cwd", dir], log)).toBe(0);
    expect(json(".cursor/mcp.json").mcpServers).toEqual({
      "twentyfirst-ui": { command: "npx", args: args("halo") },
    });
    for (const f of [".mcp.json", ".vscode/mcp.json", "AGENTS.md"])
      expect(existsSync(join(dir, f))).toBe(false);
    expect(run(["mcp", "init", "--client=claude,vscode", "--no-rules", "--cwd", dir], log)).toBe(0);
    expect(existsSync(join(dir, ".mcp.json"))).toBe(true);
    expect(existsSync(join(dir, ".vscode/mcp.json"))).toBe(true);
    expect(existsSync(join(dir, "AGENTS.md"))).toBe(false);
  });

  it("refuses unknown clients, kits and broken JSON", () => {
    fresh();
    out.length = 0;
    expect(run(["mcp", "init", "--client", "emacs", "--cwd", dir], log)).toBe(1);
    expect(out.join("\n")).toContain("--client");
    expect(run(["mcp", "init", "--kit", "material", "--cwd", dir], log)).toBe(1);
    writeFileSync(join(dir, ".mcp.json"), "{ not json");
    out.length = 0;
    expect(run(["mcp", "init", "--client", "claude", "--cwd", dir], log)).toBe(1);
    expect(out.join("\n")).toContain("not valid JSON");
    expect(text(".mcp.json")).toBe("{ not json");
  });
});
