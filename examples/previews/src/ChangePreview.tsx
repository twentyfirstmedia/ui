import { ApprovalCard, ChangePreview } from "@twentyfirstmedia/ui-core";

const BEFORE = `server {
  listen 443 ssl;
  server_name shop.northwind.example;
  root /srv/shop/current;
  client_max_body_size 8m;
  gzip on;
  location / {
    try_files $uri /index.html;
  }
  location /api/ {
    proxy_pass http://127.0.0.1:4000;
    proxy_read_timeout 30s;
  }
}`;
const AFTER = BEFORE.replace("client_max_body_size 8m;", "client_max_body_size 32m;").replace(
  "proxy_read_timeout 30s;",
  "proxy_read_timeout 120s;",
);

export default function Preview() {
  return (
    <div className="tf-col" style={{ gap: 16 }}>
      <ApprovalCard
        agent="Scout"
        project="Domains"
        family="infra"
        age="3 min"
        title="Update the TXT record ops-test on northwind.example"
        text="The verification value changed after the provider renewed the token."
      >
        <ChangePreview
          title="Update TXT record · northwind.example"
          facts={[
            { k: "Provider", v: "DNS host" },
            { k: "Zone", v: "northwind.example", mono: true },
          ]}
          fields={[
            { label: "Type", before: "TXT", after: "TXT", mono: true },
            { label: "Name", before: "ops-test", after: "ops-test", mono: true },
            {
              label: "Content",
              before: "verify=4f1c0e92",
              after: "verify=b7d2a6f1",
              mono: true,
            },
            { label: "TTL", before: "3600", after: "300", mono: true },
            { label: "Comment", before: null, after: "Renewed token\nby the provider" },
          ]}
          warnings={["Changing a TXT record on the apex can affect mail verification."]}
        />
      </ApprovalCard>
      <div className="tf-panel">
        <ChangePreview
          title="Edit nginx.conf on web-1"
          fields={[
            {
              label: "File",
              before: "/etc/nginx/sites/shop.conf",
              after: "/etc/nginx/sites/shop.conf",
              mono: true,
            },
          ]}
          onlyChanged
          diff={{ before: BEFORE, after: AFTER, context: 2 }}
        />
      </div>
    </div>
  );
}
