"use client";

import * as React from "react";
import { cx, durationToken, reduced } from "../cx.js";
import { Icon } from "../Icon.js";
import { useMounted, useScrollFocus } from "../hooks.js";
import { Avatar, IconButton, TintIcon } from "./foundation.js";
import { Breadcrumb } from "./navigation.js";
import type {
  CardProps,
  CountUpProps,
  EventCardProps,
  FileRowProps,
  IconName,
  KanbanColumnProps,
  ListRowProps,
  PageHeaderProps,
  PanelProps,
  ProgressProps,
  ProgressRingProps,
  StaggerProps,
  StatTileProps,
  TableProps,
  TimelineProps,
  Tint,
} from "./types.js";

/* ── Data ── */
interface ParsedNumber {
  pre: string;
  num: number;
  dec: number;
  comma: boolean;
  post: string;
}
function parseNum(v: string | number): ParsedNumber | null {
  const m = /^([^0-9-]*)(-?[0-9][0-9,]*\.?[0-9]*)(.*)$/.exec(String(v));
  if (!m) return null;
  const raw = (m[2] as string).replace(/,/g, ""),
    dec = (raw.split(".")[1] || "").length;
  return {
    pre: m[1] ?? "",
    num: parseFloat(raw),
    dec: dec,
    comma: (m[2] as string).indexOf(",") > -1,
    post: m[3] ?? "",
  };
}
export function fmt(n: number, o: ParsedNumber) {
  let s = n.toFixed(o.dec);
  if (o.comma) {
    const parts = s.split(".");
    parts[0] = (parts[0] as string).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    s = parts.join(".");
  }
  return o.pre + s + o.post;
}
export function CountUp(p: CountUpProps) {
  const o = parseNum(p.value),
    st = React.useState(o ? fmt(0, o) : String(p.value)),
    last = React.useRef(0),
    first = React.useRef(true);
  React.useEffect(() => {
    if (!o || reduced()) {
      st[1](String(p.value));
      return;
    }
    const slow = durationToken("--dur-slow", 900);
    const from = last.current;
    let start: number | null = null,
      raf = 0;
    const dur = first.current ? p.duration || slow : slow / 2,
      delay = first.current ? p.delay || 0 : 0;
    first.current = false;
    const target = o;
    function tick(t: number) {
      if (start === null) start = t;
      const k = Math.min(1, Math.max(0, (t - start - delay) / dur));
      const e = 1 - Math.pow(1 - k, 3),
        v = from + (target.num - from) * e;
      last.current = v;
      st[1](fmt(v, target));
      if (k < 1) raf = requestAnimationFrame(tick);
      else last.current = target.num;
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [p.value]);
  return <span className={p.className}>{st[0]}</span>;
}
export function StatTile(p: StatTileProps) {
  const tint = p.tint || "sky";
  return (
    <div
      className={cx(
        "tf-stat",
        tint === "placeholder" ? "tf-stat-placeholder" : "tf-bg-" + tint,
        p.className,
      )}
    >
      {typeof p.value === "string" || typeof p.value === "number" ? (
        <CountUp className="tf-stat-value" value={p.value} delay={p.delay || 120} />
      ) : (
        <span className="tf-stat-value">{p.value}</span>
      )}
      <span className="tf-stat-label">{p.label}</span>
      {p.delta && <span className="tf-stat-delta">{p.delta}</span>}
    </div>
  );
}
export function Card(p: CardProps) {
  const tint = p.tint && p.tint !== "surface" ? "tf-bg-" + p.tint : null;
  return (
    <article
      className={cx("tf-card", tint, p.onClick && "tf-card-interactive", p.className)}
      style={p.style}
      tabIndex={p.onClick ? 0 : undefined}
      onClick={p.onClick}
    >
      {p.corner && <span className="tf-card-corner">{p.corner}</span>}
      {p.eyebrow && <span className="tf-card-meta">{p.eyebrow}</span>}
      {p.title && <h3 className="tf-card-title">{p.title}</h3>}
      {p.description && <p className="tf-card-desc">{p.description}</p>}
      {p.meta && (
        <div className="tf-card-meta">
          {p.meta.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      )}
      {p.children}
      {(p.status || p.actions) && (
        <div className="tf-card-foot">
          {p.status || <span />}
          {p.actions && <div className="tf-row">{p.actions}</div>}
        </div>
      )}
    </article>
  );
}
const KIND: Record<string, [IconName, Tint]> = {
  meeting: ["users", "sky"],
  deadline: ["clock", "butter"],
  review: ["eye", "lilac"],
  launch: ["sparkle", "mint"],
  incident: ["bell", "blush"],
};
export function EventCard(p: EventCardProps) {
  const k = KIND[p.kind || "meeting"] || (KIND.meeting as [IconName, Tint]),
    tint = p.tint || k[1];
  return (
    <div className={cx("tf-event", "tf-bg-" + tint, p.className)}>
      <div className="tf-event-head">
        <span className="tf-event-kind">
          <Icon name={p.icon || k[0]} size={14} />
          {p.label}
        </span>
        <span className="tf-event-date">{p.date}</span>
      </div>
      <p className="tf-event-body">{p.children}</p>
      <div className="tf-event-bar">
        <span className="tf-row">
          <Icon name="clock" size={14} /> {p.time}
        </span>
        {p.actions !== false && (
          <span className="tf-row">
            <IconButton icon="eye" label="Open" size="sm" variant="outline" />
            <IconButton icon="edit" label="Edit" size="sm" variant="outline" />
            <IconButton icon="trash" label="Remove" size="sm" variant="outline" />
          </span>
        )}
      </div>
    </div>
  );
}
export function Panel(p: PanelProps) {
  return (
    <section className={cx("tf-panel", p.side && "tf-side", p.className)} style={p.style}>
      {(p.title || p.action) && (
        <div className="tf-header">
          <div>
            <h2 className="tf-panel-title">{p.title}</h2>
            {p.subtitle && <p className="tf-panel-sub">{p.subtitle}</p>}
          </div>
          {p.action}
        </div>
      )}
      {p.children}
    </section>
  );
}
export function PageHeader(p: PageHeaderProps) {
  return (
    <header className="tf-header">
      <div>
        {p.crumbs && (
          <div
            style={{
              marginBottom: 8,
            }}
          >
            <Breadcrumb items={p.crumbs} />
          </div>
        )}
        <h1 className="tf-header-title">{p.title}</h1>
        {p.subtitle && <p className="tf-header-sub">{p.subtitle}</p>}
      </div>
      {p.actions && <div className="tf-row">{p.actions}</div>}
    </header>
  );
}
export function Stagger(p: StaggerProps) {
  const st: Record<string, unknown> = { ...p.style };
  if (p.delay) st["--base"] = p.delay + "ms";
  return React.createElement(
    p.as || "div",
    {
      className: cx("tf-stagger", p.className),
      style: st,
    },
    p.children,
  );
}
export function Table(p: TableProps) {
  const cols = p.columns || [];
  const box = React.useRef<HTMLDivElement>(null);
  useScrollFocus(box);
  return (
    <div ref={box} className="tf-table-scroll">
      <table className="tf-table">
        <thead>
          <tr>
            {cols.map((c) => (
              <th
                key={c.key}
                className={c.align === "right" ? "tf-num" : undefined}
                style={
                  c.width
                    ? {
                        width: c.width,
                      }
                    : undefined
                }
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={p.animate === false ? undefined : "tf-stagger"}
          style={
            {
              "--base": "180ms",
            } as React.CSSProperties
          }
        >
          {(p.rows || []).map((r, i) => (
            <tr key={i}>
              {cols.map((c) => (
                <td key={c.key} className={c.align === "right" ? "tf-num" : undefined}>
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function ListRow(p: ListRowProps) {
  return (
    <button
      type="button"
      className="tf-row-item"
      aria-current={p.active ? "true" : undefined}
      onClick={p.onClick}
    >
      {p.leading ||
        (p.avatar ? (
          <Avatar name={p.avatar} size={36} />
        ) : (
          <TintIcon icon={p.icon || "mail"} tint={p.tint || "plain"} size={36} />
        ))}
      <span
        style={{
          minWidth: 0,
        }}
      >
        <span className="tf-row-title">
          {p.unread && <span className="tf-unread" role="img" aria-label="Unread" />}
          {p.title}
        </span>
        {p.subtitle && (
          <span
            className="tf-row-sub"
            style={{
              display: "block",
            }}
          >
            {p.subtitle}
          </span>
        )}
      </span>
      <span className="tf-row-meta">
        {p.meta}
        {p.trailing}
      </span>
    </button>
  );
}
export function Timeline(p: TimelineProps) {
  return (
    <ol
      className="tf-timeline tf-stagger"
      style={
        {
          "--base": (p.delay || 200) + "ms",
        } as React.CSSProperties
      }
    >
      {(p.items || []).map((it, i) => (
        <li key={i} className="tf-tl-item">
          {it.avatar ? (
            <Avatar name={it.avatar} size={30} />
          ) : (
            <TintIcon icon={it.icon || "sparkle"} tint={it.tint || "plain"} />
          )}
          <div>
            <p className="tf-tl-text">{it.text}</p>
            <span className="tf-tl-time">{it.time}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
const FT: Record<string, [IconName, Tint]> = {
  pdf: ["file", "blush"],
  fig: ["sparkle", "lilac"],
  sheet: ["chart", "mint"],
  doc: ["book", "sky"],
  zip: ["folder", "butter"],
};
export function FileRow(p: FileRowProps) {
  const t = FT[p.kind || "doc"] || (FT.doc as [IconName, Tint]);
  return (
    <div className="tf-file">
      <TintIcon icon={t[0]} tint={t[1]} />
      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <div className="tf-file-name">{p.name}</div>
        <div className="tf-file-meta">{p.meta}</div>
      </div>
      <IconButton icon="download" label={`Download ${p.name}`} size="sm" />
    </div>
  );
}
export function KanbanColumn(p: KanbanColumnProps) {
  return (
    <section className="tf-kanban" aria-label={p.title}>
      <div className="tf-kanban-head">
        <span
          className="tf-row"
          style={{
            gap: 0,
          }}
        >
          {p.dot && (
            <span
              className="tf-badge-dot"
              style={{
                color: "var(--" + p.dot + "-ink)",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "currentColor",
                marginRight: 8,
              }}
            />
          )}
          {p.title}
          <span className="tf-kanban-count">{React.Children.count(p.children)}</span>
        </span>
        <IconButton icon="more" label="Column options" size="sm" />
      </div>
      <Stagger
        className="tf-col"
        style={{
          gap: 10,
        }}
        delay={p.delay || 0}
      >
        {p.children}
      </Stagger>
      <button type="button" className="tf-kanban-add" onClick={p.onAdd}>
        <Icon name="plus" size={14} />
        {"Add card"}
      </button>
    </section>
  );
}
export function Progress(p: ProgressProps) {
  const v = Math.max(0, Math.min(100, p.value || 0));
  return (
    <div
      className={cx("tf-progress", p.tint && "tf-progress-" + p.tint)}
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={p.label || "Progress"}
    >
      <span
        style={{
          width: v + "%",
        }}
      />
    </div>
  );
}
export function ProgressRing(p: ProgressRingProps) {
  const size = p.size || 88,
    sw = p.stroke || 9,
    r = (size - sw) / 2,
    c = 2 * Math.PI * r,
    v = Math.max(0, Math.min(100, p.value || 0)),
    on = useMounted(150);
  return (
    <div
      className="tf-ring"
      style={{
        width: size,
        height: size,
      }}
      role="img"
      aria-label={(p.label || "Progress") + " " + v + "%"}
    >
      <svg width={size} height={size} viewBox={"0 0 " + size + " " + size}>
        <circle className="tf-arc-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={sw} />
        <circle
          className={cx("tf-arc", "tf-arc-" + (p.tint || "ink"))}
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={sw}
          strokeDasharray={c}
          strokeDashoffset={on ? c * (1 - v / 100) : c}
        />
      </svg>
      <span className="tf-ring-label">
        <span>
          <CountUp value={v + "%"} delay={150} />
          {p.caption && <small>{p.caption}</small>}
        </span>
      </span>
    </div>
  );
}
