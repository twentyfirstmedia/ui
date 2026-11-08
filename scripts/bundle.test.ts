import { describe, expect, it } from "vitest";
import { bundleSize, publicComponents } from "./bundle.ts";

describe("bundle size", () => {
  it("one small component pulls in only what it needs", async () => {
    const button = await bundleSize(["Button"]);
    const all = await bundleSize(publicComponents());
    expect(button.gzip).toBeLessThan(4 * 1024); // the icon set (all paths) is part of it
    expect(button.gzip).toBeLessThan(all.gzip / 10);
    // nothing of unrelated, heavy components
    expect(button.code).not.toContain("tf-rte");
    expect(button.code).not.toContain("tf-dt");
    expect(button.code).not.toContain("0000000001fe03ff");
  });

  it("heavy components stay within budget", async () => {
    for (const [name, kb] of [
      ["DataTable", 12],
      ["RichTextEditor", 14],
      ["ApprovalCard", 10],
      ["MapView", 12],
    ] as const) {
      expect((await bundleSize([name])).gzip, name).toBeLessThan(kb * 1024);
    }
  });
});
