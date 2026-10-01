import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatKes } from "@/lib/money";
import type { Product } from "@/lib/products";
import { useCartStore } from "@/stores/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const addLine = useCartStore((state) => state.addLine);
  const available = product.variants.filter((v) => v.available);
  const firstAvailable = available[0];
  const fromPrice = Math.min(...available.map((v) => v.priceKes));
  const hasChoices = product.variants.length > 1;

  const handleAdd = () => {
    if (!firstAvailable) return;
    addLine(product.handle, firstAvailable.id);
    toast.success(`${product.name} added to your bag`);
  };

  return (
    <article className="group flex flex-col border-t border-border pt-5">
      <Link
        to="/product/$handle"
        params={{ handle: product.handle }}
        className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive"
      >
        <div className="aspect-[4/5] overflow-hidden bg-muted">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Photography coming soon
            </div>
          )}
        </div>
        <div className="mt-5 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-3xl leading-none">{product.name}</h3>
          <p className="text-sm tabular-nums">
            {hasChoices ? "From " : ""}
            {formatKes(fromPrice)}
          </p>
        </div>
        <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-olive">
          {product.category}
        </p>
        {product.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {product.description}
          </p>
        )}
      </Link>
      <div className="mt-5 flex gap-2 pt-1">
        {hasChoices ? (
          <Button asChild size="sm" className="flex-1">
            <Link to="/product/$handle" params={{ handle: product.handle }}>
              Choose options
            </Link>
          </Button>
        ) : (
          <Button size="sm" className="flex-1" onClick={handleAdd} disabled={!firstAvailable}>
            {firstAvailable ? "Add to bag" : "Sold out"}
          </Button>
        )}
        <Button asChild variant="outline" size="sm">
          <Link to="/product/$handle" params={{ handle: product.handle }}>
            Details
          </Link>
        </Button>
      </div>
    </article>
  );
}
