"use client";
import * as React from "react";
import { L } from "../i18n.js";
import { Icon } from "../Icon.js";
import { cx } from "../cx.js";
import { Avatar } from "./foundation.js";
import type {
  AppShellProps,
  DockItem,
  DockProps,
  NavItem,
  RailItem,
  SideRailProps,
  TopBarProps,
} from "./types.js";

export function TopBar(p: TopBarProps) {
  return (
    <nav className="tf-topbar" aria-label={L("Main")}>
      <span className="tf-brand">
        {p.brand}
        <span className="tf-brand-dot" aria-hidden />
        {p.tag && <span className="tf-brand-tag">{p.tag}</span>}
      </span>
      <div className="tf-nav">
        {(p.items || []).map((it) => {
          const active = it.label === p.active;
          return (
            <button
              key={it.label}
              type="button"
              className="tf-nav-item"
              aria-current={active ? "page" : undefined}
              title={it.label}
              onClick={() => {
                p.onNavigate && p.onNavigate(it.label);
              }}
            >
              <Icon name={it.icon} />
              <span className="tf-nav-label">{it.label}</span>
              {it.count ? <span className="tf-nav-count">{it.count}</span> : null}
            </button>
          );
        })}
      </div>
      {p.extra && <div className="tf-topbar-extra">{p.extra}</div>}
      {p.user && (
        <button
          type="button"
          className="tf-user"
          aria-haspopup="menu"
          aria-expanded={p.userOpen ? "true" : "false"}
          onClick={p.onUser}
        >
          <Avatar name={p.user.name} size={28} />
          <span className="tf-user-text">
            <span className="tf-user-name">{p.user.name}</span>
            {p.user.email && <span className="tf-user-mail">{p.user.email}</span>}
          </span>
          <Icon name="chevronDown" size={14} />
        </button>
      )}
    </nav>
  );
}

function railBtn(it: RailItem, i: number) {
  return (
    <button
      key={it.label}
      type="button"
      className="tf-rail-btn"
      style={{
        animationDelay: 200 + i * 50 + "ms",
      }}
      aria-label={it.label}
      title={it.label}
      aria-current={it.active ? "page" : undefined}
      onClick={it.onClick}
    >
      <Icon name={it.icon} />
      {it.count ? <span className="tf-dotcount">{it.count}</span> : null}
    </button>
  );
}

export function SideRail(p: SideRailProps) {
  return (
    <aside className="tf-rail" aria-label={L("Tools")}>
      <div className="tf-rail-group">{(p.top || []).map(railBtn)}</div>
      <div className="tf-rail-group">{(p.bottom || []).map((it, i) => railBtn(it, i + 3))}</div>
    </aside>
  );
}

export function Dock(p: DockProps) {
  return (
    <div className="tf-dock" role="toolbar" aria-label={p.label || L("Quick actions")}>
      {(p.items || []).map((it) => (
        <button
          key={it.label}
          type="button"
          className={cx("tf-dock-btn", "tf-t-" + (it.tint || "plain"))}
          aria-label={it.label}
          title={it.label}
          onClick={it.onClick}
        >
          <Icon name={it.icon} />
        </button>
      ))}
    </div>
  );
}

/** Example navigation shown when `nav` is not given. */
export const NAV = (): NavItem[] => [
  {
    label: L("Home"),
    icon: "home",
  },
  {
    label: L("People"),
    icon: "users",
  },
  {
    label: L("Projects"),
    icon: "grid",
  },
  {
    label: L("Inbox"),
    icon: "mail",
  },
  {
    label: L("Calendar"),
    icon: "calendar",
  },
  {
    label: L("Billing"),
    icon: "card",
  },
  {
    label: L("Reports"),
    icon: "chart",
  },
  {
    label: L("Settings"),
    icon: "settings",
  },
];

const RAIL_TOP = (): RailItem[] => [
  {
    label: L("Share"),
    icon: "share",
    active: true,
  },
  {
    label: L("List view"),
    icon: "menu",
  },
  {
    label: L("Grid view"),
    icon: "grid",
  },
];

const RAIL_BOTTOM = (): RailItem[] => [
  {
    label: L("Notifications"),
    icon: "bell",
    count: 3,
  },
  {
    label: L("Zoom in"),
    icon: "plus",
  },
  {
    label: L("Zoom out"),
    icon: "minus",
  },
];

const DOCK = (): DockItem[] => [
  {
    label: L("Invite"),
    icon: "users",
    tint: "sky",
  },
  {
    label: L("New page"),
    icon: "file",
    tint: "lilac",
  },
  {
    label: L("New invoice"),
    icon: "card",
    tint: "blush",
  },
  {
    label: L("Announce"),
    icon: "send",
    tint: "butter",
  },
  {
    label: L("Export"),
    icon: "download",
    tint: "mint",
  },
  {
    label: L("More"),
    icon: "plus",
  },
];

export function AppShell(p: AppShellProps) {
  return (
    <div className="tf-shell" style={p.style}>
      <TopBar
        brand={p.brand}
        tag={p.tag}
        active={p.active}
        items={p.nav || NAV()}
        onNavigate={p.onNavigate}
        user={p.user}
        extra={p.topExtra}
      />
      <div className={cx("tf-sheet", !p.side && "tf-sheet-2")} style={p.sheetStyle}>
        <SideRail top={p.railTop || RAIL_TOP()} bottom={p.railBottom || RAIL_BOTTOM()} />
        <main key={p.contentKey} className={cx("tf-main", p.dock !== false && "tf-main-dock")}>
          {p.children}
        </main>
        {p.side || null}
        {p.dock !== false && (
          <div className="tf-dock-float">
            <Dock items={p.dockItems || DOCK()} />
          </div>
        )}
      </div>
    </div>
  );
}
