"use client";
import * as React from "react";
import { cx } from "../cx.js";
import { useFormat, useStrings } from "../context.js";
import { LIFE_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { registerIcons } from "../icons.js";
import {
  angry,
  flame,
  frown,
  heartPulse,
  laugh,
  meh,
  pill,
  smile,
  target,
} from "../icon-library.js";
import { useControlled, useId } from "../hooks.js";
import { Badge, Button, IconButton, TintIcon } from "./foundation.js";
import { Sparkline } from "./charts.js";
import { Switch } from "./inputs.js";
import { ServiceMark } from "./connectors.js";
import type {
  ActivityRingsProps,
  ConsentListProps,
  GoalCardProps,
  HabitTrackerProps,
  IconName,
  InsightCardProps,
  JournalEntryProps,
  MedicationListProps,
  MoodLevel,
  MoodPickerProps,
  SleepChartProps,
  SleepStage,
  Tint,
  VitalTileProps,
} from "./types.js";

// the faces, the streak flame and the default icons come from the icon library
registerIcons({ angry, flame, frown, heartPulse, laugh, meh, pill, smile, target });

const MOOD_ICON: Record<MoodLevel, IconName> = {
  1: "angry",
  2: "frown",
  3: "meh",
  4: "smile",
  5: "laugh",
};
const MOOD_TINT: Record<MoodLevel, Tint> = {
  1: "blush",
  2: "butter",
  3: "sky",
  4: "mint",
  5: "lilac",
};

/* ── HabitTracker ── */

/** Habits with their last days as a row of marks, today's mark is a toggle. */
export function HabitTracker(p: HabitTrackerProps) {
  const t = useStrings(LIFE_STRINGS);
  const { formatDate } = useFormat();
  const n = Math.max(0, ...p.habits.map((h) => h.days.length));
  const labels =
    p.dayLabels ||
    Array.from({ length: n }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (n - 1 - i));
      return formatDate(d, { weekday: "narrow" });
    });
  return (
    <div
      style={p.style}
      className={cx("tf-habits", p.className)}
      role="list"
      aria-label={p.label || t.habits}
    >
      <div className="tf-habit-days" aria-hidden>
        {labels.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
      {p.habits.map((h) => {
        const today = h.days[h.days.length - 1];
        return (
          <div key={h.id} className="tf-habit" role="listitem">
            <TintIcon icon={h.icon || "check"} tint={h.tint || "mint"} size={32} />
            <div className="tf-habit-text">
              <b>{h.label}</b>
              <small>
                {h.streak ? (
                  <span className="tf-habit-streak">
                    <Icon name="flame" size={12} />
                    {t.habitStreak(h.streak)}
                  </span>
                ) : null}
                {h.goal && <span>{h.goal}</span>}
              </small>
            </div>
            <div className="tf-habit-marks">
              {h.days.map((d, i) => {
                const last = i === h.days.length - 1;
                const state =
                  d === true ? t.habitDone : d === false ? t.habitMissed : t.habitNoData;
                const cls = cx("tf-habit-mark", d === true && "done", d === false && "missed");
                return last && p.onToggle ? (
                  <button
                    key={i}
                    type="button"
                    className={cx(cls, "today")}
                    aria-pressed={today === true}
                    aria-label={t.markHabitDone(h.label)}
                    onClick={() => p.onToggle?.(h.id, today !== true)}
                  >
                    {d === true && <Icon name="check" size={12} />}
                    {d === false && <Icon name="x" size={10} />}
                  </button>
                ) : (
                  <span
                    key={i}
                    className={cx(cls, last && "today")}
                    role="img"
                    aria-label={`${labels[i] ?? ""} ${state}`.trim()}
                  >
                    {d === true && <Icon name="check" size={12} />}
                    {d === false && <Icon name="x" size={10} />}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── MoodPicker ── */

/** A five-step mood scale with faces and words (a radio group). */
export function MoodPicker(p: MoodPickerProps) {
  const t = useStrings(LIFE_STRINGS);
  const v = useControlled<MoodLevel | null>(p.value, p.defaultValue ?? null, (m) => {
    if (m) p.onChange?.(m);
  });
  const name = useId("mood");
  const words = p.levels || t.moodLevels;
  return (
    <fieldset style={p.style} className={cx("tf-mood", p.compact && "compact", p.className)}>
      <legend className="tf-mood-q">{p.label || t.howAreYou}</legend>
      <div className="tf-mood-scale">
        {([1, 2, 3, 4, 5] as MoodLevel[]).map((m) => (
          <label
            key={m}
            className={cx("tf-mood-opt", v[0] === m && "on", v[0] === m && "tf-t-" + MOOD_TINT[m])}
          >
            <input
              type="radio"
              name={name}
              checked={v[0] === m}
              onChange={() => v[1](m)}
              aria-label={p.compact ? words[m - 1] : undefined}
            />
            <Icon name={MOOD_ICON[m]} size={22} />
            {!p.compact && <span>{words[m - 1]}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* ── VitalTile ── */

/** One health value with its healthy range drawn as a band and a status in words. */
export function VitalTile(p: VitalTileProps) {
  const t = useStrings(LIFE_STRINGS);
  const { formatNumber } = useFormat();
  const num = (n: number) =>
    formatNumber(n, { minimumFractionDigits: p.digits || 0, maximumFractionDigits: p.digits || 0 });
  const [lo, hi] = p.normal || [p.value, p.value];
  const pad = Math.max((hi - lo) * 0.6, Math.abs(p.value) * 0.05, 1);
  const [min, max] = p.scale || [Math.min(lo - pad, p.value), Math.max(hi + pad, p.value)];
  const pos = (x: number) => Math.max(0, Math.min(100, ((x - min) / (max - min || 1)) * 100));
  const st = !p.normal ? null : p.value < lo ? "low" : p.value > hi ? "high" : "ok";
  return (
    <div
      style={p.style}
      className={cx("tf-vital", p.surface && "tf-" + p.surface, st && "is-" + st, p.className)}
    >
      <div className="tf-vital-head">
        <span className="tf-vital-label">
          <Icon name={p.icon || "heartPulse"} size={14} />
          {p.label}
        </span>
        {st && (
          <Badge tone={st === "ok" ? "success" : "warning"}>
            {st === "ok" ? t.inRange : st === "low" ? t.belowRange : t.aboveRange}
          </Badge>
        )}
      </div>
      <div className="tf-vital-main">
        <span className="tf-vital-value">
          {num(p.value)}
          {p.unit && <small>{p.unit}</small>}
        </span>
        {p.trend && p.trend.length > 1 && (
          <Sparkline
            values={p.trend}
            width={88}
            height={28}
            tint={st === "ok" || !st ? "mint" : "butter"}
          />
        )}
      </div>
      {p.normal && (
        <div className="tf-vital-band" aria-hidden>
          <span
            className="tf-vital-normal"
            style={{ left: pos(lo) + "%", width: pos(hi) - pos(lo) + "%" }}
          />
          <span className="tf-vital-dot" style={{ left: pos(p.value) + "%" }} />
        </div>
      )}
      <div className="tf-vital-foot">
        {p.normal && <span>{t.normalRange(num(lo), num(hi))}</span>}
        {p.caption && <span>{p.caption}</span>}
      </div>
    </div>
  );
}

/* ── ActivityRings ── */

/** Concentric progress rings for daily goals (move, exercise, stand …) with a legend. */
export function ActivityRings(p: ActivityRingsProps) {
  const t = useStrings(LIFE_STRINGS);
  const { formatNumber } = useFormat();
  const size = p.size || 132,
    sw = Math.max(8, Math.round(size / 11)),
    gap = 3;
  const tints: Tint[] = ["blush", "mint", "sky", "lilac", "butter"];
  const text = (r: ActivityRingsProps["rings"][number]) =>
    t.ofGoal(formatNumber(r.value), formatNumber(r.goal)) + (r.unit ? " " + r.unit : "");
  return (
    <div style={p.style} className={cx("tf-rings", p.className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${p.label || t.activity}: ${p.rings.map((r) => `${r.label} ${text(r)}`).join(", ")}`}
      >
        {p.rings.map((r, i) => {
          const rad = size / 2 - sw / 2 - i * (sw + gap);
          if (rad <= sw / 2) return null;
          const c = 2 * Math.PI * rad,
            k = Math.max(0, Math.min(1, r.goal ? r.value / r.goal : 0));
          const tint = r.tint || tints[i % tints.length];
          return (
            <g key={r.label}>
              <circle
                className="tf-arc-track"
                cx={size / 2}
                cy={size / 2}
                r={rad}
                strokeWidth={sw}
              />
              <circle
                className={cx("tf-arc", "tf-arc-" + tint)}
                cx={size / 2}
                cy={size / 2}
                r={rad}
                strokeWidth={sw}
                strokeDasharray={c}
                strokeDashoffset={c * (1 - k)}
              />
            </g>
          );
        })}
      </svg>
      {p.legend !== false && (
        <ul className="tf-rings-legend" aria-hidden>
          {p.rings.map((r, i) => (
            <li key={r.label}>
              <span
                className={cx("tf-rings-key", "tf-sf-" + (r.tint || tints[i % tints.length]))}
              />
              <span className="tf-rings-name">{r.label}</span>
              <b>{text(r)}</b>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── SleepChart ── */

const STAGES: SleepStage[] = ["awake", "rem", "light", "deep"];
const STAGE_FILL: Record<SleepStage, Tint> = {
  awake: "butter",
  rem: "lilac",
  light: "sky",
  deep: "mint",
};

/** A night as stages over time (one lane per stage) with the time asleep per stage. */
export function SleepChart(p: SleepChartProps) {
  const t = useStrings(LIFE_STRINGS);
  const { formatDate } = useFormat();
  const ms = (d: Date | string | number) => new Date(d).getTime();
  const segs = p.segments.filter((s) => ms(s.end) > ms(s.start));
  const start = Math.min(...segs.map((s) => ms(s.start))),
    end = Math.max(...segs.map((s) => ms(s.end))),
    span = end - start || 1;
  const total: Record<SleepStage, number> = { awake: 0, rem: 0, light: 0, deep: 0 };
  segs.forEach((s) => (total[s.stage] += ms(s.end) - ms(s.start)));
  const dur = (m: number) => {
    const min = Math.round(m / 60000);
    return t.durationHm(Math.floor(min / 60), min % 60);
  };
  const asleep = total.rem + total.light + total.deep;
  const time = (x: number) => formatDate(x, { hour: "numeric", minute: "2-digit" });
  return (
    <div style={p.style} className={cx("tf-sleep", p.className)}>
      <div
        className="tf-sleep-chart"
        role="img"
        aria-label={`${p.label || t.sleepStages}: ${t.totalSleep(dur(asleep))}, ${STAGES.map(
          (s) => `${t.sleepStageNames[s]} ${dur(total[s])}`,
        ).join(", ")}`}
      >
        {STAGES.map((stage) => (
          <div key={stage} className="tf-sleep-lane">
            <span className="tf-sleep-name">{t.sleepStageNames[stage]}</span>
            <span className="tf-sleep-track">
              {segs
                .filter((s) => s.stage === stage)
                .map((s, i) => (
                  <span
                    key={i}
                    className={cx("tf-sleep-seg", "tf-sf-" + STAGE_FILL[stage])}
                    style={{
                      left: ((ms(s.start) - start) / span) * 100 + "%",
                      width: ((ms(s.end) - ms(s.start)) / span) * 100 + "%",
                    }}
                  />
                ))}
            </span>
          </div>
        ))}
        <div className="tf-sleep-axis" aria-hidden>
          <span>{time(start)}</span>
          <span>{time(end)}</span>
        </div>
      </div>
      {p.summary !== false && (
        <div className="tf-sleep-sum">
          <b>{t.totalSleep(dur(asleep))}</b>
          <ul>
            {STAGES.map((s) => (
              <li key={s}>
                <span className={cx("tf-rings-key", "tf-sf-" + STAGE_FILL[s])} />
                {t.sleepStageNames[s]}
                <span>{dur(total[s])}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ── MedicationList ── */

/** Today's doses in order, each with its status in words and a "taken" button. */
export function MedicationList(p: MedicationListProps) {
  const t = useStrings(LIFE_STRINGS);
  const words = { taken: t.medTaken, due: t.medDue, missed: t.medMissed, upcoming: t.medUpcoming };
  return (
    <ul style={p.style} className={cx("tf-meds", p.className)} aria-label={p.label || t.medication}>
      {p.items.map((m) => {
        const st = m.status || (m.taken ? "taken" : "due");
        return (
          <li key={m.id} className={cx("tf-med", "is-" + st)}>
            <span className="tf-med-time">{m.time}</span>
            <TintIcon
              icon={m.icon || "pill"}
              tint={st === "missed" ? "blush" : st === "taken" ? "mint" : "sky"}
              size={32}
            />
            <span className="tf-med-text">
              <b>{m.name}</b>
              {(m.dose || m.note) && <small>{[m.dose, m.note].filter(Boolean).join(" · ")}</small>}
            </span>
            {st === "taken" ? (
              <Badge tone="success">{words.taken}</Badge>
            ) : (
              <span className="tf-med-act">
                <Badge tone={st === "missed" ? "danger" : st === "due" ? "warning" : undefined}>
                  {words[st]}
                </Badge>
                {p.onTake && st !== "upcoming" && (
                  <IconButton
                    icon="check"
                    label={t.markTaken(m.name)}
                    size="sm"
                    onClick={() => p.onTake?.(m.id)}
                  />
                )}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ── JournalEntry ── */

/** A journal or diary entry: date, mood, title, text and tags. */
export function JournalEntry(p: JournalEntryProps) {
  const t = useStrings(LIFE_STRINGS);
  const { formatDate } = useFormat();
  return (
    <article
      style={p.style}
      className={cx("tf-journal", p.surface && "tf-" + p.surface, p.className)}
    >
      <header className="tf-journal-head">
        <time dateTime={new Date(p.date).toISOString()}>
          {formatDate(p.date, { weekday: "long", day: "numeric", month: "long" })}
        </time>
        {p.mood && (
          <span className={cx("tf-journal-mood", "tf-t-" + MOOD_TINT[p.mood])}>
            <Icon name={MOOD_ICON[p.mood]} size={14} />
            {t.moodLevels[p.mood - 1]}
          </span>
        )}
      </header>
      {p.title && <h3 className="tf-journal-title">{p.title}</h3>}
      {p.children && <div className="tf-journal-body">{p.children}</div>}
      {(p.tags?.length || p.actions) && (
        <footer className="tf-journal-foot">
          <span className="tf-journal-tags">
            {(p.tags || []).map((g) => (
              <Badge key={g}>{g}</Badge>
            ))}
          </span>
          {p.actions}
        </footer>
      )}
    </article>
  );
}

/* ── GoalCard ── */

/** A goal with its progress toward a target, a due date and milestones. */
export function GoalCard(p: GoalCardProps) {
  const t = useStrings(LIFE_STRINGS);
  const { formatNumber, formatMoney, formatPercent, formatDate } = useFormat();
  const pct = Math.max(0, Math.min(100, p.target ? (p.value / p.target) * 100 : 0));
  const show = (n: number) =>
    p.format === "money"
      ? formatMoney(n, p.currency, { maximumFractionDigits: 0 })
      : p.format === "percent"
        ? formatPercent(n)
        : formatNumber(n) + (p.unit ? " " + p.unit : "");
  return (
    <div style={p.style} className={cx("tf-goal", p.surface && "tf-" + p.surface, p.className)}>
      <div className="tf-goal-head">
        <TintIcon icon={p.icon || "target"} tint={p.tint || "lilac"} size={36} />
        <div className="tf-option-text">
          <b>{p.title}</b>
          {p.due != null && (
            <small>{t.dueBy(formatDate(p.due, { month: "short", year: "numeric" }))}</small>
          )}
        </div>
        <span className="tf-goal-pct">{formatPercent(Math.round(pct))}</span>
      </div>
      <div
        className="tf-goal-bar"
        role="progressbar"
        aria-label={p.title}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-valuetext={t.ofGoal(show(p.value), show(p.target))}
      >
        <span className={cx("tf-sf-" + (p.tint || "lilac"))} style={{ width: pct + "%" }} />
      </div>
      <div className="tf-goal-meta">{t.ofGoal(show(p.value), show(p.target))}</div>
      {p.milestones && p.milestones.length > 0 && (
        <ul className="tf-goal-steps">
          {p.milestones.map((m, i) => (
            <li key={i} className={cx(m.done && "done")}>
              <span className="tf-goal-step" aria-hidden>
                {m.done && <Icon name="check" size={10} />}
              </span>
              {m.label}
            </li>
          ))}
        </ul>
      )}
      {p.note && <p className="tf-goal-note">{p.note}</p>}
    </div>
  );
}

/* ── InsightCard ── */

const INSIGHT_TINT = {
  info: "sky",
  success: "mint",
  warning: "butter",
  highlight: "lilac",
} as const;

/**
 * Something the assistant noticed, with where it comes from, why it is shown and what to do:
 * accept, snooze or dismiss.
 */
export function InsightCard(p: InsightCardProps) {
  const t = useStrings(LIFE_STRINGS);
  const [why, setWhy] = React.useState(false);
  const id = useId("insight");
  const tone = p.tone || "info";
  return (
    <section
      style={p.style}
      className={cx("tf-insight", p.surface && "tf-" + p.surface, "is-" + tone, p.className)}
      aria-labelledby={`${id}-t`}
    >
      <div className="tf-insight-head">
        <TintIcon icon={p.icon || "sparkle"} tint={INSIGHT_TINT[tone]} size={36} />
        <div className="tf-insight-titles">
          {p.meta && <small>{p.meta}</small>}
          <b id={`${id}-t`}>{p.title}</b>
        </div>
        {p.onDismiss && (
          <IconButton icon="x" label={t.dismiss} size="sm" variant="ghost" onClick={p.onDismiss} />
        )}
      </div>
      {p.children && <div className="tf-insight-body">{p.children}</div>}
      {p.sources && p.sources.length > 0 && (
        <div className="tf-msg-sources">
          {p.sources.map((s, i) => (
            <a
              key={i}
              className="tf-source"
              href={s.url || "#"}
              title={s.title}
              onClick={
                s.onClick
                  ? (e) => {
                      e.preventDefault();
                      s.onClick?.();
                    }
                  : undefined
              }
            >
              <span className="tf-source-n">{i + 1}</span>
              <Icon name={s.icon || "book"} size={12} />
              <span className="tf-source-title">{s.title}</span>
            </a>
          ))}
        </div>
      )}
      {p.why && (
        <div className="tf-insight-why">
          <button
            type="button"
            aria-expanded={why}
            aria-controls={`${id}-why`}
            onClick={() => setWhy(!why)}
          >
            <Icon name="help" size={14} />
            {t.whyInsight}
            <Icon name="chevronDown" size={14} className="tf-insight-chev" />
          </button>
          {why && (
            <div id={`${id}-why`} className="tf-insight-whytext">
              {p.why}
            </div>
          )}
        </div>
      )}
      {(p.onAccept || p.onSnooze) && (
        <div className="tf-insight-actions">
          {p.onSnooze && (
            <Button variant="ghost" size="sm" icon="clock" onClick={p.onSnooze}>
              {t.insightSnooze}
            </Button>
          )}
          {p.onAccept && (
            <Button variant="primary" size="sm" onClick={p.onAccept}>
              {p.acceptLabel || t.insightAccept}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}

/* ── ConsentList ── */

/** What each connected source lets the assistant read or do, switchable per scope, revocable. */
export function ConsentList(p: ConsentListProps) {
  const t = useStrings(LIFE_STRINGS);
  const { formatDate } = useFormat();
  return (
    <div
      style={p.style}
      className={cx("tf-consent", p.className)}
      role="list"
      aria-label={p.label || t.dataAccess}
    >
      {p.connectors.map((c) => (
        <section
          key={c.id}
          className={cx("tf-consent-item", p.surface && "tf-" + p.surface)}
          role="listitem"
          aria-label={c.name}
        >
          <div className="tf-consent-head">
            <ServiceMark name={c.name} icon={c.icon} logo={c.logo} tint="sky" decorative />
            <div className="tf-option-text">
              <b>{c.name}</b>
              <small>
                {c.lastUsed != null
                  ? t.lastUsed(formatDate(c.lastUsed, { day: "numeric", month: "short" }))
                  : t.notUsedYet}
              </small>
            </div>
            {p.onRevoke && (
              <Button variant="secondary" size="sm" onClick={() => p.onRevoke?.(c.id)}>
                {t.revokeAccess}
              </Button>
            )}
          </div>
          {c.purpose && <p className="tf-consent-purpose">{c.purpose}</p>}
          <ul className="tf-consent-scopes">
            {c.scopes.map((s) => (
              <li key={s.id}>
                <span className="tf-option-text">
                  <b>{s.label}</b>
                  {s.description && <small>{s.description}</small>}
                  {s.level && (
                    <span className={cx("tf-scope-level", "is-" + s.level)}>
                      {t.scopeLevels[s.level]}
                      {s.asksFirst && " · " + t.asksFirst}
                    </span>
                  )}
                </span>
                {s.required ? (
                  <span className="tf-consent-req">{t.requiredScope}</span>
                ) : (
                  <Switch
                    checked={s.granted}
                    label={`${c.name}: ${s.label}`}
                    onChange={(e) => p.onScopeChange?.(c.id, s.id, e.currentTarget.checked)}
                  />
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
