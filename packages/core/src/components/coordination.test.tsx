// @vitest-environment jsdom
import * as React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { UIProvider } from "../provider.js";
import {
  AgentNetwork,
  CoordinationTicker,
  handoffPath,
  layoutAgentNetwork,
  type AgentNetworkNode,
} from "./index.js";

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
});
afterEach(cleanup);

const ROOT: AgentNetworkNode = {
  id: "brain",
  name: "Orchestrator",
  status: "running",
  children: [
    {
      id: "shop",
      name: "Shop lead",
      project: "Shop",
      status: "signal",
      approvals: 2,
      href: "/agents/shop",
      children: [
        { id: "ads", name: "Ads", project: "Shop", status: "idle" },
        { id: "support", name: "Support", project: "Shop", status: "running" },
      ],
    },
    {
      id: "app",
      name: "App lead",
      project: "App",
      children: [{ id: "release", name: "Release", project: "App", status: "danger" }],
    },
  ],
};

describe("layoutAgentNetwork", () => {
  it("centres parents over their children", () => {
    const { nodes } = layoutAgentNetwork(ROOT);
    const ads = nodes.get("ads")!;
    const support = nodes.get("support")!;
    const shop = nodes.get("shop")!;
    expect(shop.x).toBe((ads.x + support.x) / 2);
    expect(nodes.get("brain")!.depth).toBe(0);
    expect(nodes.get("release")!.depth).toBe(2);
  });
  it("routes a handoff up to the shared lead and down again", () => {
    const { nodes } = layoutAgentNetwork(ROOT);
    const pts = handoffPath(nodes, "ads", "release");
    expect(pts.length).toBeGreaterThan(8);
    expect(handoffPath(nodes, "ads", "nobody")).toEqual([]);
  });
});

describe("AgentNetwork", () => {
  it("lists every agent with status and approvals, and opens the details", () => {
    render(<AgentNetwork root={ROOT} layout="graph" />);
    const shop = screen.getByRole("button", {
      name: /^Shop lead\s*Shop\s*, Waiting for approval, 2 approvals waiting$/,
    });
    fireEvent.click(shop);
    expect(shop.getAttribute("aria-pressed")).toBe("true");
    const details = screen.getByRole("region", { name: "Shop lead" });
    expect(details.querySelector("a")!.getAttribute("href")).toBe("/agents/shop");
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("region", { name: "Shop lead" })).toBeNull();
  });

  it("is a list on narrow screens and speaks German", () => {
    render(
      <UIProvider
        scope="subtree"
        locale="de-DE"
        messages={{
          agentNetwork: "Agenten-Netz",
          agentNetworkStatus: { signal: "Wartet auf Freigabe", running: "Arbeitet" },
          approvalsWaiting: (n) => `${n} Freigaben offen`,
        }}
      >
        <AgentNetwork root={ROOT} layout="list" />
      </UIProvider>,
    );
    expect(screen.getByRole("group", { name: "Agenten-Netz" })).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: /Shop lead.*Wartet auf Freigabe, 2 Freigaben offen/,
      }),
    ).toBeTruthy();
    expect(screen.queryByText(/approvals waiting|Waiting for approval/)).toBeNull();
  });

  it("marks the receiver of a handoff when motion is off", () => {
    const { rerender, container } = render(
      <UIProvider scope="subtree" motion="off">
        <AgentNetwork root={ROOT} layout="graph" handoffs={[]} />
      </UIProvider>,
    );
    act(() => {
      rerender(
        <UIProvider scope="subtree" motion="off">
          <AgentNetwork
            root={ROOT}
            layout="graph"
            handoffs={[{ id: "h1", from: "brain", to: "support", label: "Refund" }]}
          />
        </UIProvider>,
      );
    });
    expect(container.querySelector(".tf-agentnet-node.received")!.textContent).toContain("Support");
    expect(container.querySelector(".tf-agentnet-packet")).toBeNull();
  });
});

describe("CoordinationTicker", () => {
  const now = "2026-04-16T12:00:00Z";
  it("shows the route, text, time and link of each line", () => {
    render(
      <CoordinationTicker
        now={now}
        items={[
          {
            id: "1",
            kind: "handoff",
            from: "Orchestrator",
            to: "Shop lead",
            text: "Check the refund",
            time: "2026-04-16T11:58:00Z",
            href: "/runs/1",
          },
          { id: "2", kind: "approval", text: "Refund €40 waits", time: "2026-04-16T11:00:00Z" },
        ]}
      />,
    );
    const log = screen.getByRole("log", { name: "Coordination" });
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(log.querySelector("ol")).toBeTruthy();
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/runs/1");
    expect(link.textContent).toContain("Orchestrator");
    expect(link.textContent).toContain("Shop lead: Check the refund");
  });
  it("says when nothing happens", () => {
    render(
      <UIProvider scope="subtree" messages={{ noActivity: "Gerade ist nichts los" }}>
        <CoordinationTicker items={[]} />
      </UIProvider>,
    );
    expect(screen.getByText("Gerade ist nichts los")).toBeTruthy();
  });
});
