import { describe, expect, it, vi } from "vitest";
import { EMAIL_FROM, EmailError, makeSender, sendEmail, type Email } from "./email.server";

const email: Email = {
  to: "wanjiru@example.com",
  replyTo: "sales@jowamroasters.com",
  subject: "Your Jowam order",
  html: "<p>Hi</p>",
  text: "Hi",
  idempotencyKey: "order-JW-1-customer",
};

describe("sendEmail", () => {
  it("posts to Resend with the key and idempotency header", async () => {
    const fetchFn = vi.fn(async () => new Response("{}", { status: 200 }));
    await sendEmail("re_test", email, fetchFn);
    const [url, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers).toMatchObject({
      authorization: "Bearer re_test",
      "idempotency-key": "order-JW-1-customer",
    });
    expect(JSON.parse(init.body as string)).toEqual({
      from: EMAIL_FROM,
      to: ["wanjiru@example.com"],
      reply_to: "sales@jowamroasters.com",
      subject: "Your Jowam order",
      html: "<p>Hi</p>",
      text: "Hi",
    });
  });

  it("throws on an error status", async () => {
    const fetchFn = vi.fn(async () => new Response("bad key", { status: 403 }));
    await expect(sendEmail("re_test", email, fetchFn)).rejects.toThrow(/403/);
  });

  it("throws when the request fails", async () => {
    const fetchFn = vi.fn(async () => {
      throw new Error("offline");
    });
    await expect(sendEmail("re_test", email, fetchFn)).rejects.toBeInstanceOf(EmailError);
  });
});

describe("makeSender", () => {
  it("fails every send when no key is configured", async () => {
    await expect(makeSender(null)(email)).rejects.toThrow("RESEND_API_KEY is not set");
  });
});
