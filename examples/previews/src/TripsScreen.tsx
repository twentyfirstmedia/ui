import * as React from "react";
import {
  AppShell,
  Button,
  CallLog,
  PageHeader,
  Panel,
  ReservationCard,
  Stagger,
} from "@twentyfirstmedia/ui-core";
import "./_connectors";
import { LIFE_NAV } from "./_lifenav";

const now = new Date(2026, 10, 14, 9, 30);
const two = {
  "--cols": "repeat(2, minmax(0, 1fr))",
  "--cols-sm": "1fr",
  gap: 16,
} as React.CSSProperties;

/** Upcoming trips and open orders gathered from mail, booking sites and delivery apps, with recent calls. */
export default function Preview() {
  return (
    <AppShell
      navigation="sidebar"
      brand="Life"
      sidebarGroups={LIFE_NAV}
      active="trips"
      user={{ name: "Mara Ellis", email: "mara@halo.app" }}
      dock={false}
      side={
        <Panel side title="Calls" subtitle="Today and yesterday">
          <CallLog
            now={now}
            onCall={() => {}}
            calls={[
              {
                id: "1",
                name: "Rove Downtown",
                direction: "missed",
                at: new Date(2026, 10, 14, 8, 52),
              },
              {
                id: "2",
                name: "Emirates",
                direction: "outgoing",
                at: new Date(2026, 10, 13, 16, 10),
                duration: 640,
                summary: "Seat 32A confirmed; vegetarian meal added.",
              },
            ]}
          />
        </Panel>
      }
    >
      <div className="tf-in">
        <PageHeader
          title="Trips & orders"
          subtitle="Found in Gmail, Booking.com, Deutsche Bahn and Wolt"
          actions={[
            <Button key="add" variant="secondary" icon="plus">
              Add booking
            </Button>,
          ]}
        />
      </div>
      <Stagger className="tf-col" style={{ gap: 16 }}>
        <div className="tf-grid" style={two}>
          <ReservationCard
            kind="order"
            title="Wolt · Tokyo Ramen"
            subtitle="2 items · €31.40"
            start={new Date(2026, 10, 14, 19, 10)}
            status="onTheWay"
            statusText="Arrives 19:40"
          />
          <ReservationCard
            kind="order"
            title="Amazon · Running shoes"
            subtitle="1 item · €119.90"
            start={new Date(2026, 10, 15, 12, 0)}
            status="confirmed"
            statusText="Arrives tomorrow"
            service={{ name: "Amazon", icon: "brandAmazon" }}
          />
        </div>
        <Panel title="Dubai" subtitle="20–24 November">
          <div className="tf-grid" style={two}>
            <ReservationCard
              kind="flight"
              title="Hamburg → Dubai"
              subtitle="EK 60 · Seat 32A"
              start={new Date(2026, 10, 20, 14, 35)}
              end={new Date(2026, 10, 20, 23, 50)}
              place="HAM Terminal 1 → DXB Terminal 3"
              code="K7XQ2M"
              status="delayed"
              statusText="+25 min"
            />
            <ReservationCard
              kind="stay"
              title="Rove Downtown"
              subtitle="Double room · 4 nights"
              start={new Date(2026, 10, 20)}
              end={new Date(2026, 10, 24)}
              place="Al Mustaqbal St, Dubai"
              code="4419 2207 81"
              status="confirmed"
              service={{ name: "Booking.com", icon: "brandBooking" }}
            />
            <ReservationCard
              kind="ride"
              title="Careem · Airport to hotel"
              subtitle="Comfort · about AED 70"
              start={new Date(2026, 10, 21, 0, 30)}
              status="pending"
              statusText="Booked by the assistant once you land"
            />
            <ReservationCard
              kind="event"
              title="Museum of the Future"
              subtitle="2 tickets"
              start={new Date(2026, 10, 22, 11, 0)}
              place="Sheikh Zayed Rd"
              code="MOTF-88213"
              status="confirmed"
            />
          </div>
        </Panel>
      </Stagger>
    </AppShell>
  );
}
