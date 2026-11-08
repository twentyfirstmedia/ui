import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { run } from "./index.js";
import type { Logger } from "./util.js";

/**
 * Runs the CLI against a fresh copy of examples/next-app. The copy sits inside the example folder
 * so it resolves the example's node_modules (next, react and the workspace kits).
 */
const EXAMPLE = join(__dirname, "../../../examples/next-app");
let dir = "";
const out: string[] = [];
const log: Logger = { log: (m) => out.push(m), warn: (m) => out.push(m) };
const file = (p: string) => readFileSync(join(dir, p), "utf8");

beforeAll(() => {
  dir = mkdtempSync(join(EXAMPLE, ".cli-test-"));
  for (const f of ["app", "package.json", "tsconfig.json", "next-env.d.ts", "postcss.config.mjs"]) {
    cpSync(join(EXAMPLE, f), join(dir, f), { recursive: true });
  }
});
afterAll(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
});

describe("twentyfirst-ui", () => {
  it("init sets up the kit, styles, provider and layout", () => {
    expect(run(["init", "--kit", "halo", "--no-install", "--cwd", dir], log)).toBe(0);
    // the packages are on the public npm registry: no .npmrc needed
    expect(existsSync(join(dir, ".npmrc"))).toBe(false);
    const css = file("app/globals.css");
    expect(css.indexOf('@import "tailwindcss"')).toBeLessThan(
      css.indexOf("@twentyfirstmedia/halo/styles.css"),
    );
    expect(css).toContain('@import "@twentyfirstmedia/halo/tailwind.css";');
    const provider = file("components/ui-root.tsx");
    expect(provider).toContain("<UIProvider>");
    const layout = file("app/layout.tsx");
    expect(layout).toContain('import { UIRoot } from "../components/ui-root";');
    expect(layout).toContain("<UIRoot>{children}</UIRoot>");
    expect(layout).toContain('<html data-kit="halo"');
    expect(JSON.parse(file("twentyfirst.json"))).toMatchObject({
      kit: "halo",
      components: "components/ui",
    });
  });

  it("init is idempotent", () => {
    const before = [
      file("app/globals.css"),
      file("app/layout.tsx"),
      file("components/ui-root.tsx"),
    ];
    expect(run(["init", "--kit", "halo", "--no-install", "--cwd", dir], log)).toBe(0);
    expect([
      file("app/globals.css"),
      file("app/layout.tsx"),
      file("components/ui-root.tsx"),
    ]).toEqual(before);
  });

  it("add copies components with imports from the public package", () => {
    expect(
      run(
        [
          "add",
          "Button",
          "ApprovalCard",
          "DataTable",
          "Combobox",
          "StatTile",
          "Badge",
          "--cwd",
          dir,
        ],
        log,
      ),
    ).toBe(0);
    for (const f of ["button", "approval-card", "data-table", "combobox", "stat-tile", "badge"]) {
      const src = file(`components/ui/${f}.tsx`);
      expect(src).toContain('from "@twentyfirstmedia/ui-core"');
      expect(src).not.toMatch(/from "\.\.?\//);
    }
    // private helpers come along; public components are imported
    expect(file("components/ui/badge.tsx")).toMatch(/^const TONE_ALIAS/m);
    expect(file("components/ui/stat-tile.tsx")).toMatch(
      /import \{[^}]*CountUp[^}]*\} from "@twentyfirstmedia\/ui-core"/,
    );
    expect(file("components/ui/approval-card.tsx")).toMatch(
      /import \{[^}]*StatusShape[^}]*\} from "@twentyfirstmedia\/ui-core"/,
    );
  });

  it("the app type-checks with the copies, provider and layout", () => {
    const tsc = createRequire(join(EXAMPLE, "package.json")).resolve("typescript/bin/tsc");
    writeFileSync(
      join(dir, "app/page.tsx"),
      `import { ApprovalCard } from "../components/ui/approval-card";
import { Button } from "../components/ui/button";
import { DataTable } from "../components/ui/data-table";
import { Combobox } from "../components/ui/combobox";
import { StatTile } from "../components/ui/stat-tile";

export default function Page() {
  return (
    <main>
      <Button variant="primary">Go</Button>
      <StatTile value="18" label="Projects" />
      <Combobox options={["A", "B"]} />
      <DataTable rows={[{ id: 1, name: "A" }]} columns={[{ key: "name", label: "Name" }]} />
      <ApprovalCard title="Send" />
    </main>
  );
}
`,
    );
    expect(() =>
      execFileSync(process.execPath, [tsc, "--noEmit", "-p", dir], { stdio: "pipe" }),
    ).not.toThrow();
  });

  it("list shows the groups and marks added components", () => {
    out.length = 0;
    expect(run(["list", "--cwd", dir], log)).toBe(0);
    const text = out.join("\n");
    expect(text).toContain("approvals");
    expect(text).toContain("ApprovalCard (added)");
    expect(text).toContain("ApprovalInbox");
  });

  it("diff reports local changes against the package", () => {
    out.length = 0;
    expect(run(["diff", "Button", "--cwd", dir], log)).toBe(0);
    expect(out.join("\n")).toContain("no changes");
    const p = join(dir, "components/ui/button.tsx");
    writeFileSync(p, readFileSync(p, "utf8").replace('"tf-btn"', '"tf-btn my-btn"'));
    out.length = 0;
    run(["diff", "Button", "--cwd", dir], log);
    expect(out.join("\n")).toMatch(/^\+.*my-btn/m);
  });

  it("refuses unknown components and existing files", () => {
    out.length = 0;
    expect(run(["add", "Nope", "--cwd", dir], log)).toBe(1);
    expect(out.join("\n")).toContain('Unknown component "Nope"');
    out.length = 0;
    run(["add", "Button", "--cwd", dir], log);
    expect(out.join("\n")).toContain("exists");
    expect(existsSync(join(dir, "components/ui/button.tsx"))).toBe(true);
  });
});

describe("twentyfirst-ui theme", () => {
  it("writes a preset next to the stylesheet and imports it after the kit styles", () => {
    expect(run(["theme", "violet", "--cwd", dir], log)).toBe(0);
    const theme = file("app/theme.css");
    expect(theme).toContain("--primary: #7c3aed;");
    expect(theme).toMatch(/\[data-theme="dark"\],\n\.dark \{/);
    const css = file("app/globals.css");
    expect(css.indexOf("@twentyfirstmedia/halo/styles.css")).toBeLessThan(
      css.indexOf('@import "./theme.css";'),
    );
    // again: no second import
    expect(run(["theme", "blue", "--cwd", dir], log)).toBe(0);
    expect(file("app/globals.css").split('@import "./theme.css";').length).toBe(2);
    expect(file("app/theme.css")).toContain("--primary: #2563eb;");
  });

  it("imports a shadcn theme file and a brand colour", () => {
    writeFileSync(
      join(dir, "shadcn.css"),
      ":root { --radius: 0.5rem; --primary: 222.2 47.4% 11.2%; }\n.dark { --primary: oklch(0.9 0 0); }",
    );
    expect(run(["theme", "shadcn.css", "--cwd", dir, "--out", "app/brand.css"], log)).toBe(0);
    const t = file("app/brand.css");
    expect(t).toContain("--radius: 0.5rem;");
    expect(t).toContain("--primary: hsl(222.2 47.4% 11.2%);");
    expect(t).toContain("--primary: oklch(0.9 0 0);");
    expect(
      run(["theme", "#ff0066,#ff6699", "--kit", "pro", "--cwd", dir, "--out", "app/b2.css"], log),
    ).toBe(0);
    expect(file("app/b2.css")).toMatch(/^:root:not\(\[data-theme\]\) \{\n {2}--primary: #ff6699;/m);
    expect(run(["theme", "nope", "--cwd", dir], log)).toBe(1);
  });
});
