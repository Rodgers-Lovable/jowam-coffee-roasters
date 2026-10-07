import { enquiryForms } from "@/data/enquiry-forms";
import type { SendEmail } from "@/lib/email.server";
import { enquiryConfirmationEmail, enquiryShopEmail } from "@/lib/email-templates";
import { labelledFields, type SubmitEnquiryInput } from "@/lib/enquiry";

export class EnquiryDeliveryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnquiryDeliveryError";
  }
}

/** Emails the shop and sends the sender a copy. Throws only when the shop email fails. */
export async function deliverEnquiry(
  input: SubmitEnquiryInput,
  deps: { sendEmail: SendEmail; makeId?: () => string },
) {
  const config = enquiryForms[input.form];
  const { values } = input;
  const name = String(values["name"] ?? "");
  const email = String(values["email"] ?? "");
  // One line, capped, so a long business name cannot stretch the subject.
  const subject = config.subject(values).replace(/\s+/g, " ").trim().slice(0, 150);
  const fields = labelledFields(config.fields, values);
  const id = (deps.makeId ?? (() => crypto.randomUUID()))();

  const [shop, confirmation] = await Promise.allSettled([
    deps.sendEmail({
      ...enquiryShopEmail({ subject, name, fields }),
      to: config.shopTo,
      replyTo: email,
      idempotencyKey: `enquiry-${id}-shop`,
    }),
    deps.sendEmail({
      ...enquiryConfirmationEmail({ subject, name, message: config.confirmation, fields }),
      to: email,
      replyTo: config.shopTo,
      idempotencyKey: `enquiry-${id}-sender`,
    }),
  ]);

  if (confirmation.status === "rejected") {
    console.error(
      `[enquiries] could not send the ${input.form} confirmation`,
      confirmation.reason instanceof Error
        ? confirmation.reason.message
        : String(confirmation.reason),
    );
  }
  if (shop.status === "rejected") {
    const reason = shop.reason instanceof Error ? shop.reason.message : String(shop.reason);
    console.error(`[enquiries] could not email the shop about a ${input.form} enquiry`, reason);
    throw new EnquiryDeliveryError(reason);
  }
}
