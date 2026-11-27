import type { AgentNetworkNode, CoordinationEvent } from "@twentyfirstmedia/ui-core";

/** One orchestrator, a lead per project and the agents that do the work. */
export const NETWORK: AgentNetworkNode = {
  id: "main",
  name: "Main agent",
  role: "Orchestrator",
  tint: "lilac",
  icon: "sparkle",
  status: "running",
  detail: "Planning the week for three projects.",
  href: "#main",
  children: [
    {
      id: "shop-lead",
      name: "Shop lead",
      project: "Northwind Shop",
      tint: "sky",
      status: "signal",
      approvals: 2,
      detail: "Waits for a refund of €40 and a new ad budget.",
      href: "#shop-lead",
      children: [
        { id: "ads", name: "Ads", project: "Northwind Shop", tint: "sky", status: "idle" },
        {
          id: "support",
          name: "Support",
          project: "Northwind Shop",
          tint: "sky",
          status: "running",
          detail: "Answering 4 customer messages.",
        },
      ],
    },
    {
      id: "app-lead",
      name: "App lead",
      project: "Atlas App",
      tint: "mint",
      status: "running",
      href: "#app-lead",
      children: [
        { id: "release", name: "Release", project: "Atlas App", tint: "mint", status: "danger" },
        { id: "qa", name: "QA", project: "Atlas App", tint: "mint", status: "ok" },
      ],
    },
    {
      id: "office-lead",
      name: "Office lead",
      project: "Back office",
      tint: "butter",
      status: "idle",
      children: [
        {
          id: "books",
          name: "Bookkeeping",
          project: "Back office",
          tint: "butter",
          status: "signal",
          approvals: 1,
        },
      ],
    },
  ],
};

export const TICKER: CoordinationEvent[] = [
  {
    id: "e1",
    kind: "handoff",
    from: "Main agent",
    to: "Shop lead",
    text: "Answer the refund request from order 4417",
    time: "2026-04-16T11:58:30Z",
    href: "#run-e1",
  },
  {
    id: "e2",
    kind: "approval",
    from: "Shop lead",
    text: "Refund €40.00 to the customer waits for approval",
    time: "2026-04-16T11:57:00Z",
    href: "#approval-e2",
  },
  {
    id: "e3",
    kind: "run",
    from: "Support",
    text: "Started a run: 4 open conversations",
    time: "2026-04-16T11:52:00Z",
    href: "#run-e3",
  },
  {
    id: "e4",
    kind: "error",
    from: "Release",
    text: "Build failed on the iOS target",
    time: "2026-04-16T11:40:00Z",
    href: "#run-e4",
  },
  {
    id: "e5",
    kind: "done",
    from: "QA",
    to: "App lead",
    text: "Regression suite passed",
    time: "2026-04-16T11:12:00Z",
  },
];

export const NOW = "2026-04-16T12:00:00Z";
