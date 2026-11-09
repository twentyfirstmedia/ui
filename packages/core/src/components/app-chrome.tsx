"use client";
import * as React from "react";
import { useStrings } from "../context.js";
import { APP_CHROME_STRINGS } from "../strings.js";
import { cx } from "../cx.js";
import { Icon } from "../Icon.js";
import { Badge, TintIcon } from "./foundation.js";
import { StatusIndicator } from "./status.js";
import { Tooltip } from "./overlays.js";
import type {
  ConfigPRSummaryProps,
  IconName,
  MobileTabBarProps,
  ModuleRegistryProps,
  PushNotificationProps,
} from "./types.js";

/* ── App chrome ── */
export function MobileTabBar(p: MobileTabBarProps) {
  const t = useStrings(APP_CHROME_STRINGS);
  return (
    <nav className="tf-tabbar" aria-label={p.label || t.mainNavigation}>
      {(p.items || []).map((it) => {
        const on = it.id === p.active;
        return (
          <button
            key={it.id}
            type="button"
            className={cx("tf-tabbar-item", on && "on")}
            aria-current={on ? "page" : undefined}
            onClick={() => {
              p.onPick && p.onPick(it.id);
            }}
          >
            <span className="tf-tabbar-ico">
              <Icon name={it.icon} size={20} />
              {it.count ? <span className="tf-dotcount">{it.count}</span> : null}
            </span>
            <span>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function PushNotification(p: PushNotificationProps) {
  return (
    <div className="tf-push">
      <div className="tf-push-top">
        <span className="tf-push-app">{p.app}</span>
        <small>{p.time}</small>
      </div>
      <b>{p.title}</b>
      <p>{p.text}</p>
      {p.actions && (
        <div className="tf-push-actions">
          {p.actions.map((a) => (
            <button key={a.label} type="button" onClick={a.onClick}>
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ConfigPRSummary(p: ConfigPRSummaryProps) {
  const ICON: Record<string, IconName> = {
    project: "grid",
    team: "users",
    agent: "bot",
    tool: "zap",
    trigger: "clock",
    file: "file",
  };
  return (
    <div className="tf-prsum">
      <div className="tf-prsum-head">
        <TintIcon icon="branch" tint="lilac" />
        <span className="tf-option-text">
          <b>{p.title}</b>
          <small>{p.meta}</small>
        </span>
        {p.status && <StatusIndicator status={p.status} label={p.statusLabel} />}
      </div>
      {p.summary && (
        <p
          className="tf-card-desc"
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: "22px",
          }}
        >
          {p.summary}
        </p>
      )}
      <ul className="tf-prsum-list">
        {(p.items || []).map((it, i) => (
          <li key={i} className={"op-" + (it.op || "add")}>
            <span className="tf-prsum-op">
              {it.op === "remove" ? "−" : it.op === "change" ? "~" : "+"}
            </span>
            <Icon name={ICON[it.kind] || "file"} size={14} />
            <span className="tf-option-text">
              <b>{it.name}</b>
              {it.detail && <small>{it.detail}</small>}
            </span>
          </li>
        ))}
      </ul>
      {p.actions && (
        <div
          className="tf-row"
          style={{
            justifyContent: "flex-end",
          }}
        >
          {p.actions}
        </div>
      )}
    </div>
  );
}

export function ModuleRegistry(p: ModuleRegistryProps) {
  const t = useStrings(APP_CHROME_STRINGS);
  return (
    <div className="tf-modules">
      {(p.items || []).map((m) => (
        <div key={m.id} className="tf-module">
          <TintIcon
            icon={m.icon || "grid"}
            tint={m.core ? "plain" : m.enabled ? "mint" : "plain"}
          />
          <span className="tf-option-text">
            <b>
              {m.name} <span className="tf-mono tf-module-v">{m.version}</span>
            </b>
            <small>{m.text}</small>
          </span>
          {m.adds && (
            <span className="tf-module-adds">
              {m.adds.map((a) => (
                <Badge key={a} tone="neutral" dot={false}>
                  {a}
                </Badge>
              ))}
            </span>
          )}
          {m.core ? (
            <Tooltip label={p.coreLabel || t.coreModule}>
              <span className="tf-module-lock" tabIndex={0}>
                <Icon name="lock" size={14} />
              </span>
            </Tooltip>
          ) : (
            <input
              type="checkbox"
              role="switch"
              className="tf-switch"
              checked={!!m.enabled}
              aria-label={m.name}
              onChange={() => {
                p.onToggle && p.onToggle(m);
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ════════ Kit 5: admin (FollowerPilot) and real-estate (Capitaso) components ════════ */
