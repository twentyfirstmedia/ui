// @vitest-environment jsdom
/** CookieConsent, Gallery, CountUp, PlanCard and FloatingLayout additions. */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CookieConsent } from "./site.js";
import { Gallery } from "./media.js";
import { CountUp } from "./data-display.js";
import { PlanCard } from "./commerce.js";
import { FloatingLayout } from "./shell.js";

afterEach(cleanup);

describe("feedback and media", () => {
  it("CookieConsent: equal choice, id and description, links in categories", () => {
    render(
      <CookieConsent
        id="consent"
        equalChoice
        categories={[{ id: "stats", label: "Statistics", text: <a href="#more">Details</a> }]}
      />,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.id).toBe("consent");
    expect(dialog.getAttribute("aria-describedby")).toBe("consent-text");
    const accept = screen.getByRole("button", { name: "Accept all" });
    const necessary = screen.getByRole("button", { name: "Only necessary" });
    expect(accept.className).toBe(necessary.className);
    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    expect(screen.getByRole("link", { name: "Details" })).toBeTruthy();
  });

  it("Gallery: controlled index, a label, arrow keys and focus into and back from the lightbox", () => {
    const change = vi.fn();
    const items = [{ alt: "Front" }, { alt: "Garden" }, { alt: "Kitchen" }];
    render(<Gallery label="Flat 4 photos" items={items} index={1} onIndexChange={change} />);
    expect(screen.getByRole("group", { name: "Flat 4 photos" })).toBeTruthy();
    const tabs = screen.getAllByRole("tab");
    expect(tabs[1]?.getAttribute("aria-selected")).toBe("true");
    tabs[1]!.focus();
    fireEvent.keyDown(tabs[1]!, { key: "ArrowRight" });
    expect(change).toHaveBeenCalledWith(2);
    const full = screen.getByRole("button", { name: "Full screen" });
    fireEvent.click(full);
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Close");
    fireEvent.keyDown(document, { key: "Escape" });
    // the button is rendered again after the lightbox closes
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Full screen" }));
  });

  it("CountUp renders the final value on the server", () => {
    expect(renderToString(<CountUp value="€48,210" />)).toContain("€48,210");
    render(<CountUp value={12} animate={false} />);
    expect(screen.getByText("12")).toBeTruthy();
  });

  it("PlanCard: a price node with prefix and note, a link action, the current badge", () => {
    const { rerender } = render(
      <PlanCard
        name="Pro"
        price="—"
        pricePrefix="from"
        priceNote="plus VAT, billed yearly"
        href="/checkout/pro"
      />,
    );
    expect(screen.getByText("—")).toBeTruthy();
    expect(screen.getByText("plus VAT, billed yearly")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Pro/ }).getAttribute("href")).toBe("/checkout/pro");
    rerender(<PlanCard name="Pro" price={29} current />);
    expect(screen.getAllByText("Current plan").length).toBe(2);
  });

  it("FloatingLayout: controls, attribution, side widths and the sheet handle", () => {
    const { container } = render(
      <FloatingLayout
        label="Map"
        endWidth={380}
        controls={<button>Zoom in</button>}
        attribution="© OpenStreetMap contributors"
        end={<p>Details</p>}
      />,
    );
    expect(container.querySelector(".tf-floating-controls")?.textContent).toContain("Zoom in");
    expect(screen.getByText("© OpenStreetMap contributors")).toBeTruthy();
    const root = screen.getByRole("region", { name: "Map" });
    expect(root.style.getPropertyValue("--floating-end")).toBe("380px");
    const handle = screen.getByRole("button", { name: "Expand panel" });
    fireEvent.click(handle);
    expect(root.className).toContain("sheet-full");
  });
});
