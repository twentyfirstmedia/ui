import * as React from "react";
import {
  AgentDetails,
  ApprovalCard,
  ChatList,
  ChatMessage,
  ChatThread,
  ChatWorkspace,
  Composer,
  DaySeparator,
  HandoffLine,
  SearchHits,
  ToolCall,
  TypingIndicator,
  VoiceLog,
} from "@twentyfirstmedia/ui-core";
import type {
  ApprovalDecision,
  ChatListProps,
  Mention,
  MentionOption,
} from "@twentyfirstmedia/ui-core";

const NOW = "2026-04-16T12:00:00";

const groups: ChatListProps["groups"] = [
  {
    title: "Pinned",
    items: [
      {
        id: "mb",
        name: "Main Brain",
        sub: "Morning briefing is ready",
        time: "08:00",
        tint: "lilac",
        status: "ok",
        pinned: true,
        project: "Company",
        date: "2026-04-16T08:00:00",
      },
    ],
  },
  {
    title: "Northwind",
    mark: "sky",
    items: [
      {
        id: "atlas",
        name: "Atlas",
        sub: "Waiting for your approval",
        time: "09:41",
        tint: "sky",
        status: "signal",
        unread: 2,
        project: "Northwind",
        date: "2026-04-16T09:41:00",
      },
      {
        id: "ads",
        name: "Ads",
        sub: "Budget at 82%",
        time: "Tue",
        tint: "mint",
        status: "warn",
        project: "Northwind",
        date: "2026-04-14T17:00:00",
      },
    ],
  },
  {
    title: "People",
    items: [
      {
        id: "lena",
        name: "Lena Hart",
        sub: "Sounds good",
        time: "Mon",
        avatar: true,
        date: "2026-04-13T11:00:00",
      },
    ],
  },
];

const PEOPLE: MentionOption[] = [
  {
    id: "ads",
    label: "Ads",
    kind: "agent",
    group: "Agents · Northwind",
    role: "Campaigns",
    tint: "mint",
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
];

const ANSWER = [
  "Drafted. The reply quotes **40 seats at €24**, prorated to May 1:",
  "",
  "| Plan | Seats | Per month |",
  "|:--|--:|--:|",
  "| Team | 40 | €960 |",
  "| Prorated (April) | 40 | €480 |",
  "",
  "- [x] Prices checked against the price list",
  "- [ ] Sent to ida@northwind.io",
].join("\n");

function App() {
  const [chat, setChat] = React.useState("atlas");
  const [decision, setDecision] = React.useState<ApprovalDecision | null>(null);
  const [version, setVersion] = React.useState(1);
  const [jump, setJump] = React.useState<string | undefined>();
  const [jumpKey, setJumpKey] = React.useState(0);
  const [text, setText] = React.useState("");
  const [mentions, setMentions] = React.useState<Mention[]>([]);
  return (
    <div style={{ height: 760 }}>
      <ChatWorkspace
        style={{ height: "100%" }}
        list={<ChatList groups={groups} selected={chat} onSelect={setChat} />}
        thread={
          <>
            <ChatThread jumpTo={jump} jumpKey={jumpKey}>
              <DaySeparator date="2026-04-15T17:00:00" now={NOW} />
              <ChatMessage
                role="user"
                id="u1"
                text="Northwind wants 40 more seats before the renewal. Can you prepare the reply?"
                onEdit={() => {}}
              />
              <HandoffLine
                from={{ name: "Main Brain", tint: "lilac" }}
                to={{ name: "Atlas", tint: "sky" }}
                reason="Quote for Northwind"
                time="17:02"
              />
              <VoiceLog
                duration="1:48"
                time="17:10"
                turns={[
                  { who: "user", text: "Use the price from the new list, not last year's." },
                  { who: "agent", name: "Atlas", text: "Got it: €24 per seat, prorated to May 1." },
                ]}
              />
              <DaySeparator date="2026-04-16T09:00:00" now={NOW} />
              <DaySeparator label="New messages" tone="accent" />
              <ChatMessage
                role="assistant"
                id="a1"
                name="Atlas"
                tint="sky"
                time="09:41"
                text={ANSWER}
                inVoice
                before={
                  <ToolCall
                    name="crm.search"
                    icon="search"
                    summary="Northwind · open deals"
                    duration="0.4 s"
                    traceHref="#trace"
                  />
                }
                after={
                  <ApprovalCard
                    compact
                    agent="Atlas"
                    project="Northwind"
                    family="comms"
                    age="2 min"
                    title="Send this email to ida@northwind.io"
                    decision={decision}
                    onDecide={(key, note) => {
                      setDecision({ key, by: "Mara Ellis", at: "09:44", text: note });
                    }}
                  />
                }
                versionCount={2}
                versionIndex={version}
                onVersionChange={setVersion}
                onRetry={() => {}}
                usage="1,842 tokens · €0.01"
              />
              <TypingIndicator names={["Lena Hart"]} />
            </ChatThread>
            <Composer
              placeholder="Message Atlas, @ to mention"
              mentionOptions={PEOPLE}
              value={text}
              onChange={setText}
              mentions={mentions}
              onMentionsChange={setMentions}
              onAttach={() => {}}
              camera
              onSend={() => {
                setText("");
                setMentions([]);
              }}
            />
          </>
        }
        details={
          <>
            <AgentDetails
              name="Atlas"
              role="Sales · Northwind"
              tint="sky"
              status="signal"
              statusLabel="Waiting for approval"
            />
            <SearchHits
              query="seats"
              onOpen={(hit) => {
                setJump(hit.messageId);
                setJumpKey((k) => k + 1);
              }}
              items={[
                {
                  id: 1,
                  chat: "Atlas",
                  time: "09:41",
                  who: "Atlas",
                  text: "The reply quotes 40 seats at €24, prorated to May 1.",
                  messageId: "a1",
                },
                {
                  id: 2,
                  chat: "Atlas",
                  time: "Yesterday",
                  who: "You",
                  text: "Northwind wants 40 more seats before the renewal.",
                  messageId: "u1",
                },
              ]}
            />
          </>
        }
      />
    </div>
  );
}
export default App;
