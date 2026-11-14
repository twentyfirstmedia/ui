// @vitest-environment jsdom
/** Connectors: service marks, the gallery, connection list, sync status and agent activity. */
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { formatRelative } from "../format.js";
import {
  AgentActivity,
  ConnectionList,
  ConnectorGallery,
  ServiceMark,
  SyncStatus,
} from "./connectors.js";

afterEach(cleanup);
const now = new Date(2026, 10, 14, 9, 30);
const ago = (m: number) => new Date(now.getTime() - m * 60000);

describe("formatRelative", () => {
  it("picks the largest unit and says now, yesterday and in", () => {
    expect(formatRelative(ago(0.2), now)).toBe("now");
    expect(formatRelative(ago(6), now)).toBe("6 minutes ago");
    expect(formatRelative(ago(-60), now)).toBe("in 1 hour");
    expect(formatRelative(ago(26 * 60), now)).toBe("yesterday");
    expect(formatRelative(ago(-60), now, "de-DE")).toBe("in 1 Stunde");
  });
});

describe("connector components", () => {
  it("ServiceMark falls back to a monogram and names its state", () => {
    render(
      <>
        <ServiceMark name="Apple Health" status="error" />
        <ServiceMark name="Hole19" monogram="19" decorative />
      </>,
    );
    const mark = screen.getByRole("img", { name: "Apple Health, Needs attention" });
    expect(mark.textContent).toBe("AH");
    expect(screen.getByText("19").closest(".tf-svc")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("ConnectorGallery groups, filters and connects", () => {
    const connect = vi.fn();
    const open = vi.fn();
    render(
      <ConnectorGallery
        onConnect={connect}
        onOpen={open}
        categories={["Money", "Home"]}
        connectors={[
          { id: "tado", name: "tado°", category: "Home", state: "connected" },
          { id: "n26", name: "N26", category: "Money", state: "error" },
          { id: "wise", name: "Wise", category: "Money" },
          { id: "fit", name: "Google Fit", category: "Health", state: "soon" },
        ]}
      />,
    );
    const groups = screen.getAllByRole("region").map((r) => r.getAttribute("aria-label"));
    expect(groups).toEqual(["Money", "Home", "Health"]);
    fireEvent.click(screen.getByRole("button", { name: "Connect Wise" }));
    expect(connect).toHaveBeenCalledWith("wise");
    fireEvent.click(screen.getByRole("button", { name: "Reconnect N26" }));
    fireEvent.click(screen.getByRole("button", { name: "Open tado°" }));
    expect(open.mock.calls).toEqual([["n26"], ["tado"]]);
    expect(screen.getByText("Coming soon")).toBeTruthy();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "zz" } });
    expect(screen.getByText("No connector matches “zz”")).toBeTruthy();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Home" }));
    expect(screen.getAllByRole("region").map((r) => r.getAttribute("aria-label"))).toEqual([
      "Home",
    ]);
  });

  it("ConnectionList offers Reconnect for failing connections", () => {
    const manage = vi.fn();
    const reconnect = vi.fn();
    render(
      <ConnectionList
        now={now}
        onManage={manage}
        onReconnect={reconnect}
        items={[
          {
            id: "g",
            name: "Gmail",
            state: "connected",
            sync: { state: "synced", last: ago(6) },
          },
          { id: "n", name: "N26", state: "error", sync: { state: "error", last: ago(90) } },
        ]}
      />,
    );
    const list = screen.getByRole("list", { name: "Connections" });
    expect(within(list).getByText("Synced 6 minutes ago")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Manage Gmail" }));
    fireEvent.click(screen.getByRole("button", { name: "Reconnect N26" }));
    expect(manage).toHaveBeenCalledWith("g");
    expect(reconnect).toHaveBeenCalledWith("n");
  });

  it("SyncStatus says when, what and next", () => {
    const sync = vi.fn();
    render(
      <SyncStatus
        state="synced"
        now={now}
        last={ago(6)}
        next={ago(-54)}
        counts={[{ label: "emails", value: 1204 }]}
        onSync={sync}
      />,
    );
    expect(screen.getByText("Synced 6 minutes ago")).toBeTruthy();
    expect(screen.getByText("Next in 54 minutes")).toBeTruthy();
    expect(screen.getByText("1,204")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Sync now/ }));
    expect(sync).toHaveBeenCalled();
  });

  it("AgentActivity groups by day and offers Review and Undo", () => {
    const undo = vi.fn();
    const review = vi.fn();
    render(
      <AgentActivity
        now={now}
        onUndo={undo}
        onReview={review}
        items={[
          { id: "a", text: "Read mail", at: ago(60), kind: "read" },
          { id: "b", text: "Cancel music", at: ago(10), kind: "money", state: "waiting" },
          { id: "c", text: "Heating down", at: ago(26 * 60), kind: "act" },
        ]}
      />,
    );
    const days = screen.getAllByRole("region").map((r) => r.getAttribute("aria-label"));
    expect(days).toEqual(["Today", "Yesterday"]);
    expect(screen.getByText("Waiting for you")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Review" }));
    expect(review).toHaveBeenCalledWith("b");
    const undos = screen.getAllByRole("button", { name: /Undo/ });
    expect(undos).toHaveLength(1);
    fireEvent.click(undos[0]!);
    expect(undo).toHaveBeenCalledWith("c");
  });
});
