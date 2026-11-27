// @vitest-environment jsdom
import * as React from "react";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UIProvider } from "../provider.js";
import {
  ApprovalCard,
  ApprovalInbox,
  CampaignPreview,
  ChangePreview,
  CommandPreview,
  CommandWhitelist,
  DocumentPreview,
  DomainHeader,
  DomainList,
  EventPreview,
  LineDiff,
  MessagePreview,
  MoneyPreview,
  OverrideDiff,
  diffLines,
  foldDiff,
  maskRecipient,
} from "./index.js";
import type { ApprovalInboxItem } from "./types.js";

afterEach(cleanup);

function deferred() {
  let resolve!: () => void, reject!: (e?: unknown) => void;
  const promise = new Promise<void>((a, b) => {
    resolve = a;
    reject = b;
  });
  return { promise, resolve, reject };
}

describe("ApprovalCard step-up and busy state", () => {
  it("asks for the passkey on A and B, stays busy while onDecide is pending", async () => {
    const d = deferred();
    render(<ApprovalCard title="Refund €10.00" family="money" stepUp onDecide={() => d.promise} />);
    expect(screen.getAllByText("Needs your passkey")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: /Yes, run it as shown/ }));
    expect(screen.getAllByText("Confirm with passkey").length).toBeGreaterThan(0);
    for (const b of screen.getAllByRole("button"))
      expect((b as HTMLButtonElement).disabled).toBe(true);
    await act(async () => {
      d.reject(new Error("NotAllowedError"));
      await d.promise.catch(() => {});
    });
    expect(screen.getByRole("alert").textContent).toContain("The passkey was not confirmed");
    expect(screen.getByRole("group", { name: "Refund €10.00" })).toBeTruthy();
  });

  it("collapses once a returned promise resolves, without a decision prop", async () => {
    const d = deferred();
    render(<ApprovalCard title="Pay invoice" onDecide={() => d.promise} />);
    fireEvent.keyDown(screen.getByRole("group"), { key: "c" });
    await act(async () => {
      d.resolve();
      await d.promise;
    });
    expect(screen.queryByRole("group")).toBeNull();
    expect(screen.getByText("C · No, discard")).toBeTruthy();
  });

  it("shows a rejected string as the error", async () => {
    const d = deferred();
    render(<ApprovalCard title="Deploy" onDecide={() => d.promise} />);
    fireEvent.click(screen.getByRole("button", { name: /Yes, run it as shown/ }));
    await act(async () => {
      d.reject("The server is busy, try again in a minute.");
      await d.promise.catch(() => {});
    });
    expect(screen.getByRole("alert").textContent).toBe(
      "The server is busy, try again in a minute.",
    );
  });

  it("compact folds the payload and links the title", () => {
    render(
      <ApprovalCard title="Add TXT record" compact href="/approvals/7">
        <p>payload</p>
      </ApprovalCard>,
    );
    expect(screen.queryByText("payload")).toBeNull();
    expect(screen.getByRole("link", { name: "Add TXT record" }).getAttribute("href")).toBe(
      "/approvals/7",
    );
    fireEvent.click(screen.getByRole("button", { name: "Show what runs" }));
    expect(screen.getByText("payload")).toBeTruthy();
  });
});

const ITEMS: ApprovalInboxItem[] = [
  {
    id: 1,
    title: "Send reply",
    agent: "Atlas",
    project: "Support",
    family: "comms",
    ageMin: 130,
    urgent: true,
    age: "2 h",
  },
  {
    id: 2,
    title: "Refund €10",
    agent: "Ledger",
    project: "Finance",
    family: "money",
    ageMin: 38,
    age: "38 min",
  },
  {
    id: 3,
    title: "Add TXT",
    agent: "Scout",
    project: "Domains",
    family: "infra",
    ageMin: 3,
    age: "3 min",
  },
  {
    id: 4,
    title: "Old refund",
    agent: "Ledger",
    project: "Finance",
    family: "money",
    decision: { key: "A", by: "Mara", at: "09:41" },
  },
];

describe("ApprovalInbox filters, done view and keys", () => {
  it("warns about escalations, filters by family and answers with A–D", () => {
    const onDecide = vi.fn();
    render(<ApprovalInbox items={ITEMS} filters defaultSelected={2} onDecide={onDecide} />);
    expect(screen.getByText("1 approval escalates soon")).toBeTruthy();
    const list = screen.getByRole("listbox");
    expect(within(list).getAllByRole("option")).toHaveLength(3);
    fireEvent.keyDown(list, { key: "a" });
    expect(onDecide).toHaveBeenLastCalledWith(2, "A");
    fireEvent.keyDown(list, { key: "j" });
    fireEvent.keyDown(list, { key: "D" });
    expect(onDecide).toHaveBeenLastCalledWith(3, "D");
  });

  it("filters controlled and shows the done view", () => {
    function Box() {
      const [f, setF] = React.useState({});
      return <ApprovalInbox items={ITEMS} filter={f} onFilterChange={setF} defaultFilter={{}} />;
    }
    const { unmount } = render(<Box />);
    unmount();
    render(<ApprovalInbox items={ITEMS} defaultFilter={{ family: "money" }} />);
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual([
      expect.stringContaining("Refund €10"),
    ]);
    fireEvent.click(screen.getByRole("radio", { name: "Done" }));
    const done = screen.getByRole("option");
    expect(done.textContent).toContain("Old refund");
    expect(done.textContent).toContain("Mara · 09:41");
  });
});

describe("previews", () => {
  it("ChangePreview marks changed rows and shows empty sides", () => {
    const { container } = render(
      <ChangePreview
        title="Update TXT record"
        fields={[
          { label: "Name", before: "ops-test", after: "ops-test", mono: true },
          { label: "Content", before: "v=1", after: "v=2" },
          { label: "Comment", before: null, after: "added" },
        ]}
        warnings={["Mail records change delivery."]}
      />,
    );
    expect(container.querySelectorAll("tr.changed")).toHaveLength(2);
    expect(screen.getByText("Empty")).toBeTruthy();
    expect(screen.getByText("Mail records change delivery.")).toBeTruthy();
  });

  it("diffLines finds the common lines and foldDiff folds long unchanged runs", () => {
    const before = ["a", "b", "c", "d", "e", "f", "g", "h"].join("\n");
    const after = ["a", "b", "c", "d", "e", "f", "g", "H"].join("\n");
    const lines = diffLines(before, after);
    expect(lines.filter((l) => l.op !== " ")).toEqual([
      { op: "-", text: "h" },
      { op: "+", text: "H" },
    ]);
    expect(foldDiff(lines, 2)[0]).toEqual({ op: "…", count: 5 });
    render(<LineDiff before={before} after={after} context={2} />);
    expect(screen.getByText("5 unchanged lines")).toBeTruthy();
  });

  it("OverrideDiff can fold now", () => {
    const before = Array.from({ length: 20 }, (_, i) => `line ${i}`).join("\n");
    render(
      <OverrideDiff title="Instructions" before={before} after={before + "\nnew"} context={1} />,
    );
    expect(screen.getByText("19 unchanged lines")).toBeTruthy();
  });

  it("maskRecipient masks e-mail, phone, IBAN and names", () => {
    expect(maskRecipient("erika@example.com")).toBe("e…@example.com");
    expect(maskRecipient("+49 151 2345 5678")).toBe("…5678");
    expect(maskRecipient("DE89 3704 0044 0532 0130 00")).toBe("DE89 … 3000");
    expect(maskRecipient("Erika Mustermann")).toBe("Erika M.");
  });

  it("CommandPreview shows the command, risk, timeout and that it runs once", () => {
    render(
      <CommandPreview
        command="systemctl restart nginx"
        argv={["systemctl", "restart", "nginx"]}
        server="web-1"
        host="deploy@203.0.113.7"
        risk="critical"
        timeout={60}
        stateBefore="● nginx.service - failed"
      />,
    );
    expect(screen.getByText("systemctl restart nginx")).toBeTruthy();
    expect(screen.getByText("Critical")).toBeTruthy();
    expect(screen.getByText("60 s")).toBeTruthy();
    expect(screen.getByText("Runs once after A, never again on its own.")).toBeTruthy();
  });

  it("MessagePreview shows the window, the conversation and the exact text", () => {
    render(
      <MessagePreview
        channel="WhatsApp"
        recipient="Erika M. (…5678)"
        window={{ state: "closed" }}
        context={[{ from: "in", text: "Where is my order?" }]}
        text="It ships today."
      />,
    );
    expect(screen.getByText("Closed")).toBeTruthy();
    expect(screen.getByText("Where is my order?")).toBeTruthy();
    expect(screen.getByText("It ships today.")).toBeTruthy();
  });

  it("CampaignPreview, DocumentPreview, EventPreview and MoneyPreview", () => {
    render(
      <>
        <CampaignPreview
          contacts={[{ name: "Ida Nolan", phone: "…1234", source: "Website" }]}
          total={41}
          opening="Hi, this is Mara from Northwind."
          budget={{ minutes: 120, amount: 30 }}
        />
        <DocumentPreview title="Budget" cells={[{ cell: "B4", before: "100", after: "120" }]} />
        <EventPreview
          title="Kick-off"
          start="2026-04-16T09:00:00"
          end="2026-04-16T10:00:00"
          guests={[{ email: "ida@example.com", status: "declined" }]}
          conflicts={[{ title: "Standup", start: "2026-04-16T09:30:00" }]}
        />
        <MoneyPreview
          amount={-120}
          bookings={[
            { id: 1, text: "Hosting", amount: -100 },
            { id: 2, text: "VAT", amount: -20 },
          ]}
        />
      </>,
    );
    expect(screen.getByText("and 40 more")).toBeTruthy();
    expect(document.body.textContent).toMatch(/120 min · €30(\.00)?/);
    expect(screen.getByText("Cell")).toBeTruthy();
    expect(screen.getByText("Declined")).toBeTruthy();
    expect(screen.getByText("Standup")).toBeTruthy();
    expect(screen.getAllByText("-€120.00")).toHaveLength(2);
    expect(screen.getByText("Needs a fresh passkey")).toBeTruthy();
  });
});

describe("infrastructure", () => {
  it("CommandWhitelist shows risk and approval per command", () => {
    render(
      <CommandWhitelist
        servers={[
          {
            id: "web",
            name: "web-1",
            commands: [
              {
                id: "s",
                template: "systemctl status {service}",
                risk: "read",
                params: [{ name: "service", values: ["nginx"] }],
              },
              { id: "r", template: "systemctl restart {service}", risk: "critical" },
            ],
          },
        ]}
        blocked={["rm -rf *"]}
      />,
    );
    expect(screen.getByText("Runs without approval")).toBeTruthy();
    expect(screen.getByText("Needs approval")).toBeTruthy();
    expect(screen.getByText("Always blocked")).toBeTruthy();
  });

  it("DomainHeader works out the days left and DomainList links", () => {
    const open = vi.fn();
    render(
      <>
        <DomainHeader
          name="example.com"
          expires="2026-05-01T00:00:00Z"
          now="2026-04-26T00:00:00Z"
          ssl={{ status: "ok", label: "Valid" }}
          mail={{ spf: { status: "ok" }, dmarc: { status: "danger", label: "Missing" } }}
          onOpenCheck={open}
        />
        <DomainList items={[{ name: "example.org", days: 40, href: "/domains/example.org" }]} />
      </>,
    );
    expect(screen.getByText("5 days left")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /DMARC/ }));
    expect(open).toHaveBeenCalledWith("dmarc");
    expect(screen.getByRole("link", { name: /example.org/ }).getAttribute("href")).toBe(
      "/domains/example.org",
    );
  });
});

describe("German through messages", () => {
  it("no English default leaks", () => {
    const { container } = render(
      <UIProvider
        scope="subtree"
        locale="de-DE"
        messages={{
          needsPasskey: "Braucht deinen Passkey",
          approveAsShown: "Ja, so ausführen",
          needsFreshPasskey: "Braucht einen frischen Passkey",
          amountLabel: "Betrag",
          runsOnceAfterA: "Läuft einmal nach A.",
          commandLabel: "Befehl",
          serverLabel: "Server",
          daysLeft: (_n, f) => `noch ${f} Tage`,
          expiresLabel: "Läuft ab",
        }}
      >
        <ApprovalCard title="Erstattung" stepUp />
        <MoneyPreview amount={1234.5} />
        <CommandPreview command="uptime" server="web-1" />
        <DomainHeader name="example.de" days={12} />
      </UIProvider>,
    );
    const text = container.textContent || "";
    for (const de of [
      "Braucht deinen Passkey",
      "Ja, so ausführen",
      "Braucht einen frischen Passkey",
      "1.234,50\u00a0€",
      "Läuft einmal nach A.",
      "noch 12 Tage",
    ])
      expect(text).toContain(de);
    for (const en of [
      "Needs your passkey",
      "Yes, run it as shown",
      "Needs a fresh passkey",
      "days left",
      "Runs once",
    ])
      expect(text).not.toContain(en);
  });
});
