"use client";
import { useEffect, useRef, useState } from "react";
import { durationToken, reduced } from "./cx.js";

export interface Presence {
  /** Render the layer: while open and while it plays its exit. */
  mounted: boolean;
  /** The layer is leaving: it carries `data-closing` (exit animation) and is inert. */
  closing: boolean;
}

/**
 * Keeps a layer (menu, popover, dialog, drawer, toast) in the page for `--dur-exit` after it
 * closes, so it can animate out. With motion off, reduced motion or no exit duration it leaves at
 * once, as before.
 */
export function usePresence(open: boolean): Presence {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }
    if (!mounted) return;
    const ms = reduced() ? 0 : durationToken("--dur-exit", 0);
    if (ms <= 0) {
      setMounted(false);
      setClosing(false);
      return;
    }
    setClosing(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setMounted(false);
      setClosing(false);
    }, ms);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the open state drives this
  }, [open]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return { mounted: mounted || open, closing: closing && !open };
}

/** Props for the layer's root while it leaves. */
export function leaving(closing: boolean): { "data-closing"?: ""; inert?: boolean } {
  return closing ? { "data-closing": "", inert: true } : {};
}
