import * as React from "react";
import {
  AppShell,
  Button,
  CalendarView,
  EventCard,
  EventInvite,
  PageHeader,
  Panel,
  Stagger,
} from "@twentyfirstmedia/ui-core";
import type { CalendarEvent, CalendarRsvp } from "@twentyfirstmedia/ui-core";
import { CALENDARS, EVENTS, NOW } from "./_calendar";

function App() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(EVENTS);
  const [reply, setReply] = React.useState<CalendarRsvp | null>(null);
  return (
    <AppShell
      brand="Halo"
      tag="Admin"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      active="Calendar"
      dock={false}
      side={
        <Panel side title="Up next" subtitle="Thursday, April 16">
          <EventInvite
            className="tf-in"
            title="Quarterly planning"
            start={new Date(2026, 3, 20, 10)}
            end={new Date(2026, 3, 20, 11, 30)}
            location="Room 4"
            organizer={{ name: "Lena Hart", email: "lena@example.com" }}
            others={[
              {
                title: "Standup",
                start: new Date(2026, 3, 20, 10),
                end: new Date(2026, 3, 20, 10, 15),
                tint: "mint",
              },
            ]}
            response={reply}
            onRespond={setReply}
            onAddToCalendar={() => {}}
          />
          <Stagger className="tf-col" delay={320}>
            <EventCard
              kind="review"
              label="Pricing review"
              date="Thu, Apr 16"
              time="11:00"
              tint="butter"
              icon="card"
            >
              Moved from Wednesday so Growth can join.
            </EventCard>
            <EventCard kind="incident" label="Incident retro" date="Thu, Apr 16" time="16:00">
              What delayed EU webhooks and how we stop it.
            </EventCard>
          </Stagger>
        </Panel>
      }
    >
      <div className="tf-in">
        <PageHeader title="Calendar" subtitle="Week 16 · 14 events" />
      </div>
      <div className="tf-panel tf-in" style={{ "--d": "120ms" } as React.CSSProperties}>
        <CalendarView
          events={events}
          calendars={CALENDARS}
          now={NOW}
          defaultDate={NOW}
          onCreate={(slot) =>
            setEvents((list) =>
              list.concat([
                {
                  id: "n" + list.length,
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
          toolbar={
            <Button size="sm" icon="plus">
              New event
            </Button>
          }
        />
      </div>
    </AppShell>
  );
}
export default function Preview() {
  return <App />;
}
