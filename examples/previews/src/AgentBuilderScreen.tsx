import * as React from "react";
import {
  Button,
  ChatMessage,
  Combobox,
  Composer,
  PageHeader,
  Panel,
  RadioGroup,
  Segmented,
  Slider,
} from "@twentyfirstmedia/ui-core";
import { Shell } from "./_workspace";

function App() {
  return (
    <Shell
      area="Agents"
      current="Builder"
      action={{
        label: "New agent",
        icon: "plus",
      }}
      pages={[
        {
          id: "Fleet",
          label: "Fleet",
          icon: "bot",
        },
        {
          id: "Chat",
          label: "Chat",
          icon: "mail",
        },
        {
          id: "Builder",
          label: "Builder",
          icon: "settings",
        },
        {
          id: "Runs",
          label: "Runs",
          icon: "refresh",
        },
      ]}
    >
      <PageHeader
        crumbs={["Agents", "Atlas"]}
        title="Configure Atlas"
        subtitle="Support triage · changes apply to new runs"
        actions={[
          <Button key="s" icon="check">
            Save changes
          </Button>,
        ]}
      />
      <div
        className="tf-grid"
        style={
          {
            "--cols": "minmax(0, 1fr) 340px",
            gap: 16,
            alignItems: "start",
          } as React.CSSProperties
        }
      >
        <div
          className="tf-col"
          style={{
            gap: 16,
          }}
        >
          <Panel title="Instructions" subtitle="What it does, how it talks, what it must never do">
            <textarea
              className="tf-input"
              aria-label="Instructions"
              rows={5}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
              }}
              defaultValue={
                "You are Atlas, the support triage agent for Halo.\n- Tag new mail and draft replies.\n- Never promise refunds; hand those to a person."
              }
            />
          </Panel>
          <Panel title="Model">
            <RadioGroup
              cards
              defaultValue="Sonnet"
              options={[
                {
                  value: "Opus",
                  label: "Opus 5.5",
                  hint: "Deepest · €15 / M",
                },
                {
                  value: "Sonnet",
                  label: "Sonnet 5.5",
                  hint: "Balanced · €3 / M",
                },
                {
                  value: "Haiku",
                  label: "Haiku 5.5",
                  hint: "Fast · €1 / M",
                },
              ]}
            />
          </Panel>
          <Panel title="Guardrails">
            <Segmented
              defaultValue="Drafts only"
              options={["Drafts only", "Acts, then reports", "Fully autonomous"]}
            />
            <Combobox
              label="Always ask before"
              multiple
              defaultValue={["Sending email", "Spending money"]}
              options={["Sending email", "Spending money", "Deleting anything"]}
            />
            <Slider
              label="Monthly budget"
              min={0}
              max={500}
              defaultValue={120}
              format={(v) => "€" + v}
            />
          </Panel>
        </div>
        <div
          className="tf-panel"
          style={{
            gap: 16,
          }}
        >
          <div>
            <h3 className="tf-panel-title">Test</h3>
            <p className="tf-panel-sub">Uses your unsaved setup</p>
          </div>
          <ChatMessage role="user" text="Can I get a refund?" />
          <ChatMessage
            role="assistant"
            name="Atlas"
            tint="sky"
            actions={false}
            text="I’ll pass this to a person, since refunds need a human. You’ll hear back today."
          />
          <Composer placeholder="Test a message…" hint="" />
        </div>
      </div>
    </Shell>
  );
}
export default App;
