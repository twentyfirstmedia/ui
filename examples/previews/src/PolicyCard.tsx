import type * as React from "react";
import { Button, PolicyCard } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-grid"
      style={
        {
          "--cols": "repeat(2, minmax(0, 1fr))",
          "--cols-sm": "1fr",
          gap: 16,
        } as React.CSSProperties
      }
    >
      <PolicyCard
        type="Household contents"
        insurer="Nordhafen Insurance"
        icon="home"
        tint="sky"
        coverage={65000}
        premium={{ amount: 9.8, period: "month" }}
        deductible={150}
        policyNumber="HR-2207-551938"
        maskNumber
        renews={new Date(2027, 2, 1)}
        actions={
          <>
            <Button size="sm" variant="ghost" icon="file">
              Documents
            </Button>
            <Button size="sm" variant="secondary">
              Report a claim
            </Button>
          </>
        }
      />
      <PolicyCard
        type="Car (comprehensive)"
        insurer="Alpenland Direct"
        icon="key"
        tint="butter"
        coverage="Unlimited liability"
        premium={{ amount: 412, period: "year" }}
        deductible={300}
        status="expiring"
        renews={new Date(2026, 11, 31)}
      />
    </div>
  );
}
