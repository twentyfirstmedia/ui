import * as React from "react";
import { Panel, PeriodLock } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <Panel title="Periods" style={{ gap: 8 }}>
      <PeriodLock
        month="2026-11-01"
        note="12 bookings · 2 drafts"
        onLock={() => new Promise<void>((r) => setTimeout(r, 900))}
        onUnlock={() => {}}
        stepUp
      />
      <PeriodLock
        month="2026-10-01"
        defaultLocked
        lockedAt="2026-11-03"
        lockedBy="Mara Ellis"
        onUnlock={() => new Promise<void>((r) => setTimeout(r, 900))}
        onLock={() => {}}
        stepUp
      />
      <PeriodLock month="2026-09-01" locked lockedAt="2026-10-02" lockedBy="Mara Ellis" readOnly />
    </Panel>
  );
}
