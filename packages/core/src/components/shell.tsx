"use client";
import * as React from "react";
import { Icon } from "../Icon.js";
import { cx, reduced } from "../cx.js";
import { Avatar } from "./foundation.js";
import type {
  AppShellProps,
  DockItem,
  AmbientProps,
  DockProps,
  FloatingLayoutProps,
  NavItem,
  RailItem,
  SideRailProps,
  TopBarProps,
} from "./types.js";

export function TopBar(p: TopBarProps) {
  return (
    <nav className="tf-topbar" aria-label="Main">
      {p.brand && (
        <span className="tf-brand">
          {p.brand}
          <span className="tf-brand-dot" aria-hidden />
          {p.tag && <span className="tf-brand-tag">{p.tag}</span>}
        </span>
      )}
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
        animationDelay: `calc(${200 + i * 50}ms * var(--motion-time, 1))`,
      }}
      aria-label={it.count ? `${it.label}, ${it.count}` : it.label}
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
    <aside className="tf-rail" aria-label="Tools">
      <div className="tf-rail-group">{(p.top || []).map(railBtn)}</div>
      <div className="tf-rail-group">{(p.bottom || []).map((it, i) => railBtn(it, i + 3))}</div>
    </aside>
  );
}

export function Dock(p: DockProps) {
  return (
    <div
      className={cx("tf-dock", p.surface && "tf-" + p.surface, p.className)}
      style={p.style}
      role="toolbar"
      aria-label={p.label || "Quick actions"}
    >
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

/**
 * UI floating over a full-bleed background (a map, a 3D scene, a video): four slots along the
 * edges, glass by default. The background stays interactive wherever no slot sits on it.
 */
export function FloatingLayout(p: FloatingLayoutProps) {
  const surface = p.surface ?? "glass";
  return (
    <div
      className={cx("tf-floating", p.className)}
      style={{ minHeight: p.height ?? 640, ...p.style }}
      role="region"
      aria-label={p.label}
      data-surface={surface}
    >
      {p.background != null && <div className="tf-floating-bg">{p.background}</div>}
      <div className="tf-floating-ui">
        {p.top != null && <div className="tf-floating-top">{p.top}</div>}
        {p.start != null && <div className="tf-floating-start">{p.start}</div>}
        {p.end != null && <div className="tf-floating-end">{p.end}</div>}
        {p.bottom != null && <div className="tf-floating-bottom">{p.bottom}</div>}
      </div>
      {p.children}
    </div>
  );
}

/**
 * A calm, living background for glass UI: soft colour fields from the kit that drift slowly, or a
 * photo or video under a scrim, or your own layer. Sits behind its container's content.
 */
export function Ambient(p: AmbientProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [paused, setPaused] = React.useState(false);
  const animate = p.animate !== false && !p.src && !p.children;
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !animate || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((e) => setPaused(!e.some((x) => x.isIntersecting)));
    io.observe(el);
    return () => io.disconnect();
  }, [animate]);
  const vid = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    const v = vid.current;
    if (v && reduced(v)) v.pause();
  }, [p.src]);
  const colors = p.colors?.length
    ? p.colors
    : ["var(--ambient-1)", "var(--ambient-2)", "var(--ambient-3)", "var(--ambient-4)"];
  const media = !!p.src && !p.children;
  return (
    <div
      ref={ref}
      aria-hidden
      className={cx(
        "tf-ambient",
        p.fixed && "fixed",
        media && "media",
        !animate && "still",
        p.className,
      )}
      style={p.style}
      data-paused={paused ? "" : undefined}
    >
      {p.children ??
        (media ? (
          p.video ? (
            <video
              ref={vid}
              className="tf-ambient-media"
              src={p.src}
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <img className="tf-ambient-media" src={p.src} alt="" />
          )
        ) : (
          colors.map((c, i) => (
            <span
              key={i}
              className="tf-ambient-field"
              style={{ "--field": c } as React.CSSProperties}
            />
          ))
        ))}
    </div>
  );
}

/** Example navigation shown when `nav` is not given. */
export const NAV = (): NavItem[] => [
  {
    label: "Home",
    icon: "home",
  },
  {
    label: "People",
    icon: "users",
  },
  {
    label: "Projects",
    icon: "grid",
  },
  {
    label: "Inbox",
    icon: "mail",
  },
  {
    label: "Calendar",
    icon: "calendar",
  },
  {
    label: "Billing",
    icon: "card",
  },
  {
    label: "Reports",
    icon: "chart",
  },
  {
    label: "Settings",
    icon: "settings",
  },
];

const RAIL_TOP = (): RailItem[] => [
  {
    label: "Share",
    icon: "share",
    active: true,
  },
  {
    label: "List view",
    icon: "menu",
  },
  {
    label: "Grid view",
    icon: "grid",
  },
];

const RAIL_BOTTOM = (): RailItem[] => [
  {
    label: "Notifications",
    icon: "bell",
    count: 3,
  },
  {
    label: "Zoom in",
    icon: "plus",
  },
  {
    label: "Zoom out",
    icon: "minus",
  },
];

const DOCK = (): DockItem[] => [
  {
    label: "Invite",
    icon: "users",
    tint: "sky",
  },
  {
    label: "New page",
    icon: "file",
    tint: "lilac",
  },
  {
    label: "New invoice",
    icon: "card",
    tint: "blush",
  },
  {
    label: "Announce",
    icon: "send",
    tint: "butter",
  },
  {
    label: "Export",
    icon: "download",
    tint: "mint",
  },
  {
    label: "More",
    icon: "plus",
  },
];

export function AppShell(p: AppShellProps) {
  return (
    <div className={cx("tf-shell", p.className)} style={p.style}>
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
