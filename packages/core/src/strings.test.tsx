// @vitest-environment jsdom
/** Built-in strings and the locale: `UIProvider messages` / `locale`, `useUIStrings`, `useFormat`. */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { formatLike, formatMoney, formatNumber, parseFormatted } from "./format.js";
import { UIProvider, useFormat, useUIStrings } from "./provider.js";
import { DEFAULT_STRINGS, mergeStrings } from "./strings.js";
import {
  AgentStatus,
  BeforeAfter,
  Composer,
  CountUp,
  DataTable,
  Form,
  Gallery,
  ListingCard,
  Modal,
  Pagination,
  TagInput,
  TextField,
} from "./components/index.js";

const HERE = dirname(fileURLToPath(import.meta.url));

beforeAll(() => {
  window.matchMedia ??= ((q: string) => ({
    matches: false,
    media: q,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  Element.prototype.scrollIntoView ??= () => {};
});
afterEach(cleanup);

const de = {
  close: "Schließen",
  send: "Senden",
  stop: "Stopp",
  composerHint: "Enter zum Senden",
  selectedCount: (n: number) => `${n} ausgewählt`,
  bulkActions: "Sammelaktionen",
  selectRow: "Zeile auswählen",
  clear: "Leeren",
  previousImage: "Vorheriges Bild",
  nextImage: "Nächstes Bild",
  images: "Bilder",
  compareBeforeAfter: "Vorher und nachher vergleichen",
  removeItem: (name: string) => `${name} entfernen`,
  rooms: (rooms: string) => `${rooms} Zimmer`,
  previousPage: "Vorherige Seite",
  nextPage: "Nächste Seite",
  fieldRequired: "Pflichtfeld",
  agentStatus: { Running: "Läuft" },
};

describe("format helpers", () => {
  it("stay en-US by default and take a locale as the last argument", () => {
    expect(formatNumber(1305.5)).toBe("1,305.5");
    expect(formatNumber(1305.5, undefined, "de-DE")).toBe("1.305,5");
    expect(formatMoney(13.05, "EUR", undefined, "de-DE")).toBe("13,05\u00a0€");
  });

  it("parseFormatted reads numbers in the given locale", () => {
    expect(parseFormatted("13,05 €/m²", "de-DE")).toEqual({
      prefix: "",
      value: 13.05,
      decimals: 2,
      grouped: false,
      suffix: " €/m²",
    });
    expect(parseFormatted("1.305 €", "de-DE")).toMatchObject({ value: 1305, grouped: true });
    expect(parseFormatted("€1,305.50", "en-US")).toMatchObject({
      prefix: "€",
      value: 1305.5,
      decimals: 2,
      grouped: true,
    });
    // fr-FR groups with a narrow no-break space
    expect(parseFormatted(formatNumber(1234567.8, undefined, "fr-FR"), "fr-FR")).toMatchObject({
      value: 1234567.8,
      grouped: true,
    });
    expect(parseFormatted("n/a")).toBeNull();
  });

  it("formatLike writes a number back in the same shape", () => {
    const shape = parseFormatted("13,05 €/m²", "de-DE");
    expect(shape && formatLike(7.5, shape, "de-DE")).toBe("7,50 €/m²");
    const en = parseFormatted("$1,305", "en-US");
    expect(en && formatLike(2500, en, "en-US")).toBe("$2,500");
  });
});

describe("UIProvider locale", () => {
  function Price() {
    const f = useFormat();
    return <p>{f.formatMoney(1240.5) + " · " + f.formatPercent(19) + " · " + f.locale}</p>;
  }

  it("formats in en-US without a provider and in the provider locale inside one", () => {
    render(<Price />);
    expect(screen.getByText("€1,240.50 · 19% · en-US")).toBeTruthy();
    cleanup();
    render(
      <UIProvider scope="subtree" locale="de-DE">
        <Price />
      </UIProvider>,
    );
    expect(screen.getByText("1.240,50 € · 19 % · de-DE")).toBeTruthy();
  });

  it("a nested provider keeps the locale of its parent", () => {
    render(
      <UIProvider scope="subtree" locale="de-DE">
        <UIProvider scope="subtree" theme="dark">
          <Price />
        </UIProvider>
      </UIProvider>,
    );
    expect(screen.getByText(/de-DE$/)).toBeTruthy();
  });

  it("CountUp reads values formatted for the provider locale", () => {
    render(
      <UIProvider scope="subtree" locale="de-DE" motion="off">
        <CountUp value="13,05 €/m²" />
        <CountUp value={1305.5} />
      </UIProvider>,
    );
    expect(screen.getByText("13,05 €/m²")).toBeTruthy();
    expect(screen.getByText("1305,5")).toBeTruthy();
  });

  it("CountUp animates German numbers through their real value", async () => {
    let frame: FrameRequestCallback | undefined;
    const raf = globalThis.requestAnimationFrame;
    globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      frame = cb;
      return 1;
    }) as typeof requestAnimationFrame;
    globalThis.cancelAnimationFrame ??= () => {};
    try {
      render(
        <UIProvider scope="subtree" locale="de-DE">
          <CountUp value="13,05 €/m²" duration={100} />
        </UIProvider>,
      );
      // starts at zero in the same shape, not at "1,305"
      expect(screen.getByText("0,00 €/m²")).toBeTruthy();
      await act(async () => frame?.(0));
      await act(async () => frame?.(50));
      const mid = parseFormatted(screen.getByText(/€\/m²$/).textContent ?? "", "de-DE");
      expect(mid && mid.value > 0 && mid.value < 13.05).toBe(true);
      await act(async () => frame?.(10_000));
      expect(screen.getByText("13,05 €/m²")).toBeTruthy();
    } finally {
      globalThis.requestAnimationFrame = raf;
    }
  });
});

describe("UIProvider messages", () => {
  function Label() {
    const t = useUIStrings();
    return <p>{[t.close, t.send, t.agentStatus.Running, t.agentStatus.Idle].join(" · ")}</p>;
  }

  it("defaults to English and replaces only what is given", () => {
    render(<Label />);
    expect(screen.getByText("Close · Send · Running · Idle")).toBeTruthy();
    cleanup();
    render(
      <UIProvider
        scope="subtree"
        messages={{ close: "Schließen", agentStatus: { Running: "Läuft" } }}
      >
        <Label />
      </UIProvider>,
    );
    // groups merge one level deep: Idle keeps its default
    expect(screen.getByText("Schließen · Send · Läuft · Idle")).toBeTruthy();
  });

  it("nested providers merge on top of the outer messages", () => {
    render(
      <UIProvider scope="subtree" messages={{ close: "Schließen", send: "Senden" }}>
        <UIProvider scope="subtree" messages={{ send: "Abschicken" }}>
          <Label />
        </UIProvider>
      </UIProvider>,
    );
    expect(screen.getByText("Schließen · Abschicken · Running · Idle")).toBeTruthy();
  });

  it("mergeStrings ignores undefined values", () => {
    const merged = mergeStrings(DEFAULT_STRINGS, { close: undefined, send: "Senden" });
    expect(merged.close).toBe("Close");
    expect(merged.send).toBe("Senden");
    expect(DEFAULT_STRINGS.send).toBe("Send");
  });

  it("reaches accessible names, button texts and validation messages", () => {
    const { container } = render(
      <UIProvider scope="subtree" locale="de-DE" messages={de}>
        <Modal title="Dialog" onClose={() => {}} />
        <Composer value="" onChange={() => {}} onStop={() => {}} busy />
        <Gallery items={[{ src: "a.jpg" }, { src: "b.jpg" }]} />
        <BeforeAfter before={{ src: "a.jpg" }} after={{ src: "b.jpg" }} />
        <TagInput defaultValue={["Altbau"]} />
        <Pagination total={3} />
        <AgentStatus status="Running" />
        <ListingCard listing={{ id: 1, title: "Wohnung", price: 450000, rooms: 3.5 }} />
        <DataTable
          selectable
          rowKey="id"
          columns={[{ key: "name", label: "Name" }]}
          rows={[{ id: 1, name: "A" }]}
        />
      </UIProvider>,
    );
    expect(screen.getByRole("button", { name: "Schließen" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Stopp" })).toBeTruthy();
    expect(screen.getByText("Enter zum Senden")).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "Vorheriges Bild" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("tablist", { name: "Bilder" })).toBeTruthy();
    expect(screen.getByRole("slider", { name: "Vorher und nachher vergleichen" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Altbau entfernen" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Nächste Seite" })).toBeTruthy();
    expect(screen.getByText("Läuft")).toBeTruthy();
    expect(screen.getByText("3,5 Zimmer")).toBeTruthy();
    expect(screen.getByText("450.000 €")).toBeTruthy();
    fireEvent.click(screen.getByRole("checkbox", { name: "Zeile auswählen" }));
    expect(screen.getByRole("toolbar", { name: "Sammelaktionen" })).toBeTruthy();
    expect(screen.getByText("1 ausgewählt")).toBeTruthy();
    expect(container.textContent).not.toMatch(/Previous image|Compare before and after/);
  });

  it("Form validation messages come from the strings", async () => {
    render(
      <UIProvider scope="subtree" messages={de}>
        <Form rules={{ email: { required: true } }} onSubmit={() => {}}>
          <TextField name="email" label="E-Mail" />
          <button type="submit">Go</button>
        </Form>
      </UIProvider>,
    );
    await act(async () => {
      fireEvent.click(screen.getByText("Go"));
    });
    expect(screen.getByText("Pflichtfeld")).toBeTruthy();
  });
});

describe("coverage", () => {
  const dir = join(HERE, "components");
  const sources = readdirSync(dir)
    .filter((f) => f.endsWith(".tsx") && !f.includes(".test."))
    .map((f) => [f, readFileSync(join(dir, f), "utf8")] as const);

  it("every string key is used by a component", () => {
    const all = sources.map(([, s]) => s).join("\n");
    const unused = Object.keys(DEFAULT_STRINGS).filter(
      (k) => !new RegExp(`\\b(t|strings)\\.${k}\\b`).test(all),
    );
    expect(unused).toEqual([]);
  });

  it("no component hard-codes an English accessible name", () => {
    const hits: string[] = [];
    for (const [f, s] of sources)
      for (const m of s.matchAll(/(aria-label|label|title|placeholder)="([A-Z][a-z][^"]*)"/g))
        hits.push(`${f}: ${m[0]}`);
    expect(hits).toEqual([]);
  });
});
