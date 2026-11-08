import * as React from "react";
import { cx, initials } from "../cx.js";
import { Icon } from "../Icon.js";
import type {
  AvatarProps,
  AvatarStackProps,
  BadgeProps,
  ButtonProps,
  ChipProps,
  IconButtonProps,
  Tint,
  TintIconProps,
} from "./types.js";

/* ── Actions ── */
/** Renders `child` with extra class and content instead of a native element (`asChild`). */
function slot(
  child: React.ReactNode,
  className: string,
  extra: Record<string, unknown>,
  content: (inner: React.ReactNode) => React.ReactNode,
) {
  if (!React.isValidElement<{ className?: string; children?: React.ReactNode }>(child)) return null;
  return React.cloneElement(child, {
    ...extra,
    className: cx(className, child.props.className),
    children: content(child.props.children),
  });
}

export function Button(p: ButtonProps) {
  const v = p.variant || "primary";
  const cls = cx("tf-btn", "tf-btn-" + v, p.size === "sm" && "tf-btn-sm", p.className);
  const content = (inner: React.ReactNode) => (
    <>
      {p.icon && <Icon name={p.icon} size={15} />}
      {inner}
      {p.iconRight && <Icon name={p.iconRight} size={15} />}
    </>
  );
  if (p.asChild) {
    const el = slot(React.Children.only(p.children), cls, { style: p.style }, content);
    if (el) return el;
  }
  return (
    <button
      type={p.type || "button"}
      className={cls}
      style={p.style}
      disabled={p.disabled}
      onClick={p.onClick}
    >
      {content(p.children)}
    </button>
  );
}

export function IconButton(p: IconButtonProps) {
  const cls = cx(
    "tf-iconbtn",
    "tf-iconbtn-" + (p.variant || "soft"),
    p.size && "tf-iconbtn-" + p.size,
    p.className,
  );
  if (p.asChild && p.children) {
    const el = slot(
      React.Children.only(p.children),
      cls,
      { "aria-label": p.label, title: p.label, style: p.style },
      () => <Icon name={p.icon} />,
    );
    if (el) return el;
  }
  return (
    <button
      type="button"
      aria-label={p.label}
      title={p.label}
      className={cls}
      style={p.style}
      disabled={p.disabled}
      onClick={p.onClick}
    >
      <Icon name={p.icon} />
    </button>
  );
}

export function Chip(p: ChipProps) {
  return (
    <button
      type="button"
      className={cx("tf-chip", p.className)}
      aria-pressed={p.selected ? "true" : "false"}
      onClick={p.onClick}
    >
      {p.icon && <Icon name={p.icon} size={14} />}
      {p.children}
      {p.count != null && <span className="tf-chip-count">{p.count}</span>}
    </button>
  );
}

const TONE_ALIAS: Record<string, string> = {
  ok: "success",
  warn: "warning",
  signal: "highlight",
  idle: "neutral",
  running: "info",
  error: "danger",
};

export function Badge(p: BadgeProps) {
  const tone = (p.tone && TONE_ALIAS[p.tone]) || p.tone || "neutral";
  return (
    <span
      className={cx(
        "tf-badge",
        "tf-badge-" + tone,
        (p.live || p.tone === "running") && "tf-badge-live",
        p.className,
      )}
    >
      {p.dot !== false && <span className="tf-badge-dot" aria-hidden />}
      {p.children}
    </span>
  );
}

export function TintIcon(p: TintIconProps) {
  return (
    <span
      className={cx("tf-tinticon", "tf-t-" + (p.tint || "plain"), p.className)}
      aria-hidden={p.label ? undefined : true}
      title={p.label}
      style={
        p.size
          ? {
              width: p.size,
              height: p.size,
            }
          : undefined
      }
    >
      <Icon name={p.icon} />
    </span>
  );
}

const AV_TINTS: Tint[] = ["lilac", "sky", "mint", "butter", "blush"];

export function Avatar(p: AvatarProps) {
  const size = p.size || 32,
    t = p.tint || AV_TINTS[(p.name || "").length % AV_TINTS.length];
  return (
    <span
      className={cx("tf-avatar", p.className)}
      style={{
        width: size,
        height: size,
        // a custom property, so a kit can recolour avatars (Pro keeps them monochrome)
        ["--av" as string]: "var(--" + t + ")",
        fontSize: Math.round(size * 0.36),
      }}
      title={p.name}
    >
      {p.src ? <img src={p.src} alt={p.name || ""} /> : initials(p.name)}
    </span>
  );
}

export function AvatarStack(p: AvatarStackProps) {
  const names = p.names || [],
    max = p.max || 4,
    extra = names.length - max;
  return (
    <span className="tf-avatar-stack">
      {names.slice(0, max).map((n) => (
        <Avatar key={n} name={n} size={p.size || 28} />
      ))}
      {extra > 0 && <Avatar name={"+" + extra} tint="surface-sunken" size={p.size || 28} />}
    </span>
  );
}

/* ── Forms ── */
