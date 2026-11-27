"use client";
/**
 * Calendar: CalendarView (day, week, month and agenda with several calendars, an all-day row, a
 * now line, create by click or drag, event details as a popover or, on phones, a sheet) and
 * EventInvite (an invitation inside a mail: facts, what else is in the calendar then, the reply).
 */
import * as React from "react";
import { Icon } from "../Icon.js";
import { cx } from "../cx.js";
import { useFormat, useStrings, useUI } from "../context.js";
import { CALENDAR_STRINGS } from "../strings.js";
import { useControlled, useId, useOutside, useWidth } from "../hooks.js";
import { Avatar, Badge, Button, IconButton } from "./foundation.js";
import { Segmented } from "./forms.js";
import { Drawer } from "./workspace.js";
import type {
  CalendarDef,
  CalendarEvent,
  CalendarGuest,
  CalendarRsvp,
  CalendarViewMode,
  CalendarViewProps,
  EventInviteProps,
  Tint,
} from "./types.js";

/* ── Dates ── */
const DAY = 86400000;
const toDate = (d: Date | string | number) => (d instanceof Date ? d : new Date(d));
function startOfDay(d: Date) {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function startOfWeek(d: Date, first: number) {
  const s = startOfDay(d);
  return addDays(s, -((s.getDay() - first + 7) % 7));
}
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const minutesOf = (d: Date) => d.getHours() * 60 + d.getMinutes();
const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** The days a view shows, and the range it reports through `onRangeChange`. */
export function calendarRange(
  view: CalendarViewMode,
  date: Date,
  weekStartsOn = 1,
): { start: Date; end: Date } {
  if (view === "day") {
    const start = startOfDay(date);
    return { start, end: addDays(start, 1) };
  }
  if (view === "week") {
    const start = startOfWeek(date, weekStartsOn);
    return { start, end: addDays(start, 7) };
  }
  if (view === "month") {
    const start = startOfWeek(startOfMonth(date), weekStartsOn);
    return { start, end: addDays(start, 42) };
  }
  const start = startOfDay(date);
  return { start, end: addDays(start, 14) };
}

function step(view: CalendarViewMode, date: Date, dir: 1 | -1) {
  if (view === "day") return addDays(date, dir);
  if (view === "week") return addDays(date, 7 * dir);
  if (view === "month") return new Date(date.getFullYear(), date.getMonth() + dir, 1);
  return addDays(date, 14 * dir);
}

interface Placed {
  ev: CalendarEvent;
  start: Date;
  end: Date;
  tint: Tint;
  readOnly: boolean;
  calendar?: CalendarDef;
}

/** Side-by-side lanes for overlapping events of one day. */
function lanes<T extends { s: number; e: number }>(items: T[]) {
  const sorted = [...items].sort((a, b) => a.s - b.s || b.e - a.e);
  const out: { item: T; lane: number; of: number }[] = [];
  let group: { item: T; lane: number }[] = [];
  let groupEnd = -1;
  const flush = () => {
    const of = Math.max(1, ...group.map((g) => g.lane + 1));
    for (const g of group) out.push({ ...g, of });
    group = [];
  };
  for (const item of sorted) {
    if (item.s >= groupEnd) {
      flush();
      groupEnd = -1;
    }
    const used = new Set(group.filter((g) => g.item.e > item.s).map((g) => g.lane));
    let lane = 0;
    while (used.has(lane)) lane++;
    group.push({ item, lane });
    groupEnd = Math.max(groupEnd, item.e);
  }
  flush();
  return out;
}

const isAllDay = (p: Placed) => !!p.ev.allDay || p.end.getTime() - p.start.getTime() >= DAY;
const overlapsDay = (p: Placed, day: Date) => {
  const s = startOfDay(day).getTime();
  return p.start.getTime() < s + DAY && p.end.getTime() > s;
};

/* ── Shared pieces ── */
function useTimeText() {
  const { formatDate } = useFormat();
  const t = useStrings(CALENDAR_STRINGS);
  const time = (d: Date) => formatDate(d, { hour: "numeric", minute: "2-digit" });
  const day = (d: Date) => formatDate(d, { weekday: "short", day: "numeric", month: "short" });
  return {
    time,
    hour: (d: Date) => formatDate(d, { hour: "numeric" }),
    span: (start: Date, end: Date, allDay?: boolean) => {
      if (allDay || end.getTime() - start.getTime() >= DAY) {
        const last = new Date(end.getTime() - 1);
        return sameDay(start, last)
          ? `${day(start)} · ${t.calAllDay}`
          : `${day(start)} – ${day(last)}`;
      }
      return sameDay(start, end)
        ? `${day(start)} · ${time(start)} – ${time(end)}`
        : `${day(start)} ${time(start)} – ${day(end)} ${time(end)}`;
    },
  };
}

const RSVP_TONE: Record<CalendarRsvp, "success" | "danger" | "warning" | "neutral"> = {
  accepted: "success",
  declined: "danger",
  tentative: "warning",
  open: "neutral",
};

function useRsvpWord() {
  const t = useStrings(CALENDAR_STRINGS);
  return (r: CalendarRsvp) =>
    r === "accepted"
      ? t.calAccepted
      : r === "declined"
        ? t.calDeclined
        : r === "tentative"
          ? t.calTentative
          : t.calAwaiting;
}

function Guests({ guests }: { guests: CalendarGuest[] }) {
  const t = useStrings(CALENDAR_STRINGS);
  const word = useRsvpWord();
  const accepted = guests.filter((g) => g.status === "accepted").length;
  return (
    <div className="tf-calv-guests">
      <span className="tf-calv-label">{t.calGuestSummary(guests.length, accepted)}</span>
      <ul>
        {guests.map((g) => (
          <li key={g.email || g.name}>
            <Avatar name={g.name} size={28} />
            <span className="tf-option-text">
              <b>{g.name}</b>
              {(g.organizer || g.email) && <small>{g.organizer ? t.calOrganizer : g.email}</small>}
            </span>
            <Badge tone={RSVP_TONE[g.status || "open"]}>{word(g.status || "open")}</Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RsvpPicker(p: {
  value?: CalendarRsvp;
  onChange: (r: CalendarRsvp) => void;
  label: string;
}) {
  const t = useStrings(CALENDAR_STRINGS);
  return (
    <div className="tf-calv-rsvp">
      <span className="tf-calv-label">{p.label}</span>
      <Segmented
        size="sm"
        label={p.label}
        value={p.value && p.value !== "open" ? p.value : ""}
        onChange={(v) => p.onChange(v as CalendarRsvp)}
        options={[
          { value: "accepted", label: t.calYes },
          { value: "tentative", label: t.calMaybe },
          { value: "declined", label: t.calNo },
        ]}
      />
    </div>
  );
}

function EventDetails(p: { item: Placed; props: CalendarViewProps }) {
  const t = useStrings(CALENDAR_STRINGS);
  const tt = useTimeText();
  const { ev, calendar, readOnly } = p.item;
  return (
    <div className="tf-calv-details">
      <div className="tf-calv-fact">
        <Icon name="clock" size={16} />
        <span>{tt.span(p.item.start, p.item.end, ev.allDay)}</span>
      </div>
      {ev.location && (
        <div className="tf-calv-fact">
          <Icon name="pin" size={16} />
          <span>{ev.location}</span>
        </div>
      )}
      {calendar && (
        <div className="tf-calv-fact">
          <span className={cx("tf-calv-dot", "tf-bg-" + p.item.tint)} aria-hidden="true" />
          <span>
            {calendar.label}
            {readOnly && <small className="tf-calv-muted">{" · " + t.calReadOnly}</small>}
          </span>
        </div>
      )}
      {ev.cancelled && <Badge tone="danger">{t.calCancelled}</Badge>}
      {ev.description && <div className="tf-calv-desc">{ev.description}</div>}
      {ev.guests && ev.guests.length > 0 && <Guests guests={ev.guests} />}
      {p.props.onRsvp && ev.rsvp !== undefined && !readOnly && !ev.cancelled && (
        <RsvpPicker label={t.calGoing} value={ev.rsvp} onChange={(r) => p.props.onRsvp?.(ev, r)} />
      )}
      {p.props.eventActions && <div className="tf-calv-actions">{p.props.eventActions(ev)}</div>}
    </div>
  );
}

function EventChip(p: {
  item: Placed;
  sub?: string;
  open: (id: string, el: HTMLElement) => void;
  selected: boolean;
  className?: string;
  style?: React.CSSProperties;
  label: string;
}) {
  const { ev } = p.item;
  return (
    <button
      type="button"
      data-event={ev.id}
      className={cx(
        "tf-calv-ev",
        "tf-bg-" + p.item.tint,
        (ev.cancelled || ev.rsvp === "declined") && "faded",
        ev.rsvp === "tentative" && "tentative",
        p.selected && "on",
        p.className,
      )}
      style={p.style}
      aria-haspopup="dialog"
      aria-expanded={p.selected}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => p.open(ev.id, e.currentTarget)}
    >
      <b>{ev.title}</b>
      {p.sub && <span aria-hidden="true">{p.sub}</span>}
      <span className="tf-sr-only">{p.label.slice(ev.title.length)}</span>
    </button>
  );
}

/* ── CalendarView ── */
const SNAP = 15;

export function CalendarView(p: CalendarViewProps) {
  const t = useStrings(CALENDAR_STRINGS);
  const { formatDate } = useFormat();
  const { locale } = useUI();
  const tt = useTimeText();
  const uid = useId("calv");
  const first = p.weekStartsOn ?? 1;
  const [view, setView] = useControlled<CalendarViewMode>(
    p.view,
    p.defaultView || "week",
    p.onViewChange,
  );
  const [rawDate, setDate] = useControlled<Date>(
    p.date,
    p.defaultDate || (p.now !== undefined ? toDate(p.now) : new Date()),
    p.onDateChange,
  );
  const date = toDate(rawDate);
  const [hidden, setHidden] = useControlled<string[]>(
    p.hidden,
    p.defaultHidden || [],
    p.onHiddenChange,
  );
  const [selected, setSelected] = useControlled<string | null>(
    p.selected,
    p.defaultSelected ?? null,
    p.onSelectedChange,
  );
  const [ref, width] = useWidth<HTMLDivElement>(undefined, 1024);
  const compact = width < 640;
  const shown: CalendarViewMode =
    compact && (view === "week" || view === "month") ? "agenda" : view;
  const range = calendarRange(view, date, first);
  // a week or month on a phone shows its days as a list
  const listRange = shown === "agenda" ? range : calendarRange("agenda", date, first);

  // now, ticking each minute unless fixed
  const [tick, setTick] = React.useState(() => (p.now !== undefined ? toDate(p.now) : new Date()));
  React.useEffect(() => {
    if (p.now !== undefined) {
      setTick(toDate(p.now));
      return;
    }
    const id = setInterval(() => setTick(new Date()), 60000);
    return () => clearInterval(id);
  }, [p.now]);
  const now = tick;

  // report the visible range
  const startKey = range.start.getTime(),
    endKey = range.end.getTime();
  const onRange = React.useRef(p.onRangeChange);
  onRange.current = p.onRangeChange;
  React.useEffect(() => {
    onRange.current?.({ start: new Date(startKey), end: new Date(endKey), view });
  }, [startKey, endKey, view]);

  const cals = p.calendars || [];
  const calById = new Map(cals.map((c) => [c.id, c]));
  const placed: Placed[] = (p.events || [])
    .filter((ev) => !ev.calendar || !hidden.includes(ev.calendar))
    .map((ev) => {
      const calendar = ev.calendar ? calById.get(ev.calendar) : undefined;
      return {
        ev,
        start: toDate(ev.start),
        end: toDate(ev.end),
        tint: ev.tint || calendar?.tint || "sky",
        readOnly: !!calendar?.readOnly || !!ev.readOnly,
        calendar,
      };
    });

  // details: a popover next to the event (desktop) or a sheet (phone)
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const detailRef = React.useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = React.useState<{ x: number; y: number; left: boolean } | null>(null);
  const openItem = selected ? placed.find((x) => x.ev.id === selected) : undefined;
  const close = React.useCallback(() => {
    const id = selected;
    setSelected(null);
    setAnchor(null);
    if (id)
      requestAnimationFrame(() =>
        rootRef.current
          ?.querySelector<HTMLElement>(`[data-event="${id.replace(/["\\]/g, "\\$&")}"]`)
          ?.focus(),
      );
  }, [selected, setSelected]);
  useOutside(detailRef, !!openItem && !compact, close);
  React.useEffect(() => {
    if (openItem && !compact) detailRef.current?.querySelector<HTMLElement>("button")?.focus();
  }, [openItem, compact]);
  const open = (id: string, el: HTMLElement) => {
    const root = rootRef.current;
    if (root) {
      const r = el.getBoundingClientRect(),
        rr = root.getBoundingClientRect();
      const roomRight = rr.right - r.right;
      setAnchor({
        x: roomRight > 340 ? r.right - rr.left + 8 : Math.max(0, r.left - rr.left - 328),
        y: Math.max(0, r.top - rr.top),
        left: roomRight <= 340,
      });
    }
    if (selected === id) close();
    else {
      setSelected(id);
      const ev = placed.find((x) => x.ev.id === id)?.ev;
      if (ev) p.onOpenEvent?.(ev);
    }
  };

  const eventLabel = (x: Placed) =>
    [x.ev.title, tt.span(x.start, x.end, x.ev.allDay), x.ev.location].filter(Boolean).join(", ");

  /* toolbar */
  const title =
    p.title ??
    (view === "day"
      ? formatDate(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      : view === "month"
        ? formatDate(date, { month: "long", year: "numeric" })
        : new Intl.DateTimeFormat(locale, {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).formatRange(range.start, new Date(range.end.getTime() - 1)));
  const allViews = p.views || (["day", "week", "month", "agenda"] as CalendarViewMode[]);
  const viewWord = (v: CalendarViewMode) =>
    v === "day" ? t.calDay : v === "week" ? t.calWeek : v === "month" ? t.calMonth : t.calAgenda;
  const viewOptions = (
    compact ? allViews.filter((v) => v === "day" || v === "agenda") : allViews
  ).map((v) => ({ value: v, label: viewWord(v) }));

  /* time grid (day and week) */
  const days =
    shown === "day"
      ? [startOfDay(date)]
      : shown === "week"
        ? Array.from({ length: 7 }, (_, i) => addDays(range.start, i))
        : [];
  const timed = (day: Date) =>
    placed
      .filter((x) => !isAllDay(x) && overlapsDay(x, day))
      .map((x) => {
        const s0 = startOfDay(day).getTime();
        const s = Math.max(0, (x.start.getTime() - s0) / 60000);
        const e = Math.min(1440, (x.end.getTime() - s0) / 60000);
        return { x, s, e };
      });
  let [h0, h1] = p.hours || [7, 21];
  for (const d of days)
    for (const it of timed(d)) {
      h0 = Math.min(h0, Math.floor(it.s / 60));
      h1 = Math.max(h1, Math.ceil(it.e / 60));
    }
  const hourList = Array.from({ length: h1 - h0 }, (_, i) => h0 + i);
  const canCreate = !!p.onCreate;
  const [focus, setFocus] = React.useState<{ day: number; hour: number }>({ day: 0, hour: 9 });
  const [draft, setDraft] = React.useState<{ day: number; a: number; b: number } | null>(null);
  const drag = React.useRef<{ day: number; a: number; moved: boolean; col: HTMLElement } | null>(
    null,
  );
  const minAt = (col: HTMLElement, y: number) => {
    const r = col.getBoundingClientRect();
    const m = h0 * 60 + ((y - r.top) / r.height) * (h1 - h0) * 60;
    return Math.max(h0 * 60, Math.min(h1 * 60, Math.round(m / SNAP) * SNAP));
  };
  const createAt = (day: Date, a: number, b: number) => {
    const s = startOfDay(day);
    p.onCreate?.({
      start: new Date(s.getTime() + a * 60000),
      end: new Date(s.getTime() + b * 60000),
      allDay: false,
    });
  };
  const slotKey = (e: React.KeyboardEvent<HTMLButtonElement>, di: number, hr: number) => {
    let d = di,
      h = hr;
    if (e.key === "ArrowUp") h--;
    else if (e.key === "ArrowDown") h++;
    else if (e.key === "ArrowLeft") d--;
    else if (e.key === "ArrowRight") d++;
    else if (e.key === "Home") h = h0;
    else if (e.key === "End") h = h1 - 1;
    else return;
    e.preventDefault();
    if (d < 0 || d >= days.length) {
      // past the first or last day: move the view
      setDate(step(shown === "day" ? "day" : "week", date, d < 0 ? -1 : 1));
      d = d < 0 ? days.length - 1 : 0;
    }
    h = Math.max(h0, Math.min(h1 - 1, h));
    setFocus({ day: d, hour: h });
    requestAnimationFrame(() =>
      rootRef.current?.querySelector<HTMLElement>(`[data-slot="${d}-${h}"]`)?.focus(),
    );
  };
  const focusDay = Math.min(focus.day, Math.max(0, days.length - 1));
  const focusHour = Math.max(h0, Math.min(h1 - 1, focus.hour));

  const grid = days.length > 0 && (
    <div
      className="tf-calv-grid"
      style={{ "--days": days.length, "--hours": h1 - h0 } as React.CSSProperties}
      role="group"
      aria-label={title}
    >
      <div className="tf-calv-head">
        <span />
        {days.map((d) => {
          const today = sameDay(d, now);
          return (
            <button
              key={dayKey(d)}
              type="button"
              className={cx("tf-calv-dayhead", today && "today")}
              aria-current={today ? "date" : undefined}
              onClick={() => {
                setDate(d);
                setView("day");
              }}
            >
              <small aria-hidden="true">{formatDate(d, { weekday: "short" })}</small>
              <b aria-hidden="true">{d.getDate()}</b>
              <span className="tf-sr-only">
                {formatDate(d, { weekday: "long", day: "numeric", month: "long" })}
              </span>
            </button>
          );
        })}
      </div>
      <div className="tf-calv-allday">
        <span className="tf-calv-label">{t.calAllDay}</span>
        {days.map((d) => (
          <div key={dayKey(d)} className="tf-calv-allday-cell">
            {placed
              .filter((x) => isAllDay(x) && overlapsDay(x, d))
              .map((x) => (
                <EventChip
                  key={x.ev.id}
                  item={x}
                  label={eventLabel(x)}
                  open={open}
                  selected={selected === x.ev.id}
                />
              ))}
          </div>
        ))}
      </div>
      <div className="tf-calv-body">
        <div className="tf-calv-times" aria-hidden="true">
          {hourList.map((h) => (
            <span key={h}>{tt.hour(new Date(2000, 0, 1, h))}</span>
          ))}
        </div>
        {days.map((d, di) => {
          const today = sameDay(d, now);
          const nowMin = minutesOf(now);
          return (
            <div
              key={dayKey(d)}
              className={cx("tf-calv-col", today && "today", canCreate && "can-create")}
              onPointerDown={(e) => {
                if (!canCreate || e.button !== 0) return;
                const col = e.currentTarget;
                const a = minAt(col, e.clientY);
                drag.current = { day: di, a, moved: false, col };
                col.setPointerCapture?.(e.pointerId);
              }}
              onPointerMove={(e) => {
                const g = drag.current;
                if (!g) return;
                const b = minAt(g.col, e.clientY);
                if (b !== g.a) g.moved = true;
                if (g.moved) setDraft({ day: g.day, a: Math.min(g.a, b), b: Math.max(g.a, b) });
              }}
              onPointerUp={(e) => {
                const g = drag.current;
                drag.current = null;
                setDraft(null);
                if (!g) return;
                const b = minAt(g.col, e.clientY);
                if (g.moved && b !== g.a) createAt(d, Math.min(g.a, b), Math.max(g.a, b));
                else {
                  const a = Math.floor(g.a / 30) * 30;
                  createAt(d, a, Math.min(1440, a + 60));
                }
              }}
              onPointerCancel={() => {
                drag.current = null;
                setDraft(null);
              }}
            >
              {canCreate &&
                hourList.map((h) => (
                  <button
                    key={h}
                    type="button"
                    data-slot={`${di}-${h}`}
                    className="tf-calv-slot"
                    style={{ "--y": (h - h0) * 60 } as React.CSSProperties}
                    tabIndex={di === focusDay && h === focusHour ? 0 : -1}
                    aria-label={t.calNewEventAt(
                      `${formatDate(d, { weekday: "long", day: "numeric", month: "long" })}, ${tt.time(new Date(2000, 0, 1, h))}`,
                    )}
                    onFocus={() => setFocus({ day: di, hour: h })}
                    onKeyDown={(e) => slotKey(e, di, h)}
                    onClick={(e) => {
                      // pointer clicks are handled on pointer up; this is Enter or Space
                      if (e.detail === 0) createAt(d, h * 60, h * 60 + 60);
                    }}
                  />
                ))}
              {lanes(timed(d)).map(({ item, lane, of }) => (
                <EventChip
                  key={item.x.ev.id}
                  item={item.x}
                  label={eventLabel(item.x)}
                  sub={
                    item.e - item.s >= 45
                      ? [tt.time(item.x.start), item.x.ev.location].filter(Boolean).join(" · ")
                      : undefined
                  }
                  open={open}
                  selected={selected === item.x.ev.id}
                  className="timed"
                  style={
                    {
                      "--y": item.s - h0 * 60,
                      "--len": Math.max(item.e - item.s, 20),
                      "--lane": lane,
                      "--lanes": of,
                    } as React.CSSProperties
                  }
                />
              ))}
              {draft && draft.day === di && (
                <div
                  className="tf-calv-draft"
                  aria-hidden="true"
                  style={
                    { "--y": draft.a - h0 * 60, "--len": draft.b - draft.a } as React.CSSProperties
                  }
                >
                  {tt.time(new Date(startOfDay(d).getTime() + draft.a * 60000))} –{" "}
                  {tt.time(new Date(startOfDay(d).getTime() + draft.b * 60000))}
                </div>
              )}
              {today && nowMin >= h0 * 60 && nowMin <= h1 * 60 && (
                <i
                  className="tf-calv-now"
                  aria-hidden="true"
                  style={{ "--y": nowMin - h0 * 60 } as React.CSSProperties}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  /* month */
  const [focusKey, setFocusKey] = React.useState<string | null>(null);
  const monthDays =
    shown === "month" ? Array.from({ length: 42 }, (_, i) => addDays(range.start, i)) : [];
  const max = p.maxPerDay ?? 3;
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    formatDate(addDays(startOfWeek(now, first), i), { weekday: "short" }),
  );
  const monthKey = (e: React.KeyboardEvent<HTMLButtonElement>, d: Date) => {
    const move: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    const n = move[e.key];
    if (n === undefined) return;
    e.preventDefault();
    const next = addDays(d, n);
    setFocusKey(dayKey(next));
    if (next.getMonth() !== date.getMonth())
      setDate(new Date(next.getFullYear(), next.getMonth(), 1));
    requestAnimationFrame(() =>
      rootRef.current?.querySelector<HTMLElement>(`[data-day="${dayKey(next)}"]`)?.focus(),
    );
  };
  const tabDay = monthDays.some((d) => dayKey(d) === focusKey)
    ? focusKey
    : dayKey(
        monthDays.find((d) => sameDay(d, now) && d.getMonth() === date.getMonth()) ||
          startOfMonth(date),
      );
  const month = monthDays.length > 0 && (
    <div className="tf-calv-month" role="group" aria-label={title}>
      {weekdays.map((w, i) => (
        <span key={i} className="tf-calv-wd" aria-hidden="true">
          {w}
        </span>
      ))}
      {monthDays.map((d) => {
        const items = placed
          .filter((x) => overlapsDay(x, d))
          .sort(
            (a, b) =>
              Number(isAllDay(b)) - Number(isAllDay(a)) || a.start.getTime() - b.start.getTime(),
          );
        const today = sameDay(d, now);
        return (
          <div
            key={dayKey(d)}
            className={cx(
              "tf-calv-mday",
              d.getMonth() !== date.getMonth() && "out",
              today && "today",
            )}
          >
            <button
              type="button"
              className="tf-calv-mnum"
              data-day={dayKey(d)}
              tabIndex={dayKey(d) === tabDay ? 0 : -1}
              aria-current={today ? "date" : undefined}
              onKeyDown={(e) => monthKey(e, d)}
              onFocus={() => setFocusKey(dayKey(d))}
              onClick={() => {
                setDate(d);
                setView("day");
              }}
            >
              <span aria-hidden="true">{d.getDate()}</span>
              <span className="tf-sr-only">
                {formatDate(d, { weekday: "long", day: "numeric", month: "long" })}
              </span>
            </button>
            {items.slice(0, max).map((x) => (
              <EventChip
                key={x.ev.id}
                item={x}
                label={eventLabel(x)}
                open={open}
                selected={selected === x.ev.id}
                className={isAllDay(x) ? undefined : "dot"}
                sub={isAllDay(x) ? undefined : tt.time(x.start)}
              />
            ))}
            {items.length > max && (
              <button
                type="button"
                className="tf-calv-more"
                onClick={() => {
                  setDate(d);
                  setView("day");
                }}
              >
                {t.calMore(items.length - max)}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );

  /* agenda */
  const agendaDays: Date[] = [];
  if (shown === "agenda")
    for (let d = new Date(listRange.start); d < listRange.end; d = addDays(d, 1))
      agendaDays.push(d);
  const filled = agendaDays
    .map((d) => ({
      d,
      items: placed
        .filter((x) => overlapsDay(x, d))
        .sort(
          (a, b) =>
            Number(isAllDay(b)) - Number(isAllDay(a)) || a.start.getTime() - b.start.getTime(),
        ),
    }))
    .filter((g) => g.items.length > 0);
  const agenda = shown === "agenda" && (
    <div className="tf-calv-agenda" role="list" aria-label={title}>
      {filled.length === 0 && <p className="tf-calv-empty">{t.calNothingPlanned}</p>}
      {filled.map(({ d, items }) => {
        const today = sameDay(d, now);
        return (
          <section key={dayKey(d)} role="listitem" className={cx("tf-calv-aday", today && "today")}>
            <h3 aria-current={today ? "date" : undefined}>
              {today && <b>{t.calToday}</b>}
              {formatDate(d, { weekday: "long", day: "numeric", month: "long" })}
            </h3>
            {items.map((x) => (
              <div key={x.ev.id} className="tf-calv-arow">
                <span className="tf-calv-atime">
                  {isAllDay(x) ? (
                    t.calAllDay
                  ) : (
                    <>
                      <span>{tt.time(x.start)}</span>
                      <span>{"– " + tt.time(x.end)}</span>
                    </>
                  )}
                </span>
                <EventChip
                  item={x}
                  label={eventLabel(x)}
                  sub={x.ev.location}
                  open={open}
                  selected={selected === x.ev.id}
                />
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );

  return (
    <div
      ref={(el) => {
        rootRef.current = el;
        ref.current = el;
      }}
      className={cx("tf-calv", compact && "compact", p.className)}
      style={p.style}
    >
      <div className="tf-calv-bar">
        <div className="tf-calv-nav">
          <Button size="sm" variant="secondary" onClick={() => setDate(startOfDay(now))}>
            {t.calToday}
          </Button>
          <IconButton
            icon="chevronLeft"
            size="sm"
            variant="ghost"
            label={t.calPrevious}
            onClick={() => setDate(step(view, date, -1))}
          />
          <IconButton
            icon="chevronRight"
            size="sm"
            variant="ghost"
            label={t.calNext}
            onClick={() => setDate(step(view, date, 1))}
          />
          <h2 className="tf-calv-title" id={uid + "-title"} aria-live="polite">
            {title}
          </h2>
        </div>
        <div className="tf-calv-tools">
          {viewOptions.length > 1 && (
            <Segmented
              size="sm"
              label={t.calViews}
              value={shown}
              onChange={(v) => setView(v as CalendarViewMode)}
              options={viewOptions}
            />
          )}
          {p.toolbar}
        </div>
      </div>
      {cals.length > 0 && (
        <div className="tf-calv-cals" role="group" aria-label={t.calCalendars}>
          {cals.map((c) => {
            const on = !hidden.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                className="tf-calv-cal"
                aria-pressed={on}
                onClick={() =>
                  setHidden(on ? hidden.concat([c.id]) : hidden.filter((x) => x !== c.id))
                }
              >
                <span
                  className={cx("tf-calv-dot", "tf-bg-" + (c.tint || "sky"))}
                  aria-hidden="true"
                />
                {c.label}
                {c.readOnly && <Icon name="lock" size={12} label={t.calReadOnly} />}
              </button>
            );
          })}
        </div>
      )}
      {grid}
      {month}
      {agenda}
      {openItem && !compact && anchor && (
        <div
          ref={detailRef}
          className={cx("tf-popover", "tf-calv-pop", anchor.left && "left")}
          style={{ "--x": anchor.x, "--y": anchor.y } as React.CSSProperties}
          role="dialog"
          aria-label={openItem.ev.title}
        >
          <div className="tf-calv-pop-head">
            <span className={cx("tf-calv-dot", "tf-bg-" + openItem.tint)} aria-hidden="true" />
            <b className={cx(openItem.ev.cancelled && "tf-struck")}>{openItem.ev.title}</b>
            <IconButton icon="x" size="sm" variant="ghost" label={t.close} onClick={close} />
          </div>
          <EventDetails item={openItem} props={p} />
        </div>
      )}
      {openItem && compact && (
        <Drawer side="bottom" title={openItem.ev.title} onClose={close}>
          <EventDetails item={openItem} props={p} />
        </Drawer>
      )}
    </div>
  );
}

/* ── EventInvite ── */
export function EventInvite(p: EventInviteProps) {
  const t = useStrings(CALENDAR_STRINGS);
  const { formatDate } = useFormat();
  const tt = useTimeText();
  const start = toDate(p.start),
    end = toDate(p.end);
  const [response, setResponse] = useControlled<CalendarRsvp | null>(
    p.response,
    p.defaultResponse ?? null,
    p.onRespond as ((r: CalendarRsvp | null) => void) | undefined,
  );
  const cancelled = p.status === "cancelled";
  const word = useRsvpWord();
  const answer = (r: CalendarRsvp) => (
    <Button
      size="sm"
      variant={response === r ? "primary" : "secondary"}
      aria-pressed={response === r}
      disabled={p.busy}
      icon={r === "accepted" ? "check" : r === "declined" ? "x" : "help"}
      onClick={() => setResponse(r)}
    >
      {r === "accepted" ? t.calAccept : r === "declined" ? t.calDecline : t.calMaybe}
    </Button>
  );
  return (
    <div
      className={cx("tf-card", "tf-invite", cancelled && "cancelled", p.className)}
      style={p.style}
      role="group"
      aria-label={t.calInvitation(p.title)}
    >
      <div className="tf-invite-date" aria-hidden="true">
        <small>{formatDate(start, { month: "short" })}</small>
        <b>{start.getDate()}</b>
        <small>{formatDate(start, { weekday: "short" })}</small>
      </div>
      <div className="tf-invite-main">
        <div className="tf-invite-head">
          <span className="tf-calv-label">{t.calInvitationLabel}</span>
          {p.status === "updated" && <Badge tone="warning">{t.calUpdated}</Badge>}
          {cancelled && <Badge tone="danger">{t.calCancelled}</Badge>}
        </div>
        <h3 className={cx("tf-invite-title", cancelled && "tf-struck")}>{p.title}</h3>
        {p.status === "updated" && (
          <p className="tf-invite-note">{p.changes || t.calUpdatedNote}</p>
        )}
        {cancelled && <p className="tf-invite-note">{t.calCancelledNote}</p>}
        <div className="tf-calv-fact">
          <Icon name="clock" size={16} />
          <span>{tt.span(start, end, p.allDay)}</span>
        </div>
        {p.location && (
          <div className="tf-calv-fact">
            <Icon name="pin" size={16} />
            <span>{p.location}</span>
          </div>
        )}
        {p.organizer && (
          <div className="tf-calv-fact">
            <Icon name="user" size={16} />
            <span>
              {p.organizer.name}
              {p.organizer.email && (
                <small className="tf-calv-muted tf-mono">{" " + p.organizer.email}</small>
              )}
              <small className="tf-calv-muted">{" · " + t.calOrganizer}</small>
            </span>
          </div>
        )}
        {p.guests !== undefined && (
          <div className="tf-calv-fact">
            <Icon name="users" size={16} />
            <span>{t.calGuestCount(p.guests)}</span>
          </div>
        )}
        {p.others !== undefined && !cancelled && (
          <div className="tf-invite-others">
            <span className="tf-calv-label">{p.others.length ? t.calAlsoThen : t.calFreeThen}</span>
            {p.others.map((o, i) => (
              <div key={i} className="tf-invite-other">
                <span
                  className={cx("tf-calv-dot", "tf-bg-" + (o.tint || "sky"))}
                  aria-hidden="true"
                />
                <span className="tf-calv-atime">
                  {o.allDay
                    ? t.calAllDay
                    : `${tt.time(toDate(o.start))} – ${tt.time(toDate(o.end))}`}
                </span>
                <span className="tf-invite-other-title">{o.title}</span>
              </div>
            ))}
          </div>
        )}
        {!cancelled &&
          (p.onRespond || p.response !== undefined || p.defaultResponse !== undefined) && (
            <div className="tf-invite-actions" role="group" aria-label={t.calGoing}>
              {answer("accepted")}
              {answer("tentative")}
              {answer("declined")}
            </div>
          )}
        {response && !cancelled && (
          <p className="tf-invite-note" aria-live="polite">
            {t.calYouReplied(word(response))}
          </p>
        )}
        {(p.onAddToCalendar || p.onRemove) && (
          <div className="tf-invite-actions">
            {cancelled
              ? p.onRemove &&
                p.added && (
                  <Button size="sm" variant="secondary" icon="trash" onClick={p.onRemove}>
                    {t.calRemoveFromCalendar}
                  </Button>
                )
              : p.onAddToCalendar &&
                (p.added ? (
                  <span className="tf-invite-added">
                    <Icon name="check" size={14} />
                    {t.calInYourCalendar}
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    icon="calendar"
                    disabled={p.busy}
                    onClick={p.onAddToCalendar}
                  >
                    {t.calAddToCalendar}
                  </Button>
                ))}
          </div>
        )}
      </div>
    </div>
  );
}
