// @vitest-environment jsdom
/** 0.10: visually hidden field labels, IconButton as a link, AppShell fill, new kit icons. */
import * as React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { IconButton } from "./foundation.js";
import { Input, Select, Textarea } from "./inputs.js";
import { NumberInput, TextField } from "./forms.js";
import { SelectMenu } from "./select-menu.js";
import { AppShell } from "./shell.js";
import { ICON_PATHS } from "../icons.js";

afterEach(cleanup);

describe("hideLabel", () => {
  it("keeps the label as the accessible name but hides it visually", () => {
    render(
      <>
        <Input label="Search customers" hideLabel />
        <Select label="Status" options={["All", "Open"]} hideLabel />
        <Textarea label="Note" hideLabel />
        <TextField label="Email" hideLabel />
        <NumberInput label="Seats" hideLabel />
        <SelectMenu label="Plan" options={["Free", "Pro"]} hideLabel />
        <Input label="Visible" />
      </>,
    );
    for (const name of ["Search customers", "Note", "Email"])
      expect(screen.getByRole("textbox", { name })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Status" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Seats" })).toBeTruthy();
    for (const text of ["Search customers", "Status", "Note", "Email", "Seats", "Plan"])
      expect(screen.getByText(text).closest(".tf-field-label")!.classList).toContain("tf-sr-only");
    expect(screen.getByText("Visible").classList).not.toContain("tf-sr-only");
  });
});

describe("IconButton as a link", () => {
  it("renders a link with the label as name and tooltip", () => {
    render(<IconButton icon="chevronLeft" label="Back to orders" href="/orders" />);
    const link = screen.getByRole("link", { name: "Back to orders" });
    expect(link.getAttribute("href")).toBe("/orders");
    expect(link.getAttribute("title")).toBe("Back to orders");
    expect(link.classList).toContain("tf-iconbtn");
  });

  it("uses a router link through linkAs", () => {
    const RouterLink = React.forwardRef<HTMLAnchorElement, React.ComponentProps<"a">>(
      (props, ref) => <a ref={ref} data-router="yes" {...props} />,
    );
    render(<IconButton icon="chevronLeft" label="Back" href="/x" linkAs={RouterLink} />);
    expect(screen.getByRole("link", { name: "Back" }).getAttribute("data-router")).toBe("yes");
  });

  it("still renders a button without href", () => {
    render(<IconButton icon="x" label="Close" />);
    expect(screen.getByRole("button", { name: "Close" })).toBeTruthy();
  });
});

describe("AppShell fill and new icons", () => {
  it("marks the shell to fill the viewport only when asked", () => {
    const { container, rerender } = render(
      <AppShell navigation="sidebar" brand="Admin" fill dock={false}>
        content
      </AppShell>,
    );
    expect(container.querySelector(".tf-shell")!.classList).toContain("tf-shell-fill");
    rerender(
      <AppShell navigation="sidebar" brand="Admin" dock={false}>
        content
      </AppShell>,
    );
    expect(container.querySelector(".tf-shell")!.classList).not.toContain("tf-shell-fill");
  });

  it("has volume, volumeOff, trophy and receipt in the kit's own set", () => {
    for (const n of ["volume", "volumeOff", "trophy", "receipt"])
      expect(n in ICON_PATHS).toBe(true);
  });
});
