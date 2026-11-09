import type { ReactNode } from "react";
import type { IconName } from "./icons.js";

export type ToastTone = "success" | "info" | "warning" | "danger";
export interface ToastOptions {
  text: ReactNode;
  tone?: ToastTone;
  icon?: IconName;
  /** Shows an Undo button; the toast stays 6 s instead of 4 s. */
  undo?: () => void;
  action?: { label: string; onClick: () => void };
  /** Milliseconds before it closes on its own. */
  duration?: number;
}
export interface ToastData extends ToastOptions {
  id: string;
  tone: ToastTone;
  duration: number;
  /** Animating out; removed after `--dur-exit`. */
  leaving?: boolean;
}

let list: ToastData[] = [];
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

/** Shows a toast in the `<Toaster/>`; at most three are visible. Returns its id. */
export function toast(o: ToastOptions | string): string {
  const opts: ToastOptions = typeof o === "string" ? { text: o } : o;
  const t: ToastData = {
    id: Math.random().toString(36).slice(2),
    ...opts,
    tone: opts.tone ?? "success",
    duration: opts.duration ?? (opts.undo ? 6000 : 4000),
  };
  list = [...list, t].slice(-3);
  emit();
  return t.id;
}
toast.dismiss = (id: string): void => {
  const ms = exitMs();
  if (ms <= 0) {
    list = list.filter((t) => t.id !== id);
    emit();
    return;
  }
  list = list.map((t) => (t.id === id ? { ...t, leaving: true } : t));
  emit();
  setTimeout(() => {
    list = list.filter((t) => t.id !== id);
    emit();
  }, ms);
};

/** How long a toast takes to leave (0 without motion). */
function exitMs(): number {
  try {
    if (typeof window === "undefined") return 0;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return 0;
    if (document.documentElement.closest("[data-motion]")?.getAttribute("data-motion") === "off")
      return 0;
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--dur-exit").trim();
    const n = parseFloat(raw);
    return isNaN(n) ? 0 : raw.endsWith("ms") ? n : n * 1000;
  } catch {
    return 0;
  }
}
toast.clear = (): void => {
  list = [];
  emit();
};

export function subscribeToasts(fn: () => void): () => void {
  subs.add(fn);
  return () => subs.delete(fn);
}
export function getToasts(): ToastData[] {
  return list;
}
const EMPTY: ToastData[] = [];
export function getServerToasts(): ToastData[] {
  return EMPTY;
}
