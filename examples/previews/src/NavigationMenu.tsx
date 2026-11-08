import { Button, NavigationMenu } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-panel" style={{ gap: 16, minHeight: 320 }}>
      <div className="tf-row" style={{ justifyContent: "space-between", gap: 16 }}>
        <NavigationMenu
          label="Site"
          items={[
            {
              label: "Product",
              feature: (
                <>
                  <b>Halo Workspace</b>
                  <span className="tf-card-desc">
                    One place for approvals, billing and the team.
                  </span>
                </>
              ),
              links: [
                { label: "Approvals", icon: "check", description: "Agents ask, people decide." },
                { label: "Billing", icon: "card", description: "Invoices, plans and payouts." },
                { label: "Analytics", icon: "chart", description: "Growth week over week." },
              ],
            },
            {
              label: "Resources",
              links: [
                { label: "Docs", icon: "book", description: "Guides and API reference." },
                { label: "Changelog", icon: "file", description: "What shipped this month." },
              ],
            },
            { label: "Pricing", href: "#" },
          ]}
        />
        <Button asChild size="sm">
          <a href="#">Get started</a>
        </Button>
      </div>
    </div>
  );
}
