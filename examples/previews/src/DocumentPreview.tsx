import { ApprovalCard, DocumentPreview } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-col" style={{ gap: 16 }}>
      <ApprovalCard
        agent="Writer"
        project="Operations"
        family="apps"
        age="2 min"
        title="Edit the onboarding guide"
      >
        <DocumentPreview
          title="Onboarding guide"
          href="#"
          before={
            "# Onboarding\n\nWelcome to the team.\n\n## First week\n- Laptop and accounts\n- Meet your buddy\n- Read the handbook\n\n## Tools\n- Mail\n- Calendar\n- Chat\n\n## Contacts\nPeople team: people@example.com"
          }
          after={
            "# Onboarding\n\nWelcome to the team.\n\n## First week\n- Laptop and accounts\n- Meet your buddy on day one\n- Read the handbook\n- Set up two-factor sign-in\n\n## Tools\n- Mail\n- Calendar\n- Chat\n\n## Contacts\nPeople team: people@example.com"
          }
          context={1}
        />
      </ApprovalCard>
      <ApprovalCard
        agent="Ledger"
        project="Finance"
        family="money"
        age="9 min"
        title="Update the Q2 budget sheet"
        compact
      >
        <DocumentPreview
          title="Budget 2026"
          range="Q2!B4:D6"
          cells={[
            { cell: "B4", before: "12,000", after: "14,500" },
            { cell: "C4", before: "Travel", after: "Travel" },
            { cell: "D6", before: null, after: "=SUM(B4:B5)" },
          ]}
        />
      </ApprovalCard>
    </div>
  );
}
