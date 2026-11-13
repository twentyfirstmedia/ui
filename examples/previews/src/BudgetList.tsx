import { BudgetList, Panel } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <Panel title="November budgets" subtitle="17 days left" style={{ maxWidth: 560 }}>
      <BudgetList
        onSelect={() => {}}
        categories={[
          { id: "food", label: "Groceries", icon: "cart", tint: "mint", spent: 312, limit: 450 },
          { id: "eat", label: "Eating out", icon: "star", tint: "butter", spent: 168, limit: 180 },
          { id: "move", label: "Transport", icon: "map", tint: "sky", spent: 96, limit: 120 },
          {
            id: "fun",
            label: "Fun & hobbies",
            icon: "sparkle",
            tint: "lilac",
            spent: 142,
            limit: 100,
          },
        ]}
      />
    </Panel>
  );
}
