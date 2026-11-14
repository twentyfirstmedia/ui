import * as React from "react";
import { Button, ReservationCard } from "@twentyfirstmedia/ui-core";
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
        actions={
          <Button size="sm" variant="secondary" icon="calendar">
            Add to calendar
          </Button>
        }
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
        kind="order"
        title="Wolt · Tokyo Ramen"
        subtitle="2 items · €31.40"
        start={new Date(2026, 10, 14, 19, 10)}
        status="onTheWay"
        statusText="Arrives 19:40"
      />
      <ReservationCard
        kind="train"
        title="Hamburg → Berlin"
        subtitle="ICE 1005 · Car 7, seat 64"
        start={new Date(2026, 10, 27, 8, 6)}
        end={new Date(2026, 10, 27, 9, 50)}
        code="ZK4M9T"
        status="cancelled"
        service={{ name: "Deutsche Bahn", icon: "brandDeutschebahn" }}
      />
    </div>
  );
}
