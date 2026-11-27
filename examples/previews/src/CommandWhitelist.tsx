import { CommandWhitelist, IconButton } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-panel">
      <CommandWhitelist
        servers={[
          {
            id: "web-1",
            name: "web-1",
            host: "deploy@203.0.113.7",
            commands: [
              {
                id: "status",
                template: "systemctl status {service}",
                description: "Read a service's state",
                risk: "read",
                params: [{ name: "service", values: ["nginx", "shop", "worker"] }],
              },
              {
                id: "logs",
                template: "journalctl -u {service} -n {lines}",
                risk: "read",
                params: [
                  { name: "service", values: ["nginx", "shop"] },
                  { name: "lines", pattern: "1–500" },
                ],
              },
              {
                id: "restart",
                template: "systemctl restart {service}",
                description: "Restarts the service; requests in flight fail",
                risk: "critical",
                params: [{ name: "service", values: ["nginx", "shop"] }],
              },
              {
                id: "deploy",
                template: "/srv/shop/deploy.sh {commit}",
                risk: "change",
                params: [{ name: "commit", pattern: "[0-9a-f]{7,40}" }],
              },
            ],
          },
          { id: "db-1", name: "db-1", host: "ops@203.0.113.9", commands: [] },
        ]}
        blocked={["rm -rf *", "shutdown *", "* > /dev/sd*", "curl * | sh"]}
        actions={() => <IconButton icon="edit" label="Edit command" size="sm" variant="ghost" />}
      />
    </div>
  );
}
