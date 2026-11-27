import { ApprovalCard, CommandPreview } from "@twentyfirstmedia/ui-core";
import { fakeDecision } from "./_approvals";

export default function Preview() {
  return (
    <ApprovalCard
      agent="Ops"
      project="Platform"
      family="infra"
      age="1 min"
      title="Restart nginx on web-1"
      text="The health check has failed for 4 minutes; the service is stopped."
      escalation="Escalates to the owner in 26 min"
      stepUp
      onDecide={(k) => fakeDecision(k)}
    >
      <CommandPreview
        command="systemctl restart nginx"
        argv={["systemctl", "restart", "nginx"]}
        server="web-1"
        host="deploy@203.0.113.7:22"
        risk="critical"
        timeout={60}
        stateAt="read 09:41"
        stateBefore={`● nginx.service - A high performance web server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)
   Active: failed (Result: exit-code) since 09:37:12; 4min ago
  Process: 1873 ExecStart=/usr/sbin/nginx (code=exited, status=1/FAILURE)`}
        facts={[{ k: "Whitelist entry", v: "systemctl restart {service}", mono: true }]}
      />
    </ApprovalCard>
  );
}
