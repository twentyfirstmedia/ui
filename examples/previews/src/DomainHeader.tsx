import { Button, DnsRecordTable, DomainHeader } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-col" style={{ gap: 16 }}>
      <div className="tf-panel">
        <DomainHeader
          name="northwind.example"
          registrar="Registrar GmbH"
          dns="DNS host"
          expires="2026-05-02T00:00:00Z"
          now="2026-04-16T00:00:00Z"
          autoRenew
          ssl={{
            status: "ok",
            label: "Valid",
            issuer: "Let's Encrypt",
            expires: "2026-06-30T00:00:00Z",
          }}
          mail={{
            mx: { status: "ok", label: "2 servers" },
            spf: { status: "ok", label: "Passes" },
            dkim: { status: "warn", label: "Key older than a year" },
            dmarc: { status: "danger", label: "Missing" },
          }}
          onOpenCheck={() => {}}
          actions={
            <Button size="sm" variant="secondary" icon="plus">
              Add record
            </Button>
          }
        />
      </div>
      <div className="tf-panel tf-panel-flush">
        <DnsRecordTable
          records={[
            { id: 1, type: "A", name: "@", content: "203.0.113.7", ttl: "Auto", proxy: true },
            {
              id: 2,
              type: "MX",
              name: "@",
              content: "10 mx1.mail.example",
              ttl: "3600",
              proxy: null,
            },
            {
              id: 3,
              type: "TXT",
              name: "@",
              content: "v=spf1 include:_spf.mail.example ~all",
              ttl: "3600",
              proxy: null,
            },
          ]}
        />
      </div>
    </div>
  );
}
