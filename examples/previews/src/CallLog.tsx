import { CallLog, Panel } from "@twentyfirstmedia/ui-core";

const now = new Date(2026, 10, 14, 9, 30);
const at = (day: number, h: number, m: number) => new Date(2026, 10, 14 + day, h, m);

export default function Preview() {
  return (
    <Panel title="Calls" subtitle="With summaries of recorded calls" style={{ maxWidth: 680 }}>
      <CallLog
        now={now}
        onCall={() => {}}
        onOpen={() => {}}
        calls={[
          { id: "1", name: "Dr. Weber's practice", direction: "missed", at: at(0, 8, 52) },
          {
            id: "2",
            name: "Lena",
            direction: "incoming",
            at: at(0, 7, 40),
            duration: 412,
            summary: "Saturday at 7 at Nonna's; she books the table, you bring the wine.",
          },
          {
            id: "3",
            name: "HanseMerkur",
            number: "+49 40 4119 0",
            direction: "outgoing",
            at: at(-1, 15, 10),
            duration: 1260,
            summary: "Travel cover for Dubai confirmed; documents follow by mail.",
          },
          {
            id: "4",
            name: "Garage Schmidt",
            direction: "outgoing",
            at: at(-1, 11, 2),
            duration: 95,
          },
        ]}
      />
    </Panel>
  );
}
