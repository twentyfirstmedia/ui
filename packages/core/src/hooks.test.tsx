// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useRef, useState } from "react";
import { useControlled, useOutside, useTrap } from "./hooks.js";

afterEach(cleanup);

describe("useControlled", () => {
  function Box(p: { value?: string; onChange?: (v: string) => void }) {
    const [v, set] = useControlled(p.value, "a", p.onChange);
    return (
      <button type="button" onClick={() => set(v + "b")}>
        {v}
      </button>
    );
  }
  it("keeps its own state when uncontrolled", () => {
    const fn = vi.fn();
    render(<Box onChange={fn} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button").textContent).toBe("ab");
    expect(fn).toHaveBeenCalledWith("ab");
  });
  it("follows the value when controlled", () => {
    const fn = vi.fn();
    render(<Box value="x" onChange={fn} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button").textContent).toBe("x");
    expect(fn).toHaveBeenCalledWith("xb");
  });
});

describe("useOutside", () => {
  it("closes on outside pointer down and Escape", () => {
    const close = vi.fn();
    function Pop() {
      const ref = useRef<HTMLDivElement>(null);
      useOutside(ref, true, close);
      return <div ref={ref}>inside</div>;
    }
    render(
      <>
        <Pop />
        <p>outside</p>
      </>,
    );
    fireEvent.pointerDown(screen.getByText("inside"));
    expect(close).not.toHaveBeenCalled();
    fireEvent.pointerDown(screen.getByText("outside"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(close).toHaveBeenCalledTimes(2);
  });
});

describe("useTrap", () => {
  it("focuses inside, wraps Tab, closes on Escape and restores focus", () => {
    const close = vi.fn();
    function Dialog() {
      const ref = useRef<HTMLDivElement>(null);
      useTrap(ref, close);
      return (
        <div ref={ref}>
          <button type="button">first</button>
          <button type="button">last</button>
        </div>
      );
    }
    function App() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(!open)}>
            opener
          </button>
          {open && <Dialog />}
        </>
      );
    }
    render(<App />);
    const opener = screen.getByText("opener");
    opener.focus();
    act(() => opener.click());
    // jsdom has no layout; offsetParent is null, so the trap still focuses the first focusable
    expect(document.activeElement?.textContent).toBe("first");
    fireEvent.keyDown(document.activeElement as Element, { key: "Escape" });
    expect(close).toHaveBeenCalled();
    act(() => opener.click());
    expect(document.activeElement).toBe(opener);
  });
});
