// @vitest-environment jsdom
import * as React from "react";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { UIProvider } from "../provider.js";
import { CalendarView, EventInvite, calendarRange } from "./index.js";
import type { CalendarDef, CalendarEvent } from "./types.js";

beforeAll(() => {
  window.matchMedia ??= ((q: string) => ({
    matches: false,
    media: q,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  window.requestAnimationFrame ??= ((cb: FrameRequestCallback) =>
    setTimeout(() => cb(0), 0)) as never;
});
afterEach(cleanup);

const NOW = new Date(2026, 3, 16, 10, 30); // Thu, Apr 16 2026
const CALS: CalendarDef[] = [
  { id: "work", label: "Work", tint: "sky" },
  { id: "team", label: "Team", tint: "mint" },
  { id: "holidays", label: "Holidays", tint: "butter", readOnly: true },
];
const EVENTS: CalendarEvent[] = [
  {
    id: "standup",
    title: "Standup",
    start: new Date(2026, 3, 16, 9, 0),
    end: new Date(2026, 3, 16, 9, 30),
    calendar: "team",
  },
  {
    id: "review",
    title: "Design review",
    start: new Date(2026, 3, 16, 14, 0),
    end: new Date(2026, 3, 16, 15, 30),
    calendar: "work",
    location: "Room 2",
    rsvp: "open",
    guests: [
      { name: "Lena Hart", status: "accepted", organizer: true },
      { name: "Noah Berg", status: "declined" },
      { name: "Ava Brandt" },
    ],
  },
  {
    id: "holiday",
    title: "Spring holiday",
    start: new Date(2026, 3, 17),
    end: new Date(2026, 3, 18),
    allDay: true,
    calendar: "holidays",
  },
];

describe("calendarRange", () => {
  it("covers a day, a Monday week, six month weeks and 14 agenda days", () => {
    const r = (v: Parameters<typeof calendarRange>[0]) => {
      const x = calendarRange(v, NOW);
      return [x.start.toDateString(), x.end.toDateString()];
    };
    expect(r("day")).toEqual(["Thu Apr 16 2026", "Fri Apr 17 2026"]);
    expect(r("week")).toEqual(["Mon Apr 13 2026", "Mon Apr 20 2026"]);
    expect(r("month")).toEqual(["Mon Mar 30 2026", "Mon May 11 2026"]);
    expect(r("agenda")).toEqual(["Thu Apr 16 2026", "Thu Apr 30 2026"]);
    expect(calendarRange("week", NOW, 0).start.toDateString()).toBe("Sun Apr 12 2026");
  });
});

describe("CalendarView", () => {
  it("shows the week with timed and all-day events and reports its range", () => {
    const onRange = vi.fn();
    render(<CalendarView events={EVENTS} calendars={CALS} now={NOW} onRangeChange={onRange} />);
    expect(onRange).toHaveBeenCalledWith(
      expect.objectContaining({ view: "week", start: new Date(2026, 3, 13) }),
    );
    expect(screen.getByRole("button", { name: /^Standup,/ })).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /^Spring holiday, Fri, Apr 17 · All day/ }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Thursday, April 16" }).getAttribute("aria-current"),
    ).toBe("date");
    expect(document.querySelector(".tf-calv-now")).toBeTruthy();
  });

  it("hides a calendar's events with its toggle", () => {
    const onHidden = vi.fn();
    render(<CalendarView events={EVENTS} calendars={CALS} now={NOW} onHiddenChange={onHidden} />);
    const team = screen.getByRole("button", { name: "Team" });
    expect(team.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(team);
    expect(onHidden).toHaveBeenCalledWith(["team"]);
    expect(screen.queryByRole("button", { name: /^Standup,/ })).toBeNull();
  });

  it("opens details with guests and the reply, and closes them with Escape", () => {
    const onRsvp = vi.fn();
    render(
      <CalendarView
        events={EVENTS}
        calendars={CALS}
        now={NOW}
        onRsvp={onRsvp}
        eventActions={() => <button type="button">Edit</button>}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /^Design review,/ }));
    const dialog = screen.getByRole("dialog", { name: "Design review" });
    expect(within(dialog).getByText("Room 2")).toBeTruthy();
    expect(within(dialog).getByText("3 guests · 1 accepted")).toBeTruthy();
    expect(within(dialog).getByText("Declined")).toBeTruthy();
    expect(within(dialog).getByText("Awaiting reply")).toBeTruthy();
    expect(within(dialog).getByText("Edit")).toBeTruthy();
    fireEvent.click(within(dialog).getByLabelText("Yes"));
    expect(onRsvp).toHaveBeenCalledWith(expect.objectContaining({ id: "review" }), "accepted");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("creates an event from a focused slot with Enter and moves by arrow keys", () => {
    const onCreate = vi.fn();
    render(<CalendarView events={[]} now={NOW} onCreate={onCreate} view="day" />);
    const slot = screen.getByRole("button", { name: "New event, Thursday, April 16, 9:00 AM" });
    expect(slot.tabIndex).toBe(0);
    fireEvent.keyDown(slot, { key: "ArrowDown" });
    fireEvent.click(slot, { detail: 0 });
    expect(onCreate).toHaveBeenCalledWith({
      start: new Date(2026, 3, 16, 9),
      end: new Date(2026, 3, 16, 10),
      allDay: false,
    });
  });

  it("switches views and steps through months", () => {
    const onView = vi.fn();
    render(<CalendarView events={EVENTS} now={NOW} defaultView="month" onViewChange={onView} />);
    expect(screen.getByRole("heading", { name: "April 2026" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("heading", { name: "May 2026" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    fireEvent.click(screen.getByRole("button", { name: "Thursday, April 16" }));
    expect(onView).toHaveBeenLastCalledWith("day");
  });

  it("lists days in the agenda", () => {
    render(<CalendarView events={EVENTS} now={NOW} view="agenda" />);
    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    expect(within(list).getByText("Today")).toBeTruthy();
  });

  it("speaks German through messages and the locale", () => {
    render(
      <UIProvider
        scope="subtree"
        locale="de-DE"
        messages={{
          calToday: "Heute",
          calAllDay: "Ganztägig",
          calWeek: "Woche",
          calDay: "Tag",
          calMonth: "Monat",
          calAgenda: "Liste",
          calNext: "Weiter",
          calPrevious: "Zurück",
        }}
      >
        <CalendarView events={EVENTS} calendars={CALS} now={NOW} />
      </UIProvider>,
    );
    expect(screen.getAllByText("Heute").length).toBeGreaterThan(0);
    expect(screen.getByText("Ganztägig")).toBeTruthy();
    expect(screen.getByText("Woche")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Donnerstag, 16. April" })).toBeTruthy();
    expect(screen.queryByText("Today")).toBeNull();
    expect(screen.queryByText("All day")).toBeNull();
    expect(screen.queryByText("Week")).toBeNull();
  });
});

describe("EventInvite", () => {
  it("shows the facts, the calendar then and records the reply", () => {
    const onRespond = vi.fn();
    const add = vi.fn();
    render(
      <EventInvite
        title="Quarterly planning"
        start={new Date(2026, 3, 20, 10)}
        end={new Date(2026, 3, 20, 11)}
        location="Room 4"
        organizer={{ name: "Lena Hart", email: "lena@example.com" }}
        others={[
          {
            title: "Standup",
            start: new Date(2026, 3, 20, 10),
            end: new Date(2026, 3, 20, 10, 15),
          },
        ]}
        onRespond={onRespond}
        onAddToCalendar={add}
      />,
    );
    expect(screen.getByRole("group", { name: "Invitation: Quarterly planning" })).toBeTruthy();
    expect(screen.getByText("Also in your calendar then")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Accept" }));
    expect(onRespond).toHaveBeenCalledWith("accepted");
    expect(screen.getByRole("button", { name: "Accept" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
    expect(screen.getByText("Your reply: Accepted")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Add to calendar" }));
    expect(add).toHaveBeenCalled();
  });

  it("shows a cancelled event without replies", () => {
    const remove = vi.fn();
    render(
      <EventInvite
        title="Offsite"
        start={new Date(2026, 3, 22, 9)}
        end={new Date(2026, 3, 22, 17)}
        status="cancelled"
        onRespond={() => {}}
        onRemove={remove}
        added
      />,
    );
    expect(screen.getByText("The organizer cancelled this event.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Accept" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Remove from calendar" }));
    expect(remove).toHaveBeenCalled();
  });

  it("says when nothing else is planned", async () => {
    render(
      <UIProvider
        scope="subtree"
        locale="de-DE"
        messages={{ calFreeThen: "Sonst nichts geplant", calAccept: "Zusagen" }}
      >
        <EventInvite
          title="Call"
          start={new Date(2026, 3, 20, 10)}
          end={new Date(2026, 3, 20, 11)}
          others={[]}
          onRespond={() => {}}
        />
      </UIProvider>,
    );
    await act(async () => {});
    expect(screen.getByText("Sonst nichts geplant")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Zusagen" })).toBeTruthy();
    expect(screen.queryByText("Accept")).toBeNull();
  });
});
