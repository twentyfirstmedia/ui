"use client";
/**
 * Pieces of the app frame: NotificationCenter (the bell in the top bar), Stepper (wizard steps)
 * and InputGroup (a field with prefix and suffix affixes), plus `matchPath` for route-based
 * navigation.
 */
import * as React from "react";
import { Icon } from "../Icon.js";
import { cx } from "../cx.js";
import { useFormat, useStrings } from "../context.js";
import { FRAME_STRINGS } from "../strings.js";
import { useControlled, useId } from "../hooks.js";
import { IconButton } from "./foundation.js";
import { SheetPopover } from "./sheet.js";
import { Popover } from "./overlays.js";
import { NotificationList } from "./workspace.js";
import { FormField } from "./forms.js";
import { useFieldError } from "./form.js";
import { Progress } from "./data-display.js";
import type { InputGroupProps, NotificationCenterProps, StepState, StepperProps } from "./types.js";

/**
 * The entry whose `href` matches `pathname`, the longest match winning: an exact match, or a path
 * below it (`/settings` matches `/settings/billing`). `/` matches only itself. Query strings and
 * hashes are ignored.
 */
export function matchPath<T extends { href?: string }>(
  pathname: string | undefined,
  entries: T[],
): T | undefined {
  if (!pathname) return undefined;
  const clean = (h: string) => {
    const path = h.split(/[?#]/)[0] || "/";
    return path.length > 1 ? path.replace(/\/+$/, "") : path;
  };
  const path = clean(pathname);
  let best: T | undefined;
  let len = -1;
  for (const e of entries) {
    if (!e.href || /^[a-z]+:/i.test(e.href)) continue;
    const h = clean(e.href);
    const hit = h === path || (h !== "/" && path.startsWith(h + "/"));
    if (hit && h.length > len) {
      best = e;
      len = h.length;
    }
  }
  return best;
}

/* ── NotificationCenter ── */
export function NotificationCenter(p: NotificationCenterProps) {
  const t = useStrings(FRAME_STRINGS);
  const { formatNumber } = useFormat();
  const [open, setOpen] = useControlled(p.open, !!p.defaultOpen, p.onOpenChange);
  const unread = p.unread ?? (p.items || []).filter((n) => n.unread).length;
  const shown = unread > 99 ? "99+" : formatNumber(unread);
  const Pop = p.sheet === false ? Popover : SheetPopover;
  return (
    <Pop
      className={cx("tf-notify", p.className)}
      style={p.style}
      align={p.align ?? "end"}
      side={p.side}
      open={open}
      onOpenChange={setOpen}
      width={380}
      flush
      role="dialog"
      label={t.notifications}
      trigger={({ open: isOpen, toggle }) => (
        <span className="tf-notify-bell">
          <IconButton
            icon="bell"
            variant="ghost"
            label={unread ? t.notificationsUnread(unread, formatNumber(unread)) : t.notifications}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            onClick={toggle}
          />
          {unread > 0 && (
            <span className="tf-dotcount tf-notify-count" aria-hidden>
              {shown}
            </span>
          )}
        </span>
      )}
    >
      {({ close }) => (
        <NotificationList
          className="tf-notify-list"
          items={p.items}
          linkAs={p.linkAs}
          now={p.now}
          hideFilter={p.hideFilter}
          onReadAll={p.onReadAll}
          onOpen={(n) => {
            p.onOpen?.(n);
            close();
          }}
        />
      )}
    </Pop>
  );
}

/* ── Stepper ── */
export function Stepper(p: StepperProps) {
  const t = useStrings(FRAME_STRINGS);
  const current = p.current ?? 0;
  const total = p.steps.length;
  const stateOf = (i: number): StepState =>
    p.steps[i]?.state ?? (i < current ? "done" : i === current ? "current" : "upcoming");
  const cur = p.steps[Math.min(Math.max(current, 0), total - 1)];
  const doneCount = p.steps.filter((_, i) => stateOf(i) === "done").length;
  return (
    <nav
      className={cx("tf-stepper", p.variant === "compact" && "compact", p.className)}
      style={p.style}
      aria-label={p.label || t.steps}
    >
      <ol className="tf-stepper-list">
        {p.steps.map((step, i) => {
          const state = stateOf(i);
          const mark = (
            <span className="tf-step-mark" aria-hidden>
              {state === "done" ? (
                <Icon name="check" size={14} />
              ) : state === "error" ? (
                <Icon name="x" size={14} />
              ) : (
                i + 1
              )}
            </span>
          );
          const text = (
            <span className="tf-step-text">
              <span className="tf-step-label">
                {step.label}
                {state === "done" && <span className="tf-sr-only">, {t.stepDone}</span>}
                {state === "error" && <span className="tf-sr-only">, {t.stepError}</span>}
              </span>{" "}
              {step.description && <span className="tf-step-desc">{step.description}</span>}
            </span>
          );
          const clickable = !!p.onStepClick && (state === "done" || state === "error");
          return (
            <li
              key={step.id || step.label}
              className={cx("tf-step", state)}
              aria-current={state === "current" ? "step" : undefined}
            >
              {clickable ? (
                <button type="button" className="tf-step-btn" onClick={() => p.onStepClick?.(i)}>
                  {mark}
                  {text}
                </button>
              ) : (
                <span className="tf-step-btn">
                  {mark}
                  {text}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <div className="tf-stepper-compact" aria-hidden>
        <div className="tf-stepper-compact-text">
          <span className="tf-stepper-compact-count">{t.stepOf(current + 1, total)}</span>
          {cur && <b>{cur.label}</b>}
        </div>
        <Progress value={total ? (doneCount / total) * 100 : 0} label={t.steps} />
      </div>
    </nav>
  );
}

/* ── InputGroup ── */
const isText = (n: React.ReactNode) => typeof n === "string" || typeof n === "number";

export function InputGroup(p: InputGroupProps) {
  const auto = useId("tf");
  const id = p.id || auto;
  const fromForm = useFieldError(p.name);
  const error = p.error || fromForm;
  const startId = `${id}-start`;
  const endId = `${id}-end`;
  // text affixes are read with the field ("https://", "kg"); controls are reachable on their own
  const described = [
    isText(p.start) ? startId : null,
    isText(p.end) ? endId : null,
    error || p.hint ? `${id}-msg` : null,
  ]
    .filter(Boolean)
    .join(" ");
  const affix = (n: React.ReactNode, side: "start" | "end", affixId: string) =>
    n == null || n === false ? null : (
      <span
        id={isText(n) ? affixId : undefined}
        className={cx("tf-ig-affix", side, isText(n) && "text")}
      >
        {n}
      </span>
    );
  return (
    <FormField
      style={p.style}
      className={p.className}
      id={id}
      label={p.label}
      hideLabel={p.hideLabel}
      required={p.required}
      optional={p.optional}
      hint={p.hint}
      error={error}
      success={p.success}
    >
      <div className={cx("tf-inputgroup", p.disabled && "disabled", error && "invalid")}>
        {affix(p.start, "start", startId)}
        {p.children ?? (
          <input
            id={id}
            name={p.name}
            className="tf-input"
            type={p.type || "text"}
            placeholder={p.placeholder}
            value={p.value}
            defaultValue={p.defaultValue}
            onChange={p.onChange}
            onBlur={p.onBlur}
            onKeyDown={p.onKeyDown}
            required={p.required}
            disabled={p.disabled}
            readOnly={p.readOnly}
            min={p.min}
            max={p.max}
            step={p.step}
            minLength={p.minLength}
            maxLength={p.maxLength}
            pattern={p.pattern}
            inputMode={p.inputMode}
            autoFocus={p.autoFocus}
            autoComplete={p.autoComplete}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={described || undefined}
          />
        )}
        {affix(p.end, "end", endId)}
      </div>
    </FormField>
  );
}
