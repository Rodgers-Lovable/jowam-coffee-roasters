import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "./cart-store";

describe("cart store", () => {
  beforeEach(() => useCartStore.getState().clear());

  it("adds lines and merges repeats", () => {
    const { addLine } = useCartStore.getState();
    addLine("nyeri", "nyeri--250g");
    addLine("nyeri", "nyeri--250g", 2);
    expect(useCartStore.getState().lines).toEqual([
      { handle: "nyeri", variantId: "nyeri--250g", quantity: 3 },
    ]);
  });

  it("caps quantity at 50 and removes at 0", () => {
    const { addLine, setQuantity } = useCartStore.getState();
    addLine("nyeri", "nyeri--250g");
    setQuantity("nyeri--250g", 80);
    expect(useCartStore.getState().lines[0]?.quantity).toBe(50);
    setQuantity("nyeri--250g", 0);
    expect(useCartStore.getState().lines).toEqual([]);
  });

  it("removes a line", () => {
    const { addLine, removeLine } = useCartStore.getState();
    addLine("nyeri", "nyeri--250g");
    removeLine("nyeri--250g");
    expect(useCartStore.getState().lines).toEqual([]);
  });
});
