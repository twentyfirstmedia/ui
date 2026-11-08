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
  list = list.filter((t) => t.id !== id);
  emit();
};
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
