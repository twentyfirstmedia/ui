import { Badge, Button, StatusIndicator } from "@twentyfirstmedia/ui-core";
import Link from "next/link";
import { Code, PageHead } from "@/components/docs";
import { KIT_LABEL, components, patterns, type KitName } from "@/lib/site";

export default async function Intro({ params }: { params: Promise<{ kit: KitName }> }) {
  const { kit } = await params;
  const other = kit === "halo" ? "pro" : "halo";
  return (
    <>
      <PageHead
        title={`${KIT_LABEL[kit]}`}
        lead={
          kit === "halo"
            ? "Soft, rounded and light-first: big white cards on a warm canvas, five pastel tints that carry meaning and ink as the only accent."
            : "Sharp, dense and dark-first: monochrome cells on a visible hairline grid, square corners, Geist, and colour only for state."
        }
      />
      <div className="docs-chips" style={{ marginBottom: 24 }}>
        <Button variant="primary">Approve</Button>
        <Button variant="secondary">New invoice</Button>
        <Badge tone="success">Live</Badge>
        <Badge tone="highlight">Needs review</Badge>
        <StatusIndicator status="signal" label="Waiting for approval" />
      </div>
      <div className="docs-prose">
        <p>
          Twentyfirst UI is two React kits with one component API. Halo and {KIT_LABEL[other]} share
          every component, prop and piece of markup; only tokens and CSS differ. Use one kit on its
          own, or load both and switch at runtime with <Code>data-kit</Code>. Every page of these
          docs exists for both kits: the switch in the header shows the same page in{" "}
          {KIT_LABEL[other]}.
        </p>
        <p>
          The kits ship no fixed copy. Every visible string goes through the label system and every
          number, amount and date through <Code>Intl</Code>, so the same components work in English
          and German (try the EN/DE switch).
        </p>
      </div>
      <div className="docs-cards">
        <Link className="docs-card" href={`/${kit}/installation/`}>
          <b>Installation</b>
          <small>Package, styles, provider and the GitHub registry.</small>
        </Link>
        <Link className="docs-card" href={`/${kit}/cli/`}>
          <b>CLI</b>
          <small>init, add, list and diff.</small>
        </Link>
        <Link className="docs-card" href={`/${kit}/theming/`}>
          <b>Theming and tokens</b>
          <small>Light, dark, density, and every token side by side.</small>
        </Link>
        <Link className="docs-card" href={`/${kit}/components/`}>
          <b>{components.length} component groups</b>
          <small>Live examples, code and props.</small>
        </Link>
        <Link className="docs-card" href={`/${kit}/patterns/${patterns[0]?.name ?? ""}/`}>
          <b>{patterns.length + 1} patterns</b>
          <small>Complete screens built only from kit parts.</small>
        </Link>
      </div>
    </>
  );
}
