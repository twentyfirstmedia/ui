"use client";
import * as React from "react";
import { leaving, usePresence } from "../presence.js";
import { useControlled, useId, useKeepInView, useOutside } from "../hooks.js";
import { cx } from "../cx.js";
import type { PopoverProps, TooltipProps } from "./types.js";

/* ── Popover & Tooltip ── */
export function Popover(p: PopoverProps) {
  const ref = React.useRef<HTMLSpanElement>(null),
    pop = React.useRef<HTMLDivElement>(null),
    st = useControlled(p.open, false, p.onOpenChange),
    pr = usePresence(st[0]);
  useOutside(ref, st[0], () => {
    st[1](false);
  });
  useKeepInView(pop, st[0]);
  // open on the other side when there is no room on the requested one
  const [flip, setFlip] = React.useState(false);
  React.useLayoutEffect(() => {
    if (!st[0]) {
      setFlip(false);
      return;
    }
    const el = pop.current,
      anchor = ref.current;
    if (!el || !anchor) return;
    const r = el.getBoundingClientRect(),
      a = anchor.getBoundingClientRect(),
      vh = window.innerHeight;
    const top = p.side === "top";
    const roomBelow = vh - a.bottom - 8,
      roomAbove = a.top - 8;
    if (!top && r.bottom > vh - 8 && roomAbove > r.height && roomAbove > roomBelow) setFlip(true);
    if (top && r.top < 8 && roomBelow > r.height) setFlip(true);
  }, [st[0]]);
  const trigger =
    typeof p.trigger === "function" ? (
      p.trigger({
        open: st[0],
        toggle: () => {
          st[1](!st[0]);
        },
      })
    ) : (
      <span
        onClick={() => {
          st[1](!st[0]);
        }}
      >
        {p.trigger}
      </span>
    );
  return (
    <span
      style={p.style}
      ref={ref}
      className={cx("tf-pop-anchor", p.block && "block", p.className)}
    >
      {trigger}
      {pr.mounted && (
        <div
          {...leaving(pr.closing)}
          ref={pop}
          className={cx(
            "tf-popover",
            "tf-pop-" + (p.align || "start"),
            (p.side === "top") !== flip && "top",
            p.flush && "flush",
          )}
          role={p.role || "dialog"}
          style={
            p.width == null
              ? undefined
              : ({
                  "--pop-w": typeof p.width === "number" ? p.width + "px" : p.width,
                } as React.CSSProperties)
          }
        >
          {typeof p.children === "function"
            ? p.children({
                close: () => {
                  st[1](false);
                },
              })
            : p.children}
        </div>
      )}
    </span>
  );
}

export function Tooltip(p: TooltipProps) {
  const id = useId("tip"),
    st = React.useState(!!p.defaultOpen),
    t = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined),
    tip = React.useRef<HTMLSpanElement>(null),
    side = p.side || "top",
    pr = usePresence(st[0]);
  // keep a top or bottom tooltip inside the screen (or the scrolling box around it)
  useKeepInView(tip, st[0] && side !== "left" && side !== "right");
  function show() {
    clearTimeout(t.current);
    t.current = setTimeout(() => {
      st[1](true);
    }, 350);
  }
  function hide() {
    clearTimeout(t.current);
    st[1](false);
  }
  const child = React.Children.only(p.children) as React.ReactElement<Record<string, unknown>>;
  return (
    <span
      style={p.style}
      className={cx("tf-tip-anchor", p.className)}
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={() => {
        st[1](true);
      }}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === "Escape") hide();
      }}
    >
      {React.cloneElement(child, {
        "aria-describedby": st[0] ? id : undefined,
      })}
      {pr.mounted && (
        <span
          {...leaving(pr.closing)}
          id={id}
          ref={tip}
          role="tooltip"
          className={cx("tf-tooltip", "tf-tip-" + side)}
        >
          {p.label}
          {p.shortcut && <kbd>{p.shortcut}</kbd>}
        </span>
      )}
    </span>
  );
}

/* ── Combobox (single or multi, searchable) ── */
