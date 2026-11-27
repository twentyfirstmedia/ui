import { VoiceLog, VoiceNote } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-panel" style={{ gap: 16 }}>
      <VoiceNote
        duration={42}
        transcript="The renewal call went well. Ida wants the quote by Friday, with the PO number on it."
      />
      <div className="tf-row" style={{ justifyContent: "flex-end" }}>
        <VoiceNote mine duration={8} />
      </div>
      <VoiceLog
        defaultOpen
        duration="4:12"
        time="Yesterday 17:40"
        turns={[
          { who: "user", text: "What still needs me today?" },
          {
            who: "agent",
            name: "Atlas",
            text: "Two approvals: the Northwind reply and a refund of €10.",
          },
          { who: "user", text: "Approve the reply, I'll look at the refund later." },
          { who: "agent", name: "Atlas", text: "Sent. The refund stays in your inbox." },
        ]}
      />
    </div>
  );
}
