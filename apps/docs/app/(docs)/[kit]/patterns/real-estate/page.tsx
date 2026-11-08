import { PageHead } from "@/components/docs";
import { ExampleView } from "@/components/example-view";
import type { Metadata } from "next";
import { examples, type KitName } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

const LEAD =
  "A listing search page: results toolbar with bulk actions, listings as cards or rows, a map with price pins, valuation, energy class and the photo gallery.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kit: KitName }>;
}): Promise<Metadata> {
  const { kit } = await params;
  return pageMeta({ kit, path: "patterns/real-estate", title: "Real estate", description: LEAD });
}

/** Listing search: results toolbar, listings as cards and rows, map with price pins, valuation and energy class. */
export default async function RealEstate({ params }: { params: Promise<{ kit: KitName }> }) {
  const { kit } = await params;
  const parts = ["ListingCard", "MapView", "ValuationCard", "Gallery"]
    .map((n) => examples.find((e) => e.name === n))
    .filter((e): e is NonNullable<typeof e> => !!e);
  return (
    <div className="docs-pattern">
      <PageHead kit={kit} path="patterns/real-estate" title="Real estate" lead={LEAD} />
      {parts.map((ex) => (
        <ExampleView key={ex.name} name={ex.name} code={ex.code} />
      ))}
    </div>
  );
}
