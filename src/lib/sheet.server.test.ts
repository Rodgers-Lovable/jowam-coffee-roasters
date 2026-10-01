import { describe, expect, it, vi } from "vitest";
import { appendOrderRow, readProductRows, SheetError, type OrderRow } from "./sheet.server";

const config = { url: "https://script.google.com/macros/s/abc/exec", secret: "s3cret" };

function respond(body: string, init: { status?: number; type?: string } = {}) {
  return vi.fn(
    async (_input: string | URL | Request, _init?: RequestInit) =>
      new Response(body, {
        status: init.status ?? 200,
        headers: { "content-type": init.type ?? "application/json; charset=utf-8" },
      }),
  );
}

const order: OrderRow = {
  ref: "JW-261001-ABCD",
  name: "Wanjiru",
  phone: "254712345678",
  email: "",
  method: "Pickup",
  address: "",
  items: "1 × Nyeri (250g) @ 1,200",
  subtotalKes: 1200,
  notes: "",
};

describe("readProductRows", () => {
  it("sends the secret and returns the rows", async () => {
    const fetchFn = respond(JSON.stringify({ ok: true, products: [{ Handle: "nyeri" }] }));
    await expect(readProductRows(config, fetchFn)).resolves.toEqual([{ Handle: "nyeri" }]);
    const calledUrl = String(fetchFn.mock.calls[0]?.[0]);
    expect(calledUrl).toContain("action=products");
    expect(calledUrl).toContain("secret=s3cret");
  });

  it("treats an HTML page with status 200 as a failure", async () => {
    const fetchFn = respond("<html>Sorry, unable to open the file</html>", { type: "text/html" });
    await expect(readProductRows(config, fetchFn)).rejects.toBeInstanceOf(SheetError);
  });

  it("treats invalid JSON as a failure", async () => {
    const fetchFn = respond("{not json");
    await expect(readProductRows(config, fetchFn)).rejects.toThrow("invalid JSON");
  });

  it("treats ok:false as a failure", async () => {
    const fetchFn = respond(JSON.stringify({ ok: false, error: "unauthorized" }));
    await expect(readProductRows(config, fetchFn)).rejects.toThrow("unauthorized");
  });

  it("treats a non 2xx status as a failure", async () => {
    const fetchFn = respond("oops", { status: 500, type: "text/plain" });
    await expect(readProductRows(config, fetchFn)).rejects.toThrow("500");
  });

  it("times out", async () => {
    vi.useFakeTimers();
    const fetchFn = vi.fn(
      (_url: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_, reject) => {
          init?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
        }),
    );
    const pending = readProductRows(config, fetchFn);
    const assertion = expect(pending).rejects.toThrow("timed out");
    await vi.advanceTimersByTimeAsync(5_000);
    await assertion;
    vi.useRealTimers();
  });
});

describe("body read timeout", () => {
  it("times out when the response body never arrives", async () => {
    vi.useFakeTimers();
    const hanging = {
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      text: () => new Promise<string>(() => {}),
    } as unknown as Response;
    const fetchFn = vi.fn(async () => hanging);
    const pending = readProductRows(config, fetchFn);
    const assertion = expect(pending).rejects.toThrow("timed out");
    await vi.advanceTimersByTimeAsync(5_000);
    await assertion;
    vi.useRealTimers();
  });
});

describe("appendOrderRow", () => {
  it("posts the order with the secret in the body", async () => {
    const fetchFn = respond(JSON.stringify({ ok: true }));
    await appendOrderRow(config, order, fetchFn);
    const init = fetchFn.mock.calls[0]?.[1] as RequestInit;
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toEqual({ secret: "s3cret", action: "order", order });
  });
});
