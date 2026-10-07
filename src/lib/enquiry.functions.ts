import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { makeSender } from "@/lib/email.server";
import { EnquiryInputError, parseSubmitEnquiry } from "@/lib/enquiry";
import { deliverEnquiry } from "@/lib/enquiry.server";
import { clientIp, getResendApiKey, rateLimit } from "@/lib/platform.server";

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    try {
      return parseSubmitEnquiry(data);
    } catch (error) {
      if (error instanceof EnquiryInputError) {
        setResponseStatus(400);
        throw new Error(error.message);
      }
      throw error;
    }
  })
  .handler(async ({ data }): Promise<{ sent: true }> => {
    // Honeypot: bots fill every field. Pretend it worked and do nothing.
    if (data.values.company.trim() !== "") return { sent: true };

    if (!(await rateLimit(clientIp(), "ENQUIRY_RATE_LIMITER"))) {
      setResponseStatus(429);
      throw new Error(
        "Too many messages from this connection. Please wait a minute and try again.",
      );
    }

    try {
      await deliverEnquiry(data, { sendEmail: makeSender(await getResendApiKey()) });
      return { sent: true };
    } catch {
      setResponseStatus(500);
      throw new Error("We couldn’t send your message just now.");
    }
  });
