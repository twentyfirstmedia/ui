"use client";
import * as React from "react";
import { useStrings } from "../context.js";
import { NAVIGATION_STRINGS } from "../strings.js";
import { cx } from "../cx.js";
import { Icon } from "../Icon.js";
import { FOCUSABLE, moveFocus, useControlled, useId, useOutside } from "../hooks.js";
import { Portal } from "../portal.js";
import { Avatar, IconButton } from "./foundation.js";
import { Menu } from "./feedback.js";
import { Popover } from "./overlays.js";
import type {
  BreadcrumbProps,
  MenubarProps,
  NavigationMenuProps,
  PaginationProps,
  SidebarItem,
  SidebarProps,
  TabsProps,
  UserMenuProps,
} from "./types.js";

/* ── Navigation ── */
export function Tabs(p: TabsProps) {
  const items = p.items || [],
    st = React.useState(p.defaultValue || items[0]),
    val = p.value != null ? p.value : st[0];
  const uid = useId("tabs");
  const wrap = React.useRef<HTMLDivElement>(null),
    ind = React.useState({
      x: 0,
      w: 0,
      ready: false,
    });
  React.useLayoutEffect(() => {
    const el = wrap.current && wrap.current.querySelector<HTMLElement>('[aria-selected="true"]');
    if (el)
      ind[1]({
        x: el.offsetLeft,
        w: el.offsetWidth,
        ready: true,
      });
  }, [val, items.join("|")]);
  const choose = (it: string) => {
    st[1](it);
    p.onChange && p.onChange(it);
  };
  const key = (it: string) => uid + "-" + items.indexOf(it);
  const bar = (
    <div
      ref={wrap}
      className={cx("tf-tabs", p.block && "tf-tabs-block", p.className)}
      style={p.panels ? undefined : p.style}
      role="tablist"
      aria-label={p.label}
      onKeyDown={(e) => {
        if (moveFocus(e, wrap.current, '[role="tab"]', "horizontal")) {
          const t = (document.activeElement as HTMLElement | null)?.dataset.tab;
          if (t != null) choose(t);
        }
      }}
    >
      <span
        className="tf-tabs-ind"
        aria-hidden
        style={{
          width: ind[0].w,
          transform: "translateX(" + ind[0].x + "px)",
          opacity: ind[0].ready ? 1 : 0,
        }}
      />
      {items.map((it) => (
        <button
          key={it}
          id={key(it) + "-t"}
          type="button"
          role="tab"
          className="tf-tab"
          data-tab={it}
          aria-selected={it === val ? "true" : "false"}
          aria-controls={p.panels ? key(it) + "-p" : undefined}
          tabIndex={it === val ? 0 : -1}
          onClick={() => choose(it)}
        >
          {it}
        </button>
      ))}
    </div>
  );
  if (!p.panels) return bar;
  return (
    <div className="tf-tabset" style={p.style}>
      {bar}
      {items.map((it) => (
        <div
          key={it}
          id={key(it) + "-p"}
          role="tabpanel"
          aria-labelledby={key(it) + "-t"}
          className="tf-tabpanel"
          tabIndex={0}
          hidden={it !== val}
        >
          {p.panels?.[it]}
        </div>
      ))}
    </div>
  );
}

export function Breadcrumb(p: BreadcrumbProps) {
  const t = useStrings(NAVIGATION_STRINGS);
  const items = p.items || [];
  return (
    <nav className="tf-crumbs" aria-label={t.breadcrumb}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {last ? <span aria-current="page">{it}</span> : <a href="#">{it}</a>}
            {!last && <Icon name="chevronRight" size={13} />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export function Pagination(p: PaginationProps) {
  const t = useStrings(NAVIGATION_STRINGS);
  const total = Math.max(1, p.total || 1),
    // `page` is controlled once someone listens; `page` alone stays the start page (as before)
    controlled = p.page !== undefined && p.onChange !== undefined,
    v = useControlled(controlled ? p.page : undefined, p.defaultPage ?? p.page ?? 1, p.onChange),
    cur = Math.min(total, Math.max(1, v[0])),
    go = (n: number) => {
      const next = Math.min(total, Math.max(1, n));
      if (next !== cur) v[1](next);
    },
    pages: (number | "…")[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - cur) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }
  return (
    <nav className="tf-pager" aria-label={t.pagination}>
      <IconButton
        icon="chevronLeft"
        label={t.previousPage}
        size="sm"
        onClick={() => {
          go(cur - 1);
        }}
      />
      {pages.map((n, i) =>
        n === "…" ? (
          <span key={"e" + i} className="tf-page" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            className="tf-page"
            aria-current={n === cur ? "page" : undefined}
            onClick={() => {
              go(n);
            }}
          >
            {n}
          </button>
        ),
      )}
      <IconButton
        icon="chevronRight"
        label={t.nextPage}
        size="sm"
        onClick={() => {
          go(cur + 1);
        }}
      />
    </nav>
  );
}

/* ── Data ── */

/* ── Menubar ── */
export function Menubar(p: MenubarProps) {
  const bar = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState<number | null>(null);
  const [focusMenu, setFocusMenu] = React.useState(false);
  useOutside(bar, open != null, () => setOpen(null));
  const tops = () =>
    Array.from(
      bar.current?.querySelectorAll<HTMLElement>(":scope > .tf-menubar-item > button") || [],
    );
  const focusTop = (i: number) => tops()[i]?.focus();
  return (
    <div
      ref={bar}
      className={cx("tf-menubar", p.className)}
      style={p.style}
      role="menubar"
      aria-label={p.label}
      onKeyDown={(e) => {
        const n = p.menus.length;
        const i = tops().indexOf(document.activeElement as HTMLElement);
        const inMenu = (e.target as HTMLElement).closest(".tf-menu");
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          // inside a submenu the menu handles ←/→ itself
          if (inMenu && (e.target as HTMLElement).closest(".tf-menu-sub")) return;
          if (
            inMenu &&
            e.key === "ArrowRight" &&
            (e.target as HTMLElement).getAttribute("aria-haspopup")
          )
            return;
          e.preventDefault();
          const cur = open ?? i;
          const next = (cur + (e.key === "ArrowRight" ? 1 : -1) + n) % n;
          if (open != null) {
            setFocusMenu(true);
            setOpen(next);
          }
          focusTop(next);
        } else if (
          !inMenu &&
          (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") &&
          i >= 0
        ) {
          e.preventDefault();
          setFocusMenu(true);
          setOpen(i);
        } else if (!inMenu && (e.key === "Home" || e.key === "End")) {
          e.preventDefault();
          focusTop(e.key === "Home" ? 0 : n - 1);
        }
      }}
    >
      {p.menus.map((m, i) => (
        <div key={m.label} className="tf-menubar-item">
          <button
            type="button"
            role="menuitem"
            className="tf-menubar-btn"
            aria-haspopup="menu"
            aria-expanded={open === i}
            tabIndex={i === (open ?? 0) ? 0 : -1}
            onClick={() => {
              setFocusMenu(false);
              setOpen(open === i ? null : i);
            }}
            onPointerEnter={() => open != null && open !== i && setOpen(i)}
          >
            {m.label}
          </button>
          {open === i && (
            <Menu
              className="tf-menubar-menu"
              label={m.label}
              items={m.items}
              autoFocus={focusMenu}
              onClose={() => {
                setOpen(null);
                focusTop(i);
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── NavigationMenu: site navigation with dropdown panels ── */
export function NavigationMenu(p: NavigationMenuProps) {
  const strings = useStrings(NAVIGATION_STRINGS);
  const uid = useId("nav");
  const root = React.useRef<HTMLElement>(null);
  const [open, setOpen] = React.useState<number | null>(null);
  const t = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useOutside(root, open != null, () => setOpen(null));
  const hover = (i: number | null) => {
    clearTimeout(t.current);
    t.current = setTimeout(() => setOpen(i), i == null ? 150 : 80);
  };
  React.useEffect(() => () => clearTimeout(t.current), []);
  return (
    <nav
      ref={root}
      className={cx("tf-navmenu", p.className)}
      style={p.style}
      aria-label={p.label || strings.mainNavigation}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open != null) {
          const trigger = root.current?.querySelector<HTMLElement>(`#${uid}-t${open}`);
          setOpen(null);
          trigger?.focus();
        }
      }}
    >
      <ul className="tf-navmenu-list">
        {p.items.map((it, i) => (
          <li
            key={it.label}
            className="tf-navmenu-item"
            onPointerEnter={() => it.links && hover(i)}
            onPointerLeave={() => it.links && hover(null)}
          >
            {it.links ? (
              <button
                id={`${uid}-t${i}`}
                type="button"
                className="tf-navmenu-trigger"
                aria-expanded={open === i}
                aria-controls={`${uid}-p${i}`}
                onClick={() => setOpen(open === i ? null : i)}
              >
                {it.label}
                <Icon name="chevronDown" size={14} className="tf-navmenu-chev" />
              </button>
            ) : (
              <a className="tf-navmenu-trigger" href={it.href || "#"}>
                {it.label}
              </a>
            )}
            {it.links && open === i && (
              <div
                id={`${uid}-p${i}`}
                className={cx("tf-navmenu-panel", it.feature && "with-feature")}
              >
                {it.feature && <div className="tf-navmenu-feature">{it.feature}</div>}
                <ul className="tf-navmenu-links">
                  {it.links.map((l) => (
                    <li key={l.label}>
                      <a
                        className="tf-navmenu-link"
                        href={l.href || "#"}
                        onClick={() => {
                          l.onClick?.();
                          setOpen(null);
                        }}
                      >
                        {l.icon && <Icon name={l.icon} />}
                        <span className="tf-option-text">
                          <b>{l.label}</b>
                          {l.description && <small>{l.description}</small>}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ── Sidebar: app navigation with groups, nested pages and a collapsed (icons) mode ── */
/** Whether the screen is phone-sized (the sidebar becomes a drawer there). */
function usePhone(): boolean {
  const [phone, setPhone] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(max-width: 760px)");
    const on = () => setPhone(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return phone;
}

const typing = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

/**
 * A layer next to an element (tooltip, flyout, item menu), drawn in the portal so the sidebar's
 * scrolling body does not clip it, and kept on screen.
 */
function SideLayer(p: {
  anchor: HTMLElement | null;
  place: "right" | "below-end";
  center?: boolean;
  className?: string;
  layerRef?: React.MutableRefObject<HTMLDivElement | null>;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  role?: string;
  label?: string;
  hidden?: boolean;
  /** Move the focus into the layer when it appears (opened from the keyboard) */
  autoFocus?: boolean;
  children: React.ReactNode;
}) {
  const el = React.useRef<HTMLDivElement | null>(null);
  const place = React.useCallback(() => {
    const box = el.current,
      a = p.anchor;
    if (!box || !a) return;
    box.style.left = "0px";
    box.style.top = "0px";
    // where 0,0 lands: the layer's containing block may not be the screen (a transformed parent)
    const o = box.getBoundingClientRect(),
      r = a.getBoundingClientRect();
    let left = p.place === "right" ? r.right + 8 : r.right - o.width;
    let top =
      p.place === "right" ? (p.center ? r.top + r.height / 2 - o.height / 2 : r.top) : r.bottom + 4;
    left = Math.max(8, Math.min(left, window.innerWidth - o.width - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - o.height - 8));
    box.style.left = `${left - o.left}px`;
    box.style.top = `${top - o.top}px`;
  }, [p.anchor, p.place, p.center]);
  const { layerRef, autoFocus } = p;
  // stable, so it runs when the layer appears (the portal mounts a render later), not on every render
  const attach = React.useCallback(
    (n: HTMLDivElement | null) => {
      el.current = n;
      if (layerRef) layerRef.current = n;
      if (!n) return;
      place();
      if (autoFocus) n.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    },
    [place, layerRef, autoFocus],
  );
  React.useEffect(() => {
    place();
  }, [place]);
  React.useEffect(() => {
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [place]);
  return (
    <Portal>
      <div
        ref={attach}
        className={cx("tf-sidebar-layer", p.className)}
        role={p.role}
        aria-label={p.label}
        aria-hidden={p.hidden || undefined}
        onPointerEnter={p.onPointerEnter}
        onPointerLeave={p.onPointerLeave}
        onKeyDown={p.onKeyDown}
      >
        {p.children}
      </div>
    </Portal>
  );
}

type Fly = { id: string; el: HTMLElement; kind: "tip" | "menu"; keyboard?: boolean };

export function Sidebar(p: SidebarProps) {
  const t = useStrings(NAVIGATION_STRINGS);
  const phone = usePhone();
  const collapsedState = useControlled(p.collapsed, !!p.defaultCollapsed, p.onCollapsedChange);
  const collapsed = collapsedState[0] && !phone;
  const setCollapsed = collapsedState[1];
  const drawer = useControlled(p.mobileOpen, false, p.onMobileOpenChange);
  const open = phone && drawer[0];
  const idOf = (it: { id?: string; label: string }) => it.id || it.label;
  const hasCurrent = (it: SidebarItem) =>
    idOf(it) === p.current || !!it.items?.some((c) => idOf(c) === p.current);
  const [expanded, setExpanded] = React.useState<string[]>(() =>
    p.groups.flatMap((g) => g.items.filter((it) => it.items && hasCurrent(it)).map(idOf)),
  );
  const groupKey = (g: SidebarProps["groups"][number], i: number) => g.id || g.label || String(i);
  const [shut, setShut] = React.useState<string[]>(() =>
    p.groups.flatMap((g, i) => (g.collapsible && g.defaultOpen === false ? [groupKey(g, i)] : [])),
  );
  const [fly, setFly] = React.useState<Fly | null>(null);
  const [menuFor, setMenuFor] = React.useState<{ id: string; el: HTMLElement } | null>(null);
  const flyRef = React.useRef<HTMLDivElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const navRef = React.useRef<HTMLElement>(null);
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const uid = useId("side");
  const Link = (p.linkAs || "a") as React.ElementType;

  // remember the collapsed state
  const stored = React.useRef(false);
  React.useEffect(() => {
    if (!p.storageKey) return;
    try {
      const v = localStorage.getItem(p.storageKey);
      if (v === "1" || v === "0") setCollapsed(v === "1");
    } catch {
      /* storage may be off */
    }
    stored.current = true;
  }, [p.storageKey]);
  React.useEffect(() => {
    if (!p.storageKey || !stored.current) return;
    try {
      localStorage.setItem(p.storageKey, collapsedState[0] ? "1" : "0");
    } catch {
      /* storage may be off */
    }
  }, [collapsedState[0], p.storageKey]);

  // ⌘B / Ctrl+B
  React.useEffect(() => {
    if (!p.shortcut) return;
    const k = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        !e.altKey &&
        e.key.toLowerCase() === "b" &&
        !typing(e.target)
      ) {
        e.preventDefault();
        if (phone) drawer[1](!drawer[0]);
        else setCollapsed(!collapsedState[0]);
      }
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [p.shortcut, phone, drawer[0], collapsedState[0]]);

  // the drawer on phones: focus inside, Escape and Tab stay in it, focus returns to the button
  React.useEffect(() => {
    if (!open) return;
    const nav = navRef.current;
    nav?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        drawer[1](false);
        toggleRef.current?.focus();
      } else if (e.key === "Tab" && nav) {
        const els = Array.from(nav.querySelectorAll<HTMLElement>(FOCUSABLE));
        const a = els[0],
          z = els[els.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          z?.focus();
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault();
          a?.focus();
        }
      }
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open]);

  // flyouts close when collapsing ends, and on a click elsewhere
  React.useEffect(() => {
    if (!collapsed) setFly(null);
  }, [collapsed]);
  React.useEffect(() => {
    if (!fly && !menuFor) return;
    const down = (e: PointerEvent) => {
      const n = e.target as Node;
      if (fly && !fly.el.contains(n) && !flyRef.current?.contains(n)) setFly(null);
      if (menuFor && !menuFor.el.contains(n) && !menuRef.current?.contains(n)) setMenuFor(null);
    };
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  }, [fly, menuFor]);

  const pick = (id: string) => {
    p.onPick?.(id);
    setFly(null);
    if (open) drawer[1](false);
  };
  const later = (fn: () => void, ms: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(fn, ms);
  };

  const inner = (
    it: Omit<SidebarItem, "items"> & { items?: SidebarItem["items"] },
    nested: boolean,
  ) => (
    <>
      {!nested && <Icon name={it.icon} />}
      <span className="tf-sidebar-label">{it.label}</span>
      {it.external && (
        <>
          <Icon name="arrowUpRight" size={14} className="tf-sidebar-ext" />
          <span className="tf-sidebar-sr">{t.opensInNewTab}</span>
        </>
      )}
      {it.badge === "dot" ? (
        <span className="tf-sidebar-dot">
          <span className="tf-sidebar-sr">{t.newActivity}</span>
        </span>
      ) : it.badge ? (
        <span className="tf-sidebar-badge">{it.badge}</span>
      ) : null}
      {it.count ? <span className="tf-sidebar-count">{it.count}</span> : null}
      {it.items && <Icon name="chevronDown" size={14} className="tf-sidebar-chev" />}
    </>
  );

  const row = (
    it: Omit<SidebarItem, "items"> & { items?: SidebarItem["items"] },
    nested = false,
  ) => {
    const id = idOf(it);
    const isOpen = expanded.includes(id);
    const current = id === p.current;
    const parentCurrent = !!it.items && hasCurrent(it as SidebarItem);
    const cls = cx(
      "tf-sidebar-item",
      nested && "nested",
      parentCurrent && "has-current",
      fly?.id === id && "flying",
    );
    const hover = collapsed && !nested;
    const showFly = (el: HTMLElement, keyboard = false) =>
      setFly({ id, el, kind: it.items ? "menu" : "tip", keyboard });
    const itemProps = {
      className: cls,
      "aria-current": current ? ("page" as const) : undefined,
      onFocus: hover
        ? (e: React.FocusEvent<HTMLElement>) => {
            if (!it.items) showFly(e.currentTarget);
          }
        : undefined,
      onBlur: hover && !it.items ? () => setFly(null) : undefined,
    };
    let control: React.ReactNode;
    if (it.items)
      control = (
        <button
          type="button"
          {...itemProps}
          aria-expanded={collapsed ? fly?.id === id : isOpen}
          aria-controls={!collapsed && isOpen ? `${uid}-${id}` : undefined}
          aria-haspopup={collapsed ? "true" : undefined}
          disabled={it.disabled}
          onClick={(e) => {
            if (collapsed) {
              if (fly?.id === id && fly.kind === "menu") setFly(null);
              else showFly(e.currentTarget, e.detail === 0);
            } else setExpanded(isOpen ? expanded.filter((x) => x !== id) : expanded.concat(id));
          }}
          onKeyDown={(e) => {
            if (collapsed && e.key === "ArrowRight") {
              e.preventDefault();
              showFly(e.currentTarget, true);
            }
          }}
        >
          {inner(it, nested)}
        </button>
      );
    else if (it.href && !it.disabled)
      control = (
        <Link
          href={it.href}
          {...itemProps}
          {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          onClick={() => pick(id)}
        >
          {inner(it, nested)}
        </Link>
      );
    else
      control = (
        <button type="button" {...itemProps} disabled={it.disabled} onClick={() => pick(id)}>
          {inner(it, nested)}
        </button>
      );
    return (
      <li
        key={id}
        className={cx("tf-sidebar-li", it.actions && !collapsed && "with-actions")}
        onPointerEnter={
          hover
            ? (e) => {
                const el = e.currentTarget.firstElementChild as HTMLElement;
                later(() => setFly({ id, el, kind: it.items ? "menu" : "tip" }), 120);
              }
            : undefined
        }
        onPointerLeave={hover ? () => later(() => setFly(null), 160) : undefined}
      >
        {control}
        {it.actions && !collapsed && (
          <IconButton
            icon="more"
            label={t.moreActionsFor(it.label)}
            variant="ghost"
            size="sm"
            className="tf-sidebar-more"
            aria-haspopup="menu"
            aria-expanded={menuFor?.id === id}
            onClick={(e) =>
              setMenuFor(menuFor?.id === id ? null : { id, el: e.currentTarget as HTMLElement })
            }
          />
        )}
        {it.items && isOpen && !collapsed && (
          <ul id={`${uid}-${id}`} className="tf-sidebar-sub">
            {it.items.map((c) => row(c, true))}
          </ul>
        )}
        {menuFor?.id === id && it.actions && (
          <SideLayer anchor={menuFor.el} place="below-end" layerRef={menuRef}>
            <Menu
              items={it.actions}
              label={t.moreActionsFor(it.label)}
              autoFocus
              onClose={() => {
                const el = menuFor.el;
                setMenuFor(null);
                el.focus();
              }}
            />
          </SideLayer>
        )}
      </li>
    );
  };

  const flyItem = fly
    ? p.groups.flatMap((g) => g.items).find((it) => idOf(it) === fly.id)
    : undefined;
  const state = { collapsed };
  const header = typeof p.header === "function" ? p.header(state) : p.header;
  const footer = typeof p.footer === "function" ? p.footer(state) : p.footer;
  const variant = p.variant || "floating";
  return (
    <>
      <div className={cx("tf-sidebar-bar", variant)}>
        <IconButton
          ref={toggleRef}
          icon="menu"
          label={open ? t.closeNavigation : t.openNavigation}
          variant="ghost"
          aria-expanded={open}
          aria-controls={`${uid}-nav`}
          onClick={() => drawer[1](!drawer[0])}
        />
        {(typeof p.header === "function" ? p.header({ collapsed: false }) : p.header) || null}
      </div>
      {open && <div className="tf-sidebar-scrim" onClick={() => drawer[1](false)} />}
      <nav
        ref={navRef}
        id={`${uid}-nav`}
        className={cx(
          "tf-sidebar",
          variant !== "floating" && variant,
          collapsed && "collapsed",
          open && "open",
          p.className,
        )}
        style={p.style}
        aria-label={p.label || t.sidebar}
      >
        {header && <div className="tf-sidebar-head">{header}</div>}
        <div className="tf-sidebar-body">
          {p.groups.map((g, gi) => {
            const key = groupKey(g, gi);
            const isShut = !collapsed && shut.includes(key);
            return (
              <div key={key} className="tf-sidebar-group">
                {(g.label || g.action) && (
                  <div className="tf-sidebar-grouphead">
                    {g.label && g.collapsible ? (
                      <button
                        type="button"
                        className="tf-sidebar-grouplabel"
                        id={`${uid}-g${gi}`}
                        aria-expanded={!isShut}
                        aria-controls={`${uid}-gl${gi}`}
                        onClick={() =>
                          setShut(isShut ? shut.filter((x) => x !== key) : shut.concat(key))
                        }
                      >
                        {g.label}
                        <Icon name="chevronDown" size={12} className="tf-sidebar-chev" />
                      </button>
                    ) : g.label ? (
                      <div className="tf-sidebar-grouplabel" id={`${uid}-g${gi}`}>
                        {g.label}
                      </div>
                    ) : null}
                    {g.action && !collapsed && (
                      <IconButton
                        icon={g.action.icon || "plus"}
                        label={g.action.label}
                        variant="ghost"
                        size="sm"
                        className="tf-sidebar-groupaction"
                        onClick={g.action.onClick}
                      />
                    )}
                  </div>
                )}
                {!isShut && (
                  <ul id={`${uid}-gl${gi}`} aria-labelledby={g.label ? `${uid}-g${gi}` : undefined}>
                    {g.items.map((it) => row(it))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
        <div className="tf-sidebar-foot">
          {footer}
          <IconButton
            icon={collapsed ? "chevronRight" : "chevronLeft"}
            label={collapsed ? t.expandSidebar : t.collapseSidebar}
            variant="ghost"
            size="sm"
            className="tf-sidebar-toggle"
            aria-keyshortcuts={p.shortcut ? "Meta+B Control+B" : undefined}
            onClick={() => setCollapsed(!collapsedState[0])}
          />
        </div>
      </nav>
      {fly && flyItem && fly.kind === "tip" && (
        <SideLayer anchor={fly.el} place="right" center className="tf-sidebar-tip" hidden>
          {flyItem.label}
          {flyItem.count ? <span className="tf-sidebar-tipcount">{flyItem.count}</span> : null}
        </SideLayer>
      )}
      {fly && flyItem && fly.kind === "menu" && flyItem.items && (
        <SideLayer
          anchor={fly.el}
          place="right"
          className="tf-sidebar-flyout"
          layerRef={flyRef}
          autoFocus={fly.keyboard}
          role="group"
          label={flyItem.label}
          onPointerEnter={() => clearTimeout(timer.current)}
          onPointerLeave={() => !fly.keyboard && later(() => setFly(null), 160)}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "ArrowLeft") {
              e.preventDefault();
              const el = fly.el;
              setFly(null);
              el.focus();
            } else moveFocus(e, flyRef.current, "a, button");
          }}
        >
          <div className="tf-sidebar-flytitle">{flyItem.label}</div>
          <ul>
            {flyItem.items.map((c) => {
              const cid = idOf(c);
              const cls = cx("tf-sidebar-item", "nested");
              const cur = cid === p.current ? ("page" as const) : undefined;
              return (
                <li key={cid}>
                  {c.href && !c.disabled ? (
                    <Link
                      href={c.href}
                      className={cls}
                      aria-current={cur}
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      onClick={() => pick(cid)}
                    >
                      {inner(c, true)}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={cls}
                      aria-current={cur}
                      disabled={c.disabled}
                      onClick={() => pick(cid)}
                    >
                      {inner(c, true)}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </SideLayer>
      )}
    </>
  );
}

/** The signed-in person with their account menu (profile, settings, sign out). */
export function UserMenu(p: UserMenuProps) {
  const t = useStrings(NAVIGATION_STRINGS);
  return (
    <Popover
      className={cx("tf-usermenu-wrap", p.className)}
      width={240}
      side={p.side || "top"}
      block={!p.compact}
      trigger={({ open, toggle }) => (
        <button
          type="button"
          className={cx("tf-usermenu", p.compact && "compact")}
          style={p.style}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={toggle}
        >
          <span aria-hidden="true" className="tf-usermenu-avatar">
            <Avatar name={p.name} src={p.avatar} size={32} />
          </span>
          {/* compact: the initials are decoration, the name is read out */}
          {p.compact && <span className="tf-sidebar-sr">{`${t.account}: ${p.name}`}</span>}
          {!p.compact && (
            <>
              <span className="tf-usermenu-text">
                <span className="tf-usermenu-name">{p.name}</span>
                {p.email && <span className="tf-usermenu-mail">{p.email}</span>}
              </span>
              <Icon name="chevronDown" size={14} />
            </>
          )}
        </button>
      )}
    >
      {({ close }) => <Menu label={t.account} autoFocus onClose={close} items={p.items || []} />}
    </Popover>
  );
}
