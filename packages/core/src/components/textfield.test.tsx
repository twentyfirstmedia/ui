// @vitest-environment jsdom
/** TextField passes native constraints to its input; PlanCard can be disabled. */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TextField } from "./forms.js";
import { PlanCard } from "./commerce.js";

afterEach(cleanup);

describe("TextField", () => {
  it("sets name, required, min, max, step and the other native constraints", () => {
    render(
      <TextField
        label="Seats"
        name="seats"
        type="number"
        required
        min={1}
        max={50}
        step={1}
        inputMode="numeric"
        readOnly
      />,
    );
    const input = screen.getByLabelText(/Seats/) as HTMLInputElement;
    expect(input.name).toBe("seats");
    expect(input.required).toBe(true);
    expect([input.min, input.max, input.step]).toEqual(["1", "50", "1"]);
    expect(input.getAttribute("inputmode")).toBe("numeric");
    expect(input.readOnly).toBe(true);
  });

  it("passes length and pattern, so the browser validates them", () => {
    render(<TextField label="Code" minLength={4} maxLength={8} pattern="[A-Z0-9]+" />);
    const input = screen.getByLabelText("Code") as HTMLInputElement;
    expect([input.minLength, input.maxLength, input.pattern]).toEqual([4, 8, "[A-Z0-9]+"]);
    fireEvent.change(input, { target: { value: "ab" } });
    expect(input.checkValidity()).toBe(false);
  });
});

describe("PlanCard", () => {
  it("disabled turns off the button", () => {
    const onPick = vi.fn();
    render(<PlanCard name="Team" price={49} disabled onPick={onPick} />);
    const b = screen.getByRole("button", { name: "Choose Team" }) as HTMLButtonElement;
    expect(b.disabled).toBe(true);
  });
});
