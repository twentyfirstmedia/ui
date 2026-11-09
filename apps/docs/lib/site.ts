import examplesJson from "../generated/examples.json";
import propsJson from "../generated/props.json";
import readmesJson from "../generated/readmes.json";
import exportsJson from "../generated/exports.json";
import knowledgeJson from "../generated/knowledge.json";
import type { Guide, Knowledge } from "../../../packages/cli/src/knowledge.ts";

export type KitName = "halo" | "pro";
export const KITS: KitName[] = ["halo", "pro"];
export const KIT_LABEL: Record<KitName, string> = { halo: "Halo", pro: "Pro" };

export interface Example {
  name: string;
  group: string;
  width: number;
  height: number;
  components: string[];
  code: string;
}
export interface Prop {
  name: string;
  type: string;
  optional: boolean;
  doc: string;
}

export const examples = examplesJson as Example[];
export const props = propsJson as Record<string, Prop[]>;
export const readmes = readmesJson as Record<string, string>;
export const componentFiles = exportsJson as Record<string, string[]>;
export const knowledge = knowledgeJson as unknown as Knowledge;
export const guide = (slug: string): Guide => {
  const g = knowledge.guides.find((x) => x.slug === slug);
  if (!g) throw new Error(`No guide ${slug}`);
  return g;
};

export const GITHUB = "https://github.com/twentyfirstmedia/ui";
export const SITE_URL = process.env.DOCS_SITE_URL ?? "https://ui.twentyfirst.media";
export const SITE_NAME = "Twentyfirst UI";
export const BASE_PATH = process.env.DOCS_BASE_PATH ?? "";

/** Component groups in sidebar order; "Pages" become the patterns section. */
export const GROUP_ORDER = [
  "Foundations",
  "Navigation",
  "Forms",
  "Data",
  "Charts",
  "Overlays",
  "AI",
  "Commerce",
  "Admin",
  "Real estate",
  "Media",
];

export const components = examples.filter((e) => e.group !== "Pages");
export const patterns = examples.filter((e) => e.group === "Pages");

export interface NavLink {
  href: string;
  label: string;
}
export interface NavSection {
  title: string;
  links: NavLink[];
}

export const GUIDES: NavLink[] = [
  { href: "", label: "Introduction" },
  { href: "installation", label: "Installation" },
  { href: "cli", label: "CLI" },
  { href: "theming", label: "Theming and tokens" },
  { href: "themes", label: "Theme builder" },
  { href: "motion", label: "Motion" },
  { href: "text", label: "Text and locale" },
  { href: "ai", label: "AI agents and MCP" },
  { href: "html", label: "Plain HTML and frameworks" },
  { href: "status-and-approvals", label: "Status and approvals" },
  { href: "changelog", label: "Changelog" },
];

export function humanize(name: string): string {
  return name
    .replace(/Screen$/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
}

export function nav(): NavSection[] {
  const sections: NavSection[] = [{ title: "Get started", links: GUIDES }];
  for (const g of GROUP_ORDER) {
    const items = components.filter((c) => c.group === g);
    if (items.length)
      sections.push({
        title: g,
        links: items.map((c) => ({ href: `components/${c.name}`, label: humanize(c.name) })),
      });
  }
  sections.push({
    title: "Patterns",
    links: [
      ...patterns.map((p) => ({ href: `patterns/${p.name}`, label: humanize(p.name) })),
      { href: "patterns/real-estate", label: "Real estate" },
    ],
  });
  sections.push({
    title: "Reference",
    links: [
      { href: "components", label: "All components" },
      { href: "patterns", label: "All patterns" },
    ],
  });
  return sections;
}

export function canonical(kit: KitName, path: string): string {
  return `${SITE_URL}${BASE_PATH}/${kit}/${path ? `${path}/` : ""}`;
}

export { forKit, mdPath, plain } from "../../../packages/cli/src/knowledge.ts";
