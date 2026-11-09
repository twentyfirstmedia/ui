// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { UIProvider } from "./provider.js";
import { startViewTransition, useMotion } from "./motion.js";
import { toast, getToasts } from "./toast-store.js";
import { CountUp, Drawer, Modal, Stagger } from "./components/index.js";

const root = document.documentElement;

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  root.style.removeProperty("--dur-exit");
  root.removeAttribute("data-motion");
  toast.clear();
});

describe("motion", () => {
  it("UIProvider sets data-motion on the document and on a subtree", () => {
    const doc = render(<UIProvider motion="expressive" />);
    expect(root.dataset.motion).toBe("expressive");
    doc.rerender(<UIProvider />);
    expect(root.dataset.motion).toBeUndefined();
    cleanup();
    const { container } = render(
      <UIProvider scope="subtree" motion="off">
        <span />
      </UIProvider>,
    );
    expect((container.firstChild as HTMLElement).dataset.motion).toBe("off");
  });

  it("useMotion reports the provider's level", () => {
    function Level() {
      return <b>{useMotion()}</b>;
    }
    render(
      <UIProvider scope="subtree" motion="expressive">
        <Level />
      </UIProvider>,
    );
    expect(screen.getByText("expressive")).toBeTruthy();
    cleanup();
    render(<Level />);
    expect(screen.getByText("standard")).toBeTruthy();
  });

  it("a closing dialog stays for --dur-exit, inert and marked, then leaves", () => {
    root.style.setProperty("--dur-exit", "200ms");
    const { rerender, container } = render(<Modal open title="Delete" />);
    rerender(<Modal open={false} title="Delete" />);
    const wrap = container.querySelector(".tf-modal-wrap") as HTMLElement;
    expect(wrap).toBeTruthy();
    expect(wrap.hasAttribute("data-closing")).toBe(true);
    expect(wrap.hasAttribute("inert")).toBe(true);
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(container.querySelector(".tf-modal-wrap")).toBeNull();
  });

  it("reopening during the exit keeps the layer", () => {
    root.style.setProperty("--dur-exit", "200ms");
    const { rerender, container } = render(<Drawer open title="Details" />);
    rerender(<Drawer open={false} title="Details" />);
    rerender(<Drawer open title="Details" />);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    const wrap = container.querySelector(".tf-drawer-wrap") as HTMLElement;
    expect(wrap).toBeTruthy();
    expect(wrap.hasAttribute("data-closing")).toBe(false);
  });

  it("with motion off or no exit duration, layers leave at once", () => {
    const a = render(<Modal open title="A" />);
    a.rerender(<Modal open={false} title="A" />);
    expect(a.container.querySelector(".tf-modal-wrap")).toBeNull();
    cleanup();
    root.style.setProperty("--dur-exit", "200ms");
    root.setAttribute("data-motion", "off");
    const b = render(<Modal open title="B" />);
    b.rerender(<Modal open={false} title="B" />);
    expect(b.container.querySelector(".tf-modal-wrap")).toBeNull();
  });

  it("Modal and Drawer without `open` render as before", () => {
    const { container } = render(
      <>
        <Modal title="Always" />
        <Drawer title="Always" />
      </>,
    );
    expect(container.querySelector(".tf-modal-wrap")).toBeTruthy();
    expect(container.querySelector(".tf-drawer-wrap")).toBeTruthy();
  });

  it("toasts animate out before they leave the list", () => {
    root.style.setProperty("--dur-exit", "160ms");
    const id = toast("Saved");
    toast.dismiss(id);
    expect(getToasts()[0]?.leaving).toBe(true);
    vi.advanceTimersByTime(200);
    expect(getToasts()).toHaveLength(0);
  });

  it("CountUp shows the value at once when motion is off", () => {
    render(
      <UIProvider scope="subtree" motion="off">
        <CountUp value="€48,210" />
      </UIProvider>,
    );
    expect(screen.getByText("€48,210")).toBeTruthy();
  });

  it("a Stagger below the fold waits until it scrolls into view", () => {
    let fire: ((e: { isIntersecting: boolean }[]) => void) | undefined;
    class IO {
      constructor(cb: (e: { isIntersecting: boolean }[]) => void) {
        fire = cb;
      }
      observe() {}
      disconnect() {}
    }
    vi.stubGlobal("IntersectionObserver", IO);
    const rect = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({ top: 5000 } as DOMRect);
    const { container } = render(
      <Stagger>
        <div>one</div>
      </Stagger>,
    );
    const el = container.querySelector(".tf-stagger") as HTMLElement;
    expect(el.dataset.reveal).toBe("waiting");
    act(() => fire?.([{ isIntersecting: true }]));
    expect(el.dataset.reveal).toBeUndefined();
    rect.mockRestore();
    vi.unstubAllGlobals();
  });

  it("startViewTransition uses the browser's view transitions when there are any", async () => {
    const update = vi.fn();
    await startViewTransition(update);
    expect(update).toHaveBeenCalledTimes(1);
    const start = vi.fn((cb: () => void) => {
      cb();
      return { finished: Promise.resolve() };
    });
    (document as unknown as { startViewTransition: typeof start }).startViewTransition = start;
    await startViewTransition(update);
    expect(start).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledTimes(2);
    delete (document as unknown as { startViewTransition?: unknown }).startViewTransition;
  });
});
