"use client";
import * as React from "react";
import { useControlled } from "../hooks.js";
import { cx } from "../cx.js";
import { Icon } from "../Icon.js";
import { AgentMark } from "./chat.js";
import { Button, IconButton, TintIcon } from "./foundation.js";
import { Switch } from "./inputs.js";
import type { AnnouncementBarProps, ChatLauncherProps, CookieConsentProps } from "./types.js";

/* ── Site chrome: assistant launcher, cookie consent, announcement ── */
export function ChatLauncher(p: ChatLauncherProps) {
  const open = useControlled(p.open, false, p.onOpenChange);
  return (
    <div className={cx("tf-launch", open[0] && "open", p.inline && "inline")}>
      {open[0] && (
        <div className="tf-launch-panel" role="dialog" aria-label={p.title || "Assistant"}>
          <div className="tf-launch-head">
            <AgentMark tint={p.tint || "lilac"} size={32} />
            <div
              className="tf-option-text"
              style={{
                flex: 1,
              }}
            >
              <b>{p.title || "Assistant"}</b>
              {p.context && <small>{p.context}</small>}
            </div>
            {p.headerAction}
            <IconButton
              icon="x"
              size="sm"
              label="Close"
              onClick={() => {
                open[1](false);
              }}
            />
          </div>
          <div className="tf-launch-body">{p.children}</div>
          {p.composer && <div className="tf-launch-foot">{p.composer}</div>}
        </div>
      )}
      <button
        type="button"
        className="tf-launch-btn"
        aria-label={open[0] ? "Close assistant" : p.title || "Open assistant"}
        aria-expanded={open[0]}
        onClick={() => {
          open[1](!open[0]);
        }}
      >
        <Icon name={open[0] ? "x" : "sparkle"} size={22} />
        {!open[0] && (p.unread ?? 0) > 0 && <span className="tf-nav-count">{p.unread}</span>}
      </button>
    </div>
  );
}

export function CookieConsent(p: CookieConsentProps) {
  const more = React.useState(false),
    cats = React.useState(
      (p.categories || []).reduce<Record<string, boolean>>((a, c) => {
        a[c.id] = !!(c.required || c.default);
        return a;
      }, {}),
    );
  if (p.open === false) return null;
  function done(all?: boolean) {
    const v = Object.assign({}, cats[0]);
    (p.categories || []).forEach((c) => {
      if (all === true) v[c.id] = true;
      if (all === false) v[c.id] = !!c.required;
    });
    p.onSave && p.onSave(v);
  }
  return (
    <div
      className={cx("tf-cookie", p.inline && "inline")}
      role="dialog"
      aria-label={p.title || "Privacy settings"}
    >
      <div
        className="tf-row"
        style={{
          gap: 12,
          alignItems: "flex-start",
          flexWrap: "nowrap",
        }}
      >
        <TintIcon icon="cookie" tint="butter" size={36} />
        <div
          className="tf-col"
          style={{
            gap: 4,
          }}
        >
          <b>{p.title || "Privacy settings"}</b>
          <p
            className="tf-card-desc"
            style={{
              margin: 0,
            }}
          >
            {p.text ||
              "We use cookies to run this site and, with your consent, to measure and improve it."}
            {p.policy && <React.Fragment> {p.policy}</React.Fragment>}
          </p>
        </div>
      </div>
      {more[0] && (
        <div className="tf-cookie-cats">
          {(p.categories || []).map((c) => (
            <div key={c.id} className="tf-cookie-cat">
              <div
                className="tf-option-text"
                style={{
                  flex: 1,
                }}
              >
                <b>{c.label}</b>
                {c.text && <small>{c.text}</small>}
              </div>
              {c.required ? (
                <span className="tf-card-desc">{"Always on"}</span>
              ) : (
                <Switch
                  checked={!!cats[0][c.id]}
                  onChange={() => {
                    const n = Object.assign({}, cats[0]);
                    n[c.id] = !n[c.id];
                    cats[1](n);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
      <div className="tf-cookie-actions">
        {more[0] ? (
          <Button
            variant="secondary"
            onClick={() => {
              done(undefined);
            }}
          >
            {"Save choice"}
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={() => {
              more[1](true);
            }}
          >
            {"Settings"}
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={() => {
            done(false);
          }}
        >
          {"Only necessary"}
        </Button>
        <Button
          onClick={() => {
            done(true);
          }}
        >
          {"Accept all"}
        </Button>
      </div>
    </div>
  );
}

export function AnnouncementBar(p: AnnouncementBarProps) {
  const shut = React.useState(false);
  if (shut[0]) return null;
  return (
    <div className={cx("tf-announce", "tf-t-" + (p.tint || "butter"))} role="status">
      {p.icon !== false && <Icon name={p.icon || "sparkle"} size={15} />}
      <span>{p.children}</span>
      {p.action}
      {p.onDismiss !== false && (
        <button
          type="button"
          className="tf-announce-x"
          aria-label="Dismiss"
          onClick={() => {
            shut[1](true);
            p.onDismiss && p.onDismiss();
          }}
        >
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}
