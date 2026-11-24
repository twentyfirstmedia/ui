import { registerIcons } from "@twentyfirstmedia/ui-core";
import type { PipelineStage, RecordEntry, SidebarGroup } from "@twentyfirstmedia/ui-core";
import { building } from "@twentyfirstmedia/ui-core/icons";

// the CRM navigation uses an icon from the library
registerIcons({ building });

/** The navigation of the CRM examples. */
export const CRM_NAV: SidebarGroup[] = [
  {
    items: [
      { id: "home", label: "Home", icon: "home" },
      { id: "inbox", label: "Inbox", icon: "inbox", badge: "4" },
      { id: "tasks", label: "Tasks", icon: "check", badge: "3" },
    ],
  },
  {
    label: "Records",
    items: [
      { id: "people", label: "People", icon: "users" },
      { id: "companies", label: "Companies", icon: "building" },
      { id: "deals", label: "Deals", icon: "handshake" },
      { id: "quotes", label: "Quotes", icon: "file" },
    ],
  },
  {
    label: "Engage",
    items: [
      { id: "sequences", label: "Sequences", icon: "send" },
      { id: "calls", label: "Calls", icon: "phone" },
    ],
  },
  {
    label: "Reports",
    items: [
      { id: "pipeline", label: "Pipeline", icon: "chart" },
      { id: "forecast", label: "Forecast", icon: "trend" },
    ],
  },
];

/** "Now" in the examples, so every page renders the same. */
export const NOW = new Date(2026, 10, 16, 9, 30);
export const at = (day: number, h: number, m: number) => new Date(2026, 10, 16 + day, h, m);

export const STAGES: PipelineStage[] = [
  {
    id: "lead",
    label: "Qualified",
    probability: 10,
    deals: [
      {
        id: "d1",
        title: "Website relaunch",
        company: "Kaffeerösterei Elbe",
        value: 18000,
        daysInStage: 3,
        owner: "Jonas Pick",
        next: "Discovery call",
      },
      {
        id: "d2",
        title: "Brand refresh",
        company: "Lindqvist Studio",
        value: 9500,
        daysInStage: 21,
        owner: "Mara Ellis",
        next: "Follow up",
      },
    ],
  },
  {
    id: "meeting",
    label: "Meeting",
    probability: 30,
    deals: [
      {
        id: "d3",
        title: "Shop migration",
        company: "Nordhafen Outdoor",
        value: 42000,
        daysInStage: 6,
        owner: "Mara Ellis",
        closeDate: new Date(2026, 11, 12),
        next: "Workshop on Thursday",
      },
    ],
  },
  {
    id: "proposal",
    label: "Proposal",
    probability: 60,
    deals: [
      {
        id: "d4",
        title: "Retainer 2027",
        company: "Hansen & Partner",
        value: 64000,
        daysInStage: 9,
        owner: "Jonas Pick",
        closeDate: new Date(2026, 11, 1),
        next: "Send revised proposal",
      },
      {
        id: "d5",
        title: "App redesign",
        company: "Velo Werk",
        value: 28000,
        daysInStage: 16,
        owner: "Lea Brandt",
        closeDate: new Date(2026, 10, 28),
      },
    ],
  },
  {
    id: "negotiation",
    label: "Negotiation",
    probability: 80,
    deals: [
      {
        id: "d6",
        title: "Nordhafen renewal",
        company: "Nordhafen Outdoor",
        value: 36000,
        daysInStage: 4,
        owner: "Mara Ellis",
        closeDate: new Date(2026, 10, 30),
        next: "Contract to legal",
      },
    ],
  },
];

export const ENTRIES: RecordEntry[] = [
  {
    id: "e0",
    type: "note",
    title: "Decision maker is Henrik, Lena prepares",
    body: "Budget approved for Q1. Henrik wants two references from outdoor retail.",
    at: at(-8, 11, 0),
    actor: "Mara Ellis",
    pinned: true,
  },
  {
    id: "e1",
    type: "email",
    title: "Re: Revised proposal for the renewal",
    body: "Thanks Mara, the new payment terms work for us. Legal will have a look this week.",
    at: at(0, 8, 42),
    actor: "Lena Hartmann",
  },
  {
    id: "e2",
    type: "stage",
    title: "Moved from Proposal to Negotiation",
    at: at(-1, 16, 5),
    actor: "Mara Ellis",
  },
  {
    id: "e3",
    type: "call",
    title: "Call about payment terms",
    body: "Agreed on quarterly invoicing. Lena sends the contract to legal by Friday.",
    at: at(-1, 15, 30),
    actor: "Mara Ellis",
    meta: "18 min · Outbound",
  },
  {
    id: "e4",
    type: "document",
    title: "Proposal v2 sent",
    at: at(-3, 10, 12),
    actor: "Mara Ellis",
    meta: "Proposal_Nordhafen_v2.pdf",
  },
  {
    id: "e5",
    type: "meeting",
    title: "Workshop: scope for 2027",
    at: at(-6, 14, 0),
    actor: "Mara Ellis, Jonas Pick",
    meta: "1 h 30 min",
  },
];

/** The navigation of the agency examples. */
export const AGENCY_NAV: SidebarGroup[] = [
  {
    items: [
      { id: "home", label: "Home", icon: "home" },
      { id: "projects", label: "Projects", icon: "folder" },
      { id: "time", label: "Time", icon: "clock" },
    ],
  },
  {
    label: "Clients",
    items: [
      { id: "clients", label: "Clients", icon: "building" },
      { id: "quotes", label: "Quotes", icon: "file" },
      { id: "invoices", label: "Invoices", icon: "card" },
    ],
  },
];
