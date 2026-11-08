import { Reasoning, ToolCall } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-panel"
      style={{
        gap: 8,
      }}
    >
      <Reasoning
        steps={[
          "Find the latest thread from Northwind",
          "Check seat pricing and the renewal date",
          "Draft a short reply, ask before sending",
        ]}
        duration="1.4 s"
        defaultOpen
      />
      <ToolCall
        name="Mailbox"
        icon="mail"
        status="done"
        summary="Read 3 messages in “Seat upgrade”"
        duration="0.8 s"
        defaultOpen
        input={{
          query: "from:ida@northwind.io",
          limit: 3,
        }}
        output={{
          messages: 3,
          latest: "We need 40 more seats before May 1.",
        }}
      />
      <ToolCall
        name="Knowledge base"
        icon="book"
        status="running"
        summary="Searching “seat upgrade pricing”"
      />
      <ToolCall
        name="Run checks"
        icon="terminal"
        status="error"
        summary="146 passed · 1 type error"
        duration="4.2 s"
        output="Seats.tsx:42  Type 'string' is not assignable to type 'number'."
      />
      <ToolCall
        name="Deployments"
        icon="zap"
        status="waiting"
        summary="Needs approval to deploy to production"
      />
      <Reasoning streaming />
    </div>
  );
}
