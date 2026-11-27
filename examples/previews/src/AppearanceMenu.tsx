import * as React from "react";
import { AppearanceMenu, AppearanceProvider, useUI } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  // In an app: <AppearanceProvider kits={["halo", "pro"]}> once around everything, and the menu
  // at the end of the top bar. Here it starts in the docs' kit and theme and keeps the choice.
  const ui = useUI();
  const [open, setOpen] = React.useState(true);
  return (
    <AppearanceProvider
      key={`${ui.kit}-${ui.theme}`}
      scope="subtree"
      storageKey={false}
      kits={["halo", "pro"]}
      defaults={{ kit: ui.kit, theme: ui.theme === "dark" ? "dark" : "light" }}
    >
      <div
        // overflow: on the narrowest docs pages the menu is wider than the preview box; in an app
        // the menu opens as a bottom sheet on phones, here it stays a popover
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          minHeight: 520,
          overflow: "hidden",
        }}
      >
        <AppearanceMenu side="top" open={open} onOpenChange={setOpen} sheet={false} />
      </div>
    </AppearanceProvider>
  );
}
