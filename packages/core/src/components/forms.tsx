"use client";
import * as React from "react";
import { leaving, usePresence } from "../presence.js";
import { cx } from "../cx.js";
import { useFieldError } from "./form.js";
import { formatDate, WEEK_START } from "../format.js";
import { useFormat, useStrings, type Formatters } from "../context.js";
import { FORMS_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { useControlled, useId, useOutside } from "../hooks.js";
import { Avatar, IconButton, TintIcon } from "./foundation.js";
import { Popover } from "./overlays.js";
import type {
  CalendarProps,
  ComboboxProps,
  DatePickerProps,
  DateRange,
  FileDropProps,
  FormFieldProps,
  NumberInputProps,
  Option,
  OtpInputProps,
  RadioGroupProps,
  SegmentedProps,
  SliderProps,
  TagInputProps,
  TextFieldProps,
  UploadFile,
} from "./types.js";

/* ── Form field shell: label, required mark, hint, error or success ── */
export function FormField(p: FormFieldProps) {
  const id = p.id;
  const fromForm = useFieldError(p.name);
  const error = p.error || fromForm;
  return (
    <div className={cx("tf-field", p.className)} style={p.style}>
      {p.label && (
        <label className="tf-field-label" htmlFor={id}>
          {p.label}
          {p.required && (
            <span className="tf-req" aria-hidden>
              {" *"}
            </span>
          )}
          {p.optional && <span className="tf-opt"> {"optional"}</span>}
        </label>
      )}
      {p.children}
      {error ? (
        <span id={id ? `${id}-msg` : undefined} className="tf-field-error" role="alert">
          <Icon name="x" size={12} />
          {error}
        </span>
      ) : p.success ? (
        <span className="tf-field-success">
          <Icon name="check" size={12} />
          {p.success}
        </span>
      ) : (
        p.hint && (
          <span id={id ? `${id}-msg` : undefined} className="tf-field-hint">
            {p.hint}
          </span>
        )
      )}
    </div>
  );
}

export function TextField(p: TextFieldProps) {
  const auto = useId("tf");
  const id = p.id || auto;
  const fromForm = useFieldError(p.name);
  const error = p.error || fromForm;
  return (
    <FormField
      id={id}
      label={p.label}
      required={p.required}
      optional={p.optional}
      hint={p.hint}
      error={error}
      success={p.success}
    >
      <span
        className={cx(
          "tf-inputwrap",
          p.icon && "has-icon",
          (error || p.success || p.suffix) && "has-suffix",
        )}
      >
        {p.icon && <Icon name={p.icon} size={15} className="tf-input-icon" />}
        <input
          id={id}
          name={p.name}
          className={cx("tf-input", p.success && "is-valid")}
          type={p.type || "text"}
          placeholder={p.placeholder}
          value={p.value}
          defaultValue={p.defaultValue}
          onChange={p.onChange}
          onBlur={p.onBlur}
          required={p.required}
          disabled={p.disabled}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error || p.hint ? `${id}-msg` : undefined}
          autoComplete={p.autoComplete}
        />
        {error ? (
          <span className="tf-input-suffix err">
            <Icon name="x" size={14} />
          </span>
        ) : p.success ? (
          <span className="tf-input-suffix ok">
            <Icon name="check" size={14} />
          </span>
        ) : (
          p.suffix && <span className="tf-input-suffix">{p.suffix}</span>
        )}
      </span>
    </FormField>
  );
}

/* ── Choice ── */

/* ── Choice ── */
export function RadioGroup(p: RadioGroupProps) {
  const name = useId("rg"),
    v = useControlled(p.value, p.defaultValue, p.onChange);
  return (
    <fieldset className={cx("tf-radiogroup", p.cards && "cards", p.className)}>
      {p.label && <legend className="tf-field-label">{p.label}</legend>}
      <div className="tf-radiogroup-items">
        {(p.options || []).map((o) => {
          const opt =
              typeof o === "string"
                ? {
                    value: o,
                    label: o,
                  }
                : o,
            on = v[0] === opt.value;
          return (
            <label
              key={opt.value}
              className={cx("tf-radio", on && "on", opt.disabled && "disabled")}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={on}
                disabled={opt.disabled}
                onChange={() => {
                  v[1](opt.value);
                }}
              />
              <span className="tf-radio-dot" aria-hidden />
              <span className="tf-radio-text">
                <b>{opt.label}</b>
                {opt.hint && <small>{opt.hint}</small>}
              </span>
            </label>
          );
        })}
      </div>
      {p.hint && <span className="tf-field-hint">{p.hint}</span>}
    </fieldset>
  );
}

export function Segmented(p: SegmentedProps) {
  const v = useControlled(
      p.value,
      p.defaultValue != null ? p.defaultValue : norm((p.options || [])[0] ?? "").value,
      p.onChange,
    ),
    name = useId("seg");
  return (
    <div
      className={cx("tf-seg", p.size === "sm" && "sm", p.block && "block", p.className)}
      role="radiogroup"
      aria-label={p.label}
    >
      {(p.options || []).map((o) => {
        const opt =
            typeof o === "string"
              ? {
                  value: o,
                  label: o,
                }
              : o,
          on = v[0] === opt.value;
        return (
          <label key={opt.value} className={cx("tf-seg-item", on && "on")}>
            <input
              type="radio"
              name={name}
              checked={on}
              onChange={() => {
                v[1](opt.value);
              }}
            />
            {opt.icon && <Icon name={opt.icon} size={14} />}
            {opt.label}
          </label>
        );
      })}
    </div>
  );
}

/* ── Popover & Tooltip ── */

/* ── Combobox (single or multi, searchable) ── */
export function norm(o: string | Option): Option {
  return typeof o === "string"
    ? {
        value: o,
        label: o,
      }
    : o;
}

export function Combobox(p: ComboboxProps) {
  const t = useStrings(FORMS_STRINGS);
  const multi = !!p.multiple,
    opts = (p.options || []).map(norm),
    id = useId("cb");
  const v = useControlled(
    p.value,
    p.defaultValue != null ? p.defaultValue : multi ? [] : null,
    p.onChange,
  );
  const q = React.useState(""),
    open = React.useState(false),
    act = React.useState(0),
    ref = React.useRef<HTMLDivElement>(null),
    inp = React.useRef<HTMLInputElement>(null);
  const openPr = usePresence(!!open[0]);
  useOutside(ref, open[0], () => {
    open[1](false);
    q[1]("");
  });
  const selList: string[] = multi ? (v[0] as string[] | null) || [] : [];
  const selOne = multi ? null : ((v[0] as string | null | undefined) ?? null);
  const list = opts.filter((o) => !q[0] || o.label.toLowerCase().indexOf(q[0].toLowerCase()) >= 0);
  const canCreate =
    p.creatable &&
    q[0].trim() &&
    !opts.some((o) => o.label.toLowerCase() === q[0].trim().toLowerCase());
  function isOn(o: Option) {
    return multi ? selList.indexOf(o.value) >= 0 : selOne === o.value;
  }
  function pick(o: Option) {
    if (multi) {
      v[1](isOn(o) ? selList.filter((x) => x !== o.value) : selList.concat([o.value]));
      q[1]("");
      inp.current && inp.current.focus();
    } else {
      v[1](o.value);
      open[1](false);
      q[1]("");
    }
  }
  function key(e: React.KeyboardEvent<HTMLInputElement>) {
    const n = list.length + (canCreate ? 1 : 0);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      open[1](true);
      act[1](Math.min(n - 1, act[0] + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      act[1](Math.max(0, act[0] - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (!open[0]) return open[1](true);
      if (act[0] < list.length) pick(list[act[0]] as Option);
      else if (canCreate)
        pick({
          value: q[0].trim(),
          label: q[0].trim(),
        });
    } else if (e.key === "Backspace" && multi && !q[0] && selList.length)
      v[1](selList.slice(0, -1));
  }
  const labelOf = (val: string) => {
    const o = opts.find((x) => x.value === val);
    return o ? o.label : val;
  };
  return (
    <FormField
      id={id}
      label={p.label}
      required={p.required}
      hint={p.hint}
      error={p.error}
      className={p.className}
    >
      <div ref={ref} className={cx("tf-combo", open[0] && "open", p.error && "invalid")}>
        <div
          className="tf-combo-box"
          onClick={() => {
            open[1](true);
            inp.current && inp.current.focus();
          }}
        >
          {multi &&
            selList.map((val) => (
              <span key={val} className="tf-token">
                {labelOf(val)}
                <button
                  type="button"
                  aria-label={t.removeItem(labelOf(val))}
                  onClick={(e) => {
                    e.stopPropagation();
                    v[1](selList.filter((x) => x !== val));
                  }}
                >
                  <Icon name="x" size={12} />
                </button>
              </span>
            ))}
          <input
            ref={inp}
            id={id}
            role="combobox"
            aria-expanded={open[0]}
            aria-controls={id + "-list"}
            aria-autocomplete="list"
            autoComplete="off"
            className="tf-combo-input"
            placeholder={
              multi
                ? selList.length
                  ? ""
                  : p.placeholder
                : selOne != null && !q[0]
                  ? labelOf(selOne)
                  : p.placeholder || t.selectPlaceholder
            }
            value={q[0]}
            onChange={(e) => {
              q[1](e.target.value);
              open[1](true);
              act[1](0);
            }}
            onFocus={() => {
              open[1](true);
            }}
            onKeyDown={key}
            style={
              !multi && selOne != null && !q[0]
                ? ({
                    "--ph": "var(--ink)",
                  } as React.CSSProperties)
                : undefined
            }
          />
          <span className="tf-combo-chev">
            <Icon name="chevronDown" size={15} />
          </span>
        </div>
        {openPr.mounted && (
          <div
            {...leaving(openPr.closing)}
            className="tf-popover tf-combo-pop"
            id={id + "-list"}
            role="listbox"
            aria-multiselectable={multi || undefined}
          >
            {list.length === 0 && !canCreate && <div className="tf-combo-empty">{t.noMatches}</div>}
            {list.map((o, i) => (
              <div
                key={o.value}
                role="option"
                aria-selected={isOn(o)}
                className={cx("tf-option", i === act[0] && "active", isOn(o) && "on")}
                onPointerDown={(e) => {
                  e.preventDefault();
                }}
                onClick={() => {
                  pick(o);
                }}
                onPointerEnter={() => {
                  act[1](i);
                }}
              >
                {o.avatar && <Avatar name={o.label} size={24} />}
                {o.icon && <Icon name={o.icon} size={15} />}
                <span className="tf-option-text">
                  {o.label}
                  {o.hint && <small>{o.hint}</small>}
                </span>
                {isOn(o) && <Icon name="check" size={15} className="tf-option-check" />}
              </div>
            ))}
            {canCreate && (
              <div
                role="option"
                className={cx("tf-option", act[0] === list.length && "active")}
                onPointerDown={(e) => {
                  e.preventDefault();
                }}
                onClick={() => {
                  pick({
                    value: q[0].trim(),
                    label: q[0].trim(),
                  });
                }}
              >
                <Icon name="plus" size={15} />
                <span className="tf-option-text">{t.createOption(q[0].trim())}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </FormField>
  );
}

export function TagInput(p: TagInputProps) {
  const strings = useStrings(FORMS_STRINGS);
  const v = useControlled(p.value, p.defaultValue || [], p.onChange),
    q = React.useState(""),
    id = useId("tag");
  function add(raw: string) {
    const t = raw.trim().replace(/,$/, "");
    if (t && v[0].indexOf(t) < 0) v[1](v[0].concat([t]));
    q[1]("");
  }
  return (
    <FormField id={id} label={p.label} hint={p.hint} error={p.error}>
      <div
        className="tf-combo-box tf-tags"
        onClick={(e) => {
          const i = e.currentTarget.querySelector("input");
          i && i.focus();
        }}
      >
        {v[0].map((t) => (
          <span key={t} className="tf-token">
            {t}
            <button
              type="button"
              aria-label={strings.removeItem(t)}
              onClick={() => {
                v[1](v[0].filter((x) => x !== t));
              }}
            >
              <Icon name="x" size={12} />
            </button>
          </span>
        ))}
        <input
          id={id}
          className="tf-combo-input"
          placeholder={v[0].length ? "" : p.placeholder || strings.tagPlaceholder}
          value={q[0]}
          onChange={(e) => {
            const s = e.target.value;
            if (/,$/.test(s)) add(s);
            else q[1](s);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(q[0]);
            } else if (e.key === "Backspace" && !q[0] && v[0].length) v[1](v[0].slice(0, -1));
          }}
          onBlur={() => {
            q[0] && add(q[0]);
          }}
        />
      </div>
    </FormField>
  );
}

/* ── Date picker (single or range, with presets) ── */
function monthName(d: Date, locale?: string) {
  return formatDate(
    d,
    {
      month: "long",
      year: "numeric",
    },
    locale,
  );
}

/** Short weekday names from the first day of the week (`locale` default en-US). */
export function weekdays(locale?: string) {
  const out: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(2024, 0, 1 + ((WEEK_START + i - 1) % 7));
    out.push(
      formatDate(
        d,
        {
          weekday: "short",
        },
        locale,
      ),
    );
  }
  return out;
}

function d0(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function same(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return !!(
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function fmtD(d: Date | null | undefined, locale?: string) {
  return d ? formatDate(d, undefined, locale) : "";
}

function addD(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function Calendar(p: CalendarProps) {
  const t = useStrings(FORMS_STRINGS);
  const { locale } = useFormat();
  const range = p.range ? ((p.value as DateRange | null | undefined) ?? null) : null;
  const today = d0(p.today || new Date()),
    sv = p.range ? range && range.from : (p.value as Date | null | undefined),
    base = p.month || (sv instanceof Date ? sv : null) || today;
  const m = React.useState(new Date(base.getFullYear(), base.getMonth(), 1)),
    hov = React.useState<Date | null>(null);
  const first = m[0],
    start = addD(first, -((first.getDay() - WEEK_START + 7) % 7)),
    days: Date[] = [];
  for (let i = 0; i < 42; i++) days.push(addD(start, i));
  const from = sv ?? null,
    to = p.range ? (range && range.to) || (from && hov[0] && hov[0] > from ? hov[0] : null) : null;
  function move(n: number) {
    m[1](new Date(first.getFullYear(), first.getMonth() + n, 1));
  }
  return (
    <div className="tf-cal">
      <div className="tf-cal-head">
        <IconButton
          icon="chevronLeft"
          label={t.previousMonth}
          size="sm"
          variant="soft"
          onClick={() => {
            move(-1);
          }}
        />
        <b>{monthName(first, locale)}</b>
        <IconButton
          icon="chevronRight"
          label={t.nextMonth}
          size="sm"
          variant="soft"
          onClick={() => {
            move(1);
          }}
        />
      </div>
      <div className="tf-cal-grid" role="group" aria-label={monthName(first, locale)}>
        {weekdays(locale).map((w, i) => (
          <span key={i} className="tf-cal-wd">
            {w}
          </span>
        ))}
        {days.map((d) => {
          const out = d.getMonth() !== first.getMonth(),
            isFrom = same(d, from),
            isTo = same(d, to),
            inR = from && to && d > from && d < to;
          const dis = (p.min && d < d0(p.min)) || (p.max && d > d0(p.max));
          return (
            <button
              key={+d}
              type="button"
              disabled={dis}
              className={cx(
                "tf-cal-day",
                out && "out",
                same(d, today) && "today",
                (isFrom || isTo) && "sel",
                inR && "inrange",
                isFrom && to && "start",
                isTo && from && "end",
              )}
              aria-pressed={isFrom || isTo}
              aria-label={formatDate(d, { day: "numeric", month: "long", year: "numeric" }, locale)}
              onPointerEnter={() => {
                p.range && hov[1](d);
              }}
              onClick={() => {
                if (!p.range) return p.onChange?.(d);
                if (!from || (from && range?.to) || d < from)
                  p.onChange?.({
                    from: d,
                    to: null,
                  });
                else
                  p.onChange?.({
                    from: from,
                    to: d,
                  });
              }}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DatePicker(p: DatePickerProps) {
  const t = useStrings(FORMS_STRINGS);
  const { locale } = useFormat();
  const id = useId("dp"),
    v = useControlled(
      p.value,
      p.defaultValue ||
        (p.range
          ? {
              from: null,
              to: null,
            }
          : null),
      p.onChange,
    ),
    today = d0(p.today || new Date());
  const presets =
    p.presets !== false && p.range
      ? [
          [t.lastDays(7), -6],
          [t.lastDays(30), -29],
          [t.lastDays(90), -89],
          [t.thisYear, "y"],
        ]
      : null;
  const rv = p.range ? ((v[0] as DateRange | null) ?? null) : null;
  const txt = p.range
    ? rv && rv.from
      ? fmtD(rv.from, locale) + " – " + (rv.to ? fmtD(rv.to, locale) : "…")
      : ""
    : fmtD(v[0] as Date | null, locale);
  return (
    <FormField
      id={id}
      label={p.label}
      required={p.required}
      hint={p.hint}
      error={p.error}
      className={p.className}
    >
      <Popover
        block
        width={presets ? 476 : 304}
        trigger={(s) => (
          <button
            id={id}
            type="button"
            className={cx("tf-input tf-picker", !txt && "empty")}
            aria-haspopup="dialog"
            aria-expanded={s.open}
            onClick={s.toggle}
          >
            <Icon name="calendar" size={15} />
            <span>{txt || p.placeholder || (p.range ? t.pickRange : t.pickDate)}</span>
          </button>
        )}
      >
        {(s) => (
          <div className={cx("tf-dp", presets && "with-presets")}>
            {presets && (
              <div className="tf-dp-presets">
                {presets.map((pr) => {
                  const from =
                    pr[1] === "y"
                      ? new Date(today.getFullYear(), 0, 1)
                      : addD(today, pr[1] as number);
                  const on = !!rv && same(rv.from, from) && same(rv.to, today);
                  return (
                    <button
                      key={pr[0]}
                      type="button"
                      className={cx("tf-dp-preset", on && "on")}
                      onClick={() => {
                        v[1]({
                          from: from,
                          to: today,
                        });
                        s.close();
                      }}
                    >
                      {pr[0]}
                    </button>
                  );
                })}
              </div>
            )}
            <Calendar
              range={p.range}
              value={v[0]}
              today={today}
              min={p.min}
              max={p.max}
              onChange={(n) => {
                v[1](n);
                if (!p.range || (n as DateRange).to) s.close();
              }}
            />
          </div>
        )}
      </Popover>
    </FormField>
  );
}

/* ── Number, slider, OTP, upload ── */

/* ── Number, slider, OTP, upload ── */
export function NumberInput(p: NumberInputProps) {
  const t = useStrings(FORMS_STRINGS);
  const id = useId("num"),
    v = useControlled(p.value, p.defaultValue != null ? p.defaultValue : 0, p.onChange),
    step = p.step || 1;
  function set(n: number) {
    if (p.min != null) n = Math.max(p.min, n);
    if (p.max != null) n = Math.min(p.max, n);
    v[1](Math.round(n * 1000) / 1000);
  }
  return (
    <FormField id={id} label={p.label} hint={p.hint} error={p.error}>
      <div className="tf-number">
        <IconButton
          icon="minus"
          label={t.decrease}
          size="sm"
          disabled={p.min != null && v[0] <= p.min}
          onClick={() => {
            set(v[0] - step);
          }}
        />
        <input
          id={id}
          className="tf-number-input"
          inputMode="decimal"
          value={v[0]}
          onChange={(e) => {
            const n = parseFloat(e.target.value);
            if (!isNaN(n)) set(n);
            else if (e.target.value === "") v[1](0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              set(v[0] + step);
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              set(v[0] - step);
            }
          }}
        />
        {p.unit && <span className="tf-number-unit">{p.unit}</span>}
        <IconButton
          icon="plus"
          label={t.increase}
          size="sm"
          disabled={p.max != null && v[0] >= p.max}
          onClick={() => {
            set(v[0] + step);
          }}
        />
      </div>
    </FormField>
  );
}

export function Slider(p: SliderProps) {
  const id = useId("sl"),
    min = p.min || 0,
    max = p.max != null ? p.max : 100,
    v = useControlled(p.value, p.defaultValue != null ? p.defaultValue : min, p.onChange);
  const pct = ((v[0] - min) / (max - min)) * 100,
    f = p.format || String;
  return (
    <FormField id={id} label={p.label} hint={p.hint}>
      <div className="tf-slider">
        <div className="tf-slider-track">
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={p.step || 1}
            value={v[0]}
            onChange={(e) => {
              v[1](+e.target.value);
            }}
            style={
              {
                "--pct": pct + "%",
              } as React.CSSProperties
            }
            aria-valuetext={f(v[0])}
          />
          <span
            className="tf-slider-val"
            style={{
              left: "calc(" + pct + "% + " + (10 - pct * 0.2) + "px)",
            }}
          >
            {f(v[0])}
          </span>
        </div>
        {p.marks !== false && (
          <div className="tf-slider-marks">
            <span>{f(min)}</span>
            <span>{f(max)}</span>
          </div>
        )}
      </div>
    </FormField>
  );
}

export function OtpInput(p: OtpInputProps) {
  const t = useStrings(FORMS_STRINGS);
  const n = p.length || 6,
    st = React.useState(Array(n).fill("")),
    refs = React.useRef<(HTMLInputElement | null)[]>([]);
  function set(i: number, ch: string) {
    const nx = st[0].slice();
    nx[i] = ch;
    st[1](nx);
    if (ch && i < n - 1) refs.current[i + 1]?.focus();
    if (nx.every(Boolean)) p.onComplete && p.onComplete(nx.join(""));
  }
  return (
    <div
      className={cx("tf-otp", p.error && "invalid")}
      role="group"
      aria-label={p.label || t.verificationCode}
    >
      {st[0].map((c, i) => (
        <React.Fragment key={i}>
          {i === n / 2 && n > 4 && <span className="tf-otp-sep" aria-hidden />}
          <input
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="tf-otp-cell"
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={c}
            aria-label={t.digitN(i + 1)}
            onChange={(e) => {
              set(i, e.target.value.replace(/\D/g, "").slice(-1));
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !st[0][i] && i > 0) refs.current[i - 1]?.focus();
              if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
              if (e.key === "ArrowRight" && i < n - 1) refs.current[i + 1]?.focus();
            }}
            onPaste={(e) => {
              const t = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, n);
              if (!t) return;
              e.preventDefault();
              const nx = Array(n)
                .fill("")
                .map((_, k) => t[k] || "");
              st[1](nx);
              refs.current[Math.min(t.length, n - 1)]?.focus();
              if (t.length === n) p.onComplete && p.onComplete(t);
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

function fsize(b: number, f: Pick<Formatters, "formatNumber">) {
  return b > 1048576
    ? `${f.formatNumber(b / 1048576, { maximumFractionDigits: 1 })} MB`
    : `${f.formatNumber(Math.max(1, Math.round(b / 1024)))} KB`;
}

export function FileDrop(p: FileDropProps) {
  const t = useStrings(FORMS_STRINGS);
  const fm = useFormat();
  const over = React.useState(false),
    files = useControlled(p.files, [], p.onChange),
    inp = React.useRef<HTMLInputElement>(null);
  function take(list: FileList | null) {
    const add: UploadFile[] = Array.from(list || []).map((f) => ({
      name: f.name,
      size: f.size,
      progress: 0,
      id: Math.random().toString(36).slice(2),
    }));
    if (!add.length) return;
    const all = (p.multiple === false ? [] : files[0]).concat(add);
    files[1](all);
    add.forEach((f, k) => {
      let t = 0;
      const iv = setInterval(
        () => {
          t += 20 + Math.random() * 25;
          f.progress = Math.min(100, t);
          files[1](all.slice());
          if (t >= 100) clearInterval(iv);
        },
        160 + k * 40,
      );
    });
  }
  return (
    <div
      className="tf-col"
      style={{
        gap: 12,
      }}
    >
      <div
        className={cx("tf-drop", over[0] && "over")}
        role="button"
        tabIndex={0}
        onClick={() => {
          inp.current?.click();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inp.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          over[1](true);
        }}
        onDragLeave={() => {
          over[1](false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          over[1](false);
          take(e.dataTransfer.files);
        }}
      >
        <TintIcon icon="upload" tint={over[0] ? "mint" : "sky"} size={40} />
        <b>{over[0] ? t.dropToUpload : p.title || t.dropFiles}</b>
        <span>{p.hint || t.dropHint}</span>
        <input
          ref={inp}
          type="file"
          hidden
          multiple={p.multiple !== false}
          accept={p.accept}
          onChange={(e) => {
            take(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      {files[0].length > 0 && (
        <div
          className="tf-col"
          style={{
            gap: 8,
          }}
        >
          {files[0].map((f) => {
            const done = f.progress >= 100;
            return (
              <div key={f.id} className="tf-upload">
                <TintIcon icon="file" tint={done ? "mint" : "sky"} />
                <div className="tf-upload-text">
                  <b>{f.name}</b>
                  <span>
                    {done
                      ? t.uploaded(fsize(f.size, fm))
                      : fm.formatPercent(Math.round(f.progress)) + " · " + fsize(f.size, fm)}
                  </span>
                  {!done && (
                    <span className="tf-progress">
                      <span
                        style={{
                          width: f.progress + "%",
                        }}
                      />
                    </span>
                  )}
                </div>
                <IconButton
                  icon={done ? "trash" : "x"}
                  label={done ? t.removeItem(f.name) : t.cancelUpload}
                  size="sm"
                  onClick={() => {
                    files[1](files[0].filter((x) => x.id !== f.id));
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Feedback: inline alert, confirm dialog, toasts with undo ── */
