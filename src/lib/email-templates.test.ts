import { describe, expect, it } from "vitest";
import { enquiryConfirmationEmail, escapeHtml, renderFields } from "./email-templates";

describe("renderFields", () => {
  it("escapes values and skips blank fields", () => {
    const { html, text } = renderFields({
      Name: "<script>alert(1)</script>",
      Phone: "",
      Days: [],
      Interest: ["Cupping", "Brewing"],
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("Phone");
    expect(text).toBe("Name: <script>alert(1)</script>\nInterest: Cupping, Brewing");
  });
});

describe("escapeHtml", () => {
  it("escapes quotes and ampersands", () => {
    expect(escapeHtml(`"Tom & Jerry's"`)).toBe("&quot;Tom &amp; Jerry&#39;s&quot;");
  });
});

describe("enquiryConfirmationEmail", () => {
  it("greets by first name and includes the details", () => {
    const email = enquiryConfirmationEmail({
      subject: "Wholesale enquiry: Java House",
      name: "Wanjiru Kamau",
      message: "We'll be in touch.",
      fields: { "Business name": "Java House" },
    });
    expect(email.text).toContain("Hi Wanjiru,");
    expect(email.text).toContain("Business name: Java House");
  });
});
