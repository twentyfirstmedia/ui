import * as React from "react";
import { MemoryViewer, OverrideDiff } from "@twentyfirstmedia/ui-core";

const mem = [
  {
    id: 1,
    scope: "Agent",
    source: "Chat",
    date: "12 Apr",
    text: "Ida at Northwind prefers short replies and a quote attached.",
  },
  {
    id: 2,
    scope: "Project",
    source: "Feedback",
    date: "9 Apr",
    text: "Never promise refunds; hand them to a person.",
  },
  {
    id: 3,
    scope: "Global",
    source: "Import",
    date: "2 Apr",
    text: "Company is FollowerX GmbH, Hamburg.",
  },
];
export default function Preview() {
  return (
    <div
      className="tf-grid"
      style={
        {
          "--cols": "1fr 1fr",
          gap: 16,
          alignItems: "start",
        } as React.CSSProperties
      }
    >
      <div className="tf-panel">
        <MemoryViewer items={mem} onEdit={() => {}} onDelete={() => {}} />
      </div>
      <OverrideDiff
        title="Instruction"
        versions="Code default v1 → Override v3"
        by="Main Brain after feedback"
        before={"You are Atlas, the support agent.\nBe friendly.\nAnswer within one day."}
        after={
          "You are Atlas, the support agent.\nBe brief and friendly.\nAnswer within one day.\nNever promise refunds."
        }
        onDiscard={() => {}}
        onPromote={() => {}}
      />
    </div>
  );
}
