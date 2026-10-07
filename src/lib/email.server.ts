// Every email goes through Resend's REST API from this module, so changing provider only
// touches this file.

const TIMEOUT_MS = 5_000;
const RESEND_URL = "https://api.resend.com/emails";

export const EMAIL_FROM = "Jowam Coffee Roasters <noreply@jowamroasters.com>";

type FetchFn = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export type Email = {
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
  /** Resend drops repeats with the same key for 24 hours, so retries never double send. */
  idempotencyKey: string;
};

export type SendEmail = (email: Email) => Promise<void>;

export class EmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailError";
  }
}

export async function sendEmail(apiKey: string, email: Email, fetchFn: FetchFn = fetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetchFn(RESEND_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
        "idempotency-key": email.idempotencyKey,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [email.to],
        reply_to: email.replyTo,
        subject: email.subject,
        html: email.html,
        text: email.text,
      }),
      signal: controller.signal,
    });
  } catch (error) {
    throw new EmailError(
      controller.signal.aborted
        ? "Resend request timed out"
        : `Resend request failed: ${String(error)}`,
    );
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new EmailError(`Resend responded with status ${response.status}: ${body.slice(0, 200)}`);
  }
}

/** A sender bound to the key, or one that always fails when no key is configured. */
export function makeSender(apiKey: string | null): SendEmail {
  if (!apiKey) {
    return async () => {
      throw new EmailError("RESEND_API_KEY is not set");
    };
  }
  return (email) => sendEmail(apiKey, email);
}
