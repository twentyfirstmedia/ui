import * as React from "react";
import { AgentStatus, Composer, PromptStarters, UsageMeter } from "@twentyfirstmedia/ui-core";

const MODELS = [
  {
    id: "opus",
    label: "Claude Opus 5.5",
    hint: "Deepest reasoning",
  },
  {
    id: "sonnet",
    label: "Claude Sonnet 5.5",
    hint: "Balanced default",
  },
  {
    id: "haiku",
    label: "Claude Haiku 5.5",
    hint: "Fast and cheap",
  },
];
function App() {
  const m = React.useState("sonnet"),
    f = React.useState([
      {
        name: "Q1-report.pdf",
      },
    ]),
    busy = React.useState(false);
  return (
    <div
      className="tf-panel"
      style={{
        gap: 24,
      }}
    >
      <PromptStarters
        items={[
          {
            icon: "edit",
            tint: "sky",
            title: "Draft a reply",
            text: "To the latest customer email",
          },
          {
            icon: "file",
            tint: "mint",
            title: "Summarize today",
            text: "Runs, approvals, costs",
          },
          {
            icon: "search",
            tint: "butter",
            title: "Ask the docs",
            text: "Search the knowledge base",
          },
        ]}
      />
      <Composer
        placeholder="Ask Atlas something, or type / for commands"
        models={MODELS}
        model={m[0]}
        onModel={m[1]}
        attachments={f[0]}
        onAttach={(fl) => {
          f[1](f[0].concat(Array.prototype.slice.call(fl)));
        }}
        onRemoveAttachment={(i) => {
          f[1](f[0].filter((_, k) => k !== i));
        }}
        commands={[
          {
            name: "summarize",
            hint: "Summarize today",
            icon: "file",
          },
          {
            name: "draft",
            hint: "Draft a reply",
            icon: "edit",
          },
          {
            name: "clear",
            hint: "New conversation",
            icon: "trash",
          },
        ]}
        busy={busy[0]}
        onSend={() => {
          busy[1](true);
          setTimeout(() => {
            busy[1](false);
          }, 2500);
        }}
        onStop={() => {
          busy[1](false);
        }}
      />
      <div
        className="tf-row"
        style={{
          justifyContent: "space-between",
        }}
      >
        <AgentStatus
          status={busy[0] ? "Thinking" : "Idle"}
          step={busy[0] ? "Reading 3 messages" : "Drafts only"}
        />
        <div
          style={{
            width: 200,
          }}
        >
          <UsageMeter label="Context" used={21} limit={200} format={(v) => v + "k"} />
        </div>
      </div>
    </div>
  );
}
export default App;
