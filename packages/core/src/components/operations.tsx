"use client";
import * as React from "react";
import { Icon } from "../Icon.js";
import { cx } from "../cx.js";
import { useScrollFocus } from "../hooks.js";
import { L, formatMoney, formatPercent } from "../i18n.js";
import { StatusIndicator, StatusShape } from "./status.js";
import { Meter, UptimeBar } from "./developer.js";
import { DataTable } from "./data-table.js";
import { Badge, Button, TintIcon } from "./foundation.js";
import { Popover, Tooltip } from "./overlays.js";
import { Menu } from "./feedback.js";
import { InlineEdit } from "./building-blocks.js";
import type {
  ConnectionBannerProps,
  ConnectionCardProps,
  DeployPipelineProps,
  DnsRecordTableProps,
  DomainListProps,
  LedgerTableProps,
  MailAuthStatusProps,
  PnLStatementProps,
  ReceiptSuggestionProps,
  ServerCardProps,
  Status,
} from "./types.js";

/* ── Operations ── */
export function ConnectionCard(p: ConnectionCardProps) {
  const tone =
    (
      {
        connected: "ok",
        expiring: "warn",
        error: "danger",
        missing: "idle",
      } as Record<string, Status>
    )[p.status] || "idle";
  return (
    <div className="tf-conn">
      <span className="tf-conn-ico">{p.logo || <Icon name={p.icon || "link"} size={18} />}</span>
      <span className="tf-option-text">
        <b>{p.name}</b>
        <small>{p.text}</small>
      </span>
      <StatusIndicator status={tone} label={p.statusLabel} />
      {p.action && <span className="tf-conn-act">{p.action}</span>}
    </div>
  );
}

export function ConnectionBanner(p: ConnectionBannerProps) {
  if (!p.state || p.state === "online") return null;
  return (
    <div className={cx("tf-connbanner", p.state)} role="status">
      <StatusShape status={p.state === "offline" ? "danger" : "warn"} />
      <span>
        {p.text ||
          (p.state === "offline"
            ? L("Offline. Changes are kept and sent when you’re back.")
            : L("Connection lost. Retrying in {s} s", {
                s: p.seconds != null ? p.seconds : "…",
              }))}
      </span>
      {p.onRetry && (
        <button type="button" className="tf-linkbtn" onClick={p.onRetry}>
          {L("Retry now")}
        </button>
      )}
    </div>
  );
}

export function ServerCard(p: ServerCardProps) {
  return (
    <div className="tf-server">
      <div className="tf-server-top">
        <span className="tf-conn-ico">{p.logo || <Icon name="server" size={18} />}</span>
        <span className="tf-option-text">
          <b>{p.name}</b>
          <small className="tf-mono">{[p.provider, p.address].filter(Boolean).join(" · ")}</small>
        </span>
        <StatusIndicator status={p.status || "idle"} label={p.statusLabel} />
      </div>
      <div
        className="tf-col"
        style={{
          gap: 12,
        }}
      >
        {(p.meters || []).map((m) =>
          m.value == null ? (
            <div key={m.label} className="tf-usage-top">
              <span>{m.label}</span>
              <b>{m.unknown || L("Unknown")}</b>
            </div>
          ) : (
            <Meter key={m.label} label={m.label} value={m.value} max={m.max} text={m.text} />
          ),
        )}
      </div>
      {p.uptime && <UptimeBar {...p.uptime} />}
      {p.foot && <div className="tf-server-foot">{p.foot}</div>}
    </div>
  );
}

export function DeployPipeline(p: DeployPipelineProps) {
  return (
    <ol className="tf-pipeline" tabIndex={0} aria-label={L("Deploy pipeline")}>
      {(p.stages || []).map((s, i) => (
        <li key={i} className={cx("tf-stage", "st-" + (s.status || "idle"))}>
          <StatusShape status={s.status === "done" ? "ok" : s.status || "idle"} />
          <b>{s.name}</b>
          <small className="tf-mono">{s.duration || "—"}</small>
          {s.action}
        </li>
      ))}
    </ol>
  );
}

export function DnsRecordTable(p: DnsRecordTableProps) {
  return (
    <DataTable
      rows={p.records || []}
      rowKey="id"
      columnToggle={false}
      selectable={p.selectable}
      bulkActions={p.bulkActions}
      toolbar={p.toolbar}
      columns={[
        {
          key: "type",
          label: L("Type"),
          sortable: true,
          render: (r) => (
            <Badge tone="neutral" dot={false} className="tf-mono">
              {r.type}
            </Badge>
          ),
        },
        {
          key: "name",
          label: L("Name"),
          sortable: true,
          render: (r) => <span className="tf-mono">{r.name}</span>,
        },
        {
          key: "content",
          label: L("Content"),
          render: (r) => (
            <Tooltip label={r.content}>
              <span className="tf-mono tf-trunc" tabIndex={0}>
                {r.content}
              </span>
            </Tooltip>
          ),
        },
        {
          key: "ttl",
          label: L("TTL"),
          align: "right",
          render: (r) => <span className="tf-mono">{r.ttl}</span>,
        },
        {
          key: "proxy",
          label: L("Proxy"),
          render: (r) =>
            r.proxy == null ? (
              "—"
            ) : (
              <StatusIndicator
                status={r.proxy ? "ok" : "idle"}
                label={r.proxy ? L("Proxied") : L("DNS only")}
              />
            ),
        },
        {
          key: "x",
          label: "",
          align: "right",
          hideable: false,
          render: (r) =>
            p.rowMenu ? (
              <Popover
                align="end"
                flush
                width={200}
                trigger={(s) => (
                  <button
                    type="button"
                    className="tf-iconbtn tf-iconbtn-ghost tf-iconbtn-sm"
                    aria-label={L("Actions")}
                    onClick={s.toggle}
                  >
                    <Icon name="more" />
                  </button>
                )}
              >
                {(s) => (
                  <Menu
                    items={(p.rowMenu?.(r) ?? []).map((it) =>
                      it === "-"
                        ? it
                        : Object.assign({}, it, {
                            onClick: () => {
                              s.close();
                              it.onClick && it.onClick();
                            },
                          }),
                    )}
                  />
                )}
              </Popover>
            ) : null,
        },
      ]}
    />
  );
}

export function DomainList(p: DomainListProps) {
  return (
    <div className="tf-domains">
      {(p.items || [])
        .slice()
        .sort((a, b) => (a.days == null ? 9999 : a.days) - (b.days == null ? 9999 : b.days))
        .map((d) => {
          const st = d.days == null ? "idle" : d.days < 7 ? "danger" : d.days < 30 ? "warn" : "ok";
          return (
            <button
              key={d.name}
              type="button"
              className="tf-domainrow"
              onClick={() => {
                p.onOpen && p.onOpen(d);
              }}
            >
              <StatusShape status={st} />
              <span className="tf-option-text">
                <b className="tf-mono">{d.name}</b>
                <small>{[d.registrar, d.dns].filter(Boolean).join(" · ")}</small>
              </span>
              <span className="tf-domainrow-cell">
                <small>{L("Expires")}</small>
                <b className="tf-mono">
                  {d.days == null
                    ? "—"
                    : L("{n} days", {
                        n: d.days,
                      })}
                </b>
              </span>
              <span className="tf-domainrow-cell">
                <small>{L("SSL")}</small>
                <StatusIndicator status={d.ssl || "idle"} label={d.sslLabel} />
              </span>
            </button>
          );
        })}
    </div>
  );
}

export function MailAuthStatus(p: MailAuthStatusProps) {
  const cols = p.columns || ["MX", "SPF", "DKIM", "DMARC"];
  const box = React.useRef<HTMLDivElement>(null);
  useScrollFocus(box);
  return (
    <div ref={box} className="tf-scroll-x">
      <table className="tf-table tf-mailauth">
        <thead>
          <tr>
            <th>{L("Domain")}</th>
            {cols.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(p.rows || []).map((r) => (
            <tr key={r.domain}>
              <td className="tf-mono">{r.domain}</td>
              {cols.map((c) => {
                const v = (
                  r as unknown as Record<string, { status: Status; label?: string } | undefined>
                )[c.toLowerCase()] || {
                  status: "idle",
                };
                return (
                  <td key={c}>
                    <button
                      type="button"
                      className="tf-mailauth-cell"
                      onClick={() => {
                        p.onOpen && p.onOpen(r, c);
                      }}
                    >
                      <StatusIndicator status={v.status} label={v.label} />
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LedgerTable(p: LedgerTableProps) {
  const cur = p.currency;
  return (
    <DataTable
      rows={p.rows || []}
      selectable={p.selectable}
      bulkActions={p.bulkActions}
      toolbar={p.toolbar}
      stickyHeader
      maxHeight={p.maxHeight}
      columnToggle={p.columnToggle}
      columns={[
        {
          key: "date",
          label: L("Date"),
          sortable: true,
          render: (r) => <span className="tf-mono">{r.date}</span>,
        },
        {
          key: "ref",
          label: L("Ref."),
          render: (r) => <span className="tf-mono">{r.ref}</span>,
        },
        {
          key: "text",
          label: L("Description"),
          render: (r) => (
            <span className="tf-option-text">
              <b>{r.text}</b>
              {r.suggested && (
                <small>
                  <StatusShape status="signal" />{" "}
                  {L("Suggested by {name}", {
                    name: r.suggested,
                  })}
                </small>
              )}
            </span>
          ),
        },
        {
          key: "category",
          label: L("Category"),
          render: (r) =>
            p.categories ? (
              <InlineEdit
                value={r.category || ""}
                options={p.categories}
                onSave={(v) => {
                  p.onEdit?.(r, {
                    category: v,
                  });
                }}
              />
            ) : (
              r.category
            ),
        },
        {
          key: "project",
          label: L("Project"),
          render: (r) =>
            r.project && (
              <span
                className="tf-row"
                style={{
                  gap: 8,
                  flexWrap: "nowrap",
                }}
              >
                <i className={"tf-sw tf-sw-" + (r.projectTint || "ink")} />
                {r.project}
              </span>
            ),
        },
        {
          key: "net",
          label: L("Net"),
          align: "right",
          sortable: true,
          render: (r) =>
            formatMoney(r.net, cur, {
              minimumFractionDigits: 2,
            }),
        },
        {
          key: "vat",
          label: L("VAT"),
          align: "right",
          render: (r) =>
            formatMoney(r.vat || 0, cur, {
              minimumFractionDigits: 2,
            }),
        },
        {
          key: "gross",
          label: L("Gross"),
          align: "right",
          sortable: true,
          render: (r) => (
            <b className={r.gross < 0 ? "tf-neg" : undefined}>
              {formatMoney(r.gross, cur, {
                minimumFractionDigits: 2,
              })}
            </b>
          ),
        },
        {
          key: "status",
          label: L("Status"),
          render: (r) => <StatusIndicator status={r.status || "ok"} label={r.statusLabel} />,
        },
      ]}
    />
  );
}

export function PnLStatement(p: PnLStatementProps) {
  const cols = p.columns || [];
  const box = React.useRef<HTMLDivElement>(null);
  useScrollFocus(box);
  return (
    <div ref={box} className="tf-scroll-x">
      <table className="tf-table tf-pnl">
        <thead>
          <tr>
            <th>{p.label || ""}</th>
            {cols.map((c) => (
              <th key={c} className="tf-num">
                {c}
              </th>
            ))}
            {p.total !== false && <th className="tf-num">{L("Total")}</th>}
          </tr>
        </thead>
        <tbody>
          {(p.rows || []).map((r, i) => {
            const tot = (r.values || []).reduce((a, b) => a + (b || 0), 0);
            return (
              <tr key={i} className={r.kind}>
                <td>{r.label}</td>
                {r.kind === "section" ? (
                  <td colSpan={cols.length + (p.total !== false ? 1 : 0)} />
                ) : (
                  cols.map((c, k) => {
                    const v = (r.values || [])[k];
                    return (
                      <td key={k} className={cx("tf-num", v < 0 && "tf-neg")}>
                        {v == null ? "—" : formatMoney(v, p.currency)}
                      </td>
                    );
                  })
                )}
                {r.kind !== "section" && p.total !== false && (
                  <td className={cx("tf-num", tot < 0 && "tf-neg")}>
                    <b>{formatMoney(tot, p.currency)}</b>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ReceiptSuggestion(p: ReceiptSuggestionProps) {
  return (
    <div className="tf-receipt">
      <div className="tf-receipt-src">
        <TintIcon icon="paperclip" tint="sky" />
        <span className="tf-option-text">
          <b>{p.file}</b>
          <small>{p.source}</small>
        </span>
      </div>
      <div className="tf-receipt-grid">
        {(p.fields || []).map((f) => (
          <div key={f.label} className="tf-receipt-field">
            <small>{f.label}</small>
            <b className={f.mono ? "tf-mono" : undefined}>{f.value}</b>
            {f.confidence != null && (
              <span className={cx("tf-conf", f.confidence < 0.8 && "low")}>
                {formatPercent(f.confidence * 100)}
              </span>
            )}
          </div>
        ))}
      </div>
      {p.suggestion && (
        <div className="tf-receipt-sugg">
          <StatusShape status="signal" />
          <span>{p.suggestion}</span>
        </div>
      )}
      {p.children}
      <div
        className="tf-row"
        style={{
          justifyContent: "flex-end",
        }}
      >
        {p.onDiscard && (
          <Button variant="ghost" size="sm" onClick={p.onDiscard}>
            {p.discardLabel || L("Not a receipt")}
          </Button>
        )}
        {p.onConfirm && (
          <Button size="sm" icon="check" onClick={p.onConfirm}>
            {p.confirmLabel || L("Book it")}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ── Mail ── */
