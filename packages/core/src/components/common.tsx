"use client";
/**
 * Small pieces several features share: BulkActionBar (the selection bar of DataTable, standalone),
 * DaySeparator (a day or "new messages" line in a thread or list) and Highlight (marks search
 * terms in text).
 */
import * as React from "react";
import { Icon } from "../Icon.js";
import { cx } from "../cx.js";
import { useFormat, useStrings } from "../context.js";
import { COMMON_STRINGS } from "../strings.js";
import type { BulkActionBarProps, DaySeparatorProps, HighlightProps } from "./types.js";

/* ── BulkActionBar ── */
export function BulkActionBar(p: BulkActionBarProps) {
  const t = useStrings(COMMON_STRINGS);
  const { formatNumber } = useFormat();
  if (p.count <= 0 && !p.keepOpen) return null;
  return (
    <div
      className={cx("tf-bulkbar", p.floating === false && "inline", p.className)}
      style={p.style}
      role="toolbar"
      aria-label={p.label || t.bulkActions}
    >
      <b aria-live="polite">{t.selectedCount(p.count, formatNumber(p.count))}</b>
      {p.onClear && (
        <button type="button" className="tf-linkbtn on-frame" onClick={p.onClear}>
          {t.clear}
        </button>
      )}
      <div className="tf-bulkbar-actions">
        {(p.actions || []).map((a) => (
          <button
            key={a.id || a.label}
            type="button"
            className={cx("tf-bulk-btn", a.danger && "danger")}
            disabled={a.disabled}
            onClick={a.onClick}
          >
            {a.icon && <Icon name={a.icon} size={14} />}
            {a.label}
          </button>
        ))}
        {p.children}
      </div>
    </div>
  );
}

/* ── DaySeparator ── */
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export function DaySeparator(p: DaySeparatorProps) {
  const t = useStrings(COMMON_STRINGS);
  const { formatDate } = useFormat();
  let text = p.label;
  if (!text && p.date !== undefined) {
    const d = new Date(p.date);
    const now = p.now !== undefined ? new Date(p.now) : new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (dayKey(d) === dayKey(now)) text = t.today;
    else if (dayKey(d) === dayKey(yesterday)) text = t.yesterday;
    else
      text = formatDate(d, {
        weekday: "long",
        day: "numeric",
        month: "long",
        ...(d.getFullYear() !== now.getFullYear() ? { year: "numeric" } : {}),
      });
  }
  return (
    <div
      className={cx(
        "tf-sep",
        "labelled",
        "tf-daysep",
        p.tone === "accent" && "accent",
        p.className,
      )}
      style={p.style}
      role="separator"
      aria-label={text}
    >
      <span>{text}</span>
    </div>
  );
}

/* ── Highlight ── */
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Splits `text` into plain parts and the parts that match one of `terms` (case-insensitive). */
export function highlightParts(text: string, terms: string[]): { text: string; hit: boolean }[] {
  const words = terms.map((w) => w.trim()).filter(Boolean);
  if (!words.length) return [{ text, hit: false }];
  // longer terms first, so "invoice" wins over "in"
  words.sort((a, b) => b.length - a.length);
  const re = new RegExp("(" + words.map(escapeRe).join("|") + ")", "gi");
  return String(text)
    .split(re)
    .filter((part) => part !== "")
    .map((part) => ({
      text: part,
      hit: words.some((w) => w.toLowerCase() === part.toLowerCase()),
    }));
}

export function Highlight(p: HighlightProps) {
  const terms =
    p.terms ?? (p.query ? (p.exact ? [p.query] : p.query.split(/\s+/)) : ([] as string[]));
  return (
    <span className={cx("tf-highlight", p.className)} style={p.style}>
      {highlightParts(p.text, terms).map((part, i) =>
        part.hit ? (
          <mark key={i}>{part.text}</mark>
        ) : (
          <React.Fragment key={i}>{part.text}</React.Fragment>
        ),
      )}
    </span>
  );
}
