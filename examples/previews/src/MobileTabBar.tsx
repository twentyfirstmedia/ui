import * as React from "react";
import { MobileTabBar, PushNotification } from "@twentyfirstmedia/ui-core";

function App() {
  const a = React.useState("approvals");
  return (
    <div
      className="tf-col"
      style={{
        gap: 16,
        alignItems: "center",
      }}
    >
      <PushNotification
        app="Halo"
        time="now"
        title="Approval needed · Atlas"
        text="Send this email to ida@northwind.io?"
        actions={[
          {
            label: "A · Run it",
          },
          {
            label: "Open",
          },
        ]}
      />
      <div
        style={{
          width: 390,
        }}
      >
        <MobileTabBar
          active={a[0]}
          onPick={a[1]}
          items={[
            {
              id: "home",
              label: "Home",
              icon: "home",
            },
            {
              id: "approvals",
              label: "Approvals",
              icon: "check",
              count: 3,
            },
            {
              id: "mail",
              label: "Mail",
              icon: "mail",
            },
            {
              id: "more",
              label: "More",
              icon: "menu",
            },
          ]}
        />
      </div>
    </div>
  );
}
export default App;
