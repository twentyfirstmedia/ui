import * as React from "react";
import { MailComposer, Toaster, toast } from "@twentyfirstmedia/ui-core";
import type { MailDraft } from "@twentyfirstmedia/ui-core";
import { PEOPLE } from "./_mail";

const SENDERS = [
  { address: "mara@example.com", name: "Mara Ellis" },
  { address: "support@example.com", name: "Support" },
  { address: "billing@example.com", name: "Billing" },
];

export default function Preview() {
  const [draft, setDraft] = React.useState<MailDraft>({
    from: "mara@example.com",
    to: [PEOPLE[0]!],
    cc: [],
    bcc: [],
    subject: "Pricing review moved to Thursday",
    html: "<p>Hi Lena,</p><p>we moved the pricing review to <b>Thursday at 11:00</b> so Growth can join.</p>",
    signature: true,
    attachments: [
      { id: "a1", name: "pricing-v3.pdf", size: "1.2 MB" },
      { id: "a2", name: "seat-model.xlsx", size: "84 KB" },
    ],
  });
  return (
    <>
      <MailComposer
        senders={SENDERS}
        value={draft}
        onChange={setDraft}
        suggestions={PEOPLE}
        signature={"Mara Ellis\nHead of Operations · Example Inc."}
        saved="saved"
        savedAt={new Date(2026, 3, 16, 10, 42)}
        onSend={() => {}}
        onUndoSend={() => toast("Sending cancelled")}
        onSchedule={() => toast("Scheduled")}
        onFiles={() => {}}
        attachSources={[{ label: "From Drive", icon: "folder", onClick: () => {} }]}
        onDiscard={() => {}}
      />
      <Toaster />
    </>
  );
}
