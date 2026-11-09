import * as core from "@twentyfirstmedia/ui-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fromAttribute, parseStyle } from "./convert.js";
import { ELEMENTS, toast } from "./index.js";
import { kebab, parseDef } from "./registry-types.js";
import { DEFS } from "./generated/registry.js";

/** Waits until React and the element lifecycle (microtasks, MutationObservers) are done. */
const settle = async () => {
  for (let i = 0; i < 4; i++) await new Promise((r) => setTimeout(r, 0));
};
function mount(html: string): HTMLElement {
  const host = document.createElement("div");
  host.dataset.testHost = "";
  host.innerHTML = html;
  document.body.append(host);
  return host;
}
afterEach(async () => {
  // remove the elements first, so React unmounts its portals (toasts) before the body is cleared
  for (const el of document.querySelectorAll("[data-test-host]")) el.remove();
  await settle();
  document.body.innerHTML = "";
  document.documentElement.removeAttribute("data-kit");
  document.documentElement.removeAttribute("data-theme");
});

describe("registry", () => {
  it("has an element for every component ui-core exports", () => {
    const tags = new Map(Object.entries(ELEMENTS).map(([t, c]) => [c, t]));
    const missing = Object.entries(core)
      .filter(([name, v]) => typeof v === "function" && /^[A-Z][a-z]/.test(name))
      .map(([name]) => name)
      .filter((name) => name !== "Portal" && !tags.has(name));
    expect(missing).toEqual([]);
    for (const tag of Object.keys(ELEMENTS)) expect(customElements.get(tag), tag).toBeDefined();
  });

  it("names tags after the component", () => {
    expect(ELEMENTS["tf-button"]).toBe("Button");
    expect(ELEMENTS["tf-data-table"]).toBe("DataTable");
    expect(ELEMENTS["tf-provider"]).toBe("UIProvider");
    expect(ELEMENTS["tf-approval-card"]).toBe("ApprovalCard");
    expect(kebab("defaultValue")).toBe("default-value");
  });

  it("parses the compact definitions", () => {
    const tabs = parseDef(DEFS.find((d) => d.t === "tf-tabs")!);
    expect(tabs.byAttr.get("default-value")?.name).toBe("defaultValue");
    expect(tabs.byName.get("items")?.kind).toBe("j");
    expect(tabs.byName.get("panels")?.kind).toBe("K");
    expect(tabs.byType.get("change")).toMatchObject({ prop: "onChange", arity: 1 });
    expect(tabs.sync).toEqual([{ event: "onChange", prop: "value", from: "detail" }]);
  });
});

describe("attribute conversion", () => {
  const p = (kind: string, flags = "") => ({ name: "x", attr: "x", kind, flags });
  it("converts by prop type", () => {
    expect(fromAttribute(p("b"), "")).toBe(true);
    expect(fromAttribute(p("b"), "false")).toBe(false);
    expect(fromAttribute(p("b"), null)).toBeUndefined();
    expect(fromAttribute(p("n"), "42")).toBe(42);
    expect(fromAttribute(p("n"), "abc")).toBeUndefined();
    expect(fromAttribute(p("n", "?"), "null")).toBeNull();
    expect(fromAttribute(p("s"), "primary")).toBe("primary");
    expect(fromAttribute(p("s", "!"), "false")).toBe(false);
    expect(fromAttribute(p("x"), "320")).toBe(320);
    expect(fromAttribute(p("x"), "100%")).toBe("100%");
    expect(fromAttribute(p("j"), '[{"a":1}]')).toEqual([{ a: 1 }]);
    expect(fromAttribute(p("j", "l"), "Overview, Activity")).toEqual(["Overview", "Activity"]);
    expect(fromAttribute(p("j"), "Berlin")).toBe("Berlin");
    expect(fromAttribute(p("d"), "2026-03-01")).toBeInstanceOf(Date);
    expect(fromAttribute(p("j", "t"), '{"from":"2026-03-01","to":null}')).toEqual({
      from: new Date("2026-03-01"),
      to: null,
    });
  });
  it("parses inline styles into React style objects", () => {
    expect(parseStyle("max-width: 320px; --tint: var(--sky); background: url(a;b)")).toEqual({
      maxWidth: "320px",
      "--tint": "var(--sky)",
      background: "url(a;b)",
    });
    expect(parseStyle("")).toBeUndefined();
  });
});

describe("rendering", () => {
  it("keeps the props of a generic component (DataTable<R>)", async () => {
    const host = mount(`<tf-data-table></tf-data-table>`);
    const el = host.querySelector("tf-data-table") as HTMLElementTagNameMap["tf-data-table"];
    el.columns = [{ key: "name", label: "Name" }];
    el.rows = [{ id: 1, name: "Ava Vogel" }];
    await settle();
    expect(host.querySelectorAll("tbody tr").length).toBe(1);
    expect(host.querySelector("tbody")?.textContent).toContain("Ava Vogel");
  });
  it("moves ARIA attributes a component takes to its inner element", async () => {
    const host = mount(`<tf-button aria-expanded="true" aria-controls="menu">More</tf-button>`);
    await settle();
    const btn = host.querySelector("button")!;
    expect(btn.getAttribute("aria-expanded")).toBe("true");
    expect(btn.getAttribute("aria-controls")).toBe("menu");
    expect(host.querySelector("tf-button")!.hasAttribute("aria-expanded")).toBe(false);
  });
  it("maps attributes to props and re-renders when they change", async () => {
    const host = mount(`<tf-button variant="secondary" icon-right="arrowRight">Save</tf-button>`);
    await settle();
    const btn = host.querySelector("button")!;
    expect(btn.className).toContain("tf-btn-secondary");
    expect(btn.textContent).toBe("Save");
    expect(btn.querySelectorAll("svg")).toHaveLength(1);
    host.querySelector("tf-button")!.setAttribute("variant", "danger");
    await settle();
    expect(host.querySelector("button")!.className).toContain("tf-btn-danger");
    host.querySelector("tf-button")!.setAttribute("disabled", "");
    await settle();
    expect(host.querySelector("button")!.disabled).toBe(true);
    host.querySelector("tf-button")!.setAttribute("disabled", "false");
    await settle();
    expect(host.querySelector("button")!.disabled).toBe(false);
  });

  it("passes class and style to the component's root", async () => {
    const host = mount(`<tf-button class="extra" style="margin-left: 4px">Live</tf-button>`);
    await settle();
    const root = host.querySelector("tf-button > tf-root > *") as HTMLElement;
    expect(root.className).toContain("extra");
    expect(root.style.marginLeft).toBe("4px");
  });

  it("takes arrays as properties and as JSON or a list in the attribute", async () => {
    const host = mount(
      `<tf-tabs items='["One","Two"]'></tf-tabs><tf-tabs items="A, B, C"></tf-tabs>`,
    );
    await settle();
    const [a, b] = [...host.querySelectorAll("tf-tabs")];
    expect(a!.querySelectorAll('[role="tab"]')).toHaveLength(2);
    expect(b!.querySelectorAll('[role="tab"]')).toHaveLength(3);
    (a as HTMLElementTagNameMap["tf-tabs"]).items = ["X", "Y", "Z", "W"];
    await settle();
    expect(a!.querySelectorAll('[role="tab"]')).toHaveLength(4);
    expect((a as HTMLElementTagNameMap["tf-tabs"]).items).toEqual(["X", "Y", "Z", "W"]);
  });

  it("applies properties set before the element was defined", async () => {
    const el = document.createElement("tf-unknown-later");
    expect(el).toBeInstanceOf(HTMLElement);
    const tabs = document.createElement("div");
    tabs.innerHTML = "<tf-segmented></tf-segmented>";
    const seg = tabs.firstElementChild as HTMLElementTagNameMap["tf-segmented"];
    seg.options = ["Day", "Week"];
    document.body.append(tabs);
    await settle();
    expect(seg.querySelectorAll("input[type=radio]")).toHaveLength(2);
  });

  it("renders text, HTML and nested elements as children", async () => {
    const host = mount(`
      <tf-panel title="Revenue">
        <p class="note">Up <b>12%</b></p>
        <tf-button variant="ghost" slot="action">Export</tf-button>
        <tf-badge tone="ok">nested</tf-badge>
      </tf-panel>`);
    await settle();
    const panel = host.querySelector(".tf-panel")!;
    expect(panel.textContent).toContain("Revenue");
    expect(panel.querySelector("p.note b")!.textContent).toBe("12%");
    expect(panel.querySelector(".tf-badge")!.textContent).toBe("nested");
    // the slotted button renders in the panel's head, not in the body
    const head = panel.firstElementChild!;
    expect(head.querySelector("button")!.textContent).toBe("Export");
    // the host title attribute became the prop (no tooltip on the whole panel)
    expect(host.querySelector("tf-panel")!.hasAttribute("title")).toBe(false);
    expect((host.querySelector("tf-panel") as HTMLElementTagNameMap["tf-panel"]).title).toBe(
      "Revenue",
    );
  });

  it("takes title and the other attributes of the same element", async () => {
    const host = mount(`<tf-panel title="Team" subtitle="Who has access"></tf-panel>`);
    await settle();
    expect(host.querySelector(".tf-panel-title")!.textContent).toBe("Team");
    expect(host.querySelector(".tf-panel-sub")!.textContent).toBe("Who has access");
    const panel = host.firstElementChild as HTMLElementTagNameMap["tf-panel"];
    panel.setAttribute("title", "People");
    await settle();
    expect(host.querySelector(".tf-panel-title")!.textContent).toBe("People");
    expect(panel.hasAttribute("title")).toBe(false);
    panel.title = "Members";
    await settle();
    expect(host.querySelector(".tf-panel-title")!.textContent).toBe("Members");
  });

  it("renders ReactNode props from DOM nodes set as properties", async () => {
    const host = mount(`<tf-empty-state title="Nothing yet"></tf-empty-state>`);
    await settle();
    const btn = document.createElement("button");
    btn.textContent = "Create";
    (host.firstElementChild as HTMLElementTagNameMap["tf-empty-state"]).action = btn;
    await settle();
    expect(host.querySelector(".tf-empty button")).toBe(btn);
  });

  it("renders record slots (tab panels)", async () => {
    const host = mount(`
      <tf-tabs items="Overview, Activity">
        <div slot="panels:Overview">First panel</div>
        <div slot="panels:Activity">Second panel</div>
      </tf-tabs>`);
    await settle();
    const visible = () => host.querySelector('[role="tabpanel"]:not([hidden])')!.textContent;
    expect(host.querySelectorAll('[role="tabpanel"]')).toHaveLength(2);
    expect(visible()).toBe("First panel");
    (host.querySelectorAll('[role="tab"]')[1] as HTMLElement).click();
    await settle();
    expect(visible()).toBe("Second panel");
    // the slot attribute is not left over as raw content anywhere else
    expect(host.querySelector("tf-tabs > [slot]")).toBeNull();
  });

  it("re-reads content appended later", async () => {
    const host = mount(`<tf-button>One</tf-button>`);
    await settle();
    host.firstElementChild!.append(" and two");
    await settle();
    expect(host.querySelector("button")!.textContent).toBe("One and two");
  });
});

describe("events", () => {
  it("turns callbacks into DOM events with the argument as detail", async () => {
    const host = mount(`<tf-tabs items="One, Two"></tf-tabs>`);
    await settle();
    const tabs = host.firstElementChild!;
    const seen: unknown[] = [];
    host.addEventListener("change", (e) => seen.push((e as CustomEvent).detail));
    (tabs.querySelectorAll('[role="tab"]')[1] as HTMLElement).click();
    await settle();
    expect(seen).toEqual(["Two"]);
    // uncontrolled: the tab stays selected
    expect(tabs.querySelector('[aria-selected="true"]')!.textContent).toBe("Two");
  });

  it("passes several arguments as an array", async () => {
    const host = mount(
      `<tf-approval-card title="Send the newsletter?" agent="Mailer"></tf-approval-card>`,
    );
    await settle();
    const card = host.firstElementChild!;
    const decide = vi.fn();
    card.addEventListener("decide", (e) => decide((e as CustomEvent).detail));
    await settle();
    const yes = [...card.querySelectorAll("button")].find((b) => /yes/i.test(b.textContent ?? ""));
    expect(yes).toBeDefined();
    yes!.click();
    await settle();
    expect(decide).toHaveBeenCalled();
    const detail = decide.mock.calls[0]![0] as unknown[];
    expect(Array.isArray(detail)).toBe(true);
    expect(detail[0]).toBe("A");
  });

  it("replaces native change events of inner inputs with its own", async () => {
    const host = mount(`<tf-switch label="Alerts"></tf-switch>`);
    await settle();
    const details: unknown[] = [];
    const own: unknown[] = [];
    host.addEventListener("change", (e) => details.push((e as CustomEvent).detail));
    host.firstElementChild!.addEventListener("change", (e) => own.push((e as CustomEvent).detail));
    const input = host.querySelector("input")!;
    input.click();
    await settle();
    expect(details).toEqual([true]);
    expect(own).toEqual([true]);
    expect(input.checked).toBe(true);
    input.click();
    await settle();
    expect(details).toEqual([true, false]);
  });

  it("leaves native events of content passed in alone", async () => {
    const host = mount(`<tf-tabs items="One"><input slot="panels:One" id="own" /></tf-tabs>`);
    await settle();
    const seen: string[] = [];
    host.addEventListener("change", (e) => seen.push((e.target as Element).localName));
    host.querySelector("#own")!.dispatchEvent(new Event("change", { bubbles: true }));
    expect(seen).toEqual(["input"]);
  });

  it("keeps controlled values in step unless the event is cancelled", async () => {
    const host = mount(`<tf-switch label="Alerts" checked></tf-switch>`);
    await settle();
    const sw = host.firstElementChild as HTMLElementTagNameMap["tf-switch"];
    const input = host.querySelector("input")!;
    expect(input.checked).toBe(true);
    input.click();
    await settle();
    expect(sw.checked).toBe(false);
    expect(host.querySelector("input")!.checked).toBe(false);
    sw.addEventListener("change", (e) => e.preventDefault());
    host.querySelector("input")!.click();
    await settle();
    expect(sw.checked).toBe(false);
    expect(host.querySelector("input")!.checked).toBe(false);
  });

  it("passes optional callbacks only while someone listens", async () => {
    const host = mount(`<tf-alert tone="warn" title="Heads up">Text</tf-alert>`);
    await settle();
    const alert = host.firstElementChild as HTMLElement;
    expect(alert.querySelector("button")).toBeNull();
    const onDismiss = vi.fn();
    alert.addEventListener("dismiss", onDismiss);
    await settle();
    const close = alert.querySelector("button")!;
    expect(close).not.toBeNull();
    close.click();
    await settle();
    expect(onDismiss).toHaveBeenCalledTimes(1);
    // not cancelled: the alert dismissed itself
    expect(alert.hidden).toBe(true);
    expect(alert.querySelector(".tf-alert")).toBeNull();
  });

  it("closes a modal with Escape and opens it again", async () => {
    const host = mount(`<button id="open">Open</button><tf-modal title="Invite" hidden>
      <p>Body</p></tf-modal>`);
    await settle();
    const modal = host.querySelector("tf-modal") as HTMLElement;
    expect(modal.querySelector('[role="dialog"]')).toBeNull();
    modal.hidden = false;
    await settle();
    const dialog = modal.querySelector('[role="dialog"]')!;
    expect(dialog.textContent).toContain("Body");
    expect(modal.contains(document.activeElement)).toBe(true);
    const closed = vi.fn();
    modal.addEventListener("close", closed);
    (document.activeElement as HTMLElement).dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await settle();
    expect(closed).toHaveBeenCalledTimes(1);
    expect(modal.hidden).toBe(true);
    expect(modal.querySelector('[role="dialog"]')).toBeNull();
    modal.hidden = false;
    await settle();
    expect(modal.querySelector('[role="dialog"]')!.textContent).toContain("Body");
  });

  it("closes a popover when a menu inside it closes", async () => {
    const host = mount(`
      <tf-popover>
        <tf-button slot="trigger" variant="secondary">Actions</tf-button>
        <tf-menu items='[{"label":"Rename"},{"label":"Delete"}]' label="Actions"></tf-menu>
      </tf-popover>`);
    await settle();
    host.querySelector("button")!.click();
    await settle();
    expect(host.querySelector('[role="menu"]')).not.toBeNull();
    (host.querySelector('[role="menuitem"]') as HTMLElement).click();
    await settle();
    expect(host.querySelector('[role="menu"]')).toBeNull();
  });
});

describe("context across elements", () => {
  it("shares a Form's validation with nested fields", async () => {
    const host = mount(`
      <tf-form>
        <tf-text-field name="email" label="Email"></tf-text-field>
        <tf-button type="submit">Send</tf-button>
      </tf-form>`);
    await settle();
    const form = host.querySelector("tf-form") as HTMLElementTagNameMap["tf-form"];
    form.rules = { email: { required: "Enter your email" } };
    const invalid = vi.fn();
    form.addEventListener("invalid", (e) => invalid((e as CustomEvent).detail));
    await settle();
    host.querySelector("form")!.requestSubmit();
    await settle();
    expect(invalid).toHaveBeenCalledWith({ email: "Enter your email" });
    expect(host.querySelector("tf-text-field")!.textContent).toContain("Enter your email");
    // the fields render through portals in the form's tree (that is how they get its context)
    expect(host.querySelectorAll("tf-root")).toHaveLength(3);
  });

  it("sets kit and theme on <html> from tf-provider", async () => {
    mount(`<tf-provider kit="pro" theme="dark"><tf-button>Go</tf-button></tf-provider>`);
    await settle();
    expect(document.documentElement.dataset.kit).toBe("pro");
    expect(document.documentElement.dataset.theme).toBe("dark");
    document.querySelector("tf-provider")!.setAttribute("kit", "halo");
    await settle();
    expect(document.documentElement.dataset.kit).toBe("halo");
  });
});

describe("lifecycle", () => {
  it("keeps state when moved, unmounts when removed", async () => {
    const host = mount(`<div id="a"><tf-tabs items="One, Two"></tf-tabs></div><div id="b"></div>`);
    await settle();
    const tabs = host.querySelector("tf-tabs")!;
    (tabs.querySelectorAll('[role="tab"]')[1] as HTMLElement).click();
    await settle();
    const tab = tabs.querySelector('[aria-selected="true"]')!;
    host.querySelector("#b")!.append(tabs);
    await settle();
    expect(tabs.querySelector('[aria-selected="true"]')).toBe(tab);
    expect(tab.textContent).toBe("Two");
    tabs.remove();
    await settle();
    expect(tabs.querySelector('[role="tab"]')).toBeNull();
    host.querySelector("#a")!.append(tabs);
    await settle();
    // rendered again from its attributes (state starts over)
    expect(tabs.querySelectorAll('[role="tab"]')).toHaveLength(2);
  });

  it("renders a toaster for toast()", async () => {
    mount(`<tf-toaster></tf-toaster>`);
    await settle();
    toast("Saved");
    await settle();
    expect(document.querySelector(".tf-toaster")!.textContent).toContain("Saved");
    toast.clear();
  });
});
