"use client";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useUI } from "./provider.js";

/**
 * Renders children into the provider's portal root (subtree scope) or document.body.
 * Renders nothing on the server and on the first client render, so hydration stays stable.
 */
export function Portal({ children }: { children?: ReactNode }) {
  const { portalRoot } = useUI();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || typeof document === "undefined") return null;
  return createPortal(children, portalRoot ?? document.body);
}
