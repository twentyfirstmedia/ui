import type { CalendarDef, CalendarEvent } from "@twentyfirstmedia/ui-core";

/** Shared example data for the calendar previews: the week of Monday, April 13 2026. */
export const NOW = new Date(2026, 3, 16, 10, 40);
const at = (day: number, h: number, m = 0) => new Date(2026, 3, day, h, m);

export const CALENDARS: CalendarDef[] = [
  { id: "work", label: "Work", tint: "sky" },
  { id: "team", label: "Team", tint: "mint" },
  { id: "personal", label: "Personal", tint: "lilac" },
  { id: "holidays", label: "Public holidays", tint: "butter", readOnly: true },
];

export const EVENTS: CalendarEvent[] = [
  { id: "s1", title: "Standup", start: at(13, 9), end: at(13, 9, 30), calendar: "team" },
  { id: "s2", title: "Standup", start: at(14, 9), end: at(14, 9, 30), calendar: "team" },
  { id: "s3", title: "Standup", start: at(15, 9), end: at(15, 9, 30), calendar: "team" },
  { id: "s4", title: "Standup", start: at(16, 9), end: at(16, 9, 30), calendar: "team" },
  { id: "s5", title: "Standup", start: at(17, 9), end: at(17, 9, 30), calendar: "team" },
  {
    id: "panel",
    title: "Hiring panel",
    start: at(13, 13),
    end: at(13, 14, 30),
    calendar: "work",
    location: "Room 2",
  },
  {
    id: "sync",
    title: "Team sync",
    start: at(14, 10, 30),
    end: at(14, 12),
    calendar: "team",
    location: "Video call",
  },
  {
    id: "partner",
    title: "Partner call",
    start: at(14, 15),
    end: at(14, 16),
    calendar: "work",
    rsvp: "tentative",
  },
  {
    id: "review",
    title: "Design review",
    start: at(15, 14),
    end: at(15, 15, 30),
    calendar: "work",
    location: "Billing flow, room 4",
    description: "Walk through the new billing settings before they ship.",
    rsvp: "accepted",
    guests: [
      { name: "Mara Ellis", email: "mara@example.com", status: "accepted", organizer: true },
      { name: "Jonah Petit", email: "jonah@example.com", status: "accepted" },
      { name: "Sun Lee", email: "sun@example.com", status: "tentative" },
      { name: "Ida Nolan", email: "ida@example.com", status: "declined" },
      { name: "Rui Costa", email: "rui@example.com" },
    ],
  },
  {
    id: "pricing",
    title: "Pricing review",
    start: at(16, 11),
    end: at(16, 12, 30),
    calendar: "work",
    location: "Room 1",
    rsvp: "open",
    guests: [
      { name: "Lena Hart", status: "accepted", organizer: true },
      { name: "Mara Ellis", status: "open" },
    ],
  },
  {
    id: "lunch",
    title: "Lunch with Ava",
    start: at(16, 12),
    end: at(16, 13),
    calendar: "personal",
  },
  {
    id: "retro",
    title: "Incident retro",
    start: at(16, 16),
    end: at(16, 17),
    calendar: "team",
    location: "Webhooks #88",
  },
  {
    id: "invoices",
    title: "Q2 invoices due",
    start: at(17, 0),
    end: at(18, 0),
    allDay: true,
    calendar: "work",
  },
  {
    id: "holiday",
    title: "Spring holiday",
    start: at(20, 0),
    end: at(21, 0),
    allDay: true,
    calendar: "holidays",
  },
  { id: "gym", title: "Climbing", start: at(17, 18), end: at(17, 19, 30), calendar: "personal" },
  {
    id: "offsite",
    title: "Team offsite",
    start: at(22, 0),
    end: at(24, 0),
    allDay: true,
    calendar: "team",
  },
  { id: "board", title: "Board prep", start: at(23, 10), end: at(23, 11), calendar: "work" },
  {
    id: "dentist",
    title: "Dentist",
    start: at(27, 8, 30),
    end: at(27, 9, 15),
    calendar: "personal",
  },
  { id: "launch", title: "Launch review", start: at(29, 14), end: at(29, 15), calendar: "work" },
];
