import { ClaimTimeline, Panel } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <Panel style={{ maxWidth: 560 }}>
      <ClaimTimeline
        title="Water damage in the kitchen"
        meta="Claim 2026-4418 · Nordhafen Insurance"
        amount={2340}
        steps={[
          {
            label: "Reported",
            date: new Date(2026, 9, 28),
            state: "done",
            note: "Photos and invoice uploaded",
          },
          { label: "Assessor visit", date: new Date(2026, 10, 4), state: "done" },
          { label: "Decision", state: "current", note: "Usually within 10 working days" },
          { label: "Payout", state: "todo" },
        ]}
      />
    </Panel>
  );
}
