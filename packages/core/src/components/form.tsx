"use client";
/**
 * Form: native form submission with validation rules by field name. Fields inside (TextField,
 * Input, Select, Textarea, SelectMenu, Checkbox …) show their message under the input, get
 * `aria-invalid`, and the first invalid field receives focus on submit.
 */
import * as React from "react";
import { cx } from "../cx.js";
import type { FormProps, FormRule, FormValues } from "./types.js";

interface FormState {
  errors: Record<string, string>;
}
const FormContext = React.createContext<FormState | null>(null);

/** The validation message of the field `name` in the surrounding Form (if any). */
export function useFieldError(name: string | undefined): string | undefined {
  const ctx = React.useContext(FormContext);
  return name && ctx ? ctx.errors[name] : undefined;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Runs one field's rules; returns the message of the first rule that fails. */
export function checkRule(rule: FormRule, raw: string | string[] | undefined, values: FormValues) {
  const value = Array.isArray(raw) ? raw.join(",") : (raw ?? "");
  const empty = value.trim() === "";
  if (rule.required && empty)
    return typeof rule.required === "string" ? rule.required : "This field is required";
  if (empty) return undefined;
  if (rule.email && !EMAIL.test(value)) return rule.message || "Enter a valid email address";
  if (rule.minLength != null && value.length < rule.minLength)
    return rule.message || `Use at least ${rule.minLength} characters`;
  if (rule.maxLength != null && value.length > rule.maxLength)
    return rule.message || `Use at most ${rule.maxLength} characters`;
  const n = Number(value.replace(/[^\d.-]/g, ""));
  if (rule.min != null && n < rule.min) return rule.message || `Use ${rule.min} or more`;
  if (rule.max != null && n > rule.max) return rule.message || `Use ${rule.max} or less`;
  if (rule.pattern && !rule.pattern.test(value)) return rule.message || "Use the expected format";
  return rule.validate?.(value, values) || undefined;
}

function read(form: HTMLFormElement): FormValues {
  const out: FormValues = {};
  new FormData(form).forEach((v, k) => {
    const s = typeof v === "string" ? v : v.name;
    const prev = out[k];
    out[k] = prev === undefined ? s : Array.isArray(prev) ? prev.concat(s) : [prev, s];
  });
  return out;
}

export function Form(p: FormProps) {
  const ref = React.useRef<HTMLFormElement>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [tried, setTried] = React.useState(false);
  const rules = p.rules || {};
  const validate = (values: FormValues, only?: string) => {
    const next: Record<string, string> = only ? { ...errors } : {};
    for (const [name, rule] of Object.entries(rules)) {
      if (only && name !== only) continue;
      const msg = checkRule(rule, values[name], values);
      if (msg) next[name] = msg;
      else delete next[name];
    }
    return next;
  };
  // after the first submit, a field re-checks as soon as it changes (native events, so custom
  // fields that update a hidden input take part too)
  const recheck = React.useRef<(name: string) => void>(() => {});
  recheck.current = (name) => {
    if (tried && rules[name] && ref.current) setErrors(validate(read(ref.current), name));
  };
  React.useEffect(() => {
    const form = ref.current;
    if (!form) return;
    const on = (e: Event) => {
      const name = (e.target as HTMLInputElement | null)?.name;
      if (name) recheck.current(name);
    };
    form.addEventListener("change", on);
    form.addEventListener("input", on);
    return () => {
      form.removeEventListener("change", on);
      form.removeEventListener("input", on);
    };
  }, []);
  const ctx = React.useMemo(
    () => ({ errors: { ...errors, ...(p.errors || {}) } }),
    [errors, p.errors],
  );
  return (
    <FormContext.Provider value={ctx}>
      <form
        ref={ref}
        className={cx("tf-form", p.className)}
        style={p.style}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const values = read(e.currentTarget);
          const next = validate(values);
          setErrors(next);
          setTried(true);
          const names = Object.keys(next);
          if (names.length) {
            p.onInvalid?.(next);
            const first = e.currentTarget.querySelector<HTMLElement>(
              names.map((n) => `[name="${CSS.escape(n)}"]`).join(","),
            );
            first?.focus();
            return;
          }
          p.onSubmit?.(values);
        }}
      >
        {p.children}
      </form>
    </FormContext.Provider>
  );
}
