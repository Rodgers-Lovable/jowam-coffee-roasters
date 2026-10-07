import { siteInfo } from "@/data/site";

export type EnquiryFields = Record<string, string | string[] | undefined>;

function formatBody(fields: EnquiryFields) {
  return Object.entries(fields)
    .filter(([, value]) => (Array.isArray(value) ? value.length > 0 : Boolean(value?.trim())))
    .map(([label, value]) => `${label}: ${Array.isArray(value) ? value.join(", ") : value}`)
    .join("\n");
}

export function buildMailto(to: string, subject: string, fields: EnquiryFields) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(formatBody(fields))}`;
}

export function buildWhatsApp(subject: string, fields: EnquiryFields) {
  const number = siteInfo.contact.whatsapp;
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(`${subject}\n\n${formatBody(fields)}`)}`;
}
