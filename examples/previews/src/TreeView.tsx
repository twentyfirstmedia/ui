import * as React from "react";
import { ContextMenu, InlineEdit, KeyValue, TreeView } from "@twentyfirstmedia/ui-core";

const tree = [
  {
    id: "fx",
    label: "FollowerX GmbH",
    meta: "€48,210",
    children: [
      {
        id: "fp",
        label: "Northwind",
        meta: "€31,400",
        children: [
          {
            id: "ads",
            label: "Ads",
            meta: "€9,800",
          },
          {
            id: "smm",
            label: "SMM providers",
            meta: "€14,100",
          },
        ],
      },
      {
        id: "ch",
        label: "Chatteo",
        meta: "€12,610",
      },
    ],
  },
  {
    id: "tv",
    label: "Trepte Ventures UG",
    meta: "€4,200",
  },
];
function App() {
  const s = React.useState("ads");
  return (
    <div
      className="tf-grid"
      style={
        {
          "--cols": "1fr 1fr",
          gap: 16,
        } as React.CSSProperties
      }
    >
      <div
        className="tf-panel"
        style={{
          padding: 12,
        }}
      >
        <TreeView
          items={tree}
          defaultOpen={["fx", "fp"]}
          selected={s[0]}
          onSelect={s[1]}
          label="Cost centres"
        />
      </div>
      <div
        className="tf-panel"
        style={{
          gap: 16,
        }}
      >
        <span className="tf-card-desc">Double-click or Enter to edit</span>
        <KeyValue
          items={[
            [
              "Category",
              <InlineEdit value="Software" options={["Software", "Hosting", "Marketing"]} />,
            ],
            ["Amount", <InlineEdit value="1,240.00" mono />],
          ]}
        />
        <ContextMenu
          items={[
            {
              label: "Open",
              icon: "eye",
            },
            {
              label: "Rename",
              icon: "edit",
              shortcut: "R",
            },
            "-",
            {
              label: "Delete",
              icon: "trash",
              danger: true,
            },
          ]}
        >
          <div
            style={{
              padding: 24,
              borderRadius: "var(--radius-md)",
              background: "var(--canvas)",
              textAlign: "center",
            }}
          >
            Right-click or long-press here
          </div>
        </ContextMenu>
      </div>
    </div>
  );
}
export default App;
