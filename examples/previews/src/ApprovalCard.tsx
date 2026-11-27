import * as React from "react";
import { ApprovalCard, ChangePreview, MessagePreview } from "@twentyfirstmedia/ui-core";
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
      <div style={{ maxWidth: 360 }}>
        <ApprovalCard
          compact
          href="#"
          agent="Scout"
          project="Domains"
          family="infra"
          age="3 min"
          title="Set TTL of ops-test to 300"
          text="Faster rollout of the next verification change."
        >
          <ChangePreview fields={[{ label: "TTL", before: "3600", after: "300", mono: true }]} />
        </ApprovalCard>
      </div>
      {/* a deep link on a phone: the payload scrolls, A–D stay at the bottom */}
      <div
        className="tf-panel tf-panel-flush"
        style={{ maxWidth: 360, height: 520, overflow: "hidden" }}
      >
        <ApprovalCard
          screen
          agent="Atlas"
          project="Support"
          family="comms"
          age="6 min"
          title="Reply to Erika L. on WhatsApp"
          text="Atlas answers in the open reply window; replies need your OK."
        >
          <MessagePreview
            channel="WhatsApp"
            recipient="Erika L. (…5678)"
            window={{ state: "open", until: "2026-04-16T18:20:00" }}
            context={[
              { from: "in", text: "Hi, my order 2041 still says processing." },
              { from: "out", text: "Thanks, I will check with the warehouse." },
              { from: "in", text: "Any news? I need it by Friday." },
            ]}
            text="Good news: order 2041 left the warehouse this morning and arrives Thursday."
          />
        </ApprovalCard>
      </div>
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
