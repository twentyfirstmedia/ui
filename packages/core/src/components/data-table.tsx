"use client";
import * as React from "react";
import { L } from "../i18n.js";
import { Icon } from "../Icon.js";
import { cx } from "../cx.js";
import { SearchField } from "./inputs.js";
import { Popover, Tooltip } from "./overlays.js";
import { Menu } from "./feedback.js";
import type { DataTableProps, FilterBarProps, FilterDef } from "./types.js";

/* ── Data table: sort, select + bulk bar, column toggles, sticky head, expandable rows ── */
export function FilterBar(p: FilterBarProps) {
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
    <div className="tf-filterbar">
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
                  aria-label={L("Remove filter {name}", {
                    name: f.label,
                  })}
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
              {L("Filter")}
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
          {L("Clear all")}
        </button>
      )}
      {p.right && <div className="tf-filterbar-right">{p.right}</div>}
    </div>
  );
}

export function AddFilterMenu(p: {
  avail: FilterDef[];
  onPick?: (key: string, option: string) => void;
}) {
  const step = React.useState<FilterDef | null>(null);
  const cur = step[0];
  if (cur)
    return (
      <Menu
        items={[
          {
            label: L("Back"),
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<R extends Record<string, any> = Record<string, any>>(
  p: DataTableProps<R>,
) {
  const cols = p.columns || [],
    rk = p.rowKey || "id";
  const sort = React.useState<{ key: string; dir: "asc" | "desc" } | null>(p.defaultSort || null),
    sel = React.useState<unknown[]>([]),
    hidden = React.useState(cols.filter((c) => c.hidden).map((c) => c.key)),
    open = React.useState<Record<string, boolean>>({});
  const sorted = sort[0];
  const rows = (p.rows || []).slice();
  if (sorted) {
    const c0 = cols.find((c) => c.key === sorted.key),
      dir = sorted.dir === "desc" ? -1 : 1,
      acc = (c0 && c0.sortValue) || ((r: R) => r[sorted.key]);
    rows.sort((a, b) => {
      const x = acc(a),
        y = acc(b);
      return (x > y ? 1 : x < y ? -1 : 0) * dir;
    });
  }
  const vis = cols.filter((c) => hidden[0].indexOf(c.key) < 0);
  const ids = rows.map((r) => r[rk]),
    selected = sel[0].filter((id) => ids.indexOf(id) >= 0);
  const all = ids.length > 0 && selected.length === ids.length,
    some = selected.length > 0 && !all;
  function toggle(id: unknown) {
    sel[1](selected.indexOf(id) >= 0 ? selected.filter((x) => x !== id) : selected.concat([id]));
  }
  function cb(checked: boolean, onChange: () => void, label: string, ind?: boolean) {
    return (
      <span className="tf-checkbox">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
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
  const selRows = rows.filter((r) => selected.indexOf(r[rk]) >= 0);
  return (
    <div className={cx("tf-dt", p.className)}>
      {(p.toolbar || p.columnToggle !== false) && (
        <div className="tf-dt-toolbar">
          {p.toolbar}
          {p.columnToggle !== false && (
            <Popover
              align="end"
              width={220}
              flush
              trigger={(s) => (
                <Tooltip label={L("Columns")}>
                  <button
                    type="button"
                    className="tf-iconbtn tf-iconbtn-soft"
                    aria-label={L("Choose columns")}
                    onClick={s.toggle}
                  >
                    <Icon name="grid" />
                  </button>
                </Tooltip>
              )}
            >
              <div className="tf-menu tf-menu-static">
                <div className="tf-menu-label">{L("Columns")}</div>
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
                          typeof c.label === "string" ? c.label : c.key,
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
        className={cx("tf-dt-scroll", p.stickyHeader && "sticky")}
        style={
          p.maxHeight
            ? {
                maxHeight: p.maxHeight,
              }
            : undefined
        }
      >
        <table className="tf-table tf-dt-table">
          <thead>
            <tr>
              {p.selectable && (
                <th className="tf-dt-sel">
                  {cb(
                    all,
                    () => {
                      sel[1](all ? [] : ids);
                    },
                    L("Select all rows"),
                    some,
                  )}
                </th>
              )}
              {p.renderExpanded && <th className="tf-dt-exp" aria-label={L("Expand")} />}
              {vis.map((c) => {
                const s = sort[0] && sort[0].key === c.key ? sort[0].dir : null;
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
                          sort[1](
                            s === "asc"
                              ? {
                                  key: c.key,
                                  dir: "desc",
                                }
                              : s === "desc"
                                ? null
                                : {
                                    key: c.key,
                                    dir: "asc",
                                  },
                          );
                        }}
                      >
                        {c.label}
                        <Icon
                          name={s === "desc" ? "chevronDown" : "chevronDown"}
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
                  {p.empty || L("Nothing matches these filters.")}
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const id = r[rk],
                  on = selected.indexOf(id) >= 0,
                  ex = !!open[0][String(id)];
                return (
                  <React.Fragment key={id}>
                    <tr className={cx(on && "selected", ex && "expanded")}>
                      {p.selectable && (
                        <td className="tf-dt-sel">
                          {cb(
                            on,
                            () => {
                              toggle(id);
                            },
                            L("Select row"),
                          )}
                        </td>
                      )}
                      {p.renderExpanded && (
                        <td className="tf-dt-exp">
                          <button
                            type="button"
                            className={cx("tf-dt-toggle", ex && "open")}
                            aria-expanded={ex}
                            aria-label={ex ? L("Collapse row") : L("Expand row")}
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
                      {vis.map((c) => (
                        <td key={c.key} className={c.align === "right" ? "tf-num" : undefined}>
                          {c.render ? c.render(r) : r[c.key]}
                        </td>
                      ))}
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
      {p.selectable && selected.length > 0 && (
        <div className="tf-bulkbar" role="toolbar" aria-label={L("Bulk actions")}>
          <b>
            {L("{n} selected", {
              n: selected.length,
            })}
          </b>
          <button
            type="button"
            className="tf-linkbtn on-frame"
            onClick={() => {
              sel[1]([]);
            }}
          >
            {L("Clear")}
          </button>
          <div className="tf-bulkbar-actions">
            {(p.bulkActions || []).map((a) => (
              <button
                key={a.label}
                type="button"
                className={cx("tf-bulk-btn", a.danger && "danger")}
                onClick={() => {
                  a.onClick(selRows, () => {
                    sel[1]([]);
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
