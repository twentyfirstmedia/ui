import {
  AvatarStack,
  Badge,
  Card,
  CodeBlock,
  Progress,
  StatTile,
  StatusIndicator,
  TintIcon,
  type IconName,
  type Tint,
} from "@twentyfirstmedia/ui-core";
import type { Metadata } from "next";
import Link from "next/link";
import { Code } from "@/components/docs";
import { PageActions } from "@/components/page-actions";
import { KIT_LABEL, components, guide, knowledge, patterns, type KitName } from "@/lib/site";
import { JsonLd, pageJsonLd, pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kit: KitName }>;
}): Promise<Metadata> {
  const { kit } = await params;
  const meta = pageMeta({
    kit,
    path: "",
    title: KIT_LABEL[kit],
    description: `${KIT_LABEL[kit]}: ${knowledge.kits.find((k) => k.name === kit)?.tagline ?? ""} React components, tokens and complete screens; same API as ${KIT_LABEL[kit === "halo" ? "pro" : "halo"]}.`,
  });
  // the kit home is the root of its title template
  return { ...meta, title: { absolute: `${KIT_LABEL[kit]}: React UI kit · Twentyfirst UI` } };
}

const FEATURES: { icon: IconName; tint: Tint; title: string; text: string }[] = [
  {
    icon: "layers",
    tint: "sky",
    title: "One API, two looks",
    text: "Halo and Pro share every component, prop and piece of markup. Only tokens and CSS differ, so an app can switch at runtime.",
  },
  {
    icon: "phone",
    tint: "mint",
    title: "Mobile first",
    text: "Every component works from a 320px screen up: shells collapse, tables scroll, dialogs become sheets and inputs never zoom.",
  },
  {
    icon: "globe",
    tint: "butter",
    title: "Ready-made states",
    text: "Empty, loading, error and approval states come with the components, so screens look finished from the first render.",
  },
  {
    icon: "check",
    tint: "lilac",
    title: "Accessible",
    text: "Keyboard paths, focus rings and ARIA follow the reference; axe runs on every preview of both kits, light and dark.",
  },
  {
    icon: "settings",
    tint: "blush",
    title: "Tokens only",
    text: "No colour literals in component CSS. Tokens come from one file per kit and feed CSS variables and a Tailwind v4 preset.",
  },
  {
    icon: "lock",
    tint: "sky",
    title: "Private by default",
    text: "Fonts are self-hosted, nothing phones home and components make no requests of their own.",
  },
];

export default async function Intro({ params }: { params: Promise<{ kit: KitName }> }) {
  const { kit } = await params;
  const other = kit === "halo" ? "pro" : "halo";
  const explore = [
    {
      href: "installation/",
      icon: "download" as IconName,
      title: "Installation",
      text: "Package, styles, provider and the GitHub registry.",
    },
    { href: "cli/", icon: "code" as IconName, title: "CLI", text: "init, add, list and diff." },
    {
      href: "theming/",
      icon: "settings" as IconName,
      title: "Theming and tokens",
      text: "Light, dark, density, and every token side by side.",
    },
    {
      href: "components/",
      icon: "layers" as IconName,
      title: `${components.length} component groups`,
      text: "Live examples, code and props.",
    },
    {
      href: "ai/",
      icon: "bot" as IconName,
      title: "AI agents and MCP",
      text: "MCP server, llms.txt and Markdown for every page.",
    },
    {
      href: "patterns/",
      icon: "grid" as IconName,
      title: `${patterns.length + 1} patterns`,
      text: "Complete screens built only from kit parts.",
    },
    {
      href: "status-and-approvals/",
      icon: "check" as IconName,
      title: "Status and approvals",
      text: "Status shapes, approval cards and the inbox.",
    },
  ];
  return (
    <>
      <JsonLd data={pageJsonLd(kit, "", KIT_LABEL[kit], guide("introduction").description)} />
      <section className="docs-hero" aria-labelledby="docs-title">
        <p className="docs-eyebrow">Twentyfirst UI · {KIT_LABEL[kit]}</p>
        <h1 id="docs-title">
          {kit === "halo" ? "Soft, calm interfaces." : "Sharp, dense interfaces."}
        </h1>
        <p className="docs-lead">
          {kit === "halo"
            ? "Halo is soft, rounded and light-first: big white cards on a warm canvas, five pastel tints that carry meaning and ink as the only accent."
            : "Pro is sharp, dense and dark-first: monochrome cells on a visible hairline grid, square corners, Geist, and colour only for state."}{" "}
          Same components as {KIT_LABEL[other]}, switchable at runtime.
        </p>
        <div className="docs-hero-actions">
          <Link className="tf-btn tf-btn-primary" href={`/${kit}/installation/`}>
            Get started
          </Link>
          <Link className="tf-btn tf-btn-secondary" href={`/${kit}/components/`}>
            Browse components
          </Link>
          <Link className="tf-btn tf-btn-ghost" href={`/${other}/`}>
            See {KIT_LABEL[other]}
          </Link>
        </div>
        <div className="docs-install">
          <CodeBlock lang="sh" code={`npx @twentyfirstmedia/ui init --kit ${kit}`} />
        </div>
        <PageActions />
      </section>

      <div className="docs-showcase" aria-label="Sample components">
        <Card
          title="Quarterly onboarding"
          description="Welcome flow for new workspace admins."
          meta={["Mara Ellis", "12 steps"]}
          corner={<TintIcon icon="book" tint="mint" />}
          status={<Badge tone="success">Live</Badge>}
        />
        <div className="tf-grid" style={{ gap: 12, gridTemplateColumns: "1fr 1fr" }}>
          <StatTile tint="sky" value="18" label="Projects" />
          <StatTile tint="butter" value="€48k" label="Revenue" />
        </div>
        <div className="tf-panel" style={{ gap: 16 }}>
          <div className="tf-row" style={{ justifyContent: "space-between" }}>
            <StatusIndicator status="signal" label="Waiting for approval" />
            <AvatarStack names={["Mara Ellis", "Jonah Petit", "Sun Lee"]} size={28} />
          </div>
          <Progress value={64} label="Launch checklist" />
        </div>
      </div>

      <h2>Why these kits</h2>
      <ul className="docs-features">
        {FEATURES.map((f) => (
          <li key={f.title}>
            <TintIcon icon={f.icon} tint={f.tint} />
            <div>
              <b>{f.title}</b>
              <p>{f.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <h2>Explore</h2>
      <div className="docs-cards">
        {explore.map((e) => (
          <Link key={e.href} className="docs-card" href={`/${kit}/${e.href}`}>
            <TintIcon icon={e.icon} />
            <span className="docs-card-text">
              <b>{e.title}</b>
              <small>{e.text}</small>
            </span>
          </Link>
        ))}
      </div>
      <p className="docs-lead">
        Every page of these docs exists for both kits: the Halo/Pro switch in the header shows the
        same page in the other look. Load both and switch with <Code>data-kit</Code>.
      </p>
    </>
  );
}
