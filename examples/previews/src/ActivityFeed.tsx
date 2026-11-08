import * as React from "react";
import { ActivityFeed, DailyBriefing } from "@twentyfirstmedia/ui-core";

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
        <ActivityFeed
          groups={[
            {
              title: "Today",
              items: [
                {
                  time: "09:41",
                  status: "signal",
                  actor: "Atlas",
                  text: "asked to send a reply to Northwind",
                },
                {
                  time: "09:12",
                  status: "warn",
                  actor: "Ads",
                  text: "reached 82 % of the monthly budget",
                },
                {
                  time: "08:02",
                  status: "ok",
                  actor: "Ledger",
                  text: "matched 31 payments",
                },
              ],
            },
            {
              title: "Yesterday",
              items: [
                {
                  time: "18:02",
                  status: "danger",
                  actor: "Echo",
                  text: "stopped: the docs connection expired",
                },
              ],
            },
          ]}
        />
      </div>
      <div className="tf-panel">
        <DailyBriefing
          title="Main Brain"
          time="Today, 08:00"
          summary="26 runs overnight, 22 succeeded. €4.18 spent, well under budget. Two drafts wait for you and the docs connection needs a new token."
          attention={[
            {
              text: "Approve the reply to Northwind",
            },
            {
              text: "Reconnect the docs workspace",
              status: "danger",
            },
          ]}
          suggestions={[
            "Move the weekly report to Monday 09:00",
            "Give Ledger read access to the new bank account",
          ]}
        />
      </div>
    </div>
  );
}
