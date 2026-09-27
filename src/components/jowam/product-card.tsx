import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);

  const node = product.node;
  const image = node.images?.edges?.[0]?.node;
  const variant = node.variants?.edges?.find((v) => v.node.availableForSale)?.node ?? node.variants?.edges?.[0]?.node;
  const soldOut = !variant?.availableForSale;
  const hasChoices = node.variants.edges.length > 1;

  const handleAddToCart = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions ?? [],
    });
    toast.success(`${node.title} added to your bag`);
  };

  return (
    <article className="group flex flex-col border-t border-border pt-5">
      <Link to="/product/$handle" params={{ handle: node.handle }} className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive">
        <div className="aspect-[4/5] overflow-hidden bg-muted">
          {image ? (
            <img
              src={image.url}
              alt={image.altText ?? node.title}
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
          <h3 className="font-display text-3xl leading-none">{node.title}</h3>
          <p className="text-sm tabular-nums">
            {formatMoney(node.priceRange.minVariantPrice.amount, node.priceRange.minVariantPrice.currencyCode)}
          </p>
        </div>
        {node.productType && <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-olive">{node.productType}</p>}
        {node.description && <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{node.description}</p>}
      </Link>
      <div className="mt-5 flex gap-2 pt-1">
        {hasChoices ? (
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link to="/product/$handle" params={{ handle: node.handle }}>Choose options</Link>
          </Button>
        ) : (
          <Button size="sm" className="flex-1" onClick={handleAddToCart} disabled={isLoading || soldOut || !variant}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : soldOut ? "Sold out" : "Add to bag"}
          </Button>
        )}
        <Button asChild variant="outline" size="sm">
          <Link to="/product/$handle" params={{ handle: node.handle }}>Details</Link>
        </Button>
      </div>
    </article>
  );
}
