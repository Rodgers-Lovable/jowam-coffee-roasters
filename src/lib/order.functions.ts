import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { clientIp, getSheetConfig, rateLimit } from "@/lib/platform.server";
import { makeOrderRef, OrderInputError, parseSubmitOrder } from "@/lib/order";
import { OrderError, placeOrder, type PlaceOrderResult } from "@/lib/order.server";
import { getLiveProducts } from "@/lib/products.server";
import { appendOrderRow } from "@/lib/sheet.server";

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    try {
      return parseSubmitOrder(data);
    } catch (error) {
      if (error instanceof OrderInputError) {
        setResponseStatus(400);
        throw new Error(error.message);
      }
      throw error;
    }
  })
  .handler(async ({ data }): Promise<PlaceOrderResult> => {
    // Honeypot: bots fill every field. Pretend it worked and do nothing.
    if (data.form.company.trim() !== "") {
      return { ref: makeOrderRef(), saved: true, link: "/" };
    }

    if (!(await rateLimit(clientIp()))) {
      setResponseStatus(429);
      throw new Error("Too many orders from this connection. Please wait a minute and try again.");
    }

    try {
      return await placeOrder(data, {
        loadProducts: getLiveProducts,
        appendOrderRow: async (row) => appendOrderRow(await getSheetConfig(), row),
      });
    } catch (error) {
      if (error instanceof OrderError) {
        setResponseStatus(400);
        throw new Error(error.message);
      }
      console.error(
        "[orders] submit failed",
        error instanceof Error ? error.message : String(error),
      );
      setResponseStatus(500);
      throw new Error("We could not place your order. Please try again or message us on WhatsApp.");
    }
  });
