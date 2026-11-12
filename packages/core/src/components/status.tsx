import * as React from "react";
import { cx } from "../cx.js";
import type { StatusIndicatorProps, StatusShapeProps } from "./types.js";

/* ════════ Kit 4: status, approvals A–D, foundations, agent & operations components ════════ */
const STATUS = {
  ok: "dot",
  running: "pulse",
  signal: "diamond",
  warn: "triangle",
  danger: "square",
  idle: "ring",
};

export function StatusShape(p: StatusShapeProps) {
  return (
    <span
      style={p.style}
      className={cx(
        "tf-shape",
        "tf-shape-" + (STATUS[p.status] || "ring"),
        "tf-st-" + (p.status || "idle"),
        p.className,
      )}
      aria-hidden
    />
  );
}

export function StatusIndicator(p: StatusIndicatorProps) {
  return (
    <span
      style={p.style}
      className={cx("tf-status", p.size === "sm" && "sm", p.className)}
      role={p.label ? undefined : "img"}
      aria-label={p.label ? undefined : p.status}
    >
      <StatusShape status={p.status} />
      {p.label && <span className="tf-status-label">{p.label}</span>}
    </span>
  );
}

/* ── Approval A–D ── */
