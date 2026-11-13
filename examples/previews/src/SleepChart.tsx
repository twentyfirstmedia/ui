import { Panel, SleepChart } from "@twentyfirstmedia/ui-core";
import type { SleepSegment } from "@twentyfirstmedia/ui-core";

// one night, as a watch reports it (fixed times, so the example stays the same)
const at = (h: number, m: number) => new Date(2026, 10, h < 12 ? 13 : 12, h, m).getTime();
const night: SleepSegment[] = [
  ["awake", 23, 5, 23, 20],
  ["light", 23, 20, 23, 50],
  ["deep", 23, 50, 0, 55],
  ["light", 0, 55, 1, 40],
  ["rem", 1, 40, 2, 10],
  ["light", 2, 10, 2, 50],
  ["deep", 2, 50, 3, 30],
  ["awake", 3, 30, 3, 38],
  ["light", 3, 38, 4, 40],
  ["rem", 4, 40, 5, 25],
  ["light", 5, 25, 6, 20],
  ["rem", 6, 20, 6, 50],
  ["awake", 6, 50, 7, 0],
].map(([stage, h1, m1, h2, m2]) => ({
  stage: stage as SleepSegment["stage"],
  start: at(h1 as number, m1 as number),
  end: at(h2 as number, m2 as number),
}));

export default function Preview() {
  return (
    <Panel title="Last night" subtitle="Thu 12 → Fri 13 Nov" style={{ maxWidth: 640 }}>
      <SleepChart segments={night} />
    </Panel>
  );
}
