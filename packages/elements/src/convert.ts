/** Attribute strings → prop values, by the prop's kind (see registry-types.ts). */
import type { PropDef } from "./registry-types.js";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}(?:[T ][\d:.]+(?:Z|[+-]\d{2}:?\d{2})?)?$/;
const NUMERIC = /^\s*-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?\s*$/i;

function toDate(v: string): Date | undefined {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** JSON with ISO date strings turned into Date objects. */
function reviveDates(_key: string, v: unknown): unknown {
  return typeof v === "string" && ISO_DATE.test(v) ? (toDate(v) ?? v) : v;
}

export function fromAttribute(p: PropDef, v: string | null): unknown {
  if (v === null) return undefined;
  const nullable = p.flags.includes("?");
  if (nullable && v === "null") return null;
  switch (p.kind) {
    case "b":
      return v !== "false";
    case "n": {
      if (!NUMERIC.test(v)) return undefined;
      return Number(v);
    }
    case "x":
      return NUMERIC.test(v) ? Number(v) : v;
    case "s":
      return p.flags.includes("!") && v === "false" ? false : v;
    case "d":
      return toDate(v);
    case "r":
      return v;
    case "R":
    case "K":
    case "j": {
      const t = v.trim();
      try {
        return JSON.parse(t, p.flags.includes("t") ? reviveDates : undefined) as unknown;
      } catch {
        if (p.kind === "R") return [v];
        if (p.flags.includes("t") && ISO_DATE.test(t)) return toDate(t);
        if (p.flags.includes("l"))
          return t
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        // a plain string for props that also take one (`value="Berlin"` on a combobox)
        return v;
      }
    }
    default:
      return undefined;
  }
}

/** `style="gap: 8px; --tint: var(--sky)"` → `{ gap: "8px", "--tint": "var(--sky)" }` */
export function parseStyle(css: string | null): Record<string, string> | undefined {
  if (!css || !css.trim()) return undefined;
  const out: Record<string, string> = {};
  for (const part of css.split(/;(?![^(]*\))/)) {
    const i = part.indexOf(":");
    if (i < 0) continue;
    const prop = part.slice(0, i).trim();
    const value = part.slice(i + 1).trim();
    if (!prop || !value) continue;
    out[
      prop.startsWith("--") ? prop : prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    ] = value;
  }
  return out;
}

/** React synthetic events become what a DOM user wants: the value (or `checked`) of the control. */
export function normalizeArg(a: unknown): unknown {
  if (!a || typeof a !== "object" || !("nativeEvent" in a) || !("target" in a)) return a;
  const t = (a as { target: unknown }).target;
  if (t instanceof HTMLInputElement && (t.type === "checkbox" || t.type === "radio"))
    return t.checked;
  if (
    t instanceof HTMLInputElement ||
    t instanceof HTMLSelectElement ||
    t instanceof HTMLTextAreaElement
  )
    return t.value;
  return null;
}

export function isSyntheticEvent(a: unknown): a is { nativeEvent: Event } {
  return !!a && typeof a === "object" && "nativeEvent" in a && "target" in a;
}
