import { CoverageMatrix, Panel } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <Panel title="Are we covered?" subtitle="Your household, 6 risks" style={{ maxWidth: 720 }}>
      <CoverageMatrix
        rows={[
          {
            id: "liab",
            risk: "Damage to others",
            status: "covered",
            policy: "Personal liability",
            note: "Up to €10 m, family included",
          },
          {
            id: "home",
            risk: "Burglary and fire at home",
            status: "covered",
            policy: "Household contents",
          },
          {
            id: "bike",
            risk: "Bike theft",
            status: "partial",
            policy: "Household contents",
            note: "Only up to €1,000; the e-bike is worth €3,200",
          },
          {
            id: "work",
            risk: "Unable to work",
            status: "none",
            note: "The biggest gap for a family with one income",
          },
          {
            id: "legal",
            risk: "Legal costs",
            status: "partial",
            policy: "Legal protection",
            note: "Traffic only",
          },
          { id: "travel", risk: "Illness abroad", status: "covered", policy: "Travel health" },
        ]}
      />
    </Panel>
  );
}
