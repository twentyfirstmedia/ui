import { AgentActivity, Panel } from "@twentyfirstmedia/ui-core";
import "./_connectors";

const now = new Date(2026, 10, 14, 9, 30);
const at = (day: number, h: number, m: number) => new Date(2026, 10, 14 + day, h, m);

export default function Preview() {
  return (
    <Panel title="Agent activity" subtitle="What your agents did" style={{ maxWidth: 720 }}>
      <AgentActivity
        now={now}
        onUndo={() => {}}
        onReview={() => {}}
        items={[
          {
            id: "1",
            service: { name: "N26", icon: "brandN26" },
            agent: "Money agent",
            text: "Wants to cancel the second music subscription (€10.99 a month)",
            at: at(0, 9, 12),
            kind: "money",
            state: "waiting",
          },
          {
            id: "2",
            service: { name: "tado°", icon: "brandTado" },
            agent: "Home agent",
            text: "Turned the heating down to 17 °C: nobody is home",
            at: at(0, 8, 41),
            kind: "act",
          },
          {
            id: "3",
            service: { name: "Gmail", icon: "brandGmail" },
            agent: "Assistant",
            text: "Read 14 new emails and filed 3 invoices to Drive",
            at: at(0, 7, 5),
            kind: "read",
          },
          {
            id: "4",
            service: { name: "Google Calendar", icon: "brandGooglecalendar" },
            agent: "Assistant",
            text: "Moved the dentist to Friday, 10:00",
            detail: "The old slot clashed with your flight to Dubai.",
            at: at(-1, 18, 20),
            kind: "act",
            state: "undone",
          },
          {
            id: "5",
            service: { name: "WhatsApp", icon: "brandWhatsapp" },
            agent: "Assistant",
            text: "Drafted a reply to Lena about Saturday",
            at: at(-1, 16, 2),
            kind: "act",
            state: "declined",
          },
          {
            id: "6",
            service: { name: "Tesla", icon: "brandTesla" },
            agent: "Home agent",
            text: "Could not start charging: the car was asleep",
            at: at(-1, 23, 0),
            kind: "act",
            state: "failed",
          },
        ]}
      />
    </Panel>
  );
}
