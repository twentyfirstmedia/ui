import { MailFilterBar } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-panel" style={{ minHeight: 320 }}>
      <MailFilterBar
        defaultValue={{ unread: true, domain: "example.com" }}
        accounts={[
          { value: "mara@example.com", label: "mara@example.com" },
          { value: "support@example.com", label: "support@example.com" },
          { value: "billing@example.com", label: "billing@example.com" },
        ]}
        domains={[
          { value: "example.com", label: "example.com" },
          { value: "example.org", label: "example.org" },
        ]}
        agents={[
          { value: "support", label: "Support agent" },
          { value: "bookkeeper", label: "Bookkeeper" },
        ]}
        count={18}
      />
    </div>
  );
}
