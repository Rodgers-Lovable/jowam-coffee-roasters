import { describe, expect, it, vi } from "vitest";
import type { Product } from "./products";
import { OrderError, placeOrder } from "./order.server";
import type { Email } from "./email.server";
import type { OrderRow } from "./sheet.server";

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

const form = {
  name: "Wanjiru",
  phone: "0712 345 678",
  email: "wanjiru@example.com",
  method: "Delivery" as const,
  address: "Lavington",
  notes: "",
  company: "",
};

const deps = (
  appendOrderRow = vi.fn(async (_row: OrderRow) => {}),
  sendEmail = vi.fn(async (_email: Email) => {}),
) => ({
  loadProducts: async () => products,
  appendOrderRow,
  sendEmail,
  makeRef: () => "JW-261001-ABCD",
});

describe("placeOrder", () => {
  it("prices on the server, saves the row and returns a message link", async () => {
    const append = vi.fn(async (_row: OrderRow) => {});
    const result = await placeOrder(
      { form, lines: [{ handle: "nyeri", variantId: "nyeri--250g", quantity: 2 }] },
      deps(append),
    );
    expect(result.ref).toBe("JW-261001-ABCD");
    expect(result.saved).toBe(true);
    expect(result.link).toMatch(/^(mailto:|https:\/\/wa\.me\/)/);
    if (result.link.startsWith("mailto:")) {
      expect(result.link).toMatch(/^mailto:sales@jowamroasters\.com\?/);
    }
    expect(decodeURIComponent(result.link)).toContain("JW-261001-ABCD");
    expect(append).toHaveBeenCalledWith({
      ref: "JW-261001-ABCD",
      name: "Wanjiru",
      phone: "254712345678",
      email: "wanjiru@example.com",
      method: "Delivery",
      address: "Lavington",
      items: "2 × Nyeri (250g) @ 1,200",
      subtotalKes: 2400,
      notes: "",
    });
  });

  it("rejects orders with unavailable items", async () => {
    await expect(
      placeOrder(
        { form, lines: [{ handle: "nyeri", variantId: "nyeri--1kg", quantity: 1 }] },
        deps(),
      ),
    ).rejects.toBeInstanceOf(OrderError);
  });

  it("still returns the link when the sheet write fails", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await placeOrder(
      { form, lines: [{ handle: "nyeri", variantId: "nyeri--250g", quantity: 1 }] },
      deps(
        vi.fn(async (_row: OrderRow) => {
          throw new Error("sheet down");
        }),
      ),
    );
    expect(result.saved).toBe(false);
    expect(result.link).toBeTruthy();
    spy.mockRestore();
  });

  it("emails the shop and the customer", async () => {
    const send = vi.fn(async (_email: Email) => {});
    const result = await placeOrder(
      { form, lines: [{ handle: "nyeri", variantId: "nyeri--250g", quantity: 1 }] },
      deps(undefined, send),
    );
    expect(result.notified).toBe(true);
    expect(send).toHaveBeenCalledTimes(2);
    const [shop, customer] = send.mock.calls.map(([email]) => email);
    expect(shop).toMatchObject({
      to: "sales@jowamroasters.com",
      replyTo: "wanjiru@example.com",
      idempotencyKey: "order-JW-261001-ABCD-shop",
    });
    expect(customer).toMatchObject({
      to: "wanjiru@example.com",
      replyTo: "sales@jowamroasters.com",
      idempotencyKey: "order-JW-261001-ABCD-customer",
    });
    expect(customer?.text).toContain("JW-261001-ABCD");
  });

  it("still places the order when email fails", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await placeOrder(
      { form, lines: [{ handle: "nyeri", variantId: "nyeri--250g", quantity: 1 }] },
      deps(
        undefined,
        vi.fn(async (_email: Email) => {
          throw new Error("resend down");
        }),
      ),
    );
    expect(result.saved).toBe(true);
    expect(result.notified).toBe(false);
    expect(result.link).toBeTruthy();
    spy.mockRestore();
  });
});
