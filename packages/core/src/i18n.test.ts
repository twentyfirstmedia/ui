import { afterEach, describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { L, Lx, formatDate, formatMoney, formatNumber, setLabels, setLocale } from "./i18n.js";

afterEach(() => {
  setLabels({}, true);
  setLocale(undefined, { currency: "EUR", weekStart: 1 });
});

describe("labels", () => {
  it("falls back to the English key and fills placeholders", () => {
    expect(L("Remove {name}", { name: "Mara" })).toBe("Remove Mara");
    expect(L("Missing {x}")).toBe("Missing {x}");
    expect(L("Missing {x}", {})).toBe("Missing ");
  });

  it("uses mapped text, merging unless replace is set", () => {
    setLabels({ Copy: "Kopieren", "Remove {name}": "{name} entfernen" });
    setLabels({ Undo: "Rückgängig" });
    expect(L("Copy")).toBe("Kopieren");
    expect(L("Remove {name}", { name: "Mara" })).toBe("Mara entfernen");
    setLabels({ Undo: "Rückgängig" }, true);
    expect(L("Copy")).toBe("Copy");
  });

  it("Lx puts React nodes into slots", () => {
    setLabels({ "Type {word} to confirm": "Tippe {word} zur Bestätigung" });
    const html = renderToStaticMarkup(
      createElement(
        "p",
        null,
        Lx("Type {word} to confirm", { word: createElement("b", null, "RESET") }),
      ),
    );
    expect(html).toBe("<p>Tippe <b>RESET</b> zur Bestätigung</p>");
  });
});

describe("formatters", () => {
  it("follow the configured locale and currency", () => {
    setLocale("de-DE", { currency: "EUR" });
    expect(formatNumber(48210)).toBe("48.210");
    expect(formatMoney(1240)).toBe("1.240\u00a0€");
    expect(formatMoney(1240.5)).toBe("1.240,50\u00a0€");
    expect(formatDate(new Date(2026, 3, 14))).toBe("14.04.2026");
    setLocale("en-US", { currency: "USD" });
    expect(formatMoney(48210)).toBe("$48,210");
    expect(formatMoney(10, "EUR")).toBe("€10");
  });
});
