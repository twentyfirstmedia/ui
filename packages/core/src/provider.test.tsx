// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { useState } from "react";
import { formatMoney, formatPercent } from "./format.js";
import { UIProvider } from "./provider.js";
import { Portal } from "./portal.js";

afterEach(() => {
  cleanup();
  for (const a of ["data-kit", "data-theme", "data-density"])
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
});
