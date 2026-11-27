// @vitest-environment jsdom
import * as React from "react";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { UIProvider } from "../provider.js";
import {
  AutoReplyEditor,
  InboxList,
  MailComposer,
  MailFilterBar,
  MailFolders,
  MailHtml,
  MailRouteList,
  MailRulesEditor,
  MailThread,
  RecipientInput,
  countRemoteImages,
  mailDocument,
  parseRecipients,
} from "./index.js";
import type { MailFolder, MailRecipient, MailRule } from "./types.js";

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

describe("MailHtml", () => {
  const html =
    '<p>Hi</p><img src="https://track.example.com/p.gif"><img src="data:image/png;base64,AA">';
  it("counts remote images and builds a locked-down document", () => {
    expect(countRemoteImages(html)).toBe(1);
    expect(countRemoteImages('<div style="background:url(//x.example/a.png)">')).toBe(1);
    const doc = mailDocument("<p>x</p>", {
      images: false,
      background: "white",
      ink: "black",
      link: "blue",
      font: "sans-serif",
      dark: false,
    });
    expect(doc).toContain("default-src 'none'");
    expect(doc).toContain("img-src data: cid:;");
    expect(doc).toContain("form-action 'none'");
    expect(doc).toContain('<base target="_blank">');
    expect(
      mailDocument("", { images: true, background: "", ink: "", link: "", font: "", dark: true }),
    ).toContain("img-src data: cid: https: http:");
  });

  it("sandboxes the frame and loads images only on request", () => {
    const onImages = vi.fn();
    const { container } = render(<MailHtml html={html} onImagesChange={onImages} />);
    const frame = container.querySelector("iframe")!;
    expect(frame.getAttribute("sandbox")).toBe(
      "allow-same-origin allow-popups allow-popups-to-escape-sandbox",
    );
    expect(frame.getAttribute("title")).toBe("Message");
    expect(frame.getAttribute("srcdoc")).toContain("img-src data: cid:;");
    expect(screen.getByText("1 remote image is blocked to protect your privacy.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Load images" }));
    expect(onImages).toHaveBeenCalledWith(true);
    expect(frame.getAttribute("srcdoc")).toContain("https: http:");
    expect(screen.queryByRole("button", { name: "Load images" })).toBeNull();
  });
});

describe("RecipientInput", () => {
  it("parses typed and pasted addresses", () => {
    expect(parseRecipients('a@x.com, "Bo Lee" <bo@y.com>; c@z.com\nd@w.org')).toEqual([
      { address: "a@x.com" },
      { address: "bo@y.com", name: "Bo Lee" },
      { address: "c@z.com" },
      { address: "d@w.org" },
    ]);
  });

  it("adds chips, flags invalid ones, removes with Backspace and pastes several", () => {
    const onChange = vi.fn();
    function Field() {
      const [v, setV] = React.useState<MailRecipient[]>([]);
      return (
        <RecipientInput
          label="To"
          value={v}
          onChange={(n) => {
            setV(n);
            onChange(n);
          }}
          suggestions={[{ address: "lena@example.com", name: "Lena Hart" }]}
        />
      );
    }
    render(<Field />);
    const input = screen.getByRole("combobox", { name: "To" });
    fireEvent.change(input, { target: { value: "len" } });
    const option = screen.getByRole("option", { name: /Lena Hart/ });
    fireEvent.mouseDown(option);
    expect(onChange).toHaveBeenLastCalledWith([{ address: "lena@example.com", name: "Lena Hart" }]);
    fireEvent.change(input, { target: { value: "not-an-address" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("One address is not valid.")).toBeTruthy();
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(screen.queryByText("One address is not valid.")).toBeNull();
    fireEvent.paste(input, { clipboardData: { getData: () => "a@x.com, b@y.com" } });
    expect(onChange).toHaveBeenLastCalledWith([
      { address: "lena@example.com", name: "Lena Hart" },
      { address: "a@x.com" },
      { address: "b@y.com" },
    ]);
    fireEvent.click(screen.getByRole("button", { name: "Remove a@x.com" }));
    expect(onChange.mock.lastCall?.[0]).toHaveLength(2);
  });
});

describe("MailComposer", () => {
  it("sends only with valid recipients, by button and by ⌘Enter", () => {
    const onSend = vi.fn();
    render(
      <MailComposer
        senders={[{ address: "hello@example.com" }, { address: "billing@example.com" }]}
        defaultValue={{ subject: "Hello" }}
        onSend={onSend}
        signature="Mara Ellis"
      />,
    );
    const send = screen.getByRole("button", { name: "Send" }) as HTMLButtonElement;
    expect(send.disabled).toBe(true);
    const to = screen.getByRole("combobox", { name: "To" });
    fireEvent.change(to, { target: { value: "lena@example.com," } });
    expect(send.disabled).toBe(false);
    fireEvent.change(screen.getByLabelText("From"), { target: { value: "billing@example.com" } });
    fireEvent.keyDown(screen.getByLabelText("Subject"), { key: "Enter", metaKey: true });
    expect(onSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "billing@example.com",
        to: [{ address: "lena@example.com" }],
        subject: "Hello",
        signature: true,
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Cc" }));
    expect(screen.getByRole("combobox", { name: "Cc" })).toBeTruthy();
    expect(screen.getByText("Mara Ellis")).toBeTruthy();
  });

  it("schedules, shows the draft state and lists uploads", () => {
    const onSchedule = vi.fn();
    render(
      <MailComposer
        defaultValue={{
          to: [{ address: "lena@example.com" }],
          attachments: [{ id: "f1", name: "plan.pdf", progress: 0.4 }],
        }}
        onSend={() => {}}
        onSchedule={onSchedule}
        saved="saved"
      />,
    );
    expect(screen.getByText("Draft saved")).toBeTruthy();
    expect(screen.getByRole("progressbar", { name: "Uploading plan.pdf" })).toBeTruthy();
    expect((screen.getByRole("button", { name: "Send" }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Remove plan.pdf" }));
    fireEvent.click(screen.getByRole("button", { name: "Send later" }));
    const dialog = screen.getByRole("dialog", { name: "Send later" });
    fireEvent.change(within(dialog).getByLabelText("Date"), { target: { value: "2030-05-02" } });
    fireEvent.change(within(dialog).getByLabelText("Time"), { target: { value: "09:15" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Schedule" }));
    expect(onSchedule).toHaveBeenCalledWith(
      expect.objectContaining({ attachments: [] }),
      new Date(2030, 4, 2, 9, 15),
    );
  });
});

describe("MailFolders", () => {
  const FOLDERS: MailFolder[] = [
    { id: "inbox", label: "Inbox", role: "inbox", unread: 4 },
    { id: "trash", label: "Trash", role: "trash" },
    { id: "clients", label: "Clients", children: [{ id: "acme", label: "Acme" }] },
  ];
  it("selects, renames inline, creates and confirms emptying", () => {
    const onSelect = vi.fn();
    const onRename = vi.fn();
    const onCreate = vi.fn();
    const onEmpty = vi.fn();
    render(
      <MailFolders
        folders={FOLDERS}
        onSelect={onSelect}
        onRename={onRename}
        onCreate={onCreate}
        onEmpty={onEmpty}
        onDelete={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Inbox, 4 unread" }));
    expect(onSelect).toHaveBeenCalledWith("inbox");
    fireEvent.click(screen.getByRole("button", { name: "Expand Clients" }));
    expect(screen.getByRole("button", { name: "Acme" })).toBeTruthy();
    // context menu by right click
    fireEvent.contextMenu(screen.getByRole("button", { name: "Clients" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Rename" }));
    const edit = screen.getByRole("textbox", { name: "Rename" });
    fireEvent.change(edit, { target: { value: "Customers" } });
    fireEvent.keyDown(edit, { key: "Enter" });
    expect(onRename).toHaveBeenCalledWith("clients", "Customers");
    // standard folders cannot be renamed; trash can be emptied
    fireEvent.click(screen.getByRole("button", { name: "Actions for Trash" }));
    expect(screen.queryByRole("menuitem", { name: "Rename" })).toBeNull();
    fireEvent.click(screen.getByRole("menuitem", { name: "Empty folder" }));
    fireEvent.click(
      within(screen.getByRole("alertdialog")).getByRole("button", { name: "Empty folder" }),
    );
    expect(onEmpty).toHaveBeenCalledWith("trash");
    fireEvent.click(screen.getByRole("button", { name: "New folder" }));
    const name = screen.getByRole("textbox", { name: "New folder" });
    fireEvent.change(name, { target: { value: "Receipts" } });
    fireEvent.keyDown(name, { key: "Enter" });
    expect(onCreate).toHaveBeenCalledWith("Receipts", null);
  });
});

describe("MailFilterBar", () => {
  it("toggles flags, picks an account and clears", () => {
    const onChange = vi.fn();
    render(
      <MailFilterBar
        accounts={[{ value: "hello@example.com", label: "hello@example.com" }]}
        agents={[{ value: "support", label: "Support agent" }]}
        onChange={onChange}
        count={12}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Unread" }));
    expect(onChange).toHaveBeenLastCalledWith({ unread: true });
    fireEvent.click(screen.getByRole("button", { name: /Account/ }));
    fireEvent.click(screen.getByRole("menuitemradio", { name: "hello@example.com" }));
    expect(onChange).toHaveBeenLastCalledWith({ unread: true, account: "hello@example.com" });
    expect(screen.getByText("12 messages")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(onChange).toHaveBeenLastCalledWith({});
  });
});

describe("MailRulesEditor", () => {
  it("adds a rule with conditions and actions", () => {
    const onSave = vi.fn();
    function Editor() {
      const [rules, setRules] = React.useState<MailRule[]>([]);
      return (
        <MailRulesEditor
          value={rules}
          onChange={setRules}
          folders={[{ value: "receipts", label: "Receipts" }]}
          agents={[{ value: "bookkeeper", label: "Bookkeeper" }]}
          onSave={onSave}
        />
      );
    }
    render(<Editor />);
    expect(screen.getByText("No rules yet.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "New rule" }));
    const rule = screen.getByRole("region", { name: "Rule 1" });
    fireEvent.change(within(rule).getByLabelText("Value"), { target: { value: "invoice" } });
    fireEvent.change(within(rule).getByLabelText("Field"), { target: { value: "subject" } });
    fireEvent.change(within(rule).getByLabelText("Target"), { target: { value: "receipts" } });
    fireEvent.click(within(rule).getByRole("button", { name: "Add action" }));
    const types = within(rule).getAllByLabelText("Action");
    fireEvent.change(types[1]!, { target: { value: "handoff" } });
    fireEvent.change(within(rule).getAllByLabelText("Target")[1]!, {
      target: { value: "bookkeeper" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save rules" }));
    expect(onSave.mock.lastCall?.[0][0]).toMatchObject({
      enabled: true,
      match: "all",
      conditions: [{ field: "subject", op: "contains", value: "invoice" }],
      actions: [
        { type: "move", value: "receipts" },
        { type: "handoff", value: "bookkeeper" },
      ],
    });
  });
});

describe("AutoReplyEditor", () => {
  it("turns on with a period and says until when", () => {
    const onChange = vi.fn();
    function Editor() {
      const [v, setV] = React.useState({ enabled: false, message: "" } as Parameters<
        NonNullable<React.ComponentProps<typeof AutoReplyEditor>["onChange"]>
      >[0]);
      return (
        <AutoReplyEditor
          value={v}
          onChange={(n) => {
            setV(n);
            onChange(n);
          }}
        />
      );
    }
    render(<Editor />);
    expect(screen.getByText("Off")).toBeTruthy();
    fireEvent.click(screen.getByRole("switch", { name: "Automatic replies" }));
    fireEvent.change(screen.getByLabelText("Until"), { target: { value: "2026-04-24" } });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Back on Monday." } });
    expect(screen.getByText("On until April 24")).toBeTruthy();
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        enabled: true,
        end: new Date(2026, 3, 24),
        message: "Back on Monday.",
      }),
    );
  });
});

describe("MailRouteList", () => {
  it("lists routes, adds an alias and deletes after confirming", () => {
    const onAdd = vi.fn();
    const onDelete = vi.fn();
    render(
      <MailRouteList
        domain="example.com"
        routes={[
          { address: "hello@example.com", targets: ["mara@example.com"] },
          { address: "old@example.com", targets: ["x@other.org"], kind: "forward", active: false },
        ]}
        onAdd={onAdd}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByText("Inactive")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Add address" }));
    fireEvent.change(screen.getByLabelText("Address"), { target: { value: "sales" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Deliver to" }), {
      target: { value: "mara@example.com," },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Add address" }));
    expect(onAdd).toHaveBeenCalledWith({
      address: "sales@example.com",
      targets: ["mara@example.com"],
      kind: "alias",
    });
    fireEvent.click(screen.getByRole("button", { name: "Delete old@example.com" }));
    fireEvent.click(
      within(screen.getByRole("alertdialog")).getByRole("button", { name: "Delete" }),
    );
    expect(onDelete).toHaveBeenCalledWith("old@example.com");
  });
});

describe("InboxList and MailThread", () => {
  const ITEMS = [
    { id: 1, from: "Lena", subject: "Plan", unread: true, attachments: true },
    { id: 2, from: "Noah", subject: "Venue", starred: true },
    { id: 3, from: "Ava", subject: "Hiring" },
  ];
  it("selects ranges of rows and runs bulk actions", () => {
    const archive = vi.fn();
    const star = vi.fn();
    render(
      <InboxList
        items={ITEMS}
        selectable
        defaultChecked={[1]}
        onStar={star}
        bulkActions={[{ label: "Archive", icon: "archive", onClick: archive }]}
      />,
    );
    expect(screen.getByText("1 selected")).toBeTruthy();
    fireEvent.click(screen.getByRole("checkbox", { name: "Select Hiring" }));
    fireEvent.click(screen.getByRole("button", { name: "Archive" }));
    expect(archive).toHaveBeenCalledWith([1, 3]);
    fireEvent.click(screen.getByRole("button", { name: "Remove star from Venue" }));
    expect(star).toHaveBeenCalledWith(expect.objectContaining({ id: 2 }), false);
    expect(screen.getByLabelText("Has attachments")).toBeTruthy();
  });

  it("offers one-click unsubscribe", () => {
    const unsub = vi.fn();
    const { rerender } = render(
      <MailThread
        subject="Weekly digest"
        messages={[{ id: 1, from: "News", body: "Hi" }]}
        unsubscribe={{ sender: "Acme News", onUnsubscribe: unsub }}
      />,
    );
    expect(screen.getByText("Newsletter from Acme News")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Unsubscribe" }));
    expect(unsub).toHaveBeenCalled();
    rerender(
      <MailThread
        subject="Weekly digest"
        messages={[{ id: 1, from: "News", body: "Hi" }]}
        unsubscribe={{ sender: "Acme News", onUnsubscribe: unsub, done: true }}
      />,
    );
    expect(screen.getByText("Unsubscribed")).toBeTruthy();
  });
});

describe("German", () => {
  it("no English leaks from the webmail parts", async () => {
    render(
      <UIProvider
        scope="subtree"
        locale="de-DE"
        messages={{
          mailNewMessage: "Neue Nachricht",
          mailTo: "An",
          mailSubject: "Betreff",
          mailSendLater: "Später senden",
          send: "Senden",
          mailUnread: "Ungelesen",
          mailStarred: "Markiert",
          mailWithAttachments: "Mit Anhängen",
          mailAccount: "Konto",
          mailAllAccounts: "Alle",
          mailImagesBlocked: (n) => `${n} externe Bilder blockiert.`,
          mailLoadImages: "Bilder laden",
          mailMessage: "Nachricht",
          mailFolders: "Ordner",
          mailNewFolder: "Neuer Ordner",
          mailUnreadCount: (n) => `${n} ungelesen`,
        }}
      >
        <MailComposer onSend={() => {}} onSchedule={() => {}} />
        <MailFilterBar accounts={[{ value: "a", label: "a@example.com" }]} />
        <MailHtml html='<img src="https://x.example/a.png">' />
        <MailFolders
          folders={[{ id: "inbox", label: "Posteingang", role: "inbox", unread: 2 }]}
          onCreate={() => {}}
        />
      </UIProvider>,
    );
    await act(async () => {});
    for (const de of [
      "Neue Nachricht",
      "Später senden",
      "Senden",
      "Ungelesen",
      "Mit Anhängen",
      "Bilder laden",
      "Neuer Ordner",
    ])
      expect(screen.getAllByText(de).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Posteingang, 2 ungelesen" })).toBeTruthy();
    for (const en of [
      "New message",
      "Send later",
      "Unread",
      "With attachments",
      "Load images",
      "New folder",
    ])
      expect(screen.queryByText(en)).toBeNull();
  });
});
