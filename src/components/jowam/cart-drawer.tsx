import { useEffect, useState } from "react";
import { ExternalLink, Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cart-store";
import { formatMoney } from "@/lib/shopify";

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + Number.parseFloat(item.price.amount) * item.quantity, 0);
  const currency = items[0]?.price.currencyCode ?? "KES";

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank");
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Shopping bag, ${totalItems} items`}>
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
            {totalItems === 0 ? "Nothing in your bag yet." : `${totalItems} item${totalItems !== 1 ? "s" : ""} ready for checkout.`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col pt-7">
          {items.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="mx-auto size-10 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Your bag is empty.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 divide-y divide-border overflow-y-auto pr-1">
                {items.map((item) => {
                  const image = item.product.node.images?.edges?.[0]?.node;
                  return (
                    <div key={item.variantId} className="flex gap-4 py-4 first:pt-0">
                      <div className="size-20 shrink-0 overflow-hidden bg-muted">
                        {image && <img src={image.url} alt={image.altText ?? item.product.node.title} className="size-full object-cover" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold">{item.product.node.title}</h3>
                        {item.selectedOptions.length > 0 && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.selectedOptions.map((o) => o.value).join(" · ")}
                          </p>
                        )}
                        <p className="mt-2 text-sm tabular-nums">{formatMoney(item.price.amount, item.price.currencyCode)}</p>
                        <div className="mt-3 flex items-center gap-1.5">
                          <Button variant="outline" size="icon" className="size-7" aria-label="Decrease quantity" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-7 text-center text-sm tabular-nums">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="size-7" aria-label="Increase quantity" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                            <Plus className="size-3" />
                          </Button>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="size-7 shrink-0" aria-label={`Remove ${item.product.node.title}`} onClick={() => removeItem(item.variantId)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              <div className="shrink-0 space-y-4 border-t border-border pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Subtotal</span>
                  <span className="font-display text-3xl tabular-nums">{formatMoney(String(totalPrice), currency)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Taxes and delivery are calculated at checkout.</p>
                <Button onClick={handleCheckout} className="w-full" size="lg" disabled={items.length === 0 || isLoading || isSyncing}>
                  {isLoading || isSyncing ? <Loader2 className="size-4 animate-spin" /> : <><ExternalLink className="mr-2 size-4" />Checkout</>}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
