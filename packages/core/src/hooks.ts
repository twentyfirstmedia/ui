"use client";
import * as React from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Controlled-or-uncontrolled state: uses `value` when given, otherwise internal state. */
export function useControlled<T, D = T>(
  value: T | undefined,
  defaultValue: D,
  onChange?: (v: T) => void,
): [T | D, (v: T) => void] {
  const [inner, setInner] = useState<T | D>(defaultValue);
  const controlled = value !== undefined;
  const v = controlled ? value : inner;
  const set = useCallback(
    (n: T) => {
      if (!controlled) setInner(n);
      onChange?.(n);
    },
    [controlled, onChange],
  );
  return [v, set];
}

/** Becomes true `delay` ms after mount; drives entrance transitions. */
export function useMounted(delay = 30): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return on;
}

/** Calls `close` on a pointer down outside `ref` or on Escape, while `open`. */
export function useOutside(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  close: () => void,
): void {
  const cb = useRef(close);
  cb.current = close;
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb.current();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") cb.current();
    };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open, ref]);
}

export const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps keyboard focus inside `ref` while mounted, closes on Escape and returns focus to the
 * element that had it before. Used by Modal, Drawer, CommandPalette and Wizard.
 */
export function useTrap<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onClose?: () => void,
): void {
  const cb = useRef(onClose);
  cb.current = onClose;
  useEffect(() => {
    const root = ref.current;
    const before = document.activeElement as HTMLElement | null;
    if (!root) return;
    if (!root.contains(document.activeElement)) {
      const auto =
        root.querySelector<HTMLElement>('[autofocus], input:not([type="checkbox"]), textarea') ||
        root.querySelector<HTMLElement>(FOCUSABLE);
      auto?.focus();
    }
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape" && cb.current) {
        cb.current();
        return;
      }
      if (e.key !== "Tab") return;
      const els = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (x) => x.offsetParent !== null || x === document.activeElement,
      );
      if (!els.length) return;
      const a = els[0] as HTMLElement;
      const z = els[els.length - 1] as HTMLElement;
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    root.addEventListener("keydown", k);
    return () => {
      root.removeEventListener("keydown", k);
      if (before && typeof before.focus === "function" && document.contains(before)) before.focus();
    };
  }, [ref]);
}

/** Measures the width of an element (for charts), or returns `fixed` when given. */
export function useWidth<T extends HTMLElement = HTMLDivElement>(
  fixed: number | undefined,
  fallback: number,
): [RefObject<T | null>, number] {
  const ref = useRef<T | null>(null);
  const [w, setW] = useState(fixed || 0);
  useIsoLayoutEffect(() => {
    if (fixed || !ref.current) return;
    const el = ref.current;
    const measure = () => {
      const n = Math.floor(el.getBoundingClientRect().width);
      if (n > 40) setW((o) => (Math.abs(o - n) > 1 ? n : o));
      else setW((o) => o || fallback);
    };
    measure();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }
    return undefined;
  }, [fixed, fallback]);
  return [ref, fixed || w || fallback];
}

/** A stable id for aria wiring, unique per component instance (SSR-safe). */
export function useId(prefix = "tf"): string {
  return `${prefix}-${React.useId().replace(/[^\w-]/g, "")}`;
}

/**
 * Keeps a floating element (tooltip, popover) inside the screen, or inside the scrolling box that
 * clips it, on narrow screens: caps its width and shifts it sideways with `translate`, which leaves
 * the element's own `transform` (centering, entrance animation) alone.
 */
export function useKeepInView(ref: RefObject<HTMLElement | null>, active: boolean): void {
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!active || !el) return;
    el.style.translate = "";
    el.style.maxWidth = "";
    let lo = 8,
      hi = window.innerWidth - 8;
    for (let a = el.parentElement; a; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (cs.overflowX !== "visible") {
        const c = a.getBoundingClientRect();
        lo = Math.max(lo, c.left + a.clientLeft + parseFloat(cs.paddingLeft));
        hi = Math.min(hi, c.left + a.clientLeft + a.clientWidth - parseFloat(cs.paddingRight));
        break;
      }
    }
    if (hi - lo < 40) return;
    let r = el.getBoundingClientRect();
    if (r.width > hi - lo) {
      el.style.maxWidth = hi - lo + "px";
      r = el.getBoundingClientRect();
    }
    let shift = 0;
    if (r.right > hi) shift = hi - r.right;
    if (r.left + shift < lo) shift = lo - r.left;
    if (shift) el.style.translate = `${Math.round(shift)}px 0`;
  }, [active]);
}
