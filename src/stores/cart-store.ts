import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MAX_QUANTITY, type OrderLine } from "@/lib/order";

interface CartStore {
  lines: OrderLine[];
  addLine: (handle: string, variantId: string, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  removeLine: (variantId: string) => void;
  clear: () => void;
}

const clamp = (quantity: number) => Math.min(MAX_QUANTITY, Math.max(0, Math.floor(quantity)));

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      lines: [],
      addLine: (handle, variantId, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.variantId === variantId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.variantId === variantId ? { ...l, quantity: clamp(l.quantity + quantity) } : l,
              ),
            };
          }
          return { lines: [...state.lines, { handle, variantId, quantity: clamp(quantity) }] };
        }),
      setQuantity: (variantId, quantity) =>
        set((state) => {
          const next = clamp(quantity);
          if (next === 0) return { lines: state.lines.filter((l) => l.variantId !== variantId) };
          return {
            lines: state.lines.map((l) =>
              l.variantId === variantId ? { ...l, quantity: next } : l,
            ),
          };
        }),
      removeLine: (variantId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.variantId !== variantId) })),
      clear: () => set({ lines: [] }),
    }),
    {
      // New key, so carts saved by the old Shopify store are ignored.
      name: "jowam-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
