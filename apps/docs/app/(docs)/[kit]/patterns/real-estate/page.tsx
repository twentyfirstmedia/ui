import { PageHead } from "@/components/docs";
import { ExampleView } from "@/components/example-view";
import { examples } from "@/lib/site";

export const metadata = { title: "Real estate" };

/** Listing search: results toolbar, listings as cards and rows, map with price pins, valuation and energy class. */
export default function RealEstate() {
  const parts = ["ListingCard", "MapView", "ValuationCard", "Gallery"]
    .map((n) => examples.find((e) => e.name === n))
    .filter((e): e is NonNullable<typeof e> => !!e);
  return (
    <div className="docs-pattern">
      <PageHead
        title="Real estate"
        lead="A listing search page: results toolbar with bulk actions, listings as cards or rows, a map with price pins, valuation, energy class and the photo gallery."
      />
      {parts.map((ex) => (
        <ExampleView key={ex.name} name={ex.name} code={ex.code} width={ex.width} />
      ))}
    </div>
  );
}
