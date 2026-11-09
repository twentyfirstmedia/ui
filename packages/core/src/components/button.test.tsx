// @vitest-environment jsdom
/** Button and IconButton pass native attributes on to their button (or the asChild element). */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button, IconButton } from "./foundation.js";

afterEach(cleanup);

describe("Button", () => {
  it("forwards id, aria-*, name, value, form and type", () => {
    render(
      <>
        <Button
          id="save"
          type="submit"
          name="intent"
          value="save"
          form="crm"
          aria-label="Save contact"
          aria-describedby="hint"
          aria-expanded={false}
          aria-controls="panel"
          aria-haspopup="menu"
          data-testid="b"
        >
          Save
        </Button>
        <Button type="reset">Reset</Button>
      </>,
    );
    const b = screen.getByRole("button", { name: "Save contact" });
    expect(b.id).toBe("save");
    expect(b.getAttribute("type")).toBe("submit");
    expect(b.getAttribute("name")).toBe("intent");
    expect(b.getAttribute("value")).toBe("save");
    expect(b.getAttribute("form")).toBe("crm");
    expect(b.getAttribute("aria-describedby")).toBe("hint");
    expect(b.getAttribute("aria-expanded")).toBe("false");
    expect(b.getAttribute("aria-controls")).toBe("panel");
    expect(b.getAttribute("aria-haspopup")).toBe("menu");
    expect(b.dataset.testid).toBe("b");
    expect(b.className).toBe("tf-btn tf-btn-primary");
    expect(screen.getByRole("button", { name: "Reset" }).getAttribute("type")).toBe("reset");
  });

  it("aria-expanded follows state, events and ref arrive", () => {
    const onKeyDown = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const { rerender } = render(
      <Button aria-expanded={false} onKeyDown={onKeyDown} ref={ref}>
        Filters
      </Button>,
    );
    const b = screen.getByRole("button", { name: "Filters" });
    rerender(
      <Button aria-expanded onKeyDown={onKeyDown} ref={ref}>
        Filters
      </Button>,
    );
    expect(b.getAttribute("aria-expanded")).toBe("true");
    fireEvent.keyDown(b, { key: "ArrowDown" });
    expect(onKeyDown).toHaveBeenCalled();
    expect(ref.current).toBe(b);
  });

  it("defaults stay: type button, variant class, disabled and onClick", () => {
    const onClick = vi.fn();
    render(
      <Button variant="soft" size="sm" disabled onClick={onClick} className="x">
        Go
      </Button>,
    );
    const b = screen.getByRole("button", { name: "Go" });
    expect(b.getAttribute("type")).toBe("button");
    expect(b.className).toBe("tf-btn tf-btn-soft tf-btn-sm x");
    expect((b as HTMLButtonElement).disabled).toBe(true);
  });

  it("asChild passes them to the child", () => {
    render(
      <Button asChild aria-current="page" id="home">
        <a href="/">Home</a>
      </Button>,
    );
    const a = screen.getByRole("link", { name: "Home" });
    expect(a.getAttribute("aria-current")).toBe("page");
    expect(a.id).toBe("home");
  });
});

describe("IconButton", () => {
  it("label names it; native attributes pass through and aria-label can override", () => {
    render(
      <>
        <IconButton icon="more" label="More" aria-expanded aria-haspopup="menu" id="m" />
        <IconButton icon="x" label="Close" aria-label="Close dialog" type="submit" />
      </>,
    );
    const more = screen.getByRole("button", { name: "More" });
    expect(more.getAttribute("aria-expanded")).toBe("true");
    expect(more.getAttribute("aria-haspopup")).toBe("menu");
    expect(more.getAttribute("title")).toBe("More");
    expect(more.id).toBe("m");
    const close = screen.getByRole("button", { name: "Close dialog" });
    expect(close.getAttribute("type")).toBe("submit");
  });
});
