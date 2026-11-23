// @vitest-environment jsdom
/** Focus trap of overlays that are mounted closed and opened later through `open`. */
import * as React from "react";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { CommandPalette, Drawer } from "./workspace.js";
import { ConfirmDialog, Modal } from "./feedback.js";

afterEach(cleanup);

// jsdom has no layout, so every offsetParent is null; the trap skips elements without one (hidden
// ones), so give connected elements their parent as offsetParent for these tests
const desc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetParent");
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "offsetParent", {
    configurable: true,
    get(this: HTMLElement) {
      return this.isConnected ? this.parentElement : null;
    },
  });
});
afterAll(() => {
  if (desc) Object.defineProperty(HTMLElement.prototype, "offsetParent", desc);
});

function Harness(p: { kind: "palette" | "modal" | "confirm" | "drawer" }) {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      {p.kind === "palette" && (
        <CommandPalette
          open={open}
          onClose={close}
          items={[
            { label: "Customers", run: () => {} },
            { label: "Orders", run: () => {} },
          ]}
        />
      )}
      {p.kind === "modal" && (
        <Modal
          open={open}
          title="Rename"
          onClose={close}
          actions={[
            <button key="save" type="button">
              Save
            </button>,
          ]}
        >
          <input aria-label="Name" />
        </Modal>
      )}
      {p.kind === "confirm" && (
        <ConfirmDialog open={open} title="Delete?" onCancel={close} onConfirm={close} danger />
      )}
      {p.kind === "drawer" && (
        <Drawer open={open} title="Details" onClose={close}>
          <button type="button">Inside</button>
        </Drawer>
      )}
    </>
  );
}

async function openWith(kind: "palette" | "modal" | "confirm" | "drawer") {
  render(<Harness kind={kind} />);
  const trigger = screen.getByRole("button", { name: "Open" });
  trigger.focus();
  await act(async () => {
    fireEvent.click(trigger);
  });
  return trigger;
}

describe("focus trap with the open prop", () => {
  it("CommandPalette: focus moves to its input on open and back to the trigger on close", async () => {
    const trigger = await openWith("palette");
    const input = await screen.findByRole("textbox", { name: "Search" });
    await waitFor(() => expect(document.activeElement).toBe(input));
    fireEvent.keyDown(input, { key: "Escape" });
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("Modal: focus moves in, Tab wraps inside, Escape closes and returns focus", async () => {
    const trigger = await openWith("modal");
    const name = await screen.findByRole("textbox", { name: "Name" });
    await waitFor(() => expect(document.activeElement).toBe(name));
    const save = screen.getByRole("button", { name: "Save" });
    save.focus();
    fireEvent.keyDown(save, { key: "Tab" });
    expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);
    expect(document.activeElement).not.toBe(save);
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("ConfirmDialog (in a portal): focus starts on Cancel and returns on cancel", async () => {
    const trigger = await openWith("confirm");
    const cancel = await screen.findByRole("button", { name: "Cancel" });
    await waitFor(() => expect(document.activeElement).toBe(cancel));
    fireEvent.keyDown(cancel, { key: "Escape" });
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("Drawer: focus moves in on open and back on close", async () => {
    const trigger = await openWith("drawer");
    const dialog = await screen.findByRole("dialog", { name: "Details" });
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});
