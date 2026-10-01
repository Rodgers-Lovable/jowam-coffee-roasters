import { describe, expect, it } from "vitest";
import type { Product } from "./products";
import {
  formatItemsText,
  makeOrderRef,
  normalizePhone,
  orderFields,
  orderFormSchema,
  resolveLines,
} from "./order";

const products: Product[] = [
  {
    handle: "nyeri",
    name: "Nyeri",
    category: "Coffee",
    description: "",
    image: null,
    sort: 1,
    variants: [
      { id: "nyeri--250g", label: "250g", priceKes: 1200, available: true },
      { id: "nyeri--1kg", label: "1kg", priceKes: 4200, available: false },
    ],
  },
];

describe("normalizePhone", () => {
  it.each([
    ["0712345678", "254712345678"],
    ["0112 345 678", "254112345678"],
    ["+254 712-345-678", "254712345678"],
    ["254712345678", "254712345678"],
  ])("normalises %s", (input, expected) => {
    expect(normalizePhone(input)).toBe(expected);
  });

  it.each(["071234567", "0812345678", "+1 555 123 4567", ""])("rejects %s", (input) => {
    expect(normalizePhone(input)).toBeNull();
  });
});

describe("makeOrderRef", () => {
  it("uses the Nairobi date and four characters from the safe alphabet", () => {
    // 2026-09-30 22:30 UTC is 2026-10-01 01:30 in Nairobi
    const ref = makeOrderRef(
      new Date("2026-09-30T22:30:00Z"),
      () => new Uint8Array([0, 1, 30, 31]),
    );
    expect(ref).toBe("JW-261001-23YZ");
  });

  it("never uses 0, O, 1 or I", () => {
    const ref = makeOrderRef();
    expect(ref).toMatch(/^JW-\d{6}-[2-9A-HJ-NP-Z]{4}$/);
  });
});

describe("resolveLines", () => {
  it("prices lines from product data and splits out unavailable ones", () => {
    const result = resolveLines(products, [
      { handle: "nyeri", variantId: "nyeri--250g", quantity: 2 },
      { handle: "nyeri", variantId: "nyeri--1kg", quantity: 1 },
      { handle: "gone", variantId: "gone--250g", quantity: 1 },
    ]);
    expect(result.items).toEqual([
      {
        handle: "nyeri",
        variantId: "nyeri--250g",
        name: "Nyeri",
        variantLabel: "250g",
        image: null,
        priceKes: 1200,
        quantity: 2,
        lineTotal: 2400,
      },
    ]);
    expect(result.subtotal).toBe(2400);
    expect(result.unavailable.map((l) => l.variantId)).toEqual(["nyeri--1kg", "gone--250g"]);
  });
});

describe("formatItemsText", () => {
  it("writes one line per item", () => {
    const { items } = resolveLines(products, [
      { handle: "nyeri", variantId: "nyeri--250g", quantity: 2 },
    ]);
    expect(formatItemsText(items)).toBe("2 × Nyeri (250g) @ 1,200");
  });
});

describe("orderFormSchema", () => {
  const base = {
    name: "Wanjiru",
    phone: "0712345678",
    email: "",
    method: "Pickup" as const,
    address: "",
    notes: "",
    company: "",
  };

  it("accepts a pickup order without an address", () => {
    expect(orderFormSchema.safeParse(base).success).toBe(true);
  });

  it("requires an address for delivery", () => {
    const result = orderFormSchema.safeParse({ ...base, method: "Delivery" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["address"]);
  });

  it("rejects a non Kenyan phone number", () => {
    expect(orderFormSchema.safeParse({ ...base, phone: "12345" }).success).toBe(false);
  });
});

describe("orderFields", () => {
  it("builds labelled fields for the WhatsApp and email message", () => {
    const { items, subtotal } = resolveLines(products, [
      { handle: "nyeri", variantId: "nyeri--250g", quantity: 1 },
    ]);
    const fields = orderFields({
      ref: "JW-261001-ABCD",
      items,
      subtotal,
      form: {
        name: "Wanjiru",
        phone: "0712345678",
        email: "",
        method: "Delivery",
        address: "Lavington",
        notes: "",
        company: "",
      },
    });
    expect(fields).toEqual({
      Order: "JW-261001-ABCD",
      Items: "\n1 × Nyeri (250g) @ 1,200",
      Subtotal: "KES 1,200 (delivery fee confirmed on WhatsApp)",
      Name: "Wanjiru",
      Phone: "254712345678",
      Email: "",
      Method: "Delivery",
      Address: "Lavington",
      Notes: "",
    });
  });
});
