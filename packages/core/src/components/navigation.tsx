"use client";
import * as React from "react";
import { cx } from "../cx.js";
import { Icon } from "../Icon.js";
import { L } from "../i18n.js";
import { IconButton } from "./foundation.js";
import type { BreadcrumbProps, PaginationProps, TabsProps } from "./types.js";

/* ── Navigation ── */
export function Tabs(p: TabsProps) {
  const items = p.items || [],
    st = React.useState(p.defaultValue || items[0]),
    val = p.value != null ? p.value : st[0];
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
  return (
    <div
      ref={wrap}
      className={cx("tf-tabs", p.block && "tf-tabs-block", p.className)}
      role="tablist"
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
          type="button"
          role="tab"
          className="tf-tab"
          aria-selected={it === val ? "true" : "false"}
          onClick={() => {
            st[1](it);
            p.onChange && p.onChange(it);
          }}
        >
          {it}
        </button>
      ))}
    </div>
  );
}

export function Breadcrumb(p: BreadcrumbProps) {
  const items = p.items || [];
  return (
    <nav className="tf-crumbs" aria-label={L("Breadcrumb")}>
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
  const total = p.total || 1,
    st = React.useState(p.page || 1),
    cur = st[0],
    pages: (number | "…")[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - cur) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }
  return (
    <nav className="tf-pager" aria-label={L("Pagination")}>
      <IconButton
        icon="chevronLeft"
        label={L("Previous page")}
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
        label={L("Next page")}
        size="sm"
        onClick={() => {
          st[1](Math.min(total, cur + 1));
        }}
      />
    </nav>
  );
}

/* ── Data ── */
