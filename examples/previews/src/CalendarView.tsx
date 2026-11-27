import * as React from "react";
import { Button, CalendarView, toast } from "@twentyfirstmedia/ui-core";
import type { CalendarEvent } from "@twentyfirstmedia/ui-core";
import { CALENDARS, EVENTS, NOW } from "./_calendar";

export default function Preview() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(EVENTS);
  return (
    <div className="tf-panel" style={{ gap: 0 }}>
      <CalendarView
        events={events}
        calendars={CALENDARS}
        now={NOW}
        defaultDate={NOW}
        onCreate={(slot) =>
          setEvents((list) =>
            list.concat([
              {
                id: "new-" + list.length,
                title: "New event",
                start: slot.start,
                end: slot.end,
                calendar: "work",
              },
            ]),
          )
        }
        onRsvp={(ev, rsvp) =>
          setEvents((list) => list.map((e) => (e.id === ev.id ? { ...e, rsvp } : e)))
        }
        eventActions={(ev) => (
          <>
            <Button
              size="sm"
              variant="secondary"
              icon="edit"
              onClick={() => toast("Opened " + ev.title)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              icon="trash"
              onClick={() => setEvents((list) => list.filter((e) => e.id !== ev.id))}
            >
              Delete
            </Button>
          </>
        )}
        toolbar={
          <Button size="sm" icon="plus">
            New event
          </Button>
        }
      />
    </div>
  );
}
