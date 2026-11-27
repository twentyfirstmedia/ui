"use client";
/**
 * What an approval shows above or as its payload, exactly as it will run: ChangePreview (before and
 * after per field, plus a line diff), CommandPreview, MessagePreview, CampaignPreview,
 * DocumentPreview, EventPreview and MoneyPreview. They go inside `ApprovalCard` (as children) and
 * work on their own too. Also `LineDiff`, `diffLines` and `maskRecipient`.
 */
import * as React from "react";
import { cx } from "../cx.js";
import { useFormat, useLinkAs, useStrings } from "../context.js";
import { APPROVAL_PREVIEWS_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { Badge } from "./foundation.js";
import { KeyValue } from "./building-blocks.js";
import { Alert } from "./feedback.js";
import { StatusIndicator } from "./status.js";
import type {
  CampaignPreviewProps,
  ChangePreviewProps,
  CommandPreviewProps,
  CommandRisk,
  DiffLine,
  DocumentPreviewProps,
  EventPreviewProps,
  KeyValueItem,
  LineDiffProps,
  MessagePreviewProps,
  MoneyPreviewProps,
  Status,
} from "./types.js";

/* ── Helpers ── */

/**
 * Masks a recipient for a preview: e-mail `e…@example.com`, phone `…5678`, IBAN `DE89 … 3000`,
 * card `…4242`, a name `Erika M.`. `kind` defaults to a guess from the value.
 */
export function maskRecipient(
  value: string,
  kind: "auto" | "email" | "phone" | "iban" | "card" | "name" = "auto",
): string {
  const v = String(value || "").trim();
  if (!v) return v;
  const k =
    kind !== "auto"
      ? kind
      : v.includes("@")
        ? "email"
        : /^[A-Z]{2}\d{2}[A-Z0-9 ]{8,}$/i.test(v)
          ? "iban"
          : /^[+\d][\d ()/-]{5,}$/.test(v)
            ? "phone"
            : /^\d[\d ]{11,}$/.test(v)
              ? "card"
              : "name";
  if (k === "email") {
    const [local, domain] = v.split("@");
    return `${(local || "").slice(0, 1)}…@${domain || ""}`;
  }
  const digits = v.replace(/[^\dA-Z]/gi, "");
  if (k === "iban") return `${digits.slice(0, 4).toUpperCase()} … ${digits.slice(-4)}`;
  if (k === "phone" || k === "card") return `…${digits.slice(-4)}`;
  const parts = v.split(/\s+/);
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1].slice(0, 1)}.` : parts[0];
}

/** A line diff of two texts (longest common subsequence; very long texts compare greedily). */
export function diffLines(before: string, after: string): DiffLine[] {
  const a = String(before ?? "").split("\n");
  const b = String(after ?? "").split("\n");
  const out: DiffLine[] = [];
  if (a.length * b.length > 4_000_000) {
    // too big for the table: walk both, matching where the line comes back later
    let i = 0,
      j = 0;
    while (i < a.length || j < b.length) {
      if (i < a.length && j < b.length && a[i] === b[j]) {
        out.push({ op: " ", text: a[i++] });
        j++;
      } else if (j < b.length && a.indexOf(b[j], i) < 0) out.push({ op: "+", text: b[j++] });
      else if (i < a.length) out.push({ op: "-", text: a[i++] });
      else out.push({ op: "+", text: b[j++] });
    }
    return out;
  }
  const n = a.length,
    m = b.length;
  const lcs: Uint32Array[] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
  let i = 0,
    j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push({ op: " ", text: a[i++] });
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) out.push({ op: "-", text: a[i++] });
    else out.push({ op: "+", text: b[j++] });
  }
  while (i < n) out.push({ op: "-", text: a[i++] });
  while (j < m) out.push({ op: "+", text: b[j++] });
  return out;
}

type FoldedLine = DiffLine | { op: "…"; count: number };

/** Keeps `context` unchanged lines around each change and folds longer unchanged runs. */
export function foldDiff(lines: DiffLine[], context: number): FoldedLine[] {
  if (!Number.isFinite(context)) return lines;
  const keep = lines.map(() => false);
  lines.forEach((l, i) => {
    if (l.op === " ") return;
    for (let k = Math.max(0, i - context); k <= Math.min(lines.length - 1, i + context); k++)
      keep[k] = true;
  });
  const out: FoldedLine[] = [];
  let run = 0;
  lines.forEach((l, i) => {
    if (keep[i]) {
      if (run) out.push({ op: "…", count: run });
      run = 0;
      out.push(l);
    } else run++;
  });
  if (run) out.push({ op: "…", count: run });
  return out;
}

/* ── LineDiff ── */
export function LineDiff(p: LineDiffProps) {
  const t = useStrings(APPROVAL_PREVIEWS_STRINGS);
  const { formatNumber } = useFormat();
  const lines = React.useMemo(
    () => p.lines ?? diffLines(p.before ?? "", p.after ?? ""),
    [p.lines, p.before, p.after],
  );
  const folded = foldDiff(lines, p.context ?? 3);
  return (
    <pre
      className={cx("tf-diff-body", "tf-linediff", p.className)}
      style={p.style}
      aria-label={p.label || t.lineChanges}
      tabIndex={0}
    >
      {folded.map((r, k) =>
        r.op === "…" ? (
          <span key={k} className="fold">
            <i>…</i>
            {t.unchangedLines(r.count, formatNumber(r.count))}
            {"\n"}
          </span>
        ) : (
          <span key={k} className={r.op === "+" ? "add" : r.op === "-" ? "del" : undefined}>
            <i aria-hidden="true">{r.op}</i>
            {r.text}
            {"\n"}
          </span>
        ),
      )}
    </pre>
  );
}

/* ── Shared parts ── */
function Warnings({ items }: { items?: React.ReactNode[] }) {
  if (!items || !items.length) return null;
  return (
    <>
      {items.map((w, i) => (
        <Alert key={i} tone="warning">
          {w}
        </Alert>
      ))}
    </>
  );
}

function Once({
  children,
  icon = "shield",
}: {
  children: React.ReactNode;
  icon?: "shield" | "key";
}) {
  return (
    <p className="tf-apreview-once">
      <Icon name={icon} size={14} />
      {children}
    </p>
  );
}

function Head({
  title,
  icon,
}: {
  title?: React.ReactNode;
  icon?: React.ComponentProps<typeof Icon>["name"];
}) {
  if (title == null || title === "") return null;
  return (
    <p className="tf-apreview-title">
      {icon && <Icon name={icon} size={16} />}
      <span>{title}</span>
    </p>
  );
}

const RISK_STATUS: Record<CommandRisk, Status> = { read: "ok", change: "warn", critical: "danger" };

function Risk({ risk }: { risk: CommandRisk }) {
  const t = useStrings(APPROVAL_PREVIEWS_STRINGS);
  return <StatusIndicator status={RISK_STATUS[risk]} label={t.commandRisk[risk]} />;
}

/* ── ChangePreview ── */
export function ChangePreview(p: ChangePreviewProps) {
  const t = useStrings(APPROVAL_PREVIEWS_STRINGS);
  const rows = p.onlyChanged
    ? p.fields.filter((f) => (f.before ?? null) !== (f.after ?? null))
    : p.fields;
  const value = (v: string | null | undefined, mono?: boolean) =>
    v == null || v === "" ? (
      <span className="tf-change-empty">{t.previewEmpty}</span>
    ) : (
      <span className={mono ? "tf-mono" : undefined}>{v}</span>
    );
  return (
    <div className={cx("tf-apreview", "tf-change", p.className)} style={p.style}>
      <Head title={p.title} />
      {p.facts && p.facts.length > 0 && <KeyValue items={p.facts} dense />}
      <table className="tf-change-table">
        <thead>
          <tr>
            <th scope="col">{p.fieldHeading || t.previewField}</th>
            <th scope="col">{t.previewBefore}</th>
            <th scope="col">{t.previewAfter}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((f, i) => {
            const changed = (f.before ?? null) !== (f.after ?? null);
            return (
              <tr key={i} className={changed ? "changed" : undefined}>
                <th scope="row">
                  {f.label}
                  {changed && <span className="tf-sr-only">{" · " + t.previewChanged}</span>}
                </th>
                <td data-label={t.previewBefore} className="before">
                  {value(f.before, f.mono)}
                </td>
                <td data-label={t.previewAfter} className="after">
                  {value(f.after, f.mono)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {p.diff && <LineDiff before={p.diff.before} after={p.diff.after} context={p.diff.context} />}
      <Warnings items={p.warnings} />
    </div>
  );
}

/* ── CommandPreview ── */
export function CommandPreview(p: CommandPreviewProps) {
  const t = useStrings(APPROVAL_PREVIEWS_STRINGS);
  const { formatNumber } = useFormat();
  const kv: KeyValueItem[] = [
    {
      k: t.serverLabel,
      v: p.host ? (
        <span className="tf-col tf-apreview-server">
          <span>{p.server}</span>
          <small className="tf-mono">{p.host}</small>
        </span>
      ) : (
        p.server
      ),
    },
    ...(p.risk ? [{ k: t.riskLabel, v: <Risk risk={p.risk} /> }] : []),
    ...(p.timeout != null
      ? [{ k: t.timeoutLabel, v: t.seconds(p.timeout, formatNumber(p.timeout)) }]
      : []),
    ...(p.facts || []),
  ];
  return (
    <div
      className={cx("tf-apreview", "tf-cmdpreview", p.risk && "risk-" + p.risk, p.className)}
      style={p.style}
    >
      <KeyValue items={kv} dense />
      <div className="tf-apreview-sec">
        <span className="tf-apreview-label">{t.commandLabel}</span>
        <pre className="tf-cmdpreview-cmd" tabIndex={0}>
          <span aria-hidden="true">$ </span>
          {p.command}
        </pre>
      </div>
      {p.argv && p.argv.length > 0 && (
        <div className="tf-apreview-sec">
          <span className="tf-apreview-label">{t.commandWords}</span>
          <ol className="tf-argv">
            {p.argv.map((w, i) => (
              <li key={i}>
                <span className="tf-mono">{w}</span>
                <small className="tf-mono">{"$" + i}</small>
              </li>
            ))}
          </ol>
        </div>
      )}
      {p.stateBefore != null && (
        <div className="tf-apreview-sec">
          <span className="tf-apreview-label">
            {t.stateBefore}
            {p.stateAt != null && <small>{p.stateAt}</small>}
          </span>
          <pre className="tf-apreview-log" tabIndex={0}>
            {p.stateBefore}
          </pre>
        </div>
      )}
      <Warnings items={p.warnings} />
      <Once>{t.runsOnceAfterA}</Once>
    </div>
  );
}

/* ── MessagePreview ── */
const WINDOW_STATUS = { open: "ok", closing: "warn", closed: "danger" } as const;

export function MessagePreview(p: MessagePreviewProps) {
  const t = useStrings(APPROVAL_PREVIEWS_STRINGS);
  const { formatDate } = useFormat();
  const time = (v: Date | string | number) =>
    formatDate(v, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
  const w = p.window;
  const windowText = !w
    ? null
    : w.state === "open"
      ? w.until != null
        ? t.windowOpenUntil(time(w.until))
        : t.windowOpenUntil("")
      : w.state === "closing"
        ? t.windowClosesAt(w.until != null ? time(w.until) : "")
        : t.windowClosedSince(w.until != null ? time(w.until) : undefined);
  const facts: KeyValueItem[] = [
    {
      k: t.channelLabel,
      v: (
        <span className="tf-apreview-channel">
          <Icon name={p.channelIcon || "send"} size={14} />
          {p.channel}
        </span>
      ),
    },
    ...(p.recipient ? [{ k: t.recipientLabel, v: p.recipient }] : []),
    ...(p.sender ? [{ k: t.senderLabel, v: p.sender, mono: true }] : []),
    ...(w
      ? [
          {
            k: t.replyWindow,
            v: <StatusIndicator status={WINDOW_STATUS[w.state]} label={windowText} />,
          },
        ]
      : []),
    ...(p.template
      ? [
          {
            k: t.templateLabel,
            v: (
              <span className="tf-apreview-template">
                <span className="tf-mono">
                  {p.template.name}
                  {p.template.language ? ` (${p.template.language})` : ""}
                </span>
                {p.template.category && (
                  <Badge tone="neutral" dot={false}>
                    {t.templateCategory + ": " + p.template.category}
                  </Badge>
                )}
              </span>
            ),
          },
        ]
      : []),
    ...(p.facts || []),
  ];
  return (
    <div className={cx("tf-apreview", "tf-msgpreview", p.className)} style={p.style}>
      <Head title={p.title} />
      <KeyValue items={facts} dense />
      {p.context && p.context.length > 0 && (
        <div className="tf-apreview-sec">
          <span className="tf-apreview-label">{t.lastMessages}</span>
          <ol className="tf-msgpreview-thread">
            {p.context.map((m, i) => (
              <li key={i} className={m.from === "out" ? "out" : "in"}>
                <small>
                  {m.author || (m.from === "out" ? t.messageFromUs : t.messageFromCustomer)}
                  {m.at != null && " · " + time(m.at)}
                </small>
                <span>{m.text}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      {p.media && (
        <div className="tf-msgpreview-media">
          {p.media.kind === "image" ? (
            <img src={p.media.src} alt={p.media.alt || ""} />
          ) : (
            <video src={p.media.src} poster={p.media.poster} controls aria-label={p.media.alt} />
          )}
        </div>
      )}
      {(p.text != null || (p.template?.params && p.template.params.length > 0)) && (
        <div className="tf-apreview-sec">
          <span className="tf-apreview-label">{t.textThatGoesOut}</span>
          <div className="tf-msgpreview-text">
            {p.text}
            {p.template?.params && p.template.params.length > 0 && (
              <ol className="tf-msgpreview-params">
                {p.template.params.map((v, i) => (
                  <li key={i}>
                    <span className="tf-mono">{`{{${i + 1}}}`}</span> {v}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
      <Warnings items={p.warnings} />
      <Once>{t.sentOnceAfterA}</Once>
    </div>
  );
}

/* ── CampaignPreview ── */
export function CampaignPreview(p: CampaignPreviewProps) {
  const t = useStrings(APPROVAL_PREVIEWS_STRINGS);
  const { formatNumber, formatMoney } = useFormat();
  const more = (p.total ?? p.contacts.length) - p.contacts.length;
  const budget = p.budget
    ? [
        p.budget.minutes != null &&
          t.minutesShort(p.budget.minutes, formatNumber(p.budget.minutes)),
        p.budget.amount != null && formatMoney(p.budget.amount, p.budget.currency || "EUR"),
      ]
        .filter(Boolean)
        .join(" · ")
    : "";
  const facts: KeyValueItem[] = [
    ...(p.hours != null ? [{ k: t.callingHours, v: p.hours }] : []),
    ...(budget ? [{ k: t.budgetLabel, v: budget }] : []),
    ...(p.calendar != null ? [{ k: t.booksInto, v: p.calendar }] : []),
    ...(p.facts || []),
  ];
  return (
    <div className={cx("tf-apreview", "tf-campaign", p.className)} style={p.style}>
      <Head title={p.title} icon="phone" />
      {facts.length > 0 && <KeyValue items={facts} dense />}
      <div className="tf-apreview-sec">
        <span className="tf-apreview-label">
          {t.contactsLabel}
          <small>{formatNumber(p.total ?? p.contacts.length)}</small>
        </span>
        <ul className="tf-campaign-contacts">
          {p.contacts.map((c, i) => (
            <li key={i}>
              <b>{c.name}</b>
              {c.phone && <span className="tf-mono">{c.phone}</span>}
              {c.source && (
                <Badge tone="neutral" dot={false}>
                  <span className="tf-sr-only">{t.sourceLabel + ": "}</span>
                  {c.source}
                </Badge>
              )}
            </li>
          ))}
          {more > 0 && <li className="more">{t.moreContacts(more, formatNumber(more))}</li>}
        </ul>
      </div>
      <div className="tf-apreview-sec">
        <span className="tf-apreview-label">{t.firstSentence}</span>
        <blockquote className="tf-campaign-opening">{p.opening}</blockquote>
      </div>
      {p.script && (
        <details className="tf-campaign-script">
          <summary>
            <Icon name="chevronRight" size={14} />
            {t.scriptLabel}
          </summary>
          <div className="tf-msgpreview-text">{p.script}</div>
        </details>
      )}
      <Warnings items={p.warnings} />
      <Once>{t.runsOnceAfterA}</Once>
    </div>
  );
}

/* ── DocumentPreview ── */
export function DocumentPreview(p: DocumentPreviewProps) {
  const t = useStrings(APPROVAL_PREVIEWS_STRINGS);
  const Link = useLinkAs(p.linkAs);
  const external = !p.linkAs && /^https?:/.test(p.href || "");
  return (
    <div
      className={cx("tf-apreview", "tf-docpreview", p.className)}
      style={p.style}
      role="group"
      aria-label={typeof p.title === "string" ? p.title : t.documentLabel}
    >
      <p className="tf-apreview-title">
        <Icon name="file" size={16} />
        <span>{p.title}</span>
        {p.href && (
          <Link
            href={p.href}
            className="tf-link tf-docpreview-open"
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {t.openDocument}
            <Icon name="arrowUpRight" size={14} />
          </Link>
        )}
      </p>
      {p.range && <KeyValue dense items={[{ k: t.rangeLabel, v: p.range, mono: true }]} />}
      {p.cells ? (
        <ChangePreview
          fields={p.cells.map((c) => ({
            label: <span className="tf-mono">{c.cell}</span>,
            before: c.before,
            after: c.after,
          }))}
          fieldHeading={t.cellLabel}
          className="tf-docpreview-cells"
        />
      ) : (
        <LineDiff before={p.before ?? ""} after={p.after ?? ""} context={p.context} />
      )}
      <Warnings items={p.warnings} />
    </div>
  );
}

/* ── EventPreview ── */
export function EventPreview(p: EventPreviewProps) {
  const t = useStrings(APPROVAL_PREVIEWS_STRINGS);
  const { formatDate } = useFormat();
  const tz = p.timeZone ? { timeZone: p.timeZone } : {};
  const day = (v: Date | string | number) =>
    formatDate(v, { weekday: "long", day: "numeric", month: "long", year: "numeric", ...tz });
  const clock = (v: Date | string | number) =>
    formatDate(v, { hour: "numeric", minute: "2-digit", ...tz });
  const when = p.allDay
    ? `${day(p.start)} · ${t.allDayLabel}`
    : `${day(p.start)}, ${clock(p.start)}${p.end != null ? "–" + clock(p.end) : ""}`;
  const span = (s: Date | string | number, e?: Date | string | number) =>
    clock(s) + (e != null ? "–" + clock(e) : "");
  const GUEST: Record<string, Status> = {
    accepted: "ok",
    declined: "danger",
    tentative: "warn",
    open: "idle",
  };
  return (
    <div className={cx("tf-apreview", "tf-eventpreview", p.className)} style={p.style}>
      <Head title={p.title} icon="calendar" />
      <KeyValue
        dense
        items={[
          { k: t.eventWhen, v: when },
          ...(p.location != null ? [{ k: t.placeLabel, v: p.location }] : []),
          ...(p.calendar != null ? [{ k: t.calendarLabel, v: p.calendar }] : []),
        ]}
      />
      {p.guests && p.guests.length > 0 && (
        <div className="tf-apreview-sec">
          <span className="tf-apreview-label">
            {t.guestsLabel}
            <small>{p.guests.length}</small>
          </span>
          <ul className="tf-eventpreview-guests">
            {p.guests.map((g) => (
              <li key={g.email}>
                <span className="tf-option-text">
                  <b>{g.name || g.email}</b>
                  {g.name && <small className="tf-mono">{g.email}</small>}
                </span>
                <StatusIndicator
                  status={GUEST[g.status || "open"]}
                  label={t.guestStatus[g.status || "open"]}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {p.conflicts && p.conflicts.length > 0 && (
        <Alert tone="warning" title={t.conflictsLabel}>
          <ul className="tf-eventpreview-conflicts">
            {p.conflicts.map((c, i) => (
              <li key={i}>
                <span className="tf-mono">{span(c.start, c.end)}</span> {c.title}
              </li>
            ))}
          </ul>
        </Alert>
      )}
      {p.text && <div className="tf-msgpreview-text">{p.text}</div>}
      <Warnings items={p.warnings} />
    </div>
  );
}

/* ── MoneyPreview ── */
export function MoneyPreview(p: MoneyPreviewProps) {
  const t = useStrings(APPROVAL_PREVIEWS_STRINGS);
  const { formatMoney } = useFormat();
  const cur = p.currency || "EUR";
  // money approvals always show the cents: the amount is exactly what moves
  const money = (v: number) => formatMoney(v, cur, { minimumFractionDigits: 2 });
  const sum = (p.bookings || []).reduce((a, b) => a + b.amount, 0);
  const facts: KeyValueItem[] = [
    ...(p.recipient ? [{ k: t.recipientLabel, v: p.recipient }] : []),
    ...(p.account != null ? [{ k: t.accountLabel, v: p.account }] : []),
    ...(p.reference != null ? [{ k: t.referenceLabel, v: p.reference, mono: true }] : []),
    ...(p.refund
      ? [
          {
            k: t.refundOf,
            v: (
              <span className="tf-col">
                <span className="tf-mono">{p.refund.payment}</span>
                {(p.refund.paidAt != null || p.refund.original != null) && (
                  <small>
                    {[p.refund.original != null ? money(p.refund.original) : null, p.refund.paidAt]
                      .filter((x) => x != null)
                      .map((x, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && " · "}
                          {x}
                        </React.Fragment>
                      ))}
                  </small>
                )}
              </span>
            ),
          },
        ]
      : []),
    ...(p.facts || []),
  ];
  return (
    <div className={cx("tf-apreview", "tf-moneypreview", p.className)} style={p.style}>
      <Head title={p.title} />
      <div className="tf-moneypreview-amount">
        <span className="tf-apreview-label">{t.amountLabel}</span>
        <b className={p.amount < 0 ? "neg" : undefined}>{money(p.amount)}</b>
      </div>
      {facts.length > 0 && <KeyValue items={facts} dense />}
      {p.bookings && p.bookings.length > 0 && (
        <div className="tf-apreview-sec">
          <span className="tf-apreview-label">{t.bookingsLabel}</span>
          <table className="tf-moneypreview-bookings">
            <tbody>
              {p.bookings.map((b) => (
                <tr key={b.id}>
                  <td className="tf-mono">{b.date}</td>
                  <td>
                    {b.text}
                    {b.account != null && <small className="tf-mono">{b.account}</small>}
                  </td>
                  <td className={cx("num", b.amount < 0 && "neg")}>{money(b.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colSpan={2}>
                  {t.totalLabel}
                </th>
                <td className={cx("num", sum < 0 && "neg")}>{money(sum)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      <Warnings items={p.warnings} />
      {p.stepUp !== false && <Once icon="key">{t.needsFreshPasskey}</Once>}
    </div>
  );
}
