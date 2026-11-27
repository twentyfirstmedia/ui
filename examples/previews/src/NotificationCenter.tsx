import * as React from "react";
import { NotificationCenter } from "@twentyfirstmedia/ui-core";
import type { NotificationItem } from "@twentyfirstmedia/ui-core";

const NOW = "2026-04-16T12:00:00";
const ITEMS: NotificationItem[] = [
  {
    id: 1,
    icon: "check",
    tint: "butter",
    title: "Approval waiting",
    text: "Send the renewal offer to Northwind?",
    time: "11:40",
    date: "2026-04-16T11:40:00",
    unread: true,
    href: "#approvals",
  },
  {
    id: 2,
    icon: "bot",
    tint: "lilac",
    title: "Research run finished",
    text: "18 companies, 4 new leads",
    time: "09:05",
    date: "2026-04-16T09:05:00",
    unread: true,
    href: "#runs",
  },
  {
    id: 3,
    icon: "mail",
    tint: "sky",
    title: "Lena Hart replied",
    text: "Re: venue for the offsite",
    time: "17:20",
    date: "2026-04-15T17:20:00",
    href: "#mail",
  },
  {
    id: 4,
    icon: "card",
    tint: "mint",
    title: "Invoice RE-2026-00041 paid",
    time: "Mon",
    date: "2026-04-13T10:00:00",
  },
];

export default function Preview() {
  const [items, setItems] = React.useState(ITEMS);
  const [open, setOpen] = React.useState(true);
  return (
    <div
      // overflow: on the narrowest docs pages the panel is wider than the preview box
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        minHeight: 520,
        overflow: "hidden",
      }}
    >
      <NotificationCenter
        items={items}
        now={NOW}
        open={open}
        onOpenChange={setOpen}
        sheet={false}
        side="top"
        onReadAll={() => setItems((all) => all.map((n) => ({ ...n, unread: false })))}
        onOpen={(n) =>
          setItems((all) => all.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))
        }
      />
    </div>
  );
}
