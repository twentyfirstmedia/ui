"use client";
import * as React from "react";
import { useStrings } from "../context.js";
import { NAVIGATION_STRINGS } from "../strings.js";
import { cx } from "../cx.js";
import { Icon } from "../Icon.js";
import { moveFocus, useControlled, useId, useOutside } from "../hooks.js";
import { IconButton } from "./foundation.js";
import { Menu } from "./feedback.js";
import type {
  BreadcrumbProps,
  MenubarProps,
  NavigationMenuProps,
  PaginationProps,
  SidebarItem,
  SidebarProps,
  TabsProps,
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
  const total = p.total || 1,
    st = React.useState(p.page || 1),
    cur = st[0],
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
          st[1](Math.max(1, cur - 1));
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
              st[1](n);
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
          st[1](Math.min(total, cur + 1));
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
export function Sidebar(p: SidebarProps) {
  const t = useStrings(NAVIGATION_STRINGS);
  const collapsed = useControlled(p.collapsed, !!p.defaultCollapsed, p.onCollapsedChange);
  const idOf = (it: { id?: string; label: string }) => it.id || it.label;
  const hasCurrent = (it: SidebarItem) =>
    idOf(it) === p.current || !!it.items?.some((c) => idOf(c) === p.current);
  const [expanded, setExpanded] = React.useState<string[]>(() =>
    p.groups.flatMap((g) => g.items.filter((it) => it.items && hasCurrent(it)).map(idOf)),
  );
  const uid = useId("side");
  const row = (
    it: Omit<SidebarItem, "items"> & { items?: SidebarItem["items"] },
    nested = false,
  ) => {
    const id = idOf(it);
    const isOpen = expanded.includes(id);
    const current = id === p.current;
    return (
      <li key={id}>
        <button
          type="button"
          className={cx(
            "tf-sidebar-item",
            nested && "nested",
            it.items && hasCurrent(it as SidebarItem) && "has-current",
          )}
          aria-current={current ? "page" : undefined}
          aria-expanded={it.items ? isOpen : undefined}
          aria-controls={it.items && isOpen && !collapsed[0] ? `${uid}-${id}` : undefined}
          title={collapsed[0] ? it.label : undefined}
          onClick={() => {
            if (it.items && !collapsed[0])
              setExpanded(isOpen ? expanded.filter((x) => x !== id) : expanded.concat(id));
            else p.onPick?.(id);
          }}
        >
          {!nested && <Icon name={it.icon} />}
          <span className="tf-sidebar-label">{it.label}</span>
          {it.count ? <span className="tf-subnav-count">{it.count}</span> : null}
          {it.items && <Icon name="chevronDown" size={14} className="tf-sidebar-chev" />}
        </button>
        {it.items && isOpen && !collapsed[0] && (
          <ul id={`${uid}-${id}`} className="tf-sidebar-sub">
            {it.items.map((c) => row(c, true))}
          </ul>
        )}
      </li>
    );
  };
  return (
    <nav
      className={cx("tf-sidebar", collapsed[0] && "collapsed", p.className)}
      style={p.style}
      aria-label={p.label || t.sidebar}
    >
      {p.header && <div className="tf-sidebar-head">{p.header}</div>}
      <div className="tf-sidebar-body">
        {p.groups.map((g, gi) => (
          <div key={g.label || gi} className="tf-sidebar-group">
            {g.label && (
              <div className="tf-sidebar-grouplabel" id={`${uid}-g${gi}`}>
                {g.label}
              </div>
            )}
            <ul aria-labelledby={g.label ? `${uid}-g${gi}` : undefined}>
              {g.items.map((it) => row(it))}
            </ul>
          </div>
        ))}
      </div>
      <div className="tf-sidebar-foot">
        {p.footer}
        <IconButton
          icon={collapsed[0] ? "chevronRight" : "chevronLeft"}
          label={collapsed[0] ? t.expandSidebar : t.collapseSidebar}
          variant="ghost"
          size="sm"
          onClick={() => collapsed[1](!collapsed[0])}
        />
      </div>
    </nav>
  );
}
