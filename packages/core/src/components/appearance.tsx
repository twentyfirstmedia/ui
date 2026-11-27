"use client";
import * as React from "react";
import { useStrings } from "../context.js";
import { APPEARANCE_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { cx } from "../cx.js";
import { startViewTransition } from "../motion.js";
import { UIProvider, type Kit, type UIProviderProps } from "../provider.js";
import { useUI } from "../context.js";
import { THEME_PRESETS, brandTheme, themeStyle, type ThemeInput } from "../theme.js";
import { useId } from "../hooks.js";
import { IconButton } from "./foundation.js";
import { Ambient } from "./shell.js";
import { SheetPopover } from "./sheet.js";
import { Popover } from "./overlays.js";
import { Segmented } from "./forms.js";
import { Switch } from "./inputs.js";
import type {
  AmbientProps,
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
const HEX = /^#[0-9a-f]{6}$/i;
/** The variables a brand colour sets (see `brandTheme`). */
const BRAND_VARS = [
  "--primary",
  "--primary-foreground",
  "--ring",
  "--sidebar-primary",
  "--sidebar-primary-foreground",
  "--sidebar-ring",
];

/** The theme for a brand value: a preset's, or `brandTheme` of a hex colour; undefined otherwise. */
export function appearanceBrandTheme(brand: string | undefined): ThemeInput | undefined {
  if (!brand) return undefined;
  if (Object.prototype.hasOwnProperty.call(THEME_PRESETS, brand))
    return THEME_PRESETS[brand]?.theme;
  return HEX.test(brand) ? brandTheme(brand) : undefined;
}

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
    brand:
      typeof v.brand === "string" && appearanceBrandTheme(v.brand)
        ? v.brand
        : v.brand === null
          ? undefined
          : base.brand,
  };
}

/**
 * The UIProvider props for an appearance (`density: "auto"` leaves the kit's own; a brand colour
 * becomes `tokens`).
 */
export function appearanceProps(
  a: Appearance,
): Pick<UIProviderProps, "kit" | "theme" | "density" | "surface" | "motion" | "tokens"> {
  return {
    kit: a.kit,
    theme: a.theme,
    density: a.density === "auto" ? undefined : a.density,
    surface: a.surface,
    motion: a.motion,
    tokens: appearanceBrandTheme(a.brand),
  };
}

/**
 * A script for `<head>` that puts the stored appearance on `<html>` before the first paint, so a
 * reload shows the chosen look at once (Next.js: `<script dangerouslySetInnerHTML={{ __html:
 * appearanceScript("app-appearance") }} />` in the root layout).
 */
export function appearanceScript(storageKey = "tf-appearance"): string {
  // the presets' variables per mode, so a preset colour is there before the first paint too
  const presets: Record<string, [Record<string, string>, Record<string, string>]> = {};
  for (const [k, v] of Object.entries(THEME_PRESETS))
    presets[k] = [themeStyle(v.theme.light), themeStyle(v.theme.dark)];
  return `try{var a=JSON.parse(localStorage.getItem(${JSON.stringify(storageKey)})||"{}"),d=document.documentElement,s=function(k,v,o){if(o.indexOf(v)>=0)d.setAttribute(k,v)};s("data-kit",a.kit,["halo","pro"]);s("data-theme",a.theme,["light","dark","system"]);s("data-density",a.density,["comfortable","compact"]);s("data-surface",a.surface,["solid","glass"]);s("data-motion",a.motion,["standard","expressive","off"]);var b=a.brand,P=${JSON.stringify(presets)},m=a.theme==="dark"||(a.theme!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches),x;if(P[b])x=P[b][m?1:0];else if(/^#[0-9a-f]{6}$/i.test(b)){var l=[1,3,5].map(function(i){var c=parseInt(b.slice(i,i+2),16)/255;return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4)}),L=0.2126*l[0]+0.7152*l[1]+0.0722*l[2],f=(L+0.05)/0.05>=1.05/(L+0.05)?"#111114":"#ffffff";x={"--primary":b,"--ring":b,"--sidebar-primary":b,"--sidebar-ring":b,"--primary-foreground":f,"--sidebar-primary-foreground":f}}for(var k in x)d.style.setProperty(k,x[k])}catch(e){}`;
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
  /** While the reader previews a choice in `AppearanceMenu` (`null` when the preview ends). */
  onPreview?: (patch: Partial<Appearance> | null) => void;
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
      setPreview(null);
    },
    [key],
  );
  // a choice the reader hovers in the menu: shown, not stored
  const [preview, setPreview] = React.useState<Partial<Appearance> | null>(null);
  const onPreview = React.useRef(o.onPreview);
  onPreview.current = o.onPreview;
  const previewAppearance = React.useCallback((patch: Partial<Appearance> | null) => {
    setPreview(patch);
    onPreview.current?.(patch);
  }, []);
  const shown = preview ? { ...appearance, ...preview } : appearance;
  return {
    appearance,
    setAppearance,
    previewAppearance,
    providerProps: appearanceProps(shown),
  };
}

interface AppearanceContextValue {
  appearance: Appearance;
  setAppearance: (patch: Partial<Appearance>) => void;
  previewAppearance?: (patch: Partial<Appearance> | null) => void;
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
  /**
   * With glass on, `Ambient` paints behind the app so the glass has something to show (default
   * true; pass `AmbientProps` for your own colours or a photo, `false` for your own background).
   */
  ambient?: boolean | AmbientProps;
}

/**
 * A `UIProvider` whose look the reader chooses with `AppearanceMenu`: kit, theme, density, glass
 * and motion, kept in this browser (or by `onChange` wherever you keep it).
 */
export function AppearanceProvider(p: AppearanceProviderProps) {
  const {
    defaults,
    initial,
    storageKey,
    onChange,
    onPreview,
    kits,
    ambient,
    tokens,
    children,
    ...rest
  } = p;
  const { appearance, setAppearance, previewAppearance, providerProps } = useAppearance({
    defaults: { ...defaults, kit: defaults?.kit ?? kits?.[0] },
    initial,
    storageKey,
    onChange,
    onPreview,
  });
  const value = React.useMemo(
    () => ({ appearance, setAppearance, previewAppearance, kits }),
    [appearance, setAppearance, previewAppearance, kits],
  );
  const brandTokens = providerProps.tokens;
  // the head script may have put a brand colour on <html>; going back to the kit's own removes it
  const documentScope = (rest.scope ?? "document") === "document";
  React.useEffect(() => {
    if (!documentScope || brandTokens || tokens) return;
    const el = document.documentElement;
    for (const k of BRAND_VARS) el.style.removeProperty(k);
  }, [documentScope, brandTokens, tokens]);
  const glass = providerProps.surface === "glass" && ambient !== false;
  return (
    <AppearanceContext.Provider value={value}>
      <UIProvider {...rest} {...providerProps} tokens={brandTokens ?? tokens}>
        {glass && (
          <Ambient
            fixed={documentScope}
            {...(typeof ambient === "object" ? ambient : null)}
            className={cx(
              "tf-appearance-ambient",
              typeof ambient === "object" && ambient.className,
            )}
          />
        )}
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

const PRESET_KEYS = ["blue", "violet", "emerald", "orange", "rose", "teal"] as const;

/** The brand colour row: the kit's own, the six presets and a custom colour. */
function BrandRow(p: {
  value: string | undefined;
  dark: boolean;
  onChange: (brand: string | undefined) => void;
  onPreview: (brand: string | undefined | null) => void;
}) {
  const t = useStrings(APPEARANCE_STRINGS);
  const name = useId("brand");
  const custom = !!p.value && !Object.prototype.hasOwnProperty.call(THEME_PRESETS, p.value);
  const colorRef = React.useRef<HTMLInputElement>(null);
  const commit = React.useRef(p.onChange);
  commit.current = p.onChange;
  // the picker fires input while dragging (a preview) and change once a colour is chosen
  React.useEffect(() => {
    const el = colorRef.current;
    if (!el) return;
    const done = () => commit.current(el.value);
    el.addEventListener("change", done);
    return () => el.removeEventListener("change", done);
  }, []);
  const swatch = (key: string | undefined, label: string, color: string | undefined) => (
    <label
      key={key ?? "default"}
      className={cx("tf-swatch", !key && "default", p.value === key && "on")}
      style={color ? ({ "--swatch": color } as React.CSSProperties) : undefined}
      title={label}
      onPointerEnter={() => p.onPreview(key)}
    >
      <input
        type="radio"
        name={name}
        className="tf-swatch-input"
        checked={p.value === key}
        aria-label={label}
        onChange={() => p.onChange(key)}
      />
    </label>
  );
  return (
    <div
      className="tf-swatches"
      role="radiogroup"
      aria-label={t.appearanceColor}
      onPointerLeave={() => p.onPreview(null)}
    >
      {swatch(undefined, t.appearanceDefault, undefined)}
      {PRESET_KEYS.map((k) => {
        const theme = THEME_PRESETS[k]?.theme;
        return swatch(k, t.brandColors[k], (p.dark ? theme?.dark : theme?.light)?.primary);
      })}
      <label
        className={cx("tf-swatch", "custom", custom && "on")}
        style={custom ? ({ "--swatch": p.value } as React.CSSProperties) : undefined}
        title={t.appearanceCustom}
      >
        <input
          ref={colorRef}
          type="color"
          className="tf-swatch-input"
          aria-label={t.appearanceCustom}
          value={custom && p.value ? p.value : (THEME_PRESETS.blue?.theme.light?.primary ?? "")}
          onChange={(e) => p.onPreview(e.target.value)}
        />
      </label>
    </div>
  );
}

/**
 * The look menu for the top bar: kit, theme, brand colour, density, motion and glass, behind a sun
 * or moon; a bottom sheet on phones. Reads and writes the nearest `AppearanceProvider`, or `value`
 * and `onChange`.
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
  const preview = (patch: Partial<Appearance> | null) =>
    p.onPreview ? p.onPreview(patch) : ctx?.previewAppearance?.(patch);
  const kits = p.kits ?? ctx?.kits ?? [];
  const rows: AppearanceRow[] = p.rows ?? [
    ...(kits.length > 1 ? (["kit"] as const) : []),
    "theme",
    "brand",
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
  // a segment previews while hovered; leaving the row ends the preview
  const hover = (key: keyof Appearance) => ({
    onPreview: (v: string | null) => preview(v === null ? null : { [key]: v }),
  });
  const Pop = p.sheet === false ? Popover : SheetPopover;
  return (
    <Pop
      className={p.className}
      align={p.align ?? "end"}
      side={p.side}
      open={p.open}
      onOpenChange={(o) => {
        if (!o) preview(null);
        p.onOpenChange?.(o);
      }}
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
                  {...hover("kit")}
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
                  {...hover("theme")}
                />
              </Row>
            );
          if (row === "brand")
            return (
              <Row key={row} label={t.appearanceColor}>
                <BrandRow
                  value={value.brand}
                  dark={dark}
                  onChange={(brand) => change({ brand })}
                  onPreview={(brand) => preview(brand === null ? null : { brand })}
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
                  {...hover("density")}
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
                  {...hover("motion")}
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
    </Pop>
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
