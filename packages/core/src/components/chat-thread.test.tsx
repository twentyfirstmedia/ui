// @vitest-environment jsdom
/** Chat: Markdown, message actions, editing, versions, mentions, composer extras, thread pieces. */
import * as React from "react";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { UIProvider } from "../provider.js";
import {
  ChatList,
  ChatMessage,
  ChatThread,
  ChatWorkspace,
  Composer,
  HandoffLine,
  MessageEditor,
  RichText,
  ToolCall,
  TypingIndicator,
  VersionSwitch,
  VoiceLog,
  VoiceMode,
  VoiceNote,
  parseChatQuery,
  safeHref,
} from "./index.js";
import { shiftMentions } from "./chat.js";

beforeAll(() => {
  window.matchMedia ??= ((q: string) => ({
    matches: false,
    media: q,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  Element.prototype.scrollIntoView ??= () => {};
});
afterEach(cleanup);

describe("RichText", () => {
  it("renders tables, nested and task lists, quotes and inline marks", () => {
    const md = [
      "# Plan",
      "",
      "| Seat | Price |",
      "|:--|--:|",
      "| Pro | €24 |",
      "",
      "- one",
      "  - nested *two*",
      "- [x] done",
      "- [ ] open",
      "",
      "> quoted **bold** and ~~gone~~",
      "",
      "---",
      "See https://example.com/a-very-long-path.",
    ].join("\n");
    const { container } = render(<RichText text={md} />);
    expect(container.querySelector(".tf-rt-h.h1")?.textContent).toBe("Plan");
    const table = screen.getByRole("table");
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((h) => h.textContent),
    ).toEqual(["Seat", "Price"]);
    expect((within(table).getByText("€24") as HTMLElement).style.textAlign).toBe("right");
    expect(container.querySelector("ul ul em")?.textContent).toBe("two");
    expect(screen.getByRole("img", { name: "Done" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Not done" })).toBeTruthy();
    expect(container.querySelector("blockquote b")?.textContent).toBe("bold");
    expect(container.querySelector("blockquote s")?.textContent).toBe("gone");
    expect(container.querySelector("hr.tf-rt-hr")).toBeTruthy();
    const link = screen.getByRole("link", { name: "https://example.com/a-very-long-path" });
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("never links javascript: or data: and keeps code blocks with copy", () => {
    const { container } = render(
      <RichText
        text={
          "[x](javascript:alert(1)) [y](java\tscript:alert(1)) [z](data:text/html,hi)\n\n```js\nconst a = 1\n```"
        }
      />,
    );
    expect(container.querySelectorAll("a").length).toBe(0);
    expect(screen.getByRole("button", { name: "Copy code" })).toBeTruthy();
    expect(safeHref("mailto:a@b.de")).toBe("mailto:a@b.de");
    expect(safeHref(" javascript:x")).toBeUndefined();
    expect(safeHref("/chats/1")).toBe("/chats/1");
  });

  it("marks search words", () => {
    const { container } = render(
      <RichText text="The **invoice** for seats" highlight="invoice seats" />,
    );
    expect([...container.querySelectorAll("mark")].map((m) => m.textContent)).toEqual([
      "invoice",
      "seats",
    ]);
  });
});

describe("ChatMessage", () => {
  it("copies, edits in place with Enter and cancels with Esc", () => {
    const edit = vi.fn();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<ChatMessage role="user" text="Draft a reply" onEdit={edit} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy message" }));
    expect(writeText).toHaveBeenCalledWith("Draft a reply");
    fireEvent.click(screen.getByRole("button", { name: "Edit message" }));
    const field = screen.getByRole("textbox");
    expect(screen.getByText("The conversation runs again from here")).toBeTruthy();
    fireEvent.keyDown(field, { key: "Escape" });
    expect(screen.queryByRole("textbox")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Edit message" }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Draft a short reply" } });
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(edit).toHaveBeenCalledWith("Draft a short reply");
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  it("switches versions, regenerates and asks for a comment on thumbs down", () => {
    const version = vi.fn();
    const retry = vi.fn();
    const comment = vi.fn();
    const rate = vi.fn();
    render(
      <ChatMessage
        role="assistant"
        text="Hello"
        versionCount={3}
        versionIndex={2}
        onVersionChange={version}
        onRetry={retry}
        onFeedback={rate}
        onFeedbackComment={comment}
      />,
    );
    expect(screen.getByText("3/3")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Next version" }).hasAttribute("disabled")).toBe(
      true,
    );
    fireEvent.click(screen.getByRole("button", { name: "Previous version" }));
    expect(version).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByRole("button", { name: "Regenerate reply" }));
    expect(retry).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Bad reply" }));
    expect(rate).toHaveBeenCalledWith("down");
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Too long" } });
    fireEvent.submit(screen.getByRole("textbox").closest("form") as HTMLFormElement);
    expect(comment).toHaveBeenCalledWith("down", "Too long");
    // a second press takes it back
    fireEvent.click(screen.getByRole("button", { name: "Bad reply" }));
    expect(rate).toHaveBeenLastCalledWith(null);
  });

  it("shows mentions, markers, image thumbnails and file downloads", () => {
    const { container } = render(
      <ChatMessage
        role="user"
        id="m1"
        text="@Atlas please check"
        mentions={[{ id: "atlas", label: "Atlas", start: 0, end: 6, tint: "sky" }]}
        dictated
        inVoice
        attachments={[
          { name: "plan.png", kind: "image", url: "/plan.png" },
          { name: "offer.pdf", size: "1 MB", url: "/offer.pdf" },
        ]}
      />,
    );
    expect(container.querySelector(".tf-mention")?.textContent).toBe("@Atlas");
    expect(container.querySelector("[data-message-id='m1']")).toBeTruthy();
    expect(screen.getByText("Dictated")).toBeTruthy();
    expect(screen.getByText("In voice conversation")).toBeTruthy();
    expect(screen.getByRole("img", { name: "plan.png" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Download offer.pdf" }).getAttribute("download")).toBe(
      "offer.pdf",
    );
  });

  it("plays a voice message and opens its transcript", () => {
    render(
      <ChatMessage role="user" voice={{ src: "/a.webm", duration: 12, transcript: "Hi there" }} />,
    );
    expect(screen.getByRole("button", { name: "Play" })).toBeTruthy();
    expect(screen.getByText("0:12")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Show transcript" }));
    expect(screen.getByText("Hi there")).toBeTruthy();
  });
});

describe("ToolCall", () => {
  it("links to the trace", () => {
    render(<ToolCall name="crm.search" traceHref="/traces/1" />);
    expect(
      screen.getByRole("link", { name: "Open the trace of crm.search" }).getAttribute("href"),
    ).toBe("/traces/1");
  });
});

describe("Composer", () => {
  const OPTIONS = [
    {
      id: "atlas",
      label: "Atlas",
      kind: "agent" as const,
      group: "Agents",
      role: "Sales",
      tint: "sky" as const,
    },
    { id: "ads", label: "Ads", kind: "agent" as const, group: "Agents", role: "Marketing" },
    { id: "lena", label: "Lena Hart", kind: "person" as const, group: "People" },
  ];

  it("suggests mentions on @, picks by keyboard and sends them along", () => {
    const send = vi.fn();
    render(<Composer mentionOptions={OPTIONS} onSend={send} />);
    const field = screen.getByRole("textbox");
    fireEvent.change(field, { target: { value: "Hi @a", selectionStart: 5 } });
    const list = screen.getByRole("listbox", { name: "Mention someone" });
    expect(
      within(list)
        .getAllByRole("option")
        .map((o) => o.querySelector("b")?.textContent),
    ).toEqual(["Atlas", "Ads", "Lena Hart"]);
    fireEvent.keyDown(field, { key: "ArrowDown" });
    fireEvent.keyDown(field, { key: "Enter" });
    expect((field as HTMLTextAreaElement).value).toBe("Hi @Ads ");
    fireEvent.keyDown(field, { key: "Enter" });
    expect(send).toHaveBeenCalledWith("Hi @Ads ", [], {
      mentions: [{ id: "ads", label: "Ads", start: 3, end: 7, tint: undefined }],
      dictated: false,
    });
  });

  it("removes a mention whole with Backspace", () => {
    const change = vi.fn();
    render(
      <Composer
        mentionOptions={OPTIONS}
        mentions={[{ id: "atlas", label: "Atlas", start: 0, end: 6 }]}
        onMentionsChange={change}
        value="@Atlas hi"
      />,
    );
    const field = screen.getByRole("textbox") as HTMLTextAreaElement;
    field.setSelectionRange(6, 6);
    fireEvent.keyDown(field, { key: "Backspace" });
    expect(change).toHaveBeenCalledWith([]);
  });

  it("attaches pasted files and shows dictation, typing and the read-along bar", () => {
    const attach = vi.fn();
    const dictate = vi.fn();
    const { container, rerender } = render(
      <Composer
        onAttach={attach}
        onDictate={dictate}
        dictation={{ active: true, interim: "and the budget" }}
        value="Check"
        typing={["Lena"]}
      />,
    );
    const file = new File(["x"], "shot.png", { type: "image/png" });
    fireEvent.paste(screen.getByRole("textbox"), {
      clipboardData: { files: [file], getData: () => "" },
    });
    expect(attach).toHaveBeenCalledWith([file]);
    expect(container.querySelector(".tf-composer-interim")?.textContent).toBe(" and the budget");
    expect(screen.getByText("Listening…")).toBeTruthy();
    expect(screen.getByText("Lena is typing…")).toBeTruthy();
    const mic = screen.getByRole("button", { name: "Stop dictating" });
    expect(mic.getAttribute("aria-pressed")).toBe("true");
    fireEvent.keyDown(screen.getByRole("textbox"), { key: " ", code: "Space", altKey: true });
    expect(dictate).toHaveBeenCalled();
    const step = vi.fn();
    rerender(<Composer readOnly onStepIn={step} />);
    fireEvent.click(screen.getByRole("button", { name: "Step in" }));
    expect(step).toHaveBeenCalled();
    expect(screen.getByText("You are reading along")).toBeTruthy();
  });

  it("calls onTyping at most once per interval", () => {
    const typing = vi.fn();
    render(<Composer onTyping={typing} />);
    const field = screen.getByRole("textbox");
    fireEvent.change(field, { target: { value: "a" } });
    fireEvent.change(field, { target: { value: "ab" } });
    expect(typing).toHaveBeenCalledTimes(1);
  });

  it("moves mentions with the text around them", () => {
    const m = [{ id: "a", label: "A", start: 4, end: 6 }];
    expect(shiftMentions("Hi, @A ok", "Hello, @A ok", m)).toEqual([
      { id: "a", label: "A", start: 7, end: 9 },
    ]);
    expect(shiftMentions("Hi, @A ok", "Hi, @B ok", m)).toEqual([]);
    expect(shiftMentions("Hi, @A ok", "Hi, @A okay", m)).toEqual(m);
  });
});

describe("thread pieces", () => {
  it("VersionSwitch is controlled and waits while busy", () => {
    const change = vi.fn();
    render(<VersionSwitch count={2} index={0} onChange={change} busy />);
    expect(screen.getByRole("group", { name: "Version 1 of 2" }).getAttribute("aria-busy")).toBe(
      "true",
    );
    expect(screen.getByRole("button", { name: "Next version" }).hasAttribute("disabled")).toBe(
      true,
    );
  });

  it("HandoffLine reads as a handoff and links to the conversation", () => {
    render(
      <HandoffLine
        from={{ name: "Main Brain" }}
        to={{ name: "Atlas", tint: "sky" }}
        reason="Quote for Northwind"
        href="/chats/atlas"
      />,
    );
    const link = screen.getByRole("link");
    expect(link.textContent).toContain("Main Brainhanded over toAtlas");
    expect(link.textContent).toContain("Quote for Northwind");
  });

  it("VoiceLog folds the turns of a voice conversation", () => {
    render(
      <VoiceLog
        duration="4:12"
        turns={[
          { who: "user", text: "What is open?" },
          { who: "agent", name: "Atlas", text: "Two approvals." },
        ]}
      />,
    );
    const head = screen.getByRole("button", { name: /Voice conversation/ });
    expect(head.textContent).toContain("4:12 · 2 turns");
    expect(screen.queryByText("Two approvals.")).toBeNull();
    fireEvent.click(head);
    expect(screen.getByText("Two approvals.")).toBeTruthy();
    expect(screen.getByText("You")).toBeTruthy();
  });

  it("TypingIndicator names one, two or counts many", () => {
    const { rerender } = render(<TypingIndicator names={["Lena", "Noah"]} />);
    expect(screen.getByText("Lena and Noah are typing…")).toBeTruthy();
    rerender(<TypingIndicator names={["A", "B", "C"]} />);
    expect(screen.getByText("3 people are typing…")).toBeTruthy();
    rerender(<TypingIndicator names={[]} />);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("ChatThread jumps to a message and marks it", () => {
    vi.useFakeTimers();
    const { container } = render(
      <ChatThread jumpTo="m2">
        <ChatMessage role="user" id="m1" text="one" />
        <ChatMessage role="assistant" id="m2" text="two" />
      </ChatThread>,
    );
    const hit = container.querySelector("[data-message-id='m2']") as HTMLElement;
    expect(hit.classList.contains("tf-msg-flash")).toBe(true);
    expect(document.activeElement).toBe(hit);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(hit.classList.contains("tf-msg-flash")).toBe(false);
    vi.useRealTimers();
    expect(screen.getByRole("log", { name: "Conversation" })).toBeTruthy();
  });

  it("MessageEditor sends with the button and keeps Shift+Enter for new lines", () => {
    const submit = vi.fn();
    render(<MessageEditor defaultValue="a" onSubmit={submit} />);
    const field = screen.getByRole("textbox");
    fireEvent.keyDown(field, { key: "Enter", shiftKey: true });
    expect(submit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(submit).toHaveBeenCalledWith("a");
  });

  it("VoiceNote seeks with its slider", () => {
    render(<VoiceNote src="/a.webm" duration={30} />);
    const slider = screen.getByRole("slider", { name: "Voice message" });
    fireEvent.change(slider, { target: { value: "15" } });
    expect(slider.getAttribute("aria-valuetext")).toBe("0:15 / 0:30");
  });
});

describe("ChatList and ChatWorkspace", () => {
  const groups = [
    {
      title: "Northwind",
      items: [
        {
          id: "atlas",
          name: "Atlas",
          sub: "Quote ready",
          project: "Northwind",
          date: "2026-04-10",
          unread: 2,
          href: "/c/atlas",
        },
        { id: "ads", name: "Ads", sub: "Budget at 82%", project: "Northwind", date: "2026-04-15" },
      ],
    },
    {
      title: "People",
      items: [
        { id: "lena", name: "Lena Hart", sub: "Sounds good", avatar: true, from: ["Lena Hart"] },
      ],
    },
  ];

  it("parses search tokens", () => {
    expect(parseChatQuery('budget from:Atlas in:"North wind" before:2026-04-12')).toEqual({
      text: "budget",
      tokens: [
        { key: "from", value: "Atlas", raw: "from:Atlas" },
        { key: "in", value: "North wind", raw: 'in:"North wind"' },
        { key: "before", value: "2026-04-12", raw: "before:2026-04-12" },
      ],
    });
  });

  it("filters by tokens, shows them as removable chips and links rows", () => {
    const search = vi.fn();
    render(<ChatList groups={groups} onSearch={search} />);
    expect(screen.getByRole("link", { name: /Atlas/ }).getAttribute("href")).toBe("/c/atlas");
    expect(screen.getByLabelText("2 unread")).toBeTruthy();
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "in:northwind before:2026-04-12" },
    });
    expect(screen.queryByText("Ads")).toBeNull();
    expect(screen.queryByText("Lena Hart")).toBeNull();
    expect(screen.getByText("Atlas")).toBeTruthy();
    expect(search).toHaveBeenLastCalledWith(
      "in:northwind before:2026-04-12",
      parseChatQuery("in:northwind before:2026-04-12"),
    );
    fireEvent.click(screen.getByRole("button", { name: "Remove before:2026-04-12" }));
    expect(screen.getByText("Ads")).toBeTruthy();
  });

  it("switches between list and thread on narrow screens and resizes the details", () => {
    const width = vi.fn();
    const { container } = render(
      <ChatWorkspace
        list={<ChatList groups={groups} />}
        thread={<p>Thread</p>}
        details={<p>Details</p>}
        onDetailsWidthChange={width}
      />,
    );
    const ws = container.querySelector(".tf-chatws") as HTMLElement;
    expect(ws.classList.contains("view-list")).toBe(true);
    fireEvent.click(screen.getByText("Ads"));
    expect(ws.classList.contains("view-thread")).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Back to chats" }));
    expect(ws.classList.contains("view-list")).toBe(true);
    const handle = screen.getByRole("separator", { name: "Resize the details" });
    fireEvent.keyDown(handle, { key: "ArrowLeft" });
    expect(width).toHaveBeenCalledWith(320);
  });
});

describe("VoiceMode", () => {
  it("shows live turns, the barge-in state and lets the person interrupt", () => {
    const interrupt = vi.fn();
    const { rerender } = render(
      <VoiceMode
        name="Atlas"
        state="speaking"
        onInterrupt={interrupt}
        turns={[
          { who: "user", text: "What is open?" },
          { who: "agent", name: "Atlas", text: "Two approvals", live: true },
        ]}
      />,
    );
    expect(screen.getByRole("region", { name: "Voice conversation with Atlas" })).toBeTruthy();
    expect(screen.getByText("Two approvals")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Interrupt" }));
    expect(interrupt).toHaveBeenCalled();
    rerender(<VoiceMode name="Atlas" state="interrupted" />);
    expect(screen.getByRole("status").textContent).toBe("Go ahead, I'm listening");
  });
});

describe("German strings", () => {
  it("replace every built-in English string of the chat", () => {
    const de = {
      copyMessage: "Nachricht kopieren",
      editMessage: "Nachricht bearbeiten",
      editHint: "Das Gespräch läuft ab hier neu",
      previousVersion: "Vorherige Version",
      nextVersion: "Nächste Version",
      versionLabel: (i: string, n: string) => `Version ${i} von ${n}`,
      dictated: "Diktiert",
      backToChats: "Zurück zu den Chats",
      readingAlong: "Du liest mit",
      stepIn: "Eingreifen",
      typingOne: (n: string) => `${n} schreibt…`,
      unreadCount: (_n: number, f?: string) => `${f} ungelesen`,
    };
    render(
      <UIProvider scope="subtree" locale="de-DE" messages={de}>
        <ChatMessage
          role="user"
          text="Hallo"
          onEdit={() => {}}
          dictated
          versionCount={2}
          versionIndex={1}
        />
        <TypingIndicator names={["Lena"]} />
        <Composer readOnly onStepIn={() => {}} />
        <ChatWorkspace
          list={
            <ChatList
              groups={[{ title: "Team", items: [{ id: "a", name: "Atlas", unread: 1200 }] }]}
            />
          }
          thread={<p>T</p>}
        />
      </UIProvider>,
    );
    expect(screen.getByRole("button", { name: "Nachricht kopieren" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Nachricht bearbeiten" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Version 2 von 2" })).toBeTruthy();
    expect(screen.getByText("Diktiert")).toBeTruthy();
    expect(screen.getByText("Lena schreibt…")).toBeTruthy();
    expect(screen.getByText("Du liest mit")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Eingreifen" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Zurück zu den Chats" })).toBeTruthy();
    expect(screen.getByLabelText("1.200 ungelesen")).toBeTruthy();
    for (const en of [
      "Copy message",
      "Edit message",
      "Dictated",
      "You are reading along",
      "Step in",
      "Back to chats",
    ])
      expect(screen.queryByText(en) ?? screen.queryByLabelText(en)).toBeNull();
  });
});
