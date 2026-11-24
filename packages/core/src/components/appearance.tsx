"use client";
import * as React from "react";
import { useStrings } from "../context.js";
import { APPEARANCE_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { cx } from "../cx.js";
import { startViewTransition } from "../motion.js";
import { UIProvider, type Kit, type UIProviderProps } from "../provider.js";
import { useUI } from "../context.js";
import { IconButton } from "./foundation.js";
import { Popover } from "./overlays.js";
import { Segmented } from "./forms.js";
import { Switch } from "./inputs.js";
import type {
  Appearance,
  AppearanceMenuProps,
  AppearanceRow,
  SearchTriggerProps,
} from "./types.js";

/** The look an app starts with: the system's theme, the kit's density, solid, standard motion. */
export const DEFAULT_APPEARANCE: Appearance = {
  theme: "system",
  density: "auto",
  surface: "solid",
  motion: "standard",
};

const THEMES = ["system", "light", "dark"];
const DENSITIES = ["auto", "comfortable", "compact"];
const SURFACES = ["solid", "glass"];
const MOTIONS = ["standard", "expressive", "off"];
const KITS = ["halo", "pro"];

/** A stored or server value → a complete appearance; unknown fields fall back to the defaults. */
export function parseAppearance(value: unknown, defaults?: Partial<Appearance>): Appearance {
  const base: Appearance = { ...DEFAULT_APPEARANCE, ...defaults };
  if (!value || typeof value !== "object") return base;
  const v = value as Record<string, unknown>;
  const pick = <T,>(key: string, allowed: string[], fallback: T): T =>
    typeof v[key] === "string" && allowed.includes(v[key] as string) ? (v[key] as T) : fallback;
  return {
    kit: pick<Kit | undefined>("kit", KITS, base.kit),
    theme: pick("theme", THEMES, base.theme),
    density: pick("density", DENSITIES, base.density),
    surface: pick("surface", SURFACES, base.surface),
    motion: pick("motion", MOTIONS, base.motion),
  };
}

/** The UIProvider props for an appearance (`density: "auto"` leaves the kit's own). */
export function appearanceProps(
  a: Appearance,
): Pick<UIProviderProps, "kit" | "theme" | "density" | "surface" | "motion"> {
  return {
    kit: a.kit,
    theme: a.theme,
    density: a.density === "auto" ? undefined : a.density,
    surface: a.surface,
    motion: a.motion,
  };
}

/**
 * A script for `<head>` that puts the stored appearance on `<html>` before the first paint, so a
 * reload shows the chosen look at once (Next.js: `<script dangerouslySetInnerHTML={{ __html:
 * appearanceScript("app-appearance") }} />` in the root layout).
 */
export function appearanceScript(storageKey = "tf-appearance"): string {
  return `try{var a=JSON.parse(localStorage.getItem(${JSON.stringify(storageKey)})||"{}"),d=document.documentElement,s=function(k,v,o){if(o.indexOf(v)>=0)d.setAttribute(k,v)};s("data-kit",a.kit,["halo","pro"]);s("data-theme",a.theme,["light","dark","system"]);s("data-density",a.density,["comfortable","compact"]);s("data-surface",a.surface,["solid","glass"]);s("data-motion",a.motion,["standard","expressive","off"])}catch(e){}`;
}

export interface UseAppearanceOptions {
  /** The look before the reader chose one (and for fields the stored value lacks). */
  defaults?: Partial<Appearance>;
  /** A value you keep yourself, e.g. per account on the server; wins over the stored one. */
  initial?: Partial<Appearance>;
  /** Where the choice is kept in this browser (default `"tf-appearance"`; `false`: nowhere). */
  storageKey?: string | false;
  /** After every change, e.g. to save it for the account. */
  onChange?: (next: Appearance, patch: Partial<Appearance>) => void;
}

function readStored(key: string | false): unknown {
  if (!key || typeof localStorage === "undefined") return undefined;
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return undefined;
  }
}

/**
 * The reader's choice of look, kept in this browser (or where you keep it), with a cross-fade when
 * kit or theme change. Spread `providerProps` on a `UIProvider`, or use `AppearanceProvider`.
 */
export function useAppearance(o: UseAppearanceOptions = {}) {
  const key = o.storageKey === undefined ? "tf-appearance" : o.storageKey;
  const [appearance, setState] = React.useState<Appearance>(() =>
    parseAppearance(o.initial, o.defaults),
  );
  // the stored choice is read after the first render, so server and client markup agree
  React.useEffect(() => {
    if (o.initial) return;
    const stored = readStored(key);
    if (stored) setState(parseAppearance(stored, o.defaults));
  }, [key]);
  const latest = React.useRef(appearance);
  latest.current = appearance;
  const onChange = React.useRef(o.onChange);
  onChange.current = o.onChange;
  const setAppearance = React.useCallback(
    (patch: Partial<Appearance>) => {
      const next = { ...latest.current, ...patch };
      latest.current = next;
      const apply = () => setState(next);
      // kit and theme cross-fade instead of jumping (nothing where unsupported or motion is off)
      if (patch.kit || patch.theme) void startViewTransition(apply);
      else apply();
      if (key)
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* storage may be off */
        }
      onChange.current?.(next, patch);
    },
    [key],
  );
  return { appearance, setAppearance, providerProps: appearanceProps(appearance) };
}

interface AppearanceContextValue {
  appearance: Appearance;
  setAppearance: (patch: Partial<Appearance>) => void;
  kits?: Kit[];
}
const AppearanceContext = React.createContext<AppearanceContextValue | null>(null);

/** The nearest `AppearanceProvider`'s look and setter (null outside one). */
export function useAppearanceContext(): AppearanceContextValue | null {
  return React.useContext(AppearanceContext);
}

export interface AppearanceProviderProps
  extends
    UseAppearanceOptions,
    Omit<UIProviderProps, "kit" | "theme" | "density" | "surface" | "motion"> {
  /** Kits the reader may choose between (load both with `themes.css`); one or none hides the row. */
  kits?: Kit[];
}

/**
 * A `UIProvider` whose look the reader chooses with `AppearanceMenu`: kit, theme, density, glass
 * and motion, kept in this browser (or by `onChange` wherever you keep it).
 */
export function AppearanceProvider(p: AppearanceProviderProps) {
  const { defaults, initial, storageKey, onChange, kits, children, ...rest } = p;
  const { appearance, setAppearance, providerProps } = useAppearance({
    defaults: { ...defaults, kit: defaults?.kit ?? kits?.[0] },
    initial,
    storageKey,
    onChange,
  });
  const value = React.useMemo(
    () => ({ appearance, setAppearance, kits }),
    [appearance, setAppearance, kits],
  );
  return (
    <AppearanceContext.Provider value={value}>
      <UIProvider {...rest} {...providerProps}>
        {children}
      </UIProvider>
    </AppearanceContext.Provider>
  );
}

function Row(p: { label: string; children: React.ReactNode }) {
  return (
    <div className="tf-appearance-row">
      <div className="tf-appearance-label">{p.label}</div>
      {p.children}
    </div>
  );
}

/**
 * The look menu for the top bar: kit, theme, density, motion and glass, behind a sun or moon.
 * Reads and writes the nearest `AppearanceProvider`, or `value` and `onChange`.
 */
export function AppearanceMenu(p: AppearanceMenuProps) {
  const t = useStrings(APPEARANCE_STRINGS);
  const ui = useUI();
  const ctx = useAppearanceContext();
  const value: Appearance = p.value ??
    ctx?.appearance ?? {
      kit: ui.kit,
      theme: ui.theme ?? "system",
      density: ui.density ?? "auto",
      surface: ui.surface ?? "solid",
      motion: ui.motion ?? "standard",
    };
  const change = (patch: Partial<Appearance>) =>
    p.onChange ? p.onChange(patch) : ctx?.setAppearance(patch);
  const kits = p.kits ?? ctx?.kits ?? [];
  const rows: AppearanceRow[] = p.rows ?? [
    ...(kits.length > 1 ? (["kit"] as const) : []),
    "theme",
    "density",
    "motion",
    "surface",
  ];
  const dark =
    value.theme === "dark" ||
    (value.theme === "system" &&
      typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-color-scheme: dark)").matches);
  const name = (k: Kit) => (k === "pro" ? "Pro" : "Halo");
  return (
    <Popover
      className={p.className}
      align={p.align ?? "end"}
      side={p.side}
      open={p.open}
      onOpenChange={p.onOpenChange}
      width={300}
      role="dialog"
      label={t.appearance}
      trigger={({ open, toggle }) => (
        <IconButton
          icon={dark ? "moon" : "sun"}
          label={t.appearance}
          variant="ghost"
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={toggle}
        />
      )}
    >
      <div className="tf-appearance" style={p.style}>
        <div className="tf-appearance-head">
          <strong>{t.appearance}</strong>
          <small>{p.hint ?? t.appearanceHint}</small>
        </div>
        {rows.map((row) => {
          if (row === "kit")
            return (
              <Row key={row} label={t.appearanceStyle}>
                <Segmented
                  block
                  size="sm"
                  label={t.appearanceStyle}
                  value={value.kit ?? kits[0]}
                  onChange={(v) => change({ kit: v as Kit })}
                  options={kits.map((k) => ({ value: k, label: name(k) }))}
                />
              </Row>
            );
          if (row === "theme")
            return (
              <Row key={row} label={t.appearanceTheme}>
                <Segmented
                  block
                  size="sm"
                  label={t.appearanceTheme}
                  value={value.theme}
                  onChange={(v) => change({ theme: v as Appearance["theme"] })}
                  options={[
                    { value: "system", label: t.appearanceAuto },
                    { value: "light", label: t.appearanceLight },
                    { value: "dark", label: t.appearanceDark },
                  ]}
                />
              </Row>
            );
          if (row === "density")
            return (
              <Row key={row} label={t.appearanceDensity}>
                <Segmented
                  block
                  size="sm"
                  label={t.appearanceDensity}
                  value={value.density}
                  onChange={(v) => change({ density: v as Appearance["density"] })}
                  options={[
                    { value: "auto", label: t.appearanceAuto },
                    { value: "comfortable", label: t.appearanceRoomy },
                    { value: "compact", label: t.appearanceCompact },
                  ]}
                />
              </Row>
            );
          if (row === "motion")
            return (
              <Row key={row} label={t.appearanceMotion}>
                <Segmented
                  block
                  size="sm"
                  label={t.appearanceMotion}
                  value={value.motion}
                  onChange={(v) => change({ motion: v as Appearance["motion"] })}
                  options={[
                    { value: "standard", label: t.appearanceNormal },
                    { value: "expressive", label: t.appearanceLively },
                    { value: "off", label: t.appearanceOff },
                  ]}
                />
              </Row>
            );
          return (
            <Switch
              key={row}
              spread
              checked={value.surface === "glass"}
              onChange={(e) => change({ surface: e.target.checked ? "glass" : "solid" })}
            >
              {t.appearanceGlass}
            </Switch>
          );
        })}
      </div>
    </Popover>
  );
}

/**
 * A search field that opens your search (a `CommandPalette`) instead of taking text: for the top
 * bar's `topStart`. On a phone pass an `IconButton` as `topStartCompact`.
 */
export function SearchTrigger(p: SearchTriggerProps) {
  const t = useStrings();
  const key = p.bindShortcut && p.shortcut ? p.shortcut.trim().slice(-1).toLowerCase() : "";
  const open = React.useRef(p.onClick);
  open.current = p.onClick;
  React.useEffect(() => {
    if (!key) return;
    const k = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.key.toLowerCase() !== key) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      e.preventDefault();
      open.current?.();
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [key]);
  const text = p.placeholder || t.search;
  return (
    <button
      type="button"
      className={cx("tf-search", "tf-search-trigger", p.className)}
      style={p.style}
      aria-label={p.label}
      aria-haspopup="dialog"
      aria-keyshortcuts={key ? `Meta+${key.toUpperCase()} Control+${key.toUpperCase()}` : undefined}
      onClick={p.onClick}
    >
      <Icon name="search" size={15} />
      <span className="tf-search-trigger-text">{text}</span>
      {p.shortcut && (
        <span className="tf-kbd" aria-hidden>
          {p.shortcut}
        </span>
      )}
    </button>
  );
}
