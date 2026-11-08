import { PlanCard } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-plans">
      <PlanCard
        name="Starter"
        price={9}
        was={12}
        per="per seat / month, billed yearly"
        text="For small teams getting organised"
        features={[
          "3 projects",
          "1 agent · Haiku only",
          "Shop with up to 50 products",
          "-Approvals and audit log",
          "-SSO",
        ]}
      />
      <PlanCard
        name="Team"
        price={24}
        was={29}
        per="per seat / month, billed yearly"
        text="Everything a growing company runs on"
        featured
        features={[
          "Unlimited projects",
          "10 agents · all models",
          "Unlimited products, 3 channels",
          "Approvals and audit log",
          "-SSO",
        ]}
      />
      <PlanCard
        name="Business"
        price={null}
        text="Security, control and an SLA"
        cta="Talk to sales"
        current={false}
        features={["Everything in Team", "SSO and SCIM", "EU data residency", "99.9% uptime SLA"]}
      />
    </div>
  );
}
