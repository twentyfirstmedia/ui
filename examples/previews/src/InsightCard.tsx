import { InsightCard } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-col" style={{ gap: 16, maxWidth: 560 }}>
      <InsightCard
        tone="warning"
        icon="zap"
        meta="Money · 2 h ago"
        title="Your electricity bill went up 18 %"
        sources={[
          { title: "Bank account · Nov debit", icon: "card" },
          { title: "Tariff letter (PDF)", icon: "file" },
        ]}
        why="Your monthly debit rose from €84 to €99 in November. The new tariff letter from your supplier names a price change from 1 November."
        acceptLabel="Compare tariffs"
        onAccept={() => {}}
        onSnooze={() => {}}
        onDismiss={() => {}}
      >
        At your usage, switching to a fixed tariff would save about €140 a year.
      </InsightCard>
      <InsightCard
        tone="success"
        icon="moon"
        meta="Sleep · this week"
        title="You slept 40 minutes longer on walk days"
        sources={[
          { title: "Watch · sleep", icon: "moon" },
          { title: "Habits", icon: "check" },
        ]}
        onDismiss={() => {}}
      >
        On the five days with a morning walk you fell asleep earlier and woke up less often.
      </InsightCard>
    </div>
  );
}
