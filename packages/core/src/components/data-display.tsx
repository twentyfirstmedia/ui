"use client";

import * as React from "react";
import { cx, durationToken, enterDelay, reduced } from "../cx.js";
import { formatLike, parseFormatted, type FormattedNumber } from "../format.js";
import { useFormat, useStrings } from "../context.js";
import { DATA_DISPLAY_STRINGS } from "../strings.js";
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
/**
 * Counts up to `value`. Strings are read in the locale of the nearest `UIProvider` ("13,05 €/m²"
 * in de-DE, "$1,305.50" in en-US): the number animates, the text around it stays, and decimals and
 * grouping are kept. The final text is always `value` itself.
 */
const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export function CountUp(p: CountUpProps) {
  const { locale } = useFormat();
  const o = parseFormatted(p.value, locale),
    fmt = (n: number, shape: FormattedNumber) => formatLike(n, shape, locale),
    // numbers are shown in the locale too; strings end exactly as given
    final = o && typeof p.value === "number" ? fmt(p.value, o) : String(p.value),
    // the server (and readers without scripts, print, share images) get the final value; the
    // client starts at zero before the first paint and counts up
    st = React.useState(final),
    last = React.useRef(0),
    first = React.useRef(true),
    el = React.useRef<HTMLSpanElement>(null);
  useIsoLayoutEffect(() => {
    if (o && p.animate !== false && !reduced(el.current)) st[1](fmt(0, o));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only before the first count
  }, []);
  React.useEffect(() => {
    if (!o || p.animate === false || reduced(el.current)) {
      st[1](final);
      return;
    }
    const slow = durationToken("--dur-slow", 900, el.current);
    const from = last.current;
    let start: number | null = null,
      raf = 0;
    const dur = first.current ? p.duration || slow : slow / 2,
      // the first count waits for the card it sits in to come in
      delay = first.current ? (p.delay || 0) + enterDelay(el.current) : 0;
    first.current = false;
    const target = o;
    function tick(t: number) {
      if (start === null) start = t;
      const k = Math.min(1, Math.max(0, (t - start - delay) / dur));
      const e = 1 - Math.pow(1 - k, 3),
        v = from + (target.value - from) * e;
      last.current = v;
      st[1](fmt(v, target));
      if (k < 1) raf = requestAnimationFrame(tick);
      else {
        last.current = target.value;
        st[1](final);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [p.value, locale]);
  return (
    <span style={p.style} ref={el} className={p.className}>
      {st[0]}
    </span>
  );
}
export function StatTile(p: StatTileProps) {
  const tint = p.tint || "sky";
  return (
    <div
      style={p.style}
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
      className={cx(
        "tf-card",
        tint,
        p.onClick && "tf-card-interactive",
        p.surface && "tf-" + p.surface,
        p.className,
      )}
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
  const t = useStrings(DATA_DISPLAY_STRINGS);
  const k = KIND[p.kind || "meeting"] || (KIND.meeting as [IconName, Tint]),
    tint = p.tint || k[1];
  return (
    <div style={p.style} className={cx("tf-event", "tf-bg-" + tint, p.className)}>
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
            <IconButton icon="eye" label={t.open} size="sm" variant="outline" />
            <IconButton icon="edit" label={t.edit} size="sm" variant="outline" />
            <IconButton icon="trash" label={t.remove} size="sm" variant="outline" />
          </span>
        )}
      </div>
    </div>
  );
}
export function Panel(p: PanelProps) {
  return (
    <section
      className={cx("tf-panel", p.side && "tf-side", p.surface && "tf-" + p.surface, p.className)}
      style={p.style}
    >
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
    <header style={p.style} className={cx("tf-header", p.className)}>
      <div>
        {p.crumbs && (
          <div
            style={{
              marginBottom: 8,
            }}
          >
            <Breadcrumb items={p.crumbs} linkAs={p.crumbLinkAs} />
          </div>
        )}
        <h1 className="tf-header-title">{p.title}</h1>
        {p.subtitle && <p className="tf-header-sub">{p.subtitle}</p>}
      </div>
      {p.actions && <div className="tf-row">{p.actions}</div>}
    </header>
  );
}
const useLayout = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export function Stagger(p: StaggerProps) {
  const st: Record<string, unknown> = { ...p.style };
  if (p.delay) st["--base"] = p.delay + "ms";
  const ref = React.useRef<HTMLElement>(null);
  // below the fold, the entrance waits until the group scrolls into view
  const [waiting, setWaiting] = React.useState(false);
  useLayout(() => {
    const el = ref.current;
    if (!el || p.reveal === false || typeof IntersectionObserver === "undefined" || reduced(el))
      return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setWaiting(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setWaiting(false);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return React.createElement(
    p.as || "div",
    {
      ref,
      className: cx("tf-stagger", p.className),
      style: st,
      "data-reveal": waiting ? "waiting" : undefined,
    },
    p.children,
  );
}
export function Table(p: TableProps) {
  const cols = p.columns || [];
  const box = React.useRef<HTMLDivElement>(null);
  useScrollFocus(box);
  return (
    <div
      style={p.style}
      ref={box}
      className={cx("tf-table-scroll", p.stack && "tf-table-stackbox", p.className)}
    >
      <table className={cx("tf-table", p.stack && "stack")}>
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
                <td
                  key={c.key}
                  className={c.align === "right" ? "tf-num" : undefined}
                  data-label={p.stack ? c.label : undefined}
                >
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
  const t = useStrings(DATA_DISPLAY_STRINGS);
  const Link = (p.linkAs || "a") as React.ElementType;
  const interactive = !!(p.onClick || p.href);
  const lines = (n: number | undefined) =>
    n ? ({ "--lines": n } as React.CSSProperties) : undefined;
  const title = (
    <span className={cx("tf-row-title", p.titleLines && "clamp")} style={lines(p.titleLines)}>
      {p.unread && <span className="tf-unread" role="img" aria-label={t.unread} />}
      {p.titleLines ? <span className="tf-row-clamp">{p.title}</span> : p.title}
    </span>
  );
  const content = (hit: boolean) => (
    <>
      {p.leading ||
        (p.avatar ? (
          <Avatar name={p.avatar} size={36} />
        ) : (
          <TintIcon icon={p.icon || "mail"} tint={p.tint || "plain"} size={36} />
        ))}
      <span className="tf-row-text">
        {hit && interactive ? (
          p.href ? (
            <Link className="tf-row-hit" href={p.href} onClick={p.onClick}>
              {title}
            </Link>
          ) : (
            <button type="button" className="tf-row-hit" onClick={p.onClick}>
              {title}
            </button>
          )
        ) : (
          title
        )}
        {p.subtitle && (
          <span
            className={cx("tf-row-sub", (p.subtitleLines || 1) > 1 && "clamp")}
            style={lines(p.subtitleLines)}
          >
            {p.subtitle}
          </span>
        )}
      </span>
      <span className="tf-row-meta">
        {p.meta}
        {p.trailing}
      </span>
      {p.actions && <span className="tf-row-actions">{p.actions}</span>}
    </>
  );
  // own buttons, or nothing to click: a plain row (with a stretched hit area when interactive)
  if (p.actions || !interactive)
    return (
      <div
        style={p.style}
        className={cx(
          "tf-row-item",
          interactive ? "has-hit" : "static",
          p.actions && "has-actions",
          p.className,
        )}
        aria-current={p.active ? "true" : undefined}
      >
        {content(true)}
      </div>
    );
  if (p.href)
    return (
      <Link
        href={p.href}
        style={p.style}
        className={cx("tf-row-item", p.className)}
        aria-current={p.active ? "true" : undefined}
        onClick={p.onClick}
      >
        {content(false)}
      </Link>
    );
  return (
    <button
      style={p.style}
      type="button"
      className={cx("tf-row-item", p.className)}
      aria-current={p.active ? "true" : undefined}
      onClick={p.onClick}
    >
      {content(false)}
    </button>
  );
}
export function Timeline(p: TimelineProps) {
  return (
    <ol
      className={cx("tf-timeline tf-stagger", p.className)}
      style={{
        ...({
          "--base": (p.delay || 200) + "ms",
        } as React.CSSProperties),
        ...p.style,
      }}
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
  const strings = useStrings(DATA_DISPLAY_STRINGS);
  const t = FT[p.kind || "doc"] || (FT.doc as [IconName, Tint]);
  return (
    <div style={p.style} className={cx("tf-file", p.className)}>
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
      <IconButton icon="download" label={strings.downloadItem(p.name)} size="sm" />
    </div>
  );
}
export function KanbanColumn(p: KanbanColumnProps) {
  const t = useStrings(DATA_DISPLAY_STRINGS);
  return (
    <section style={p.style} className={cx("tf-kanban", p.className)} aria-label={p.title}>
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
        <IconButton icon="more" label={t.columnOptions} size="sm" />
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
        {t.addCard}
      </button>
    </section>
  );
}
export function Progress(p: ProgressProps) {
  const t = useStrings(DATA_DISPLAY_STRINGS);
  const v = Math.max(0, Math.min(100, p.value || 0));
  return (
    <div
      style={p.style}
      className={cx("tf-progress", p.tint && "tf-progress-" + p.tint, p.className)}
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={p.label || t.progress}
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
  const t = useStrings(DATA_DISPLAY_STRINGS);
  const { formatPercent } = useFormat();
  const size = p.size || 88,
    sw = p.stroke || 9,
    r = (size - sw) / 2,
    c = 2 * Math.PI * r,
    v = Math.max(0, Math.min(100, p.value || 0)),
    on = useMounted(150);
  return (
    <div
      className={cx("tf-ring", p.className)}
      style={{
        width: size,
        height: size,
        ...p.style,
      }}
      role="img"
      aria-label={(p.label || t.progress) + " " + formatPercent(v, { maximumFractionDigits: 2 })}
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
          <CountUp value={formatPercent(v, { maximumFractionDigits: 2 })} delay={150} />
          {p.caption && <small>{p.caption}</small>}
        </span>
      </span>
    </div>
  );
}
