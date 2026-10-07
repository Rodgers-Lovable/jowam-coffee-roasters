import { describe, expect, it, vi } from "vitest";
import { experienceInterests, wholesaleCategories } from "@/data/jowam";
import type { Email } from "./email.server";
import { EnquiryInputError, parseSubmitEnquiry } from "./enquiry";
import { deliverEnquiry, EnquiryDeliveryError } from "./enquiry.server";

const wholesale = {
  name: "Wanjiru",
  business: "Lavington Bistro",
  email: "wanjiru@example.com",
  phone: "",
  businessType: wholesaleCategories[0],
  location: "",
  volume: "",
  message: "",
  company: "",
};

describe("parseSubmitEnquiry", () => {
  it("accepts a valid wholesale enquiry", () => {
    const result = parseSubmitEnquiry({ form: "wholesale", values: wholesale });
    expect(result.form).toBe("wholesale");
    expect(result.values["business"]).toBe("Lavington Bistro");
  });

  it("rejects an unknown form", () => {
    expect(() => parseSubmitEnquiry({ form: "contact", values: wholesale })).toThrow(
      EnquiryInputError,
    );
    expect(() => parseSubmitEnquiry({ form: "toString", values: wholesale })).toThrow(
      EnquiryInputError,
    );
  });

  it("rejects options that are not on the form", () => {
    expect(() =>
      parseSubmitEnquiry({ form: "wholesale", values: { ...wholesale, businessType: "Casino" } }),
    ).toThrow(EnquiryInputError);
  });

  it("rejects overlong text", () => {
    expect(() =>
      parseSubmitEnquiry({
        form: "wholesale",
        values: { ...wholesale, message: "x".repeat(2001) },
      }),
    ).toThrow("Keep this under 2000 characters");
  });

  it("ignores a recipient sent from the browser", () => {
    const result = parseSubmitEnquiry({
      form: "wholesale",
      values: { ...wholesale, to: "victim@example.com" },
    });
    expect(result.values).not.toHaveProperty("to");
  });
});

describe("deliverEnquiry", () => {
  const experiences = parseSubmitEnquiry({
    form: "experiences",
    values: {
      name: "Wanjiru Kamau",
      email: "wanjiru@example.com",
      phone: "",
      interest: experienceInterests[0],
      days: ["Weekends"],
      notes: "",
      company: "",
    },
  });

  it("emails the shop inbox for the form and sends the sender a copy", async () => {
    const send = vi.fn(async (_email: Email) => {});
    await deliverEnquiry(experiences, { sendEmail: send, makeId: () => "abc" });
    const [shop, copy] = send.mock.calls.map(([email]) => email);
    expect(shop).toMatchObject({
      to: "hello@jowamroasters.com",
      replyTo: "wanjiru@example.com",
      idempotencyKey: "enquiry-abc-shop",
    });
    expect(copy).toMatchObject({
      to: "wanjiru@example.com",
      replyTo: "hello@jowamroasters.com",
      idempotencyKey: "enquiry-abc-sender",
    });
    expect(copy?.text).toContain("Days that suit you: Weekends");
  });

  it("throws when the shop email fails", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const send = vi.fn(async (email: Email) => {
      if (email.to === "hello@jowamroasters.com") throw new Error("resend down");
    });
    await expect(deliverEnquiry(experiences, { sendEmail: send })).rejects.toBeInstanceOf(
      EnquiryDeliveryError,
    );
    spy.mockRestore();
  });

  it("succeeds when only the copy to the sender fails", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const send = vi.fn(async (email: Email) => {
      if (email.to === "wanjiru@example.com") throw new Error("bounced");
    });
    await expect(deliverEnquiry(experiences, { sendEmail: send })).resolves.toBeUndefined();
    spy.mockRestore();
  });
});
