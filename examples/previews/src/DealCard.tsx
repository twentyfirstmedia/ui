import { DealCard } from "@twentyfirstmedia/ui-core";

const stages = [
  { id: "meeting", label: "Meeting" },
  { id: "proposal", label: "Proposal" },
  { id: "won", label: "Won" },
];

export default function Preview() {
  return (
    <div className="tf-row" style={{ gap: 16, alignItems: "flex-start" }}>
      <div style={{ width: 280 }}>
        <DealCard
          deal={{
            id: "d6",
            title: "Nordhafen renewal",
            company: "Nordhafen Outdoor",
            value: 36000,
            probability: 80,
            closeDate: new Date(2026, 10, 30),
            daysInStage: 4,
            owner: "Mara Ellis",
            next: "Contract to legal",
          }}
          stages={stages}
          onMove={() => {}}
          onOpen={() => {}}
        />
      </div>
      <div style={{ width: 280 }}>
        <DealCard
          deal={{
            id: "d2",
            title: "Brand refresh",
            company: "Lindqvist Studio",
            value: 9500,
            probability: 10,
            daysInStage: 21,
            owner: "Jonas Pick",
            next: "Follow up",
          }}
          stages={stages}
          onMove={() => {}}
        />
      </div>
    </div>
  );
}
