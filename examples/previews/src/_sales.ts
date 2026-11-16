import type {
  BookingDay,
  ForecastRow,
  GanttTask,
  QuoteLine,
  SequenceStep,
  TimesheetRow,
} from "@twentyfirstmedia/ui-core";

/** Shared data of the sales and agency examples. */
export const LINES: QuoteLine[] = [
  {
    id: "1",
    name: "Discovery and concept",
    description: "Two workshops, sitemap, content plan",
    quantity: 1,
    unitPrice: 6400,
  },
  {
    id: "2",
    name: "Design",
    description: "Design system and 12 page templates",
    quantity: 64,
    unit: "h",
    unitPrice: 120,
  },
  {
    id: "3",
    name: "Development",
    description: "Next.js, CMS, shop integration",
    quantity: 140,
    unit: "h",
    unitPrice: 115,
    discount: 10,
  },
  {
    id: "4",
    name: "Care plan",
    description: "Updates, monitoring, 4 h support",
    quantity: 12,
    unit: "month",
    unitPrice: 390,
    optional: true,
    selected: true,
  },
  {
    id: "5",
    name: "Photo shoot",
    description: "One day, 40 edited pictures",
    quantity: 1,
    unitPrice: 2800,
    optional: true,
  },
];

export const STEPS: SequenceStep[] = [
  {
    id: "1",
    day: 1,
    type: "email",
    title: "Intro: your shop after the season",
    detail: "Personalised first line",
    stats: { sent: 240, opened: 132, replied: 19 },
  },
  {
    id: "2",
    day: 1,
    type: "linkedin",
    title: "Connect with a short note",
    stats: { sent: 212, replied: 11 },
  },
  {
    id: "3",
    day: 3,
    type: "call",
    title: "First call",
    detail: "Script: three questions on returns",
  },
  { id: "4", day: 5, type: "wait", title: "Wait two days" },
  {
    id: "5",
    day: 7,
    type: "email",
    title: "Case study: Velo Werk +38% conversion",
    stats: { sent: 198, opened: 101, replied: 14 },
  },
  { id: "6", day: 10, type: "task", title: "Check their new collection, then decide" },
];

export const REPS: ForecastRow[] = [
  {
    id: "1",
    name: "Mara Ellis",
    avatar: true,
    quota: 120000,
    won: 101000,
    commit: 22000,
    bestCase: 18000,
  },
  {
    id: "2",
    name: "Jonas Pick",
    avatar: true,
    quota: 100000,
    won: 64000,
    commit: 18000,
    bestCase: 30000,
  },
  {
    id: "3",
    name: "Lea Brandt",
    avatar: true,
    quota: 80000,
    won: 86500,
    commit: 6000,
    bestCase: 4000,
  },
];

export const DAYS: BookingDay[] = [
  { date: new Date(2026, 10, 17), slots: ["09:00", "09:30", "11:00", "14:30", "15:00"] },
  { date: new Date(2026, 10, 18), slots: ["10:00", "13:30"] },
  { date: new Date(2026, 10, 19), slots: ["09:00", "10:30", "11:00", "11:30", "16:00", "16:30"] },
  { date: new Date(2026, 10, 20), slots: [] },
  { date: new Date(2026, 10, 23), slots: ["09:30", "10:00", "14:00"] },
];

export const WEEK: TimesheetRow[] = [
  {
    id: "1",
    project: "Nordhafen",
    task: "Website relaunch",
    tint: "sky",
    hours: [4, 5.5, 3, 6, 2, 0, 0],
    billable: true,
  },
  {
    id: "2",
    project: "Velo Werk",
    task: "App redesign",
    tint: "mint",
    hours: [2.5, 1, 3.5, 1, 4, 0, 0],
    billable: true,
  },
  {
    id: "3",
    project: "Kaffeerösterei Elbe",
    task: "Pitch",
    tint: "butter",
    hours: [0, 1, 1.5, 0, 0, 0, 0],
  },
  {
    id: "4",
    project: "Internal",
    task: "Hiring, admin",
    tint: "lilac",
    hours: [1, 0.5, 0, 1, 0.5, 0, 0],
  },
];

export const PLAN: GanttTask[] = [
  {
    id: "1",
    name: "Discovery workshops",
    start: new Date(2026, 10, 2),
    end: new Date(2026, 10, 6),
    progress: 100,
    tint: "lilac",
    owner: "Mara Ellis",
  },
  {
    id: "2",
    name: "Sitemap and content plan",
    start: new Date(2026, 10, 5),
    end: new Date(2026, 10, 11),
    progress: 100,
    tint: "lilac",
    owner: "Lea Brandt",
  },
  {
    id: "3",
    name: "Design system",
    start: new Date(2026, 10, 9),
    end: new Date(2026, 10, 20),
    progress: 70,
    tint: "sky",
    owner: "Lea Brandt",
  },
  { id: "4", name: "Design sign-off", start: new Date(2026, 10, 20), milestone: true },
  {
    id: "5",
    name: "Templates",
    start: new Date(2026, 10, 16),
    end: new Date(2026, 10, 27),
    progress: 25,
    tint: "sky",
    owner: "Lea Brandt",
  },
  {
    id: "6",
    name: "Development",
    start: new Date(2026, 10, 23),
    end: new Date(2026, 11, 11),
    progress: 0,
    tint: "mint",
    owner: "Jonas Pick",
  },
  {
    id: "7",
    name: "Content migration",
    start: new Date(2026, 11, 3),
    end: new Date(2026, 11, 10),
    tint: "butter",
    owner: "Mara Ellis",
  },
  { id: "8", name: "Launch", start: new Date(2026, 11, 14), milestone: true },
];
