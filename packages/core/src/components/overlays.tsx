"use client";
import * as React from "react";
import { useControlled, useId, useOutside } from "../hooks.js";
import { cx } from "../cx.js";
import type { PopoverProps, TooltipProps } from "./types.js";

/* ── Popover & Tooltip ── */
export function Popover(p: PopoverProps) {
  const ref = React.useRef<HTMLSpanElement>(null),
    st = useControlled(p.open, false, p.onOpenChange);
  useOutside(ref, st[0], () => {
    st[1](false);
  });
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
    <span ref={ref} className={cx("tf-pop-anchor", p.block && "block", p.className)}>
      {trigger}
      {st[0] && (
        <div
          className={cx(
            "tf-popover",
            "tf-pop-" + (p.align || "start"),
            p.side === "top" && "top",
            p.flush && "flush",
          )}
          role={p.role || "dialog"}
          style={{
            width: p.width,
          }}
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
    st = React.useState(false),
    t = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
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
      className="tf-tip-anchor"
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
      {st[0] && (
        <span id={id} role="tooltip" className={cx("tf-tooltip", "tf-tip-" + (p.side || "top"))}>
          {p.label}
          {p.shortcut && <kbd>{p.shortcut}</kbd>}
        </span>
      )}
    </span>
  );
}

/* ── Combobox (single or multi, searchable) ── */
