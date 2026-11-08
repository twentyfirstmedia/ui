import { ResizablePanels } from "@twentyfirstmedia/ui-core";

const pane = (title: string, text: string) => (
  <div className="tf-col" style={{ gap: 6, padding: 16 }}>
    <b>{title}</b>
    <span className="tf-card-desc">{text}</span>
  </div>
);

export default function Preview() {
  return (
    <div className="tf-panel" style={{ padding: 0, height: 320, overflow: "hidden" }}>
      <ResizablePanels
        labels={["Folders", "Messages"]}
        defaultSizes={[22, 38, 40]}
        panels={[
          pane("Folders", "Inbox, Sent, Archive"),
          pane("Messages", "Drag a handle, or focus it and use the arrow keys."),
          <ResizablePanels
            key="r"
            orientation="vertical"
            labels={["Thread"]}
            defaultSizes={[60, 40]}
            panels={[pane("Thread", "Northwind · Seat upgrade"), pane("Reply", "Write a reply…")]}
          />,
        ]}
      />
    </div>
  );
}
