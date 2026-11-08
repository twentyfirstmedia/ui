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
  /** Element portals render into (null: document.body). */
  portalRoot: HTMLElement | null;
}

const UIContext = createContext<UIContextValue>({
  kit: undefined,
  theme: undefined,
  density: undefined,
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
export function UIProvider(p: UIProviderProps) {
  const scope = p.scope ?? "document";
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
  }, [scope, p.kit, p.theme, p.density]);

  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const ctx = useMemo<UIContextValue>(
    () => ({ kit: p.kit, theme: p.theme, density: p.density, portalRoot }),
    [p.kit, p.theme, p.density, portalRoot],
  );
  const content = p.children;
  if (scope === "subtree") {
    return (
      <UIContext.Provider value={ctx}>
        <div
          className={p.className}
          style={p.style}
          data-kit={p.kit}
          data-theme={p.theme}
          data-density={p.density}
        >
          {content}
          <div ref={setPortalRoot} data-tf-portal="" />
        </div>
      </UIContext.Provider>
    );
  }
  return <UIContext.Provider value={ctx}>{content}</UIContext.Provider>;
}
