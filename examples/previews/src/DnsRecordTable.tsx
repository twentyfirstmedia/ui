import { DnsRecordTable, DomainList, MailAuthStatus } from "@twentyfirstmedia/ui-core";

const recs = [
  {
    id: 1,
    type: "A",
    name: "@",
    content: "95.217.14.80",
    ttl: "Auto",
    proxy: true,
  },
  {
    id: 2,
    type: "CNAME",
    name: "www",
    content: "northwind.de",
    ttl: "Auto",
    proxy: true,
  },
  {
    id: 3,
    type: "MX",
    name: "@",
    content: "10 mx.halo-mail.net",
    ttl: "3600",
    proxy: null,
  },
  {
    id: 4,
    type: "TXT",
    name: "@",
    content: "v=spf1 include:_spf.halo-mail.net ~all",
    ttl: "3600",
    proxy: null,
  },
];
export default function Preview() {
  return (
    <div
      className="tf-col"
      style={{
        gap: 16,
      }}
    >
      <div className="tf-panel tf-panel-flush">
        <DnsRecordTable
          records={recs}
          rowMenu={() => [
            {
              label: "Edit",
              icon: "edit",
            },
            "-",
            {
              label: "Delete",
              icon: "trash",
              danger: true,
            },
          ]}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <div className="tf-panel tf-panel-flush tf-panel-list">
          <DomainList
            items={[
              {
                name: "halo.dev",
                registrar: "Cloudflare",
                dns: "Cloudflare",
                days: 18,
                ssl: "ok",
                sslLabel: "Valid",
              },
              {
                name: "northwind.de",
                registrar: "one.com",
                dns: "Cloudflare",
                days: 210,
                ssl: "ok",
                sslLabel: "Valid",
              },
              {
                name: "chatteo.de",
                registrar: "one.com",
                dns: "one.com",
                days: 5,
                ssl: "warn",
                sslLabel: "Renewing",
              },
            ]}
          />
        </div>
        <div className="tf-panel">
          <MailAuthStatus
            rows={[
              {
                domain: "northwind.de",
                mx: {
                  status: "ok",
                  label: "ok",
                },
                spf: {
                  status: "ok",
                  label: "ok",
                },
                dkim: {
                  status: "ok",
                  label: "ok",
                },
                dmarc: {
                  status: "warn",
                  label: "soft",
                },
              },
              {
                domain: "chatteo.de",
                mx: {
                  status: "ok",
                  label: "ok",
                },
                spf: {
                  status: "danger",
                  label: "missing",
                },
                dkim: {
                  status: "idle",
                  label: "—",
                },
                dmarc: {
                  status: "danger",
                  label: "missing",
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
