/**
 * Text and locale. The kits ship no fixed copy: every visible string, aria-label and placeholder
 * goes through `L()`, keyed by its built-in English text. Apps replace them with `setLabels()` or
 * `<UIProvider labels>`; numbers, money and dates follow `setLocale()` / `<UIProvider locale>`.
 */
import { Fragment, createElement, type ReactNode } from "react";

export type Labels = Record<string, string>;
export interface LocaleOptions {
  /** ISO 4217 code used by `formatMoney` when none is passed. */
  currency?: string;
  /** First day of the week: 0 Sunday … 6 Saturday. */
  weekStart?: number;
}
export interface LocaleState {
  tag: string | undefined;
  currency: string;
  weekStart: number;
}

let LABELS: Labels = {};
let LOCALE: LocaleState = { tag: undefined, currency: "EUR", weekStart: 1 };
let version = 0;
const subs = new Set<() => void>();

function changed(): void {
  version++;
  subs.forEach((f) => f());
}

/** Subscribe to label or locale changes (used by UIProvider). */
export function subscribeLocale(fn: () => void): () => void {
  subs.add(fn);
  return () => subs.delete(fn);
}
/** Increments whenever labels or the locale change. */
export function localeVersion(): number {
  return version;
}

/** Looks up a label by its English text and fills `{placeholders}`. */
export function L(key: string, vars?: Record<string, string | number | null | undefined>): string {
  let s = Object.prototype.hasOwnProperty.call(LABELS, key) ? (LABELS[key] as string) : key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (_, k: string) => (vars[k] != null ? String(vars[k]) : ""));
  return s;
}

/**
 * Marks a string as a label key without translating it, for keys that are looked up later with a
 * variable (`L(status)`). The label extractor collects these, so every key ends up in en.json.
 */
export function LK<T extends string>(key: T): T {
  return key;
}

/** Like `L()`, but `{slots}` can be React nodes: `Lx("Type {word} to confirm", { word: <b>RESET</b> })`. */
export function Lx(key: string, nodes: Record<string, ReactNode>): ReactNode[] {
  return L(key)
    .split(/(\{\w+\})/)
    .map((part, i) => {
      const m = /^\{(\w+)\}$/.exec(part);
      return m ? createElement(Fragment, { key: i }, nodes[m[1] as string]) : part;
    });
}

/**
 * Applies labels and locale without notifying subscribers. UIProvider uses it during render,
 * where a notification would re-render the provider itself.
 * @internal
 */
export function applyQuietly(
  labels: Labels | undefined,
  tag: string | undefined,
  opts: LocaleOptions,
): void {
  LABELS = { ...(labels ?? {}) };
  LOCALE = { tag, currency: opts.currency ?? "EUR", weekStart: opts.weekStart ?? 1 };
}

/** Maps built-in English text to yours. Merges unless `replace` is true. */
export function setLabels(map: Labels, replace = false): void {
  LABELS = replace ? { ...map } : { ...LABELS, ...map };
  changed();
}
export function getLabels(): Labels {
  return LABELS;
}

/** Sets the locale for numbers, money, dates and calendars. Without a tag the browser's locale is used. */
export function setLocale(tag: string | undefined, opts: LocaleOptions = {}): void {
  LOCALE = { ...LOCALE, ...opts, tag };
  changed();
}
export function getLocale(): LocaleState {
  return LOCALE;
}

export function formatNumber(v: number, o?: Intl.NumberFormatOptions): string {
  try {
    return new Intl.NumberFormat(LOCALE.tag, o).format(v);
  } catch {
    return String(v);
  }
}

export function formatMoney(
  v: number,
  currency?: string | null,
  o?: Intl.NumberFormatOptions,
): string {
  return formatNumber(v, {
    style: "currency",
    currency: currency || LOCALE.currency,
    minimumFractionDigits: v % 1 ? 2 : 0,
    maximumFractionDigits: 2,
    ...o,
  });
}

/** A share in percent (`19` → "19%" in English, "19 %" in German), via Intl. */
export function formatPercent(v: number, o?: Intl.NumberFormatOptions): string {
  return formatNumber(v / 100, { style: "percent", maximumFractionDigits: 0, ...o });
}

export function formatDate(input: Date | string | number, o?: Intl.DateTimeFormatOptions): string {
  const d = input instanceof Date ? input : new Date(input);
  try {
    return new Intl.DateTimeFormat(
      LOCALE.tag,
      o || { day: "2-digit", month: "2-digit", year: "numeric" },
    ).format(d);
  } catch {
    return d.toDateString();
  }
}
