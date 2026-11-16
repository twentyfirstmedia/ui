"use client";
import * as React from "react";
import { cx } from "../cx.js";
import { useFormat, useStrings } from "../context.js";
import { SALES_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { registerIcons, type IconName } from "../icons.js";
import {
  brandLinkedin,
  calendarCheck,
  circleStop,
  diamond,
  hourglass,
  listTodo,
  mic,
  micOff,
  phoneCall,
  phoneOff,
  signature,
  timer,
} from "../icon-library.js";
import { Avatar, Badge, Button, IconButton, TintIcon } from "./foundation.js";
import { Switch, Textarea } from "./inputs.js";
import type {
  BookingSlotsProps,
  CallPanelProps,
  ForecastProps,
  ForecastRow,
  GanttProps,
  QuoteBuilderProps,
  QuoteLine,
  SequenceStepsProps,
  SequenceStepType,
  SignatureStatusProps,
  SignerState,
  TimeTrackerProps,
  TimesheetProps,
  Tone,
} from "./types.js";

// default icons of these components come from the icon library
registerIcons({
  brandLinkedin,
  calendarCheck,
  circleStop,
  diamond,
  hourglass,
  listTodo,
  mic,
  micOff,
  phoneCall,
  phoneOff,
  signature,
  timer,
});

const DAY = 86400000;
function dayStart(v: Date | string | number): number {
  const d = new Date(v);
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
}
/** 125 s → "2:05", 3725 s → "1:02:05". */
function clock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}
/** 345 min → "5:45". */
function hoursMinutes(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
}
/** The current time, ticking every second while `live`; a fixed `now` never ticks. */
function useNow(live: boolean, fixed?: Date | string | number): number {
  const [now, setNow] = React.useState(() => (fixed != null ? +new Date(fixed) : Date.now()));
  React.useEffect(() => {
    if (fixed != null) {
      setNow(+new Date(fixed));
      return;
    }
    if (!live) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [live, fixed]);
  return now;
}

/* ── QuoteBuilder ─────────────────────────────────────────────────────────── */

function lineTotal(l: QuoteLine): number {
  return l.quantity * l.unitPrice * (1 - (l.discount || 0) / 100);
}

/**
 * A quote or proposal: line items with quantity, unit price and discount, optional extras the
 * customer can tick on, and the subtotal, discounts, tax and total worked out as you type.
 */
export function QuoteBuilder(p: QuoteBuilderProps) {
  const t = useStrings(SALES_STRINGS);
  const { formatMoney, formatNumber, formatPercent } = useFormat();
  const money = (v: number) => formatMoney(v, p.currency);
  const counted = p.lines.filter((l) => !l.optional || l.selected);
  const gross = counted.reduce((a, l) => a + l.quantity * l.unitPrice, 0);
  const net = counted.reduce((a, l) => a + lineTotal(l), 0);
  const tax = p.taxRate ? (net * p.taxRate) / 100 : 0;
  const edit = (id: string, patch: Partial<QuoteLine>) =>
    p.onChange?.(p.lines.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const num = (l: QuoteLine, field: "quantity" | "unitPrice" | "discount", label: string) =>
    p.onChange ? (
      <input
        className="tf-input tf-quote-input"
        type="number"
        inputMode="decimal"
        min={0}
        step="any"
        aria-label={t.quoteEditField(label, l.name)}
        value={l[field] ?? 0}
        onChange={(e) => edit(l.id, { [field]: Number(e.target.value) || 0 })}
      />
    ) : field === "unitPrice" ? (
      money(l.unitPrice)
    ) : field === "discount" ? (
      l.discount ? (
        formatPercent(l.discount)
      ) : (
        ""
      )
    ) : (
      formatNumber(l.quantity)
    );
  return (
    <div style={p.style} className={cx("tf-quote", p.className)}>
      <div className="tf-quote-scroll">
        <table className="tf-quote-table" aria-label={p.label || t.quoteLabel}>
          <thead>
            <tr>
              <th scope="col">{t.quoteItem}</th>
              <th scope="col">{t.quoteQuantity}</th>
              <th scope="col">{t.quotePrice}</th>
              <th scope="col">{t.quoteDiscount}</th>
              <th scope="col">{t.quoteLineTotal}</th>
              {p.onRemove && <td />}
            </tr>
          </thead>
          <tbody>
            {p.lines.map((l) => {
              const off = l.optional && !l.selected;
              return (
                <tr key={l.id} className={cx(l.optional && "is-optional", off && "is-off")}>
                  <th scope="row">
                    <div className="tf-quote-item">
                      {l.optional && (
                        <input
                          type="checkbox"
                          className="tf-quote-check"
                          checked={!!l.selected}
                          disabled={!p.onChange}
                          aria-label={t.quoteInclude(l.name)}
                          onChange={(e) => edit(l.id, { selected: e.target.checked })}
                        />
                      )}
                      <span>
                        <b>{l.name}</b>
                        {l.optional && <Badge tone="neutral">{t.quoteOptional}</Badge>}
                        {l.description && <small>{l.description}</small>}
                      </span>
                    </div>
                  </th>
                  <td className="tf-quote-qty" data-label={t.quoteQuantity}>
                    {num(l, "quantity", t.quoteQuantity)}
                    {l.unit && <span className="tf-quote-unit">{l.unit}</span>}
                  </td>
                  <td data-label={t.quotePrice}>{num(l, "unitPrice", t.quotePrice)}</td>
                  <td data-label={t.quoteDiscount}>{num(l, "discount", t.quoteDiscount)}</td>
                  <td className="tf-quote-sum" data-label={t.quoteLineTotal}>
                    <span>{money(lineTotal(l))}</span>
                  </td>
                  {p.onRemove && (
                    <td className="tf-quote-remove">
                      <IconButton
                        icon="trash"
                        size="sm"
                        variant="ghost"
                        label={t.quoteRemove(l.name)}
                        onClick={() => p.onRemove?.(l.id)}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="tf-quote-foot">
        {p.onAdd ? (
          <Button variant="secondary" size="sm" icon="plus" onClick={p.onAdd}>
            {t.quoteAdd}
          </Button>
        ) : (
          <span />
        )}
        <dl className="tf-quote-totals">
          <div>
            <dt>{t.quoteSubtotal}</dt>
            <dd>{money(gross)}</dd>
          </div>
          {gross - net > 0.005 && (
            <div>
              <dt>{t.quoteDiscounts}</dt>
              <dd>−{money(gross - net)}</dd>
            </div>
          )}
          {p.taxRate != null && (
            <div>
              <dt>{t.quoteTax(formatPercent(p.taxRate, { maximumFractionDigits: 1 }))}</dt>
              <dd>{money(tax)}</dd>
            </div>
          )}
          <div className="is-total">
            <dt>{t.quoteTotal}</dt>
            <dd>{money(net + tax)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

/* ── SignatureStatus ──────────────────────────────────────────────────────── */

const SIGNER: Record<SignerState, { tone: Tone }> = {
  waiting: { tone: "neutral" },
  sent: { tone: "info" },
  viewed: { tone: "warning" },
  signed: { tone: "success" },
  declined: { tone: "danger" },
};

/** A document out for e-signature: who has signed, who has it open, who is next, and reminders. */
export function SignatureStatus(p: SignatureStatusProps) {
  const t = useStrings(SALES_STRINGS);
  const { formatDate } = useFormat();
  const signed = p.signers.filter((s) => s.state === "signed").length;
  const total = p.signers.length;
  const when = (v: Date | string | number) =>
    formatDate(v, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
  return (
    <section style={p.style} className={cx("tf-sign", p.className)} aria-label={p.document}>
      <header className="tf-sign-head">
        <TintIcon icon="signature" tint="lilac" size={36} />
        <div className="tf-sign-titles">
          <b>{p.document}</b>
          <small>
            {t.signedCount(signed, total)}
            {p.expiresAt &&
              " · " +
                t.signatureExpires(formatDate(p.expiresAt, { day: "numeric", month: "short" }))}
          </small>
        </div>
        {p.onVoid && (
          <Button variant="ghost" size="sm" onClick={p.onVoid}>
            {t.voidDocument}
          </Button>
        )}
      </header>
      <div
        className="tf-sign-bar"
        role="progressbar"
        aria-label={t.signedCount(signed, total)}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={signed}
      >
        <span style={{ width: total ? `${(signed / total) * 100}%` : 0 }} />
      </div>
      <ol className={cx("tf-sign-list", p.ordered && "is-ordered")}>
        {p.signers.map((s, i) => (
          <li key={s.id} className={cx("tf-signer", "is-" + s.state)}>
            {p.ordered ? (
              <span className="tf-signer-step" aria-hidden>
                {i + 1}
              </span>
            ) : (
              <Avatar name={s.name} size={32} />
            )}
            <span className="tf-signer-text">
              <b>{s.name}</b>
              <small>{[s.role, s.email].filter(Boolean).join(" · ")}</small>
            </span>
            <span className="tf-signer-state">
              <Badge tone={SIGNER[s.state].tone}>{t.signerStates[s.state]}</Badge>
              {s.at && <small>{when(s.at)}</small>}
              {p.onRemind && (s.state === "sent" || s.state === "viewed") && (
                <Button
                  variant="secondary"
                  size="sm"
                  aria-label={t.remindSigner(s.name)}
                  onClick={() => p.onRemind?.(s.id)}
                >
                  {t.remindAction}
                </Button>
              )}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ── SequenceSteps ────────────────────────────────────────────────────────── */

const STEP_ICON: Record<SequenceStepType, IconName> = {
  email: "mail",
  call: "phoneCall",
  linkedin: "brandLinkedin",
  task: "listTodo",
  wait: "hourglass",
};
const STEP_TINT = {
  email: "sky",
  call: "mint",
  linkedin: "lilac",
  task: "butter",
  wait: "plain",
} as const;

/** An outreach sequence (cadence): emails, calls, LinkedIn touches and tasks by day, with results. */
export function SequenceSteps(p: SequenceStepsProps) {
  const t = useStrings(SALES_STRINGS);
  const { formatNumber, formatPercent } = useFormat();
  return (
    <ol
      style={p.style}
      className={cx("tf-seq", p.className)}
      aria-label={p.label || t.sequenceLabel}
    >
      {p.steps.map((s, i) => {
        const prevDay = i > 0 ? p.steps[i - 1]!.day : null;
        const st = s.stats;
        const rate = (n?: number) =>
          st?.sent && n != null ? formatPercent((n / st.sent) * 100) : null;
        const body = (
          <>
            <TintIcon icon={STEP_ICON[s.type]} tint={STEP_TINT[s.type]} size={32} />
            <span className="tf-seq-text">
              <small className="tf-seq-type">{t.stepTypes[s.type]}</small>
              <b>{s.title}</b>
              {s.detail && <small>{s.detail}</small>}
            </span>
            {st && st.sent != null && (
              <span className="tf-seq-stats">
                <span>{t.stepSent(formatNumber(st.sent))}</span>
                {rate(st.opened) && <span>{t.stepOpened(rate(st.opened)!)}</span>}
                {rate(st.replied) && <b>{t.stepReplied(rate(st.replied)!)}</b>}
              </span>
            )}
          </>
        );
        return (
          <li key={s.id} className={cx("tf-seq-step", "type-" + s.type)}>
            {s.day !== prevDay && <span className="tf-seq-day">{t.stepDay(s.day)}</span>}
            {p.onSelect ? (
              <button
                type="button"
                className="tf-seq-card"
                aria-pressed={p.selected === s.id}
                onClick={() => p.onSelect?.(s.id)}
              >
                {body}
              </button>
            ) : (
              <div className="tf-seq-card">{body}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ── Forecast ─────────────────────────────────────────────────────────────── */

/**
 * The sales forecast against quota per rep, team or month: won, commit and best case stacked, the
 * quota as a marker, attainment and the gap in words.
 */
export function Forecast(p: ForecastProps) {
  const t = useStrings(SALES_STRINGS);
  const { formatMoney, formatPercent } = useFormat();
  const money = (v: number) => formatMoney(v, p.currency, { maximumFractionDigits: 0 });
  const showTotal = p.total ?? p.rows.length > 1;
  const sum = (k: keyof ForecastRow) => p.rows.reduce((a, r) => a + (Number(r[k]) || 0), 0);
  const rows: ForecastRow[] = showTotal
    ? [
        ...p.rows,
        {
          id: "__total",
          name: t.forecastTotal,
          quota: sum("quota"),
          won: sum("won"),
          commit: sum("commit"),
          bestCase: sum("bestCase"),
        },
      ]
    : p.rows;
  const scale = (r: ForecastRow) => Math.max(r.quota, r.won + r.commit + r.bestCase) || 1;
  return (
    <div style={p.style} className={cx("tf-forecast", p.className)}>
      <ul className="tf-forecast-legend" aria-hidden>
        {(["won", "commit", "bestCase"] as const).map((k) => (
          <li key={k} className={"is-" + k}>
            <i />
            {t.forecastParts[k]}
          </li>
        ))}
      </ul>
      <ul className="tf-forecast-rows" aria-label={p.label || t.forecastLabel}>
        {rows.map((r) => {
          const max = scale(r);
          const pct = (v: number) => `${(v / max) * 100}%`;
          const done = r.quota ? (r.won / r.quota) * 100 : 0;
          const gap = r.quota - r.won;
          return (
            <li key={r.id} className={cx("tf-forecast-row", r.id === "__total" && "is-total")}>
              <span className="tf-forecast-name">
                {r.avatar && <Avatar name={r.name} size={24} />}
                <b>{r.name}</b>
              </span>
              <span
                className="tf-forecast-bar"
                role="img"
                aria-label={[
                  `${t.forecastParts.won} ${money(r.won)}`,
                  `${t.forecastParts.commit} ${money(r.commit)}`,
                  `${t.forecastParts.bestCase} ${money(r.bestCase)}`,
                  t.quotaOf(money(r.quota)),
                ].join(", ")}
              >
                <span className="is-won" style={{ width: pct(r.won) }} />
                <span className="is-commit" style={{ width: pct(r.commit) }} />
                <span className="is-bestCase" style={{ width: pct(r.bestCase) }} />
                {r.quota > 0 && <i className="tf-forecast-quota" style={{ left: pct(r.quota) }} />}
              </span>
              <span className="tf-forecast-nums">
                <b>{money(r.won)}</b>
                <small>
                  {t.attainment(formatPercent(done))} ·{" "}
                  {gap > 0 ? t.gapToQuota(money(gap)) : t.overQuota(money(-gap))}
                </small>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── CallPanel ────────────────────────────────────────────────────────────── */

/** A call in progress (dialer): who, the timer, mute, hold, record, end, notes and the outcome. */
export function CallPanel(p: CallPanelProps) {
  const t = useStrings(SALES_STRINGS);
  const live = p.state === "active" || p.state === "hold";
  const now = useNow(live && p.startedAt != null, p.now);
  const elapsed = p.startedAt != null ? (now - +new Date(p.startedAt)) / 1000 : 0;
  const toggle = (
    on: boolean | undefined,
    label: string,
    icon: IconName,
    fn?: (v: boolean) => void,
  ) =>
    fn && (
      <button
        type="button"
        className="tf-dialer-btn"
        aria-pressed={!!on}
        disabled={!live}
        onClick={() => fn(!on)}
      >
        <Icon name={icon} size={18} />
        <span>{label}</span>
      </button>
    );
  return (
    <section
      style={p.style}
      className={cx("tf-dialer", "is-" + p.state, p.className)}
      aria-label={p.name}
    >
      <header className="tf-dialer-head">
        <Avatar name={p.name} size={48} />
        <div className="tf-dialer-who">
          <b>{p.name}</b>
          {p.subtitle && <small>{p.subtitle}</small>}
          {p.number && <small className="tf-dialer-number">{p.number}</small>}
        </div>
        <div className="tf-dialer-time" role="status">
          <span className="tf-dialer-state">{t.callStates[p.state]}</span>
          {p.startedAt != null && p.state !== "ringing" && (
            <span className="tf-dialer-clock">{clock(elapsed)}</span>
          )}
        </div>
      </header>
      {p.state !== "ended" && (
        <div className="tf-dialer-controls">
          {p.state === "ringing" && p.onAnswer ? (
            <button type="button" className="tf-dialer-btn is-answer" onClick={p.onAnswer}>
              <Icon name="phoneCall" size={18} />
              <span>{t.answerCall}</span>
            </button>
          ) : (
            <>
              {toggle(p.muted, t.muteCall, p.muted ? "micOff" : "mic", p.onMute)}
              {toggle(p.state === "hold", t.holdCall, "pause", p.onHold)}
              {toggle(p.recording, t.recordCall, "circleStop", p.onRecord)}
            </>
          )}
          {p.onEnd && (
            <button type="button" className="tf-dialer-btn is-end" onClick={p.onEnd}>
              <Icon name="phoneOff" size={18} />
              <span>{t.endCall}</span>
            </button>
          )}
        </div>
      )}
      {p.outcomes && (
        <label className="tf-dialer-field">
          <span>{t.callOutcome}</span>
          <select
            className="tf-input"
            value={p.outcome ?? ""}
            onChange={(e) => p.onOutcome?.(e.target.value)}
          >
            <option value="" disabled>
              —
            </option>
            {p.outcomes.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
      )}
      {p.onNotes && (
        <Textarea
          label={t.callNotes}
          rows={3}
          placeholder={t.callNotesPlaceholder}
          value={p.notes ?? ""}
          onChange={(e) => p.onNotes?.(e.target.value)}
        />
      )}
    </section>
  );
}

/* ── BookingSlots ─────────────────────────────────────────────────────────── */

/** Book a meeting: pick a day, then a free time, in the host's time zone. */
export function BookingSlots(p: BookingSlotsProps) {
  const t = useStrings(SALES_STRINGS);
  const { formatDate } = useFormat();
  const [day, setDay] = React.useState(() => {
    const i = p.value ? p.days.findIndex((d) => dayStart(d.date) === dayStart(p.value!.date)) : -1;
    return i >= 0
      ? i
      : Math.max(
          0,
          p.days.findIndex((d) => d.slots.length > 0),
        );
  });
  const current = p.days[day];
  const picked =
    p.value && current && dayStart(p.value.date) === dayStart(current.date) ? p.value.time : null;
  return (
    <section
      style={p.style}
      className={cx("tf-slots", p.className)}
      aria-label={p.title || t.bookingLabel}
    >
      {(p.title || p.host) && (
        <header className="tf-slots-head">
          {p.host && <Avatar name={p.host} size={40} />}
          <span>
            <b>{p.title || t.bookingLabel}</b>
            <small>
              {[p.host, p.duration ? t.bookingMinutes(p.duration) : null]
                .filter(Boolean)
                .join(" · ")}
            </small>
          </span>
        </header>
      )}
      <div className="tf-slots-days" role="group" aria-label={t.bookingDayLabel}>
        {p.days.map((d, i) => (
          <button
            key={i}
            type="button"
            className="tf-slots-day"
            aria-pressed={i === day}
            disabled={!d.slots.length}
            onClick={() => setDay(i)}
          >
            <small>{formatDate(d.date, { weekday: "short" })}</small>
            <b>{formatDate(d.date, { day: "numeric" })}</b>
            <small>{formatDate(d.date, { month: "short" })}</small>
          </button>
        ))}
      </div>
      {current && current.slots.length ? (
        <div className="tf-slots-times" role="group" aria-label={t.bookingTimeLabel}>
          {current.slots.map((time) => (
            <button
              key={time}
              type="button"
              className="tf-slots-time"
              aria-pressed={picked === time}
              onClick={() => p.onChange?.({ date: current.date, time })}
            >
              {time}
            </button>
          ))}
        </div>
      ) : (
        <p className="tf-slots-empty">{t.bookingNoSlots}</p>
      )}
      <footer className="tf-slots-foot">
        {p.timeZone && (
          <small>
            <Icon name="globe" size={14} /> {t.bookingTimeZone(p.timeZone)}
          </small>
        )}
        {p.value && (
          <span className="tf-slots-picked" role="status">
            <Icon name="calendarCheck" size={16} />
            {t.bookingPicked(
              formatDate(p.value.date, { weekday: "long", month: "short", day: "numeric" }),
              p.value.time,
            )}
          </span>
        )}
        {p.value && p.onConfirm && (
          <Button onClick={() => p.onConfirm?.(p.value!)}>{t.bookingConfirm}</Button>
        )}
      </footer>
    </section>
  );
}

/* ── TimeTracker ──────────────────────────────────────────────────────────── */

/** A start/stop timer for what you are working on, with project and billable, and today's entries. */
export function TimeTracker(p: TimeTrackerProps) {
  const t = useStrings(SALES_STRINGS);
  const now = useNow(!!p.running && p.startedAt != null, p.now);
  const elapsed = p.running && p.startedAt != null ? (now - +new Date(p.startedAt)) / 1000 : 0;
  const total = (p.entries || []).reduce((a, e) => a + e.minutes, 0) + elapsed / 60;
  return (
    <section
      style={p.style}
      className={cx(
        "tf-tracker",
        p.running && "is-running",

        p.className,
      )}
      aria-label={t.trackerTask}
    >
      <div className="tf-tracker-row">
        <input
          className="tf-input tf-tracker-task"
          aria-label={t.trackerTask}
          placeholder={t.trackerTaskPlaceholder}
          value={p.task ?? ""}
          readOnly={!p.onTask}
          onChange={(e) => p.onTask?.(e.target.value)}
        />
        {p.projects && (
          <select
            className="tf-input tf-tracker-project"
            aria-label={t.trackerProject}
            value={p.project ?? ""}
            onChange={(e) => p.onProject?.(e.target.value)}
          >
            {p.projects.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        )}
        {p.onBillable && (
          <Switch
            label={t.billable}
            checked={!!p.billable}
            onChange={(e) => p.onBillable?.(e.target.checked)}
          >
            {t.billable}
          </Switch>
        )}
        <span className="tf-tracker-clock" role="timer" aria-live="off">
          {clock(elapsed)}
        </span>
        {p.running ? (
          <Button icon="circleStop" variant="primary" onClick={p.onStop}>
            {t.stopTimer}
          </Button>
        ) : (
          <Button icon="play" onClick={p.onStart}>
            {t.startTimer}
          </Button>
        )}
      </div>
      {p.entries && p.entries.length > 0 && (
        <>
          <ul className="tf-tracker-entries">
            {p.entries.map((e) => (
              <li key={e.id}>
                <span>
                  <b>{e.task || e.project}</b>
                  <small>{e.task ? e.project : null}</small>
                </span>
                {e.billable && <Badge tone="success">{t.billable}</Badge>}
                <span className="tf-tracker-dur">{hoursMinutes(e.minutes)}</span>
              </li>
            ))}
          </ul>
          <p className="tf-tracker-total">{t.trackerToday(hoursMinutes(total))}</p>
        </>
      )}
    </section>
  );
}

/* ── Timesheet ────────────────────────────────────────────────────────────── */

/** A week of hours per project and day, with day, row and week totals; cells edit in place. */
export function Timesheet(p: TimesheetProps) {
  const t = useStrings(SALES_STRINGS);
  const { formatDate, formatNumber } = useFormat();
  const start = new Date(p.weekStart);
  const days = Array.from(
    { length: 7 },
    (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
  );
  const h = (v: number) => formatNumber(v, { maximumFractionDigits: 2 });
  const dayTotal = (i: number) => p.rows.reduce((a, r) => a + (r.hours[i] || 0), 0);
  const week = p.rows.reduce((a, r) => a + r.hours.reduce((x, y) => x + (y || 0), 0), 0);
  return (
    <div style={p.style} className={cx("tf-timesheet", p.className)}>
      <table className="tf-timesheet-table" aria-label={p.label || t.timesheetLabel}>
        <thead>
          <tr>
            <th scope="col">{t.timesheetProject}</th>
            {days.map((d, i) => (
              <th key={i} scope="col" className={cx(i >= 5 && "is-weekend")}>
                <small>{formatDate(d, { weekday: "short" })}</small>
                <span>{formatDate(d, { day: "numeric" })}</span>
              </th>
            ))}
            <th scope="col">{t.timesheetTotal}</th>
          </tr>
        </thead>
        <tbody>
          {p.rows.map((r) => (
            <tr key={r.id}>
              <th scope="row">
                <span className="tf-timesheet-proj">
                  <span
                    className={cx("tf-timesheet-dot", "tint-" + (r.tint || "sky"))}
                    aria-hidden
                  />
                  <span>
                    <b>{r.project}</b>
                    {r.task && <small>{r.task}</small>}
                  </span>
                </span>
              </th>
              {days.map((d, i) => (
                <td key={i} className={cx(i >= 5 && "is-weekend")}>
                  {p.onChange ? (
                    <input
                      className="tf-input tf-timesheet-input"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={24}
                      step={0.25}
                      aria-label={t.timesheetCell(r.project, formatDate(d, { weekday: "long" }))}
                      value={r.hours[i] || ""}
                      onChange={(e) => p.onChange?.(r.id, i, Number(e.target.value) || 0)}
                    />
                  ) : r.hours[i] ? (
                    h(r.hours[i]!)
                  ) : (
                    ""
                  )}
                </td>
              ))}
              <td className="tf-timesheet-sum">{h(r.hours.reduce((a, b) => a + (b || 0), 0))}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">{t.timesheetTotal}</th>
            {days.map((_, i) => {
              const v = dayTotal(i);
              const low = p.target != null && i < 5 && v < p.target;
              return (
                <td key={i} className={cx(i >= 5 && "is-weekend", low && "is-low")}>
                  {v ? h(v) : ""}
                  {low && <span className="tf-sidebar-sr">{t.belowTarget(h(p.target!))}</span>}
                </td>
              );
            })}
            <td className="tf-timesheet-sum">{h(week)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/* ── Gantt ────────────────────────────────────────────────────────────────── */

/** Tasks and milestones on a time axis: bars with progress, owners, the weeks and today's line. */
export function Gantt(p: GanttProps) {
  const t = useStrings(SALES_STRINGS);
  const { formatDate, formatPercent } = useFormat();
  const starts = p.tasks.map((x) => dayStart(x.start));
  const ends = p.tasks.map((x) => dayStart(x.end ?? x.start));
  const from = p.from != null ? dayStart(p.from) : Math.min(...starts);
  const to = p.to != null ? dayStart(p.to) : Math.max(...ends);
  const span = Math.max(1, Math.round((to - from) / DAY) + 1);
  const at = (d: number) => `${((d - from) / DAY / span) * 100}%`;
  // days are UTC midnights of the local calendar day, so they are formatted in UTC
  const short = (v: number) => formatDate(v, { day: "numeric", month: "short", timeZone: "UTC" });
  // week ticks on Mondays
  const ticks: number[] = [];
  // a label too close to the end would run out of the chart, so the last 3 days get no tick
  for (let d = from; d <= to - 3 * DAY || d === from; d += DAY)
    if (new Date(d).getUTCDay() === 1 || d === from) ticks.push(d);
  const today = p.today != null ? dayStart(p.today) : null;
  return (
    <div style={p.style} className={cx("tf-gantt", p.className)}>
      <div
        className="tf-gantt-grid"
        role="list"
        aria-label={p.label || t.ganttLabel}
        style={{ "--days": span } as React.CSSProperties}
      >
        <div className="tf-gantt-head" aria-hidden>
          <span className="tf-gantt-name">{t.ganttTask}</span>
          <span className="tf-gantt-track">
            {ticks.map((d) => (
              <span key={d} className="tf-gantt-tick" style={{ left: at(d) }}>
                {short(d)}
              </span>
            ))}
          </span>
        </div>
        {p.tasks.map((x) => {
          const s = dayStart(x.start);
          const e = dayStart(x.end ?? x.start);
          const label = x.milestone
            ? t.ganttMilestone(x.name, short(s))
            : t.ganttRange(
                x.name,
                short(s),
                short(e),
                x.progress != null ? formatPercent(x.progress) : "",
              );
          const bar = x.milestone ? (
            <span className="tf-gantt-ms" style={{ left: at(s + DAY / 2) }}>
              <Icon name="diamond" size={16} />
            </span>
          ) : (
            <span
              className={cx("tf-gantt-bar", "tint-" + (x.tint || "sky"))}
              style={{ left: at(s), width: `${(((e - s) / DAY + 1) / span) * 100}%` }}
            >
              {x.progress != null && <i style={{ width: `${Math.min(100, x.progress)}%` }} />}
            </span>
          );
          return (
            <div
              key={x.id}
              className={cx("tf-gantt-row", x.milestone && "is-milestone")}
              role="listitem"
            >
              <span className="tf-gantt-name">
                {p.onOpen ? (
                  <button type="button" onClick={() => p.onOpen?.(x.id)} aria-label={label}>
                    {x.name}
                  </button>
                ) : (
                  <span aria-label={label} role="img">
                    {x.name}
                  </span>
                )}
                {x.owner && <Avatar name={x.owner} size={20} />}
              </span>
              <span className="tf-gantt-track" aria-hidden>
                {ticks.map((d) => (
                  <i key={d} className="tf-gantt-line" style={{ left: at(d) }} />
                ))}
                {today != null && today >= from && today <= to && (
                  <i className="tf-gantt-today" style={{ left: at(today) }} />
                )}
                {bar}
              </span>
            </div>
          );
        })}
      </div>
      {today != null && today >= from && today <= to && (
        <p className="tf-gantt-legend">
          <i aria-hidden /> {t.todayLabel}
        </p>
      )}
    </div>
  );
}
