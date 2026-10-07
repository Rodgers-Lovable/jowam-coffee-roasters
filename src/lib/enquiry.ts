import { z } from "zod";
import { enquiryForms, isEnquiryFormId, type EnquiryFormId } from "@/data/enquiry-forms";
import { siteInfo } from "@/data/site";

export type EnquiryFields = Record<string, string | string[] | undefined>;

type BaseField = { name: string; label: string; required?: boolean; wide?: boolean };
export type EnquiryField =
  | (BaseField & { type: "text" | "email" | "tel" | "textarea"; placeholder?: string })
  | (BaseField & { type: "select" | "radio" | "checkboxes"; options: readonly string[] });

export type EnquiryValues = Record<string, string | string[]>;

const MAX_SHORT = 200;
const MAX_LONG = 2000;

/** One schema for the browser and the server, so both check the same rules. */
export function buildEnquirySchema(fields: readonly EnquiryField[]) {
  const shape: Record<string, z.ZodTypeAny> = {
    // Honeypot: hidden from people, filled in by bots.
    company: z
      .string()
      .optional()
      .transform((v) => (v ?? "").slice(0, 500)),
  };
  for (const field of fields) {
    if (field.type === "checkboxes") {
      const list = z
        .array(z.enum(field.options as [string, ...string[]]))
        .max(field.options.length);
      shape[field.name] = field.required ? list.min(1, "Choose at least one option") : list;
    } else if (field.type === "select" || field.type === "radio") {
      const choice = z.enum(field.options as [string, ...string[]], {
        message: `Choose a ${field.label.toLowerCase()}`,
      });
      shape[field.name] = field.required ? choice : z.union([z.literal(""), choice]);
    } else if (field.type === "email") {
      const email = z
        .string()
        .trim()
        .max(254, "Enter a valid email address")
        .email("Enter a valid email address");
      shape[field.name] = field.required ? email : z.union([z.literal(""), email]);
    } else {
      const max = field.type === "textarea" ? MAX_LONG : MAX_SHORT;
      const text = z.string().trim().max(max, `Keep this under ${max} characters`);
      shape[field.name] = field.required ? text.min(1, `${field.label} is required`) : text;
    }
  }
  return z.object(shape);
}

export class EnquiryInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnquiryInputError";
  }
}

export type SubmitEnquiryInput = {
  form: EnquiryFormId;
  values: EnquiryValues & { company: string };
};

export function parseSubmitEnquiry(data: unknown): SubmitEnquiryInput {
  const input = data as { form?: unknown; values?: unknown } | null;
  if (!input || !isEnquiryFormId(input.form)) throw new EnquiryInputError("Unknown form.");
  const result = buildEnquirySchema(enquiryForms[input.form].fields).safeParse(input.values);
  if (!result.success) {
    throw new EnquiryInputError(
      result.error.issues[0]?.message ?? "Please check your details and try again.",
    );
  }
  return { form: input.form, values: result.data as SubmitEnquiryInput["values"] };
}

/** Values keyed by the human label, in form order, for emails and message links. */
export function labelledFields(
  fields: readonly EnquiryField[],
  values: EnquiryValues,
): EnquiryFields {
  return Object.fromEntries(fields.map((f) => [f.label, values[f.name]]));
}

/** Label and value pairs with blanks dropped and lists joined, in field order. */
export function filledEntries(fields: EnquiryFields): [string, string][] {
  return Object.entries(fields)
    .filter(([, value]) => (Array.isArray(value) ? value.length > 0 : Boolean(value?.trim())))
    .map(([label, value]) => [label, Array.isArray(value) ? value.join(", ") : (value ?? "")]);
}

function formatBody(fields: EnquiryFields) {
  return filledEntries(fields)
    .map(([label, value]) => `${label}: ${value}`)
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
