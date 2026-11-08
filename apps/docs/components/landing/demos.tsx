"use client";
import {
  ApprovalCard,
  AvatarStack,
  Badge,
  Button,
  ChatMessage,
  CodeBlock,
  LineChart,
  Panel,
  Progress,
  StatCell,
  StatusIndicator,
  Switch,
  Tabs,
  TextField,
  ToolCall,
  UIProvider,
  type ApprovalDecision,
} from "@twentyfirstmedia/ui-core";
import { useState } from "react";
import { useKit, usePageTheme } from "./shell";

/** The install command for the kit the page shows. */
export function InstallCommand() {
  const { kit } = useKit();
  return <CodeBlock lang="sh" code={`npx @twentyfirstmedia/ui init --kit ${kit}`} />;
}

/** A small working screen in the hero: figures, a chart and an approval you can answer. */
export function HeroDemo() {
  const [decision, setDecision] = useState<ApprovalDecision | null>(null);
  return (
    <div className="lp-window" role="group" aria-label="Example screen built with the kit">
      <div className="lp-window-bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <b>Northwind · Overview</b>
      </div>
      <div className="lp-window-body">
        <div className="lp-window-stats">
          <StatCell
            label="Revenue"
            value="€48,120"
            delta={12.4}
            compare="vs last month"
            spark={[3, 4, 4, 6, 5, 7, 8]}
          />
          <StatCell
            label="Active seats"
            value="1,284"
            delta={4.1}
            compare="vs last month"
            spark={[5, 6, 5, 7, 6, 8, 9]}
          />
        </div>
        <Panel
          title="Weekly revenue"
          action={
            <Badge tone="success" dot>
              Live
            </Badge>
          }
        >
          <LineChart
            label="Weekly revenue"
            labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            series={[{ values: [32, 41, 38, 52, 49, 61, 66], tint: "sky", area: true }]}
            height={120}
          />
        </Panel>
        <ApprovalCard
          compact
          agent="Ledger"
          project="Finance"
          family="money"
          age="2 min"
          title="Refund €120.00 to Ida Brandt"
          decision={decision}
          onDecide={(key, text) => setDecision({ key, by: "You", at: "now", text })}
        />
      </div>
    </div>
  );
}

const PARITY_CODE = `<Panel title="Workspace">
  <TextField label="Name" defaultValue="Northwind" />
  <Switch defaultChecked>Weekly digest</Switch>
  <Progress label="Seats used" value={72} />
  <StatusIndicator status="ok" label="All systems normal" />
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Save</Button>
</Panel>`;

export function ParityCard({ id }: { id: string }) {
  return (
    <Panel
      title="Workspace"
      action={<AvatarStack names={["Mara Ellis", "Jonah Petit", "Sun Lee"]} size={24} />}
    >
      <div className="lp-parity-form">
        <TextField id={`${id}-name`} label="Name" defaultValue="Northwind" />
        <Switch defaultChecked>Weekly digest</Switch>
        <Progress label="Seats used" value={72} />
        <StatusIndicator status="ok" label="All systems normal" />
        <div className="lp-parity-actions">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Save</Button>
        </div>
      </div>
    </Panel>
  );
}

/** The same markup rendered by both kits at once, next to its code. */
export function ParityDemo() {
  const theme = usePageTheme();
  return (
    <div className="lp-parity">
      <div className="lp-parity-code">
        <CodeBlock lang="tsx" code={PARITY_CODE} />
      </div>
      <div className="lp-parity-frames">
        {(["halo", "pro"] as const).map((k) => (
          <figure key={k} className="lp-parity-frame">
            <figcaption>{k === "halo" ? "Halo" : "Pro"}</figcaption>
            <UIProvider scope="subtree" kit={k} theme={theme} className="lp-parity-inner">
              <ParityCard id={k} />
            </UIProvider>
          </figure>
        ))}
      </div>
    </div>
  );
}

/** An agent building with the kit through the MCP server. */
export function AgentDemo() {
  const { kit } = useKit();
  return (
    <div className="lp-agent-chat" role="group" aria-label="A coding agent using the MCP server">
      <ChatMessage
        role="user"
        name="You"
        actions={false}
        text="Add a billing page with the plan, seats and invoices."
      />
      <div className="lp-agent-tools">
        <ToolCall
          name="search_docs"
          icon="search"
          status="done"
          duration="12 ms"
          summary="“billing plan invoices”: PlanCard, LedgerTable, SettingsLayout"
        />
        <ToolCall
          name="get_pattern"
          icon="layers"
          status="done"
          duration="4 ms"
          summary="SettingsScreen: layout, sections and code"
        />
        <ToolCall
          name="check_usage"
          icon="check"
          status="done"
          duration="9 ms"
          summary="No problems found"
        />
      </div>
      <ChatMessage
        role="assistant"
        name="Agent"
        actions={false}
        text={`Done: \`app/billing/page.tsx\` uses SettingsLayout, PlanCard, UsageMeter and LedgerTable from \`@twentyfirstmedia/${kit}\`. Tokens only, so it works in both kits, light and dark.`}
      />
    </div>
  );
}

const mcpArgs = (kit: string) => `["-y", "@twentyfirstmedia/ui", "mcp", "--kit", "${kit}"]`;

/** Setup per client. */
export function AgentSetup({ site }: { site: string }) {
  const { kit } = useKit();
  return (
    <Tabs
      label="Set up your agent"
      items={["Claude Code", "Cursor", "VS Code", "Any LLM"]}
      panels={{
        "Claude Code": (
          <CodeBlock
            lang="sh"
            code={`npx @twentyfirstmedia/ui mcp init --client claude\n# or\nclaude mcp add twentyfirst-ui -- npx -y @twentyfirstmedia/ui mcp --kit ${kit}`}
          />
        ),
        Cursor: (
          <CodeBlock
            lang="json"
            code={`// .cursor/mcp.json\n{\n  "mcpServers": {\n    "twentyfirst-ui": { "command": "npx", "args": ${mcpArgs(kit)} }\n  }\n}`}
          />
        ),
        "VS Code": (
          <CodeBlock
            lang="json"
            code={`// .vscode/mcp.json\n{\n  "servers": {\n    "twentyfirst-ui": { "type": "stdio", "command": "npx", "args": ${mcpArgs(kit)} }\n  }\n}`}
          />
        ),
        "Any LLM": (
          <CodeBlock
            lang="sh"
            code={`# the whole kit in one file\ncurl ${site}/llms-full.txt\n\n# any page as Markdown: append .md\ncurl ${site}/${kit}/components/DataTable.md`}
          />
        ),
      }}
    />
  );
}
