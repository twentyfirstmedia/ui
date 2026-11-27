"use client";
/**
 * Infrastructure: CommandWhitelist (the commands an agent may run per server, with parameters,
 * risk and whether an approval is needed) and DomainHeader (a domain with expiry, SSL and mail
 * lights, above its DnsRecordTable).
 */
import * as React from "react";
import { cx } from "../cx.js";
import { useFormat, useStrings } from "../context.js";
import { INFRA_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { StatusIndicator, StatusShape } from "./status.js";
import { expiryStatus } from "./operations.js";
import type {
  CommandRisk,
  CommandWhitelistProps,
  DomainHeaderCheck,
  DomainHeaderProps,
  Status,
} from "./types.js";

const RISK_STATUS: Record<CommandRisk, Status> = { read: "ok", change: "warn", critical: "danger" };

/** The template with its `{parameters}` marked. */
function Template({ text }: { text: string }) {
  const parts = text.split(/(\{[^}]+\})/g).filter(Boolean);
  return (
    <code className="tf-wl-template">
      {parts.map((part, i) =>
        /^\{[^}]+\}$/.test(part) ? (
          <span key={i} className="tf-wl-param">
            {part}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </code>
  );
}

/* ── CommandWhitelist ── */
export function CommandWhitelist(p: CommandWhitelistProps) {
  const t = useStrings(INFRA_STRINGS);
  return (
    <div className={cx("tf-wl", p.className)} style={p.style}>
      {p.servers.map((srv) => (
        <section key={srv.id} className="tf-wl-server" aria-label={String(srv.name ?? srv.id)}>
          <header className="tf-wl-head">
            <Icon name="server" size={16} />
            <b>{srv.name}</b>
            {srv.host && <span className="tf-mono">{srv.host}</span>}
          </header>
          {srv.commands.length === 0 ? (
            <p className="tf-wl-empty">{t.noAllowedCommands}</p>
          ) : (
            <ul className="tf-wl-list" aria-label={t.allowedCommands}>
              {srv.commands.map((c) => {
                const approval = c.approval ?? c.risk !== "read";
                return (
                  <li key={c.id} className={cx("tf-wl-row", "risk-" + c.risk)}>
                    <div className="tf-wl-main">
                      <Template text={c.template} />
                      {c.description && <small>{c.description}</small>}
                      {c.params && c.params.length > 0 && (
                        <dl className="tf-wl-params" aria-label={t.parametersLabel}>
                          {c.params.map((pr) => (
                            <div key={pr.name}>
                              <dt className="tf-mono">{"{" + pr.name + "}"}</dt>
                              <dd className="tf-mono">
                                {pr.values ? pr.values.join(" | ") : pr.pattern}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </div>
                    <div className="tf-wl-meta">
                      <StatusIndicator status={RISK_STATUS[c.risk]} label={t.commandRisk[c.risk]} />
                      <span className={cx("tf-wl-approval", approval && "on")}>
                        <StatusShape status={approval ? "signal" : "idle"} />
                        {approval ? t.needsApproval : t.runsWithoutApproval}
                      </span>
                      {p.actions && <span className="tf-wl-actions">{p.actions(c, srv)}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ))}
      {p.blocked && p.blocked.length > 0 && (
        <section className="tf-wl-server tf-wl-blocked" aria-label={t.blockedCommands}>
          <header className="tf-wl-head">
            <Icon name="ban" size={16} />
            <b>{t.blockedCommands}</b>
          </header>
          <ul className="tf-wl-list">
            {p.blocked.map((b) => (
              <li key={b} className="tf-wl-row">
                <code className="tf-wl-template">{b}</code>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/* ── DomainHeader ── */
const MAIL_CHECKS = ["mx", "spf", "dkim", "dmarc"] as const;
const DAY = 86_400_000;

export function DomainHeader(p: DomainHeaderProps) {
  const t = useStrings(INFRA_STRINGS);
  const { formatDate, formatNumber } = useFormat();
  const now = p.now != null ? new Date(p.now).getTime() : Date.now();
  const days =
    p.days ??
    (p.expires != null ? Math.floor((new Date(p.expires).getTime() - now) / DAY) : undefined);
  const exp = expiryStatus(days);
  const date = (v: Date | string | number) =>
    formatDate(v, { day: "numeric", month: "short", year: "numeric" });
  const sslCaption = p.ssl
    ? [p.ssl.issuer, p.ssl.expires != null ? date(p.ssl.expires) : null].filter(
        (x) => x != null && x !== "",
      )
    : [];
  const cell = (
    key: "ssl" | "expiry" | "mx" | "spf" | "dkim" | "dmarc",
    label: React.ReactNode,
    body: React.ReactNode,
    caption?: React.ReactNode,
  ) => {
    const inner = (
      <>
        <small className="tf-domainhead-label">{label}</small>
        {body}
        {caption != null && caption !== "" && (
          <small className="tf-domainhead-caption">{caption}</small>
        )}
      </>
    );
    return p.onOpenCheck ? (
      <button
        type="button"
        className="tf-domainhead-cell"
        onClick={() => {
          p.onOpenCheck?.(key);
        }}
      >
        {inner}
      </button>
    ) : (
      <div className="tf-domainhead-cell">{inner}</div>
    );
  };
  const light = (k: (typeof MAIL_CHECKS)[number], c?: DomainHeaderCheck) => (
    <li key={k}>
      {p.onOpenCheck ? (
        <button
          type="button"
          className="tf-domainhead-light"
          onClick={() => {
            p.onOpenCheck?.(k);
          }}
        >
          <StatusIndicator status={c?.status || "idle"} label={k.toUpperCase()} />
          {c?.label && <span className="tf-sr-only">{": " + c.label}</span>}
        </button>
      ) : (
        <span className="tf-domainhead-light" title={c?.label}>
          <StatusIndicator status={c?.status || "idle"} label={k.toUpperCase()} />
          {c?.label && <span className="tf-sr-only">{": " + c.label}</span>}
        </span>
      )}
    </li>
  );
  return (
    <header className={cx("tf-domainhead", p.className)} style={p.style}>
      <div className="tf-domainhead-top">
        <StatusShape status={exp} />
        <h2 className="tf-domainhead-name tf-mono">{p.name}</h2>
        {p.actions && <div className="tf-domainhead-actions">{p.actions}</div>}
      </div>
      {(p.registrar != null || p.dns != null) && (
        <p className="tf-domainhead-meta">
          {p.registrar != null && (
            <span>
              {t.registrarLabel}: <b>{p.registrar}</b>
            </span>
          )}
          {p.dns != null && (
            <span>
              {t.dnsLabel}: <b>{p.dns}</b>
            </span>
          )}
        </p>
      )}
      <div className="tf-domainhead-grid">
        {cell(
          "expiry",
          t.expiresLabel,
          <StatusIndicator
            status={exp}
            label={
              days == null
                ? t.notOnFile
                : days < 0
                  ? t.expired
                  : t.daysLeft(days, formatNumber(days))
            }
          />,
          [p.expires != null ? date(p.expires) : null, p.autoRenew ? t.renewsAutomatically : null]
            .filter(Boolean)
            .join(" · "),
        )}
        {p.ssl &&
          cell(
            "ssl",
            t.sslLabel,
            <StatusIndicator status={p.ssl.status} label={p.ssl.label} />,
            sslCaption.length
              ? sslCaption.map((x, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && " · "}
                    {x}
                  </React.Fragment>
                ))
              : undefined,
          )}
        {p.mail && (
          <div className="tf-domainhead-cell tf-domainhead-mail">
            <small className="tf-domainhead-label">{t.mailLabel}</small>
            <ul className="tf-domainhead-lights">
              {MAIL_CHECKS.map((k) => light(k, p.mail?.[k]))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
