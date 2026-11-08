/**
 * Numbers, money, percentages and dates, formatted with Intl in English (en-US). Money defaults
 * to euros; calendars start on Monday.
 */
export const LOCALE = "en-US";
export const CURRENCY = "EUR";
/** First day of the week in calendars: 0 Sunday … 6 Saturday. */
export const WEEK_START = 1;

export function formatNumber(v: number, o?: Intl.NumberFormatOptions): string {
  try {
    return new Intl.NumberFormat(LOCALE, o).format(v);
  } catch {
    return String(v);
  }
}

export function formatMoney(
  v: number,
  currency?: string | null,
  o?: Intl.NumberFormatOptions,
): string {
  return formatNumber(v, {
    style: "currency",
    currency: currency || CURRENCY,
    minimumFractionDigits: v % 1 ? 2 : 0,
    maximumFractionDigits: 2,
    ...o,
  });
}

/** A share in percent: `19` → "19%". */
export function formatPercent(v: number, o?: Intl.NumberFormatOptions): string {
  return formatNumber(v / 100, { style: "percent", maximumFractionDigits: 0, ...o });
}

export function formatDate(input: Date | string | number, o?: Intl.DateTimeFormatOptions): string {
  const d = input instanceof Date ? input : new Date(input);
  try {
    return new Intl.DateTimeFormat(
      LOCALE,
      o || { day: "2-digit", month: "2-digit", year: "numeric" },
    ).format(d);
  } catch {
    return d.toDateString();
  }
}
