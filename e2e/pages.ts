import { readFileSync } from "node:fs";

interface Example {
  name: string;
  group: string;
}
const examples = JSON.parse(
  readFileSync(new URL("../examples/previews/src/previews.json", import.meta.url), "utf8"),
) as Example[];

export const KITS = ["halo", "pro"] as const;
export const THEMES = ["light", "dark"] as const;
export const WIDTHS = [390, 1440] as const;

/** Every page that shows a live preview, as path below /<kit>/. */
export const previewPages: string[] = [
  ...examples.filter((e) => e.group !== "Pages").map((e) => `components/${e.name}`),
  ...examples.filter((e) => e.group === "Pages").map((e) => `patterns/${e.name}`),
  "patterns/real-estate",
];

export const guidePages = [
  "",
  "installation",
  "cli",
  "theming",
  "status-and-approvals",
  "changelog",
  "components",
];
