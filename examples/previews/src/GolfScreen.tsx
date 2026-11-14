import * as React from "react";
import {
  AppShell,
  BarList,
  PageHeader,
  Panel,
  Scorecard,
  Stagger,
  StatTile,
  WorkoutCard,
} from "@twentyfirstmedia/ui-core";
import "./_connectors";
import { LIFE_NAV } from "./_lifenav";

const PAR = [4, 4, 3, 5, 4, 4, 3, 4, 5, 4, 3, 4, 5, 4, 4, 3, 4, 5];
const STROKES = [5, 4, 3, 6, 4, 5, 2, 4, 5, 6, 3, 4, 4, 5, 4, 4, 5, 6];
const PUTTS = [2, 2, 1, 2, 2, 2, 1, 2, 2, 3, 2, 2, 1, 2, 2, 2, 2, 2];

/** Golf: handicap from the club, the last round as a scorecard, the round as a workout and range carry by club. */
export default function Preview() {
  return (
    <AppShell
      navigation="sidebar"
      brand="Life"
      sidebarGroups={LIFE_NAV}
      active="golf"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      dock={false}
    >
      <div className="tf-in">
        <PageHeader title="Golf" subtitle="From PCCADDIE, Hole19 and Trackman" />
      </div>
      <Stagger className="tf-col" style={{ gap: 16 }}>
        <div
          className="tf-grid"
          style={
            {
              "--cols": "repeat(3, minmax(0, 1fr))",
              "--cols-sm": "1fr",
              gap: 16,
            } as React.CSSProperties
          }
        >
          <StatTile label="Handicap index" value="18.4" delta="−0.6" tint="mint" />
          <StatTile label="Rounds this year" value="23" tint="sky" />
          <StatTile label="Putts per round" value="34.1" delta="−1.2" tint="butter" />
        </div>
        <Scorecard
          course="GC Hamburg-Walddörfer"
          date={new Date(2026, 10, 13)}
          tee="Yellow · CR 71.2 / SR 128"
          service={{ name: "Hole19", icon: "brandHole19" }}
          holes={PAR.map((par, i) => ({ par, strokes: STROKES[i], putts: PUTTS[i] }))}
        />
        <div
          className="tf-grid"
          style={
            {
              "--cols": "minmax(0, 1fr) minmax(0, 1fr)",
              "--cols-sm": "1fr",
              gap: 16,
            } as React.CSSProperties
          }
        >
          <WorkoutCard
            type="Golf · 18 holes"
            icon="flag"
            date={new Date(2026, 10, 13, 10, 0)}
            duration={252}
            distance={9.6}
            calories={1140}
            heartRate={98}
            zones={[120, 96, 30, 6, 0]}
          />
          <Panel title="Range session" subtitle="Carry by club · Trackman, 12 November">
            <BarList
              items={[
                { label: "Driver", value: 212 },
                { label: "5 wood", value: 184 },
                { label: "7 iron", value: 142 },
                { label: "9 iron", value: 118 },
                { label: "Wedge", value: 92 },
              ]}
            />
          </Panel>
        </div>
      </Stagger>
    </AppShell>
  );
}
