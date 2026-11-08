"use client";
import { Button } from "@twentyfirstmedia/ui-core";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BASE_PATH } from "@/lib/site";

/** The page's Markdown twin: /halo/cli/ → /halo/cli.md, /halo/ → /halo/index.md */
export function mdHref(pathname: string): string {
  const p = pathname.replace(/\/$/, "");
  return /^\/(halo|pro)$/.test(p) ? `${BASE_PATH}${p}/index.md` : `${BASE_PATH}${p}.md`;
}

/** Copy the page as Markdown (to paste into an agent) or open the raw file. */
export function PageActions() {
  const href = mdHref(usePathname() ?? "/halo/");
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(t);
  }, [state]);
  const copy = async () => {
    try {
      const res = await fetch(href);
      if (!res.ok) throw new Error(String(res.status));
      await navigator.clipboard.writeText(await res.text());
      setState("copied");
    } catch {
      setState("failed");
    }
  };
  return (
    <div className="docs-page-actions">
      <Button
        size="sm"
        variant="secondary"
        icon={state === "copied" ? "check" : "copy"}
        onClick={copy}
      >
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy Markdown"}
      </Button>
      <Button size="sm" variant="ghost" icon="file" asChild>
        <a href={href}>View as Markdown</a>
      </Button>
      <span className="docs-sr" aria-live="polite">
        {state === "copied"
          ? "Markdown copied to the clipboard"
          : state === "failed"
            ? "Copying failed"
            : ""}
      </span>
    </div>
  );
}
