// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { useState } from "react";
import { formatMoney, formatPercent } from "./format.js";
import { UIProvider } from "./provider.js";
import { Portal } from "./portal.js";
import {
  Ambient,
  AppShell,
  Card,
  Dock,
  FloatingLayout,
  MapView,
  Panel,
} from "./components/index.js";

afterEach(() => {
  cleanup();
  for (const a of ["data-kit", "data-theme", "data-density", "data-surface"])
    document.documentElement.removeAttribute(a);
});

function Text() {
  return (
    <p>
      Copy · {formatMoney(1240)} · {formatPercent(19)}
    </p>
  );
}

describe("UIProvider", () => {
  it("formats numbers in English with euros by default", () => {
    render(<Text />);
    expect(screen.getByText("Copy · €1,240 · 19%")).toBeTruthy();
  });

  it("sets kit, theme and density on <html> by default", () => {
    render(
      <UIProvider kit="pro" theme="dark" density="compact">
        <Text />
      </UIProvider>,
    );
    const el = document.documentElement;
    expect([el.dataset.kit, el.dataset.theme, el.dataset.density]).toEqual([
      "pro",
      "dark",
      "compact",
    ]);
  });

  it("keeps state when the theme or kit changes", () => {
    let setTheme: (v: "light" | "dark") => void = () => {};
    function Counter() {
      const [n, setN] = useState(0);
      return (
        <button type="button" onClick={() => setN(n + 1)}>
          Count {n}
        </button>
      );
    }
    function App() {
      const [theme, st] = useState<"light" | "dark">("light");
      setTheme = st;
      return (
        <UIProvider theme={theme}>
          <Counter />
        </UIProvider>
      );
    }
    render(<App />);
    act(() => screen.getByRole("button").click());
    act(() => setTheme("dark"));
    expect(screen.getByRole("button").textContent).toBe("Count 1");
  });

  it("subtree scope carries the attributes and hosts portals", () => {
    const { container } = render(
      <UIProvider scope="subtree" kit="halo" theme="light">
        <Portal>
          <span>in portal</span>
        </Portal>
      </UIProvider>,
    );
    const root = container.querySelector("[data-kit]") as HTMLElement;
    expect(root.dataset.kit).toBe("halo");
    expect(document.documentElement.dataset.kit).toBeUndefined();
    expect(root.querySelector("[data-tf-portal]")?.textContent).toBe("in portal");
  });

  it("glass: surface on the document, on a subtree, and on single components", () => {
    const doc = render(<UIProvider surface="glass" />);
    expect(document.documentElement.dataset.surface).toBe("glass");
    doc.rerender(<UIProvider />);
    expect(document.documentElement.dataset.surface).toBeUndefined();
    cleanup();

    const { container } = render(
      <UIProvider scope="subtree" kit="pro" surface="glass">
        <Panel title="Layers" surface="solid" />
        <Card title="Place" surface="glass" />
        <Dock items={[{ icon: "search", label: "Search" }]} surface="glass" className="x" />
        <MapView surface="glass" legend="Legend" controls={<b>+</b>} height="100%" />
      </UIProvider>,
    );
    expect((container.firstChild as HTMLElement).dataset.surface).toBe("glass");
    expect(container.querySelector(".tf-panel")?.classList.contains("tf-solid")).toBe(true);
    expect(container.querySelector(".tf-card")?.classList.contains("tf-glass")).toBe(true);
    expect(container.querySelector(".tf-dock")?.className).toBe("tf-dock tf-glass x");
    expect(container.querySelector(".tf-map-legend")?.classList.contains("tf-glass")).toBe(true);
    expect(container.querySelector(".tf-map-ctl")?.classList.contains("tf-glass")).toBe(true);
    expect((container.querySelector(".tf-map") as HTMLElement).style.height).toBe("100%");
  });

  it("a subtree with its own tokens gets a theme, so derived colours follow them", () => {
    const { container } = render(
      <UIProvider scope="subtree" kit="halo" theme="dark">
        <UIProvider scope="subtree" tokens={{ card: "#101010" }}>
          <span>inner</span>
        </UIProvider>
        <UIProvider scope="subtree" kit="pro" tokens={{ card: "#101010" }} />
        <UIProvider scope="subtree" kit="pro" />
      </UIProvider>,
    );
    const [outer, inherits, proDefault, plain] = [
      ...container.querySelectorAll<HTMLElement>("[data-kit], [style]"),
    ];
    expect(outer?.dataset.theme).toBe("dark");
    // the nested subtree takes the outer theme instead of staying without one
    expect(inherits?.dataset.theme).toBe("dark");
    expect(inherits?.style.getPropertyValue("--card")).toBe("#101010");
    expect(proDefault?.dataset.theme).toBe("dark");
    // without tokens nothing is added
    expect(plain?.dataset.theme).toBeUndefined();
  });

  it("FloatingLayout: slots over a background, glass unless asked otherwise", () => {
    const { container, rerender } = render(
      <FloatingLayout
        label="Map"
        height={480}
        background={<i className="bg" />}
        top={<b>top</b>}
        start={<b>start</b>}
        end={<b>end</b>}
        bottom={<b>bottom</b>}
      />,
    );
    const root = container.querySelector(".tf-floating") as HTMLElement;
    expect(root.getAttribute("role")).toBe("region");
    expect(root.getAttribute("aria-label")).toBe("Map");
    expect(root.dataset.surface).toBe("glass");
    expect(root.style.minHeight).toBe("480px");
    expect(root.querySelector(".tf-floating-bg .bg")).toBeTruthy();
    for (const s of ["top", "start", "end", "bottom"])
      expect(root.querySelector(`.tf-floating-${s}`)?.textContent).toBe(s);
    rerender(<FloatingLayout surface="solid" top={<b>top</b>} />);
    expect((container.querySelector(".tf-floating") as HTMLElement).dataset.surface).toBe("solid");
    expect(container.querySelector(".tf-floating-start")).toBeNull();
  });

  it("Ambient: kit fields by default, own colours, media, still or paused off screen", () => {
    let fire: ((e: { isIntersecting: boolean }[]) => void) | undefined;
    class IO {
      constructor(cb: (e: { isIntersecting: boolean }[]) => void) {
        fire = cb;
      }
      observe() {}
      disconnect() {}
    }
    const orig = (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver;
    (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = IO;
    const { container, rerender } = render(<Ambient />);
    const root = container.querySelector(".tf-ambient") as HTMLElement;
    expect(root.getAttribute("aria-hidden")).toBe("true");
    const fields = root.querySelectorAll<HTMLElement>(".tf-ambient-field");
    expect(fields).toHaveLength(4);
    expect(fields[0]?.style.getPropertyValue("--field")).toBe("var(--ambient-1)");
    act(() => fire?.([{ isIntersecting: false }]));
    expect(root.hasAttribute("data-paused")).toBe(true);
    act(() => fire?.([{ isIntersecting: true }]));
    expect(root.hasAttribute("data-paused")).toBe(false);
    rerender(<Ambient colors={["#ff8a00", "#e52e71"]} animate={false} fixed />);
    const r2 = container.querySelector(".tf-ambient") as HTMLElement;
    expect(r2.className).toBe("tf-ambient fixed still");
    expect(r2.querySelectorAll(".tf-ambient-field")).toHaveLength(2);
    rerender(<Ambient src="/beach.jpg" />);
    expect(container.querySelector("img.tf-ambient-media")?.getAttribute("src")).toBe("/beach.jpg");
    expect(container.querySelector(".tf-ambient")?.classList.contains("media")).toBe(true);
    rerender(<Ambient src="/waves.mp4" video />);
    const v = container.querySelector("video.tf-ambient-media") as HTMLVideoElement;
    expect(v.muted).toBe(true);
    rerender(
      <Ambient>
        <canvas />
      </Ambient>,
    );
    expect(container.querySelector(".tf-ambient canvas")).toBeTruthy();
    (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = orig;
  });

  it("AppShell passes className to its root", () => {
    const { container } = render(<AppShell className="mine" dock={false} />);
    expect(container.querySelector(".tf-shell")?.classList.contains("mine")).toBe(true);
  });
});
