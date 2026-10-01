import { describe, expect, it } from "vitest";
import { formatKes } from "./money";

describe("formatKes", () => {
  it("formats whole shillings with grouping and no decimals", () => {
    const text = formatKes(1200);
    expect(text).toContain("1,200");
    expect(text).not.toContain(".00");
  });
});
