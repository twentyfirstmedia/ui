"use client";
/**
 * The context `UIProvider` fills, and the hooks components read it with. Kept apart from the
 * provider so a component that only needs its strings or formatters does not pull in theming.
 */
import { createContext, useContext } from "react";
import { LOCALE, formatDate, formatMoney, formatNumber, formatPercent } from "./format.js";
import {
  DEFAULT_STRINGS,
  SHARED_STRINGS,
  mergeStrings,
  type UIMessages,
  type UIStrings,
} from "./strings.js";
import type { Density, Kit, Motion, Surface, Theme } from "./provider.js";

export interface UIContextValue {
  kit: Kit | undefined;
  theme: Theme | undefined;
  density: Density | undefined;
  surface: Surface | undefined;
  motion: Motion | undefined;
  /** Locale for formatted numbers and dates (`"en-US"` unless a provider sets one). */
  locale: string;
  /** Every provider's `messages`, merged (outer first). Components add their defaults. */
  messages: UIMessages;
  /** Element portals render into (null: document.body). */
  portalRoot: HTMLElement | null;
}

export const UIContext = createContext<UIContextValue>({
  kit: undefined,
  theme: undefined,
  density: undefined,
  surface: undefined,
  motion: undefined,
  locale: LOCALE,
  messages: {},
  portalRoot: null,
});

/** Current kit, theme, density, locale, strings and portal target. */
export function useUI(): UIContextValue {
  return useContext(UIContext);
}

// Resolved strings per (messages, defaults): components get stable objects, and an app without
// messages shares one object per group.
const resolved = new WeakMap<object, WeakMap<object, unknown>>();
function resolve<T extends object>(messages: UIMessages, defaults: T): T {
  let byGroup = resolved.get(messages);
  if (!byGroup) resolved.set(messages, (byGroup = new WeakMap()));
  let out = byGroup.get(defaults) as T | undefined;
  if (!out) {
    out = mergeStrings(defaults as unknown as UIStrings, messages) as unknown as T;
    byGroup.set(defaults, out);
  }
  return out;
}
const NO_GROUP = {};

/**
 * Strings for a component: the shared strings plus `group` (the component file's defaults), with
 * the `messages` of the surrounding providers applied. Each component file passes only its own
 * group, so a bundle carries just the defaults of the components it uses.
 */
export function useStrings<G extends object = Record<never, never>>(
  group?: G,
): typeof SHARED_STRINGS & G {
  const messages = useContext(UIContext).messages;
  const g = group ?? (NO_GROUP as G);
  let base = withShared.get(g) as (typeof SHARED_STRINGS & G) | undefined;
  if (!base) withShared.set(g, (base = { ...SHARED_STRINGS, ...g }));
  return resolve(messages, base);
}
const withShared = new WeakMap<object, object>();

/** Every built-in string for this part of the tree (English unless a `UIProvider` sets `messages`). */
export function useUIStrings(): UIStrings {
  return resolve(useContext(UIContext).messages, DEFAULT_STRINGS);
}

/** `formatNumber`, `formatMoney`, `formatPercent` and `formatDate`, bound to a locale. */
export interface Formatters {
  locale: string;
  formatNumber: (v: number, o?: Intl.NumberFormatOptions) => string;
  formatMoney: (v: number, currency?: string | null, o?: Intl.NumberFormatOptions) => string;
  formatPercent: (v: number, o?: Intl.NumberFormatOptions) => string;
  formatDate: (input: Date | string | number, o?: Intl.DateTimeFormatOptions) => string;
}

const formatters = new Map<string, Formatters>();
/** The formatters for a locale (cached, so the functions keep their identity). */
export function formattersFor(locale: string): Formatters {
  let f = formatters.get(locale);
  if (!f) {
    f = {
      locale,
      formatNumber: (v, o) => formatNumber(v, o, locale),
      formatMoney: (v, currency, o) => formatMoney(v, currency, o, locale),
      formatPercent: (v, o) => formatPercent(v, o, locale),
      formatDate: (input, o) => formatDate(input, o, locale),
    };
    formatters.set(locale, f);
  }
  return f;
}

/** The format helpers in the locale of the nearest `UIProvider` (`"en-US"` without one). */
export function useFormat(): Formatters {
  return formattersFor(useContext(UIContext).locale);
}
