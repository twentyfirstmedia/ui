/** Joins class names, skipping anything that is not a non-empty string. */
export function cx(...parts: unknown[]): string {
  return parts.filter((x): x is string => typeof x === "string" && x !== "").join(" ");
}

/** True when the user asked for reduced motion (false on the server). */
export function reduced(): boolean {
  try {
    return (
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  } catch {
    return false;
  }
}

/** Initials for avatars: first letters of up to two words. */
export function initials(name?: string): string {
  return (
    (name || "?")
      .split(/\s+/)
      .filter((s) => /^[A-Za-z0-9À-ɏ]/.test(s))
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

/**
 * Reads a duration token (e.g. `--dur-slow`) in ms from the element or the document, so motion
 * driven from JS follows the active kit (Halo 900ms, Pro 140ms). Falls back on the server.
 */
export function durationToken(name: string, fallback: number, el?: Element | null): number {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = getComputedStyle(el || document.documentElement)
      .getPropertyValue(name)
      .trim();
    if (!raw) return fallback;
    const n = parseFloat(raw);
    if (isNaN(n)) return fallback;
    return raw.endsWith("ms") ? n : raw.endsWith("s") ? n * 1000 : n;
  } catch {
    return fallback;
  }
}
