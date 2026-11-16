"use client";
import * as React from "react";
import { cx } from "../cx.js";
import { useFormat, useStrings } from "../context.js";
import { CRM_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { registerIcons, type IconName } from "../icons.js";
import { briefcase, handshake, scale, stickyNote, video } from "../icon-library.js";
import { Avatar, Badge, Button, Chip, IconButton, TintIcon } from "./foundation.js";
import { Segmented } from "./forms.js";
import { Checkbox, Textarea } from "./inputs.js";
import { Popover } from "./overlays.js";
import { Menu } from "./feedback.js";
import { ServiceMark } from "./connectors.js";
import type {
  CrmTask,
  Deal,
  DealCardProps,
  ImportMapperProps,
  LeadScoreProps,
  MergeRecordsProps,
  PipelineProps,
  PropertyField,
  PropertyListProps,
  RecordEntry,
  RecordEntryType,
  RecordHeaderProps,
  RecordTimelineProps,
  TaskListProps,
} from "./types.js";

// default icons of these components come from the icon library
registerIcons({ briefcase, handshake, scale, stickyNote, video });

const DAY = 86400000;
function dayStart(v: Date | string | number): number {
  const d = new Date(v);
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * The head of a record (a person, a company, a deal, a matter): picture, name, stage, tags, owner,
 * quick actions and the key facts.
 */
export function RecordHeader(p: RecordHeaderProps) {
  const t = useStrings(CRM_STRINGS);
  const kind = p.kind || "person";
  const pic =
    p.avatar ??
    (kind === "person" ? (
      <Avatar name={p.title} size={56} />
    ) : kind === "company" ? (
      <ServiceMark name={p.title} icon={p.icon} size="lg" tint="sky" decorative />
    ) : (
      <TintIcon
        icon={p.icon || (kind === "deal" ? "handshake" : "briefcase")}
        tint={kind === "deal" ? "butter" : "lilac"}
        size={48}
      />
    ));
  return (
    <section
      style={p.style}
      className={cx("tf-record", p.surface && "tf-" + p.surface, p.className)}
      aria-label={p.title}
    >
      <div className="tf-record-top">
        <span className="tf-record-pic">{pic}</span>
        <div className="tf-record-titles">
          <h2>{p.title}</h2>
          {p.subtitle && <p>{p.subtitle}</p>}
          {(p.status || (p.tags && p.tags.length > 0)) && (
            <div className="tf-record-badges">
              {p.status && (
                <Badge tone={p.status.tone || "info"} dot>
                  {p.status.label}
                </Badge>
              )}
              {p.tags?.map((tag) => (
                <Badge key={tag} tone="neutral">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        {(p.owner || p.menu) && (
          <div className="tf-record-side">
            {p.owner && (
              <span className="tf-record-owner">
                <Avatar name={p.owner} size={24} />
                {t.ownedBy(p.owner)}
              </span>
            )}
            {p.menu}
          </div>
        )}
      </div>
      {p.actions && p.actions.length > 0 && (
        <div className="tf-record-actions">
          {p.actions.map((a) => (
            <Button
              key={a.label}
              variant={a.primary ? "primary" : "secondary"}
              size="sm"
              icon={a.icon}
              onClick={a.onClick}
            >
              {a.label}
            </Button>
          ))}
        </div>
      )}
      {p.facts && p.facts.length > 0 && (
        <dl className="tf-record-facts">
          {p.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

const INPUT_TYPE: Partial<Record<NonNullable<PropertyField["type"]>, string>> = {
  email: "email",
  phone: "tel",
  url: "url",
  number: "number",
  money: "number",
  percent: "number",
  date: "date",
};

function asText(f: PropertyField): string {
  const v = f.value;
  if (v == null) return "";
  if (Array.isArray(v)) return v.join(", ");
  if (v instanceof Date) {
    const m = String(v.getMonth() + 1).padStart(2, "0");
    const d = String(v.getDate()).padStart(2, "0");
    return `${v.getFullYear()}-${m}-${d}`;
  }
  return String(v);
}

/**
 * A record's fields as label and value, each shown by its type (links for email, phone and web,
 * money and dates in the locale, tags as chips) and editable in place.
 */
export function PropertyList(p: PropertyListProps) {
  const t = useStrings(CRM_STRINGS);
  const { formatMoney, formatNumber, formatPercent, formatDate } = useFormat();
  const [editing, setEditing] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");
  const show = (f: PropertyField): React.ReactNode => {
    const v = f.value;
    if (v == null || v === "" || (Array.isArray(v) && v.length === 0))
      return <span className="tf-prop-empty">{t.emptyValue}</span>;
    switch (f.type) {
      case "email":
        return <a href={`mailto:${v}`}>{String(v)}</a>;
      case "phone":
        return <a href={`tel:${String(v).replace(/[^+\d]/g, "")}`}>{String(v)}</a>;
      case "url":
        return (
          <a href={String(v)} target="_blank" rel="noreferrer">
            {String(v)
              .replace(/^https?:\/\//, "")
              .replace(/\/$/, "")}
          </a>
        );
      case "money":
        return formatMoney(Number(v), f.currency);
      case "percent":
        return formatPercent(Number(v), { maximumFractionDigits: 2 });
      case "number":
        return formatNumber(Number(v));
      case "date":
        return formatDate(v as Date, { day: "numeric", month: "short", year: "numeric" });
      case "tags":
        return (
          <span className="tf-prop-tags">
            {(Array.isArray(v) ? v : String(v).split(/,\s*/)).map((x) => (
              <Badge key={x} tone="neutral">
                {x}
              </Badge>
            ))}
          </span>
        );
      case "person":
        return (
          <span className="tf-prop-person">
            <Avatar name={String(v)} size={20} />
            {String(v)}
          </span>
        );
      default:
        return String(v);
    }
  };
  const save = (f: PropertyField) => {
    setEditing(null);
    if (draft !== asText(f)) p.onChange?.(f.id, draft);
  };
  return (
    <dl
      style={p.style}
      className={cx("tf-props", p.className)}
      aria-label={p.label || t.detailsLabel}
    >
      {p.fields.map((f) => {
        const editable = !!p.onChange && !f.readOnly;
        const open = editing === f.id;
        const keys = (e: React.KeyboardEvent) => {
          if (e.key === "Enter") save(f);
          if (e.key === "Escape") setEditing(null);
        };
        return (
          <div key={f.id} className={cx("tf-prop", open && "is-editing")}>
            <dt>
              {f.label}
              {f.hint && <small>{f.hint}</small>}
            </dt>
            <dd>
              {open ? (
                f.type === "select" && f.options ? (
                  <select
                    className="tf-input tf-prop-input"
                    autoFocus
                    aria-label={f.label}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => save(f)}
                    onKeyDown={keys}
                  >
                    {f.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="tf-input tf-prop-input"
                    autoFocus
                    aria-label={f.label}
                    type={INPUT_TYPE[f.type || "text"] || "text"}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => save(f)}
                    onKeyDown={keys}
                  />
                )
              ) : (
                <>
                  <span className="tf-prop-value">{show(f)}</span>
                  {editable && (
                    <IconButton
                      icon="edit"
                      label={t.editField(f.label)}
                      size="sm"
                      variant="ghost"
                      className="tf-prop-edit"
                      onClick={() => {
                        setDraft(asText(f));
                        setEditing(f.id);
                      }}
                    />
                  )}
                </>
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

const ENTRY_ICON: Record<RecordEntryType, IconName> = {
  email: "mail",
  call: "phone",
  meeting: "video",
  note: "stickyNote",
  task: "check",
  stage: "flag",
  document: "file",
  system: "settings",
};
const ENTRY_TINT = {
  email: "sky",
  call: "mint",
  meeting: "lilac",
  note: "butter",
  task: "mint",
  stage: "blush",
  document: "sky",
  system: "plain",
} as const;

/**
 * Everything that happened on a record in one timeline (emails, calls, meetings, notes, tasks,
 * stage changes, documents), filterable by type, with a composer for a note, a call or a task.
 */
export function RecordTimeline(p: RecordTimelineProps) {
  const t = useStrings(CRM_STRINGS);
  const { formatDate, locale } = useFormat();
  const [type, setType] = React.useState<RecordEntryType | "all">("all");
  const [mode, setMode] = React.useState<"note" | "call" | "task">("note");
  const [text, setText] = React.useState("");
  const now = p.now ?? Date.now();
  const types = [...new Set(p.entries.map((e) => e.type))];
  const shown = p.entries.filter((e) => type === "all" || e.type === type);
  const pinned = shown.filter((e) => e.pinned);
  const rest = shown.filter((e) => !e.pinned).sort((a, b) => +new Date(b.at) - +new Date(a.at));
  const groups: { key: number; items: RecordEntry[] }[] = [];
  for (const e of rest) {
    const k = dayStart(e.at);
    const last = groups[groups.length - 1];
    if (last && last.key === k) last.items.push(e);
    else groups.push({ key: k, items: [e] });
  }
  const heading = (k: number, sample: RecordEntry["at"]) => {
    const diff = Math.round((k - dayStart(now)) / DAY);
    if (diff === 0 || diff === -1) {
      try {
        const w = new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(diff, "day");
        return w.charAt(0).toLocaleUpperCase(locale) + w.slice(1);
      } catch {
        /* fall through to the date */
      }
    }
    return formatDate(sample, { weekday: "long", day: "numeric", month: "long" });
  };
  const item = (e: RecordEntry) => (
    <li key={e.id} className={cx("tf-entry", "type-" + e.type, e.pinned && "is-pinned")}>
      <span className={cx("tf-entry-ico", "tf-t-" + ENTRY_TINT[e.type])} aria-hidden>
        <Icon name={ENTRY_ICON[e.type]} size={14} />
      </span>
      <div className="tf-entry-main">
        <p className="tf-entry-title">{e.title}</p>
        <p className="tf-entry-meta">
          {[
            t.entryTypes[e.type],
            e.actor,
            formatDate(
              e.at,
              e.pinned
                ? { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }
                : { hour: "numeric", minute: "2-digit" },
            ),
            e.meta,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {e.body && <div className="tf-entry-body">{e.body}</div>}
      </div>
    </li>
  );
  return (
    <div style={p.style} className={cx("tf-rtl", p.className)}>
      {p.onAdd && (
        <form
          className="tf-rtl-composer"
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            p.onAdd?.(mode, text.trim());
            setText("");
          }}
        >
          <Segmented
            size="sm"
            label={t.activityLabel}
            value={mode}
            onChange={(v) => setMode(v as typeof mode)}
            options={(["note", "call", "task"] as const).map((m) => ({
              value: m,
              label: t.composerModes[m],
            }))}
          />
          <Textarea
            label={t.composerModes[mode]}
            rows={2}
            placeholder={t.composerPlaceholders[mode]}
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
          />
          <div className="tf-row" style={{ justifyContent: "flex-end" }}>
            <Button type="submit" size="sm" disabled={!text.trim()}>
              {t.saveEntry}
            </Button>
          </div>
        </form>
      )}
      {p.filters !== false && types.length > 1 && (
        <div className="tf-rtl-filters" role="group" aria-label={t.activityLabel}>
          <Chip selected={type === "all"} onClick={() => setType("all")}>
            {t.allTypes}
          </Chip>
          {types.map((x) => (
            <Chip key={x} selected={type === x} icon={ENTRY_ICON[x]} onClick={() => setType(x)}>
              {t.entryTypes[x]}
            </Chip>
          ))}
        </div>
      )}
      {pinned.length > 0 && (
        <section className="tf-rtl-day" aria-label={t.pinnedLabel}>
          <h3 className="tf-agentlog-title" aria-hidden>
            {t.pinnedLabel}
          </h3>
          <ul>{pinned.map(item)}</ul>
        </section>
      )}
      {groups.map((g) => (
        <section key={g.key} className="tf-rtl-day" aria-label={heading(g.key, g.items[0]!.at)}>
          <h3 className="tf-agentlog-title" aria-hidden>
            {heading(g.key, g.items[0]!.at)}
          </h3>
          <ul aria-label={p.label || t.activityLabel}>{g.items.map(item)}</ul>
        </section>
      ))}
    </div>
  );
}

/**
 * A deal on a pipeline: value, probability, close date, owner, time in stage (stale after a
 * while) and the next step, with a "Move to" menu that works without dragging.
 */
export function DealCard(p: DealCardProps) {
  const t = useStrings(CRM_STRINGS);
  const { formatMoney, formatDate, formatPercent } = useFormat();
  const d = p.deal;
  const stale = d.daysInStage != null && d.daysInStage >= (p.staleAfter ?? 14);
  return (
    <article
      style={p.style}
      className={cx("tf-deal", stale && "is-stale", p.surface && "tf-" + p.surface, p.className)}
      aria-label={d.title}
    >
      <div className="tf-deal-head">
        {p.onOpen ? (
          <button type="button" className="tf-deal-title" onClick={() => p.onOpen?.(d.id)}>
            {d.title}
          </button>
        ) : (
          <b className="tf-deal-title">{d.title}</b>
        )}
        {p.onMove && p.stages && p.stages.length > 0 && (
          <Popover
            flush
            align="end"
            trigger={(s) => (
              <IconButton
                icon="more"
                label={t.moveDeal(d.title)}
                size="sm"
                variant="ghost"
                onClick={s.toggle}
                aria-expanded={s.open}
                aria-haspopup="menu"
              />
            )}
          >
            {(s) => (
              <Menu
                label={t.moveTo}
                autoFocus
                onClose={s.close}
                items={p.stages!.map((st) => ({
                  label: st.label,
                  onClick: () => {
                    p.onMove?.(d.id, st.id);
                    s.close();
                  },
                }))}
              />
            )}
          </Popover>
        )}
      </div>
      {d.company && <span className="tf-deal-company">{d.company}</span>}
      <div className="tf-deal-nums">
        <b>{formatMoney(d.value, d.currency, { maximumFractionDigits: 0 })}</b>
        {d.probability != null && <span>{formatPercent(d.probability)}</span>}
      </div>
      <div className="tf-deal-meta">
        {d.closeDate != null && (
          <span>{t.closesOn(formatDate(d.closeDate, { day: "numeric", month: "short" }))}</span>
        )}
        {d.daysInStage != null && (
          <span className={cx(stale && "tf-deal-stale")}>
            {stale && <Icon name="clock" size={12} />}
            {stale ? t.staleLabel + " · " : ""}
            {t.daysInStage(d.daysInStage)}
          </span>
        )}
      </div>
      {(d.next || d.owner) && (
        <div className="tf-deal-foot">
          {d.next && <span className="tf-deal-next">{t.nextStep(d.next)}</span>}
          {d.owner && <Avatar name={d.owner} size={22} />}
        </div>
      )}
    </article>
  );
}

/**
 * Deals by stage, each column with its count, total and weighted value; deals move by drag and
 * drop or from their "Move to" menu.
 */
export function Pipeline(p: PipelineProps) {
  const t = useStrings(CRM_STRINGS);
  const { formatMoney } = useFormat();
  const [over, setOver] = React.useState<string | null>(null);
  const money = (v: number) => formatMoney(v, p.currency, { maximumFractionDigits: 0 });
  const stages = p.stages.map((s) => ({ id: s.id, label: s.label }));
  return (
    <div
      style={p.style}
      className={cx("tf-dealboard", p.className)}
      role="list"
      aria-label={p.label || t.pipelineLabel}
    >
      {p.stages.map((s) => {
        const total = s.deals.reduce((a, d) => a + d.value, 0);
        const weighted = s.deals.reduce(
          (a, d) => a + (d.value * (d.probability ?? s.probability ?? 0)) / 100,
          0,
        );
        return (
          <section
            key={s.id}
            role="listitem"
            aria-label={s.label}
            className={cx("tf-dealstage", over === s.id && "is-over")}
            onDragOver={(e) => {
              if (!p.onMove) return;
              e.preventDefault();
              setOver(s.id);
            }}
            onDragLeave={() => setOver((o) => (o === s.id ? null : o))}
            onDrop={(e) => {
              e.preventDefault();
              setOver(null);
              const id = e.dataTransfer.getData("text/plain");
              if (id) p.onMove?.(id, s.id);
            }}
          >
            <header className="tf-dealstage-head">
              <b>{s.label}</b>
              <span className="tf-dealstage-count" aria-hidden>
                {s.deals.length}
              </span>
              <span className="tf-sidebar-sr">{t.dealCount(s.deals.length)}</span>
              <small>
                {money(total)} · {t.weightedValue(money(weighted))}
              </small>
            </header>
            <div className="tf-dealstage-deals">
              {s.deals.map((d: Deal) => (
                <div
                  key={d.id}
                  draggable={!!p.onMove}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", d.id);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                >
                  <DealCard
                    deal={{ ...d, probability: d.probability ?? s.probability }}
                    staleAfter={p.staleAfter}
                    onOpen={p.onOpen}
                    stages={stages.filter((x) => x.id !== s.id)}
                    onMove={p.onMove}
                  />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

type TaskGroup = "overdue" | "today" | "upcoming" | "nodate" | "done";

/**
 * Tasks grouped into overdue, today, upcoming, without a date and done; each with its due date,
 * priority, assignee and the record it belongs to.
 */
export function TaskList(p: TaskListProps) {
  const t = useStrings(CRM_STRINGS);
  const { formatDate } = useFormat();
  const today = dayStart(p.today ?? Date.now());
  const groupOf = (x: CrmTask): TaskGroup => {
    if (x.done) return "done";
    if (x.due == null) return "nodate";
    const d = dayStart(x.due);
    return d < today ? "overdue" : d === today ? "today" : "upcoming";
  };
  const order: TaskGroup[] = ["overdue", "today", "upcoming", "nodate", "done"];
  const sorted = [...p.tasks].sort(
    (a, b) =>
      (a.due == null ? Infinity : +new Date(a.due)) - (b.due == null ? Infinity : +new Date(b.due)),
  );
  const row = (x: CrmTask) => {
    const g = groupOf(x);
    return (
      <li key={x.id} className={cx("tf-task", "is-" + g, x.priority === "high" && "is-high")}>
        <Checkbox
          checked={!!x.done}
          label={t.completeTask(x.title)}
          onChange={(e) => p.onToggle?.(x.id, e.currentTarget.checked)}
        />
        <div className="tf-task-main">
          {p.onOpen ? (
            <button type="button" className="tf-task-title" onClick={() => p.onOpen?.(x.id)}>
              {x.title}
            </button>
          ) : (
            <span className="tf-task-title">{x.title}</span>
          )}
          <span className="tf-task-meta">
            {x.due != null && (
              <span className={cx(g === "overdue" && "tf-task-late")}>
                {t.dueOn(formatDate(x.due, { day: "numeric", month: "short" }))}
              </span>
            )}
            {x.priority && x.priority !== "normal" && (
              <span className={cx("tf-task-prio", "is-" + x.priority)}>
                {t.priorityLabels[x.priority]}
              </span>
            )}
            {x.related && <span>{x.related}</span>}
          </span>
        </div>
        {x.assignee && <Avatar name={x.assignee} size={24} />}
      </li>
    );
  };
  if (p.grouped === false)
    return (
      <ul
        style={p.style}
        className={cx("tf-tasks", p.className)}
        aria-label={p.label || t.tasksLabel}
      >
        {sorted.map(row)}
      </ul>
    );
  return (
    <div style={p.style} className={cx("tf-tasks-grouped", p.className)}>
      {order.map((g) => {
        const items = sorted.filter((x) => groupOf(x) === g);
        if (!items.length) return null;
        return (
          <section key={g} aria-label={t.taskGroups[g]}>
            <h3 className={cx("tf-agentlog-title", g === "overdue" && "tf-task-late")}>
              {t.taskGroups[g]} <span className="tf-task-count">{items.length}</span>
            </h3>
            <ul className="tf-tasks">{items.map(row)}</ul>
          </section>
        );
      })}
    </div>
  );
}

/** A lead's score from 0 to 100 as hot, warm or cold, with what raised or lowered it. */
export function LeadScore(p: LeadScoreProps) {
  const t = useStrings(CRM_STRINGS);
  const score = Math.max(0, Math.min(100, Math.round(p.score)));
  const grade = score >= (p.hot ?? 70) ? "hot" : score >= (p.warm ?? 40) ? "warm" : "cold";
  const label = t.leadScoreLabel(score, t.leadGrades[grade]);
  const badge = (
    <>
      <span
        className="tf-lead-ring"
        style={{ "--score": score } as React.CSSProperties}
        aria-hidden
      >
        {score}
      </span>{" "}
      <span>{t.leadGrades[grade]}</span>
    </>
  );
  if (!p.reasons || p.reasons.length === 0)
    return (
      <span
        style={p.style}
        className={cx("tf-lead", "is-" + grade, p.className)}
        role="img"
        aria-label={label}
      >
        {badge}
      </span>
    );
  return (
    <Popover
      style={p.style}
      className={p.className}
      width={260}
      trigger={(s) => (
        <button
          type="button"
          className={cx("tf-lead", "is-" + grade)}
          aria-label={label}
          aria-expanded={s.open}
          onClick={s.toggle}
        >
          {badge}
          <Icon name="chevronDown" size={12} />
        </button>
      )}
    >
      <div className="tf-lead-reasons">
        <b>{t.scoreReasons}</b>
        <ul>
          {p.reasons.map((r) => (
            <li key={r.text}>
              <span>{r.text}</span>
              <span className={cx("tf-lead-pts", r.points < 0 && "is-neg")}>
                {r.points > 0 ? "+" : r.points < 0 ? "−" : ""}
                {Math.abs(r.points)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Popover>
  );
}

/** Two records that are the same thing, side by side: pick the value to keep per field, then merge. */
export function MergeRecords(p: MergeRecordsProps) {
  const t = useStrings(CRM_STRINGS);
  const initial = React.useMemo(() => {
    const v: Record<string, string> = {};
    for (const f of p.fields) {
      const withValue = p.records.find((r) => r.values[f.id] != null && r.values[f.id] !== "");
      v[f.id] = (withValue ?? p.records[0])!.id;
    }
    return v;
  }, [p.fields, p.records]);
  const [own, setOwn] = React.useState(initial);
  const value = p.value ?? own;
  const pick = (field: string, rec: string) => {
    const next = { ...value, [field]: rec };
    setOwn(next);
    p.onChange?.(next);
  };
  const name = React.useId();
  return (
    <div style={p.style} className={cx("tf-merge", p.className)}>
      <div className="tf-merge-scroll">
        <table className="tf-merge-table">
          <thead>
            <tr>
              <th scope="col">{t.fieldLabel}</th>
              {p.records.map((r) => (
                <th key={r.id} scope="col">
                  <b>{r.title}</b>
                  {r.subtitle && <small>{r.subtitle}</small>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {p.fields.map((f) => {
              const vals = p.records.map((r) => r.values[f.id]);
              const differs = new Set(vals.map((v) => String(v ?? ""))).size > 1;
              return (
                <tr key={f.id} className={cx(differs && "is-diff")}>
                  <th scope="row">
                    {f.label}
                    {differs && <small>{t.mergeDiffers}</small>}
                  </th>
                  {p.records.map((r) => (
                    <td key={r.id} className={cx(value[f.id] === r.id && "is-kept")}>
                      <label className="tf-merge-cell">
                        <input
                          type="radio"
                          name={`${name}-${f.id}`}
                          checked={value[f.id] === r.id}
                          onChange={() => pick(f.id, r.id)}
                          aria-label={t.mergeChoice(f.label, r.title)}
                        />
                        <span>{r.values[f.id] ?? <span className="tf-prop-empty">—</span>}</span>
                      </label>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {p.onMerge && (
        <div className="tf-row" style={{ justifyContent: "flex-end" }}>
          <Button icon="swap" onClick={() => p.onMerge?.(value)}>
            {t.mergeAction}
          </Button>
        </div>
      )}
    </div>
  );
}

/** A file's columns mapped to record fields, with sample values, required fields still open and the rows with problems. */
export function ImportMapper(p: ImportMapperProps) {
  const t = useStrings(CRM_STRINGS);
  const { formatNumber } = useFormat();
  const used = new Set(Object.values(p.mapping).filter(Boolean));
  const missing = p.fields.filter((f) => f.required && !used.has(f.id));
  const problems = p.problems || [];
  return (
    <div style={p.style} className={cx("tf-import", p.className)}>
      <div className="tf-import-sum">
        {p.rows != null && <span>{t.importRows(formatNumber(p.rows))}</span>}
        {missing.length > 0 ? (
          <Badge tone="warning" dot>
            {t.importMissing(missing.map((f) => f.label).join(", "))}
          </Badge>
        ) : (
          <Badge tone="success" dot>
            {t.importReady}
          </Badge>
        )}
        {problems.length > 0 && (
          <Badge tone="danger" dot>
            {t.importProblems(problems.length)}
          </Badge>
        )}
      </div>
      <div className="tf-import-scroll">
        <table className="tf-import-table">
          <thead>
            <tr>
              <th scope="col">{t.importColumn}</th>
              <th scope="col">{t.importSamples}</th>
              <th scope="col">{t.importField}</th>
            </tr>
          </thead>
          <tbody>
            {p.columns.map((c) => (
              <tr key={c.name} className={cx(!p.mapping[c.name] && "is-skipped")}>
                <th scope="row">{c.name}</th>
                <td className="tf-import-samples">
                  {c.samples
                    .filter((x) => x.trim())
                    .slice(0, 3)
                    .join(" · ")}
                </td>
                <td>
                  <select
                    className="tf-input tf-import-select"
                    aria-label={`${t.importField}: ${c.name}`}
                    value={p.mapping[c.name] || ""}
                    onChange={(e) => p.onChange?.({ ...p.mapping, [c.name]: e.target.value })}
                  >
                    <option value="">{t.importSkip}</option>
                    {p.fields.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                        {f.required ? " *" : ""}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {problems.length > 0 && (
        <ul className="tf-import-problems">
          {problems.slice(0, 5).map((x) => (
            <li key={x.row + x.message}>{t.importRowProblem(x.row, x.message)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
