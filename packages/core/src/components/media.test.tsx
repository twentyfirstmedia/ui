// @vitest-environment jsdom
/** Gallery and BeforeAfter: lazy images, referrer policy, slider name and value text. */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BeforeAfter, Gallery } from "./media.js";

afterEach(cleanup);

const items = [
  { src: "https://img.example/a.jpg", alt: "Front" },
  { src: "https://img.example/b.jpg", alt: "Garden" },
];

describe("Gallery", () => {
  it("loads lazily and passes the referrer policy to every image", () => {
    const { container } = render(<Gallery items={items} referrerPolicy="no-referrer" />);
    const imgs = [...container.querySelectorAll("img")];
    expect(imgs.length).toBe(3); // stage + two thumbnails
    for (const img of imgs) {
      expect(img.getAttribute("loading")).toBe("lazy");
      expect(img.getAttribute("referrerpolicy")).toBe("no-referrer");
      expect(img.getAttribute("decoding")).toBe("async");
    }
  });

  it("loading eager applies to the main image; thumbnails stay lazy", () => {
    const { container } = render(<Gallery items={items} loading="eager" />);
    expect(container.querySelector(".tf-gallery-stage img")?.getAttribute("loading")).toBe("eager");
    expect(container.querySelector(".tf-gallery-thumb")?.getAttribute("loading")).toBe("lazy");
    expect(container.querySelector("img")?.hasAttribute("referrerpolicy")).toBe(false);
  });
});

describe("BeforeAfter", () => {
  it("has a value text from its labels and keyboard steps, Home and End", () => {
    render(
      <BeforeAfter
        before={{ src: "a.jpg" }}
        after={{ src: "b.jpg" }}
        beforeLabel="1990"
        afterLabel="2024"
        start={40}
        referrerPolicy="no-referrer"
      />,
    );
    const s = screen.getByRole("slider", { name: "Compare before and after" });
    expect(s.getAttribute("aria-valuetext")).toBe("1990 40%, 2024 60%");
    fireEvent.keyDown(s, { key: "ArrowRight" });
    expect(s.getAttribute("aria-valuenow")).toBe("45");
    fireEvent.keyDown(s, { key: "End" });
    expect(s.getAttribute("aria-valuenow")).toBe("100");
    fireEvent.keyDown(s, { key: "Home" });
    expect(s.getAttribute("aria-valuetext")).toBe("1990 0%, 2024 100%");
  });

  it("takes its own label and value text", () => {
    const { container } = render(
      <BeforeAfter
        before={{ src: "a.jpg" }}
        after={{ src: "b.jpg" }}
        label="Vorher und nachher vergleichen"
        valueText={(p) => `${p} Prozent vorher`}
      />,
    );
    const s = screen.getByRole("slider", { name: "Vorher und nachher vergleichen" });
    expect(s.getAttribute("aria-valuetext")).toBe("50 Prozent vorher");
    for (const img of container.querySelectorAll("img"))
      expect(img.getAttribute("loading")).toBe("lazy");
  });
});
