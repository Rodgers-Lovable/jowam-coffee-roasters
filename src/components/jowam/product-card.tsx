import { Link } from "@tanstack/react-router";
import fallbackImage from "@/assets/jowam-bags-latte.jpg";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatKes } from "@/lib/money";
import type { Product } from "@/lib/products";
import { useCartStore } from "@/stores/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const addLine = useCartStore((state) => state.addLine);
  const available = product.variants.filter((v) => v.available);
  const firstAvailable = available[0];
  const priced = available.length > 0 ? available : product.variants;
  const fromPrice = Math.min(...priced.map((v) => v.priceKes));
  const hasChoices = product.variants.length > 1;

  const handleAdd = () => {
    if (!firstAvailable) return;
    addLine(product.handle, firstAvailable.id);
    toast.success(`${product.name} added to your bag`);
  };

  return (
    <article className="group flex h-full flex-col border-t border-border pt-4">
      <Link
        to="/product/$handle"
        params={{ handle: product.handle }}
        className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive"
      >
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image || fallbackImage}
            alt={product.image ? product.name : "Bags of Jowam coffee beside a latte"}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
        <p className="mt-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-olive">
          {product.category}
        </p>
        <h3 className="mt-1.5 font-display text-xl leading-tight sm:text-2xl">{product.name}</h3>
        <p className="mt-2 flex items-baseline gap-1.5">
          {firstAvailable ? (
            <>
              {hasChoices && (
                <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  From
                </span>
              )}
              <span className="font-display text-2xl tabular-nums text-foreground sm:text-3xl">
                {formatKes(fromPrice)}
              </span>
            </>
          ) : (
            <span className="font-display text-2xl text-muted-foreground">Sold out</span>
          )}
        </p>
        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {product.description}
          </p>
        )}
      </Link>
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        {hasChoices ? (
          <Button asChild size="sm" className="flex-1">
            <Link to="/product/$handle" params={{ handle: product.handle }}>
              Choose options
            </Link>
          </Button>
        ) : (
          <>
            <Button size="sm" className="flex-1" onClick={handleAdd} disabled={!firstAvailable}>
              {firstAvailable ? "Add to bag" : "Sold out"}
            </Button>
            {/* "Choose options" already opens the product page, so Details only sits beside Add to bag. */}
            <Button asChild variant="outline" size="sm">
              <Link to="/product/$handle" params={{ handle: product.handle }}>
                Details
              </Link>
            </Button>
          </>
        )}
      </div>
    </article>
  );
}
