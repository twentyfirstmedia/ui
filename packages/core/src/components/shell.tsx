"use client";
import * as React from "react";
import { useLinkAs, useStrings } from "../context.js";
import { SHELL_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { cx, reduced } from "../cx.js";
import { Avatar, IconButton } from "./foundation.js";
import { Tooltip } from "./overlays.js";
import { useControlled, useId } from "../hooks.js";
import { Sidebar, UserMenu } from "./navigation.js";
import { WorkspaceSwitcher } from "./admin.js";
import { MobileTabBar } from "./app-chrome.js";
import { AppearanceMenu } from "./appearance.js";
import { NotificationCenter, matchPath } from "./frame.js";
import type {
  AppShellProps,
  DockItem,
  AmbientProps,
  DockProps,
  FloatingLayoutProps,
  MobileTabBarItem,
  NavItem,
  SidebarGroup,
  RailItem,
  SideRailProps,
  TopBarProps,
} from "./types.js";

/** True while the nav's labelled width does not fit the space the bar leaves it. */
function useTight(nav: React.RefObject<HTMLDivElement | null>, key: string) {
  const [tight, setTight] = React.useState(false);
  const full = React.useRef(0);
  React.useLayoutEffect(() => {
    const el = nav.current,
      bar = el?.parentElement;
    if (!el || !bar || typeof ResizeObserver === "undefined") return;
    const check = () => {
      const cs = getComputedStyle(bar);
      const kids = Array.from(bar.children) as HTMLElement[];
      const others = kids.reduce((s, k) => (k === el ? s : s + k.offsetWidth), 0);
      const gaps = (parseFloat(cs.columnGap) || 0) * (kids.length - 1);
      const avail =
        bar.clientWidth -
        (parseFloat(cs.paddingLeft) || 0) -
        (parseFloat(cs.paddingRight) || 0) -
        others -
        gaps;
      if (!el.classList.contains("tight")) full.current = el.scrollWidth;
      setTight(full.current > avail + 1);
    };
    const ro = new ResizeObserver(check);
    ro.observe(bar);
    check();
    return () => ro.disconnect();
  }, [nav, key]);
  return tight;
}

const countClass = (tone?: "neutral" | "signal") =>
  cx("tf-nav-count", tone === "signal" && "signal");

export function TopBar(p: TopBarProps) {
  const t = useStrings(SHELL_STRINGS);
  const Link = useLinkAs(p.linkAs);
  const navRef = React.useRef<HTMLDivElement>(null);
  // labels give way to icons when the bar runs out of room, before anything scrolls
  const tight = useTight(navRef, (p.items || []).map((it) => it.label).join("|"));
  return (
    <nav style={p.style} className={cx("tf-topbar", p.className)} aria-label={t.mainNavigation}>
      {p.brand && (
        <span className="tf-brand">
          {p.brand}
          {p.brandDot !== false && <span className="tf-brand-dot" aria-hidden />}
          {p.tag && <span className="tf-brand-tag">{p.tag}</span>}
        </span>
      )}
      <div ref={navRef} className={cx("tf-nav", tight && "tight")}>
        {(p.items || []).map((it) => {
          const id = it.id || it.label;
          const active = id === p.active || it.label === p.active;
          const inner = (
            <>
              <Icon name={it.icon} />
              <span className="tf-nav-label">{it.label}</span>
              {it.count ? <span className={countClass(it.countTone)}>{it.count}</span> : null}
            </>
          );
          return it.href ? (
            <Link
              key={id}
              href={it.href}
              className="tf-nav-item"
              aria-current={active ? "page" : undefined}
              title={it.label}
              onClick={() => p.onNavigate?.(id)}
            >
              {inner}
            </Link>
          ) : (
            <button
              key={id}
              type="button"
              className="tf-nav-item"
              aria-current={active ? "page" : undefined}
              title={it.label}
              onClick={() => {
                p.onNavigate && p.onNavigate(id);
              }}
            >
              {inner}
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
          title={p.user.email ? `${p.user.name} · ${p.user.email}` : p.user.name}
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

function railBtn(it: RailItem, i: number, expanded: boolean, Link: React.ElementType) {
  const Tag: React.ElementType = it.href ? Link : "button";
  const btn = (
    <Tag
      key={it.label}
      {...(it.href ? { href: it.href } : { type: "button" })}
      className="tf-rail-btn"
      style={{
        animationDelay: `calc(${200 + i * 50}ms * var(--motion-time, 1))`,
      }}
      aria-label={it.count ? `${it.label}, ${it.count}` : it.label}
      aria-current={it.active ? "page" : undefined}
      onClick={it.onClick}
    >
      <Icon name={it.icon} />
      {expanded && (
        <span className="tf-rail-label" aria-hidden>
          {it.label}
        </span>
      )}
      {it.count ? <span className="tf-dotcount">{it.count}</span> : null}
    </Tag>
  );
  return expanded ? (
    btn
  ) : (
    <Tooltip key={it.label} label={it.label} side="right">
      {btn}
    </Tooltip>
  );
}

export function SideRail(p: SideRailProps) {
  const t = useStrings(SHELL_STRINGS);
  const Link = useLinkAs(p.linkAs);
  const [expanded, setExpanded] = useControlled(
    p.expanded,
    !!p.defaultExpanded,
    p.onExpandedChange,
  );
  const toggleLabel = expanded ? t.collapseRail : t.expandRail;
  const toggle = (
    <button
      type="button"
      className="tf-rail-btn tf-rail-toggle"
      aria-label={toggleLabel}
      aria-expanded={expanded}
      onClick={() => setExpanded(!expanded)}
    >
      <Icon name={expanded ? "chevronLeft" : "chevronRight"} />
      {expanded && (
        <span className="tf-rail-label" aria-hidden>
          {toggleLabel}
        </span>
      )}
    </button>
  );
  return (
    <aside
      style={p.style}
      className={cx("tf-rail", expanded && "expanded", p.className)}
      aria-label={p.label || t.tools}
    >
      <div className="tf-rail-group">
        {(p.top || []).map((it, i) => railBtn(it, i, expanded, Link))}
      </div>
      <div className="tf-rail-group">
        {(p.bottom || []).map((it, i) => railBtn(it, i + 3, expanded, Link))}
        {p.toggle &&
          (expanded ? (
            toggle
          ) : (
            <Tooltip label={toggleLabel} side="right">
              {toggle}
            </Tooltip>
          ))}
      </div>
    </aside>
  );
}

export function Dock(p: DockProps) {
  const t = useStrings(SHELL_STRINGS);
  const Link = useLinkAs(p.linkAs);
  return (
    <div
      className={cx("tf-dock", p.surface && "tf-" + p.surface, p.className)}
      style={p.style}
      role="toolbar"
      aria-label={p.label || t.quickActions}
    >
      {(p.items || []).map((it) => {
        const Tag: React.ElementType = it.href ? Link : "button";
        return (
          <Tag
            key={it.label}
            {...(it.href ? { href: it.href } : { type: "button" })}
            className={cx("tf-dock-btn", "tf-t-" + (it.tint || "plain"))}
            aria-label={it.label}
            title={it.label}
            onClick={it.onClick}
          >
            <Icon name={it.icon} />
          </Tag>
        );
      })}
    </div>
  );
}

/**
 * UI floating over a full-bleed background (a map, a 3D scene, a video): four slots along the
 * edges, glass by default. The background stays interactive wherever no slot sits on it.
 */
/** Measures how far the slots reach into the layout and publishes it as CSS variables. */
function useSafeArea(root: React.RefObject<HTMLDivElement | null>) {
  React.useLayoutEffect(() => {
    const el = root.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const slot = (c: string) => el.querySelector<HTMLElement>(`:scope > .tf-floating-ui > .${c}`);
    const measure = () => {
      const r = el.getBoundingClientRect();
      const top = slot("tf-floating-top"),
        start = slot("tf-floating-start"),
        end = slot("tf-floating-end"),
        bottom = slot("tf-floating-bottom");
      const px = (n: number) => `${Math.max(0, Math.round(n))}px`;
      el.style.setProperty(
        "--floating-safe-top",
        px(top ? top.getBoundingClientRect().bottom - r.top : 0),
      );
      el.style.setProperty(
        "--floating-safe-start",
        px(start ? start.getBoundingClientRect().right - r.left : 0),
      );
      el.style.setProperty(
        "--floating-safe-end",
        px(end ? r.right - end.getBoundingClientRect().left : 0),
      );
      el.style.setProperty(
        "--floating-safe-bottom",
        // the bottom bar, or the end slot while it is a bottom sheet (phones)
        px(
          Math.max(
            bottom ? r.bottom - bottom.getBoundingClientRect().top : 0,
            end && getComputedStyle(end).position === "absolute"
              ? r.bottom - end.getBoundingClientRect().top
              : 0,
          ),
        ),
      );
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.querySelectorAll(":scope > .tf-floating-ui > *").forEach((c) => ro.observe(c));
    measure();
    return () => ro.disconnect();
  });
}

export function FloatingLayout(p: FloatingLayoutProps) {
  const t = useStrings(SHELL_STRINGS);
  const surface = p.surface ?? "glass";
  const root = React.useRef<HTMLDivElement>(null);
  const [sheetFull, setSheetFull] = React.useState(false);
  const sheet = p.end != null && p.endSheet !== false;
  useSafeArea(root);
  const size = (v: number | string | undefined) => (typeof v === "number" ? `${v}px` : v);
  return (
    <div
      ref={root}
      className={cx("tf-floating", sheet && "has-sheet", sheetFull && "sheet-full", p.className)}
      style={
        {
          minHeight: p.height ?? 640,
          ...(p.startWidth != null ? { "--floating-start": size(p.startWidth) } : null),
          ...(p.endWidth != null ? { "--floating-end": size(p.endWidth) } : null),
          ...p.style,
        } as React.CSSProperties
      }
      role="region"
      aria-label={p.label}
      data-surface={surface}
    >
      {p.background != null && <div className="tf-floating-bg">{p.background}</div>}
      <div className="tf-floating-ui">
        {p.top != null && <div className="tf-floating-top">{p.top}</div>}
        {p.start != null && <div className="tf-floating-start">{p.start}</div>}
        {(p.controls != null || p.attribution != null) && (
          <div className="tf-floating-controls">
            {p.controls}
            {p.attribution != null && (
              <div className="tf-floating-attribution">{p.attribution}</div>
            )}
          </div>
        )}
        {p.end != null && (
          <div className="tf-floating-end">
            {sheet && (
              <button
                type="button"
                className="tf-floating-handle"
                aria-expanded={sheetFull}
                aria-label={sheetFull ? t.collapsePanel : t.expandPanel}
                onClick={() => setSheetFull(!sheetFull)}
              />
            )}
            {p.end}
          </div>
        )}
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

/** The AppShell's bar across the frame in sidebar mode (see `AppShellProps.topbar`). */
function ShellBar(p: {
  brand: React.ReactNode;
  shell: AppShellProps;
  find: boolean;
  setFind: (open: boolean) => void;
  extras: React.ReactNode;
}) {
  const t = useStrings(SHELL_STRINGS);
  const s = p.shell;
  const startRef = React.useRef<HTMLDivElement>(null);
  const findRef = React.useRef<HTMLButtonElement>(null);
  const id = useId("shellbar");
  // the search opened over the bar on phones: focus goes into it, Escape closes it again
  React.useEffect(() => {
    if (!p.find) return;
    startRef.current
      ?.querySelector<HTMLElement>(
        "input, textarea, button, [href], [tabindex]:not([tabindex='-1'])",
      )
      ?.focus();
  }, [p.find]);
  const end = s.topExtra != null || s.topEnd != null || p.extras != null;
  return (
    <header className={cx("tf-shell-bar", p.find && "find-open")}>
      <div className="tf-shell-bar-brand">{p.brand}</div>
      <div className="tf-shell-bar-main">
        {s.topStart != null && (
          <div
            ref={startRef}
            id={`${id}-start`}
            className="tf-shell-bar-start"
            onKeyDown={(e) => {
              if (e.key === "Escape" && p.find) {
                e.stopPropagation();
                p.setFind(false);
                findRef.current?.focus();
              }
            }}
          >
            {s.topStart}
          </div>
        )}
        {s.topStart != null &&
          (s.topStartCompact != null && !p.find ? (
            <div className="tf-shell-bar-find">{s.topStartCompact}</div>
          ) : (
            <IconButton
              ref={findRef}
              className="tf-shell-bar-find"
              icon={p.find ? "x" : s.topStartIcon || "search"}
              label={p.find ? t.closeSearch : s.topStartLabel || t.search}
              variant="ghost"
              aria-expanded={p.find}
              aria-controls={`${id}-start`}
              onClick={() => p.setFind(!p.find)}
            />
          ))}
        {typeof s.topbar !== "boolean" && s.topbar != null && (
          <div className="tf-shell-bar-mid">{s.topbar}</div>
        )}
        {end && (
          <div className="tf-shell-bar-end">
            {s.topExtra}
            {s.topEnd}
            {p.extras}
          </div>
        )}
      </div>
    </header>
  );
}

/** A page the shell knows: its id, address, icon and group, for routes and the tab bar. */
type ShellPage = MobileTabBarItem & { group?: string; parent?: string };

function pagesOf(groups: SidebarGroup[]): ShellPage[] {
  const out: ShellPage[] = [];
  for (const g of groups)
    for (const it of g.items || []) {
      // filter options (checkboxes, radios) are not pages
      if (it.checked !== undefined || it.onCheckedChange) continue;
      const id = it.id || it.label;
      out.push({
        id,
        label: it.label,
        icon: it.icon || "file",
        href: it.href,
        count: it.count,
        countTone: it.countTone,
        group: g.label,
      });
      for (const c of it.items || [])
        out.push({
          id: c.id || c.label,
          label: c.label,
          icon: c.icon || it.icon || "file",
          href: c.href,
          group: g.label,
          parent: id,
        });
    }
  return out;
}

export function AppShell(p: AppShellProps) {
  const t = useStrings(SHELL_STRINGS);
  const bar = p.navigation === "sidebar" && p.topbar != null && p.topbar !== false;
  // with the bar the brand sits above the sidebar, so the shell follows the collapsed state
  const [collapsed, setCollapsed] = useControlled(
    p.sidebar?.collapsed,
    !!p.sidebar?.defaultCollapsed,
    p.sidebar?.onCollapsedChange,
  );
  const [find, setFind] = React.useState(false);
  const autoId = useId("main");
  const mainId = p.mainId || autoId;
  const linkAs = p.linkAs ?? p.sidebar?.linkAs;
  const sidebarMode = p.navigation === "sidebar";
  const nav = p.nav || NAV();
  const groups: SidebarGroup[] = p.sidebarGroups || [
    {
      items: nav.map((n) => ({
        id: n.id || n.label,
        label: n.label,
        icon: n.icon,
        count: n.count,
        countTone: n.countTone,
        href: n.href,
      })),
    },
  ];
  const pages: ShellPage[] = sidebarMode
    ? pagesOf(groups)
    : nav.map((n) => ({
        id: n.id || n.label,
        label: n.label,
        icon: n.icon,
        href: n.href,
        count: n.count,
        countTone: n.countTone,
      }));
  // the current page: given, or the page whose address the path is in
  const active = p.active ?? matchPath(p.pathname, pages)?.id;

  // bell and look menu at the end of the top bar
  const extras =
    p.notifications || p.appearance ? (
      <>
        {p.notifications && <NotificationCenter linkAs={linkAs} {...p.notifications} />}
        {p.appearance && (
          <AppearanceMenu {...(typeof p.appearance === "object" ? p.appearance : null)} />
        )}
      </>
    ) : null;

  // the tab bar on phones: the first pages, the rest behind "More"
  const tabCount = p.tabBar ? (typeof p.tabBar === "number" ? p.tabBar : 4) : 0;
  const top = pages.filter((pg) => !pg.parent);
  const fits = top.length <= tabCount + 1;
  const tabs = fits ? top : top.slice(0, tabCount);
  const more = fits ? [] : pages.filter((pg) => !tabs.includes(pg));
  const activeTop = pages.find((pg) => pg.id === active)?.parent ?? active;
  const tabBar = tabCount > 0 && (
    <MobileTabBar
      className="tf-shell-tabbar"
      items={tabs}
      more={more}
      active={tabs.some((pg) => pg.id === activeTop) ? activeTop : active}
      onPick={p.onNavigate}
      linkAs={linkAs}
    />
  );
  const skip = p.skipLink !== false && (
    <a className="tf-skip" href={`#${mainId}`}>
      {t.skipToContent}
    </a>
  );

  if (sidebarMode) {
    const brand = (collapsed: boolean) =>
      p.workspaces ? (
        <WorkspaceSwitcher variant="frame" {...p.workspaces} compact={collapsed} />
      ) : p.brand ? (
        <span className={cx("tf-brand", collapsed && "tf-brand-mini")}>
          {collapsed && typeof p.brand === "string" ? p.brand.slice(0, 1) : p.brand}
          {p.brandDot !== false && <span className="tf-brand-dot" aria-hidden />}
          {p.tag && !collapsed && <span className="tf-brand-tag">{p.tag}</span>}
        </span>
      ) : null;
    const tools = !bar && (p.topExtra || extras);
    return (
      <div
        className={cx(
          "tf-shell",
          "tf-shell-sidebar",
          bar && "tf-shell-has-bar",
          bar && find && "tf-shell-find",
          p.fill && "tf-shell-fill",
          tabCount > 0 && "tf-shell-tabbed",
          p.className,
        )}
        style={p.style}
      >
        {skip}
        {bar && (
          <ShellBar
            brand={brand(collapsed)}
            shell={p}
            find={find}
            setFind={setFind}
            extras={extras}
          />
        )}
        <Sidebar
          variant="shell"
          groups={groups}
          current={active}
          onPick={p.onNavigate}
          linkAs={linkAs}
          header={({ collapsed }) => brand(collapsed)}
          footer={({ collapsed }) =>
            p.user ? (
              <UserMenu
                name={p.user.name}
                email={p.user.email}
                items={p.userMenu}
                compact={collapsed}
              />
            ) : null
          }
          {...p.sidebar}
          {...(bar ? { collapsed, onCollapsedChange: setCollapsed } : null)}
        />
        <div
          className={cx("tf-sheet", !p.railTop && "tf-sheet-norail", !p.side && "tf-sheet-2")}
          style={p.sheetStyle}
        >
          {p.railTop && <SideRail top={p.railTop} bottom={p.railBottom} linkAs={linkAs} />}
          <main
            key={p.contentKey}
            id={mainId}
            tabIndex={-1}
            className={cx("tf-main", p.dock !== false && "tf-main-dock")}
          >
            {tools && (
              <div className="tf-shell-tools">
                {p.topExtra}
                {extras}
              </div>
            )}
            {p.children}
          </main>
          {p.side || null}
          {p.dock !== false && (
            <div className="tf-dock-float">
              <Dock items={p.dockItems || DOCK()} linkAs={linkAs} />
            </div>
          )}
        </div>
        {tabBar}
      </div>
    );
  }
  return (
    <div
      className={cx(
        "tf-shell",
        p.fill && "tf-shell-fill",
        tabCount > 0 && "tf-shell-tabbed",
        p.className,
      )}
      style={p.style}
    >
      {skip}
      <TopBar
        brand={p.brand}
        brandDot={p.brandDot}
        tag={p.tag}
        active={active}
        items={nav}
        onNavigate={p.onNavigate}
        user={p.user}
        linkAs={linkAs}
        extra={
          p.topExtra || extras ? (
            <>
              {p.topExtra}
              {extras}
            </>
          ) : undefined
        }
      />
      <div className={cx("tf-sheet", !p.side && "tf-sheet-2")} style={p.sheetStyle}>
        <SideRail
          top={p.railTop || RAIL_TOP()}
          bottom={p.railBottom || RAIL_BOTTOM()}
          linkAs={linkAs}
        />
        <main
          key={p.contentKey}
          id={mainId}
          tabIndex={-1}
          className={cx("tf-main", p.dock !== false && "tf-main-dock")}
        >
          {p.children}
        </main>
        {p.side || null}
        {p.dock !== false && (
          <div className="tf-dock-float">
            <Dock items={p.dockItems || DOCK()} linkAs={linkAs} />
          </div>
        )}
      </div>
      {tabBar}
    </div>
  );
}
