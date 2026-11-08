/** Joins class names, skipping falsy values. */
export function cx(...parts: Array<string | false | null | undefined | 0>): string {
  return parts.filter(Boolean).join(" ");
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
