"use client";
/**
 * Finance: InvoiceEditor (line items with several VAT rates and discounts beside a live
 * InvoicePreview), ImportSuggestions (bank statement lines with suggested bookings, confirmed in
 * one step) and PeriodLock (a month's state, locked and unlocked). `invoiceTotals` does the sums
 * with rounding per line and per rate, so the editor, the preview and your server agree.
 */
import * as React from "react";
import { cx } from "../cx.js";
import { useFormat, useStrings } from "../context.js";
import { FINANCE_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { registerIcons } from "../icons.js";
import { lockOpen } from "../icon-library.js";
import { parseFormatted } from "../format.js";
import { useControlled, useId, useWidth } from "../hooks.js";
import { Badge, Button, IconButton } from "./foundation.js";
import { cbox } from "./inputs.js";
import { Combobox } from "./forms.js";
import { ConfirmDialog } from "./feedback.js";
import { Tabs } from "./navigation.js";
import { InvoicePreview } from "./workspace.js";
import { invoiceTotals } from "../invoice.js";
import type {
  ImportSuggestionsProps,
  InvoiceDraft,
  InvoiceDraftLine,
  InvoiceEditorProps,
  PeriodLockProps,
} from "./types.js";

registerIcons({ lockOpen });

/* ── InvoiceEditor ── */

const DEFAULT_RATES: { value: number; label?: string }[] = [
  { value: 19 },
  { value: 7 },
  { value: 0 },
];
let lineSeq = 0;
const newLineId = () => `line-${Date.now().toString(36)}-${++lineSeq}`;

/** A number field that keeps what is typed ("12,5") until it leaves, in the provider's locale. */
function NumberCell(p: {
  value: number | undefined;
  onChange: (n: number) => void;
  label: string;
  className?: string;
  digits?: number;
  disabled?: boolean;
}) {
  const { locale, formatNumber } = useFormat();
  const show = (n: number | undefined) =>
    n == null || Number.isNaN(n)
      ? ""
      : formatNumber(n, { maximumFractionDigits: p.digits ?? 2, useGrouping: false });
  const [text, setText] = React.useState<string | null>(null);
  return (
    <input
      className={cx("tf-input", "tf-inv-num", p.className)}
      inputMode="decimal"
      aria-label={p.label}
      disabled={p.disabled}
      value={text ?? show(p.value)}
      onFocus={() => setText(show(p.value))}
      onChange={(e) => {
        const v = e.target.value;
        setText(v);
        const parsed = v.trim() === "" ? 0 : parseFormatted(v, locale)?.value;
        if (parsed != null && !Number.isNaN(parsed)) p.onChange(parsed);
      }}
      onBlur={() => setText(null)}
    />
  );
}

export function InvoiceEditor(p: InvoiceEditorProps) {
  const t = useStrings(FINANCE_STRINGS);
  const { formatMoney, formatPercent } = useFormat();
  const uid = useId("inv");
  const [value, setValue] = useControlled<InvoiceDraft>(
    p.value,
    p.defaultValue ?? { lines: [] },
    p.onChange,
  );
  const rates = p.vatRates ?? DEFAULT_RATES;
  const money = (n: number) => formatMoney(n, p.currency ?? null, { minimumFractionDigits: 2 });
  const pct = (n: number) => formatPercent(n, { maximumFractionDigits: 2 });
  const totals = invoiceTotals(value.lines, { discount: value.discount });
  const [ref, width] = useWidth<HTMLDivElement>(undefined, 1200);
  // side by side when there is room, the preview under the form below `stackBelow`, tabs on phones
  const stacked = width < (p.stackBelow ?? 1100);
  const narrow = width < 640;
  const [tab, setTab] = React.useState(t.invoiceEdit);
  const lineDiscounts = p.lineDiscounts !== false;
  const customer = (p.customers || []).find((c) => c.id === value.customer);

  const patch = (next: Partial<InvoiceDraft>) => setValue({ ...value, ...next });
  const setLine = (id: string, next: Partial<InvoiceDraftLine>) =>
    patch({ lines: value.lines.map((l) => (l.id === id ? { ...l, ...next } : l)) });
  const addLine = () =>
    patch({
      lines: [
        ...value.lines,
        p.newLine?.() ?? {
          id: newLineId(),
          description: "",
          quantity: 1,
          price: 0,
          vat: rates[0]?.value ?? 0,
          ...(p.units?.length ? { unit: p.units[0] } : {}),
        },
      ],
    });
  const removeLine = (id: string) => patch({ lines: value.lines.filter((l) => l.id !== id) });

  const editor = (
    <div className="tf-inv-form">
      {(p.customers || p.head) && (
        <div className="tf-inv-head">
          {p.customers && (
            <div className="tf-inv-customer">
              <Combobox
                label={t.invoiceCustomer}
                placeholder={t.invoicePickCustomer}
                options={p.customers.map((c) => ({ value: c.id, label: c.name, hint: c.detail }))}
                value={value.customer ?? null}
                onChange={(v) => patch({ customer: (v as string | null) ?? null })}
              />
              {p.customerAction}
            </div>
          )}
          {p.head}
        </div>
      )}
      <div
        className={cx("tf-inv-lines", p.units?.length && "has-unit", lineDiscounts && "has-disc")}
        role="group"
        aria-label={t.invoiceLines}
      >
        <div className="tf-inv-row tf-inv-th" aria-hidden>
          <span>{t.invoiceDescription}</span>
          <span>{t.invoiceQuantity}</span>
          {p.units?.length ? <span>{t.invoiceUnit}</span> : null}
          <span>{t.invoicePrice}</span>
          <span>{t.vat}</span>
          {lineDiscounts && <span>{t.invoiceLineDiscount}</span>}
          <span className="end">{t.invoiceAmount}</span>
          <span />
        </div>
        {value.lines.map((l, i) => {
          const n = i + 1;
          return (
            <div key={l.id} className="tf-inv-row" data-line={n}>
              <label className="tf-inv-cell desc">
                <span className="tf-inv-label">{t.invoiceDescription}</span>
                <input
                  className="tf-input"
                  aria-label={`${t.invoiceDescription} ${n}`}
                  value={l.description}
                  placeholder={t.invoiceDescriptionPlaceholder}
                  disabled={p.readOnly}
                  onChange={(e) => setLine(l.id, { description: e.target.value })}
                />
              </label>
              <label className="tf-inv-cell">
                <span className="tf-inv-label">{t.invoiceQuantity}</span>
                <NumberCell
                  label={`${t.invoiceQuantity} ${n}`}
                  value={l.quantity}
                  digits={3}
                  disabled={p.readOnly}
                  onChange={(q) => setLine(l.id, { quantity: q })}
                />
              </label>
              {p.units?.length ? (
                <label className="tf-inv-cell">
                  <span className="tf-inv-label">{t.invoiceUnit}</span>
                  <select
                    className="tf-input"
                    aria-label={`${t.invoiceUnit} ${n}`}
                    value={l.unit ?? p.units[0]}
                    disabled={p.readOnly}
                    onChange={(e) => setLine(l.id, { unit: e.target.value })}
                  >
                    {p.units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              <label className="tf-inv-cell">
                <span className="tf-inv-label">{t.invoicePrice}</span>
                <NumberCell
                  label={`${t.invoicePrice} ${n}`}
                  value={l.price}
                  disabled={p.readOnly}
                  onChange={(v) => setLine(l.id, { price: v })}
                />
              </label>
              <label className="tf-inv-cell">
                <span className="tf-inv-label">{t.vat}</span>
                <select
                  className="tf-input"
                  aria-label={`${t.vat} ${n}`}
                  value={String(l.vat)}
                  disabled={p.readOnly}
                  onChange={(e) => setLine(l.id, { vat: Number(e.target.value) })}
                >
                  {rates.map((r) => (
                    <option key={r.value} value={String(r.value)}>
                      {r.label ?? pct(r.value)}
                    </option>
                  ))}
                </select>
              </label>
              {lineDiscounts && (
                <label className="tf-inv-cell">
                  <span className="tf-inv-label">{t.invoiceLineDiscount}</span>
                  <NumberCell
                    label={`${t.invoiceLineDiscount} ${n}`}
                    value={l.discount ?? 0}
                    disabled={p.readOnly}
                    onChange={(v) => setLine(l.id, { discount: Math.min(100, Math.max(0, v)) })}
                  />
                </label>
              )}
              <span className="tf-inv-cell amount">
                <span className="tf-inv-label">{t.invoiceAmount}</span>
                <b className="tf-num">{money(totals.lines[i] ?? 0)}</b>
              </span>
              <span className="tf-inv-cell tools">
                {!p.readOnly && (
                  <IconButton
                    icon="trash"
                    variant="ghost"
                    size="sm"
                    label={t.invoiceRemoveLine(n)}
                    onClick={() => removeLine(l.id)}
                  />
                )}
              </span>
            </div>
          );
        })}
        {!value.lines.length && <p className="tf-card-desc tf-inv-empty">{t.invoiceNoLines}</p>}
      </div>
      {!p.readOnly && (
        <div>
          <Button variant="soft" size="sm" icon="plus" onClick={addLine}>
            {t.invoiceAddLine}
          </Button>
        </div>
      )}
      <div className="tf-inv-foot">
        <div className="tf-inv-note">
          {p.notes !== false && (
            <label className="tf-col" style={{ gap: 6 }}>
              <span className="tf-label" id={uid + "-note"}>
                {t.invoiceNote}
              </span>
              <textarea
                className="tf-input"
                rows={3}
                aria-labelledby={uid + "-note"}
                value={value.note ?? ""}
                disabled={p.readOnly}
                onChange={(e) => patch({ note: e.target.value })}
              />
            </label>
          )}
          {p.footnote && <p className="tf-card-desc">{p.footnote}</p>}
        </div>
        <dl className="tf-inv-totals" aria-label={t.invoiceTotals}>
          <div>
            <dt>{t.subtotal}</dt>
            <dd className="tf-num">{money(totals.subtotal)}</dd>
          </div>
          {p.invoiceDiscount !== false && (
            <div className="tf-inv-discount">
              <dt>
                <label htmlFor={uid + "-disc"}>{t.invoiceDiscountPct}</label>
              </dt>
              <dd>
                <NumberCell
                  label={t.invoiceDiscountPct}
                  value={value.discount ?? 0}
                  disabled={p.readOnly}
                  onChange={(v) => patch({ discount: Math.min(100, Math.max(0, v)) })}
                />
                {totals.discount !== 0 && (
                  <span className="tf-num">{"−" + money(totals.discount)}</span>
                )}
              </dd>
            </div>
          )}
          {totals.rates.map((r) => (
            <div key={r.rate}>
              <dt>{t.invoiceVatOn(pct(r.rate), money(r.net))}</dt>
              <dd className="tf-num">{money(r.vat)}</dd>
            </div>
          ))}
          <div className="grand">
            <dt>{t.total}</dt>
            <dd className="tf-num">{money(totals.total)}</dd>
          </div>
        </dl>
      </div>
      {p.actions && <div className="tf-inv-actions">{p.actions}</div>}
    </div>
  );

  const preview =
    p.preview === false ? null : (
      <InvoicePreview
        number={p.preview?.number ?? ""}
        {...p.preview}
        to={p.preview?.to ?? customer?.name ?? "—"}
        issued={p.preview?.issued ?? ""}
        due={p.preview?.due ?? ""}
        note={p.preview?.note ?? value.note}
        discount={value.discount}
        format={money}
        lines={value.lines.map((l) => ({
          d: l.description,
          q: l.quantity,
          u: l.price,
          v: l.vat,
          discount: l.discount,
        }))}
      />
    );

  return (
    <div
      ref={ref}
      className={cx(
        "tf-inv-editor",
        stacked && "stacked",
        narrow && "narrow",
        !preview && "solo",
        p.className,
      )}
      style={p.style}
    >
      {preview && narrow ? (
        <Tabs
          items={[t.invoiceEdit, t.preview]}
          value={tab}
          onChange={setTab}
          label={t.invoiceViews}
          panels={{ [t.invoiceEdit]: editor, [t.preview]: preview }}
        />
      ) : (
        <>
          {editor}
          {preview && <div className="tf-inv-preview">{preview}</div>}
        </>
      )}
    </div>
  );
}

/* ── ImportSuggestions ── */

export function ImportSuggestions(p: ImportSuggestionsProps) {
  const t = useStrings(FINANCE_STRINGS);
  const { formatMoney, formatDate, formatPercent } = useFormat();
  const selectable = p.lines.filter((l) => (l.state ?? "new") === "new");
  const [selected, setSelected] = useControlled<string[]>(
    p.selected,
    p.defaultSelected ?? selectable.filter((l) => l.suggestion).map((l) => l.id),
    p.onSelectedChange,
  );
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const pending = busy || !!p.busy;
  const on = new Set(selected);
  const chosen = selectable.filter((l) => on.has(l.id));
  const all = selectable.length > 0 && chosen.length === selectable.length;
  const some = chosen.length > 0 && !all;
  const sum = chosen.reduce((a, l) => a + l.amount, 0);
  const cur = p.currency ?? chosen[0]?.currency ?? p.lines[0]?.currency ?? null;
  const money = (n: number, c?: string | null) =>
    formatMoney(n, c ?? cur, { minimumFractionDigits: 2, signDisplay: "exceptZero" });
  const toggle = (id: string) =>
    setSelected(on.has(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  const confirm = () => {
    if (!chosen.length || pending) return;
    const ids = chosen.map((l) => l.id);
    setError(null);
    const r = p.onConfirm?.(ids);
    if (r && typeof (r as Promise<void>).then === "function") {
      setBusy(true);
      (r as Promise<void>).then(
        () => setBusy(false),
        (e: unknown) => {
          setBusy(false);
          setError(e instanceof Error && e.message ? e.message : t.importFailed);
        },
      );
    }
  };
  return (
    <section
      className={cx("tf-bankimp", p.surface && "tf-" + p.surface, p.className)}
      style={p.style}
      aria-label={p.title || t.importTitle}
      aria-busy={pending || undefined}
    >
      <div className="tf-bankimp-head">
        <label className="tf-check">
          {cbox({
            checked: all,
            indeterminate: some,
            disabled: !selectable.length || pending,
            onChange: () => setSelected(all ? [] : selectable.map((l) => l.id)),
            label: t.selectAll,
          })}
          <span className="tf-bankimp-title">{p.title || t.importTitle}</span>
        </label>
        <span className="tf-card-desc">{t.importLinesN(p.lines.length)}</span>
      </div>
      <ul className="tf-bankimp-list">
        {p.lines.map((l) => {
          const state = l.state ?? "new";
          const disabled = state !== "new" || pending;
          const s = l.suggestion;
          return (
            <li
              key={l.id}
              className={cx("tf-bankimp-row", on.has(l.id) && state === "new" && "on", state)}
            >
              <span className="tf-bankimp-check">
                {cbox({
                  checked: state === "new" && on.has(l.id),
                  disabled,
                  onChange: () => toggle(l.id),
                  label: t.importSelectLine(l.text),
                })}
              </span>
              <span className="tf-bankimp-text">
                <b>{l.counterparty || l.text}</b>
                <small>
                  {formatDate(l.date, { day: "numeric", month: "short" })}
                  {l.counterparty ? " · " + l.text : ""}
                </small>
              </span>
              <span className="tf-bankimp-suggest">
                {state === "duplicate" ? (
                  <Badge tone="warning">{t.importDuplicate}</Badge>
                ) : state === "booked" ? (
                  <Badge tone="success">{t.importBooked}</Badge>
                ) : s ? (
                  <>
                    {p.categories && p.onCategoryChange ? (
                      <select
                        className="tf-input tf-bankimp-cat"
                        aria-label={t.importCategoryFor(l.text)}
                        value={s.category}
                        disabled={pending}
                        onChange={(e) => p.onCategoryChange?.(l.id, e.target.value)}
                      >
                        {(p.categories.includes(s.category)
                          ? p.categories
                          : [s.category, ...p.categories]
                        ).map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Badge tone="info">{s.category}</Badge>
                    )}
                    {s.booking && <small className="tf-mono">{s.booking}</small>}
                    {s.confidence != null && (
                      <small title={s.reason}>
                        {t.importConfidence(
                          formatPercent(s.confidence * 100, { maximumFractionDigits: 0 }),
                        )}
                      </small>
                    )}
                  </>
                ) : (
                  <small className="tf-card-desc">{t.importNoSuggestion}</small>
                )}
              </span>
              <b className={cx("tf-bankimp-amt", "tf-num", l.amount < 0 ? "out" : "in")}>
                {money(l.amount, l.currency)}
              </b>
              {p.onEdit && state === "new" && (
                <IconButton
                  icon="edit"
                  variant="ghost"
                  size="sm"
                  label={t.importEdit(l.text)}
                  disabled={pending}
                  onClick={() => p.onEdit?.(l.id)}
                />
              )}
            </li>
          );
        })}
      </ul>
      {error && (
        <p className="tf-bankimp-error" role="alert">
          <Icon name="x" size={14} />
          {error}
        </p>
      )}
      <div className="tf-bankimp-foot">
        <span aria-live="polite">
          {t.selectedCount(chosen.length)}
          {chosen.length > 0 && <b className="tf-num">{" · " + money(sum)}</b>}
        </span>
        <Button icon="check" disabled={!chosen.length || pending} onClick={confirm}>
          {pending ? t.importConfirming : t.importConfirmN(chosen.length)}
        </Button>
      </div>
    </section>
  );
}

/* ── PeriodLock ── */

export function PeriodLock(p: PeriodLockProps) {
  const t = useStrings(FINANCE_STRINGS);
  const { formatDate } = useFormat();
  const [locked, setLocked] = useControlled<boolean>(
    p.locked,
    p.defaultLocked ?? false,
    p.onLockedChange,
  );
  const [ask, setAsk] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const label =
    p.period ??
    (p.month !== undefined ? formatDate(p.month, { month: "long", year: "numeric" }) : "");
  const run = () => {
    setAsk(false);
    setError(null);
    const next = !locked;
    const r = next ? p.onLock?.() : p.onUnlock?.();
    if (r && typeof (r as Promise<void>).then === "function") {
      setBusy(true);
      (r as Promise<void>).then(
        () => {
          setBusy(false);
          setLocked(next);
        },
        (e: unknown) => {
          setBusy(false);
          setError(e instanceof Error && e.message ? e.message : t.periodFailed);
        },
      );
    } else setLocked(next);
  };
  const start = () => {
    if (busy) return;
    if (p.confirm === false) run();
    else setAsk(true);
  };
  const by = [
    locked && p.lockedAt
      ? formatDate(p.lockedAt, { day: "numeric", month: "short", year: "numeric" })
      : "",
    locked && p.lockedBy ? p.lockedBy : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const canChange = locked ? !!p.onUnlock || p.locked === undefined : true;
  return (
    <div
      className={cx("tf-period", locked && "locked", p.surface && "tf-" + p.surface, p.className)}
      style={p.style}
      aria-busy={busy || undefined}
    >
      <span className="tf-period-icon" aria-hidden>
        <Icon name={locked ? "lock" : "lockOpen"} size={18} />
      </span>
      <span className="tf-period-text">
        <b>{label}</b>
        <small>
          {by ? t.periodLockedBy(by) : locked ? t.periodLockedNote : p.note || t.periodOpenNote}
        </small>
      </span>
      <Badge tone={locked ? "neutral" : "success"} dot>
        {locked ? t.periodLocked : t.periodOpen}
      </Badge>
      {canChange && !p.readOnly && (
        <Button
          size="sm"
          variant={locked ? "ghost" : "secondary"}
          icon={locked ? "lockOpen" : "lock"}
          disabled={busy || p.disabled}
          onClick={start}
        >
          {busy ? t.periodWorking : locked ? t.periodUnlock : t.periodLock}
        </Button>
      )}
      {error && (
        <p className="tf-period-error" role="alert">
          {error}
        </p>
      )}
      <ConfirmDialog
        open={ask}
        icon={locked ? "lockOpen" : "lock"}
        danger={locked}
        title={locked ? t.periodUnlockTitle(label) : t.periodLockTitle(label)}
        text={locked ? t.periodUnlockText : t.periodLockText}
        confirmLabel={p.stepUp ? t.periodConfirmPasskey : locked ? t.periodUnlock : t.periodLock}
        onConfirm={run}
        onCancel={() => setAsk(false)}
      />
    </div>
  );
}
