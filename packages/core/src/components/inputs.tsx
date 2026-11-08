import * as React from "react";
import { cx } from "../cx.js";
import { Icon } from "../Icon.js";
import { useId } from "../hooks.js";
import { useFieldError } from "./form.js";
import type {
  CheckboxProps,
  FieldProps,
  InputProps,
  SearchFieldProps,
  SelectProps,
  SwitchProps,
  TextareaProps,
} from "./types.js";

/* ── Forms ── */
interface Wired {
  id: string;
  error: string | undefined;
  describedBy: string | undefined;
}
/** Label, control and message; the message comes from `error` or the surrounding Form. */
function useWired(p: FieldProps): Wired {
  const auto = useId("in");
  const fromForm = useFieldError(p.name);
  const id = p.id || auto;
  const error = p.error || fromForm;
  return { id, error, describedBy: error || p.hint ? `${id}-msg` : undefined };
}
function Field(p: FieldProps, w: Wired, control: React.ReactNode) {
  return (
    <div className={cx("tf-field", p.className)} style={p.style}>
      {p.label && (
        <label className="tf-field-label" htmlFor={w.id}>
          {p.label}
          {p.required && (
            <span className="tf-req" aria-hidden>
              {" *"}
            </span>
          )}
        </label>
      )}
      {control}
      {w.error ? (
        <span id={`${w.id}-msg`} className="tf-field-error" role="alert">
          <Icon name="x" size={12} />
          {w.error}
        </span>
      ) : (
        p.hint && (
          <span id={`${w.id}-msg`} className="tf-field-hint">
            {p.hint}
          </span>
        )
      )}
    </div>
  );
}

export function Input(p: InputProps) {
  const w = useWired(p);
  return Field(
    p,
    w,
    <input
      id={w.id}
      name={p.name}
      className="tf-input"
      type={p.type || "text"}
      placeholder={p.placeholder}
      defaultValue={p.defaultValue}
      value={p.value}
      onChange={p.onChange}
      disabled={p.disabled}
      required={p.required}
      aria-invalid={w.error ? "true" : undefined}
      aria-describedby={w.describedBy}
    />,
  );
}

export function Select(p: SelectProps) {
  const w = useWired(p);
  return Field(
    p,
    w,
    <select
      id={w.id}
      name={p.name}
      className="tf-input"
      defaultValue={p.defaultValue}
      value={p.value}
      onChange={p.onChange}
      required={p.required}
      aria-invalid={w.error ? "true" : undefined}
      aria-describedby={w.describedBy}
    >
      {(p.options || []).map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>,
  );
}

export function Textarea(p: TextareaProps) {
  const w = useWired(p);
  return Field(
    p,
    w,
    <textarea
      id={w.id}
      name={p.name}
      className="tf-input"
      placeholder={p.placeholder}
      value={p.value}
      defaultValue={p.defaultValue}
      onChange={p.onChange}
      disabled={p.disabled}
      required={p.required}
      rows={p.rows || 4}
      aria-invalid={w.error ? "true" : undefined}
      aria-describedby={w.describedBy}
    />,
  );
}

export function SearchField(p: SearchFieldProps) {
  return (
    <label className={cx("tf-search", p.className)} style={p.style}>
      <Icon name="search" size={15} />
      <input
        type="search"
        placeholder={p.placeholder || "Search"}
        aria-label={p.placeholder || "Search"}
        value={p.value}
        onChange={p.onChange}
      />
      {p.shortcut && <span className="tf-kbd">{p.shortcut}</span>}
    </label>
  );
}

export function Checkbox(p: CheckboxProps) {
  return (
    <label className="tf-check">
      <span className="tf-checkbox">
        <input
          type="checkbox"
          name={p.name}
          value={p.value}
          required={p.required}
          defaultChecked={p.defaultChecked}
          checked={p.checked}
          onChange={p.onChange}
          disabled={p.disabled}
          aria-label={p.label}
        />
        <span className="tf-checkbox-box" aria-hidden>
          <svg
            viewBox="0 0 24 24"
            width={14}
            height={14}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
      </span>
      {p.children}
    </label>
  );
}

export function Switch(p: SwitchProps) {
  return (
    <label
      className="tf-check"
      style={
        p.spread
          ? {
              justifyContent: "space-between",
              width: "100%",
            }
          : undefined
      }
    >
      {p.spread && p.children}
      <input
        type="checkbox"
        role="switch"
        className="tf-switch"
        name={p.name}
        defaultChecked={p.defaultChecked}
        checked={p.checked}
        onChange={p.onChange}
        disabled={p.disabled}
        aria-label={p.label}
      />
      {!p.spread && p.children}
    </label>
  );
}

export interface CheckboxBoxOptions {
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  label?: string;
  indeterminate?: boolean;
}

/** The bare checkbox control (box + check mark) used inside tables and lists. */
export function cbox(o: CheckboxBoxOptions) {
  return (
    <span className="tf-checkbox">
      <input
        type="checkbox"
        checked={o.checked}
        onChange={o.onChange}
        disabled={o.disabled}
        aria-label={o.label}
        ref={
          o.indeterminate != null
            ? (el) => {
                if (el) el.indeterminate = !!o.indeterminate;
              }
            : undefined
        }
      />
      <span className="tf-checkbox-box" aria-hidden>
        <svg
          viewBox="0 0 24 24"
          width={14}
          height={14}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={o.indeterminate ? "M6 12h12" : "M5 12.5l4.5 4.5L19 7.5"} />
        </svg>
      </span>
    </span>
  );
}

/* ── Shared: range slider, bar list, status select, tile picker ── */
