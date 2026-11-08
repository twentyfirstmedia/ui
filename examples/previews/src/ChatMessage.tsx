import { ChatMessage } from "@twentyfirstmedia/ui-core";

const md =
  'Three invoices are overdue, **€2,520** in total:\n\n- **#2041** Harbor & Co · €860\n- **#2058** Pinegate · €1,240\n- **#2063** Orbit Foods · €420\n\nThe fix for the reminder job:\n\n```ts\nconst due = invoices.filter(i => i.dueAt < now && !i.paid);\nawait sendReminders(due, { tone: "friendly" });\n```';
export default function Preview() {
  return (
    <div
      className="tf-panel"
      style={{
        gap: 24,
      }}
    >
      <ChatMessage
        role="user"
        name="Mara Ellis"
        text="Which invoices are overdue? Fix the reminder job too."
        attachments={[
          {
            name: "reminders.ts",
            size: "4 KB",
          },
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
          {
            title: "Invoices · due",
            icon: "card",
          },
          {
            title: "jobs/reminders.ts",
            icon: "code",
          },
        ]}
        usage="1,842 tokens · €0.01"
        onRetry={() => {}}
      />
      <ChatMessage role="system" text="Ledger switched to Claude Haiku 5.5" />
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
