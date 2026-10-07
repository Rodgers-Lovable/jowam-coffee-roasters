import { confirmChannel, siteInfo } from "@/data/site";
import { filledEntries, type EnquiryFields } from "@/lib/enquiry";

export type RenderedEmail = { subject: string; html: string; text: string };

const colors = { paper: "#f6f1e4", ink: "#2b241c", muted: "#6b6255", rule: "#ddd3bf" };

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const htmlText = (value: string) => escapeHtml(value.trim()).replace(/\n/g, "<br>");

/** The submitted details as an HTML table and as plain text. Blank fields are left out. */
export function renderFields(fields: EnquiryFields) {
  const entries = filledEntries(fields);
  const rows = entries
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 16px 8px 0;border-top:1px solid ${colors.rule};color:${colors.muted};vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td>` +
        `<td style="padding:8px 0;border-top:1px solid ${colors.rule};vertical-align:top">${htmlText(value)}</td></tr>`,
    )
    .join("");
  return {
    html: `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.5">${rows}</table>`,
    text: entries.map(([label, value]) => `${label}: ${value.trim()}`).join("\n"),
  };
}

function layout(
  paragraphs: string[],
  fields: EnquiryFields,
  footer: string,
): Omit<RenderedEmail, "subject"> {
  const details = renderFields(fields);
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:${colors.paper};color:${colors.ink};font-family:Georgia,'Times New Roman',serif">
<div style="max-width:560px;margin:0 auto">
<p style="margin:0 0 24px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:${colors.muted}">${escapeHtml(siteInfo.name)}</p>
${paragraphs.map((p) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6">${htmlText(p)}</p>`).join("\n")}
<div style="margin:24px 0">${details.html}</div>
<p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:${colors.muted}">${htmlText(footer)}</p>
</div></body></html>`;
  const text = `${paragraphs.join("\n\n")}\n\n${details.text}\n\n${footer}`;
  return { html, text };
}

const cafeFooter = `${siteInfo.name}\n${siteInfo.addressLine}, ${siteInfo.city}\n${siteInfo.url}`;
const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

export function orderShopEmail(order: {
  ref: string;
  name: string;
  fields: EnquiryFields;
}): RenderedEmail {
  return {
    subject: `New order ${order.ref} from ${order.name}`,
    ...layout(
      [`New order ${order.ref}. Reply to this email to reach ${order.name} directly.`],
      order.fields,
      cafeFooter,
    ),
  };
}

export function orderCustomerEmail(order: {
  ref: string;
  name: string;
  fields: EnquiryFields;
}): RenderedEmail {
  return {
    subject: `Your Jowam order ${order.ref}`,
    ...layout(
      [
        `Thanks for your order, ${firstName(order.name)}.`,
        `We have order ${order.ref} and will be in touch by ${confirmChannel} to confirm the delivery fee and payment (M-Pesa or on pickup). Here is what you ordered.`,
      ],
      order.fields,
      `Questions about your order? Reply to this email.\n\n${cafeFooter}`,
    ),
  };
}

export function enquiryShopEmail(enquiry: {
  subject: string;
  name: string;
  fields: EnquiryFields;
}): RenderedEmail {
  return {
    subject: enquiry.subject,
    ...layout(
      [`${enquiry.subject}. Reply to this email to reach ${enquiry.name} directly.`],
      enquiry.fields,
      cafeFooter,
    ),
  };
}

export function enquiryConfirmationEmail(enquiry: {
  subject: string;
  name: string;
  message: string;
  fields: EnquiryFields;
}): RenderedEmail {
  return {
    subject: `We got your message: ${enquiry.subject}`,
    ...layout(
      [`Hi ${firstName(enquiry.name)},`, enquiry.message, "Here is a copy of what you sent us."],
      enquiry.fields,
      `Anything to add? Reply to this email.\n\n${cafeFooter}`,
    ),
  };
}
