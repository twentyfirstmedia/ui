// @vitest-environment jsdom
/** Keyboard paths and behaviour of the components added for shadcn parity. */
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { Accordion, Carousel, HoverCard, ToggleGroup, Toggle } from "./primitives.js";
import { Menu } from "./feedback.js";
import { Menubar, Sidebar, Tabs } from "./navigation.js";
import { SelectMenu } from "./select-menu.js";
import { Form } from "./form.js";
import { TextField, FormField } from "./forms.js";
import { ResizablePanels } from "./building-blocks.js";
import { Button, IconButton } from "./foundation.js";
import { CommandPalette, Drawer } from "./workspace.js";

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
  Element.prototype.scrollIntoView ??= () => {};
  Element.prototype.scrollTo ??= () => {};
  globalThis.requestAnimationFrame ??= ((cb: FrameRequestCallback) =>
    setTimeout(() => cb(0), 0)) as unknown as typeof requestAnimationFrame;
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Accordion", () => {
  const items = [
    { id: "a", title: "First", content: "One" },
    { id: "b", title: "Second", content: "Two" },
    { id: "c", title: "Third", content: "Three" },
  ];
  it("opens one section at a time and moves with the arrow keys", () => {
    render(<Accordion items={items} />);
    const [a, b] = screen.getAllByRole("button");
    fireEvent.click(a as HTMLElement);
    expect(a?.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("region", { name: "First" })).toBeTruthy();
    fireEvent.click(b as HTMLElement);
    expect(a?.getAttribute("aria-expanded")).toBe("false");
    a?.focus();
    fireEvent.keyDown(a as HTMLElement, { key: "ArrowDown" });
    expect(document.activeElement).toBe(b);
    fireEvent.keyDown(b as HTMLElement, { key: "End" });
    expect(document.activeElement?.textContent).toContain("Third");
  });
  it("keeps several open with multiple", () => {
    render(<Accordion items={items} multiple />);
    const [a, b] = screen.getAllByRole("button");
    fireEvent.click(a as HTMLElement);
    fireEvent.click(b as HTMLElement);
    expect(screen.getAllByRole("region")).toHaveLength(2);
  });
});

describe("Toggle and ToggleGroup", () => {
  it("toggles aria-pressed", () => {
    const on = vi.fn();
    render(<Toggle icon="star" label="Starred" onChange={on} />);
    const t = screen.getByRole("button", { name: "Starred" });
    fireEvent.click(t);
    expect(t.getAttribute("aria-pressed")).toBe("true");
    expect(on).toHaveBeenCalledWith(true);
  });
  it("single allows one, multiple allows many", () => {
    const one = vi.fn(),
      many = vi.fn();
    const { rerender } = render(
      <ToggleGroup label="View" items={["Day", "Week"]} onChange={one} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Day" }));
    fireEvent.click(screen.getByRole("button", { name: "Week" }));
    expect(one).toHaveBeenLastCalledWith(["Week"]);
    rerender(
      <ToggleGroup
        key="m"
        label="Style"
        type="multiple"
        items={["Bold", "Italic"]}
        onChange={many}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Bold" }));
    fireEvent.click(screen.getByRole("button", { name: "Italic" }));
    expect(many).toHaveBeenLastCalledWith(["Bold", "Italic"]);
  });
});

describe("Menu", () => {
  it("moves with arrows, runs items and toggles checkbox items", () => {
    const close = vi.fn(),
      open = vi.fn(),
      grid = vi.fn();
    render(
      <Menu
        autoFocus
        onClose={close}
        items={[
          { label: "Open", onClick: open },
          { label: "Rename", disabled: true },
          { label: "Show grid", type: "checkbox", checked: false, onClick: grid },
        ]}
      />,
    );
    const menu = screen.getByRole("menu");
    expect(document.activeElement?.textContent).toContain("Open");
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    // the disabled item is skipped
    expect(document.activeElement?.getAttribute("role")).toBe("menuitemcheckbox");
    fireEvent.click(screen.getByRole("menuitemcheckbox"));
    expect(grid).toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("menuitem", { name: "Open" }));
    expect(open).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
  });
  it("opens a submenu with → and closes it with ←", () => {
    render(
      <Menu
        autoFocus
        items={[{ label: "Sort by", items: [{ label: "Name" }, { label: "Size" }] }]}
      />,
    );
    const parent = screen.getByRole("menuitem", { name: /Sort by/ });
    fireEvent.keyDown(parent, { key: "ArrowRight" });
    expect(parent.getAttribute("aria-expanded")).toBe("true");
    const sub = screen.getByRole("menu", { name: "Sort by" });
    expect(document.activeElement?.textContent).toContain("Name");
    fireEvent.keyDown(within(sub).getByRole("menuitem", { name: "Name" }), { key: "ArrowLeft" });
    expect(parent.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(parent);
  });
});

describe("Menubar", () => {
  it("opens with ↓ and moves between menus with →", () => {
    render(
      <Menubar
        menus={[
          { label: "File", items: [{ label: "New" }] },
          { label: "Edit", items: [{ label: "Undo" }] },
        ]}
      />,
    );
    const file = screen.getByRole("menuitem", { name: "File" });
    file.focus();
    fireEvent.keyDown(file, { key: "ArrowDown" });
    expect(screen.getByRole("menu", { name: "File" })).toBeTruthy();
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: "ArrowRight" });
    expect(screen.getByRole("menu", { name: "Edit" })).toBeTruthy();
  });
});

describe("Tabs with panels", () => {
  it("wires tabs to panels and selects with the arrow keys", () => {
    render(<Tabs label="Customer" items={["A", "B"]} panels={{ A: "Panel A", B: "Panel B" }} />);
    const [a, b] = screen.getAllByRole("tab");
    expect(screen.getByRole("tabpanel").textContent).toBe("Panel A");
    expect(b?.getAttribute("tabindex")).toBe("-1");
    a?.focus();
    fireEvent.keyDown(a as HTMLElement, { key: "ArrowRight" });
    expect(b?.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel").textContent).toBe("Panel B");
    expect(screen.getByRole("tabpanel").getAttribute("aria-labelledby")).toBe(b?.id);
  });
});

describe("SelectMenu", () => {
  it("opens from the keyboard, moves and picks", () => {
    const on = vi.fn();
    render(<SelectMenu label="Team" options={["Design", "Growth", "Sales"]} onChange={on} />);
    const btn = screen.getByRole("combobox", { name: "Team" });
    fireEvent.keyDown(btn, { key: "ArrowDown" });
    const list = screen.getByRole("listbox");
    fireEvent.keyDown(list, { key: "ArrowDown" });
    fireEvent.keyDown(list, { key: "Enter" });
    expect(on).toHaveBeenCalledWith("Growth");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(btn.textContent).toContain("Growth");
  });
});

describe("Form", () => {
  it("shows messages, focuses the first invalid field and submits valid values", () => {
    const submit = vi.fn();
    render(
      <Form rules={{ name: { required: true }, email: { email: true } }} onSubmit={submit}>
        <TextField name="name" label="Name" />
        <TextField name="email" label="Email" defaultValue="nope" />
        <button type="submit">Send</button>
      </Form>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByText("This field is required")).toBeTruthy();
    expect(screen.getByText("Enter a valid email address")).toBeTruthy();
    const name = screen.getByLabelText("Name");
    expect(name.getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(name);
    fireEvent.change(name, { target: { value: "Mara" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "mara@halo.app" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(submit).toHaveBeenCalledWith({ name: "Mara", email: "mara@halo.app" });
  });
  it("shows server errors on FormField by name", () => {
    render(
      <Form errors={{ code: "Code expired" }}>
        <FormField name="code" label="Code">
          <input />
        </FormField>
      </Form>,
    );
    expect(screen.getByText("Code expired")).toBeTruthy();
  });
});

describe("ResizablePanels", () => {
  it("resizes with the arrow keys within the limits", () => {
    render(<ResizablePanels panels={["A", "B"]} labels={["Left"]} />);
    const h = screen.getByRole("separator", { name: "Resize Left" });
    expect(h.getAttribute("aria-valuenow")).toBe("50");
    fireEvent.keyDown(h, { key: "ArrowRight" });
    expect(h.getAttribute("aria-valuenow")).toBe("52");
    fireEvent.keyDown(h, { key: "End" });
    expect(h.getAttribute("aria-valuenow")).toBe("90");
  });
});

describe("Carousel", () => {
  it("moves with next and the dots", () => {
    render(<Carousel label="Products" slides={["One", "Two", "Three"]} />);
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(screen.getByRole("button", { name: "Go to slide 2" }).getAttribute("aria-current")).toBe(
      "true",
    );
    expect(screen.getAllByRole("group")[0]?.getAttribute("aria-label")).toBe("1 of 3");
  });
});

describe("HoverCard", () => {
  it("opens on focus and closes on Escape", () => {
    vi.useFakeTimers();
    render(<HoverCard trigger={<button type="button">@mara</button>}>Mara Ellis</HoverCard>);
    const t = screen.getByRole("button", { name: "@mara" });
    fireEvent.focus(t);
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.getByText("Mara Ellis")).toBeTruthy();
    fireEvent.keyDown(t, { key: "Escape" });
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.queryByText("Mara Ellis")).toBeNull();
  });
});

describe("Sidebar", () => {
  it("opens nested pages, picks and collapses", () => {
    const pick = vi.fn();
    render(
      <Sidebar
        onPick={pick}
        groups={[
          {
            items: [
              { label: "Home", icon: "home" },
              { label: "Billing", icon: "card", items: [{ label: "Invoices", icon: "file" }] },
            ],
          },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Billing/ }));
    fireEvent.click(screen.getByRole("button", { name: "Invoices" }));
    expect(pick).toHaveBeenCalledWith("Invoices");
    fireEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    expect(screen.getByRole("navigation").className).toContain("collapsed");
  });
});

describe("asChild", () => {
  it("renders a link with the button look", () => {
    render(
      <>
        <Button asChild icon="send">
          <a href="/start">Get started</a>
        </Button>
        <IconButton asChild icon="code" label="GitHub">
          <a href="/gh" />
        </IconButton>
      </>,
    );
    const a = screen.getByRole("link", { name: "Get started" });
    expect(a.className).toContain("tf-btn");
    expect(a.getAttribute("href")).toBe("/start");
    expect(screen.getByRole("link", { name: "GitHub" }).className).toContain("tf-iconbtn");
  });
});

describe("CommandPalette and Drawer", () => {
  it("shows loading and a custom empty state", () => {
    const { rerender } = render(<CommandPalette inline items={[]} loading />);
    expect(screen.getByText(/Searching/)).toBeTruthy();
    rerender(<CommandPalette inline items={[]} empty="No commands yet" />);
    expect(screen.getByText("No commands yet")).toBeTruthy();
  });
  it("slides in from the requested side", () => {
    render(<Drawer inline side="bottom" title="Filters" />);
    expect(screen.getByRole("dialog", { name: "Filters" }).className).toContain("side-bottom");
  });
});
