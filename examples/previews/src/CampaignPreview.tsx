import { ApprovalCard, CampaignPreview } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <ApprovalCard
      agent="Caller"
      project="Sales"
      family="comms"
      age="20 min"
      title="Start the phone campaign “Spring renewals”"
      text="41 customers whose plan ends in May; the caller books a call with the account team."
      stepUp
    >
      <CampaignPreview
        contacts={[
          { name: "Ida Nolan", phone: "…1234", source: "Renewals list" },
          { name: "Jonah Petit", phone: "…8820", source: "Renewals list" },
          { name: "Sun Lee", phone: "…0457", source: "Website form" },
        ]}
        total={41}
        opening="Hi, this is the assistant of Northwind's account team, calling about your plan that ends in May."
        script={
          "1. Introduce yourself as an AI assistant.\n2. Ask whether they want to keep the plan.\n3. Offer a 20-minute call with the account team.\n4. Book the slot or note a callback time.\n5. Never discuss prices; hand over instead."
        }
        hours="Mon–Fri, 9:00–17:00 (customer's time)"
        budget={{ minutes: 240, amount: 36 }}
        calendar="Account team · Renewals"
      />
    </ApprovalCard>
  );
}
