import type { SidebarGroup } from "@twentyfirstmedia/ui-core";

/** The navigation of the Life app examples. */
export const LIFE_NAV: SidebarGroup[] = [
  {
    items: [
      { id: "today", label: "Today", icon: "sun" },
      { id: "assistant", label: "Assistant", icon: "sparkle" },
    ],
  },
  {
    label: "Life",
    items: [
      { id: "home", label: "Home", icon: "home" },
      { id: "trips", label: "Trips & orders", icon: "plane" },
      { id: "golf", label: "Golf", icon: "flag" },
      { id: "investments", label: "Investments", icon: "trend" },
    ],
  },
];
