// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { useState } from "react";
import { L, formatMoney, setLabels, setLocale } from "./i18n.js";
import { UIProvider } from "./provider.js";
import { Portal } from "./portal.js";

afterEach(() => {
  cleanup();
  setLabels({}, true);
  setLocale(undefined, {});
  for (const a of ["data-kit", "data-theme", "data-density"])
    document.documentElement.removeAttribute(a);
});

function Text() {
  return (
    <p>
      {L("Copy")} · {formatMoney(1240)}
    </p>
  );
}

describe("UIProvider", () => {
  it("applies labels and locale before the first render", () => {
    render(
      <UIProvider labels={{ Copy: "Kopieren" }} locale="de-DE" currency="EUR">
        <Text />
      </UIProvider>,
    );
    expect(screen.getByText("Kopieren · 1.240 €")).toBeTruthy();
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

  it("updates text when the locale changes and keeps state on theme changes", () => {
    let setLang: (v: string) => void = () => {};
    let setTheme: (v: "light" | "dark") => void = () => {};
    function Counter() {
      const [n, setN] = useState(0);
      return (
        <button type="button" onClick={() => setN(n + 1)}>
          {L("Copy")} {n}
        </button>
      );
    }
    function App() {
      const [lang, sl] = useState("en");
      const [theme, st] = useState<"light" | "dark">("light");
      setLang = sl;
      setTheme = st;
      return (
        <UIProvider theme={theme} {...(lang === "de" ? { labels: { Copy: "Kopieren" } } : {})}>
          <Counter />
        </UIProvider>
      );
    }
    render(<App />);
    act(() => screen.getByRole("button").click());
    expect(screen.getByRole("button").textContent).toBe("Copy 1");
    act(() => setTheme("dark"));
    expect(screen.getByRole("button").textContent).toBe("Copy 1");
    act(() => setLang("de"));
    expect(screen.getByRole("button").textContent).toBe("Kopieren 0");
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
