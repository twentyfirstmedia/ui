import * as React from "react";
import { EnergyClass, SavedSearch, ValuationCard } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-grid"
      style={
        {
          "--cols": "1fr 1fr",
          gap: 16,
          alignItems: "start",
        } as React.CSSProperties
      }
    >
      <div className="tf-panel">
        <ValuationCard
          value={612000}
          low={571000}
          high={655000}
          asking={649000}
          perSqm={7286}
          compare="district average €6,940"
          confidence={0.78}
          facts={[
            ["Comparables", "42 sales, last 18 months"],
            ["Method", "Comparable sales"],
            ["As of", "8 Nov 2026"],
          ]}
          note="An estimate, not an appraisal."
        />
      </div>
      <div
        className="tf-col"
        style={{
          gap: 16,
        }}
      >
        <SavedSearch
          name="Eppendorf 3 rooms"
          criteria={[
            "Buy",
            "Hamburg-Eppendorf",
            "€400k–700k",
            "70–110 m²",
            "3+ rooms",
            "Private sellers",
          ]}
          lastRun="06:00"
          frequency="Daily mail"
          newCount={4}
          onToggle={() => {}}
          onEdit={() => {}}
          onOpen={() => {}}
        />
        <div
          className="tf-panel"
          style={{
            gap: 12,
          }}
        >
          <b>Energy</b>
          <EnergyClass value="C" kwh={92} kind="Consumption · gas" />
        </div>
      </div>
    </div>
  );
}
