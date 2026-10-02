import { Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/jowam/product-card";
import { useProducts } from "@/lib/use-products";

// Live coffees from the shop Sheet, so these sections never show stale sample releases.
export function FeaturedCoffees({ limit = 4 }: { limit?: number }) {
  const { data: products = [], isPending } = useProducts();
  const featured = products.filter((p) => p.variants.some((v) => v.available)).slice(0, limit);

  if (isPending) return <div className="min-h-64" aria-hidden />;
  if (featured.length === 0)
    return (
      <p className="border-t border-border pt-6 text-sm text-muted-foreground">
        The shop is being restocked. Ask at the café what is on the roaster this week, or{" "}
        <Link to="/shop" className="underline underline-offset-4">
          check the shop
        </Link>{" "}
        again soon.
      </p>
    );

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
      {featured.map((product) => (
        <ProductCard key={product.handle} product={product} />
      ))}
    </div>
  );
}
