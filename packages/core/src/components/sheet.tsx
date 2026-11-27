"use client";
/**
 * Internal: a bottom sheet in the portal, and a popover that becomes one on phones. Kept apart
 * from `Popover` and `Drawer` so components that only float a menu (DataTable, Select) do not
 * carry the sheet.
 */
import * as React from "react";
import { leaving, usePresence } from "../presence.js";
import { useControlled, usePhone, useTrap } from "../hooks.js";
import { Portal } from "../portal.js";
import { useStrings } from "../context.js";
import { cx } from "../cx.js";
import { IconButton } from "./foundation.js";
import { Popover } from "./overlays.js";
import type { PopoverProps } from "./types.js";

/** A modal sheet from the bottom edge with a title and a close button. */
export function BottomSheet(p: {
  open: boolean;
  title: string;
  onClose: () => void;
  className?: string;
  children?: React.ReactNode;
}) {
  const t = useStrings();
  const ref = React.useRef<HTMLElement>(null);
  const pr = usePresence(p.open);
  useTrap(ref, p.onClose, p.open && pr.mounted);
  if (!pr.mounted) return null;
  return (
    <Portal>
      <div
        {...leaving(pr.closing)}
        className="tf-drawer-wrap"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) p.onClose();
        }}
      >
        <aside
          ref={ref}
          className={cx("tf-drawer", "side-bottom", p.className)}
          role="dialog"
          aria-modal="true"
          aria-label={p.title}
        >
          <div className="tf-header tf-sheet-head">
            <div className="tf-panel-title">{p.title}</div>
            <IconButton icon="x" label={t.close} onClick={p.onClose} />
          </div>
          {p.children}
        </aside>
      </div>
    </Portal>
  );
}

/** A `Popover` on wide screens, a `BottomSheet` titled `label` on phones (up to 760px). */
export function SheetPopover(p: PopoverProps) {
  const phone = usePhone();
  const [open, setOpen] = useControlled(p.open, false, p.onOpenChange);
  if (!phone) return <Popover {...p} open={open} onOpenChange={setOpen} />;
  const close = () => setOpen(false);
  const toggle = () => setOpen(!open);
  return (
    <span style={p.style} className={cx("tf-pop-anchor", p.block && "block", p.className)}>
      {typeof p.trigger === "function" ? (
        p.trigger({ open, toggle })
      ) : (
        <span onClick={toggle}>{p.trigger}</span>
      )}
      <BottomSheet open={open} title={p.label || ""} onClose={close} className="tf-pop-sheet">
        {typeof p.children === "function" ? p.children({ close }) : p.children}
      </BottomSheet>
    </span>
  );
}
