"use client";
import * as React from "react";
import { useControlled } from "../hooks.js";
import { cx } from "../cx.js";
import { Avatar } from "./foundation.js";
import { Segmented } from "./forms.js";
import { StatusIndicator } from "./status.js";

import type { EmailPreviewProps, SearchAdPreviewProps } from "./types.js";

/* ── Email and ad previews ── */
export function EmailPreview(p: EmailPreviewProps) {
  const dev = useControlled<string>(p.device, "desktop", p.onDevice);
  return (
    <div className="tf-mailprev">
      <div className="tf-mailprev-head">
        <div className="tf-mailprev-inbox">
          <Avatar name={p.fromName || p.from || ""} size={36} />
          <div className="tf-option-text">
            <b>{p.fromName || p.from}</b>
            <span className="tf-mailprev-subj">
              <b>{p.subject || "(No subject)"}</b>
              {p.preheader && <span>{" — " + p.preheader}</span>}
            </span>
          </div>
        </div>
        <Segmented
          size="sm"
          value={dev[0]}
          onChange={dev[1]}
          label="Device"
          options={[
            {
              value: "desktop",
              label: "Desktop",
            },
            {
              value: "mobile",
              label: "Mobile",
            },
          ]}
        />
      </div>
      <div className={cx("tf-mailprev-stage", dev[0])}>
        <div className="tf-mailprev-frame">
          {p.html != null ? (
            <iframe title="Email preview" sandbox="" srcDoc={p.html} />
          ) : (
            <div className="tf-mailprev-body">{p.children}</div>
          )}
        </div>
      </div>
      {p.checks && (
        <div className="tf-mailprev-checks">
          {p.checks.map((c, i) => (
            <StatusIndicator key={i} status={c.status} label={c.label} size="sm" />
          ))}
        </div>
      )}
    </div>
  );
}

export function SearchAdPreview(p: SearchAdPreviewProps) {
  const dev = useControlled<string>(p.device, "mobile", p.onDevice),
    hl = (p.headlines || []).filter(Boolean).slice(0, 3),
    ds = (p.descriptions || []).filter(Boolean).slice(0, 2);
  const lim: ["headlines" | "descriptions" | "paths", number][] = [
      ["headlines", 30],
      ["descriptions", 90],
      ["paths", 15],
    ],
    warn: string[] = [];
  lim.forEach((x) => {
    (p[x[0]] || []).forEach((s, i) => {
      if (s && s.length > x[1])
        warn.push(
          `${
            x[0] === "headlines" ? "Headline" : x[0] === "descriptions" ? "Description" : "Path"
          } ${i + 1} is ${s.length} characters, the limit is ${x[1]}`,
        );
    });
  });
  const url =
    (p.domain || "") +
    (p.paths || [])
      .filter(Boolean)
      .map((x) => " › " + x)
      .join("");
  return (
    <div className="tf-adprev">
      <div
        className="tf-row"
        style={{
          justifyContent: "space-between",
        }}
      >
        <span
          className="tf-menu-label"
          style={{
            padding: 0,
          }}
        >
          {"Preview"}
        </span>
        <Segmented
          size="sm"
          value={dev[0]}
          onChange={dev[1]}
          label="Device"
          options={[
            {
              value: "mobile",
              label: "Mobile",
            },
            {
              value: "desktop",
              label: "Desktop",
            },
          ]}
        />
      </div>
      <div className={cx("tf-adprev-card", dev[0])}>
        <div className="tf-adprev-top">
          <span className="tf-adprev-fav" aria-hidden>
            {(p.name || p.domain || "?").charAt(0).toUpperCase()}
          </span>
          <div className="tf-option-text">
            <b>{p.name || p.domain}</b>
            <small>{url}</small>
          </div>
          <span className="tf-adprev-tag">{p.sponsoredLabel || "Sponsored"}</span>
        </div>
        <a
          className="tf-adprev-hl"
          href="#"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          {hl.join(" | ") || "Your headline"}
        </a>
        <p className="tf-adprev-desc">{ds.join(" ") || "Your description"}</p>
        {p.sitelinks && p.sitelinks.length > 0 && (
          <div className="tf-adprev-links">
            {p.sitelinks.map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
        )}
      </div>
      {warn.length > 0 && (
        <div
          className="tf-col"
          style={{
            gap: 4,
          }}
        >
          {warn.map((w, i) => (
            <StatusIndicator key={i} status="warn" label={w} size="sm" />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Money and operations for admins ── */
