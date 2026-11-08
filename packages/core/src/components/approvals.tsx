"use client";
import * as React from "react";
import { cx } from "../cx.js";
import { Icon } from "../Icon.js";
import { StatusShape } from "./status.js";
import { Badge, Button } from "./foundation.js";
import { EmptyState } from "./feedback.js";
import type {
  ApprovalCardProps,
  ApprovalDecision,
  ApprovalInboxProps,
  ApprovalKey,
  ApprovalOption,
  IconName,
  RiskFamily,
} from "./types.js";

/* ── Approval A–D ── */
const FAMILY: Record<RiskFamily, [IconName, string]> = {
  money: ["card", "Money"],
  infra: ["server", "Infrastructure"],
  comms: ["mail", "Communication"],
  marketing: ["trend", "Marketing"],
  apps: ["code", "Own apps"],
  legal: ["book", "Legal"],
};

export function ApprovalCard(p: ApprovalCardProps) {
  const opts: ApprovalOption[] = p.options || [
    {
      key: "A",
      label: p.approveLabel || "Yes, run it as shown",
    },
    {
      key: "B",
      label: "Yes, with a change",
      input: "What should change?",
    },
    {
      key: "C",
      label: "No, discard",
    },
    {
      key: "D",
      label: "Different instruction",
      input: "What should happen instead?",
    },
  ];
  const open = React.useState<ApprovalKey | null>(null),
    txt = React.useState(""),
    ref = React.useRef<HTMLDivElement>(null);
  const d: ApprovalDecision | null =
    p.decision ||
    (p.state === "approved"
      ? {
          key: "A",
        }
      : p.state === "denied"
        ? {
            key: "C",
          }
        : null);
  function decide(o: ApprovalOption) {
    if (o.input && open[0] !== o.key) {
      open[1](o.key);
      txt[1]("");
      return;
    }
    if (o.input && !txt[0].trim()) return;
    p.onDecide && p.onDecide(o.key, o.input ? txt[0].trim() : undefined);
    if (o.key === "A") p.onApprove && p.onApprove();
    if (o.key === "C") p.onDeny && p.onDeny();
    if (o.key === "B") p.onEdit && p.onEdit(txt[0]);
    open[1](null);
  }
  function key(e: React.KeyboardEvent<HTMLDivElement>) {
    const tag = (e.target as HTMLElement).tagName;
    if (d || tag === "TEXTAREA" || tag === "INPUT") return;
    const o = opts.find((x) => x.key === e.key.toUpperCase());
    if (o) {
      e.preventDefault();
      decide(o);
    }
  }
  const fam = p.family ? FAMILY[p.family] : undefined;
  if (d) {
    const o = opts.find((x) => x.key === d.key) || {
      key: d.key,
      label: "",
    };
    return (
      <div
        className={cx(
          "tf-approval tf-approval-done",
          d.key === "A" || d.key === "B" ? "yes" : "no",
          p.className,
        )}
      >
        <StatusShape status={d.key === "A" || d.key === "B" ? "ok" : "idle"} />
        <b>{o.key + " · " + o.label}</b>
        {p.title && <span className="tf-approval-done-what">{p.title}</span>}
        <span className="tf-approval-done-by">{[d.by, d.at].filter(Boolean).join(" · ")}</span>
        {d.text && <span className="tf-approval-done-note">{"“" + d.text + "”"}</span>}
      </div>
    );
  }
  return (
    <div
      ref={ref}
      className={cx("tf-approval", p.compact && "compact", p.className)}
      tabIndex={0}
      onKeyDown={key}
      role="group"
      aria-label={typeof p.title === "string" ? p.title : undefined}
    >
      <div className="tf-approval-top">
        <StatusShape status="signal" />
        <b>{p.heading || "Approval needed"}</b>
        {(p.agent || p.project) && (
          <span className="tf-approval-who">
            {[p.agent, p.project].filter(Boolean).join(" · ")}
          </span>
        )}
        {fam && (
          <Badge tone="neutral" dot={false} className="tf-family">
            <Icon name={fam[0]} size={12} />
            {p.familyLabel || fam[1]}
          </Badge>
        )}
        {p.age && <span className="tf-approval-age">{p.age}</span>}
      </div>
      <div className="tf-approval-main">
        {p.title && <p className="tf-approval-title">{p.title}</p>}
        {p.text && <p className="tf-approval-reason">{p.text}</p>}
        {p.children && <div className="tf-approval-body">{p.children}</div>}
      </div>
      <div className="tf-approval-opts" role="list">
        {opts.map((o, i) => (
          <div key={o.key} role="listitem">
            <button
              type="button"
              className={cx("tf-approval-opt", i === 0 && "primary", open[0] === o.key && "open")}
              onClick={() => {
                decide(o);
              }}
              aria-keyshortcuts={o.key}
            >
              <kbd>{o.key}</kbd>
              <span>{o.label}</span>
              {o.input && open[0] !== o.key && <Icon name="chevronRight" size={14} />}
            </button>
            {o.input && open[0] === o.key && (
              <div className="tf-approval-input tf-in">
                <textarea
                  className="tf-input"
                  rows={2}
                  autoFocus
                  placeholder={o.placeholder || (typeof o.input === "string" ? o.input : undefined)}
                  value={txt[0]}
                  onChange={(e) => {
                    txt[1](e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) decide(o);
                    if (e.key === "Escape") open[1](null);
                  }}
                />
                <div
                  className="tf-row"
                  style={{
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      open[1](null);
                    }}
                  >
                    {"Cancel"}
                  </Button>
                  <Button
                    size="sm"
                    disabled={!txt[0].trim()}
                    onClick={() => {
                      decide(o);
                    }}
                  >
                    {o.key + " · " + "Send"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {(p.escalation || p.trace || p.note) && (
        <div className="tf-approval-foot">
          {p.escalation && (
            <span>
              <Icon name="clock" size={13} />
              {p.escalation}
            </span>
          )}
          {p.note && <span>{p.note}</span>}
          {p.trace && <span className="tf-approval-trace">{p.trace}</span>}
        </div>
      )}
    </div>
  );
}

export function ApprovalInbox(p: ApprovalInboxProps) {
  const items = (p.items || []).slice().sort((a, b) => (b.ageMin || 0) - (a.ageMin || 0));
  return (
    <div
      className="tf-inbox"
      role="listbox"
      aria-label={p.label || "Approvals"}
      onKeyDown={(e) => {
        const i = items.findIndex((x) => x.id === p.selected);
        if (e.key === "j" || e.key === "ArrowDown") {
          e.preventDefault();
          const n = items[Math.min(items.length - 1, i + 1)];
          n && p.onSelect && p.onSelect(n.id);
        }
        if (e.key === "k" || e.key === "ArrowUp") {
          e.preventDefault();
          const q = items[Math.max(0, i - 1)];
          q && p.onSelect && p.onSelect(q.id);
        }
      }}
    >
      {items.length === 0 ? (
        <EmptyState
          icon="check"
          tint="mint"
          title={p.emptyTitle || "Nothing waiting for you"}
          text={p.emptyText}
        />
      ) : (
        items.map((x) => {
          const fam = x.family ? FAMILY[x.family] : undefined;
          return (
            <button
              key={x.id}
              type="button"
              role="option"
              aria-selected={x.id === p.selected}
              className={cx("tf-inbox-row", x.id === p.selected && "on")}
              onClick={() => {
                p.onSelect && p.onSelect(x.id);
              }}
            >
              <StatusShape status="signal" />
              <span className="tf-inbox-text">
                <b>{x.title}</b>
                <small>{[x.agent, x.project].filter(Boolean).join(" · ")}</small>
              </span>
              {fam && (
                <Badge tone="neutral" dot={false} className="tf-family">
                  <Icon name={fam[0]} size={12} />
                  {x.familyLabel || fam[1]}
                </Badge>
              )}
              <span className={cx("tf-inbox-age", x.urgent && "warn")}>
                {x.urgent && <StatusShape status="warn" />}
                {x.age}
              </span>
            </button>
          );
        })
      )}
    </div>
  );
}

/* ── Foundations ── */
