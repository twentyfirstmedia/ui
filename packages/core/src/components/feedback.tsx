"use client";
import * as React from "react";
import { moveFocus, useId } from "../hooks.js";
import { cx } from "../cx.js";
import { Icon } from "../Icon.js";
import { Portal } from "../portal.js";
import {
  getServerToasts,
  getToasts,
  subscribeToasts,
  toast,
  type ToastData,
} from "../toast-store.js";
import { Button, IconButton, TintIcon } from "./foundation.js";
import type {
  AlertProps,
  ConfirmDialogProps,
  EmptyStateProps,
  IconName,
  MenuItem,
  MenuProps,
  ModalProps,
  SkeletonProps,
  Tint,
  ToastProps,
  ToasterProps,
} from "./types.js";

export function Skeleton(p: SkeletonProps) {
  const v = p.variant || "text";
  return (
    <span
      className={cx("tf-skel", "tf-skel-" + v, p.className)}
      aria-hidden
      style={{
        width: p.width,
        height: p.height || (v === "circle" ? p.width : undefined),
      }}
    />
  );
}

/* ── Overlays & feedback ── */

/* ── Overlays & feedback ── */
const MENU_ITEMS = ':scope > [role^="menuitem"], :scope > .tf-menu-subwrap > [role^="menuitem"]';

/**
 * A menu: items with icons and shortcuts, separators, checkbox and radio items and submenus.
 * Keyboard: ↑/↓, Home/End and typeahead move; Enter/Space run; → opens a submenu, ← and Escape
 * close it.
 */
export function Menu(p: MenuProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [sub, setSub] = React.useState<number | null>(null);
  const subFocus = React.useRef(false);
  React.useEffect(() => {
    if (p.autoFocus) ref.current?.querySelector<HTMLElement>(MENU_ITEMS)?.focus();
  }, [p.autoFocus]);
  const run = (it: MenuItem) => {
    it.onClick?.();
    if (it.type !== "checkbox" && it.type !== "radio") p.onClose?.();
  };
  return (
    <div
      ref={ref}
      className={cx("tf-menu", p.className)}
      style={p.style}
      role="menu"
      aria-label={p.label}
      onKeyDown={(e) => {
        if (moveFocus(e, ref.current, MENU_ITEMS, "vertical", true)) {
          e.stopPropagation();
          return;
        }
        if (e.key === "Escape" && p.onClose) {
          e.stopPropagation();
          p.onClose();
        }
      }}
    >
      {(p.items || []).map((it, i) => {
        if (it === "-") return <div key={i} className="tf-menu-sep" role="separator" />;
        const check = it.type === "checkbox" || it.type === "radio";
        const role =
          it.type === "checkbox"
            ? "menuitemcheckbox"
            : it.type === "radio"
              ? "menuitemradio"
              : "menuitem";
        const inner = (
          <>
            {check ? (
              <span className={cx("tf-menu-mark", it.type)} aria-hidden>
                {it.checked && (it.type === "checkbox" ? <Icon name="check" size={14} /> : <i />)}
              </span>
            ) : (
              it.icon && <Icon name={it.icon} size={15} />
            )}
            <span className="tf-menu-text">{it.label}</span>
            {it.shortcut && <kbd>{it.shortcut}</kbd>}
            {it.items && <Icon name="chevronRight" size={14} className="tf-menu-subchev" />}
          </>
        );
        if (it.items) {
          const open = sub === i;
          return (
            <div
              key={i}
              className="tf-menu-subwrap"
              onPointerEnter={() => setSub(i)}
              onPointerLeave={() => setSub(null)}
              onKeyDownCapture={(e) => {
                // ← or Escape inside the submenu closes just the submenu
                const inSub = (e.target as HTMLElement).closest(".tf-menu-sub");
                if (inSub && (e.key === "ArrowLeft" || e.key === "Escape")) {
                  e.preventDefault();
                  e.stopPropagation();
                  setSub(null);
                  (e.currentTarget.firstElementChild as HTMLElement | null)?.focus();
                }
              }}
            >
              <button
                type="button"
                role="menuitem"
                className={cx("tf-menu-item", open && "on")}
                aria-haspopup="menu"
                aria-expanded={open}
                disabled={it.disabled}
                onClick={() => {
                  subFocus.current = true;
                  setSub(open ? null : i);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    subFocus.current = true;
                    setSub(i);
                  }
                }}
              >
                {inner}
              </button>
              {open && (
                <Menu
                  className="tf-menu-sub"
                  label={it.label}
                  items={it.items}
                  autoFocus={subFocus.current}
                  onClose={() => {
                    setSub(null);
                    subFocus.current = false;
                    p.onClose?.();
                  }}
                />
              )}
            </div>
          );
        }
        return (
          <button
            key={i}
            type="button"
            role={role}
            aria-checked={check ? !!it.checked : undefined}
            className={cx("tf-menu-item", it.danger && "danger")}
            disabled={it.disabled}
            onClick={() => run(it)}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}

export function Modal(p: ModalProps) {
  return (
    <div className="tf-modal-wrap" style={p.style}>
      <div className="tf-backdrop" aria-hidden />
      <div className="tf-modal" role="dialog" aria-modal="true" aria-label={p.title}>
        <span className="tf-modal-close">
          <IconButton icon="x" label="Close" size="sm" onClick={p.onClose} />
        </span>
        {p.icon && <TintIcon icon={p.icon} tint={p.tint || "sky"} size={40} />}
        <div>
          <h2 className="tf-modal-title">{p.title}</h2>
          {p.text && (
            <p
              className="tf-modal-text"
              style={{
                marginTop: 6,
              }}
            >
              {p.text}
            </p>
          )}
        </div>
        {p.children}
        {p.actions && <div className="tf-modal-foot">{p.actions}</div>}
      </div>
    </div>
  );
}

export function Toast(p: ToastProps) {
  return (
    <div className="tf-toast" role="status">
      <TintIcon icon={p.icon || "check"} tint={p.tint || "mint"} />
      {p.children}
      {p.action && (
        <Button variant="soft" size="sm" onClick={p.onAction}>
          {p.action}
        </Button>
      )}
    </div>
  );
}

export function EmptyState(p: EmptyStateProps) {
  return (
    <div className="tf-empty tf-in">
      <TintIcon icon={p.icon || "sparkle"} tint={p.tint || "sky"} size={44} />
      <p className="tf-empty-title">{p.title}</p>
      {p.text && <p className="tf-empty-text">{p.text}</p>}
      {p.action}
    </div>
  );
}

/* ── Feedback: inline alert, confirm dialog, toasts with undo ── */
const ALERT_ICON: Record<string, IconName> = {
    info: "bell",
    success: "check",
    warning: "flag",
    danger: "x",
    highlight: "sparkle",
  },
  ALERT_TINT: Record<string, Tint> = {
    info: "sky",
    success: "mint",
    warning: "butter",
    danger: "blush",
    highlight: "lilac",
  };

export function Alert(p: AlertProps) {
  const tone = p.tone || "info";
  return (
    <div
      className={cx("tf-alert", "tf-alert-" + tone, p.className)}
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
    >
      <span className="tf-alert-icon">
        <Icon name={p.icon || ALERT_ICON[tone]} size={15} />
      </span>
      <div className="tf-alert-body">
        {p.title && <b>{p.title}</b>}
        {p.children && <span>{p.children}</span>}
      </div>
      {(p.action || p.onDismiss) && (
        <div className="tf-alert-actions">
          {p.action}
          {p.onDismiss && (
            <IconButton icon="x" label="Dismiss" size="sm" variant="ghost" onClick={p.onDismiss} />
          )}
        </div>
      )}
    </div>
  );
}

export function ConfirmDialog(p: ConfirmDialogProps) {
  const titleId = useId("confirm");
  const typed = React.useState(""),
    ok = !p.confirmText || typed[0] === p.confirmText,
    cancel = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (!p.open) return;
    typed[1]("");
    setTimeout(() => {
      cancel.current && cancel.current.focus();
    }, 30);
    function k(e: KeyboardEvent) {
      if (e.key === "Escape") p.onCancel && p.onCancel();
    }
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("keydown", k);
    };
  }, [p.open]);
  if (!p.open) return null;
  return (
    <Portal>
      <div className="tf-overlay">
        <div className="tf-backdrop" onClick={p.onCancel} />
        <div
          className="tf-modal tf-confirm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <TintIcon
            icon={p.icon || (p.danger ? "trash" : "check")}
            tint={p.danger ? "blush" : "sky"}
            size={40}
          />
          <div
            className="tf-col"
            style={{
              gap: 8,
            }}
          >
            <h2 id={titleId} className="tf-modal-title tf-confirm-t">
              {p.title}
            </h2>
            {p.text && <p className="tf-modal-text">{p.text}</p>}
          </div>
          {p.confirmText && (
            <label className="tf-field">
              <span className="tf-field-hint">
                Type <b className="tf-mono">{p.confirmText}</b> to confirm
              </span>
              <input
                className="tf-input"
                value={typed[0]}
                onChange={(e) => {
                  typed[1](e.target.value);
                }}
                autoComplete="off"
              />
            </label>
          )}
          <div className="tf-modal-foot">
            <button ref={cancel} type="button" className="tf-btn tf-btn-ghost" onClick={p.onCancel}>
              {p.cancelLabel || "Cancel"}
            </button>
            <Button
              variant={p.danger ? "danger-solid" : "primary"}
              disabled={!ok}
              onClick={p.onConfirm}
            >
              {p.confirmLabel || "Confirm"}
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

export function ToastItem(p: { t: ToastData }) {
  const t = p.t,
    paused = React.useState(false),
    left = React.useRef(t.duration),
    last = React.useRef(Date.now());
  React.useEffect(() => {
    if (paused[0]) return;
    last.current = Date.now();
    const tm = setTimeout(() => {
      toast.dismiss(t.id);
    }, left.current);
    return () => {
      clearTimeout(tm);
      left.current -= Date.now() - last.current;
    };
  }, [paused[0]]);
  const tint = ALERT_TINT[t.tone] || "mint";
  return (
    <div
      className="tf-toast tf-toast-x"
      role={t.tone === "danger" ? "alert" : "status"}
      onPointerEnter={() => {
        paused[1](true);
      }}
      onPointerLeave={() => {
        paused[1](false);
      }}
    >
      <TintIcon icon={t.icon || ALERT_ICON[t.tone] || "check"} tint={tint} />
      <span className="tf-toast-text">{t.text}</span>
      {t.undo && (
        <button
          type="button"
          className="tf-toast-action"
          onClick={() => {
            t.undo?.();
            toast.dismiss(t.id);
          }}
        >
          {"Undo"}
        </button>
      )}
      {t.action && (
        <button
          type="button"
          className="tf-toast-action"
          onClick={() => {
            t.action?.onClick();
            toast.dismiss(t.id);
          }}
        >
          {t.action.label}
        </button>
      )}
      <button
        type="button"
        className="tf-toast-close"
        aria-label="Dismiss"
        onClick={() => {
          toast.dismiss(t.id);
        }}
      >
        <Icon name="x" size={13} />
      </button>
      <span
        className="tf-toast-timer"
        style={{
          animationDuration: t.duration + "ms",
          animationPlayState: paused[0] ? "paused" : "running",
        }}
      />
    </div>
  );
}

export function Toaster(p: ToasterProps) {
  const list = React.useSyncExternalStore(subscribeToasts, getToasts, getServerToasts);
  return (
    <Portal>
      <div className={cx("tf-toaster", p && p.position === "top" && "top")} aria-live="polite">
        {list.map((t) => (
          <ToastItem key={t.id} t={t} />
        ))}
      </div>
    </Portal>
  );
}

/* ── Data table: sort, select + bulk bar, column toggles, sticky head, expandable rows ── */
