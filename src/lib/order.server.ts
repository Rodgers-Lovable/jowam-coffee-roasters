import { siteInfo } from "@/data/site";
import type { SendEmail } from "@/lib/email.server";
import { orderCustomerEmail, orderShopEmail } from "@/lib/email-templates";
import { buildMailto, buildWhatsApp } from "@/lib/enquiry";
import {
  formatItemsText,
  makeOrderRef,
  normalizePhone,
  orderFields,
  resolveLines,
  type SubmitOrderInput,
} from "@/lib/order";
import type { Product } from "@/lib/products";
import type { OrderRow } from "@/lib/sheet.server";

export class OrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderError";
  }
}

type PlaceOrderDeps = {
  loadProducts: () => Promise<Product[]>;
  appendOrderRow: (row: OrderRow) => Promise<void>;
  sendEmail: SendEmail;
  makeRef?: () => string;
};

/** notified: the shop email went out. link: the message fallback for when it did not. */
export type PlaceOrderResult = { ref: string; saved: boolean; notified: boolean; link: string };

export async function placeOrder(
  input: SubmitOrderInput,
  deps: PlaceOrderDeps,
): Promise<PlaceOrderResult> {
  const products = await deps.loadProducts();
  const { items, unavailable, subtotal } = resolveLines(products, input.lines);
  if (unavailable.length > 0 || items.length === 0) {
    throw new OrderError(
      "Some items in your bag are no longer available. Remove them from your bag and try again.",
    );
  }

  const ref = (deps.makeRef ?? makeOrderRef)();
  const { form } = input;
  const row: OrderRow = {
    ref,
    name: form.name,
    phone: normalizePhone(form.phone) ?? form.phone,
    email: form.email,
    method: form.method,
    address: form.method === "Delivery" ? form.address : "",
    items: formatItemsText(items),
    subtotalKes: subtotal,
    notes: form.notes,
  };

  let saved = true;
  try {
    await deps.appendOrderRow(row);
  } catch (error) {
    saved = false;
    console.error(
      `[orders] could not save ${ref} to the Sheet`,
      error instanceof Error ? error.message : String(error),
    );
  }

  const subject = `Jowam order ${ref}`;
  const fields = orderFields({ ref, items, subtotal, form });
  const shop = orderShopEmail({ ref, name: form.name, fields });
  const customer = orderCustomerEmail({ ref, name: form.name, fields });
  const [shopResult, customerResult] = await Promise.allSettled([
    deps.sendEmail({
      ...shop,
      to: siteInfo.contact.sales,
      replyTo: form.email,
      idempotencyKey: `order-${ref}-shop`,
    }),
    deps.sendEmail({
      ...customer,
      to: form.email,
      replyTo: siteInfo.contact.sales,
      idempotencyKey: `order-${ref}-customer`,
    }),
  ]);
  for (const [who, result] of [
    ["shop", shopResult],
    ["customer", customerResult],
  ] as const) {
    if (result.status === "rejected") {
      console.error(
        `[orders] could not email the ${who} about ${ref}`,
        result.reason instanceof Error ? result.reason.message : String(result.reason),
      );
    }
  }

  const link =
    buildWhatsApp(subject, fields) ?? buildMailto(siteInfo.contact.sales, subject, fields);
  return { ref, saved, notified: shopResult.status === "fulfilled", link };
}
