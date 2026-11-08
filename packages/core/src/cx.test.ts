import { describe, expect, it } from "vitest";
import { cx } from "./cx.js";

describe("cx", () => {
  it("joins truthy class names", () => {
    expect(cx("tf-btn", false, "tf-btn-primary", null, undefined, 0)).toBe("tf-btn tf-btn-primary");
  });
});
