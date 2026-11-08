import * as React from "react";
import { AccountSwitcher, InboxList, MailThread } from "@twentyfirstmedia/ui-core";

const accounts = [
  {
    address: "support@northwind.de",
    domain: "northwind.de",
    unread: 3,
  },
  {
    address: "hello@chatteo.de",
    domain: "chatteo.de",
    unread: 1,
  },
  {
    address: "robin@twentyfirst.media",
    domain: "twentyfirst.media",
  },
];
function App() {
  const a = React.useState<string | null>(null),
    s = React.useState<string | number>(1);
  return (
    <div
      className="tf-grid"
      style={
        {
          "--cols": "360px 1fr",
          gap: 16,
          alignItems: "start",
        } as React.CSSProperties
      }
    >
      <div
        className="tf-panel"
        style={{
          gap: 12,
        }}
      >
        <AccountSwitcher accounts={accounts} value={a[0]} onChange={a[1]} unread={4} />
        <InboxList
          selected={s[0]}
          onOpen={(m) => {
            s[1](m.id);
          }}
          items={[
            {
              id: 1,
              from: "Ida Nolan",
              time: "08:40",
              subject: "Seat upgrade before renewal",
              snippet: "We are growing faster than planned and need 40 more seats.",
              unread: true,
              to: "support@",
              agent: {
                label: "Draft ready",
                tone: "highlight",
              },
            },
            {
              id: 2,
              from: "Hetzner",
              time: "07:12",
              subject: "Invoice 2026-0412",
              snippet: "Your invoice is attached.",
              tags: ["Receipt"],
            },
          ]}
        />
      </div>
      <div className="tf-panel">
        <MailThread
          subject="Seat upgrade before renewal"
          messages={[
            {
              id: 1,
              from: "Ida Nolan",
              to: "to support@northwind.de",
              time: "Mon 16:20",
              snippet: "Hi! Quick question about seats…",
              body: "Hi! Quick question about seats before our renewal.",
            },
            {
              id: 2,
              from: "Atlas",
              agent: true,
              tint: "sky",
              agentNote: "sent after approval",
              to: "to ida@northwind.io",
              time: "Tue 09:41",
              body: "Hi Ida,\n\nhappy to add 40 seats before your renewal on 1 May.\n\nBest,\nMara",
              attachments: [
                {
                  name: "Quote-0412.pdf",
                  size: "84 KB",
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}
export default App;
