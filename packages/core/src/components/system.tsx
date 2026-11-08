import * as React from "react";
import { L } from "../i18n.js";
import { Button, TintIcon } from "./foundation.js";
import type { AuthCardProps, IconName, StatusScreenProps, Tint } from "./types.js";

/* ── System screens ── */
export function StatusScreen(p: StatusScreenProps) {
  const code = p.code || "404";
  const d: [string | undefined, string | undefined, IconName, Tint] = (
    {
      "404": [
        L("Page not found"),
        L("The link may be old, or the page moved. Nothing is broken on your side."),
        "search",
        "sky",
      ],
      "500": [
        L("Something broke on our side"),
        L("We’ve been notified and are on it. Your data is safe; try again in a minute."),
        "x",
        "blush",
      ],
      maintenance: [
        L("Back in a few minutes"),
        L("We’re upgrading the database. Everything you saved is safe."),
        "settings",
        "butter",
      ],
      offline: [
        L("You’re offline"),
        L("Changes are kept on this device and sync when you’re back."),
        "globe",
        "lilac",
      ],
      "403": [
        L("You don’t have access"),
        L("Ask a workspace owner to invite you to this area."),
        "lock",
        "lilac",
      ],
    } as Record<string, [string, string, IconName, Tint]>
  )[code] || [p.title, p.text, "sparkle", "sky"];
  return (
    <div className="tf-status-screen">
      <div className="tf-status-art" aria-hidden>
        {/^\d+$/.test(code) && <span className="tf-status-code">{code}</span>}
        <TintIcon icon={p.icon || d[2]} tint={p.tint || d[3]} size={56} />
      </div>
      <h1>{p.title || d[0]}</h1>
      <p>{p.text || d[1]}</p>
      {p.extra}
      <div
        className="tf-row"
        style={{
          justifyContent: "center",
        }}
      >
        {p.actions || [
          <Button key="h" icon="home" onClick={p.onHome}>
            {L("Back to overview")}
          </Button>,
          <Button key="s" variant="secondary" icon="mail" onClick={p.onContact}>
            {L("Contact support")}
          </Button>,
        ]}
      </div>
      {p.reference && (
        <span className="tf-status-ref">
          {L("Reference {ref}", {
            ref: p.reference,
          })}
        </span>
      )}
    </div>
  );
}

export function AuthCard(p: AuthCardProps) {
  return (
    <div className="tf-auth">
      <div className="tf-auth-brand">
        <span className="tf-brand-word">{p.brand}</span>
        <span className="tf-brand-dot" />
      </div>
      {p.icon && <TintIcon icon={p.icon} tint={p.tint || "sky"} size={48} />}
      <div
        className="tf-col"
        style={{
          gap: 8,
        }}
      >
        <h1 className="tf-auth-title">{p.title}</h1>
        {p.text && <p className="tf-auth-text">{p.text}</p>}
      </div>
      {p.children}
      {p.foot && <div className="tf-auth-foot">{p.foot}</div>}
    </div>
  );
}

/* ════════ Kit 4: status, approvals A–D, foundations, agent & operations components ════════ */
