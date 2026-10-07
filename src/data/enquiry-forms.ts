import { experienceInterests, wholesaleCategories, wholesaleVolumes } from "@/data/jowam";
import { siteInfo } from "@/data/site";
import type { EnquiryField } from "@/lib/enquiry";

type Values = Record<string, string | string[] | undefined>;

export type EnquiryFormConfig = {
  fields: readonly EnquiryField[];
  /** Fixed on the server. Never take a recipient from the browser. */
  shopTo: string;
  subject: (values: Values) => string;
  /** Opening line of the confirmation email sent back to the person who filled the form. */
  confirmation: string;
};

export const enquiryForms = {
  wholesale: {
    fields: [
      { type: "text", name: "name", label: "Your name", required: true },
      { type: "text", name: "business", label: "Business name", required: true },
      { type: "email", name: "email", label: "Email", required: true },
      { type: "tel", name: "phone", label: "Phone" },
      {
        type: "select",
        name: "businessType",
        label: "Type of business",
        options: wholesaleCategories,
        required: true,
      },
      { type: "text", name: "location", label: "Location", placeholder: "Area, city" },
      {
        type: "select",
        name: "volume",
        label: "Roughly how much coffee you use a week",
        options: wholesaleVolumes,
        wide: true,
      },
      {
        type: "textarea",
        name: "message",
        label: "Tell us about your place",
        placeholder: "What you serve, how you brew, what you’re looking for",
      },
    ],
    shopTo: siteInfo.contact.sales,
    subject: (v) => `Wholesale enquiry: ${String(v["business"] ?? "")}`,
    confirmation:
      "Thanks for getting in touch about wholesale coffee. We’ll contact you soon to arrange a tasting and talk through what would suit your service.",
  },
  experiences: {
    fields: [
      { type: "text", name: "name", label: "Your name", required: true },
      { type: "email", name: "email", label: "Email", required: true },
      { type: "tel", name: "phone", label: "Phone", wide: true },
      {
        type: "radio",
        name: "interest",
        label: "I’m interested in",
        options: experienceInterests,
        required: true,
      },
      {
        type: "checkboxes",
        name: "days",
        label: "Days that suit you",
        options: ["Weekdays", "Weekends"],
      },
      {
        type: "textarea",
        name: "notes",
        label: "Anything else",
        placeholder: "Group size, experience level, dates in mind",
      },
    ],
    shopTo: siteInfo.contact.hello,
    subject: (v) => `Experience interest: ${String(v["interest"] ?? "")}`,
    confirmation:
      "Thanks for registering your interest in our coffee experiences. We’ll email you as soon as dates are set.",
  },
} satisfies Record<string, EnquiryFormConfig>;

export type EnquiryFormId = keyof typeof enquiryForms;

export const isEnquiryFormId = (value: unknown): value is EnquiryFormId =>
  typeof value === "string" && Object.hasOwn(enquiryForms, value);
