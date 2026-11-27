import * as React from "react";
import { ApprovalCard, MoneyPreview } from "@twentyfirstmedia/ui-core";
import type { ApprovalDecision } from "@twentyfirstmedia/ui-core";
import { fakeDecision } from "./_approvals";

export default function Preview() {
  const [decision, setDecision] = React.useState<ApprovalDecision | null>(null);
  return (
    <div className="tf-col" style={{ gap: 16 }}>
      <ApprovalCard
        agent="Ledger"
        project="Billing"
        family="money"
        age="38 min"
        title="Refund €10.00 to the card ending 4242"
        text="The customer was charged twice for order 2041."
        escalation="Escalates to the owner in 1:22 h"
        stepUp
        decision={decision}
        onDecide={async (key, text) => {
          await fakeDecision(key);
          setDecision({ key, text, by: "Mara Ellis", at: "09:41" });
        }}
      >
        <MoneyPreview
          amount={10}
          recipient="Visa …4242"
          reference="Order 2041"
          refund={{ payment: "pay_3PqL8x2k", paidAt: "Apr 14, 18:02", original: 10 }}
        />
      </ApprovalCard>
      <ApprovalCard
        agent="Ledger"
        project="Finance"
        family="money"
        age="2 h"
        title="Book 3 receipts from March"
        compact
      >
        <MoneyPreview
          amount={-327.25}
          account="Business account"
          bookings={[
            { id: 1, date: "Mar 3", text: "Hosting", account: "4920 · IT costs", amount: -119 },
            {
              id: 2,
              date: "Mar 9",
              text: "Train tickets",
              account: "4670 · Travel",
              amount: -88.25,
            },
            {
              id: 3,
              date: "Mar 21",
              text: "Office chairs",
              account: "0650 · Furniture",
              amount: -120,
            },
          ]}
        />
      </ApprovalCard>
    </div>
  );
}
