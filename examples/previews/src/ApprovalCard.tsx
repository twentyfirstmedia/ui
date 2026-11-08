import * as React from "react";
import { ApprovalCard } from "@twentyfirstmedia/ui-core";
import type { ApprovalDecision } from "@twentyfirstmedia/ui-core";

function App() {
  const d = React.useState<ApprovalDecision | null>(null);
  return (
    <div
      className="tf-col"
      style={{
        gap: 16,
      }}
    >
      <ApprovalCard
        agent="Atlas"
        project="Support"
        family="comms"
        age="4 min"
        title="Send this email to ida@northwind.io"
        text="Atlas is set to drafts only, so it needs your OK."
        escalation="Escalates to the owner in 1:52 h"
        trace={<a href="#">Open trace</a>}
        decision={d[0]}
        onDecide={(k, t) => {
          d[1]({
            key: k,
            by: "Mara Ellis",
            at: "09:41",
            text: t,
          });
        }}
      >
        <div className="tf-approval-mail">
          {
            "Hi Ida,\n\nhappy to add 40 seats before your renewal on May 1. The quote is attached.\n\nBest,\nMara"
          }
        </div>
      </ApprovalCard>
      <ApprovalCard
        agent="Ledger"
        project="Finance"
        family="money"
        title="Refund €10.00 to the card ending 4242"
        decision={{
          key: "C",
          by: "Lukas",
          at: "Yesterday 18:02",
        }}
      />
      <ApprovalCard
        agent="Scout"
        project="Domains"
        family="infra"
        title="Add TXT record ops-test"
        decision={{
          key: "B",
          by: "Mara Ellis",
          at: "08:10",
          text: "Use TTL 300 instead",
        }}
      />
    </div>
  );
}
export default App;
