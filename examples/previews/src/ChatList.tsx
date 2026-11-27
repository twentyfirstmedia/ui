import * as React from "react";
import { ChatList } from "@twentyfirstmedia/ui-core";
import type { ChatListProps } from "@twentyfirstmedia/ui-core";

const groups: ChatListProps["groups"] = [
  {
    title: "Pinned",
    items: [
      {
        id: "mb",
        name: "Main Brain",
        sub: "Morning briefing is ready",
        time: "08:00",
        tint: "lilac",
        status: "ok",
        pinned: true,
      },
    ],
  },
  {
    title: "Northwind",
    mark: "sky",
    items: [
      {
        id: "atlas",
        name: "Atlas",
        sub: "Waiting for your approval",
        time: "09:41",
        tint: "sky",
        status: "signal",
        unread: 2,
        project: "Northwind",
        date: "2026-04-16T09:41:00",
        from: ["Atlas", "Mara Ellis"],
      },
      {
        id: "ads",
        name: "Ads",
        sub: "Budget at 82%",
        time: "Tue",
        tint: "mint",
        status: "warn",
        project: "Northwind",
        date: "2026-04-14T17:00:00",
      },
      {
        id: "scout",
        name: "Scout",
        sub: "Paused · no budget left",
        time: "Mon",
        tint: "butter",
        status: "idle",
        project: "Northwind",
        date: "2026-04-13T08:00:00",
      },
    ],
  },
  {
    title: "Finance",
    mark: "butter",
    items: [
      {
        id: "ledger",
        name: "Ledger",
        sub: "Error: bank feed expired",
        time: "Mon",
        tint: "butter",
        status: "danger",
        project: "Finance",
        date: "2026-04-13T10:00:00",
      },
    ],
  },
  {
    title: "People",
    items: [
      {
        id: "lena",
        name: "Lena Hart",
        sub: "Sounds good",
        time: "Mon",
        avatar: true,
        unread: 1,
        date: "2026-04-13T11:00:00",
      },
    ],
  },
];

export default function Preview() {
  const [selected, setSelected] = React.useState("atlas");
  const [query, setQuery] = React.useState("in:northwind before:2026-04-15");
  return (
    <div className="tf-panel" style={{ maxWidth: 360, height: 520 }}>
      <ChatList
        groups={groups}
        selected={selected}
        onSelect={setSelected}
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Search, or from: in: before:"
      />
    </div>
  );
}
