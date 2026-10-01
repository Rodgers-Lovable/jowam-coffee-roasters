// Every call to the Google Apps Script web app goes through this module, so moving to the
// Sheets API later only touches this file.

const TIMEOUT_MS = 5_000;

export type SheetConfig = { url: string; secret: string };
type FetchFn = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export type OrderRow = {
  ref: string;
  name: string;
  phone: string;
  email: string;
  method: "Pickup" | "Delivery";
  address: string;
  items: string;
  subtotalKes: number;
  notes: string;
};

export class SheetError extends Error {
  constructor(
    message: string,
    readonly bodySnippet = "",
  ) {
    super(message);
    this.name = "SheetError";
  }
}

async function callScript(url: string, init: RequestInit, fetchFn: FetchFn) {
  const controller = new AbortController();
  const timedOut = new Promise<never>((_, reject) => {
    controller.signal.addEventListener("abort", () =>
      reject(new SheetError("Sheet request timed out")),
    );
  });
  timedOut.catch(() => {}); // avoid an unhandled rejection when the request finishes first
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  let body: string;
  try {
    // The timer keeps running until the body is read, so a stalled body also times out.
    // Apps Script answers with a 302 to script.googleusercontent.com; following it is expected.
    response = await Promise.race([
      fetchFn(url, { ...init, redirect: "follow", signal: controller.signal }),
      timedOut,
    ]);
    body = await Promise.race([response.text(), timedOut]);
  } catch (error) {
    if (error instanceof SheetError) throw error;
    throw new SheetError(
      controller.signal.aborted
        ? "Sheet request timed out"
        : `Sheet request failed: ${String(error)}`,
    );
  } finally {
    clearTimeout(timer);
  }

  const snippet = body.slice(0, 200);
  if (!response.ok) throw new SheetError(`Sheet responded with status ${response.status}`, snippet);

  // Google sometimes serves an HTML error page with status 200.
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new SheetError(`Sheet returned ${contentType || "no content type"}`, snippet);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    throw new SheetError("Sheet returned invalid JSON", snippet);
  }

  const result = parsed as { ok?: unknown; error?: unknown } | null;
  if (!result || result.ok !== true) {
    throw new SheetError(
      `Sheet rejected the request: ${String(result?.error ?? "unknown")}`,
      snippet,
    );
  }
  return result as Record<string, unknown>;
}

export async function readProductRows(config: SheetConfig, fetchFn: FetchFn = fetch) {
  const url = new URL(config.url);
  url.searchParams.set("action", "products");
  url.searchParams.set("secret", config.secret);
  const result = await callScript(url.toString(), { method: "GET" }, fetchFn);
  const rows = result["products"];
  if (!Array.isArray(rows)) throw new SheetError("Sheet response has no products array");
  return rows as unknown[];
}

export async function appendOrderRow(
  config: SheetConfig,
  order: OrderRow,
  fetchFn: FetchFn = fetch,
) {
  await callScript(
    config.url,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret: config.secret, action: "order", order }),
    },
    fetchFn,
  );
}
