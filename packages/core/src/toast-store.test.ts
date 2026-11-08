import { afterEach, describe, expect, it, vi } from "vitest";
import { getToasts, subscribeToasts, toast } from "./toast-store.js";

afterEach(() => toast.clear());

describe("toast store", () => {
  it("keeps at most three toasts and notifies subscribers", () => {
    const fn = vi.fn();
    const off = subscribeToasts(fn);
    ["a", "b", "c", "d"].forEach((t) => toast(t));
    expect(getToasts().map((t) => t.text)).toEqual(["b", "c", "d"]);
    expect(fn).toHaveBeenCalledTimes(4);
    off();
  });

  it("gives undo toasts more time and dismisses by id", () => {
    const id = toast({ text: "Deleted", undo: () => {} });
    expect(getToasts()[0]).toMatchObject({ tone: "success", duration: 6000 });
    expect(toast({ text: "Saved" }) && getToasts()[1]?.duration).toBe(4000);
    toast.dismiss(id);
    expect(getToasts().map((t) => t.text)).toEqual(["Saved"]);
  });
});
