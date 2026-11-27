"use client";
import * as React from "react";
import { useLinkAs, useStrings } from "../context.js";
import { APP_CHROME_STRINGS } from "../strings.js";
import { cx } from "../cx.js";
import { Icon } from "../Icon.js";
import { Badge, TintIcon } from "./foundation.js";
import { StatusIndicator } from "./status.js";
import { Tooltip } from "./overlays.js";
import { BottomSheet } from "./sheet.js";
import type {
  ConfigPRSummaryProps,
  IconName,
  MobileTabBarItem,
  MobileTabBarProps,
  ModuleRegistryProps,
  PushNotificationProps,
} from "./types.js";

/* ── App chrome ── */
export function MobileTabBar(p: MobileTabBarProps) {
  const t = useStrings(APP_CHROME_STRINGS);
  const Link = useLinkAs(p.linkAs);
  const [moreOpen, setMoreOpen] = React.useState(false);
  const more = p.more || [];
  const moreOn = more.some((it) => it.id === p.active);
  const moreCount = more.reduce((n, it) => n + (it.count || 0), 0);
  const moreSignal = more.some((it) => it.count && it.countTone === "signal");
  const count = (n: number | undefined, tone?: "neutral" | "signal") =>
    n ? <span className={cx("tf-dotcount", tone === "signal" && "signal")}>{n}</span> : null;
  const tab = (it: MobileTabBarItem) => {
    const on = it.id === p.active;
    const inner = (
      <>
        <span className="tf-tabbar-ico">
          <Icon name={it.icon} size={20} />
          {count(it.count, it.countTone)}
        </span>
        <span className="tf-tabbar-label">{it.label}</span>
      </>
    );
    const cls = cx("tf-tabbar-item", on && "on");
    return it.href ? (
      <Link
        key={it.id}
        href={it.href}
        className={cls}
        aria-current={on ? "page" : undefined}
        onClick={() => p.onPick?.(it.id)}
      >
        {inner}
      </Link>
    ) : (
      <button
        key={it.id}
        type="button"
        className={cls}
        aria-current={on ? "page" : undefined}
        onClick={() => {
          p.onPick && p.onPick(it.id);
        }}
      >
        {inner}
      </button>
    );
  };
  // the pages behind "More", grouped as given
  const groups: { name?: string; items: typeof more }[] = [];
  for (const it of more) {
    const last = groups[groups.length - 1];
    if (last && last.name === it.group) last.items.push(it);
    else groups.push({ name: it.group, items: [it] });
  }
  return (
    <nav
      style={p.style}
      className={cx("tf-tabbar", p.className)}
      aria-label={p.label || t.mainNavigation}
    >
      {(p.items || []).map(tab)}
      {more.length > 0 && (
        <button
          type="button"
          className={cx("tf-tabbar-item", (moreOn || moreOpen) && "on")}
          aria-haspopup="dialog"
          aria-expanded={moreOpen}
          aria-current={moreOn ? "page" : undefined}
          onClick={() => setMoreOpen(true)}
        >
          <span className="tf-tabbar-ico">
            <Icon name={p.moreIcon || "menu"} size={20} />
            {count(moreCount, moreSignal ? "signal" : undefined)}
          </span>
          <span className="tf-tabbar-label">{t.more}</span>
        </button>
      )}
      {more.length > 0 && (
        <BottomSheet
          open={moreOpen}
          title={t.morePages}
          onClose={() => setMoreOpen(false)}
          className="tf-tabbar-more"
        >
          {groups.map((g, gi) => (
            <div key={g.name ?? gi} className="tf-tabbar-more-group">
              {g.name && <div className="tf-tabbar-more-label">{g.name}</div>}
              <ul className="tf-tabbar-more-list">
                {g.items.map((it) => {
                  const on = it.id === p.active;
                  const inner = (
                    <>
                      <Icon name={it.icon} />
                      <span className="tf-tabbar-more-text">{it.label}</span>
                      {it.count ? (
                        <span className={cx("tf-nav-count", it.countTone === "signal" && "signal")}>
                          {it.count}
                        </span>
                      ) : null}
                    </>
                  );
                  const pick = () => {
                    p.onPick?.(it.id);
                    setMoreOpen(false);
                  };
                  return (
                    <li key={it.id}>
                      {it.href ? (
                        <Link
                          href={it.href}
                          className={cx("tf-tabbar-more-item", on && "on")}
                          aria-current={on ? "page" : undefined}
                          onClick={pick}
                        >
                          {inner}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className={cx("tf-tabbar-more-item", on && "on")}
                          aria-current={on ? "page" : undefined}
                          onClick={pick}
                        >
                          {inner}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </BottomSheet>
      )}
    </nav>
  );
}

export function PushNotification(p: PushNotificationProps) {
  return (
    <div style={p.style} className={cx("tf-push", p.className)}>
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
    <div style={p.style} className={cx("tf-prsum", p.className)}>
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
    <div style={p.style} className={cx("tf-modules", p.className)}>
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
