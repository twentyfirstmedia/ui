"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { themeStyle, type ThemeInput, type ThemeValues } from "./theme.js";
export type Kit = "halo" | "pro";
export type Theme = "light" | "dark" | "system";
export type Density = "compact" | "comfortable";
/** How surfaces paint: solid (the default) or glass, translucent over what is behind them. */
export type Surface = "solid" | "glass";
/**
 * How much things move: "standard" (the kit's own motion), "expressive" (longer, staggered page
 * entrances, more travel; Pro stays crisp) or "off". A reduced-motion setting always means "off".
 */
export type Motion = "off" | "standard" | "expressive";

export interface UIProviderProps {
  /** Which kit's CSS applies (sets `data-kit`). Only matters when both kits are loaded (`themes.css`). */
  kit?: Kit;
  /** Colour theme (sets `data-theme`). Omit to keep the kit's default. */
  theme?: Theme;
  /** Density (sets `data-density`). Omit to keep the kit's default (Halo comfortable, Pro compact). */
  density?: Density;
  /**
   * Where the data attributes go. `"document"` (default) sets them on `<html>`, so portals
   * (modals, toasts, menus) inherit the theme. `"subtree"` wraps the children in a div that carries
   * them and hosts the portals, for previews that show several kits on one page.
   */
  scope?: "document" | "subtree";
  /**
   * Theme colours for everything inside, like a shadcn theme: shadcn variable names without the
   * dashes (`{ primary: "#2563eb", ring: "#2563eb" }`), or `{ light, dark, radius }` for values
   * per mode. For a fixed theme, CSS is simpler (see `themeCss`); this is for runtime brands.
   */
  tokens?: ThemeValues | ThemeInput;
  /**
   * `"glass"` turns every top-level surface (Panel, Card, Dock, map legend and controls) and every
   * floating layer (menus, popovers, dialogs, drawers) inside into translucent glass, for UI that
   * floats over a map, a 3D scene, video or photos (sets `data-surface`). Single surfaces take
   * `surface="glass"` themselves; `surface="solid"` on one opts it out.
   */
  surface?: Surface;
  /**
   * Motion level for everything inside (sets `data-motion`): `"standard"` (default), `"expressive"`
   * for orchestrated page entrances, or `"off"`, e.g. for a setting in your app. The reader's
   * reduced-motion setting always turns motion off.
   */
  motion?: Motion;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export interface UIContextValue {
  kit: Kit | undefined;
  theme: Theme | undefined;
  density: Density | undefined;
  surface: Surface | undefined;
  motion: Motion | undefined;
  /** Element portals render into (null: document.body). */
  portalRoot: HTMLElement | null;
}

const UIContext = createContext<UIContextValue>({
  kit: undefined,
  theme: undefined,
  density: undefined,
  surface: undefined,
  motion: undefined,
  portalRoot: null,
});

/** Current kit, theme, density and portal target. */
export function useUI(): UIContextValue {
  return useContext(UIContext);
}

/**
 * Sets kit, theme and density for everything inside (they only change attributes, so switching
 * never re-mounts the subtree).
 */
/** True while the colour scheme the page shows is dark (theme prop, kit default, system). */
function useDarkMode(theme: Theme | undefined, kit: Kit | undefined, enabled: boolean): boolean {
  const [systemDark, setSystemDark] = useState(false);
  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const on = () => setSystemDark(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [enabled]);
  if (theme === "dark") return true;
  if (theme === "light") return false;
  if (theme === undefined && kit === "pro") return true;
  return systemDark;
}

const isThemeInput = (t: ThemeValues | ThemeInput): t is ThemeInput =>
  "light" in t || "dark" in t || "radius" in t;

export function UIProvider(p: UIProviderProps) {
  const parent = useUI();
  const scope = p.scope ?? "document";
  // a nested provider keeps what it does not set itself
  const kit = p.kit ?? parent.kit;
  const theme = p.theme ?? parent.theme;
  const density = p.density ?? parent.density;
  const surface = p.surface ?? parent.surface;
  const motion = p.motion ?? parent.motion;
  const perMode = !!p.tokens && isThemeInput(p.tokens);
  const dark = useDarkMode(theme, kit, perMode);
  const vars = useMemo(() => {
    if (!p.tokens) return undefined;
    if (!isThemeInput(p.tokens)) return themeStyle(p.tokens);
    return themeStyle(dark ? p.tokens.dark : p.tokens.light, p.tokens.radius);
  }, [p.tokens, dark]);
  // tokens on <html> for the document scope (portals included); removed when they go away
  useEffect(() => {
    if (scope !== "document" || !vars) return;
    const el = document.documentElement;
    for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
    return () => {
      for (const k of Object.keys(vars)) el.style.removeProperty(k);
    };
  }, [scope, vars]);
  // Attributes the provider set itself; an omitted prop leaves what the page already has (for
  // example a theme set by an inline script before hydration) untouched.
  const owned = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (scope !== "document") return;
    const el = document.documentElement;
    const set = (k: string, v: string | undefined) => {
      if (v) {
        el.setAttribute(k, v);
        owned.current.add(k);
      } else if (owned.current.has(k)) {
        el.removeAttribute(k);
        owned.current.delete(k);
      }
    };
    set("data-kit", p.kit);
    set("data-theme", p.theme);
    set("data-density", p.density);
    set("data-surface", p.surface);
    set("data-motion", p.motion);
  }, [scope, p.kit, p.theme, p.density, p.surface, p.motion]);

  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const ctx = useMemo<UIContextValue>(
    () => ({ kit, theme, density, surface, motion, portalRoot }),
    [kit, theme, density, surface, motion, portalRoot],
  );
  // Derived colours (glass, hover shades, Pro's scale) are worked out where data-theme sits. A
  // subtree with its own tokens needs data-theme too, or they would keep the outer values.
  const subtreeTheme =
    p.theme ?? (vars ? (theme ?? (kit === "pro" ? "dark" : "system")) : undefined);
  const content = p.children;
  if (scope === "subtree") {
    return (
      <UIContext.Provider value={ctx}>
        <div
          className={p.className}
          style={vars ? ({ ...vars, ...p.style } as CSSProperties) : p.style}
          data-kit={p.kit}
          data-theme={subtreeTheme}
          data-density={p.density}
          data-surface={p.surface}
          data-motion={p.motion}
        >
          {content}
          <div ref={setPortalRoot} data-tf-portal="" />
        </div>
      </UIContext.Provider>
    );
  }
  return <UIContext.Provider value={ctx}>{content}</UIContext.Provider>;
}
