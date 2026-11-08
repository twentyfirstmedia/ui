"use client";
/**
 * General-purpose primitives: Accordion, Separator, AspectRatio, Label, Toggle, ToggleGroup,
 * ButtonGroup, ScrollArea, HoverCard and Carousel. Same markup in both kits; keyboard paths follow
 * the WAI-ARIA authoring practices.
 */
import * as React from "react";
import { Icon } from "../Icon.js";
import { cx } from "../cx.js";
import { moveFocus, useControlled, useId, useKeepInView } from "../hooks.js";
import type {
  AccordionProps,
  AspectRatioProps,
  ButtonGroupProps,
  CarouselProps,
  HoverCardProps,
  LabelProps,
  Option,
  ScrollAreaProps,
  SeparatorProps,
  ToggleGroupProps,
  ToggleProps,
} from "./types.js";

/* ── Accordion ── */
export function Accordion(p: AccordionProps) {
  const uid = useId("acc");
  const items = p.items || [];
  const ids = items.map((it, i) => it.id ?? String(i));
  const open = useControlled(p.value, p.defaultValue || [], p.onChange);
  const root = React.useRef<HTMLDivElement>(null);
  const toggle = (id: string) => {
    const on = open[0].includes(id);
    open[1](on ? open[0].filter((x) => x !== id) : p.multiple ? open[0].concat(id) : [id]);
  };
  return (
    <div
      ref={root}
      className={cx("tf-accordion", p.variant === "flush" && "flush", p.className)}
      style={p.style}
      onKeyDown={(e) => {
        if ((e.target as HTMLElement).classList.contains("tf-accordion-head"))
          moveFocus(e, root.current, ".tf-accordion-head", "vertical");
      }}
    >
      {items.map((it, i) => {
        const id = ids[i] as string;
        const on = open[0].includes(id);
        return (
          <div key={id} className={cx("tf-accordion-item", on && "open")}>
            <h3 className="tf-accordion-h">
              <button
                type="button"
                id={`${uid}-h${i}`}
                className="tf-accordion-head"
                aria-expanded={on}
                aria-controls={`${uid}-p${i}`}
                disabled={it.disabled}
                onClick={() => toggle(id)}
              >
                {it.icon && <Icon name={it.icon} />}
                <span className="tf-accordion-title">{it.title}</span>
                {it.meta && <span className="tf-accordion-meta">{it.meta}</span>}
                <Icon name="chevronDown" size={16} className="tf-accordion-chev" />
              </button>
            </h3>
            <div
              id={`${uid}-p${i}`}
              role="region"
              aria-labelledby={`${uid}-h${i}`}
              className="tf-accordion-panel"
              hidden={!on}
            >
              <div className="tf-accordion-body">{it.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Separator, AspectRatio, Label ── */
export function Separator(p: SeparatorProps) {
  const vertical = p.orientation === "vertical";
  if (p.label && !vertical)
    return (
      <div className={cx("tf-sep", "labelled", p.className)} style={p.style} role="separator">
        <span>{p.label}</span>
      </div>
    );
  return (
    <div
      className={cx("tf-sep", vertical && "vertical", p.className)}
      style={p.style}
      role="separator"
      aria-orientation={vertical ? "vertical" : undefined}
    />
  );
}

export function AspectRatio(p: AspectRatioProps) {
  return (
    <div
      className={cx("tf-aspect", p.className)}
      style={{ aspectRatio: String(p.ratio || 16 / 9), ...p.style }}
    >
      {p.children}
    </div>
  );
}

export function Label(p: LabelProps) {
  return (
    <label
      className={cx("tf-field-label", "tf-label", p.className)}
      style={p.style}
      htmlFor={p.htmlFor}
    >
      {p.children}
      {p.required && (
        <span className="tf-label-req" aria-hidden>
          *
        </span>
      )}
      {p.hint && <span className="tf-label-hint">{p.hint}</span>}
    </label>
  );
}

/* ── Toggle, ToggleGroup, ButtonGroup ── */
export function Toggle(p: ToggleProps) {
  const on = useControlled(p.pressed, !!p.defaultPressed, p.onChange);
  const iconOnly = !!p.icon && !p.children;
  return (
    <button
      type="button"
      className={cx("tf-toggle", p.size === "sm" && "sm", iconOnly && "icon", p.className)}
      style={p.style}
      aria-pressed={on[0]}
      aria-label={iconOnly ? p.label : undefined}
      title={iconOnly ? p.label : undefined}
      disabled={p.disabled}
      onClick={() => on[1](!on[0])}
    >
      {p.icon && <Icon name={p.icon} />}
      {p.children}
    </button>
  );
}

const opt = (o: string | Option): Option => (typeof o === "string" ? { value: o, label: o } : o);

export function ToggleGroup(p: ToggleGroupProps) {
  const v = useControlled(p.value, p.defaultValue || [], p.onChange);
  const root = React.useRef<HTMLDivElement>(null);
  const items = (p.items || []).map(opt);
  return (
    <div
      ref={root}
      className={cx("tf-togglegroup", p.size === "sm" && "sm", p.className)}
      style={p.style}
      role="group"
      aria-label={p.label}
      onKeyDown={(e) => moveFocus(e, root.current, ".tf-toggle", "horizontal")}
    >
      {items.map((o) => {
        const on = v[0].includes(o.value);
        const iconOnly = !!o.icon && !o.label;
        return (
          <button
            key={o.value}
            type="button"
            className={cx("tf-toggle", p.size === "sm" && "sm", iconOnly && "icon")}
            aria-pressed={on}
            title={o.hint}
            onClick={() =>
              v[1](
                p.type === "multiple"
                  ? on
                    ? v[0].filter((x) => x !== o.value)
                    : v[0].concat(o.value)
                  : on
                    ? []
                    : [o.value],
              )
            }
          >
            {o.icon && <Icon name={o.icon} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function ButtonGroup(p: ButtonGroupProps) {
  return (
    <div
      className={cx("tf-btngroup", p.orientation === "vertical" && "vertical", p.className)}
      style={p.style}
      role="group"
      aria-label={p.label}
    >
      {p.children}
    </div>
  );
}

/* ── ScrollArea ── */
export function ScrollArea(p: ScrollAreaProps) {
  const o = p.orientation || "vertical";
  return (
    <div
      className={cx("tf-scrollarea", o, p.className)}
      style={{ height: p.height, maxHeight: p.maxHeight, ...p.style }}
      role="region"
      aria-label={p.label}
      tabIndex={0}
    >
      {p.children}
    </div>
  );
}

/* ── HoverCard ── */
export function HoverCard(p: HoverCardProps) {
  const [open, setOpen] = React.useState(false);
  const t = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const card = React.useRef<HTMLDivElement>(null);
  useKeepInView(card, open);
  const later = (v: boolean, ms: number) => {
    clearTimeout(t.current);
    t.current = setTimeout(() => setOpen(v), ms);
  };
  React.useEffect(() => () => clearTimeout(t.current), []);
  return (
    <span
      className={cx("tf-hovercard-anchor", p.className)}
      style={p.style}
      onPointerEnter={() => later(true, p.openDelay ?? 500)}
      onPointerLeave={() => later(false, p.closeDelay ?? 200)}
      onFocus={() => later(true, 0)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) later(false, 0);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") later(false, 0);
      }}
    >
      {p.trigger}
      {open && (
        <div
          ref={card}
          className={cx(
            "tf-hovercard",
            "tf-hc-" + (p.side || "bottom"),
            "tf-hc-" + (p.align || "center"),
          )}
          style={p.width ? { width: p.width } : undefined}
        >
          {p.children}
        </div>
      )}
    </span>
  );
}

/* ── Carousel ── */
export function Carousel(p: CarouselProps) {
  const slides = p.slides || [];
  const n = slides.length;
  const idx = useControlled(p.index, p.defaultIndex || 0, p.onChange);
  const track = React.useRef<HTMLDivElement>(null);
  const per = Math.max(1, p.perView || 1);
  const last = Math.max(0, n - per);
  const go = (i: number) => {
    const to = p.loop ? (i > last ? 0 : i < 0 ? last : i) : Math.min(last, Math.max(0, i));
    const el = track.current?.children[to] as HTMLElement | undefined;
    if (el && track.current)
      track.current.scrollTo({
        left: el.offsetLeft - track.current.offsetLeft,
        behavior: "smooth",
      });
    idx[1](to);
  };
  // keep the index in step with swipes and scrolling
  React.useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = (el.firstElementChild as HTMLElement | null)?.offsetWidth || 1;
        const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
        const i = Math.round(el.scrollLeft / (w + gap));
        if (i !== idx[0]) idx[1](Math.min(last, i));
      });
    };
    el.addEventListener("scroll", on, { passive: true });
    return () => {
      el.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  });
  return (
    <section
      className={cx("tf-carousel", p.className)}
      style={{ ["--per" as string]: per, ...p.style }}
      aria-roledescription="carousel"
      aria-label={p.label}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(idx[0] + 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(idx[0] - 1);
        }
      }}
    >
      <div ref={track} className="tf-carousel-track">
        {slides.map((s, i) => (
          <div
            key={i}
            className="tf-carousel-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}`}
          >
            {s}
          </div>
        ))}
      </div>
      <div className="tf-carousel-bar">
        <button
          type="button"
          className="tf-iconbtn tf-iconbtn-soft tf-iconbtn-sm"
          aria-label="Previous slide"
          disabled={!p.loop && idx[0] <= 0}
          onClick={() => go(idx[0] - 1)}
        >
          <Icon name="chevronLeft" />
        </button>
        {p.dots !== false && (
          <div className="tf-carousel-dots">
            {Array.from({ length: last + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                className="tf-carousel-dot"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === idx[0] ? "true" : undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
        )}
        <button
          type="button"
          className="tf-iconbtn tf-iconbtn-soft tf-iconbtn-sm"
          aria-label="Next slide"
          disabled={!p.loop && idx[0] >= last}
          onClick={() => go(idx[0] + 1)}
        >
          <Icon name="chevronRight" />
        </button>
      </div>
    </section>
  );
}
