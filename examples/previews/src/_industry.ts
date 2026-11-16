import type { ConflictHit, Match, SidebarGroup, Viewing } from "@twentyfirstmedia/ui-core";

/** Shared data of the real-estate and law-firm examples. */
export const BROKER_NAV: SidebarGroup[] = [
  {
    items: [
      { id: "home", label: "Home", icon: "home" },
      { id: "listings", label: "Listings", icon: "home" },
      { id: "buyers", label: "Buyers", icon: "users" },
      { id: "viewings", label: "Viewings", icon: "calendar" },
    ],
  },
  {
    label: "Owners",
    items: [
      { id: "owners", label: "Owners", icon: "user" },
      { id: "valuations", label: "Valuations", icon: "chart" },
    ],
  },
];

export const LAW_NAV: SidebarGroup[] = [
  {
    items: [
      { id: "home", label: "Home", icon: "home" },
      { id: "matters", label: "Matters", icon: "folder" },
      { id: "deadlines", label: "Deadlines", icon: "clock" },
      { id: "time", label: "Time", icon: "chart" },
    ],
  },
  {
    label: "Firm",
    items: [
      { id: "clients", label: "Clients", icon: "users" },
      { id: "conflicts", label: "Conflict checks", icon: "shield" },
      { id: "billing", label: "Billing", icon: "card" },
    ],
  },
];

export const BUYERS: Match[] = [
  {
    id: "1",
    name: "Familie Kaya",
    subtitle: "Budget €650,000 · financing confirmed",
    avatar: true,
    score: 94,
    criteria: [
      { label: "Eppendorf or Winterhude", met: true },
      { label: "3+ rooms", met: true },
      { label: "Balcony", met: true },
      { label: "Up to €650,000", met: true },
      { label: "Lift", met: false },
    ],
  },
  {
    id: "2",
    name: "Jonas and Pia Stein",
    subtitle: "Budget €600,000 · first viewing done",
    avatar: true,
    score: 78,
    criteria: [
      { label: "3+ rooms", met: true },
      { label: "Balcony", met: true },
      { label: "Up to €600,000", met: false },
      { label: "Parking", met: false },
    ],
  },
  {
    id: "3",
    name: "Dr. Aylin Weber",
    subtitle: "Capital investor · cash",
    avatar: true,
    score: 61,
    criteria: [
      { label: "Rented or vacant", met: true },
      { label: "Yield over 3%", met: false },
    ],
  },
];

export const VIEWINGS: Viewing[] = [
  {
    id: "1",
    at: new Date(2026, 10, 12, 17, 0),
    name: "Jonas and Pia Stein",
    state: "done",
    attendees: 2,
    feedback: { rating: 4, note: "Love the light, worried about the kitchen." },
  },
  { id: "2", at: new Date(2026, 10, 13, 10, 0), name: "Tom Albers", state: "noshow", attendees: 1 },
  {
    id: "3",
    at: new Date(2026, 10, 14, 11, 30),
    name: "Dr. Aylin Weber",
    state: "done",
    attendees: 1,
  },
  {
    id: "4",
    at: new Date(2026, 10, 18, 17, 30),
    name: "Familie Kaya",
    state: "confirmed",
    attendees: 3,
    subtitle: "Second viewing, with the architect",
  },
  {
    id: "5",
    at: new Date(2026, 10, 19, 18, 0),
    name: "Lisa Brenner",
    state: "requested",
    attendees: 2,
  },
];

export const HITS: ConflictHit[] = [
  {
    id: "1",
    party: "Elbe Logistik GmbH",
    role: "Client until 2024",
    matter: "2023/087 Lease dispute Billbrook",
    level: "possible",
    reason: "Same company register number HRB 118804",
  },
  {
    id: "2",
    party: "Kai Petersen",
    role: "Opposing party",
    matter: "2025/031 Petersen ./. Hartmann",
    level: "possible",
    reason: "Same name; managing director of Elbe Logistik since 2025",
  },
];
