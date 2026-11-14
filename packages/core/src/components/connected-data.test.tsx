// @vitest-environment jsdom
/** Connected data: devices, car, now playing, workouts, calls, bookings, golf, holdings. */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CallLog,
  DeviceTile,
  HoldingsList,
  NowPlaying,
  ReservationCard,
  Scorecard,
  VehicleCard,
  WorkoutCard,
} from "./connected-data.js";

afterEach(cleanup);
const now = new Date(2026, 10, 14, 9, 30);

describe("connected data components", () => {
  it("DeviceTile switches, steps the target and says when offline", () => {
    const toggle = vi.fn();
    const target = vi.fn();
    const { rerender } = render(
      <DeviceTile
        kind="thermostat"
        name="Living room"
        on
        value="20.8 °C"
        target={21.5}
        onTarget={target}
        onToggle={toggle}
        battery={12}
      />,
    );
    fireEvent.click(screen.getByRole("switch", { name: "Living room" }));
    expect(toggle).toHaveBeenCalledWith(false);
    fireEvent.click(screen.getByRole("button", { name: "Raise target" }));
    expect(target).toHaveBeenCalledWith(22);
    expect(screen.getByText("Target 21.5 °C")).toBeTruthy();
    expect(screen.getByText("Battery 12%")).toBeTruthy();
    rerender(<DeviceTile kind="camera" name="Door" offline onToggle={toggle} />);
    expect(screen.getByText("Offline")).toBeTruthy();
    expect(screen.queryByRole("switch")).toBeNull();
  });

  it("VehicleCard shows charge, limit and lock", () => {
    const lock = vi.fn();
    render(
      <VehicleCard
        name="Model Y"
        battery={58}
        range={287}
        limit={80}
        charging="charging"
        power={11}
        locked
        onLock={lock}
      />,
    );
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("58");
    expect(screen.getByText("287 km range")).toBeTruthy();
    expect(screen.getByText(/Charging · 11 kW/)).toBeTruthy();
    expect(screen.getByText("Limit 80%")).toBeTruthy();
    const lockBtn = screen.getByRole("button", { name: "Lock" });
    expect(lockBtn.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText(/Locked/)).toBeTruthy();
    fireEvent.click(lockBtn);
    expect(lock).toHaveBeenCalledWith(false);
  });

  it("NowPlaying reads its progress and pauses", () => {
    const pp = vi.fn();
    render(
      <NowPlaying title="Weightless" position={203} duration={488} playing onPlayPause={pp} />,
    );
    expect(screen.getByRole("progressbar").getAttribute("aria-valuetext")).toBe("3:23 / 8:08");
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    expect(pp).toHaveBeenCalled();
  });

  it("WorkoutCard lists its numbers and zones in words", () => {
    render(
      <WorkoutCard
        type="Run"
        date={now}
        duration={72}
        distance={8.24}
        heartRate={152}
        zones={[4, 9, 18, 12, 3]}
      />,
    );
    expect(screen.getByText("1 h 12 min")).toBeTruthy();
    expect(screen.getByText("8.2 km")).toBeTruthy();
    expect(screen.getByText("Zone 3: 18 min")).toBeTruthy();
  });

  it("CallLog groups by day and calls back", () => {
    const call = vi.fn();
    render(
      <CallLog
        now={now}
        onCall={call}
        calls={[
          {
            id: "a",
            name: "Lena",
            direction: "incoming",
            at: new Date(2026, 10, 14, 7, 40),
            duration: 412,
          },
          { id: "b", name: "Garage", direction: "missed", at: new Date(2026, 10, 13, 11, 0) },
        ]}
      />,
    );
    expect(screen.getAllByRole("region").map((r) => r.getAttribute("aria-label"))).toEqual([
      "Today",
      "Yesterday",
    ]);
    expect(screen.getByText(/Incoming · 7:40 AM · 7 min/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Call Garage" }));
    expect(call).toHaveBeenCalledWith("b");
  });

  it("ReservationCard shows a stay as a date range with its status", () => {
    render(
      <ReservationCard
        kind="stay"
        title="Rove Downtown"
        start={new Date(2026, 10, 20)}
        end={new Date(2026, 10, 24)}
        code="4419"
        status="delayed"
        statusText="+25 min"
      />,
    );
    expect(screen.getByText("Fri, Nov 20 – Tue, Nov 24")).toBeTruthy();
    expect(screen.getByText("Delayed · +25 min")).toBeTruthy();
    expect(screen.getByText("4419")).toBeTruthy();
  });

  it("Scorecard totals the round and names each score", () => {
    render(
      <Scorecard
        course="GC Test"
        holes={[
          { par: 4, strokes: 3 },
          { par: 4, strokes: 6 },
          { par: 3, strokes: 3 },
        ]}
      />,
    );
    expect(screen.getByText("+1")).toBeTruthy();
    expect(screen.getByText("3, Birdie")).toBeTruthy();
    expect(screen.getByText("6, Double bogey or worse")).toBeTruthy();
    expect(screen.getByRole("table", { name: "GC Test Out" })).toBeTruthy();
  });

  it("HoldingsList shows change with a sign and the portfolio share", () => {
    const pick = vi.fn();
    render(
      <HoldingsList
        period="today"
        onSelect={pick}
        holdings={[{ id: "a", name: "World ETF", value: 18420, change: -1.2, weight: 48 }]}
      />,
    );
    expect(screen.getByText(/-1.2% today|−1.2% today/)).toBeTruthy();
    expect(screen.getByText("48% of portfolio")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /World ETF/ }));
    expect(pick).toHaveBeenCalledWith("a");
  });
});
