import { ApprovalCard, MessagePreview, maskRecipient } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-col" style={{ gap: 16 }}>
      <ApprovalCard
        agent="Atlas"
        project="Support"
        family="comms"
        age="6 min"
        title="Reply to a customer on WhatsApp"
        text="Atlas answers in the open reply window; replies need your OK."
      >
        <MessagePreview
          channel="WhatsApp"
          recipient={`${maskRecipient("Erika Lindqvist")} (${maskRecipient("+46 70 123 45 678")})`}
          sender="+49 30 1234 5000"
          window={{ state: "closing", until: "2026-04-16T18:20:00" }}
          context={[
            {
              from: "in",
              at: "2026-04-15T18:20:00",
              text: "Hi, my order 2041 still says processing.",
            },
            {
              from: "out",
              at: "2026-04-15T18:24:00",
              text: "Thanks, I will check with the warehouse.",
            },
            { from: "in", at: "2026-04-16T09:02:00", text: "Any news? I need it by Friday." },
          ]}
          text={
            "Good news: order 2041 left the warehouse this morning and arrives Thursday.\nTracking: NW-55102."
          }
        />
      </ApprovalCard>
      <ApprovalCard
        agent="Social"
        project="Marketing"
        family="marketing"
        age="12 min"
        title="Publish a post on Instagram"
        compact
      >
        <MessagePreview
          channel="Instagram"
          sender="@northwind.studio"
          media={{
            kind: "image",
            src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 4'><rect width='4' height='4' opacity='.12'/><circle cx='2' cy='2' r='1' opacity='.2'/></svg>",
            alt: "The new spring collection on a light blue background",
          }}
          text="Spring is here. The new collection is live in the shop."
        />
      </ApprovalCard>
      <MessagePreview
        channel="WhatsApp"
        recipient="Noah B. (…7731)"
        window={{ state: "closed", until: "2026-04-14T11:00:00" }}
        template={{
          name: "order_update",
          language: "en",
          category: "Utility",
          params: ["Noah", "2058", "Thursday"],
        }}
      />
    </div>
  );
}
