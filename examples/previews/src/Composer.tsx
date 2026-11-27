import * as React from "react";
import { AgentStatus, Composer, PromptStarters, UsageMeter } from "@twentyfirstmedia/ui-core";
import type { ComposerAttachment, Mention, MentionOption } from "@twentyfirstmedia/ui-core";

const PEOPLE: MentionOption[] = [
  {
    id: "atlas",
    label: "Atlas",
    kind: "agent",
    group: "Agents · Support",
    role: "Replies to customers",
    tint: "sky",
  },
  {
    id: "ledger",
    label: "Ledger",
    kind: "agent",
    group: "Agents · Finance",
    role: "Invoices",
    tint: "butter",
  },
  { id: "lena", label: "Lena Hart", kind: "person", group: "People", role: "Sales lead" },
  { id: "noah", label: "Noah Berg", kind: "person", group: "People", role: "Finance" },
];
const HEARD = "and the open invoices from May";

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
    f = React.useState<(File | ComposerAttachment)[]>([
      { name: "Q1-report.pdf", size: "1.2 MB" },
      { name: "board-deck.key", progress: 0.64 },
    ]),
    busy = React.useState(false),
    [text, setText] = React.useState("Summarize today for @Lena Hart"),
    [mentions, setMentions] = React.useState<Mention[]>([
      { id: "lena", label: "Lena Hart", start: 20, end: 30 },
    ]),
    [dictating, setDictating] = React.useState(false);
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
        placeholder="Ask Atlas something, @ to mention, / for commands"
        value={text}
        onChange={setText}
        mentionOptions={PEOPLE}
        mentions={mentions}
        onMentionsChange={setMentions}
        dictation={{ active: dictating, interim: dictating ? HEARD : undefined }}
        onDictate={() => {
          if (dictating) setText(text + (text.endsWith(" ") ? "" : " ") + HEARD);
          setDictating(!dictating);
        }}
        onVoiceMessage={() => {}}
        camera
        models={MODELS}
        model={m[0]}
        onModel={m[1]}
        attachments={f[0]}
        onAttach={(fl) => {
          f[1](f[0].concat(Array.from(fl)));
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
          setText("");
          setMentions([]);
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
