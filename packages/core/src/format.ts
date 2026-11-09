/**
 * Numbers, money, percentages and dates, formatted with Intl. English (en-US) by default; every
 * helper takes an optional BCP 47 locale as its last argument, and components use the locale of
 * the nearest `UIProvider` (see `useFormat`). Money defaults to euros; calendars start on Monday.
 */
export const LOCALE = "en-US";
export const CURRENCY = "EUR";
/** First day of the week in calendars: 0 Sunday … 6 Saturday. */
export const WEEK_START = 1;

export function formatNumber(v: number, o?: Intl.NumberFormatOptions, locale?: string): string {
  try {
    return new Intl.NumberFormat(locale || LOCALE, o).format(v);
  } catch {
    return String(v);
  }
}

export function formatMoney(
  v: number,
  currency?: string | null,
  o?: Intl.NumberFormatOptions,
  locale?: string,
): string {
  return formatNumber(
    v,
    {
      style: "currency",
      currency: currency || CURRENCY,
      minimumFractionDigits: v % 1 ? 2 : 0,
      maximumFractionDigits: 2,
      ...o,
    },
    locale,
  );
}

/** A share in percent: `19` → "19%". */
export function formatPercent(v: number, o?: Intl.NumberFormatOptions, locale?: string): string {
  return formatNumber(v / 100, { style: "percent", maximumFractionDigits: 0, ...o }, locale);
}

export function formatDate(
  input: Date | string | number,
  o?: Intl.DateTimeFormatOptions,
  locale?: string,
): string {
  const d = input instanceof Date ? input : new Date(input);
  try {
    return new Intl.DateTimeFormat(
      locale || LOCALE,
      o || { day: "2-digit", month: "2-digit", year: "numeric" },
    ).format(d);
  } catch {
    return d.toDateString();
  }
}

/** The group and decimal separators of a locale: `en-US` → `{ group: ",", decimal: "." }`. */
export function numberSeparators(locale?: string): { group: string; decimal: string } {
  let group = ",",
    decimal = ".";
  try {
    for (const part of new Intl.NumberFormat(locale || LOCALE).formatToParts(12345.6)) {
      if (part.type === "group") group = part.value;
      else if (part.type === "decimal") decimal = part.value;
    }
  } catch {
    // keep the English separators
  }
  return { group, decimal };
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** A number inside a formatted string, as `parseFormatted` finds it. */
export interface FormattedNumber {
  /** Text before the number ("€", "+"). */
  prefix: string;
  value: number;
  /** Digits after the decimal separator. */
  decimals: number;
  /** Whether the number used group separators ("1,305"). */
  grouped: boolean;
  /** Text after the number (" €/m²", "%"). */
  suffix: string;
}

/**
 * Finds the first number in a string formatted for `locale` and returns it with the text around
 * it: `parseFormatted("13,05 €/m²", "de-DE")` → `{ prefix: "", value: 13.05, decimals: 2, … }`.
 * Group separators are only taken between digits; a space or no-break space counts as a group
 * separator for locales that group with one.
 */
export function parseFormatted(input: string | number, locale?: string): FormattedNumber | null {
  if (typeof input === "number") {
    if (!Number.isFinite(input)) return null;
    const s = String(input);
    if (/e/i.test(s)) return null;
    return {
      prefix: "",
      value: input,
      decimals: (s.split(".")[1] || "").length,
      grouped: false,
      suffix: "",
    };
  }
  const { group, decimal } = numberSeparators(locale);
  // narrow and regular no-break spaces both appear as group separators (fr, de-CH …)
  const groups = /^\s$/.test(group) ? "[\\s\\u00a0\\u202f]" : escape(group);
  const re = new RegExp(
    `^([^0-9-]*)(-?[0-9](?:[0-9]|${groups}(?=[0-9]))*)(?:${escape(decimal)}([0-9]+))?(.*)$`,
    "s",
  );
  const m = re.exec(input);
  if (!m) return null;
  const int = (m[2] as string).replace(new RegExp(groups, "g"), "");
  const frac = m[3] ?? "";
  return {
    prefix: m[1] ?? "",
    value: parseFloat(frac ? `${int}.${frac}` : int),
    decimals: frac.length,
    grouped: int.length !== (m[2] as string).length,
    suffix: m[4] ?? "",
  };
}

/** Writes a number back in the shape `parseFormatted` found it in (same decimals, grouping, text). */
export function formatLike(v: number, shape: FormattedNumber, locale?: string): string {
  const s = formatNumber(
    v,
    {
      minimumFractionDigits: shape.decimals,
      maximumFractionDigits: shape.decimals,
      useGrouping: shape.grouped,
    },
    locale,
  );
  return shape.prefix + s + shape.suffix;
}
