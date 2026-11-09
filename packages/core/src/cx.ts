/** Joins class names, skipping anything that is not a non-empty string. */
export function cx(...parts: unknown[]): string {
  return parts.filter((x): x is string => typeof x === "string" && x !== "").join(" ");
}

/**
 * True when motion is off for `el` (or the page): the reader asked for reduced motion, or the
 * nearest `data-motion` says "off". False on the server.
 */
export function reduced(el?: Element | null): boolean {
  try {
    if (typeof window === "undefined") return false;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return true;
    const host = (el ?? document.documentElement).closest("[data-motion]");
    return host?.getAttribute("data-motion") === "off";
  } catch {
    return false;
  }
}

/** The entrance delay of the card `el` sits in (Stagger, `tf-in`), in ms. */
export function enterDelay(el?: Element | null): number {
  try {
    const host = el?.closest(".tf-stagger > *, .tf-in");
    if (!host) return 0;
    const d = getComputedStyle(host).animationDelay.split(",")[0]?.trim() ?? "";
    const n = parseFloat(d);
    return isNaN(n) ? 0 : d.endsWith("ms") ? n : n * 1000;
  } catch {
    return 0;
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
