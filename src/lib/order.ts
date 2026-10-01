import { z } from "zod";
import type { EnquiryFields } from "@/lib/enquiry";
import type { Product } from "@/lib/products";

export const MAX_QUANTITY = 50;

export function normalizePhone(input: string): string | null {
  const compact = input.replace(/[\s\-()]/g, "");
  const match = /^(?:\+?254|0)([17]\d{8})$/.exec(compact);
  return match ? `254${match[1]}` : null;
}

const REF_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function makeOrderRef(
  now: Date = new Date(),
  randomBytes: (n: number) => Uint8Array = (n) => crypto.getRandomValues(new Uint8Array(n)),
) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  const suffix = Array.from(randomBytes(4), (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join("");
  return `JW-${part("year")}${part("month")}${part("day")}-${suffix}`;
}

export const orderFormSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name").max(80, "Keep the name under 80 characters"),
    phone: z
      .string()
      .trim()
      .refine((v) => normalizePhone(v) !== null, "Enter a Kenyan mobile number, e.g. 0712 345 678"),
    email: z.union([z.literal(""), z.string().trim().email("Enter a valid email address")]),
    method: z.enum(["Pickup", "Delivery"]),
    address: z.string().trim().max(200, "Keep the address under 200 characters"),
    notes: z.string().trim().max(500, "Keep notes under 500 characters"),
    company: z.string(),
  })
  .superRefine((value, ctx) => {
    if (value.method === "Delivery" && value.address.length === 0) {
      ctx.addIssue({ code: "custom", path: ["address"], message: "Tell us where to deliver" });
    }
  });

export type OrderForm = z.infer<typeof orderFormSchema>;

export const orderLineSchema = z.object({
  handle: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(MAX_QUANTITY),
});

export type OrderLine = z.infer<typeof orderLineSchema>;

export const submitOrderSchema = z.object({
  form: orderFormSchema,
  lines: z.array(orderLineSchema).min(1, "Your bag is empty").max(30),
});

export type SubmitOrderInput = z.infer<typeof submitOrderSchema>;

export type PricedItem = {
  handle: string;
  variantId: string;
  name: string;
  variantLabel: string;
  image: string | null;
  priceKes: number;
  quantity: number;
  lineTotal: number;
};

export function resolveLines(products: Product[], lines: OrderLine[]) {
  const items: PricedItem[] = [];
  const unavailable: OrderLine[] = [];

  for (const line of lines) {
    const product = products.find((p) => p.handle === line.handle);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    if (!product || !variant || !variant.available) {
      unavailable.push(line);
      continue;
    }
    items.push({
      handle: product.handle,
      variantId: variant.id,
      name: product.name,
      variantLabel: variant.label,
      image: product.image,
      priceKes: variant.priceKes,
      quantity: line.quantity,
      lineTotal: variant.priceKes * line.quantity,
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return { items, unavailable, subtotal };
}

const plainNumber = new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 });

export function formatItemsText(items: PricedItem[]) {
  return items
    .map((i) => `${i.quantity} × ${i.name} (${i.variantLabel}) @ ${plainNumber.format(i.priceKes)}`)
    .join("\n");
}

export function orderFields(order: {
  ref: string;
  items: PricedItem[];
  subtotal: number;
  form: OrderForm;
}): EnquiryFields {
  const { form } = order;
  return {
    Order: order.ref,
    Items: `\n${formatItemsText(order.items)}`,
    Subtotal: `KES ${plainNumber.format(order.subtotal)} (delivery fee confirmed on WhatsApp)`,
    Name: form.name,
    Phone: normalizePhone(form.phone) ?? form.phone,
    Email: form.email,
    Method: form.method,
    Address: form.method === "Delivery" ? form.address : "",
    Notes: form.notes,
  };
}
