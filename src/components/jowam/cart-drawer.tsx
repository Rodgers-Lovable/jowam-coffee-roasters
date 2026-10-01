import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatKes } from "@/lib/money";
import { resolveLines } from "@/lib/order";
import { useProducts } from "@/lib/use-products";
import { useCartStore } from "@/stores/cart-store";

function handleToWords(handle: string) {
  const words = handle.replace(/-/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { lines, setQuantity, removeLine } = useCartStore();
  const { data: products = [], isPending } = useProducts();
  const { items, unavailable, subtotal } = resolveLines(products, lines);

  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Shopping bag, ${totalItems} items`}
        >
          <ShoppingBag />
          {totalItems > 0 && (
            <span className="absolute -right-0.5 -top-0.5 inline-flex size-4 items-center justify-center rounded-full bg-cherry text-[0.6rem] font-semibold text-ink-foreground">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full w-full flex-col border-l-border bg-background p-7 sm:max-w-md">
        <SheetHeader className="shrink-0 p-0 text-left">
          <SheetTitle className="font-display text-4xl">Your bag</SheetTitle>
          <SheetDescription>
            {totalItems === 0
              ? "Nothing in your bag yet."
              : `${totalItems} item${totalItems !== 1 ? "s" : ""} in your bag.`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col pt-7">
          {lines.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="mx-auto size-10 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Your bag is empty.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 divide-y divide-border overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 py-4 first:pt-0">
                    <div className="size-20 shrink-0 overflow-hidden bg-muted">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="size-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold">{item.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.variantLabel}</p>
                      <p className="mt-2 text-sm tabular-nums">{formatKes(item.priceKes)}</p>
                      <div className="mt-3 flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-7"
                          aria-label="Decrease quantity"
                          onClick={() => setQuantity(item.variantId, item.quantity - 1)}
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="w-7 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-7"
                          aria-label="Increase quantity"
                          onClick={() => setQuantity(item.variantId, item.quantity + 1)}
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeLine(item.variantId)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
                {!isPending &&
                  unavailable.map((line) => (
                    <div
                      key={line.variantId}
                      className="flex items-center gap-4 py-4 text-muted-foreground"
                    >
                      <p className="flex-1 text-sm">
                        {handleToWords(line.handle)} is no longer available and will not be ordered.
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0"
                        aria-label="Remove unavailable item"
                        onClick={() => removeLine(line.variantId)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  ))}
              </div>

              <div className="shrink-0 space-y-4 border-t border-border pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-display text-3xl tabular-nums">{formatKes(subtotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Delivery fee and payment are confirmed on WhatsApp.
                </p>
                {items.length === 0 ? (
                  <>
                    <Button size="lg" className="w-full" disabled>
                      Place order
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Nothing in your bag can be ordered right now.
                    </p>
                  </>
                ) : (
                  <Button asChild className="w-full" size="lg">
                    <Link to="/order" onClick={() => setIsOpen(false)}>
                      Place order
                    </Link>
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
