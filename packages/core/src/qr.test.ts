/** The QR encoder: every level and a range of lengths decode back to the text with jsQR. */
import jsQR from "jsqr";
import { describe, expect, it } from "vitest";
import { qrMatrix, type QrLevel } from "./qr.js";

/** Renders a matrix as RGBA pixels (4 px per module, 4 modules of quiet zone) and decodes it. */
function decode(m: boolean[][]): string | undefined {
  const scale = 4,
    quiet = 4,
    n = (m.length + quiet * 2) * scale;
  const px = new Uint8ClampedArray(n * n * 4).fill(255);
  m.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (!dark) return;
      for (let dy = 0; dy < scale; dy++)
        for (let dx = 0; dx < scale; dx++) {
          const i = (((y + quiet) * scale + dy) * n + (x + quiet) * scale + dx) * 4;
          px[i] = px[i + 1] = px[i + 2] = 0;
        }
    }),
  );
  return jsQR(px, n, n)?.data;
}

describe("qrMatrix", () => {
  const otpauth =
    "otpauth://totp/Capitaso:robin%40example.com?secret=JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP&issuer=Capitaso&algorithm=SHA1&digits=6&period=30";

  it.each(["L", "M", "Q", "H"] as QrLevel[])("decodes an otpauth link at level %s", (level) => {
    expect(decode(qrMatrix(otpauth, level))).toBe(otpauth);
  });

  it("decodes short and long texts across versions, with non-ASCII text", () => {
    for (const len of [1, 10, 17, 40, 100, 200, 400, 800]) {
      const text = "Grüße-".repeat(Math.ceil(len / 6)).slice(0, len);
      const m = qrMatrix(text, "M");
      expect(m.length, `length ${len}`).toBe(m[0]!.length);
      expect(decode(m), `length ${len}`).toBe(text);
    }
  });

  it("refuses text beyond version 40", () => {
    expect(() => qrMatrix("x".repeat(3000), "H")).toThrow();
  });
});
