import { Card, UserMenu } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-row" style={{ gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
      <Card style={{ width: 280, minHeight: 0 }}>
        <UserMenu
          name="Mara Ellis"
          email="mara@halo.app"
          side="bottom"
          items={[
            { label: "Profile", icon: "user" },
            { label: "Settings", icon: "settings" },
            { label: "Keyboard shortcuts", icon: "terminal", shortcut: "?" },
            "-",
            { label: "Sign out", icon: "logout" },
          ]}
        />
      </Card>
      <Card style={{ minHeight: 0 }}>
        <UserMenu
          name="Jonah Petit"
          compact
          side="bottom"
          items={[{ label: "Profile", icon: "user" }, "-", { label: "Sign out", icon: "logout" }]}
        />
      </Card>
    </div>
  );
}
