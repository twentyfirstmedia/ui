"use client";

import * as React from "react";
import { L, formatMoney } from "../i18n.js";
import { Icon } from "../Icon.js";
import { useTrap } from "../hooks.js";
import { cx } from "../cx.js";
import { Avatar, Badge, Button, IconButton, TintIcon } from "./foundation.js";
import { Tabs } from "./navigation.js";

import type {
  CommandPaletteProps,
  DrawerProps,
  FileCardProps,
  FileThumbProps,
  FlowProps,
  FlowStep,
  IconName,
  InvoicePreviewProps,
  NotificationListProps,
  PaletteItem,
  PermissionMatrixProps,
  SubNavProps,
  Tint,
  TransactionRowProps,
  WizardProps,
} from "./types.js";
export function SubNav(p: SubNavProps) {
  return (
    <nav
      className="tf-subnav"
      aria-label={L("{section} pages", {
        section: p.eyebrow || L("Section"),
      })}
    >
      <div className="tf-subnav-head">
        {p.eyebrow && <span className="tf-subnav-eyebrow">{p.eyebrow}</span>}
        {p.action && (
          <button type="button" className="tf-subnav-action" onClick={p.action.onClick}>
            <Icon name={p.action.icon || "plus"} size={15} />
            <span>{p.action.label}</span>
          </button>
        )}
      </div>
      <div className="tf-subnav-list">
        {(p.items || []).map((it) => {
          const id = it.id || it.label;
          return (
            <button
              key={id}
              type="button"
              className="tf-subnav-item"
              aria-current={p.current === id ? "page" : undefined}
              title={it.label}
              onClick={() => {
                p.onPick && p.onPick(id);
              }}
            >
              <Icon name={it.icon} size={17} />
              <span className="tf-subnav-label">{it.label}</span>
              {it.count ? <span className="tf-subnav-count">{it.count}</span> : null}
            </button>
          );
        })}
      </div>
      {p.children}
    </nav>
  );
}
export function Drawer(p: DrawerProps) {
  const ref = React.useRef<HTMLElement>(null);
  useTrap(ref, p.onClose);
  return (
    <div
      className={cx("tf-drawer-wrap", p.inline && "inline")}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && p.onClose) p.onClose?.();
      }}
    >
      <aside
        ref={ref}
        className="tf-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={p.title}
        style={
          p.width
            ? {
                width: p.width,
              }
            : undefined
        }
      >
        <div
          className="tf-header"
          style={{
            alignItems: "center",
          }}
        >
          <div
            className="tf-row"
            style={{
              flexWrap: "nowrap",
              minWidth: 0,
            }}
          >
            {p.avatar && <Avatar name={p.avatar} size={44} />}
            <div
              style={{
                minWidth: 0,
              }}
            >
              <div className="tf-panel-title">{p.title}</div>
              {p.subtitle && <div className="tf-panel-sub">{p.subtitle}</div>}
            </div>
          </div>
          <IconButton icon="x" label={L("Close")} onClick={p.onClose} />
        </div>
        {p.children}
      </aside>
    </div>
  );
}
export function CommandPalette(p: CommandPaletteProps) {
  const q = React.useState(""),
    idx = React.useState(0),
    ref = React.useRef<HTMLDivElement>(null);
  useTrap(ref, p.onClose);
  const ql = q[0].toLowerCase().trim(),
    all = p.items || [];
  const res = (
    ql
      ? all.filter((it) =>
          ql
            .split(/\s+/)
            .every(
              (w) =>
                (it.label + " " + (it.hint || "") + " " + (it.group || ""))
                  .toLowerCase()
                  .indexOf(w) > -1,
            ),
        )
      : all.filter((it) => !it.searchOnly)
  ).slice(0, 40);
  const cur = Math.min(idx[0], Math.max(0, res.length - 1));
  function run(it: PaletteItem | undefined) {
    if (p.onClose) p.onClose?.();
    if (it && it.run) it.run();
  }
  function key(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      idx[1](Math.min(res.length - 1, cur + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      idx[1](Math.max(0, cur - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(res[cur]);
    }
  }
  const groups: {
    g: string;
    items: [PaletteItem, number][];
  }[] = [];
  res.forEach((it, i) => {
    const g = it.group || L("Results");
    if (!groups.length || groups[groups.length - 1].g !== g)
      groups.push({
        g: g,
        items: [],
      });
    groups[groups.length - 1].items.push([it, i]);
  });
  return (
    <div
      className={cx("tf-palette-wrap", p.inline && "inline")}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && p.onClose) p.onClose?.();
      }}
    >
      <div
        ref={ref}
        className="tf-palette"
        role="dialog"
        aria-modal="true"
        aria-label={L("Command palette")}
      >
        <div className="tf-palette-input">
          <Icon name="search" size={18} />
          <input
            placeholder={p.placeholder || L("Search pages, actions and records…")}
            aria-label={L("Search")}
            value={q[0]}
            onChange={(e) => {
              q[1](e.target.value);
              idx[1](0);
            }}
            onKeyDown={key}
          />
          <kbd>{L("Esc")}</kbd>
        </div>
        <div className="tf-palette-list" role="listbox">
          {res.length ? (
            groups.map((g) => (
              <div key={g.g}>
                <div className="tf-palette-group">{g.g}</div>
                {g.items.map((pair) => {
                  const it = pair[0],
                    i = pair[1];
                  return (
                    <button
                      key={it.id || it.label}
                      type="button"
                      role="option"
                      aria-selected={i === cur ? "true" : "false"}
                      className="tf-palette-item"
                      onMouseMove={() => {
                        if (i !== cur) idx[1](i);
                      }}
                      onClick={() => {
                        run(it);
                      }}
                    >
                      <TintIcon icon={it.icon || "search"} tint={it.tint || "plain"} />
                      <span className="tf-palette-label">
                        <b>{it.label}</b>
                        {it.hint && <span>{it.hint}</span>}
                      </span>
                      {i === cur && <kbd>↵</kbd>}
                    </button>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="tf-palette-empty">
              {L("Nothing matches “{query}”.", {
                query: q[0],
              })}
            </div>
          )}
        </div>
        <div className="tf-palette-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> {L("move")}
          </span>
          <span>
            <kbd>↵</kbd> {L("open")}
          </span>
          <span>
            <kbd>⌘</kbd>
            <kbd>K</kbd>
            {L(" anywhere")}
          </span>
        </div>
      </div>
    </div>
  );
}
export function NotificationList(p: NotificationListProps) {
  const f = React.useState(L("All")),
    items = (p.items || []).filter((n) => f[0] === L("All") || n.unread);
  return (
    <div className="tf-notes" role="region" aria-label={L("Notifications")}>
      <div
        className="tf-header"
        style={{
          alignItems: "center",
          padding: "6px 8px 0",
        }}
      >
        <b
          style={{
            fontSize: 16,
          }}
        >
          {L("Notifications")}
        </b>
        <Button
          variant="ghost"
          size="sm"
          icon="check"
          disabled={!(p.items || []).some((n) => n.unread)}
          onClick={p.onReadAll}
        >
          {L("Mark all read")}
        </Button>
      </div>
      <div
        style={{
          padding: "0 8px",
        }}
      >
        <Tabs block items={[L("All"), L("Unread")]} value={f[0]} onChange={f[1]} />
      </div>
      <div className="tf-notes-list">
        {items.length ? (
          items.map((n) => (
            <button
              key={n.id}
              type="button"
              className={cx("tf-note", n.unread && "unread")}
              onClick={() => {
                p.onOpen && p.onOpen(n);
              }}
            >
              <TintIcon icon={n.icon} tint={n.tint} />
              <span className="tf-note-text">
                <b>{n.title}</b>
                <span>{n.text}</span>
              </span>
              <span className="tf-note-time">
                {n.time}
                {n.unread && <span className="tf-unread" />}
              </span>
            </button>
          ))
        ) : (
          <div className="tf-notes-empty">
            <TintIcon icon="check" tint="mint" size={40} />
            <b>{L("You are all caught up")}</b>
          </div>
        )}
      </div>
    </div>
  );
}
const STEP = (): Record<FlowStep["kind"], [IconName, Tint, string]> => ({
  trigger: ["zap", "sky", L("When")],
  condition: ["filter", "blush", L("If")],
  agent: ["bot", "lilac", L("Agent")],
  approval: ["user", "butter", L("Approval")],
  action: ["send", "mint", L("Then")],
});
export function Flow(p: FlowProps) {
  return (
    <ol
      className="tf-flow tf-stagger"
      style={
        {
          "--base": "120ms",
        } as React.CSSProperties
      }
    >
      {(p.steps || []).map((s, i) => {
        const steps = STEP(),
          k = steps[s.kind] || steps.action,
          st =
            i < (p.active == null ? -1 : p.active)
              ? "done"
              : i === p.active
                ? p.waiting
                  ? "wait"
                  : "active"
                : "";
        return (
          <li key={i} className={cx("tf-flow-node", st)}>
            <span className={"tf-flow-icon tf-t-" + k[1]}>
              <Icon name={st === "done" ? "check" : k[0]} size={16} />
            </span>
            <div className="tf-flow-card">
              <div className="tf-flow-kind">
                {k[2]}
                {st === "active" && <span className="tf-flow-live">running</span>}
                {st === "wait" && <span className="tf-flow-live wait">{L("waiting for you")}</span>}
              </div>
              <div className="tf-flow-text">{s.text}</div>
              {st === "wait" && p.onApprove && (
                <div
                  className="tf-row"
                  style={{
                    marginTop: 8,
                  }}
                >
                  <Button size="sm" icon="check" onClick={p.onApprove}>
                    {L("Approve")}
                  </Button>
                  {p.onReject && (
                    <Button size="sm" variant="ghost" onClick={p.onReject}>
                      {L("Reject")}
                    </Button>
                  )}
                </div>
              )}
            </div>
            {p.tools && st === "" ? <div className="tf-flow-tools">{p.tools(s, i)}</div> : null}
          </li>
        );
      })}
    </ol>
  );
}
const FILE_KIND: Record<string, [IconName, Tint]> = {
  pdf: ["file", "blush"],
  doc: ["book", "sky"],
  sheet: ["chart", "mint"],
  fig: ["sparkle", "lilac"],
  img: ["eye", "butter"],
  zip: ["folder", "butter"],
};
export function FileThumb(p: FileThumbProps) {
  const f = p.kind,
    big = p.big;
  if (f === "sheet")
    return (
      <span className="tf-t-sheet">
        {Array.from(
          {
            length: big ? 7 : 4,
          },
          (_, r) => (
            <span key={r}>
              {Array.from(
                {
                  length: 4,
                },
                (_, c) => (
                  <i
                    key={c}
                    style={{
                      opacity: r === 0 ? 1 : 0.55,
                    }}
                  />
                ),
              )}
            </span>
          ),
        )}
      </span>
    );
  if (f === "img" || f === "fig")
    return (
      <span className={cx("tf-t-art", f === "fig" && "fig")}>
        <i />
        <i />
        <i />
      </span>
    );
  if (f === "zip")
    return (
      <span className="tf-t-zip">
        {(p.entries || ["logo.svg", "colors.json", "fonts/"]).map((x) => (
          <span key={x}>
            <Icon name="file" size={11} />
            {x}
          </span>
        ))}
      </span>
    );
  return (
    <span className="tf-t-doc">
      <b>{(p.title || "").replace(/\.[^.]+$/, "")}</b>
      {Array.from(
        {
          length: big ? 9 : 4,
        },
        (_, i) => (
          <i
            key={i}
            style={{
              width: 60 + ((i * 37) % 40) + "%",
            }}
          />
        ),
      )}
    </span>
  );
}
export function FileCard(p: FileCardProps) {
  const k = FILE_KIND[p.kind] || FILE_KIND.doc;
  return (
    <button type="button" className="tf-filecard" onClick={p.onClick}>
      <span className={"tf-thumb tf-bg-" + k[1]}>
        <FileThumb kind={p.kind} title={p.name} />
      </span>
      <span className="tf-filecard-name">{p.name}</span>
      <span className="tf-filecard-meta">
        {[p.size, p.meta].filter(Boolean).join(" · ")}
        {p.shared && <Icon name="users" size={12} label={L("Shared")} />}
      </span>
    </button>
  );
}
export function Wizard(p: WizardProps) {
  const steps = p.steps || [],
    cur = p.current || 0,
    done = p.done || {};
  return (
    <div className="tf-wizard" role="group" aria-label={p.label || L("Setup")}>
      <aside className="tf-wizard-rail">
        <span
          className="tf-brand"
          style={{
            color: "var(--on-frame)",
          }}
        >
          {p.brand}
          <span className="tf-brand-dot" />
        </span>
        <ol>
          {steps.map((s, j) => {
            const ok = done[s.id || j];
            return (
              <li key={j}>
                <button
                  type="button"
                  className={cx("tf-wizard-step", j === cur && "cur", ok && "ok")}
                  aria-current={j === cur ? "step" : undefined}
                  onClick={() => {
                    p.onPick && p.onPick(j);
                  }}
                >
                  <span>{ok ? <Icon name="check" size={12} /> : j + 1}</span>
                  {s.label}
                </button>
              </li>
            );
          })}
        </ol>
      </aside>
      <div className="tf-wizard-main">
        <div className="tf-card-desc">
          {L("Step {n} of {total}", {
            n: cur + 1,
            total: steps.length,
          })}
        </div>
        <div key={cur} className="tf-wizard-body">
          {steps[cur] && steps[cur].icon && (
            <TintIcon icon={steps[cur].icon} tint="sky" size={44} />
          )}
          {steps[cur] && <h2 className="tf-modal-title">{steps[cur].label}</h2>}
          {p.children}
        </div>
        {p.footer && (
          <div
            className="tf-modal-foot"
            style={{
              justifyContent: "space-between",
            }}
          >
            {p.footer}
          </div>
        )}
      </div>
    </div>
  );
}
const LEVELS = () => [L("None"), L("View"), L("Edit"), L("Full")];
export function PermissionMatrix(p: PermissionMatrixProps) {
  return (
    <div className="tf-scroll">
      <table className="tf-table tf-perm">
        <thead>
          <tr>
            <th>{L("Role")}</th>
            {(p.areas || []).map((a) => (
              <th key={a}>{a}</th>
            ))}
          </tr>
        </thead>
        <tbody
          className="tf-stagger"
          style={
            {
              "--base": "120ms",
            } as React.CSSProperties
          }
        >
          {(p.roles || []).map((r, ri) => (
            <tr key={r.name}>
              <td>
                <div
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {r.name}
                </div>
                {r.people != null && (
                  <div className="tf-card-desc">
                    {L(r.people === 1 ? "{n} member" : "{n} members", {
                      n: r.people,
                    })}
                  </div>
                )}
              </td>
              {r.levels.map((lv, ai) => (
                <td key={ai}>
                  <button
                    type="button"
                    className={"tf-perm-cell lv" + lv}
                    disabled={r.locked}
                    aria-label={r.name + " · " + p.areas[ai] + ": " + LEVELS()[lv]}
                    onClick={() => {
                      p.onChange && p.onChange(ri, ai, (lv + 1) % 4);
                    }}
                  >
                    {LEVELS()[lv]}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function money2(n: number) {
  return formatMoney(n, null, {
    minimumFractionDigits: 2,
  });
}
export function InvoicePreview(p: InvoicePreviewProps) {
  const lines = p.lines || [];
  let net = 0;
  const vat: Record<number, number> = {};
  lines.forEach((l) => {
    const x = l.q * l.u;
    net += x;
    vat[l.v] = (vat[l.v] || 0) + (x * l.v) / 100;
  });
  let tax = 0;
  Object.keys(vat).forEach((k) => {
    tax += vat[Number(k)] ?? 0;
  });
  const fmt = p.format || money2;
  return (
    <div className="tf-paper">
      <div className="tf-paper-top">
        <div>
          <div
            className="tf-brand"
            style={{
              color: "var(--ink)",
              fontSize: 18,
            }}
          >
            {p.brand}
            <span className="tf-brand-dot" />
          </div>
          {p.from && <div className="tf-paper-small">{p.from}</div>}
        </div>
        <div
          style={{
            textAlign: "right",
          }}
        >
          <div className="tf-paper-kind">{p.kind || L("Invoice")}</div>
          <div className="tf-mono">{"#" + p.number}</div>
        </div>
      </div>
      <div className="tf-paper-meta">
        <div>
          <span>{L("Bill to")}</span>
          <b>{p.to}</b>
        </div>
        <div>
          <span>{L("Issued")}</span>
          <b>{p.issued}</b>
        </div>
        <div>
          <span>{L("Due")}</span>
          <b>{p.due}</b>
        </div>
      </div>
      <div className="tf-paper-lines">
        {lines.map((l, i) => (
          <div key={i}>
            <span>{(l.d || L("Untitled line")) + (l.q !== 1 ? " × " + l.q : "")}</span>
            <b>{fmt(l.q * l.u)}</b>
          </div>
        ))}
      </div>
      <div className="tf-paper-totals">
        <div>
          <span>{L("Net")}</span>
          <b>{fmt(net)}</b>
        </div>
        {Object.keys(vat)
          .filter((k) => +k > 0)
          .map((k) => (
            <div key={k}>
              <span>
                {L("VAT {rate}%", {
                  rate: k,
                })}
              </span>
              <b>{fmt(vat[Number(k)] ?? 0)}</b>
            </div>
          ))}
        <div className="grand">
          <span>{L("Total due")}</span>
          <b>{fmt(net + tax)}</b>
        </div>
      </div>
      {p.note && <div className="tf-paper-small">{p.note}</div>}
    </div>
  );
}
export function TransactionRow(p: TransactionRowProps) {
  const open = React.useState(false),
    inc = p.amount > 0;
  return (
    <div className={cx("tf-tx", !p.matched && "unmatched")}>
      <div className="tf-tx-row">
        <TintIcon icon={inc ? "download" : "send"} tint={inc ? "mint" : "plain"} />
        <div className="tf-tx-text">
          <b className="tf-mono">{p.text}</b>
          <span>
            {p.date +
              (p.matched && p.matchRef
                ? L(" · matched to {ref}", {
                    ref: p.matchRef,
                  })
                : "")}
          </span>
        </div>
        <b className={cx("tf-tx-amt", inc ? "in" : "out")}>
          {(inc ? "+" : "−") + money2(Math.abs(p.amount))}
        </b>
        {p.matched ? (
          <Badge tone="success">{L("Matched")}</Badge>
        ) : (
          <Button
            size="sm"
            variant={open[0] ? "soft" : "primary"}
            onClick={() => {
              open[1](!open[0]);
            }}
          >
            {open[0] ? L("Close") : L("Match")}
          </Button>
        )}
      </div>
      {open[0] && !p.matched && (
        <div className="tf-tx-suggest tf-in">
          <TintIcon icon="bot" tint="butter" />
          <span
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            {p.hint || L("No suggestion yet.")}
          </span>
          <Button
            size="sm"
            icon="check"
            onClick={() => {
              open[1](false);
              p.onMatch && p.onMatch();
            }}
          >
            {L("Accept")}
          </Button>
        </div>
      )}
    </div>
  );
}

/* ════════ Kit 2: forms, overlays, data table, more charts ════════ */
