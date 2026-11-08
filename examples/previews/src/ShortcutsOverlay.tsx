import * as React from "react";
import { Button, ShortcutsOverlay } from "@twentyfirstmedia/ui-core";

function App() {
  const o = React.useState(true);
  return (
    <div
      style={{
        position: "relative",
        height: 460,
      }}
    >
      <Button
        onClick={() => {
          o[1](true);
        }}
      >
        Show shortcuts (?)
      </Button>
      <ShortcutsOverlay
        open={o[0]}
        onClose={() => {
          o[1](false);
        }}
        groups={[
          {
            title: "Global",
            items: [
              ["Search", ["⌘", "K"]],
              ["Shortcuts", ["?"]],
            ],
          },
          {
            title: "Navigation",
            items: [
              ["Go to chats", ["G", "C"]],
              ["Go to approvals", ["G", "A"]],
            ],
          },
          {
            title: "Approvals",
            items: [
              ["Run as shown", ["A"]],
              ["With a change", ["B"]],
              ["Discard", ["C"]],
              ["Other instruction", ["D"]],
              ["Next / previous", ["J", "K"]],
            ],
          },
        ]}
      />
    </div>
  );
}
export default App;
