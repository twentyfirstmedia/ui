"use client";
import * as React from "react";
import { formatNumber } from "../format.js";
import { cx } from "../cx.js";
import { useStrings } from "../context.js";
import { RICH_TEXT_EDITOR_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { FormField } from "./forms.js";
import { Popover } from "./overlays.js";
import { Button } from "./foundation.js";
import type { IconName, RichTextEditorProps } from "./types.js";

/* ── Rich text editor (Selection/Range based, no execCommand) ── */
const RTE_ALLOWED: Record<string, 1> = {
  P: 1,
  H3: 1,
  BLOCKQUOTE: 1,
  UL: 1,
  OL: 1,
  LI: 1,
  B: 1,
  STRONG: 1,
  I: 1,
  EM: 1,
  U: 1,
  A: 1,
  BR: 1,
};

const RTE_BLOCKS: Record<string, 1> = {
  P: 1,
  H3: 1,
  BLOCKQUOTE: 1,
  UL: 1,
  OL: 1,
};

function rteClean(html: string | undefined): string {
  const box = document.createElement("div");
  box.innerHTML = html || "";
  (function walk(n: Node) {
    Array.from(n.childNodes).forEach((node) => {
      const c = node as Element;
      if (c.nodeType === 3) return;
      if (c.nodeType !== 1 || !RTE_ALLOWED[c.tagName]) {
        if (c.nodeType === 1 && !/^(SCRIPT|STYLE|IFRAME|OBJECT)$/.test(c.tagName)) {
          walk(c);
          while (c.firstChild) n.insertBefore(c.firstChild, c);
        }
        n.removeChild(c);
        return;
      }
      const href = c.tagName === "A" ? c.getAttribute("href") : null;
      Array.from(c.attributes).forEach((a) => {
        c.removeAttribute(a.name);
      });
      if (c.tagName === "A") {
        if (href && /^(https?:|mailto:|tel:|\/|#|\{)/i.test(href)) {
          c.setAttribute("href", href);
          c.setAttribute("rel", "noopener noreferrer");
        }
      }
      walk(c);
    });
  })(box);
  Array.from(box.childNodes).forEach((c) => {
    if (c.nodeType === 3 ? (c.textContent || "").trim() : !RTE_BLOCKS[(c as Element).tagName]) {
      const p = document.createElement("p");
      box.insertBefore(p, c);
      p.appendChild(c);
    } else if (c.nodeType === 3) box.removeChild(c);
  });
  return box.innerHTML;
}

export function RichTextEditor(p: RichTextEditorProps) {
  const strings = useStrings(RICH_TEXT_EDITOR_STRINGS);
  const ref = React.useRef<HTMLDivElement>(null),
    count = React.useState(0),
    active = React.useState<Record<string, boolean>>({}),
    linkOpen = React.useState(false),
    linkUrl = React.useState(""),
    saved = React.useRef<Range | null>(null),
    hist = React.useRef<{
      stack: string[];
      i: number;
      t: ReturnType<typeof setTimeout> | undefined;
    }>({
      stack: [],
      i: -1,
      t: undefined,
    });
  /** The editable element; every caller runs after mount. */
  function root(): HTMLDivElement {
    return ref.current as HTMLDivElement;
  }
  function range(): Range | null {
    const s = window.getSelection();
    if (!s || !s.rangeCount) return null;
    const r = s.getRangeAt(0);
    return ref.current && ref.current.contains(r.commonAncestorContainer) ? r : null;
  }
  function select(r: Range) {
    const s = window.getSelection();
    if (!s) return;
    s.removeAllRanges();
    s.addRange(r);
  }
  function up(start: Node | null, test: (el: HTMLElement) => boolean): HTMLElement | null {
    let node = start;
    while (node && node !== root()) {
      if (node.nodeType === 1 && test(node as HTMLElement)) return node as HTMLElement;
      node = node.parentNode;
    }
    return null;
  }
  function blockOf(start: Node | null, off?: number): HTMLElement | null {
    let node = start;
    if (node === root()) {
      const kids = root().childNodes;
      return (
        (kids[Math.max(0, Math.min(kids.length - 1, (off || 0) - (off ? 1 : 0)))] as HTMLElement) ||
        null
      );
    }
    while (node && node.parentNode !== root()) node = node.parentNode;
    return node && node !== root() ? (node as HTMLElement) : null;
  }
  function keep(fn: (r: Range | null) => void) {
    const r = range(),
      m = r && {
        sc: r.startContainer,
        so: r.startOffset,
        ec: r.endContainer,
        eo: r.endOffset,
      };
    fn(r);
    if (m && root().contains(m.sc) && root().contains(m.ec)) {
      try {
        const nr = document.createRange();
        nr.setStart(m.sc, m.so);
        nr.setEnd(m.ec, m.eo);
        select(nr);
      } catch {
        /* the old selection no longer exists */
      }
    }
    changed(true);
  }
  function snapshot(now: boolean) {
    const hs = hist.current;
    clearTimeout(hs.t);
    function push() {
      const html = root().innerHTML;
      if (hs.stack[hs.i] === html) return;
      hs.stack = hs.stack
        .slice(0, hs.i + 1)
        .concat([html])
        .slice(-100);
      hs.i = hs.stack.length - 1;
    }
    if (now) push();
    else hs.t = setTimeout(push, 400);
  }
  function emit() {
    const el = root();
    if (!el) return;
    count[1]((el.innerText ?? el.textContent ?? "").trim().length);
    p.onChange && p.onChange(rteClean(el.innerHTML));
  }
  function changed(now: boolean) {
    snapshot(now);
    emit();
    state();
  }
  function state() {
    const r = range();
    if (!r) return active[1]({});
    const n = r.startContainer,
      b = blockOf(n),
      li = up(n, (e) => e.tagName === "UL" || e.tagName === "OL");
    active[1]({
      bold: !!up(n, (e) => e.tagName === "B" || e.tagName === "STRONG"),
      italic: !!up(n, (e) => e.tagName === "I" || e.tagName === "EM"),
      underline: !!up(n, (e) => e.tagName === "U"),
      link: !!up(n, (e) => e.tagName === "A"),
      heading: !!b && b.tagName === "H3",
      quote: !!b && b.tagName === "BLOCKQUOTE",
      list: !!li && li.tagName === "UL",
      olist: !!li && li.tagName === "OL",
    });
  }
  React.useEffect(() => {
    root().innerHTML = rteClean(p.defaultValue || p.value || "") || "<p><br></p>";
    count[1]((root().innerText ?? root().textContent ?? "").trim().length);
    snapshot(true);
    document.addEventListener("selectionchange", state);
    return () => {
      document.removeEventListener("selectionchange", state);
    };
  }, []);
  function unwrap(el: Element) {
    const par = el.parentNode as Node;
    while (el.firstChild) par.insertBefore(el.firstChild, el);
    par.removeChild(el);
  }
  function mark(tag: string, alt?: string) {
    const r = range();
    if (!r) return;
    const hit = up(r.startContainer, (e) => e.tagName === tag || e.tagName === alt);
    if (hit) {
      unwrap(hit);
      return changed(true);
    }
    if (r.collapsed) return;
    const el = document.createElement(tag);
    el.appendChild(r.extractContents());
    Array.prototype.slice.call(el.querySelectorAll(tag + (alt ? "," + alt : ""))).forEach(unwrap);
    r.insertNode(el);
    const nr = document.createRange();
    nr.selectNodeContents(el);
    select(nr);
    changed(true);
  }
  function blocks(r: Range): HTMLElement[] {
    const a = blockOf(r.startContainer, r.startOffset),
      b = blockOf(r.endContainer, r.endOffset),
      out: HTMLElement[] = [];
    let n: HTMLElement | null = a;
    while (n) {
      out.push(n);
      if (n === b) break;
      n = n.nextSibling as HTMLElement | null;
    }
    return out;
  }
  function setBlock(tag: string) {
    if (!range()) return;
    keep((r) => {
      if (!r) return;
      const bs = blocks(r),
        off = bs.every((b) => b.tagName === tag);
      bs.forEach((b) => {
        const items: Element[] =
          b.tagName === "UL" || b.tagName === "OL" ? Array.from(b.children) : [b];
        items.forEach((it) => {
          const nb = document.createElement(off ? "P" : tag);
          while (it.firstChild) nb.appendChild(it.firstChild);
          root().insertBefore(nb, b);
        });
        root().removeChild(b);
      });
    });
  }
  function setList(tag: string) {
    if (!range()) return;
    keep((r) => {
      if (!r) return;
      const bs = blocks(r);
      const first = bs[0];
      if (!first) return;
      if (bs.length === 1 && first.tagName === tag) {
        Array.from(first.children).forEach((li) => {
          const pp = document.createElement("P");
          while (li.firstChild) pp.appendChild(li.firstChild);
          root().insertBefore(pp, first);
        });
        root().removeChild(first);
        return;
      }
      const list = document.createElement(tag);
      root().insertBefore(list, first);
      bs.forEach((b) => {
        const items: Element[] =
          b.tagName === "UL" || b.tagName === "OL" ? Array.from(b.children) : [b];
        items.forEach((it) => {
          const li = document.createElement("LI");
          while (it.firstChild) li.appendChild(it.firstChild);
          list.appendChild(li);
        });
        root().removeChild(b);
      });
    });
  }
  function openLink() {
    const r = range();
    if (!r) return;
    saved.current = r.cloneRange();
    const a = up(r.startContainer, (e) => e.tagName === "A");
    linkUrl[1]((a && a.getAttribute("href")) || "");
    linkOpen[1](true);
  }
  function applyLink(remove: boolean) {
    const r = saved.current;
    linkOpen[1](false);
    if (!r) return;
    root().focus();
    select(r);
    const a = up(r.startContainer, (e) => e.tagName === "A");
    let url = linkUrl[0].trim();
    if (url && !/^(https?:|mailto:|tel:|\/|#|\{)/i.test(url)) url = "https://" + url;
    if (remove || !url) {
      if (a) unwrap(a);
      return changed(true);
    }
    if (a) {
      a.setAttribute("href", url);
      return changed(true);
    }
    const el = document.createElement("A");
    el.setAttribute("href", url);
    el.setAttribute("rel", "noopener noreferrer");
    if (r.collapsed) el.textContent = url;
    else el.appendChild(r.extractContents());
    r.insertNode(el);
    changed(true);
  }
  function insertText(t: string) {
    let r = range();
    if (!r) {
      root().focus();
      r = range();
    }
    if (!r) return;
    r.deleteContents();
    const tn = document.createTextNode(t);
    r.insertNode(tn);
    const nr = document.createRange();
    nr.setStartAfter(tn);
    nr.collapse(true);
    select(nr);
    changed(true);
  }
  function restore(d: number) {
    const hs = hist.current;
    snapshot(true);
    const j = hs.i + d;
    if (j < 0 || j >= hs.stack.length) return;
    hs.i = j;
    root().innerHTML = hs.stack[j] ?? "";
    const nr = document.createRange();
    nr.selectNodeContents(root());
    nr.collapse(false);
    select(nr);
    emit();
  }
  function key(e: React.KeyboardEvent<HTMLDivElement>) {
    const m = e.metaKey || e.ctrlKey;
    if (!m) return;
    const k = e.key.toLowerCase();
    if (k === "b") {
      e.preventDefault();
      mark("B", "STRONG");
    } else if (k === "i") {
      e.preventDefault();
      mark("I", "EM");
    } else if (k === "u") {
      e.preventDefault();
      mark("U");
    } else if (k === "k") {
      e.preventDefault();
      openLink();
    } else if (k === "z") {
      e.preventDefault();
      restore(e.shiftKey ? 1 : -1);
    } else if (k === "y") {
      e.preventDefault();
      restore(1);
    }
  }
  function paste(e: React.ClipboardEvent<HTMLDivElement>) {
    e.preventDefault();
    const t = e.clipboardData.getData("text/plain");
    const lines = t.replace(/\r/g, "").split("\n");
    insertText(lines[0] ?? "");
    if (lines.length > 1) {
      const r = range(),
        b = r && blockOf(r.startContainer, r.startOffset);
      let after: HTMLElement | null = b;
      if (!after) return changed(true);
      lines.slice(1).forEach((l) => {
        const pp = document.createElement("P");
        pp.textContent = l;
        const cur = after as HTMLElement;
        cur.parentNode?.insertBefore(pp, cur.nextSibling);
        after = pp;
      });
      const nr = document.createRange();
      nr.selectNodeContents(after);
      nr.collapse(false);
      select(nr);
      changed(true);
    }
  }
  function input() {
    const el = root();
    if (!el.firstChild || el.innerHTML === "<br>") el.innerHTML = "<p><br></p>";
    Array.from(el.childNodes).forEach((c) => {
      if (c.nodeType === 3 && (c.textContent || "").trim()) {
        const pp = document.createElement("P");
        el.insertBefore(pp, c);
        pp.appendChild(c);
        const nr = document.createRange();
        nr.selectNodeContents(pp);
        nr.collapse(false);
        select(nr);
      }
    });
    changed(false);
  }
  const tools: ([IconName, () => void, string, string?] | "-")[] = [
    [
      "bold",
      () => {
        mark("B", "STRONG");
      },
      strings.bold,
      "B",
    ],
    [
      "italic",
      () => {
        mark("I", "EM");
      },
      strings.italic,
      "I",
    ],
    [
      "underline",
      () => {
        mark("U");
      },
      strings.underline,
      "U",
    ],
    "-",
    [
      "heading",
      () => {
        setBlock("H3");
      },
      strings.heading,
    ],
    [
      "quote",
      () => {
        setBlock("BLOCKQUOTE");
      },
      strings.quote,
    ],
    [
      "list",
      () => {
        setList("UL");
      },
      strings.bulletedList,
    ],
    [
      "olist",
      () => {
        setList("OL");
      },
      strings.numberedList,
    ],
    "-",
    ["link", openLink, strings.link, "K"],
    "-",
    [
      "undo",
      () => {
        restore(-1);
      },
      strings.undo,
      "Z",
    ],
    [
      "redo",
      () => {
        restore(1);
      },
      strings.redo,
    ],
  ];
  const over = p.maxLength && count[0] > p.maxLength,
    keyMod =
      typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || "")
        ? "⌘"
        : "Ctrl+";
  return (
    <FormField label={p.label} hint={p.hint} error={p.error}>
      <div className={cx("tf-rte", over && "invalid")}>
        <div className="tf-rte-bar" role="toolbar" aria-label={strings.formatting}>
          {tools.map((t, i) => {
            if (t === "-") return <span key={i} className="tf-rte-sep" aria-hidden />;
            const btn = (
              <button
                key={i}
                type="button"
                className={cx("tf-rte-btn", active[0][t[0]] && "on")}
                title={t[2] + (t[3] ? " (" + keyMod + t[3] + ")" : "")}
                aria-label={t[2]}
                aria-pressed={t[0] === "undo" || t[0] === "redo" ? undefined : !!active[0][t[0]]}
                disabled={p.disabled}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onClick={t[1]}
              >
                <Icon name={t[0]} size={15} />
              </button>
            );
            return t[0] === "link" ? (
              <Popover
                key={i}
                width={300}
                open={linkOpen[0]}
                onOpenChange={linkOpen[1]}
                trigger={btn}
              >
                <form
                  className="tf-col"
                  style={{
                    gap: 8,
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    applyLink(false);
                  }}
                >
                  <input
                    className="tf-input"
                    autoFocus
                    value={linkUrl[0]}
                    onChange={(e) => {
                      linkUrl[1](e.target.value);
                    }}
                    placeholder={strings.linkAddress}
                    aria-label={strings.linkAddress}
                    inputMode="url"
                  />
                  <div
                    className="tf-row"
                    style={{
                      justifyContent: "flex-end",
                      gap: 8,
                    }}
                  >
                    {active[0].link && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          applyLink(true);
                        }}
                      >
                        {strings.removeLink}
                      </Button>
                    )}
                    <Button size="sm" type="submit">
                      {strings.apply}
                    </Button>
                  </div>
                </form>
              </Popover>
            ) : (
              btn
            );
          })}
          {p.variables && p.variables.length > 0 && (
            <Popover
              width={240}
              trigger={(s) => (
                <button
                  type="button"
                  className="tf-rte-var"
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onClick={s.toggle}
                  aria-expanded={s.open}
                >
                  {"{ }"}
                  <span>{strings.insertField}</span>
                </button>
              )}
            >
              {(s) => (
                <div className="tf-menu">
                  {(p.variables || []).map((v) => (
                    <button
                      key={v.key}
                      type="button"
                      className="tf-menu-item"
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      onClick={() => {
                        insertText("{" + v.key + "}");
                        s.close && s.close();
                      }}
                    >
                      <span
                        style={{
                          flex: 1,
                        }}
                      >
                        {v.label}
                      </span>
                      <code>{"{" + v.key + "}"}</code>
                    </button>
                  ))}
                </div>
              )}
            </Popover>
          )}
        </div>
        <div
          ref={ref}
          className="tf-rte-area"
          contentEditable={!p.disabled}
          role="textbox"
          aria-multiline="true"
          aria-label={typeof p.label === "string" ? p.label : strings.text}
          data-placeholder={p.placeholder || ""}
          suppressContentEditableWarning
          onInput={input}
          onKeyDown={key}
          onPaste={paste}
          onBlur={emit}
          style={{
            minHeight: p.minHeight || 160,
          }}
        />
        {(p.maxLength || p.footer) && (
          <div className="tf-rte-foot">
            {p.footer}
            {p.maxLength && (
              <span className={cx("tf-rte-count", over && "over")}>
                {formatNumber(count[0]) + " / " + formatNumber(p.maxLength)}
              </span>
            )}
          </div>
        )}
      </div>
    </FormField>
  );
}

/* ── Email and ad previews ── */
