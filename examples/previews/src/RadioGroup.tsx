import * as React from "react";
import { RadioGroup, Segmented } from "@twentyfirstmedia/ui-core";

function App() {
  const a = React.useState("Team"),
    b = React.useState("Monthly");
  return (
    <div
      className="tf-panel"
      style={{
        gap: 24,
      }}
    >
      <RadioGroup
        label="Plan"
        cards
        value={a[0]}
        onChange={a[1]}
        options={[
          {
            value: "Starter",
            label: "Starter",
            hint: "€9 per seat · 3 projects",
          },
          {
            value: "Team",
            label: "Team",
            hint: "€24 per seat · unlimited",
          },
          {
            value: "Business",
            label: "Business",
            hint: "SSO, audit log, SLA",
          },
        ]}
      />
      <div
        style={{
          display: "flex",
          gap: 48,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <RadioGroup
          label="Invoice reminders"
          defaultValue="due"
          options={[
            {
              value: "never",
              label: "Never",
            },
            {
              value: "due",
              label: "On the due date",
            },
            {
              value: "weekly",
              label: "Weekly until paid",
              hint: "Stops when the bank feed matches it",
            },
          ]}
        />
        <div className="tf-field">
          <span className="tf-field-label">Billing</span>
          <Segmented label="Billing" value={b[0]} onChange={b[1]} options={["Monthly", "Yearly"]} />
        </div>
        <div className="tf-field">
          <span className="tf-field-label">View</span>
          <Segmented
            label="View"
            size="sm"
            defaultValue="grid"
            options={[
              {
                value: "grid",
                label: "Grid",
                icon: "grid",
              },
              {
                value: "list",
                label: "List",
                icon: "menu",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
export default App;
