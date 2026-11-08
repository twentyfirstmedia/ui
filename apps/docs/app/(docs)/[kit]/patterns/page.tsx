import { TintIcon, type IconName, type Tint } from "@twentyfirstmedia/ui-core";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/docs";
import { knowledge, type KitName } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

const LEAD = `${knowledge.patterns.length} complete screens built only from kit components: dashboards, chat, agents, commerce, admin and real estate. Each comes with its full code.`;
const TINTS: Tint[] = ["sky", "mint", "butter", "lilac", "blush"];
const icon = (name: string): IconName =>
  /Chat|Agent|Memory|Inbox|Approval/.test(name)
    ? "bot"
    : /Shop|Product|Checkout|Cart|Order/.test(name)
      ? "cart"
      : /Analytics|Dashboard|Report/.test(name)
        ? "chart"
        : /Settings|Admin|Billing|Team|Integrations/.test(name)
          ? "settings"
          : /estate|Listing/.test(name)
            ? "home"
            : "grid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kit: KitName }>;
}): Promise<Metadata> {
  const { kit } = await params;
  return pageMeta({ kit, path: "patterns", title: "Patterns", description: LEAD });
}

export default async function Patterns({ params }: { params: Promise<{ kit: KitName }> }) {
  const { kit } = await params;
  return (
    <>
      <PageHead kit={kit} path="patterns" title="Patterns" lead={LEAD} />
      <div className="docs-cards">
        {knowledge.patterns.map((p, i) => (
          <Link key={p.name} className="docs-card" href={`/${kit}/${p.path}/`}>
            <TintIcon icon={icon(p.name)} tint={TINTS[i % TINTS.length]} />
            <span className="docs-card-text">
              <b>{p.title}</b>
              <small>{p.summary}</small>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
