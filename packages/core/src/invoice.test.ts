import { describe, expect, it } from "vitest";
import { invoiceTotals, roundMoney } from "./invoice.js";

describe("invoiceTotals", () => {
  it("rounds per line and per rate", () => {
    const t = invoiceTotals([
      { quantity: 3, price: 0.335, vat: 19 },
      { quantity: 1, price: 100, vat: 7, discount: 10 },
      { quantity: 2, price: 12.5, vat: 0 },
    ]);
    expect(t.lines).toEqual([1.01, 90, 25]);
    expect(t.subtotal).toBe(116.01);
    expect(t.rates).toEqual([
      { rate: 19, net: 1.01, vat: 0.19 },
      { rate: 7, net: 90, vat: 6.3 },
      { rate: 0, net: 25, vat: 0 },
    ]);
    expect(t.net).toBe(116.01);
    expect(t.vat).toBe(6.49);
    expect(t.total).toBe(122.5);
  });
  it("applies the invoice discount per rate", () => {
    const t = invoiceTotals(
      [
        { quantity: 40, price: 24, vat: 19 },
        { quantity: 1, price: 650, vat: 7 },
      ],
      { discount: 5 },
    );
    expect(t.subtotal).toBe(1610);
    expect(t.rates).toEqual([
      { rate: 19, net: 912, vat: 173.28 },
      { rate: 7, net: 617.5, vat: 43.23 },
    ]);
    expect(t.discount).toBe(80.5);
    expect(t.total).toBe(1746.01);
  });
  it("rounds half away from zero", () => {
    expect(roundMoney(0.125)).toBe(0.13);
    expect(roundMoney(-0.125)).toBe(-0.13);
    expect(roundMoney(1.005)).toBe(1.01);
  });
});
