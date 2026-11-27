"use client";
/**
 * Webmail: MailHtml (an HTML mail in a sandboxed frame), RecipientInput (address chips),
 * MailComposer, MailFolders (the folder tree with its context menu), MailFilterBar,
 * MailRulesEditor, AutoReplyEditor and MailRouteList (aliases and forwards of a domain).
 */
import * as React from "react";
import { Icon } from "../Icon.js";
import { cx } from "../cx.js";
import { useFormat, useLinkAs, useStrings } from "../context.js";
import { WEBMAIL_STRINGS } from "../strings.js";
import { useControlled, useId } from "../hooks.js";
import { toast } from "../toast-store.js";
import { Badge, Button, IconButton } from "./foundation.js";
import { Switch } from "./inputs.js";
import { FormField, Segmented } from "./forms.js";
import { Popover } from "./overlays.js";
import { ConfirmDialog, Menu } from "./feedback.js";
import { RichTextEditor } from "./rich-text-editor.js";
import type {
  AutoReplyEditorProps,
  AutoReplyValue,
  IconName,
  MailComposerProps,
  MailDraft,
  MailFilterBarProps,
  MailFilters,
  MailFolder,
  MailFoldersProps,
  MailHtmlProps,
  MailRecipient,
  MailRouteListProps,
  MailRule,
  MailRuleAction,
  MailRuleCondition,
  MailRulesEditorProps,
  MenuItem,
  Option,
  RecipientInputProps,
} from "./types.js";

/* ── MailHtml ── */

/** Remote images and backgrounds in a mail's HTML (they stay blocked until the reader loads them). */
export function countRemoteImages(html: string): number {
  const img = html.match(/<img\b[^>]*\bsrc\s*=\s*["']?\s*(?:https?:)?\/\//gi) || [];
  const bg = html.match(/url\(\s*["']?\s*(?:https?:)?\/\//gi) || [];
  return img.length + bg.length;
}

/**
 * The document the frame shows: its own CSP (nothing runs; nothing loads but data images and, once
 * the reader asks, remote images; no forms, no base URL change), links open in a new tab without
 * a referrer, colours from the page's tokens.
 */
export function mailDocument(
  html: string,
  o: {
    images: boolean;
    background: string;
    ink: string;
    link: string;
    font: string;
    dark: boolean;
  },
): string {
  const csp = [
    "default-src 'none'",
    `img-src data: cid:${o.images ? " https: http:" : ""}`,
    "style-src 'unsafe-inline'",
    "font-src data:",
    "base-uri 'none'",
    "form-action 'none'",
  ].join("; ");
  const css =
    `html{color-scheme:${o.dark ? "dark" : "light"}}` +
    `body{margin:0;padding:16px;background:${o.background};color:${o.ink};font:14px/1.55 ${o.font};overflow-wrap:anywhere}` +
    `a{color:${o.link}}img{max-width:100%;height:auto}table{max-width:100%}pre{white-space:pre-wrap}` +
    `blockquote{margin:0 0 0 8px;padding-left:12px;border-left:2px solid currentColor;opacity:.75}`;
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${csp}"><meta name="referrer" content="no-referrer"><base target="_blank"><style>${css}</style></head><body>${html}</body></html>`;
}

const tokenOf = (el: Element, name: string) => getComputedStyle(el).getPropertyValue(name).trim();

export function MailHtml(p: MailHtmlProps) {
  const t = useStrings(WEBMAIL_STRINGS);
  const frame = React.useRef<HTMLIFrameElement>(null);
  const [images, setImages] = useControlled<boolean>(
    p.images,
    p.defaultImages ?? false,
    p.onImagesChange,
  );
  const blocked = p.blockedImages ?? countRemoteImages(p.html);
  const [doc, setDoc] = React.useState("");
  const [height, setHeight] = React.useState(p.minHeight ?? 120);
  const [themeTick, setThemeTick] = React.useState(0);
  const followTheme = p.appearance === "theme";

  // repaint when the theme around the frame changes
  React.useEffect(() => {
    const el = frame.current;
    if (!el || !followTheme) return;
    const host = el.closest("[data-theme]") || document.documentElement;
    const bump = () => setThemeTick((n) => n + 1);
    const mo = new MutationObserver(bump);
    mo.observe(host, { attributes: true, attributeFilter: ["data-theme", "data-kit", "class"] });
    if (host !== document.documentElement)
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "data-kit"],
      });
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    mq?.addEventListener?.("change", bump);
    return () => {
      mo.disconnect();
      mq?.removeEventListener?.("change", bump);
    };
  }, [followTheme]);

  React.useLayoutEffect(() => {
    const el = frame.current || document.documentElement;
    const bg = followTheme ? tokenOf(el, "--surface") : tokenOf(el, "--paper");
    const ink = followTheme ? tokenOf(el, "--ink") : tokenOf(el, "--paper-ink");
    const dark = followTheme && !!el.closest('[data-theme="dark"]');
    setDoc(
      mailDocument(p.html, {
        images,
        background: bg || "Canvas",
        ink: ink || "CanvasText",
        link: tokenOf(el, "--info") || "LinkText",
        font: tokenOf(el, "--font-sans") || "sans-serif",
        dark,
      }),
    );
  }, [p.html, images, followTheme, themeTick]);

  const measure = React.useCallback(() => {
    const root = frame.current?.contentDocument?.documentElement;
    if (root) setHeight(Math.max(p.minHeight ?? 60, Math.ceil(root.scrollHeight)));
  }, [p.minHeight]);
  React.useEffect(() => {
    const el = frame.current;
    if (!el) return;
    let ro: ResizeObserver | undefined;
    const onLoad = () => {
      measure();
      const body = el.contentDocument?.body;
      if (body && typeof ResizeObserver !== "undefined") {
        ro?.disconnect();
        ro = new ResizeObserver(measure);
        ro.observe(body);
      }
    };
    el.addEventListener("load", onLoad);
    return () => {
      el.removeEventListener("load", onLoad);
      ro?.disconnect();
    };
  }, [measure]);

  return (
    <div className={cx("tf-mailhtml", followTheme && "themed", p.className)} style={p.style}>
      {blocked > 0 && !images && (
        <div className="tf-mailhtml-blocked" role="note">
          <Icon name="image" size={16} />
          <span>{t.mailImagesBlocked(blocked)}</span>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setImages(true);
              p.onLoadImages?.();
            }}
          >
            {t.mailLoadImages}
          </Button>
        </div>
      )}
      <iframe
        ref={frame}
        title={p.title || t.mailMessage}
        // no scripts, no forms, no top navigation: only measuring (same origin) and links in new tabs
        sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="no-referrer"
        srcDoc={doc}
        style={{ height }}
      />
    </div>
  );
}

/* ── RecipientInput ── */
const EMAIL = /^[^\s@<>(),;:"]+@[^\s@<>(),;:"]+\.[^\s@<>(),;:"]+$/;
export const isEmailAddress = (s: string) => EMAIL.test(s.trim());

/** Addresses from typed or pasted text: "a@x.com, Bo Lee <bo@y.com>; c@z.com". */
export function parseRecipients(text: string): MailRecipient[] {
  const out: MailRecipient[] = [];
  const re = /\s*(?:"?([^"<,;\n]*?)"?\s*<([^>]+)>|([^,;\s<>]+))\s*[,;\n]?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (!m[0].trim()) {
      re.lastIndex++;
      if (re.lastIndex > text.length) break;
      continue;
    }
    if (m[2]) {
      const name = (m[1] || "").trim();
      out.push(name ? { address: m[2].trim(), name } : { address: m[2].trim() });
    } else if (m[3]) out.push({ address: m[3].trim() });
  }
  return out;
}

export function RecipientInput(p: RecipientInputProps) {
  const t = useStrings(WEBMAIL_STRINGS);
  const id = useId("rcpt");
  const inputId = p.id || id;
  const listId = id + "-list";
  const [value, setValue] = useControlled<MailRecipient[]>(
    p.value,
    p.defaultValue || [],
    p.onChange,
  );
  const [text, setText] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const [found, setFound] = React.useState<MailRecipient[]>([]);
  const valid = p.validate || isEmailAddress;
  const has = (a: string) => value.some((r) => r.address.toLowerCase() === a.toLowerCase());

  React.useEffect(() => {
    const q = text.trim().toLowerCase();
    if (!q) {
      setFound([]);
      return;
    }
    const chosen = (r: MailRecipient) =>
      value.some((v) => v.address.toLowerCase() === r.address.toLowerCase());
    if (p.suggest) {
      let live = true;
      const timer = setTimeout(() => {
        Promise.resolve(p.suggest!(text.trim()))
          .then((list) => live && setFound(list.filter((r) => !chosen(r)).slice(0, 8)))
          .catch(() => live && setFound([]));
      }, 150);
      return () => {
        live = false;
        clearTimeout(timer);
      };
    }
    setFound(
      (p.suggestions || [])
        .filter(
          (r) =>
            !chosen(r) &&
            (r.address.toLowerCase().includes(q) || (r.name || "").toLowerCase().includes(q)),
        )
        .slice(0, 8),
    );
    return undefined;
  }, [text, p.suggest, p.suggestions, value]);
  React.useEffect(() => setActive(0), [found]);

  const add = (list: MailRecipient[]) => {
    const next = value.slice();
    for (const r of list)
      if (r.address && !next.some((v) => v.address.toLowerCase() === r.address.toLowerCase()))
        next.push(r);
    if (next.length !== value.length) setValue(next);
    setText("");
  };
  const commit = () => {
    if (text.trim()) add(parseRecipients(text));
  };
  const shown = open && found.length > 0;
  const invalid = value.filter((r) => !valid(r.address));
  const error = p.error || (invalid.length ? t.mailInvalidRecipients(invalid.length) : undefined);

  return (
    <FormField
      id={inputId}
      label={p.label}
      hideLabel={p.hideLabel}
      hint={p.hint}
      error={error}
      className={cx("tf-rcpt", p.className)}
      style={p.style}
    >
      <div
        className={cx("tf-combo", shown && "open", invalid.length > 0 && "invalid")}
        onClick={(e) => e.currentTarget.querySelector("input")?.focus()}
      >
        <div className="tf-combo-box tf-tags">
          {value.map((r) => {
            const bad = !valid(r.address);
            return (
              <span
                key={r.address}
                className={cx("tf-token", "tf-rcpt-chip", bad && "invalid")}
                title={bad ? t.mailNotAnAddress : r.name ? r.address : undefined}
              >
                {bad && <Icon name="ban" size={12} label={t.mailNotAnAddress} />}
                <span className="tf-rcpt-name">{r.name || r.address}</span>
                <button
                  type="button"
                  aria-label={t.removeItem(r.name || r.address)}
                  disabled={p.disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue(value.filter((x) => x !== r));
                  }}
                >
                  <Icon name="x" size={12} />
                </button>
              </span>
            );
          })}
          <input
            id={inputId}
            className="tf-combo-input"
            type="email"
            multiple
            inputMode="email"
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={shown}
            aria-controls={listId}
            aria-activedescendant={shown ? `${listId}-${active}` : undefined}
            aria-invalid={invalid.length ? "true" : undefined}
            placeholder={value.length ? undefined : p.placeholder}
            disabled={p.disabled}
            autoFocus={p.autoFocus}
            value={text}
            onChange={(e) => {
              const v = e.target.value;
              if (/[,;]\s*$/.test(v)) add(parseRecipients(v));
              else setText(v);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              setOpen(false);
              commit();
            }}
            onPaste={(e) => {
              const s = e.clipboardData.getData("text");
              if (/[,;\n]/.test(s) || (s.match(/@/g) || []).length > 1) {
                e.preventDefault();
                add(parseRecipients(text + s));
              }
            }}
            onKeyDown={(e) => {
              if (shown && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
                e.preventDefault();
                const d = e.key === "ArrowDown" ? 1 : -1;
                setActive((a) => (a + d + found.length) % found.length);
              } else if (e.key === "Enter" || (e.key === "Tab" && text.trim())) {
                if (shown && found[active]) {
                  e.preventDefault();
                  add([found[active]]);
                } else if (text.trim()) {
                  e.preventDefault();
                  commit();
                }
              } else if (e.key === "Escape" && shown) {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
              } else if (e.key === "Backspace" && !text && value.length) {
                setValue(value.slice(0, -1));
              }
            }}
          />
        </div>
        {shown && (
          <div className="tf-popover tf-combo-pop" id={listId} role="listbox" aria-label={p.label}>
            {found.map((r, i) => (
              <div
                key={r.address}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                className={cx("tf-option", i === active && "active")}
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (!has(r.address)) add([r]);
                }}
                onMouseEnter={() => setActive(i)}
              >
                <span className="tf-option-text">
                  {r.name && <span>{r.name}</span>}
                  <small className="tf-mono">{r.address}</small>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </FormField>
  );
}

/* ── MailComposer ── */
const EMPTY_DRAFT: MailDraft = { to: [], cc: [], bcc: [], subject: "", html: "", signature: true };
const pad = (n: number) => String(n).padStart(2, "0");
const isoDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function MailComposer(p: MailComposerProps) {
  const t = useStrings(WEBMAIL_STRINGS);
  const { formatDate } = useFormat();
  const id = useId("mcomp");
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useControlled<MailDraft>(
    p.value,
    { ...EMPTY_DRAFT, from: p.senders?.[0]?.address, ...p.defaultValue },
    p.onChange,
  );
  const set = (patch: Partial<MailDraft>) => setDraft({ ...draft, ...patch });
  const [showCc, setShowCc] = React.useState(draft.cc.length > 0);
  const [showBcc, setShowBcc] = React.useState(draft.bcc.length > 0);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [later, setLater] = React.useState({ day: isoDay(tomorrow), time: "08:00" });
  const recipients = draft.to.concat(draft.cc, draft.bcc);
  const uploading = (draft.attachments || []).some(
    (a) => a.progress !== undefined && a.progress < 1,
  );
  const ready =
    recipients.length > 0 &&
    recipients.every((r) => isEmailAddress(r.address)) &&
    !uploading &&
    !p.sending;

  const send = () => {
    if (!ready || !p.onSend) return;
    p.onSend(draft);
    if (p.onUndoSend) {
      const sent = draft;
      toast({
        text: t.mailSent,
        icon: "send",
        undo: () => p.onUndoSend?.(sent),
        duration: (p.undoSeconds ?? 10) * 1000,
      });
    }
  };
  const senders = p.senders || [];
  const saved =
    p.saved === "saving"
      ? t.mailSaving
      : p.saved === "saved"
        ? p.savedAt
          ? t.mailSavedAt(formatDate(p.savedAt, { hour: "numeric", minute: "2-digit" }))
          : t.mailSaved
        : p.saved === "error"
          ? t.mailSaveFailed
          : null;
  const attachItems: MenuItem[] = [
    { label: t.mailFromDevice, icon: "upload", onClick: () => fileRef.current?.click() },
    ...(p.attachSources || []).map((s) => ({
      label: s.label,
      icon: s.icon || ("folder" as IconName),
      onClick: s.onClick,
    })),
  ];

  return (
    <div
      className={cx("tf-card", "tf-mcomp", p.className)}
      style={p.style}
      role="form"
      aria-label={p.title || t.mailNewMessage}
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          send();
        }
      }}
    >
      <div className="tf-mcomp-head">
        <b>{p.title || t.mailNewMessage}</b>
        {saved && (
          <small
            className={cx("tf-mcomp-saved", p.saved === "error" && "error")}
            aria-live="polite"
          >
            {saved}
          </small>
        )}
        {p.onDiscard && (
          <IconButton
            icon="trash"
            size="sm"
            variant="ghost"
            label={t.mailDiscard}
            onClick={p.onDiscard}
          />
        )}
      </div>
      <div className="tf-mcomp-fields">
        {senders.length > 0 && (
          <div className="tf-mcomp-row">
            <label htmlFor={id + "-from"}>{t.mailFrom}</label>
            {senders.length > 1 ? (
              <select
                id={id + "-from"}
                className="tf-input"
                value={draft.from || senders[0]!.address}
                onChange={(e) => set({ from: e.target.value })}
              >
                {senders.map((s) => (
                  <option key={s.address} value={s.address}>
                    {s.name ? `${s.name} <${s.address}>` : s.address}
                  </option>
                ))}
              </select>
            ) : (
              <span id={id + "-from"} className="tf-mono tf-mcomp-static">
                {senders[0]!.address}
              </span>
            )}
          </div>
        )}
        <div className="tf-mcomp-row">
          <span className="tf-mcomp-label" aria-hidden="true">
            {t.mailTo}
          </span>
          <RecipientInput
            id={id + "-to"}
            label={t.mailTo}
            hideLabel
            value={draft.to}
            onChange={(to) => set({ to })}
            suggest={p.suggest}
            suggestions={p.suggestions}
            autoFocus={p.autoFocus}
          />
          <span className="tf-mcomp-ccbtns">
            {!showCc && (
              <button type="button" className="tf-linkbtn" onClick={() => setShowCc(true)}>
                {t.mailCc}
              </button>
            )}
            {!showBcc && (
              <button type="button" className="tf-linkbtn" onClick={() => setShowBcc(true)}>
                {t.mailBcc}
              </button>
            )}
          </span>
        </div>
        {showCc && (
          <div className="tf-mcomp-row">
            <span className="tf-mcomp-label" aria-hidden="true">
              {t.mailCc}
            </span>
            <RecipientInput
              id={id + "-cc"}
              label={t.mailCc}
              hideLabel
              value={draft.cc}
              onChange={(cc) => set({ cc })}
              suggest={p.suggest}
              suggestions={p.suggestions}
            />
          </div>
        )}
        {showBcc && (
          <div className="tf-mcomp-row">
            <span className="tf-mcomp-label" aria-hidden="true">
              {t.mailBcc}
            </span>
            <RecipientInput
              id={id + "-bcc"}
              label={t.mailBcc}
              hideLabel
              value={draft.bcc}
              onChange={(bcc) => set({ bcc })}
              suggest={p.suggest}
              suggestions={p.suggestions}
            />
          </div>
        )}
        <div className="tf-mcomp-row">
          <label htmlFor={id + "-subject"}>{t.mailSubject}</label>
          <input
            id={id + "-subject"}
            className="tf-input"
            value={draft.subject}
            onChange={(e) => set({ subject: e.target.value })}
          />
        </div>
      </div>
      <RichTextEditor
        className="tf-mcomp-body"
        label={t.mailBody}
        hideLabel
        value={draft.html}
        onChange={(html) => set({ html })}
        placeholder={p.placeholder}
        minHeight={p.minHeight ?? 180}
      />
      {p.signature && (
        <div className={cx("tf-mcomp-sig", draft.signature === false && "off")}>
          <Switch
            checked={draft.signature !== false}
            onChange={(e) => set({ signature: e.target.checked })}
            label={t.mailSignature}
          >
            {t.mailSignature}
          </Switch>
          {draft.signature !== false && <div className="tf-mcomp-sig-text">{p.signature}</div>}
        </div>
      )}
      {(draft.attachments || []).length > 0 && (
        <ul className="tf-mcomp-files" aria-label={t.mailAttachments}>
          {(draft.attachments || []).map((a) => (
            <li key={a.id} className={cx("tf-attach-chip", a.error && "error")}>
              <Icon name="paperclip" size={13} />
              <span className="tf-mcomp-file-name">{a.name}</span>
              {a.error ? (
                <small>{a.error}</small>
              ) : a.progress !== undefined && a.progress < 1 ? (
                <progress max={1} value={a.progress} aria-label={t.mailUploading(a.name)} />
              ) : (
                a.size && <small>{a.size}</small>
              )}
              <button
                type="button"
                aria-label={t.removeItem(a.name)}
                onClick={() => {
                  set({ attachments: (draft.attachments || []).filter((x) => x.id !== a.id) });
                  p.onRemoveAttachment?.(a.id);
                }}
              >
                <Icon name="x" size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="tf-mcomp-foot">
        <div className="tf-mcomp-send">
          <Button icon="send" disabled={!ready || !p.onSend} onClick={send}>
            {p.sending ? t.mailSending : t.send}
          </Button>
          {p.onSchedule && (
            <Popover
              side="top"
              width={280}
              role="dialog"
              label={t.mailSendLater}
              trigger={(s) => (
                <Button
                  variant="secondary"
                  icon="clock"
                  disabled={!ready}
                  aria-haspopup="dialog"
                  aria-expanded={s.open}
                  onClick={s.toggle}
                >
                  {t.mailSendLater}
                </Button>
              )}
            >
              {(s) => (
                <div className="tf-col tf-mcomp-later">
                  <b>{t.mailSendLater}</b>
                  <label className="tf-mcomp-later-field">
                    <span>{t.mailDate}</span>
                    <input
                      type="date"
                      className="tf-input"
                      value={later.day}
                      min={isoDay(new Date())}
                      onChange={(e) => setLater({ ...later, day: e.target.value })}
                    />
                  </label>
                  <label className="tf-mcomp-later-field">
                    <span>{t.mailTime}</span>
                    <input
                      type="time"
                      className="tf-input"
                      value={later.time}
                      onChange={(e) => setLater({ ...later, time: e.target.value })}
                    />
                  </label>
                  <Button
                    icon="clock"
                    onClick={() => {
                      const [y, m, d] = later.day.split("-").map(Number);
                      const [hh, mm] = later.time.split(":").map(Number);
                      p.onSchedule?.(draft, new Date(y!, m! - 1, d!, hh!, mm!));
                      s.close();
                    }}
                  >
                    {t.mailSchedule}
                  </Button>
                </div>
              )}
            </Popover>
          )}
        </div>
        {p.onFiles && (
          <>
            <input
              ref={fileRef}
              type="file"
              multiple
              hidden
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length) p.onFiles?.(files);
                e.target.value = "";
              }}
            />
            {attachItems.length > 1 ? (
              <Popover
                side="top"
                align="end"
                width={220}
                trigger={(s) => (
                  <IconButton
                    icon="paperclip"
                    variant="ghost"
                    label={t.mailAttach}
                    aria-haspopup="menu"
                    aria-expanded={s.open}
                    onClick={s.toggle}
                  />
                )}
              >
                {(s) => (
                  <Menu items={attachItems} label={t.mailAttach} autoFocus onClose={s.close} />
                )}
              </Popover>
            ) : (
              <IconButton
                icon="paperclip"
                variant="ghost"
                label={t.mailAttach}
                onClick={() => fileRef.current?.click()}
              />
            )}
          </>
        )}
        {p.footer}
      </div>
    </div>
  );
}

/* ── MailFolders ── */
const ROLE_ICON: Record<string, IconName> = {
  inbox: "inbox",
  drafts: "edit",
  sent: "send",
  scheduled: "clock",
  starred: "star",
  archive: "archive",
  junk: "ban",
  trash: "trash",
  outbox: "upload",
};

export function MailFolders(p: MailFoldersProps) {
  const t = useStrings(WEBMAIL_STRINGS);
  const Link = useLinkAs(p.linkAs);
  const [selected, setSelected] = useControlled<string | null>(
    p.selected,
    p.defaultSelected ?? null,
    p.onSelect,
  );
  const [open, setOpen] = React.useState<string[]>(p.defaultOpen || []);
  const [menuFor, setMenuFor] = React.useState<string | null>(null);
  const [edit, setEdit] = React.useState<{
    mode: "rename" | "create";
    id: string | null;
    text: string;
  } | null>(null);
  const [confirm, setConfirm] = React.useState<{
    kind: "delete" | "empty";
    folder: MailFolder;
  } | null>(null);
  const done = () => {
    if (!edit) return;
    const name = edit.text.trim();
    if (name) {
      if (edit.mode === "rename" && edit.id) p.onRename?.(edit.id, name);
      if (edit.mode === "create") p.onCreate?.(name, edit.id);
    }
    setEdit(null);
  };
  const editor = (label: string) => (
    <input
      className="tf-input tf-mfolder-edit"
      aria-label={label}
      autoFocus
      value={edit?.text || ""}
      onChange={(e) => edit && setEdit({ ...edit, text: e.target.value })}
      onBlur={done}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          done();
        } else if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          setEdit(null);
        }
      }}
    />
  );
  const menuItems = (f: MailFolder): (MenuItem | "-")[] => {
    const own = !f.role;
    const items: (MenuItem | "-")[] = [];
    if (p.onCreate)
      items.push({
        label: t.mailNewSubfolder,
        icon: "plus",
        onClick: () => {
          setOpen((o) => (o.includes(f.id) ? o : o.concat([f.id])));
          setEdit({ mode: "create", id: f.id, text: "" });
        },
      });
    if (own && p.onRename)
      items.push({
        label: t.mailRename,
        icon: "edit",
        onClick: () => setEdit({ mode: "rename", id: f.id, text: f.label }),
      });
    if ((f.role === "trash" || f.role === "junk") && p.onEmpty)
      items.push("-", {
        label: t.mailEmptyFolder,
        icon: "trash",
        danger: true,
        onClick: () => setConfirm({ kind: "empty", folder: f }),
      });
    if (own && p.onDelete)
      items.push("-", {
        label: t.mailDeleteFolder,
        icon: "trash",
        danger: true,
        onClick: () => setConfirm({ kind: "delete", folder: f }),
      });
    return items;
  };
  const row = (f: MailFolder, depth: number): React.ReactNode => {
    const kids = f.children || [];
    const isOpen = open.includes(f.id);
    const items = menuItems(f);
    const on = selected === f.id;
    const inner = (
      <>
        <Icon name={f.icon || ROLE_ICON[f.role || ""] || "folder"} size={16} />
        <span className="tf-mfolder-label">{f.label}</span>
        {f.unread ? (
          <>
            <span className="tf-nav-count" aria-hidden="true">
              {f.unread}
            </span>
            <span className="tf-sr-only">{", " + t.mailUnreadCount(f.unread)}</span>
          </>
        ) : null}
      </>
    );
    const common = {
      className: cx("tf-mfolder-link", on && "on"),
      "aria-current": on ? ("page" as const) : undefined,
      onClick: () => setSelected(f.id),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (items.length && (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10"))) {
          e.preventDefault();
          setMenuFor(f.id);
        }
      },
    };
    return (
      <li
        key={f.id}
        className={cx("tf-mfolder", f.unread ? "unread" : null)}
        style={{ "--depth": depth } as React.CSSProperties}
      >
        <div
          className="tf-mfolder-row"
          onContextMenu={(e) => {
            if (!items.length) return;
            e.preventDefault();
            setMenuFor(f.id);
          }}
        >
          {kids.length > 0 ? (
            <button
              type="button"
              className="tf-mfolder-toggle"
              aria-expanded={isOpen}
              aria-label={isOpen ? t.mailCollapse(f.label) : t.mailExpand(f.label)}
              onClick={() => setOpen(isOpen ? open.filter((x) => x !== f.id) : open.concat([f.id]))}
            >
              <Icon name="chevronRight" size={14} />
            </button>
          ) : (
            <span className="tf-mfolder-toggle" aria-hidden="true" />
          )}
          {edit?.mode === "rename" && edit.id === f.id ? (
            editor(t.mailRename)
          ) : f.href ? (
            <Link href={f.href} {...common}>
              {inner}
            </Link>
          ) : (
            <button type="button" {...common}>
              {inner}
            </button>
          )}
          {items.length > 0 && (
            <Popover
              align="end"
              width={220}
              open={menuFor === f.id}
              onOpenChange={(o) => setMenuFor(o ? f.id : null)}
              trigger={(s) => (
                <IconButton
                  icon="more"
                  size="sm"
                  variant="ghost"
                  className="tf-mfolder-more"
                  label={t.mailFolderActions(f.label)}
                  aria-haspopup="menu"
                  aria-expanded={s.open}
                  onClick={s.toggle}
                />
              )}
            >
              {(s) => (
                <Menu
                  items={items}
                  label={t.mailFolderActions(f.label)}
                  autoFocus
                  onClose={s.close}
                />
              )}
            </Popover>
          )}
        </div>
        {((kids.length > 0 && isOpen) || (edit?.mode === "create" && edit.id === f.id)) && (
          <ul role="list">
            {isOpen && kids.map((k) => row(k, depth + 1))}
            {edit?.mode === "create" && edit.id === f.id && (
              <li className="tf-mfolder" style={{ "--depth": depth + 1 } as React.CSSProperties}>
                <div className="tf-mfolder-row">
                  <span className="tf-mfolder-toggle" aria-hidden="true" />
                  {editor(t.mailNewFolder)}
                </div>
              </li>
            )}
          </ul>
        )}
      </li>
    );
  };
  return (
    <nav
      className={cx("tf-mfolders", p.className)}
      style={p.style}
      aria-label={p.label || t.mailFolders}
    >
      <ul role="list">
        {p.folders.map((f) => row(f, 0))}
        {edit?.mode === "create" && edit.id === null && (
          <li className="tf-mfolder" style={{ "--depth": 0 } as React.CSSProperties}>
            <div className="tf-mfolder-row">
              <span className="tf-mfolder-toggle" aria-hidden="true" />
              {editor(t.mailNewFolder)}
            </div>
          </li>
        )}
      </ul>
      {p.onCreate && !edit && (
        <button
          type="button"
          className="tf-linkbtn tf-mfolders-new"
          onClick={() => setEdit({ mode: "create", id: null, text: "" })}
        >
          <Icon name="plus" size={14} />
          {t.mailNewFolder}
        </button>
      )}
      <ConfirmDialog
        open={!!confirm}
        danger
        icon="trash"
        title={
          confirm
            ? confirm.kind === "empty"
              ? t.mailEmptyTitle(confirm.folder.label)
              : t.mailDeleteTitle(confirm.folder.label)
            : ""
        }
        text={confirm ? (confirm.kind === "empty" ? t.mailEmptyText : t.mailDeleteText) : undefined}
        confirmLabel={confirm?.kind === "empty" ? t.mailEmptyFolder : t.mailDeleteFolder}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm?.kind === "empty") p.onEmpty?.(confirm.folder.id);
          else if (confirm) p.onDelete?.(confirm.folder.id);
          setConfirm(null);
        }}
      />
    </nav>
  );
}

/* ── MailFilterBar ── */
export function MailFilterBar(p: MailFilterBarProps) {
  const t = useStrings(WEBMAIL_STRINGS);
  const [v, setV] = useControlled<MailFilters>(p.value, p.defaultValue || {}, p.onChange);
  const set = (patch: Partial<MailFilters>) => setV({ ...v, ...patch });
  const pick = (
    key: "account" | "domain" | "agent",
    title: string,
    all: string,
    options?: Option[],
  ) => {
    if (!options || options.length === 0) return null;
    const cur = options.find((o) => o.value === v[key]);
    return (
      <Popover
        width={260}
        trigger={(s) => (
          <button
            type="button"
            className="tf-chip tf-mfilter-pick"
            aria-pressed={!!cur}
            aria-haspopup="menu"
            aria-expanded={s.open}
            onClick={s.toggle}
          >
            <span className="tf-mfilter-key">{title}</span>
            <span className="tf-mfilter-val">{cur ? cur.label : all}</span>
            <Icon name="chevronDown" size={14} />
          </button>
        )}
      >
        {(s) => (
          <Menu
            label={title}
            autoFocus
            onClose={s.close}
            items={[
              {
                label: all,
                type: "radio",
                group: key,
                checked: !cur,
                onClick: () => set({ [key]: null }),
              },
              "-",
              ...options.map((o): MenuItem => ({
                label: o.label,
                type: "radio",
                group: key,
                checked: o.value === v[key],
                onClick: () => set({ [key]: o.value }),
              })),
            ]}
          />
        )}
      </Popover>
    );
  };
  const toggle = (key: "unread" | "starred" | "attachments", text: string, icon: IconName) => (
    <button
      type="button"
      className="tf-chip"
      aria-pressed={!!v[key]}
      onClick={() => set({ [key]: !v[key] })}
    >
      <Icon name={icon} size={14} />
      {text}
    </button>
  );
  const active =
    Number(!!v.account) +
    Number(!!v.domain) +
    Number(!!v.agent) +
    Number(!!v.unread) +
    Number(!!v.starred) +
    Number(!!v.attachments);
  return (
    <div
      className={cx("tf-mfilters", p.className)}
      style={p.style}
      role="group"
      aria-label={p.label || t.mailFilters}
    >
      {pick("account", t.mailAccount, t.mailAllAccounts, p.accounts)}
      {pick("domain", t.mailDomain, t.mailAllDomains, p.domains)}
      {toggle("unread", t.mailUnread, "mail")}
      {toggle("starred", t.mailStarred, "star")}
      {toggle("attachments", t.mailWithAttachments, "paperclip")}
      {pick("agent", t.mailAgent, t.mailAnyAgent, p.agents)}
      {active > 0 && (
        <button type="button" className="tf-linkbtn tf-mfilter-clear" onClick={() => setV({})}>
          {t.mailClearFilters(active)}
        </button>
      )}
      {p.count !== undefined && (
        <span className="tf-mfilter-count" aria-live="polite">
          {t.mailResultCount(p.count)}
        </span>
      )}
    </div>
  );
}

/* ── MailRulesEditor ── */
let ruleSeq = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${++ruleSeq}`;

export function MailRulesEditor(p: MailRulesEditorProps) {
  const t = useStrings(WEBMAIL_STRINGS);
  const uid = useId("mrule");
  const [rules, setRules] = useControlled<MailRule[]>(p.value, p.defaultValue || [], p.onChange);
  const update = (id: string, patch: Partial<MailRule>) =>
    setRules(rules.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const FIELDS: [MailRuleCondition["field"], string][] = [
    ["from", t.mailFieldFrom],
    ["to", t.mailFieldTo],
    ["subject", t.mailFieldSubject],
    ["body", t.mailFieldBody],
  ];
  const OPS: [MailRuleCondition["op"], string][] = [
    ["contains", t.mailOpContains],
    ["notContains", t.mailOpNotContains],
    ["is", t.mailOpIs],
    ["startsWith", t.mailOpStartsWith],
    ["endsWith", t.mailOpEndsWith],
  ];
  const ACTIONS: [MailRuleAction["type"], string][] = [
    ["move", t.mailActMove],
    ["archive", t.mailActArchive],
    ["markRead", t.mailActMarkRead],
    ["star", t.mailActStar],
    ["forward", t.mailActForward],
    ...(p.agents && p.agents.length
      ? ([["handoff", t.mailActHandoff]] as [MailRuleAction["type"], string][])
      : []),
    ["delete", t.mailActDelete],
  ];
  const select = (
    label: string,
    value: string,
    options: [string, string][],
    onChange: (v: string) => void,
  ) => (
    <select
      className="tf-input"
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>
  );
  return (
    <div className={cx("tf-mrules", p.className)} style={p.style}>
      {rules.length === 0 && <p className="tf-mrules-empty">{t.mailNoRules}</p>}
      {rules.map((r, ri) => {
        const name = r.name || t.mailRuleN(ri + 1);
        return (
          <section
            key={r.id}
            className={cx("tf-card", "tf-mrule", r.enabled === false && "off")}
            aria-label={name}
          >
            <div className="tf-mrule-head">
              <input
                className="tf-input tf-mrule-name"
                aria-label={t.mailRuleName}
                placeholder={t.mailRuleN(ri + 1)}
                value={r.name || ""}
                onChange={(e) => update(r.id, { name: e.target.value })}
              />
              <Switch
                checked={r.enabled !== false}
                onChange={(e) => update(r.id, { enabled: e.target.checked })}
                label={t.mailRuleOn(name)}
              />
              <IconButton
                icon="trash"
                size="sm"
                variant="ghost"
                label={t.mailDeleteRule(name)}
                onClick={() => setRules(rules.filter((x) => x.id !== r.id))}
              />
            </div>
            <div className="tf-mrule-part">
              <span className="tf-mrule-lead" id={`${uid}-${r.id}-if`}>
                {t.mailIf}
              </span>
              {select(
                t.mailMatch,
                r.match || "all",
                [
                  ["all", t.mailMatchAll],
                  ["any", t.mailMatchAny],
                ],
                (m) => update(r.id, { match: m as MailRule["match"] }),
              )}
            </div>
            <ul className="tf-mrule-list" aria-labelledby={`${uid}-${r.id}-if`}>
              {r.conditions.map((c, ci) => (
                <li key={ci} className="tf-mrule-line">
                  {select(t.mailCondField, c.field, FIELDS, (f) =>
                    update(r.id, {
                      conditions: r.conditions.map((x, i) =>
                        i === ci ? { ...x, field: f as MailRuleCondition["field"] } : x,
                      ),
                    }),
                  )}
                  {select(t.mailCondOp, c.op, OPS, (o) =>
                    update(r.id, {
                      conditions: r.conditions.map((x, i) =>
                        i === ci ? { ...x, op: o as MailRuleCondition["op"] } : x,
                      ),
                    }),
                  )}
                  <input
                    className="tf-input"
                    aria-label={t.mailCondValue}
                    value={c.value}
                    onChange={(e) =>
                      update(r.id, {
                        conditions: r.conditions.map((x, i) =>
                          i === ci ? { ...x, value: e.target.value } : x,
                        ),
                      })
                    }
                  />
                  <IconButton
                    className="tf-mrule-x"
                    icon="x"
                    size="sm"
                    variant="ghost"
                    label={t.mailRemoveCondition}
                    onClick={() =>
                      update(r.id, { conditions: r.conditions.filter((_, i) => i !== ci) })
                    }
                  />
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="tf-linkbtn tf-mrule-add"
              onClick={() =>
                update(r.id, {
                  conditions: r.conditions.concat([{ field: "from", op: "contains", value: "" }]),
                })
              }
            >
              <Icon name="plus" size={14} />
              {t.mailAddCondition}
            </button>
            <span className="tf-mrule-lead" id={`${uid}-${r.id}-then`}>
              {t.mailThen}
            </span>
            <ul className="tf-mrule-list" aria-labelledby={`${uid}-${r.id}-then`}>
              {r.actions.map((a, ai) => {
                const setA = (patch: Partial<MailRuleAction>) =>
                  update(r.id, {
                    actions: r.actions.map((x, i) => (i === ai ? { ...x, ...patch } : x)),
                  });
                const target =
                  a.type === "move"
                    ? select(
                        t.mailActTarget,
                        a.value || "",
                        [
                          ["", t.mailChooseFolder],
                          ...(p.folders || []).map((o): [string, string] => [o.value, o.label]),
                        ],
                        (v) => setA({ value: v }),
                      )
                    : a.type === "handoff"
                      ? select(
                          t.mailActTarget,
                          a.value || "",
                          [
                            ["", t.mailChooseAgent],
                            ...(p.agents || []).map((o): [string, string] => [o.value, o.label]),
                          ],
                          (v) => setA({ value: v }),
                        )
                      : a.type === "forward" && (
                          <input
                            className="tf-input"
                            type="email"
                            inputMode="email"
                            aria-label={t.mailActTarget}
                            placeholder={t.mailForwardTo}
                            value={a.value || ""}
                            onChange={(e) => setA({ value: e.target.value })}
                          />
                        );
                return (
                  <li key={ai} className="tf-mrule-line">
                    {select(t.mailActType, a.type, ACTIONS, (ty) =>
                      setA({ type: ty as MailRuleAction["type"], value: "" }),
                    )}
                    {target}
                    <IconButton
                      className="tf-mrule-x"
                      icon="x"
                      size="sm"
                      variant="ghost"
                      label={t.mailRemoveAction}
                      onClick={() =>
                        update(r.id, { actions: r.actions.filter((_, i) => i !== ai) })
                      }
                    />
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              className="tf-linkbtn tf-mrule-add"
              onClick={() =>
                update(r.id, { actions: r.actions.concat([{ type: "move", value: "" }]) })
              }
            >
              <Icon name="plus" size={14} />
              {t.mailAddAction}
            </button>
          </section>
        );
      })}
      <div className="tf-mrules-foot">
        <Button
          variant="secondary"
          icon="plus"
          onClick={() =>
            setRules(
              rules.concat([
                {
                  id: nextId("rule"),
                  enabled: true,
                  match: "all",
                  conditions: [{ field: "from", op: "contains", value: "" }],
                  actions: [{ type: "move", value: "" }],
                },
              ]),
            )
          }
        >
          {t.mailNewRule}
        </Button>
        {p.onSave && (
          <Button disabled={p.saving} onClick={() => p.onSave?.(rules)}>
            {p.saving ? t.mailSaving : t.mailSaveRules}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ── AutoReplyEditor ── */
const asDay = (d: Date | string | null | undefined) =>
  d ? isoDay(d instanceof Date ? d : new Date(d)) : "";
const fromDay = (s: string) => {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y!, m! - 1, d!);
};

export function AutoReplyEditor(p: AutoReplyEditorProps) {
  const t = useStrings(WEBMAIL_STRINGS);
  const { formatDate } = useFormat();
  const id = useId("autoreply");
  const [v, setV] = useControlled<AutoReplyValue>(
    p.value,
    p.defaultValue || { enabled: false, message: "" },
    p.onChange,
  );
  const set = (patch: Partial<AutoReplyValue>) => setV({ ...v, ...patch });
  const end = v.end ? (v.end instanceof Date ? v.end : new Date(v.end)) : null;
  const status = !v.enabled
    ? t.mailAutoReplyOff
    : end
      ? t.mailAutoReplyUntil(formatDate(end, { day: "numeric", month: "long" }))
      : t.mailAutoReplyOn;
  return (
    <div className={cx("tf-card", "tf-autoreply", p.className)} style={p.style}>
      <div className="tf-autoreply-head">
        <Switch
          spread
          checked={v.enabled}
          onChange={(e) => set({ enabled: e.target.checked })}
          label={t.mailAutoReply}
        >
          {t.mailAutoReply}
        </Switch>
        <Badge tone={v.enabled ? "success" : "neutral"}>{status}</Badge>
      </div>
      <fieldset className="tf-autoreply-body" disabled={!v.enabled}>
        <div className="tf-autoreply-period">
          <label htmlFor={id + "-start"}>
            <span>{t.mailFromDate}</span>
            <input
              id={id + "-start"}
              type="date"
              className="tf-input"
              value={asDay(v.start)}
              onChange={(e) => set({ start: fromDay(e.target.value) })}
            />
          </label>
          <label htmlFor={id + "-end"}>
            <span>{t.mailUntilDate}</span>
            <input
              id={id + "-end"}
              type="date"
              className="tf-input"
              value={asDay(v.end)}
              min={asDay(v.start) || undefined}
              onChange={(e) => set({ end: fromDay(e.target.value) })}
            />
          </label>
        </div>
        <label className="tf-autoreply-field" htmlFor={id + "-subject"}>
          <span>{t.mailSubject}</span>
          <input
            id={id + "-subject"}
            className="tf-input"
            placeholder={t.mailAutoReplySubject}
            value={v.subject || ""}
            onChange={(e) => set({ subject: e.target.value })}
          />
        </label>
        <label className="tf-autoreply-field" htmlFor={id + "-message"}>
          <span>{t.mailAutoReplyMessage}</span>
          <textarea
            id={id + "-message"}
            className="tf-input tf-textarea"
            rows={5}
            value={v.message}
            onChange={(e) => set({ message: e.target.value })}
          />
        </label>
        <Switch
          checked={!!v.contactsOnly}
          onChange={(e) => set({ contactsOnly: e.target.checked })}
          label={t.mailContactsOnly}
        >
          {t.mailContactsOnly}
        </Switch>
        <p className="tf-autoreply-hint">{t.mailAutoReplyHint}</p>
      </fieldset>
      {p.onSave && (
        <div className="tf-autoreply-foot">
          <Button disabled={p.saving} onClick={() => p.onSave?.(v)}>
            {p.saving ? t.mailSaving : t.mailSave}
          </Button>
        </div>
      )}
    </div>
  );
}

/* ── MailRouteList ── */
export function MailRouteList(p: MailRouteListProps) {
  const t = useStrings(WEBMAIL_STRINGS);
  const id = useId("route");
  const [adding, setAdding] = React.useState(false);
  const [local, setLocal] = React.useState("");
  const [targets, setTargets] = React.useState<MailRecipient[]>([]);
  const [kind, setKind] = React.useState<"alias" | "forward">("alias");
  const [confirm, setConfirm] = React.useState<string | null>(null);
  const address = local.includes("@")
    ? local.trim()
    : p.domain
      ? `${local.trim()}@${p.domain}`
      : local.trim();
  const canAdd =
    !!local.trim() &&
    isEmailAddress(address) &&
    targets.length > 0 &&
    targets.every((r) => isEmailAddress(r.address));
  return (
    <div className={cx("tf-mroutes", p.className)} style={p.style}>
      {p.routes.length === 0 ? (
        <p className="tf-mroutes-empty">{t.mailNoRoutes}</p>
      ) : (
        <ul className="tf-mroutes-list" aria-label={p.label || t.mailRoutes}>
          {p.routes.map((r) => (
            <li key={r.address} className={cx("tf-mroute", r.active === false && "off")}>
              <span className="tf-mroute-main">
                <span className="tf-mono tf-mroute-from">{r.address}</span>
                <Icon name="chevronRight" size={14} className="tf-mroute-arrow" />
                <span className="tf-mono tf-mroute-to">{r.targets.join(", ")}</span>
              </span>
              <span className="tf-mroute-meta">
                <Badge tone="neutral" dot={false}>
                  {r.kind === "forward" ? t.mailForward : t.mailAlias}
                </Badge>
                {r.active === false && <Badge tone="warning">{t.mailInactive}</Badge>}
                {r.note && <small>{r.note}</small>}
              </span>
              {p.onDelete && (
                <IconButton
                  icon="trash"
                  size="sm"
                  variant="ghost"
                  label={t.mailDeleteRoute(r.address)}
                  disabled={p.busy}
                  onClick={() => setConfirm(r.address)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
      {p.onAdd &&
        (adding ? (
          <form
            className="tf-mroute-form"
            aria-label={t.mailAddRoute}
            onSubmit={(e) => {
              e.preventDefault();
              if (!canAdd) return;
              p.onAdd?.({ address, targets: targets.map((r) => r.address), kind });
              setLocal("");
              setTargets([]);
              setAdding(false);
            }}
          >
            <Segmented
              size="sm"
              label={t.mailRouteKind}
              value={kind}
              onChange={(k) => setKind(k as "alias" | "forward")}
              options={[
                { value: "alias", label: t.mailAlias },
                { value: "forward", label: t.mailForward },
              ]}
            />
            <div className="tf-mroute-field">
              <label htmlFor={id + "-addr"}>{t.mailAddress}</label>
              <span className="tf-mroute-addr">
                <input
                  id={id + "-addr"}
                  className="tf-input"
                  autoFocus
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                />
                {p.domain && !local.includes("@") && <span className="tf-mono">@{p.domain}</span>}
              </span>
            </div>
            <RecipientInput
              label={t.mailDeliverTo}
              value={targets}
              onChange={setTargets}
              suggestions={p.suggestions}
            />
            <div className="tf-mroute-actions">
              <Button type="submit" disabled={!canAdd || p.busy}>
                {t.mailAddRoute}
              </Button>
              <Button variant="ghost" onClick={() => setAdding(false)}>
                {t.cancel}
              </Button>
            </div>
          </form>
        ) : (
          <Button variant="secondary" icon="plus" size="sm" onClick={() => setAdding(true)}>
            {t.mailAddRoute}
          </Button>
        ))}
      <ConfirmDialog
        open={!!confirm}
        danger
        icon="trash"
        title={confirm ? t.mailDeleteRoute(confirm) : ""}
        text={t.mailDeleteRouteText}
        confirmLabel={t.mailDelete}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm) p.onDelete?.(confirm);
          setConfirm(null);
        }}
      />
    </div>
  );
}
