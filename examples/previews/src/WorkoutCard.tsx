import * as React from "react";
import { WorkoutCard } from "@twentyfirstmedia/ui-core";
import "./_connectors";

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
      <WorkoutCard
        type="Morning run"
        icon="footprints"
        date={new Date(2026, 10, 14, 7, 5)}
        duration={46}
        distance={8.2}
        calories={612}
        heartRate={152}
        zones={[4, 9, 18, 12, 3]}
        service={{ name: "Strava", icon: "brandStrava" }}
      />
      <WorkoutCard
        type="Golf · 18 holes"
        icon="flag"
        date={new Date(2026, 10, 13, 10, 0)}
        duration={252}
        distance={9.6}
        calories={1140}
        heartRate={98}
      />
    </div>
  );
}
