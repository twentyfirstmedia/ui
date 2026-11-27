import * as React from "react";
import { AgentNetwork, Button, Panel, useMotion } from "@twentyfirstmedia/ui-core";
import type { AgentNetworkHandoff } from "@twentyfirstmedia/ui-core";
import { NETWORK } from "./_coordination";

const ROUTES: [string, string, string][] = [
  ["main", "support", "Refund request"],
  ["support", "shop-lead", "Needs approval"],
  ["main", "release", "Ship 2.4"],
  ["qa", "app-lead", "Tests passed"],
  ["main", "books", "November invoices"],
  ["ads", "main", "Weekly report"],
];

export default function Preview() {
  const motion = useMotion();
  const [handoffs, setHandoffs] = React.useState<AgentNetworkHandoff[]>([]);
  const n = React.useRef(0);
  const send = React.useCallback(() => {
    const [from, to, label] = ROUTES[n.current % ROUTES.length]!;
    n.current += 1;
    setHandoffs((h) => [...h.slice(-10), { id: `h${n.current}`, from, to, label }]);
  }, []);
  // a live stream in a real app; here a handoff every few seconds while motion is on
  React.useEffect(() => {
    if (motion === "off") return;
    const timer = setInterval(send, 2600);
    return () => clearInterval(timer);
  }, [motion, send]);
  return (
    <Panel
      title="Agents"
      action={
        <Button size="sm" variant="secondary" icon="send" onClick={send}>
          Send a handoff
        </Button>
      }
    >
      <AgentNetwork root={NETWORK} handoffs={handoffs} height={400} defaultSelected="shop-lead" />
    </Panel>
  );
}
