import * as React from "react";
import { cx } from "../cx.js";
import { Icon } from "../Icon.js";
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
export function Field(p: FieldProps, control: React.ReactNode) {
  return (
    <label className="tf-field">
      {p.label && <span className="tf-field-label">{p.label}</span>}
      {control}
      {p.error ? (
        <span className="tf-field-error">{p.error}</span>
      ) : (
        p.hint && <span className="tf-field-hint">{p.hint}</span>
      )}
    </label>
  );
}

export function Input(p: InputProps) {
  return Field(
    p,
    <input
      className="tf-input"
      type={p.type || "text"}
      placeholder={p.placeholder}
      defaultValue={p.defaultValue}
      value={p.value}
      onChange={p.onChange}
      disabled={p.disabled}
      aria-invalid={p.error ? "true" : undefined}
    />,
  );
}

export function Select(p: SelectProps) {
  return Field(
    p,
    <select
      className="tf-input"
      defaultValue={p.defaultValue}
      value={p.value}
      onChange={p.onChange}
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
  return Field(
    p,
    <textarea
      className="tf-input"
      placeholder={p.placeholder}
      defaultValue={p.defaultValue}
      rows={p.rows || 4}
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
