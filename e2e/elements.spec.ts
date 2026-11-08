import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { KITS, THEMES } from "./pages";

/**
 * The custom elements (@twentyfirstmedia/elements) in a plain HTML page without a build step:
 * examples/html, served with the bundle and both kits' CSS.
 */
test.use({ baseURL: "http://localhost:4175", reducedMotion: "reduce" });

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}
async function open(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Plain HTML" })).toBeVisible();
}
const log = (page: Page) => page.locator("#log");

test("renders in both kits without console errors", async ({ page }) => {
  const errors = collectErrors(page);
  await open(page);
  const html = page.locator("html");
  const font = () => page.evaluate(() => getComputedStyle(document.body).fontFamily);
  await expect(html).toHaveAttribute("data-kit", "halo");
  expect(await font()).toContain("Plus Jakarta Sans");
  for (const name of ["Actions", "Profile", "Activity", "Signups"])
    await expect(page.getByRole("heading", { name })).toBeVisible();
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.locator(".tf-approval")).toBeVisible();

  await page.getByRole("radio", { name: "Pro" }).check();
  await expect(html).toHaveAttribute("data-kit", "pro");
  await expect(log(page)).toHaveText("Kit: pro");
  expect(await font()).toContain("Geist");
  await expect(page.getByRole("table")).toBeVisible();
  expect(errors).toEqual([]);
});

test("attribute changes re-render the component", async ({ page }) => {
  await open(page);
  const save = page.getByRole("button", { name: "Save draft" });
  await expect(save).toHaveClass(/tf-btn-secondary/);
  await page.locator("#save").evaluate((el) => el.setAttribute("variant", "danger"));
  await expect(save).toHaveClass(/tf-btn-danger/);
  await page.locator("#save").evaluate((el) => el.setAttribute("disabled", ""));
  await expect(save).toBeDisabled();
  await page.locator("#save").evaluate((el) => el.removeAttribute("disabled"));
  await expect(save).toBeEnabled();
  // JSON in an attribute
  await page
    .locator("#chart")
    .evaluate((el) => el.setAttribute("data", '[{"label":"A","value":1},{"label":"B","value":2}]'));
  await expect(page.locator("#chart").getByText("A", { exact: true })).toBeVisible();
});

test("arrays and objects work as properties", async ({ page }) => {
  await open(page);
  const rows = page.getByRole("table").locator("tbody tr");
  await expect(rows).toHaveCount(3);
  await expect(rows.first()).toContainText("Ava Vogel");
  // sorting works on rows passed as a property
  await page.getByRole("button", { name: /Seats/ }).click();
  await page.getByRole("button", { name: /Seats/ }).click();
  await expect(rows.first()).toContainText("Chen Wu");
  await page.locator("#table").evaluate((el) => {
    (el as HTMLElementTagNameMap["tf-data-table"]).rows = [
      { id: 9, name: "Dara Kim", role: "Owner", seats: 1 },
    ];
  });
  await expect(rows).toHaveCount(1);
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(log(page)).toHaveText("Chart reset");
  await expect(page.locator("#chart").getByText("Tue", { exact: true })).toBeVisible();
  await expect(page.locator("#chart").getByText("Wed", { exact: true })).toHaveCount(0);
});

test("events carry the value in detail", async ({ page }) => {
  await open(page);
  await page.getByRole("textbox", { name: "Name" }).fill("Ada");
  await expect(log(page)).toHaveText("Name: Ada");
  await page.getByRole("radio", { name: "Business" }).check();
  await expect(log(page)).toHaveText("Plan: Business");
  await page.getByRole("switch", { name: "Email me product updates" }).check();
  await expect(log(page)).toHaveText("Updates: on");

  const detail = page.evaluate(
    () =>
      new Promise((resolve) =>
        document
          .getElementById("approval")!
          .addEventListener("decide", (e) => resolve((e as CustomEvent).detail), { once: true }),
      ),
  );
  await page.getByRole("button", { name: /Yes, run it as shown/ }).click();
  // two parameters (key, text): always an array; text is undefined for option A
  expect(await detail).toEqual(["A", undefined]);
  await expect(log(page)).toHaveText("Decision: A");
  // the page set `decision` as a property: the card shows the outcome
  await expect(page.locator(".tf-approval")).toContainText("You");
});

test("nested elements and slots render in place", async ({ page }) => {
  await open(page);
  // slot="action": in the panel's head, next to the title
  const actions = page.locator(".tf-panel", {
    has: page.getByRole("heading", { name: "Actions" }),
  });
  await expect(actions.locator(".tf-header").getByRole("button", { name: "Reset" })).toBeVisible();
  // slot="panels:Overview": tab panels with nested elements
  await expect(page.getByRole("tabpanel")).toContainText("Three projects shipped this week.");
  await expect(page.getByRole("tabpanel").getByRole("progressbar")).toBeVisible();
  // slot="trace" on the approval card
  await expect(page.getByRole("link", { name: "Open trace" })).toBeVisible();
  // no raw slotted content is left visible outside the components
  expect(
    await page.evaluate(
      () =>
        [...document.querySelectorAll("[slot]")].filter(
          (el) => !el.closest("[data-tf-slot]") && !el.closest("[data-tf-stash]"),
        ).length,
    ),
  ).toBe(0);
});

test("tabs work by mouse and keyboard", async ({ page }) => {
  await open(page);
  await page.getByRole("tab", { name: "Members" }).click();
  await expect(log(page)).toHaveText("Tab: Members");
  await expect(page.getByRole("tab", { name: "Members" })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Billing" })).toBeFocused();
  await expect(page.getByRole("tab", { name: "Billing" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('[role="tabpanel"]:visible')).toHaveText("Next invoice on May 1.");
});

test("the dropdown menu works by mouse and keyboard", async ({ page }) => {
  await open(page);
  const more = page.getByRole("button", { name: "More" });
  await more.click();
  const menu = page.getByRole("menu", { name: "More actions" });
  await expect(menu).toBeVisible();
  await menu.getByRole("menuitem", { name: "Rename" }).click();
  await expect(log(page)).toHaveText("Menu: Rename");
  await expect(menu).toBeHidden();

  await more.focus();
  await page.keyboard.press("Enter");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Rename" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(log(page)).toHaveText("Menu: Duplicate");
  await expect(menu).toBeHidden();

  await more.click();
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});

test("the modal opens, traps focus and closes with Escape", async ({ page }) => {
  await open(page);
  const opener = page.getByRole("button", { name: "Invite people" });
  const dialog = page.getByRole("dialog", { name: "Invite teammates" });
  await expect(dialog).toHaveCount(0);
  await opener.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("textbox", { name: "Email addresses" })).toBeFocused();
  for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");
  expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(log(page)).toHaveText("Modal closed");
  await expect(opener).toBeFocused();

  // the close button and a slotted action close it too
  await opener.click();
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toHaveCount(0);
  await opener.click();
  await dialog.getByRole("button", { name: "Send invites" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator(".tf-toaster")).toContainText("Invites sent");
});

test("the switch toggles the theme by keyboard and mouse", async ({ page }) => {
  await open(page);
  const html = page.locator("html");
  const dark = page.getByRole("switch", { name: "Dark theme" });
  await dark.focus();
  await page.keyboard.press("Space");
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(dark).toBeChecked();
  await dark.click();
  await expect(html).toHaveAttribute("data-theme", "light");
  await expect(dark).not.toBeChecked();
});

for (const kit of KITS)
  for (const theme of THEMES)
    test(`axe: ${kit} ${theme}`, async ({ page }) => {
      await open(page);
      await page.evaluate(
        ([k, t]) => {
          document.documentElement.dataset.kit = k;
          document.documentElement.dataset.theme = t;
        },
        [kit, theme] as const,
      );
      await page.waitForTimeout(300);
      const scan = async (what: string) => {
        const r = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        return r.violations.map(
          (v) => `${what} ${v.id}: ${v.nodes.length}× ${v.nodes[0]?.target.join(" ")} — ${v.help}`,
        );
      };
      const problems = await scan("page");
      // open overlays too: the menu and the modal
      await page.getByRole("button", { name: "More" }).click();
      await expect(page.getByRole("menu")).toBeVisible();
      problems.push(...(await scan("menu")));
      await page.keyboard.press("Escape");
      await page.getByRole("button", { name: "Invite people" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      problems.push(...(await scan("modal")));
      expect(problems).toEqual([]);
    });

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("nothing is wider than the screen", async ({ page }) => {
    await open(page);
    const over = () =>
      page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(await over()).toBeLessThanOrEqual(0);
    await page.getByRole("radio", { name: "Pro" }).check();
    await expect(page.locator("html")).toHaveAttribute("data-kit", "pro");
    expect(await over()).toBeLessThanOrEqual(0);
    await page.getByRole("button", { name: "Invite people" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    expect(await over()).toBeLessThanOrEqual(0);
  });
});
