"use client";
import * as React from "react";
import { cx } from "../cx.js";
import { useFormat, useLinkAs, useStrings } from "../context.js";
import { useControlled } from "../hooks.js";
import { APPROVALS_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { StatusShape } from "./status.js";
import { Badge, Button } from "./foundation.js";
import { Alert, EmptyState } from "./feedback.js";
import { Segmented } from "./forms.js";
import { SelectMenu } from "./select-menu.js";
import type {
  ApprovalCardProps,
  ApprovalDecision,
  ApprovalFilter,
  ApprovalInboxItem,
  ApprovalInboxProps,
  ApprovalKey,
  ApprovalOption,
  IconName,
  RiskFamily,
} from "./types.js";

/* ── Approval A–D ── */
const FAMILY: Record<RiskFamily, IconName> = {
  money: "card",
  infra: "server",
  comms: "mail",
  marketing: "trend",
  apps: "code",
  legal: "book",
};

const isPromise = (v: unknown): v is Promise<unknown> =>
  !!v && typeof (v as Promise<unknown>).then === "function";

export function ApprovalCard(p: ApprovalCardProps) {
  const t = useStrings(APPROVALS_STRINGS);
  const Link = useLinkAs(p.linkAs);
  const opts: ApprovalOption[] = p.options || [
    {
      key: "A",
      label: p.approveLabel || t.approveAsShown,
    },
    {
      key: "B",
      label: t.approveWithChange,
      input: t.whatShouldChange,
    },
    {
      key: "C",
      label: t.discard,
    },
    {
      key: "D",
      label: t.differentInstruction,
      input: t.whatInstead,
    },
  ];
  const open = React.useState<ApprovalKey | null>(null),
    txt = React.useState(""),
    ref = React.useRef<HTMLDivElement>(null);
  const [pending, setPending] = React.useState<ApprovalKey | null>(null);
  const [failed, setFailed] = React.useState<{ key: ApprovalKey; text?: string } | null>(null);
  const [local, setLocal] = React.useState<ApprovalDecision | null>(null);
  const [unfolded, setUnfolded] = React.useState(false);
  const alive = React.useRef(true);
  React.useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const busy = p.busy !== undefined ? p.busy : pending;
  const needsKey = (k: ApprovalKey) => !!p.stepUp && (k === "A" || k === "B");
  const d: ApprovalDecision | null =
    p.decision !== undefined
      ? p.decision
      : p.state === "approved"
        ? {
            key: "A",
          }
        : p.state === "denied"
          ? {
              key: "C",
            }
          : local;
  function decide(o: ApprovalOption) {
    if (busy) return;
    if (o.input && open[0] !== o.key) {
      open[1](o.key);
      txt[1]("");
      return;
    }
    if (o.input && !txt[0].trim()) return;
    const text = o.input ? txt[0].trim() : undefined;
    setFailed(null);
    const done = (settled: boolean) => {
      open[1](null);
      if (settled && p.decision === undefined && p.state === undefined)
        setLocal({ key: o.key, text });
    };
    let r: unknown;
    try {
      r = p.onDecide && p.onDecide(o.key, text);
    } catch {
      setFailed({ key: o.key });
      return;
    }
    if (o.key === "A") p.onApprove && p.onApprove();
    if (o.key === "C") p.onDeny && p.onDeny();
    if (o.key === "B") p.onEdit && p.onEdit(txt[0]);
    if (isPromise(r)) {
      setPending(o.key);
      r.then(
        () => {
          if (!alive.current) return;
          setPending(null);
          done(true);
        },
        (err: unknown) => {
          if (!alive.current) return;
          setPending(null);
          setFailed({ key: o.key, text: typeof err === "string" ? err : undefined });
        },
      );
    } else done(false);
  }
  function key(e: React.KeyboardEvent<HTMLDivElement>) {
    const tag = (e.target as HTMLElement).tagName;
    if (d || busy || tag === "TEXTAREA" || tag === "INPUT" || e.metaKey || e.ctrlKey || e.altKey)
      return;
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
        style={p.style}
        className={cx(
          "tf-approval tf-approval-done",
          d.key === "A" || d.key === "B" ? "yes" : "no",
          p.className,
        )}
      >
        <StatusShape status={d.key === "A" || d.key === "B" ? "ok" : "idle"} />
        <b>{t.decidedAs(o.key, o.label)}</b>
        {p.title && <span className="tf-approval-done-what">{p.title}</span>}
        <span className="tf-approval-done-by">{[d.by, d.at].filter(Boolean).join(" · ")}</span>
        {d.text && <span className="tf-approval-done-note">{"“" + d.text + "”"}</span>}
      </div>
    );
  }
  const error =
    p.error ??
    (failed ? failed.text || (needsKey(failed.key) ? t.passkeyFailed : t.answerFailed) : null);
  const folded = p.compact && p.children && !unfolded;
  return (
    <div
      style={p.style}
      ref={ref}
      className={cx("tf-approval", p.compact && "compact", p.screen && "screen", p.className)}
      tabIndex={0}
      onKeyDown={key}
      role="group"
      aria-label={typeof p.title === "string" ? p.title : undefined}
      aria-busy={busy ? true : undefined}
    >
      <div className="tf-approval-top">
        <StatusShape status="signal" />
        <b>{p.heading || t.approvalNeeded}</b>
        {(p.agent || p.project) && (
          <span className="tf-approval-who">
            {[p.agent, p.project].filter(Boolean).join(" · ")}
          </span>
        )}
        {fam && (
          <Badge tone="neutral" dot={false} className="tf-family">
            <Icon name={fam} size={12} />
            {p.familyLabel || (p.family && t.riskFamily[p.family])}
          </Badge>
        )}
        {p.age && <span className="tf-approval-age">{p.age}</span>}
      </div>
      {/* screen: the content scrolls on its own, so it takes keyboard focus */}
      <div className="tf-approval-main" tabIndex={p.screen ? 0 : undefined}>
        {p.title && (
          <p className="tf-approval-title">
            {p.href ? (
              <Link href={p.href} className="tf-approval-link">
                {p.title}
              </Link>
            ) : (
              p.title
            )}
          </p>
        )}
        {p.text && <p className="tf-approval-reason">{p.text}</p>}
        {p.children && p.compact && (
          <button
            type="button"
            className="tf-approval-fold"
            aria-expanded={!folded}
            onClick={() => {
              setUnfolded((v) => !v);
            }}
          >
            <Icon name={folded ? "chevronRight" : "chevronDown"} size={14} />
            {folded ? t.showPayload : t.hidePayload}
          </button>
        )}
        {p.children && !folded && <div className="tf-approval-body">{p.children}</div>}
      </div>
      {error && (
        <div className="tf-approval-error" role="alert">
          <Icon name="ban" size={14} />
          <span>{error}</span>
        </div>
      )}
      <div className="tf-approval-opts" role="list">
        {opts.map((o, i) => {
          const isBusy = busy === o.key;
          const key = needsKey(o.key);
          return (
            <div key={o.key} role="listitem">
              <button
                type="button"
                className={cx(
                  "tf-approval-opt",
                  i === 0 && "primary",
                  open[0] === o.key && "open",
                  isBusy && "busy",
                )}
                onClick={() => {
                  decide(o);
                }}
                disabled={!!busy}
                aria-busy={isBusy || undefined}
                aria-keyshortcuts={o.key}
                aria-expanded={o.input ? open[0] === o.key : undefined}
              >
                {isBusy ? (
                  <span className="tf-approval-spin" aria-hidden="true">
                    <span className="tf-spinner" />
                  </span>
                ) : (
                  <kbd>{o.key}</kbd>
                )}
                <span>{isBusy && key ? t.confirmWithPasskey : o.label}</span>
                {key && !isBusy && (
                  <small className="tf-approval-key">
                    <Icon name="key" size={12} />
                    <span className="tf-approval-key-text">{t.needsPasskey}</span>
                  </small>
                )}
                {o.input && open[0] !== o.key && <Icon name="chevronRight" size={14} />}
              </button>
              {o.input && open[0] === o.key && (
                <div className="tf-approval-input tf-in">
                  <textarea
                    className="tf-input"
                    rows={2}
                    autoFocus
                    aria-label={typeof o.input === "string" ? o.input : o.label}
                    placeholder={
                      o.placeholder || (typeof o.input === "string" ? o.input : undefined)
                    }
                    value={txt[0]}
                    disabled={!!busy}
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
                      disabled={!!busy}
                      onClick={() => {
                        open[1](null);
                      }}
                    >
                      {t.cancel}
                    </Button>
                    <Button
                      size="sm"
                      disabled={!txt[0].trim() || !!busy}
                      onClick={() => {
                        decide(o);
                      }}
                    >
                      {o.key + " · " + t.send}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className="tf-sr-only" role="status">
        {busy ? (needsKey(busy) ? t.confirmWithPasskey : t.sendingAnswer) : ""}
      </span>
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

const FILTER_KEYS = ["project", "family", "agent"] as const;

export function ApprovalInbox(p: ApprovalInboxProps) {
  const t = useStrings(APPROVALS_STRINGS);
  const { formatNumber } = useFormat();
  const Link = useLinkAs(p.linkAs);
  const all = p.items || [];
  const [filter, setFilter] = useControlled<ApprovalFilter, ApprovalFilter>(
    p.filter,
    p.defaultFilter || {},
    p.onFilterChange,
  );
  const [view, setView] = useControlled<"open" | "done", "open" | "done">(
    p.view,
    p.defaultView || "open",
    p.onViewChange,
  );
  const shown = (x: ApprovalInboxItem) =>
    (!filter.project || x.project === filter.project) &&
    (!filter.family || x.family === filter.family) &&
    (!filter.agent || x.agent === filter.agent);
  const openItems = all
    .filter((x) => !x.decision)
    .sort((a, b) => (b.ageMin || 0) - (a.ageMin || 0));
  const doneItems = all.filter((x) => x.decision);
  const items = (view === "done" ? doneItems : openItems).filter(shown);
  const [selected, setSelected] = useControlled<
    ApprovalInboxItem["id"],
    ApprovalInboxItem["id"] | undefined
  >(p.selected, p.defaultSelected, p.onSelect);
  const which: ("project" | "family" | "agent")[] =
    p.filters === true ? [...FILTER_KEYS] : Array.isArray(p.filters) ? p.filters : [];
  const urgent = openItems.filter((x) => x.urgent && shown(x)).length;
  const hasDone = p.showDone || doneItems.length > 0;
  const filtered = FILTER_KEYS.some((k) => !!filter[k]);
  const values = (k: "project" | "family" | "agent") =>
    Array.from(new Set(all.map((x) => x[k]).filter((v): v is string => !!v)));
  const famLabel = (f: string) =>
    all.find((x) => x.family === f && x.familyLabel)?.familyLabel ||
    t.riskFamily[f as keyof typeof t.riskFamily] ||
    f;
  const allLabel = { project: t.allProjects, family: t.allFamilies, agent: t.allAgents };
  const fieldLabel = { project: t.filterProject, family: t.filterFamily, agent: t.filterAgent };
  const list = (
    <div
      className="tf-inbox"
      role="listbox"
      aria-label={p.label || t.approvals}
      onKeyDown={(e) => {
        if ((e.target as HTMLElement).closest("input, textarea, select")) return;
        const i = items.findIndex((x) => x.id === selected);
        const move = (n: ApprovalInboxItem | undefined) => {
          if (!n) return;
          setSelected(n.id);
          const rows = e.currentTarget.querySelectorAll<HTMLElement>("[data-id]");
          Array.from(rows)
            .find((el) => el.dataset.id === String(n.id))
            ?.focus();
        };
        if (e.key === "j" || e.key === "ArrowDown") {
          e.preventDefault();
          move(items[Math.min(items.length - 1, i + 1)]);
        } else if (e.key === "k" || e.key === "ArrowUp") {
          e.preventDefault();
          move(items[Math.max(0, i - 1)]);
        } else if (
          view === "open" &&
          p.onDecide &&
          selected !== undefined &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.altKey &&
          /^[abcd]$/i.test(e.key)
        ) {
          e.preventDefault();
          p.onDecide(selected, e.key.toUpperCase() as ApprovalKey);
        }
      }}
    >
      {items.length === 0 ? (
        <EmptyState
          icon="check"
          tint="mint"
          title={
            filtered && (view === "done" ? doneItems : openItems).length
              ? t.noApprovalMatches
              : view === "done"
                ? t.nothingDecided
                : p.emptyTitle || t.nothingWaiting
          }
          text={view === "open" && !filtered ? p.emptyText : undefined}
        />
      ) : (
        items.map((x) => {
          const fam = x.family ? FAMILY[x.family] : undefined;
          const dec = x.decision;
          const yes = dec && (dec.key === "A" || dec.key === "B");
          const content = (
            <>
              <StatusShape status={dec ? (yes ? "ok" : "idle") : "signal"} />
              <span className="tf-inbox-text">
                <b>{x.title}</b>
                <small>{[x.agent, x.project].filter(Boolean).join(" · ")}</small>
              </span>
              {fam && (
                <Badge tone="neutral" dot={false} className="tf-family">
                  <Icon name={fam} size={12} />
                  {x.familyLabel || (x.family && t.riskFamily[x.family])}
                </Badge>
              )}
              {dec ? (
                <span className="tf-inbox-age">
                  <kbd className="tf-inbox-key">{dec.key}</kbd>
                  {[dec.by, dec.at].filter(Boolean).join(" · ")}
                </span>
              ) : (
                <span className={cx("tf-inbox-age", x.urgent && "warn")}>
                  {x.urgent && <StatusShape status="warn" />}
                  {x.age}
                </span>
              )}
            </>
          );
          const common = {
            role: "option",
            "aria-selected": x.id === selected,
            "data-id": String(x.id),
            tabIndex:
              x.id === selected || (!items.some((y) => y.id === selected) && x === items[0])
                ? 0
                : -1,
            className: cx("tf-inbox-row", x.id === selected && "on", dec && "done"),
            onClick: () => {
              setSelected(x.id);
            },
          };
          return x.href ? (
            <Link key={x.id} href={x.href} {...common}>
              {content}
            </Link>
          ) : (
            <button key={x.id} type="button" {...common}>
              {content}
            </button>
          );
        })
      )}
    </div>
  );
  const bar = which.length > 0 || hasDone;
  const warn = p.escalationWarning !== false && view === "open" && urgent > 0;
  if (!bar && !warn)
    return React.cloneElement(list, {
      style: p.style,
      className: cx("tf-inbox", p.className),
    } as React.HTMLAttributes<HTMLDivElement>);
  return (
    <div style={p.style} className={cx("tf-inbox-box", p.className)}>
      {bar && (
        <div className="tf-inbox-bar" role="group" aria-label={t.inboxFilters}>
          {hasDone && (
            <Segmented
              size="sm"
              label={t.inboxView}
              value={view}
              onChange={(v) => {
                setView(v as "open" | "done");
              }}
              options={[
                {
                  value: "open",
                  label: `${t.inboxOpen} · ${formatNumber(openItems.filter(shown).length)}`,
                },
                { value: "done", label: t.inboxDone },
              ]}
            />
          )}
          {which.map((k) => (
            <SelectMenu
              key={k}
              size="sm"
              label={fieldLabel[k]}
              hideLabel
              value={filter[k] || ""}
              onChange={(v) => {
                setFilter({ ...filter, [k]: v || undefined });
              }}
              options={[
                { value: "", label: allLabel[k] },
                ...values(k).map((v) => ({ value: v, label: k === "family" ? famLabel(v) : v })),
              ]}
            />
          ))}
        </div>
      )}
      {warn && (
        <Alert tone="warning" icon="clock">
          {t.escalatesSoon(urgent, formatNumber(urgent))}
        </Alert>
      )}
      {list}
    </div>
  );
}

/* ── Foundations ── */
