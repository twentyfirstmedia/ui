"use client";
import * as React from "react";
import { cx } from "../cx.js";
import { useFormat, useStrings } from "../context.js";
import { HOUSEHOLD_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { registerIcons } from "../icons.js";
import { landmark, receipt, repeat, umbrella } from "../icon-library.js";
import { Badge, IconButton, TintIcon } from "./foundation.js";
import { Sparkline } from "./charts.js";
import { StatusIndicator } from "./status.js";
import type {
  BudgetListProps,
  ClaimTimelineProps,
  CoverageMatrixProps,
  DeadlineListProps,
  DocumentListProps,
  NetWorthCardProps,
  PolicyCardProps,
  SubscriptionListProps,
} from "./types.js";

// default icons of these components come from the icon library
registerIcons({ landmark, receipt, repeat, umbrella });

const DAY = 86400000;
/** Whole days from `from` to `to`, counted on the calendar (negative when `to` is earlier). */
function daysBetween(from: Date | string | number, to: Date | string | number): number {
  const a = new Date(from),
    b = new Date(to);
  const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()),
    ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((ub - ua) / DAY);
}

/* ── BudgetList ── */

/** Spending per category against its monthly limit, with what is left or over in words. */
export function BudgetList(p: BudgetListProps) {
  const t = useStrings(HOUSEHOLD_STRINGS);
  const { formatMoney } = useFormat();
  const money = (n: number) => formatMoney(n, p.currency, { maximumFractionDigits: 0 });
  return (
    <ul style={p.style} className={cx("tf-budgets", p.className)} aria-label={p.label || t.budgets}>
      {p.categories.map((c) => {
        const pct = c.limit ? (c.spent / c.limit) * 100 : 0;
        const over = c.spent > c.limit;
        const tone = over ? "blush" : pct >= 85 ? "butter" : c.tint || "mint";
        const body = (
          <>
            <TintIcon icon={c.icon || "wallet"} tint={c.tint || "sky"} size={32} />
            <span className="tf-budget-main">
              <span className="tf-budget-top">
                <b>{c.label}</b>
                <span className="tf-budget-nums">
                  {money(c.spent)} <small>/ {money(c.limit)}</small>
                </span>
              </span>
              <span
                className="tf-budget-bar"
                role="progressbar"
                aria-label={c.label}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.min(100, Math.round(pct))}
                aria-valuetext={`${money(c.spent)} / ${money(c.limit)}`}
              >
                <span className={"tf-sf-" + tone} style={{ width: Math.min(100, pct) + "%" }} />
              </span>
              <small className={cx("tf-budget-left", over && "over")}>
                {over
                  ? t.budgetOver(money(c.spent - c.limit))
                  : t.budgetLeft(money(c.limit - c.spent))}
              </small>
            </span>
          </>
        );
        return (
          <li key={c.id}>
            {p.onSelect ? (
              <button type="button" className="tf-budget" onClick={() => p.onSelect?.(c.id)}>
                {body}
              </button>
            ) : (
              <div className="tf-budget">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ── SubscriptionList ── */

const PER_YEAR = { week: 52, month: 12, quarter: 4, year: 1 } as const;

/** Recurring payments with their next charge, and what they cost a month and a year together. */
export function SubscriptionList(p: SubscriptionListProps) {
  const t = useStrings(HOUSEHOLD_STRINGS);
  const { formatMoney, formatDate } = useFormat();
  const money = (n: number, d = 2) =>
    formatMoney(n, p.currency, { minimumFractionDigits: d, maximumFractionDigits: d });
  const active = p.items.filter((s) => s.status !== "cancelled");
  const year = active.reduce((sum, s) => sum + s.amount * PER_YEAR[s.period], 0);
  return (
    <div style={p.style} className={cx("tf-subs", p.className)}>
      <ul aria-label={p.label || t.subscriptions}>
        {p.items.map((s) => (
          <li key={s.id} className={cx("tf-sub", s.status === "cancelled" && "is-cancelled")}>
            {s.logo || <TintIcon icon={s.icon || "repeat"} tint="lilac" size={32} />}
            <span className="tf-sub-text">
              <b>{s.name}</b>
              <small>
                {[
                  s.category,
                  s.status === "cancelled"
                    ? t.cancelledLabel
                    : s.next != null &&
                      t.nextCharge(formatDate(s.next, { day: "numeric", month: "short" })),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </small>
            </span>
            {s.status === "trial" && <Badge tone="info">{t.trialEnds}</Badge>}
            <span className="tf-sub-amount">
              {money(s.amount)}
              <small>/ {t.periodWord[s.period]}</small>
            </span>
            {p.onManage && (
              <IconButton
                icon="more"
                label={t.manageItem(s.name)}
                size="sm"
                variant="ghost"
                onClick={() => p.onManage?.(s.id)}
              />
            )}
          </li>
        ))}
      </ul>
      {p.totals !== false && (
        <div className="tf-subs-total">
          <b>{t.perMonthTotal(money(year / 12))}</b>
          <span>{t.perYearTotal(money(year, 0))}</span>
        </div>
      )}
    </div>
  );
}

/* ── NetWorthCard ── */

/** What you own minus what you owe, its trend, and the parts on both sides. */
export function NetWorthCard(p: NetWorthCardProps) {
  const t = useStrings(HOUSEHOLD_STRINGS);
  const { formatMoney } = useFormat();
  const money = (n: number) => formatMoney(n, p.currency, { maximumFractionDigits: 0 });
  const assets = p.assets.reduce((s, a) => s + a.value, 0);
  const debts = (p.liabilities || []).reduce((s, a) => s + a.value, 0);
  const side = (title: string, list: NetWorthCardProps["assets"], total: number) => (
    <div className="tf-nw-side">
      <div className="tf-nw-sidehead">
        <span>{title}</span>
        <b>{money(total)}</b>
      </div>
      <ul>
        {list.map((a) => (
          <li key={a.label}>
            <span>
              {a.icon && <Icon name={a.icon} size={14} />}
              {a.label}
            </span>
            <span>{money(a.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div style={p.style} className={cx("tf-nw", p.className)}>
      <div className="tf-nw-head">
        <div className="tf-col" style={{ gap: 2, minWidth: 0 }}>
          <span className="tf-nw-title">{p.title || t.netWorth}</span>
          <span className="tf-nw-total">{money(assets - debts)}</span>
          {p.change != null && (
            <span className={cx("tf-nw-change", p.change < 0 ? "down" : "up")}>
              <Icon name="arrowUp" size={12} />
              {(p.change > 0 ? "+" : "") + money(p.change)}
              {p.changeLabel && <span> {p.changeLabel}</span>}
            </span>
          )}
        </div>
        {p.history && p.history.length > 1 && (
          <Sparkline
            values={p.history}
            width={140}
            height={48}
            tint={(p.change ?? 0) < 0 ? "blush" : "mint"}
          />
        )}
      </div>
      <div className="tf-nw-sides">
        {side(t.assetsLabel, p.assets, assets)}
        {p.liabilities &&
          p.liabilities.length > 0 &&
          side(t.liabilitiesLabel, p.liabilities, debts)}
      </div>
    </div>
  );
}

/* ── DeadlineList ── */

/** Bills, renewals, cancellation dates and expiring documents in date order, the urgent first. */
export function DeadlineList(p: DeadlineListProps) {
  const t = useStrings(HOUSEHOLD_STRINGS);
  const { formatMoney, formatDate } = useFormat();
  const today = p.today ?? Date.now();
  const soon = p.soon ?? 14;
  const items = [...p.items].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  return (
    <ul
      style={p.style}
      className={cx("tf-deadlines", p.className)}
      aria-label={p.label || t.deadlines}
    >
      {items.map((d) => {
        const days = daysBetween(today, d.date);
        const st = d.done ? "done" : days < 0 ? "overdue" : days <= soon ? "soon" : "later";
        const when = days < 0 ? t.overdueBy(-days) : days === 0 ? t.dueToday : t.dueIn(days);
        return (
          <li key={d.id} className={cx("tf-deadline", "is-" + st)}>
            <span className="tf-deadline-date">
              <b>{formatDate(d.date, { day: "numeric" })}</b>
              <small>{formatDate(d.date, { month: "short" })}</small>
            </span>
            <span className="tf-deadline-text">
              <b>{d.title}</b>
              <small>{[d.kind, d.note].filter(Boolean).join(" · ")}</small>
            </span>
            {d.amount != null && (
              <span className="tf-deadline-amount">{formatMoney(d.amount, p.currency)}</span>
            )}
            {!d.done && (
              <Badge tone={st === "overdue" ? "danger" : st === "soon" ? "warning" : "neutral"}>
                {when}
              </Badge>
            )}
            {p.onDone && !d.done && (
              <IconButton
                icon="check"
                label={t.markDone(d.title)}
                size="sm"
                onClick={() => p.onDone?.(d.id)}
              />
            )}
            {d.done && <Icon name="check" size={16} className="tf-deadline-done" />}
          </li>
        );
      })}
    </ul>
  );
}

/* ── PolicyCard ── */

const POLICY_STATUS = {
  active: "ok",
  pending: "running",
  expiring: "warn",
  lapsed: "danger",
} as const;

/** One insurance policy: type, insurer, sum insured, premium, deductible, renewal and status. */
export function PolicyCard(p: PolicyCardProps) {
  const t = useStrings(HOUSEHOLD_STRINGS);
  const { formatMoney, formatDate } = useFormat();
  const money = (n: number) => formatMoney(n, p.currency, { maximumFractionDigits: 0 });
  const st = p.status || "active";
  const no = p.policyNumber && p.maskNumber ? "•••• " + p.policyNumber.slice(-4) : p.policyNumber;
  return (
    <div style={p.style} className={cx("tf-policy", "is-" + st, p.className)}>
      <div className="tf-policy-head">
        <TintIcon icon={p.icon || "umbrella"} tint={p.tint || "sky"} size={40} />
        <div className="tf-option-text">
          <b>{p.type}</b>
          <small>{p.insurer}</small>
        </div>
        <StatusIndicator status={POLICY_STATUS[st]} label={t.policyStatus[st]} size="sm" />
      </div>
      <dl className="tf-policy-facts">
        {p.coverage != null && (
          <div>
            <dt>{t.sumInsured}</dt>
            <dd>{typeof p.coverage === "number" ? money(p.coverage) : p.coverage}</dd>
          </div>
        )}
        {p.premium && (
          <div>
            <dt>{t.periodWord[p.premium.period]}</dt>
            <dd>{formatMoney(p.premium.amount, p.currency)}</dd>
          </div>
        )}
        {p.deductible != null && (
          <div>
            <dt>{t.deductibleLabel}</dt>
            <dd>{money(p.deductible)}</dd>
          </div>
        )}
        {no && (
          <div>
            <dt>{t.policyNo}</dt>
            <dd className="tf-mono">{no}</dd>
          </div>
        )}
      </dl>
      {(p.renews != null || p.actions) && (
        <div className="tf-policy-foot">
          {p.renews != null && (
            <span>
              {t.renewsOn(
                formatDate(p.renews, { day: "numeric", month: "short", year: "numeric" }),
              )}
            </span>
          )}
          {p.actions && <span className="tf-policy-actions">{p.actions}</span>}
        </div>
      )}
    </div>
  );
}

/* ── CoverageMatrix ── */

const COVER_STATUS = { covered: "ok", partial: "warn", none: "danger" } as const;

/** Life risks and whether a policy covers them: covered, partly, not covered, with notes. */
export function CoverageMatrix(p: CoverageMatrixProps) {
  const t = useStrings(HOUSEHOLD_STRINGS);
  const words = { covered: t.covered, partial: t.partlyCovered, none: t.notCovered };
  const counts = { covered: 0, partial: 0, none: 0 };
  p.rows.forEach((r) => counts[r.status]++);
  return (
    <div style={p.style} className={cx("tf-coverage", p.className)}>
      <div className="tf-coverage-sum" aria-hidden>
        {(["covered", "partial", "none"] as const).map((k) => (
          <span key={k}>
            <StatusIndicator
              status={COVER_STATUS[k]}
              label={`${counts[k]} ${words[k]}`}
              size="sm"
            />
          </span>
        ))}
      </div>
      <table className="tf-coverage-table">
        <caption className="tf-sidebar-sr">{p.label || t.coverageLabel}</caption>
        <tbody>
          {p.rows.map((r) => (
            <tr key={r.id} className={"is-" + r.status}>
              <th scope="row">
                <b>{r.risk}</b>
                {r.policy && <small>{r.policy}</small>}
              </th>
              <td>
                <StatusIndicator
                  status={COVER_STATUS[r.status]}
                  label={words[r.status]}
                  size="sm"
                />
              </td>
              <td className="tf-coverage-note">{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── ClaimTimeline ── */

/** An insurance claim from report to payout as steps with dates. */
export function ClaimTimeline(p: ClaimTimelineProps) {
  const t = useStrings(HOUSEHOLD_STRINGS);
  const { formatMoney, formatDate } = useFormat();
  return (
    <div style={p.style} className={cx("tf-claim", p.className)}>
      <div className="tf-claim-head">
        <div className="tf-option-text">
          <b>{p.title}</b>
          {p.meta && <small>{p.meta}</small>}
        </div>
        {p.amount != null && (
          <span className="tf-claim-amount">
            <small>{t.claimAmount}</small>
            {formatMoney(p.amount, p.currency)}
          </span>
        )}
      </div>
      <ol className="tf-claim-steps">
        {p.steps.map((s, i) => (
          <li
            key={i}
            className={"is-" + s.state}
            aria-current={s.state === "current" ? "step" : undefined}
          >
            <span className="tf-claim-dot" aria-hidden>
              {s.state === "done" && <Icon name="check" size={10} />}
              {s.state === "failed" && <Icon name="x" size={10} />}
            </span>
            <span className="tf-claim-text">
              <b>{s.label}</b>
              {(s.date != null || s.note) && (
                <small>
                  {[
                    s.date != null && formatDate(s.date, { day: "numeric", month: "short" }),
                    s.note,
                  ]
                    .filter(Boolean)
                    .map((x, k) => (
                      <React.Fragment key={k}>
                        {k > 0 && " · "}
                        {x}
                      </React.Fragment>
                    ))}
                </small>
              )}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── DocumentList ── */

/** Important papers (IDs, contracts, policies, certificates) with holder and expiry. */
export function DocumentList(p: DocumentListProps) {
  const t = useStrings(HOUSEHOLD_STRINGS);
  const { formatDate } = useFormat();
  const today = p.today ?? Date.now();
  const soon = p.soon ?? 60;
  return (
    <ul style={p.style} className={cx("tf-docs", p.className)} aria-label={p.label || t.documents}>
      {p.documents.map((d) => {
        const days = d.expires != null ? daysBetween(today, d.expires) : null;
        const st = days == null ? null : days < 0 ? "expired" : days <= soon ? "soon" : "ok";
        const body = (
          <>
            <TintIcon icon={d.icon || "file"} tint={st === "expired" ? "blush" : "sky"} size={36} />
            <span className="tf-doc-text">
              <b>{d.title}</b>
              <small>{[d.category, d.holder, d.meta].filter(Boolean).join(" · ")}</small>
            </span>
            {st === "expired" && <Badge tone="danger">{t.expired}</Badge>}
            {st === "soon" && days != null && <Badge tone="warning">{t.expiresIn(days)}</Badge>}
            {st === "ok" && d.expires != null && (
              <span className="tf-doc-valid">
                {t.expiresOn(formatDate(d.expires, { month: "short", year: "numeric" }))}
              </span>
            )}
          </>
        );
        return (
          <li key={d.id}>
            {p.onOpen ? (
              <button type="button" className="tf-doc" onClick={() => p.onOpen?.(d.id)}>
                {body}
              </button>
            ) : (
              <div className="tf-doc">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
