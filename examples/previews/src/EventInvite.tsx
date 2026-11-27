import * as React from "react";
import { EventInvite } from "@twentyfirstmedia/ui-core";
import type { CalendarRsvp } from "@twentyfirstmedia/ui-core";

const at = (day: number, h: number, m = 0) => new Date(2026, 3, day, h, m);

export default function Preview() {
  const [reply, setReply] = React.useState<CalendarRsvp | null>(null);
  const [added, setAdded] = React.useState(false);
  return (
    <div className="tf-col" style={{ gap: 16 }}>
      <EventInvite
        title="Quarterly planning"
        start={at(20, 10)}
        end={at(20, 11, 30)}
        location="Room 4, second floor"
        organizer={{ name: "Lena Hart", email: "lena@example.com" }}
        guests={8}
        others={[{ title: "Standup", start: at(20, 10), end: at(20, 10, 15), tint: "mint" }]}
        response={reply}
        onRespond={setReply}
        added={added}
        onAddToCalendar={() => setAdded(true)}
      />
      <EventInvite
        title="Partner call with Northwind"
        start={at(21, 15)}
        end={at(21, 16)}
        location="Video call"
        organizer={{ name: "Noah Berg", email: "noah@example.com" }}
        status="updated"
        changes="New time: Tuesday 15:00 instead of Monday 14:00."
        others={[]}
        defaultResponse="accepted"
        onRespond={() => {}}
        added
        onAddToCalendar={() => {}}
      />
      <EventInvite
        title="Team offsite"
        start={at(22, 9)}
        end={at(22, 17)}
        organizer={{ name: "Mara Ellis" }}
        status="cancelled"
        added
        onRemove={() => {}}
      />
    </div>
  );
}
