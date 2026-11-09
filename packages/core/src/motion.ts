"use client";
import { useEffect, useState } from "react";
import { reduced } from "./cx.js";
import { useUI, type Motion } from "./provider.js";

/**
 * Runs `update` (a route change, a tab switch, new data) as a view transition: the old page fades
 * out and the new one rises in, in the kit's motion. Falls back to a plain update where the
 * browser has no view transitions or motion is off.
 */
export async function startViewTransition(update: () => void | Promise<void>): Promise<void> {
  const doc = typeof document === "undefined" ? undefined : document;
  const start = (
    doc as
      | (Document & {
          startViewTransition?: (cb: () => void | Promise<void>) => { finished: Promise<void> };
        })
      | undefined
  )?.startViewTransition;
  if (!doc || !start || reduced()) {
    await update();
    return;
  }
  try {
    await start.call(doc, update).finished;
  } catch {
    // an interrupted transition still ran the update
  }
}

/**
 * The motion level in effect: "off" while the reader asks for reduced motion or the nearest
 * provider turns motion off, otherwise the provider's level ("standard" by default).
 */
export function useMotion(): Motion {
  const { motion } = useUI();
  const [off, setOff] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setOff(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  if (off) return "off";
  return motion ?? "standard";
}
