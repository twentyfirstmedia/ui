"use client";
import * as React from "react";
import { useStrings } from "../context.js";
import { MAIL_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { cx } from "../cx.js";
import { useControlled } from "../hooks.js";
import { Popover } from "./overlays.js";
import { SearchField } from "./inputs.js";
import { Avatar, Badge } from "./foundation.js";
import { AgentMark } from "./chat.js";
import { TextField } from "./forms.js";
import { Drawer } from "./workspace.js";
import { KeyValue } from "./building-blocks.js";
import type {
  AccountSwitcherProps,
  AttachmentPreviewProps,
  InboxListProps,
  MailThreadProps,
  SignatureEditorProps,
} from "./types.js";

/* ── Mail ── */
export function AccountSwitcher(p: AccountSwitcherProps) {
  const t = useStrings(MAIL_STRINGS);
  const q = React.useState(""),
    list = (p.accounts || []).filter(
      (a) => !q[0] || a.address.toLowerCase().indexOf(q[0].toLowerCase()) > -1,
    );
  const cur = (p.accounts || []).find((a) => a.address === p.value);
  return (
    <Popover
      style={p.style}
      className={p.className}
      width={320}
      trigger={(s) => (
        <button
          type="button"
          className="tf-acct"
          onClick={s.toggle}
          aria-haspopup="dialog"
          aria-expanded={s.open}
        >
          <span className="tf-option-text">
            <b className={cur ? "tf-mono" : undefined}>
              {cur ? cur.address : p.allLabel || t.allInboxes}
            </b>
            <small>{cur ? cur.domain : t.addressCount((p.accounts || []).length)}</small>
          </span>
          <Icon name="chevronDown" size={14} />
        </button>
      )}
    >
      {(s) => (
        <div
          className="tf-col"
          style={{
            gap: 8,
          }}
        >
          <SearchField
            placeholder={t.findAddress}
            value={q[0]}
            onChange={(e) => {
              q[1](e.target.value);
            }}
          />
          <div className="tf-acct-list">
            <button
              type="button"
              className={cx("tf-option", !p.value && "on")}
              onClick={() => {
                p.onChange && p.onChange(null);
                s.close();
              }}
            >
              <Icon name="inbox" size={15} />
              <span className="tf-option-text">{p.allLabel || t.allInboxes}</span>
              {p.unread != null && <span className="tf-nav-count">{p.unread}</span>}
            </button>
            {list.map((a) => (
              <button
                key={a.address}
                type="button"
                className={cx("tf-option", a.address === p.value && "on")}
                onClick={() => {
                  p.onChange && p.onChange(a.address);
                  s.close();
                }}
              >
                <span className="tf-option-text">
                  <span className="tf-mono">{a.address}</span>
                  <small>{a.domain}</small>
                </span>
                {a.unread ? <span className="tf-nav-count">{a.unread}</span> : null}
              </button>
            ))}
          </div>
        </div>
      )}
    </Popover>
  );
}

export function InboxList(p: InboxListProps) {
  const t = useStrings(MAIL_STRINGS);
  return (
    <div style={p.style} className={cx("tf-inboxlist", p.className)} role="list">
      {(p.items || []).map((m) => (
        <button
          key={m.id}
          type="button"
          role="listitem"
          className={cx("tf-mailrow", m.unread && "unread", m.id === p.selected && "on")}
          onClick={() => {
            p.onOpen && p.onOpen(m);
          }}
        >
          <span
            className="tf-mailrow-dot"
            role={m.unread ? "img" : undefined}
            aria-label={m.unread ? t.unread : undefined}
          />
          <span className="tf-mailrow-main">
            <span className="tf-mailrow-top">
              <b>{m.from}</b>
              <small className="tf-mono">{m.time}</small>
            </span>
            <span className="tf-mailrow-subject">{m.subject}</span>
            <span className="tf-mailrow-snippet">{m.snippet}</span>
            {(m.to || m.tags || m.agent) && (
              <span className="tf-mailrow-tags">
                {m.to && <span className="tf-mono">{m.to}</span>}
                {m.agent && <Badge tone={m.agent.tone || "highlight"}>{m.agent.label}</Badge>}
                {(m.tags || []).map((t) => (
                  <Badge key={t} tone="neutral" dot={false}>
                    {t}
                  </Badge>
                ))}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

export function MailThread(p: MailThreadProps) {
  const open = React.useState(
    (p.messages || []).length ? [p.messages[p.messages.length - 1].id] : [],
  );
  return (
    <div style={p.style} className={cx("tf-thread", p.className)}>
      {p.subject && <h3 className="tf-thread-subject">{p.subject}</h3>}
      {(p.messages || []).map((m) => {
        const o = open[0].indexOf(m.id) > -1;
        return (
          <div key={m.id} className={cx("tf-threadmsg", o && "open", m.agent && "agent")}>
            <button
              type="button"
              className="tf-threadmsg-head"
              aria-expanded={o}
              onClick={() => {
                open[1](o ? open[0].filter((x) => x !== m.id) : open[0].concat([m.id]));
              }}
            >
              {m.agent ? <AgentMark tint={m.tint} size={32} /> : <Avatar name={m.from} size={32} />}
              <span className="tf-option-text">
                <b>
                  {m.from}
                  {m.agentNote && <span className="tf-threadmsg-note">{" · " + m.agentNote}</span>}
                </b>
                <small>{o ? m.to : m.snippet}</small>
              </span>
              <small className="tf-mono">{m.time}</small>
            </button>
            {o && (
              <div className="tf-threadmsg-body">
                {m.body}
                {m.attachments && (
                  <div className="tf-msg-attach">
                    {m.attachments.map((a) => (
                      <span key={a.name} className="tf-attach-chip">
                        <Icon name="paperclip" size={13} />
                        {a.name}
                        {a.size && <small>{a.size}</small>}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      {p.reply}
    </div>
  );
}

export function SignatureEditor(p: SignatureEditorProps) {
  const t = useStrings(MAIL_STRINGS);
  const v = useControlled<Record<string, string>>(p.value, p.defaultValue || {}, p.onChange),
    fields = p.fields || [
      { key: "name", label: t.colName },
      { key: "role", label: t.role },
      { key: "company", label: t.company },
      { key: "phone", label: t.phone },
      { key: "website", label: t.website },
    ];
  function set(k: string, x: string) {
    const n: Record<string, string> = Object.assign({}, v[0]);
    n[k] = x;
    v[1](n);
  }
  return (
    <div style={p.style} className={cx("tf-sig", p.className)}>
      <div
        className="tf-col"
        style={{
          gap: 12,
        }}
      >
        {fields.map((f) => (
          <TextField
            key={f.key}
            label={f.label}
            value={v[0][f.key] || ""}
            onChange={(e) => {
              set(f.key, e.target.value);
            }}
          />
        ))}
        {p.extra}
      </div>
      <div className="tf-sig-preview">
        <span
          className="tf-menu-label"
          style={{
            padding: 0,
          }}
        >
          {p.previewLabel || t.preview}
        </span>
        <div className="tf-paper tf-sig-paper">
          <p>—</p>
          <b>{v[0].name}</b>
          {v[0].role && <div>{v[0].role + (v[0].company ? " · " + v[0].company : "")}</div>}
          {v[0].phone && <div>{v[0].phone}</div>}
          {v[0].website && <div>{v[0].website}</div>}
          {p.note && <small>{p.note}</small>}
        </div>
      </div>
    </div>
  );
}

export function AttachmentPreview(p: AttachmentPreviewProps) {
  return (
    <Drawer
      style={p.style}
      className={p.className}
      title={p.name}
      subtitle={p.meta}
      onClose={p.onClose}
      width={p.width || 820}
      inline={p.inline}
    >
      <div className="tf-attprev">
        <div className="tf-attprev-doc">{p.children}</div>
        <div
          className="tf-col"
          style={{
            gap: 16,
          }}
        >
          {p.facts && <KeyValue items={p.facts} />}
          {p.found}
          {p.actions && (
            <div
              className="tf-col"
              style={{
                gap: 8,
              }}
            >
              {p.actions}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}

/* ── App chrome ── */
