/* Shared by the screen examples: the workspace shell (TopBar + SubNav + main + side panel) and the
   standard card footer actions. */
import * as React from "react";
import { Icon, IconButton, SubNav, TopBar } from "@twentyfirstmedia/ui-core";
import type { IconName, SubNavItem, SubNavProps } from "@twentyfirstmedia/ui-core";

export function cardActs(confirm?: IconName) {
  return [
    <IconButton key={1} icon="more" label="More" size="sm" />,
    <IconButton key={2} icon="x" label="Reject" size="sm" />,
    <IconButton key={3} icon={confirm || "check"} label="Approve" size="sm" variant="solid" />,
  ];
}

export const AREAS: [string, IconName][] = [
  ["Workspace", "home"],
  ["Customers", "users"],
  ["Agents", "bot"],
  ["Mail", "mail"],
  ["Code", "code"],
  ["Domains", "globe"],
  ["Finance", "card"],
  ["Files", "folder"],
  ["Account", "settings"],
];

export interface ShellProps {
  area: string;
  pages: SubNavItem[];
  current?: string;
  action?: SubNavProps["action"];
  side?: React.ReactNode;
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}

export function Shell(p: ShellProps) {
  return (
    <div
      className="tf-shell"
      style={{
        position: "relative",
      }}
    >
      <TopBar
        brand="Halo"
        tag="Admin"
        active={p.area}
        items={AREAS.map((a) => ({
          label: a[0],
          icon: a[1],
          count: a[0] === "Mail" ? 2 : undefined,
        }))}
        user={{
          name: "Mara Ellis",
          email: "mara@halo.app",
        }}
        extra={[
          <button key="s" type="button" className="tf-topbtn">
            <Icon name="search" size={15} />
            Search<kbd>⌘K</kbd>
          </button>,
          <button key="b" type="button" className="tf-topbtn icon" aria-label="Notifications, 4">
            <Icon name="bell" size={17} />
            <span className="tf-nav-count">{4}</span>
          </button>,
        ]}
      />
      <div className={p.side ? "tf-sheet tf-sheet-nav tf-sheet-aside" : "tf-sheet tf-sheet-nav"}>
        <SubNav eyebrow={p.area} action={p.action} current={p.current} items={p.pages} />
        <main className="tf-main">{p.children}</main>
        {p.side || null}
      </div>
      {p.overlay || null}
    </div>
  );
}
