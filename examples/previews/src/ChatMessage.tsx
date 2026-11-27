import * as React from "react";
import { ChatMessage } from "@twentyfirstmedia/ui-core";

const md =
  'Three invoices are overdue, **€2,520** in total:\n\n- **#2041** Harbor & Co · €860\n- **#2058** Pinegate · €1,240\n  - reminder bounced, see the [contact sheet](#contacts)\n- **#2063** Orbit Foods · €420\n\n> Pinegate pays in full once the PO number is on the invoice.\n\nThe fix for the reminder job:\n\n```ts\nconst due = invoices.filter(i => i.dueAt < now && !i.paid);\nawait sendReminders(due, { tone: "friendly" });\n```';

export default function Preview() {
  const [text, setText] = React.useState(
    "@Ledger which invoices are overdue? Fix the reminder job too.",
  );
  const [version, setVersion] = React.useState(1);
  return (
    <div className="tf-panel" style={{ gap: 24 }}>
      <ChatMessage
        role="user"
        id="q"
        name="Mara Ellis"
        text={text}
        mentions={
          text.startsWith("@Ledger")
            ? [{ id: "ledger", label: "Ledger", start: 0, end: 7, tint: "butter" }]
            : []
        }
        onEdit={setText}
        versionCount={2}
        versionIndex={1}
        dictated
        attachments={[
          { name: "reminders.ts", size: "4 KB", url: "#reminders" },
          { name: "dunning-letter.png", kind: "image" },
        ]}
      />
      <ChatMessage
        role="assistant"
        name="Ledger"
        tint="butter"
        time="09:41"
        model="Claude Sonnet 5.5"
        text={md}
        sources={[
          { title: "Invoices · due", icon: "card" },
          { title: "jobs/reminders.ts", icon: "code" },
        ]}
        usage="1,842 tokens · €0.01"
        versionCount={2}
        versionIndex={version}
        onVersionChange={setVersion}
        onRetry={() => {}}
      />
      <ChatMessage
        role="system"
        icon="sparkle"
        text="Ledger switched to Claude Haiku 5.5"
        time="09:42"
      />
      <ChatMessage
        role="user"
        name="Mara Ellis"
        voice={{
          duration: 9,
          transcript: "Send the reminders, but leave Pinegate out until Friday.",
        }}
      />
      <ChatMessage
        role="assistant"
        name="Ledger"
        tint="butter"
        streaming
        text={"Sending reminders now. Harbor & Co first because"}
      />
    </div>
  );
}
