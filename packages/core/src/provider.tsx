"use client";
import {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  applyQuietly,
  localeVersion,
  subscribeLocale,
  type Labels,
  type LocaleOptions,
} from "./i18n.js";

export type Kit = "halo" | "pro";
export type Theme = "light" | "dark" | "system";
export type Density = "compact" | "comfortable";

export interface UIProviderProps {
  /** Which kit's CSS applies (sets `data-kit`). Only matters when both kits are loaded (`themes.css`). */
  kit?: Kit;
  /** Colour theme (sets `data-theme`). Omit to keep the kit's default. */
  theme?: Theme;
  /** Density (sets `data-density`). Omit to keep the kit's default (Halo comfortable, Pro compact). */
  density?: Density;
  /** BCP 47 tag for numbers, money, dates and calendars. Omit to use the browser's locale. */
  locale?: string;
  /** Your text for the built-in English labels, e.g. the German set from `@twentyfirstmedia/ui-core/labels/de.json`. */
  labels?: Labels;
  /** Default currency for `formatMoney` (ISO 4217). */
  currency?: string;
  /** First day of the week, 0 Sunday … 6 Saturday. */
  weekStart?: number;
  /**
   * Where the data attributes go. `"document"` (default) sets them on `<html>`, so portals
   * (modals, toasts, menus) inherit the theme. `"subtree"` wraps the children in a div that carries
   * them and hosts the portals, for previews that show several kits on one page.
   */
  scope?: "document" | "subtree";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export interface UIContextValue {
  kit: Kit | undefined;
  theme: Theme | undefined;
  density: Density | undefined;
  locale: string | undefined;
  /** Element portals render into (null: document.body). */
  portalRoot: HTMLElement | null;
}

const UIContext = createContext<UIContextValue>({
  kit: undefined,
  theme: undefined,
  density: undefined,
  locale: undefined,
  portalRoot: null,
});

/** Current kit, theme, density, locale and portal target. */
export function useUI(): UIContextValue {
  return useContext(UIContext);
}

function same(a: Labels | undefined, b: Labels | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  const ka = Object.keys(a);
  return ka.length === Object.keys(b).length && ka.every((k) => a[k] === b[k]);
}

/**
 * Sets kit, theme, density, locale and labels for everything inside. Labels and locale are
 * applied before the children render; changing them re-mounts the subtree so every string and
 * number updates (theme, kit and density only change attributes and never re-mount).
 */
export function UIProvider(p: UIProviderProps) {
  const scope = p.scope ?? "document";
  const applied = useRef<{
    key: number;
    labels?: Labels;
    locale?: string;
    currency?: string;
    weekStart?: number;
  } | null>(null);
  const a = applied.current;
  const manages =
    p.labels !== undefined ||
    p.locale !== undefined ||
    p.currency !== undefined ||
    p.weekStart !== undefined;
  if (
    manages &&
    (!a ||
      !same(a.labels, p.labels) ||
      a.locale !== p.locale ||
      a.currency !== p.currency ||
      a.weekStart !== p.weekStart)
  ) {
    // Applied synchronously during render so the first render already reads the right text.
    const opts: LocaleOptions = {};
    if (p.currency !== undefined) opts.currency = p.currency;
    if (p.weekStart !== undefined) opts.weekStart = p.weekStart;
    applyQuietly(p.labels, p.locale, opts);
    const next: NonNullable<typeof applied.current> = { key: (a?.key ?? 0) + 1 };
    if (p.labels) next.labels = p.labels;
    if (p.locale !== undefined) next.locale = p.locale;
    if (p.currency !== undefined) next.currency = p.currency;
    if (p.weekStart !== undefined) next.weekStart = p.weekStart;
    applied.current = next;
  }
  // Imperative setLabels()/setLocale() calls elsewhere also re-render the subtree.
  const version = useSyncExternalStore(subscribeLocale, localeVersion, localeVersion);
  const key = `${version}.${applied.current?.key ?? 0}`;

  useEffect(() => {
    if (scope !== "document") return;
    const el = document.documentElement;
    const set = (k: string, v: string | undefined) =>
      v ? el.setAttribute(k, v) : el.removeAttribute(k);
    set("data-kit", p.kit);
    set("data-theme", p.theme);
    set("data-density", p.density);
    if (p.locale) el.lang = p.locale;
  }, [scope, p.kit, p.theme, p.density, p.locale]);

  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const ctx = useMemo<UIContextValue>(
    () => ({ kit: p.kit, theme: p.theme, density: p.density, locale: p.locale, portalRoot }),
    [p.kit, p.theme, p.density, p.locale, portalRoot],
  );
  const content = <Fragment key={key}>{p.children}</Fragment>;
  if (scope === "subtree") {
    return (
      <UIContext.Provider value={ctx}>
        <div
          className={p.className}
          style={p.style}
          data-kit={p.kit}
          data-theme={p.theme}
          data-density={p.density}
          lang={p.locale}
        >
          {content}
          <div ref={setPortalRoot} data-tf-portal="" />
        </div>
      </UIContext.Provider>
    );
  }
  return <UIContext.Provider value={ctx}>{content}</UIContext.Provider>;
}
