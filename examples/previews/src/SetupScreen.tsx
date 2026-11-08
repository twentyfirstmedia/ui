import * as React from "react";
import { Button, PageHeader, StatTile, TintIcon, Wizard } from "@twentyfirstmedia/ui-core";
import { Shell } from "./_workspace";

function App() {
  const c = React.useState(2);
  return (
    <Shell
      area="Workspace"
      current="overview"
      action={{
        label: "New project",
        icon: "plus",
      }}
      pages={[
        {
          id: "overview",
          label: "Overview",
          icon: "home",
        },
        {
          id: "board",
          label: "Projects",
          icon: "grid",
          count: 7,
        },
        {
          id: "calendar",
          label: "Calendar",
          icon: "calendar",
        },
        {
          id: "people",
          label: "People",
          icon: "users",
        },
        {
          id: "reports",
          label: "Reports",
          icon: "chart",
        },
      ]}
      overlay={
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 30,
            overflow: "hidden",
          }}
        >
          <div
            className="tf-modal-wrap"
            style={{
              position: "absolute",
              inset: 0,
            }}
          >
            <div className="tf-backdrop" />
            <Wizard
              brand="Halo"
              current={c[0]}
              onPick={c[1]}
              done={{
                0: true,
                1: true,
              }}
              steps={[
                {
                  label: "Name your workspace",
                  icon: "grid",
                },
                {
                  label: "Invite your team",
                  icon: "users",
                },
                {
                  label: "Connect your mailbox",
                  icon: "mail",
                },
                {
                  label: "Connect a domain",
                  icon: "globe",
                },
                {
                  label: "Connect your bank",
                  icon: "card",
                },
                {
                  label: "Create your first agent",
                  icon: "bot",
                },
              ]}
              footer={[
                <Button
                  key="b"
                  variant="ghost"
                  icon="chevronLeft"
                  onClick={() => {
                    c[1](Math.max(0, c[0] - 1));
                  }}
                >
                  Back
                </Button>,
                <Button
                  key="n"
                  iconRight="chevronRight"
                  onClick={() => {
                    c[1](Math.min(5, c[0] + 1));
                  }}
                >
                  Continue
                </Button>,
              ]}
            >
              <div
                className="tf-grid"
                style={{
                  gridTemplateColumns: "1fr 1fr",
                }}
              >
                {["Google Workspace", "Microsoft 365", "IMAP / SMTP", "Halo Mail"].map((m, i) => (
                  <div
                    key={m}
                    className="tf-file"
                    style={
                      i === 0
                        ? {
                            boxShadow: "inset 0 0 0 2px var(--ink)",
                            background: "var(--surface)",
                          }
                        : undefined
                    }
                  >
                    <TintIcon icon="mail" tint={i === 0 ? "mint" : "plain"} />
                    <b>{m}</b>
                  </div>
                ))}
              </div>
            </Wizard>
          </div>
        </div>
      }
    >
      <PageHeader title="Good morning, Mara" subtitle="Everything that needs a decision today" />
      <div
        className="tf-grid"
        style={{
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        }}
      >
        <StatTile tint="sky" value="15" label="All projects" />
        <StatTile tint="mint" value="8" label="Live" />
        <StatTile tint="placeholder" value="3" label="Needs review" />
        <StatTile tint="butter" value="€32,669" label="Revenue (MTD)" />
      </div>
    </Shell>
  );
}
export default function Preview() {
  return <App />;
}
