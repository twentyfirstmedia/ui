import * as React from "react";
import {
  Badge,
  Button,
  Flow,
  IconButton,
  ListRow,
  PageHeader,
  Stagger,
  TintIcon,
} from "@twentyfirstmedia/ui-core";
import { Shell } from "./_workspace";

function App() {
  const run = React.useState<number | null>(null);
  React.useEffect(() => {
    if (run[0] == null || run[0] === 3 || run[0] >= 5) return;
    const t = setTimeout(() => {
      run[1]((run[0] ?? 0) + 1);
    }, 800);
    return () => {
      clearTimeout(t);
    };
  }, [run[0]]);
  return (
    <Shell
      area="Agents"
      current="workflows"
      action={{
        label: "New agent",
        icon: "plus",
      }}
      pages={[
        {
          id: "fleet",
          label: "Fleet",
          icon: "bot",
        },
        {
          id: "chat",
          label: "Chat",
          icon: "mail",
        },
        {
          id: "workflows",
          label: "Workflows",
          icon: "zap",
        },
        {
          id: "runs",
          label: "Runs",
          icon: "refresh",
          count: 2,
        },
        {
          id: "knowledge",
          label: "Knowledge",
          icon: "book",
        },
        {
          id: "usage",
          label: "Usage & cost",
          icon: "chart",
        },
      ]}
    >
      <div className="tf-in">
        <PageHeader
          title="Workflows"
          subtitle="Chain agents, approvals and actions"
          actions={[
            <Button key="n" icon="plus">
              New workflow
            </Button>,
          ]}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 300px) minmax(0, 1fr)",
          gap: 16,
          alignItems: "start",
        }}
      >
        <div
          className="tf-panel tf-panel-flush tf-in"
          style={
            {
              "--d": "80ms",
            } as React.CSSProperties
          }
        >
          <Stagger className="tf-list">
            <ListRow
              active
              leading={<TintIcon icon="zap" tint="mint" />}
              title="Support replies"
              subtitle="5 steps · 214 runs"
              trailing={<Badge tone="success">On</Badge>}
            />
            <ListRow
              leading={<TintIcon icon="zap" tint="mint" />}
              title="Receipt to booking"
              subtitle="5 steps · 96 runs"
              trailing={<Badge tone="success">On</Badge>}
            />
            <ListRow
              leading={<TintIcon icon="zap" tint="plain" />}
              title="Lead research"
              subtitle="3 steps · 37 runs"
              trailing={<Badge>Off</Badge>}
            />
          </Stagger>
        </div>
        <div
          className="tf-panel tf-in"
          style={
            {
              "--d": "160ms",
              gap: 16,
            } as React.CSSProperties
          }
        >
          <div
            className="tf-header"
            style={{
              alignItems: "center",
            }}
          >
            <h2 className="tf-panel-title">Support replies</h2>
            <Button
              variant="soft"
              icon="play"
              disabled={run[0] != null && run[0] < 5}
              onClick={() => {
                run[1](0);
              }}
            >
              {run[0] != null && run[0] < 5 ? "Running…" : "Test run"}
            </Button>
          </div>
          <Flow
            active={run[0]}
            waiting={run[0] === 3}
            onApprove={() => {
              run[1](4);
            }}
            onReject={() => {
              run[1](null);
            }}
            tools={() => [
              <IconButton key="e" icon="edit" label="Edit step" size="sm" />,
              <IconButton key="t" icon="trash" label="Remove step" size="sm" />,
            ]}
            steps={[
              {
                kind: "trigger",
                text: "New email arrives in Inbox",
              },
              {
                kind: "condition",
                text: "Label is Customers",
              },
              {
                kind: "agent",
                text: "Atlas drafts a reply from the knowledge base",
              },
              {
                kind: "approval",
                text: "Mara approves the draft",
              },
              {
                kind: "action",
                text: "Send the reply and log it on the company",
              },
            ]}
          />
        </div>
      </div>
    </Shell>
  );
}
export default function Preview() {
  return <App />;
}
