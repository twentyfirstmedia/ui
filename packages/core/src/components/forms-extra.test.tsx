// @vitest-environment jsdom
/** Form inputs: password reveal, action slot, search shortcut, OTP reset, FileDrop, TilePicker, QR. */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FileDrop, OtpInput, TextField } from "./forms.js";
import { SearchField } from "./inputs.js";
import { TilePicker, TwoFactorSetup } from "./admin.js";
import { QrCode } from "./qr-code.js";
import { IconButton } from "./foundation.js";
import type { OtpInputHandle } from "./types.js";

afterEach(cleanup);

describe("form inputs", () => {
  it("TextField password: the reveal button shows and hides it", () => {
    render(<TextField label="Password" type="password" defaultValue="secret" />);
    const input = screen.getByLabelText("Password") as HTMLInputElement;
    expect(input.type).toBe("password");
    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(input.type).toBe("text");
    expect(screen.getByRole("button", { name: "Hide password" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
  });

  it("TextField action stays clickable next to an error", () => {
    const clear = vi.fn();
    render(
      <TextField
        label="Search"
        error="Required"
        action={<IconButton icon="x" label="Clear" size="sm" onClick={clear} />}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(clear).toHaveBeenCalled();
  });

  it("SearchField forwards id, name and ARIA, and binds ⌘K outside text fields", () => {
    const key = vi.fn();
    render(
      <>
        <input aria-label="Other" />
        <SearchField
          id="q"
          name="q"
          shortcut="⌘K"
          bindShortcut
          onKeyDown={key}
          inputProps={{ role: "combobox", "aria-controls": "list", "aria-expanded": false }}
        />
      </>,
    );
    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.id).toBe("q");
    expect(input.name).toBe("q");
    expect(input.getAttribute("aria-controls")).toBe("list");
    fireEvent.keyDown(input, { key: "a" });
    expect(key).toHaveBeenCalled();
    fireEvent.keyDown(document.body, { key: "k", metaKey: true });
    expect(document.activeElement).toBe(input);
    const other = screen.getByRole("textbox", { name: "Other" });
    other.focus();
    fireEvent.keyDown(other, { key: "k", ctrlKey: true });
    expect(document.activeElement).toBe(other);
  });

  it("OtpInput empties its cells on an error and through its handle", () => {
    const ref = React.createRef<OtpInputHandle>();
    const { rerender } = render(<OtpInput ref={ref} length={4} />);
    const cells = screen.getAllByRole("textbox") as HTMLInputElement[];
    cells.forEach((c, i) => fireEvent.change(c, { target: { value: String(i + 1) } }));
    expect(cells.map((c) => c.value).join("")).toBe("1234");
    rerender(<OtpInput ref={ref} length={4} error />);
    expect(cells.map((c) => c.value).join("")).toBe("");
    fireEvent.change(cells[0]!, { target: { value: "7" } });
    act(() => ref.current?.reset());
    expect(cells[0]!.value).toBe("");
  });

  it("FileDrop: disabled, a form name, and files the app refuses are not listed", () => {
    const { container, rerender } = render(<FileDrop name="docs" onFiles={() => false} />);
    expect(container.querySelector('input[type="file"][name="docs"]')).toBeTruthy();
    const picker = container.querySelector('input[type="file"]:not([name])') as HTMLInputElement;
    const file = new File(["x"], "plan.pdf", { type: "application/pdf" });
    fireEvent.change(picker, { target: { files: [file] } });
    expect(screen.queryByText("plan.pdf")).toBeNull();
    rerender(<FileDrop disabled />);
    expect(screen.getByRole("button").getAttribute("aria-disabled")).toBe("true");
  });

  it("TilePicker list layout", () => {
    const { container } = render(
      <TilePicker
        label="Type"
        layout="list"
        options={[{ value: "a", label: "Flat", icon: "home" }]}
      />,
    );
    expect(container.querySelector(".tf-tiles")?.className).toContain("list");
  });

  it("QrCode draws an SVG; TwoFactorSetup uses it and offers to trust the device", () => {
    const { container } = render(<QrCode value="otpauth://totp/x?secret=ABC" label="Scan me" />);
    expect(screen.getByRole("img", { name: "Scan me" }).tagName.toLowerCase()).toBe("svg");
    expect(container.querySelector("path")?.getAttribute("d")?.length).toBeGreaterThan(100);
    cleanup();
    const trust = vi.fn();
    render(
      <TwoFactorSetup
        secret="JBSWY3DPEHPK3PXP"
        qrValue="otpauth://totp/x?secret=JBSWY3DPEHPK3PXP"
        trustDevice
        onTrustChange={trust}
        step={1}
      />,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Trust this device" }));
    expect(trust).toHaveBeenCalledWith(true);
  });
});
