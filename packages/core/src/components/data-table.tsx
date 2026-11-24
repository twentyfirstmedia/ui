"use client";
import * as React from "react";
import { useFormat, useStrings } from "../context.js";
import { DATA_TABLE_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { cx } from "../cx.js";
import { SearchField } from "./inputs.js";
import { Popover, Tooltip } from "./overlays.js";
import { Menu } from "./feedback.js";
import { useControlled } from "../hooks.js";
import { Pagination } from "./navigation.js";
import { SelectMenu } from "./select-menu.js";
import type { BaseProps, DataColumn, DataTableProps, FilterBarProps, FilterDef } from "./types.js";

/* ── Data table: sort, select + bulk bar, column toggles, sticky head, expandable rows ── */
export function FilterBar(p: FilterBarProps) {
  const t = useStrings(DATA_TABLE_STRINGS);
  const active = p.value || {},
    keys = Object.keys(active).filter((k) => active[k] != null && active[k] !== "");
  function set(k: string, val: string | null) {
    const n: Record<string, string> = Object.assign({}, active);
    if (val == null) delete n[k];
    else n[k] = val;
    p.onChange?.(n);
  }
  const avail = (p.filters || []).filter((f) => keys.indexOf(f.key) < 0);
  return (
    <div style={p.style} className={cx("tf-filterbar", p.className)}>
      {p.search && (
        <SearchField
          placeholder={p.search}
          value={p.query}
          onChange={(e) => {
            p.onQuery?.(e.target.value);
          }}
          style={{
            minWidth: 0,
            flex: "1 1 220px",
            maxWidth: 320,
          }}
        />
      )}
      {keys.map((k) => {
        const f: FilterDef = (p.filters || []).find((x) => x.key === k) || {
          key: k,
          label: k,
          options: [],
        };
        return (
          <Popover
            key={k}
            width={220}
            flush
            trigger={(s) => (
              <span className="tf-filterchip">
                <button type="button" onClick={s.toggle}>
                  <span>{f.label + ":"}</span>
                  <b>{active[k]}</b>
                </button>
                <button
                  type="button"
                  className="x"
                  aria-label={t.removeFilter(f.label)}
                  onClick={() => {
                    set(k, null);
                  }}
                >
                  <Icon name="x" size={12} />
                </button>
              </span>
            )}
          >
            {(s) => (
              <Menu
                items={f.options.map((o) => ({
                  label: o,
                  icon: o === active[k] ? "check" : undefined,
                  onClick: () => {
                    set(k, o);
                    s.close();
                  },
                }))}
              />
            )}
          </Popover>
        );
      })}
      {avail.length > 0 && (
        <Popover
          width={240}
          flush
          trigger={(s) => (
            <button type="button" className="tf-chip tf-chip-dashed" onClick={s.toggle}>
              <Icon name="plus" size={14} />
              {t.addFilter}
            </button>
          )}
        >
          {(s) => (
            <AddFilterMenu
              avail={avail}
              onPick={(k: string, o: string) => {
                set(k, o);
                s.close();
              }}
            />
          )}
        </Popover>
      )}
      {keys.length > 1 && (
        <button
          type="button"
          className="tf-linkbtn"
          onClick={() => {
            p.onChange?.({});
          }}
        >
          {t.clearAll}
        </button>
      )}
      {p.right && <div className="tf-filterbar-right">{p.right}</div>}
    </div>
  );
}

export function AddFilterMenu(
  p: BaseProps & {
    avail: FilterDef[];
    onPick?: (key: string, option: string) => void;
  },
) {
  const t = useStrings(DATA_TABLE_STRINGS);
  const step = React.useState<FilterDef | null>(null);
  const cur = step[0];
  if (cur)
    return (
      <Menu
        items={[
          {
            label: t.back,
            icon: "chevronLeft",
            onClick: () => {
              step[1](null);
            },
          },
          "-" as const,
          ...cur.options.map((o) => ({
            label: o,
            onClick: () => {
              p.onPick?.(cur.key, o);
            },
          })),
        ]}
      />
    );
  return (
    <Menu
      style={p.style}
      className={p.className}
      items={p.avail.map((f) => ({
        label: f.label,
        icon: f.icon || "filter",
        onClick: () => {
          step[1](f);
        },
      }))}
    />
  );
}

type Sort = { key: string; dir: "asc" | "desc" } | null;
type Key = string | number;

/** Clicks on these, inside a clickable row, do their own thing instead of opening the row. */
const OWN_CONTROLS =
  'a, button, input, select, textarea, label, summary, [role="button"], [role="checkbox"], [role="switch"], [role="menuitem"], [role="option"], [contenteditable=""], [contenteditable="true"], [data-row-click="ignore"]';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<R extends Record<string, any> = Record<string, any>>(
  p: DataTableProps<R>,
) {
  const t = useStrings(DATA_TABLE_STRINGS);
  const { formatNumber } = useFormat();
  const cols = p.columns || [],
    rk = p.rowKey || "id";
  // sorting: controlled by `sort` (the caller sorts) or by the table itself
  const sortControlled = p.sort !== undefined;
  const [sort, setSort] = useControlled<Sort>(p.sort, p.defaultSort || null, p.onSortChange);
  // selection: controlled by `selected` (keys, also of rows on other pages) or kept here
  const selControlled = p.selected !== undefined;
  const [selInner, setSelInner] = React.useState<Key[]>([]);
  const hidden = React.useState(cols.filter((c) => c.hidden).map((c) => c.key)),
    open = React.useState<Record<string, boolean>>({});
  const all = (p.rows || []).slice();
  if (sort && !sortControlled) {
    const c0 = cols.find((c) => c.key === sort.key),
      dir = sort.dir === "desc" ? -1 : 1,
      acc = (c0 && c0.sortValue) || ((r: R) => r[sort.key]);
    all.sort((a, b) => {
      const x = acc(a),
        y = acc(b);
      return (x > y ? 1 : x < y ? -1 : 0) * dir;
    });
  }
  // paging: the table slices `rows` itself, or shows them as they are (`rowCount`: server side)
  const [size, setSize] = React.useState(p.pageSize || 0);
  React.useEffect(() => {
    if (p.pageSize) setSize(p.pageSize);
  }, [p.pageSize]);
  const paged = size > 0;
  const total = p.rowCount ?? all.length;
  const pages = paged ? Math.max(1, Math.ceil(total / size)) : 1;
  const pageControlled = p.page !== undefined && p.onPageChange !== undefined;
  const [pageV, setPage] = useControlled<number>(
    pageControlled ? p.page : undefined,
    p.defaultPage ?? p.page ?? 1,
    p.onPageChange,
  );
  const page = Math.min(pages, Math.max(1, pageV));
  const rows = paged && p.rowCount === undefined ? all.slice((page - 1) * size, page * size) : all;
  const vis = cols.filter((c) => hidden[0].indexOf(c.key) < 0);
  const allIds = all.map((r) => r[rk] as Key),
    ids = rows.map((r) => r[rk] as Key);
  // uncontrolled selection keeps what is still among the rows (all pages when the table pages)
  const selected: Key[] = selControlled
    ? (p.selected as Key[])
    : selInner.filter((id) => allIds.indexOf(id) >= 0);
  const setSelected = (next: Key[]) => {
    if (!selControlled) setSelInner(next);
    p.onSelectedChange?.(next);
  };
  const onPage = ids.filter((id) => selected.indexOf(id) >= 0);
  const allOn = ids.length > 0 && onPage.length === ids.length,
    some = onPage.length > 0 && !allOn;
  // range selection: a click sets the anchor, Shift+click (or Shift+Space) selects every row
  // between the anchor and the clicked row as shown on this page, or clears them when the anchor
  // is cleared; the clicked row becomes the new anchor
  const anchor = React.useRef<Key | null>(null);
  const shift = React.useRef(false);
  const shiftKey = React.useRef(false);
  function toggle(id: Key) {
    const range = shift.current || shiftKey.current;
    shift.current = false;
    const a = anchor.current;
    const from = a === null ? -1 : ids.indexOf(a),
      to = ids.indexOf(id);
    anchor.current = id;
    if (range && from >= 0 && to >= 0 && a !== id) {
      const span = ids.slice(Math.min(from, to), Math.max(from, to) + 1);
      setSelected(
        selected.indexOf(a as Key) >= 0
          ? selected.concat(span.filter((x) => selected.indexOf(x) < 0))
          : selected.filter((x) => span.indexOf(x) < 0),
      );
      return;
    }
    setSelected(
      selected.indexOf(id) >= 0 ? selected.filter((x) => x !== id) : selected.concat([id]),
    );
  }
  // where the Shift key is: a click carries it, a key press on the checkbox (Space) is followed
  // by a click without it
  const rangeKeys = {
    onClick: (e: React.MouseEvent) => {
      shift.current = e.shiftKey;
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      shiftKey.current = e.shiftKey;
    },
    onKeyUp: (e: React.KeyboardEvent) => {
      shiftKey.current = e.shiftKey;
    },
    onBlur: () => {
      shiftKey.current = false;
    },
  };
  function toggleAll() {
    setSelected(
      allOn
        ? selected.filter((id) => ids.indexOf(id) < 0)
        : selected.concat(ids.filter((id) => selected.indexOf(id) < 0)),
    );
  }
  function cb(
    checked: boolean,
    onChange: () => void,
    label: string,
    ind?: boolean,
    extra?: typeof rangeKeys,
  ) {
    return (
      <span className="tf-checkbox">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          {...extra}
          aria-label={label}
          ref={(el) => {
            if (el) el.indeterminate = !!ind;
          }}
        />
        <span className={cx("tf-checkbox-box", ind && "ind")} aria-hidden>
          <svg
            viewBox="0 0 24 24"
            width={14}
            height={14}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={ind ? "M6 12h12" : "M5 12.5l4.5 4.5L19 7.5"} />
          </svg>
        </span>
      </span>
    );
  }
  const span = vis.length + (p.selectable ? 1 : 0) + (p.renderExpanded ? 1 : 0);
  const selRows = all.filter((r) => selected.indexOf(r[rk] as Key) >= 0);
  const clickable = !!(p.rowHref || p.onRowClick);
  const Link = (p.linkAs || "a") as React.ElementType;
  const label = (c: DataColumn<R>) => (typeof c.label === "string" ? c.label : c.key);

  /** Opens a row from a click anywhere on it; its own controls (and the row link) act alone. */
  function rowClick(r: R, e: React.MouseEvent<HTMLTableRowElement>) {
    const target = e.target as Element;
    const own = target.closest(OWN_CONTROLS);
    if (own && e.currentTarget.contains(own)) return;
    if (typeof window !== "undefined" && String(window.getSelection?.() ?? "")) return;
    p.onRowClick?.(r, e);
    if (e.defaultPrevented || !p.rowHref) return;
    const href = p.rowHref(r);
    if (e.metaKey || e.ctrlKey || e.button === 1) {
      window.open(href, "_blank", "noopener");
      return;
    }
    // the row's own link: a router link navigates on the client, a plain link loads the page
    const link = e.currentTarget.querySelector<HTMLAnchorElement>("a.tf-dt-rowlink");
    if (link) link.click();
    else window.location.assign(href);
  }
  function rowAux(r: R, e: React.MouseEvent<HTMLTableRowElement>) {
    if (e.button !== 1 || !p.rowHref) return;
    const own = (e.target as Element).closest(OWN_CONTROLS);
    if (own && e.currentTarget.contains(own)) return;
    e.preventDefault();
    window.open(p.rowHref(r), "_blank", "noopener");
  }
  function rowKey(r: R, e: React.KeyboardEvent<HTMLTableRowElement>) {
    if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
    e.preventDefault();
    p.onRowClick?.(r, e);
  }

  return (
    <div className={cx("tf-dt", p.className)} style={p.style}>
      {(p.toolbar || p.columnToggle !== false) && (
        <div className="tf-dt-toolbar">
          {p.toolbar}
          {p.columnToggle !== false && (
            <Popover
              align="end"
              width={220}
              flush
              trigger={(s) => (
                <Tooltip label={t.columns}>
                  <button
                    type="button"
                    className="tf-iconbtn tf-iconbtn-soft"
                    aria-label={t.chooseColumns}
                    onClick={s.toggle}
                  >
                    <Icon name="grid" />
                  </button>
                </Tooltip>
              )}
            >
              <div className="tf-menu tf-menu-static">
                <div className="tf-menu-label">{t.columns}</div>
                {cols
                  .filter((c) => c.hideable !== false && c.label)
                  .map((c) => {
                    const on = hidden[0].indexOf(c.key) < 0;
                    return (
                      <label key={c.key} className="tf-menu-item">
                        {cb(
                          on,
                          () => {
                            hidden[1](
                              on ? hidden[0].concat([c.key]) : hidden[0].filter((k) => k !== c.key),
                            );
                          },
                          label(c),
                        )}
                        {c.label}
                      </label>
                    );
                  })}
              </div>
            </Popover>
          )}
        </div>
      )}
      <div
        className={cx("tf-dt-scroll", p.stickyHeader && "sticky", p.stack && "tf-table-stackbox")}
        style={
          p.maxHeight
            ? {
                maxHeight: p.maxHeight,
              }
            : undefined
        }
      >
        <table className={cx("tf-table tf-dt-table", p.stack && "stack")}>
          <thead>
            <tr>
              {p.selectable && (
                <th className="tf-dt-sel">{cb(allOn, toggleAll, t.selectAllRows, some)}</th>
              )}
              {p.renderExpanded && <th className="tf-dt-exp" aria-label={t.expand} />}
              {vis.map((c) => {
                const s = sort && sort.key === c.key ? sort.dir : null;
                return (
                  <th
                    key={c.key}
                    className={cx(c.align === "right" && "tf-num")}
                    style={
                      c.width
                        ? {
                            width: c.width,
                          }
                        : undefined
                    }
                    aria-sort={s ? (s === "asc" ? "ascending" : "descending") : undefined}
                  >
                    {c.sortable ? (
                      <button
                        type="button"
                        className={cx("tf-dt-sort", s && "on")}
                        onClick={() => {
                          setSort(
                            s === "asc"
                              ? { key: c.key, dir: "desc" }
                              : s === "desc"
                                ? null
                                : { key: c.key, dir: "asc" },
                          );
                          if (paged && !pageControlled) setPage(1);
                        }}
                      >
                        {c.label}
                        <Icon
                          name="chevronDown"
                          size={12}
                          className={cx("tf-dt-arrow", s === "asc" && "up", !s && "idle")}
                        />
                      </button>
                    ) : (
                      c.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={span} className="tf-dt-empty">
                  {p.empty || t.nothingMatchesFilters}
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const id = r[rk] as Key,
                  on = selected.indexOf(id) >= 0,
                  ex = !!open[0][String(id)];
                const href = p.rowHref?.(r);
                return (
                  <React.Fragment key={id}>
                    <tr
                      className={cx(
                        on && "selected",
                        ex && "expanded",
                        clickable && "is-clickable",
                      )}
                      onClick={clickable ? (e) => rowClick(r, e) : undefined}
                      onAuxClick={href ? (e) => rowAux(r, e) : undefined}
                      onKeyDown={!href && p.onRowClick ? (e) => rowKey(r, e) : undefined}
                      tabIndex={!href && p.onRowClick ? 0 : undefined}
                    >
                      {p.selectable && (
                        <td className="tf-dt-sel">
                          {cb(
                            on,
                            () => {
                              toggle(id);
                            },
                            t.selectRow,
                            false,
                            rangeKeys,
                          )}
                        </td>
                      )}
                      {p.renderExpanded && (
                        <td className="tf-dt-exp">
                          <button
                            type="button"
                            className={cx("tf-dt-toggle", ex && "open")}
                            aria-expanded={ex}
                            aria-label={ex ? t.collapseRow : t.expandRow}
                            onClick={() => {
                              const n = Object.assign({}, open[0]);
                              n[String(id)] = !ex;
                              open[1](n);
                            }}
                          >
                            <Icon name="chevronRight" size={14} />
                          </button>
                        </td>
                      )}
                      {vis.map((c, ci) => {
                        const content = c.render ? c.render(r) : r[c.key];
                        return (
                          <td
                            key={c.key}
                            className={c.align === "right" ? "tf-num" : undefined}
                            data-label={p.stack ? label(c) : undefined}
                          >
                            {href && ci === 0 ? (
                              <Link className="tf-dt-rowlink" href={href}>
                                {content}
                              </Link>
                            ) : (
                              content
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    {ex && (
                      <tr className="tf-dt-detail">
                        <td colSpan={span}>
                          <div className="tf-dt-detail-in tf-in">{p.renderExpanded?.(r)}</div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {paged && total > 0 && (
        <div className="tf-dt-pager">
          <span className="tf-dt-range">
            {t.rowRange(
              formatNumber((page - 1) * size + 1),
              formatNumber(Math.min(total, page * size)),
              formatNumber(total),
            )}
          </span>
          {p.pageSizes && p.pageSizes.length > 0 && (
            <SelectMenu
              className="tf-dt-size"
              label={t.rowsPerPage}
              hideLabel
              size="sm"
              value={String(size)}
              options={p.pageSizes.map((n) => ({ value: String(n), label: formatNumber(n) }))}
              onChange={(v) => {
                const n = Number(v);
                setSize(n);
                p.onPageSizeChange?.(n);
                setPage(1);
              }}
            />
          )}
          {pages > 1 && <Pagination total={pages} page={page} onChange={setPage} />}
        </div>
      )}
      {p.selectable && selected.length > 0 && (
        <div className="tf-bulkbar" role="toolbar" aria-label={t.bulkActions}>
          <b>{t.selectedCount(selected.length)}</b>
          <button
            type="button"
            className="tf-linkbtn on-frame"
            onClick={() => {
              setSelected([]);
            }}
          >
            {t.clear}
          </button>
          <div className="tf-bulkbar-actions">
            {(p.bulkActions || []).map((a) => (
              <button
                key={a.label}
                type="button"
                className={cx("tf-bulk-btn", a.danger && "danger")}
                onClick={() => {
                  a.onClick(selRows, () => {
                    setSelected([]);
                  });
                }}
              >
                {a.icon && <Icon name={a.icon} size={14} />}
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── More charts ── */
