import { LeadScore, Panel } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <Panel
      title="Lead score"
      subtitle="Hot, warm and cold, with the reasons"
      style={{ maxWidth: 520 }}
    >
      <div className="tf-row" style={{ gap: 12 }}>
        <LeadScore
          score={86}
          reasons={[
            { text: "Visited the pricing page 4 times", points: 24 },
            { text: "Opened the last 3 emails", points: 18 },
            { text: "Company with 50–200 people", points: 15 },
            { text: "No reply for 10 days", points: -6 },
          ]}
        />
        <LeadScore score={54} />
        <LeadScore score={18} />
      </div>
    </Panel>
  );
}
