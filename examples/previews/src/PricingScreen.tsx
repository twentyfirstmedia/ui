import { PageHeader, Panel, PlanCard, Segmented, UsageMeter } from "@twentyfirstmedia/ui-core";
import { Shell } from "./_workspace";

function App() {
  return (
    <Shell
      area="Account"
      current={"Plan & billing"}
      pages={[
        {
          id: "Profile",
          label: "Profile & theme",
          icon: "user",
        },
        {
          id: "Roles",
          label: "Roles & access",
          icon: "lock",
        },
        {
          id: "Plan & billing",
          label: "Plan & billing",
          icon: "card",
        },
      ]}
    >
      <PageHeader
        title={"Plan & billing"}
        subtitle="You’re on Team · renews on May 1, 2026"
        actions={[
          <Segmented
            key="y"
            defaultValue="Yearly"
            options={[
              "Monthly",
              {
                value: "Yearly",
                label: "Yearly · save 17%",
              },
            ]}
          />,
        ]}
      />
      <div className="tf-plans">
        <PlanCard
          name="Starter"
          price={9}
          was={12}
          text="For small teams"
          features={["3 projects", "1 agent", "-Audit log"]}
        />
        <PlanCard
          name="Team"
          price={24}
          was={29}
          featured
          current
          text="For growing companies"
          features={["Unlimited projects", "10 agents", "Audit log"]}
        />
        <PlanCard
          name="Business"
          price={null}
          cta="Talk to sales"
          text="Security and an SLA"
          features={["Everything in Team", "SSO and SCIM", "SLA"]}
        />
      </div>
      <Panel title="Usage this month">
        <UsageMeter
          label="Agent usage"
          used={84}
          limit={120}
          format={(v) => "€" + v}
          caption="Included up to €120"
        />
      </Panel>
    </Shell>
  );
}
export default App;
