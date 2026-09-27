import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProductByHandle, formatMoney } from "@/lib/shopify";
import { useCartStore } from "@/stores/cart-store";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.handle.replace(/-/g, " ")} | Jowam Coffee Roasters` },
      { name: "description", content: "A freshly roasted coffee release from Jowam Coffee Roasters in Nairobi." },
      { property: "og:title", content: "Jowam Coffee Roasters" },
      { property: "og:description", content: "A freshly roasted coffee release from Jowam Coffee Roasters in Nairobi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data: product, isLoading } = useQuery({
    queryKey: ["shopify-product", handle],
    queryFn: () => fetchProductByHandle(handle),
    staleTime: 5 * 60 * 1000,
  });

  const addItem = useCartStore((state) => state.addItem);
  const isCartLoading = useCartStore((state) => state.isLoading);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <main className="mx-auto grid max-w-screen-2xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-12">
        <Skeleton className="aspect-[4/5] w-full rounded-none" />
        <div>
          <Skeleton className="h-14 w-3/4 rounded-none" />
          <Skeleton className="mt-6 h-5 w-full rounded-none" />
          <Skeleton className="mt-2 h-5 w-5/6 rounded-none" />
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-screen-2xl px-5 py-24 text-center sm:px-8 lg:px-12">
        <p className="eyebrow">Shop Jowam</p>
        <h1 className="mt-5 font-display text-6xl">We couldn't find that coffee.</h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-muted-foreground">
          It may have sold out or moved. Have a look at what we are roasting right now.
        </p>
        <Button asChild className="mt-8"><Link to="/shop">Back to the shop</Link></Button>
      </main>
    );
  }

  const node = product.node;
  const variants = node.variants.edges.map((e) => e.node);
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? variants.find((v) => v.availableForSale) ?? variants[0];
  const images = node.images.edges.map((e) => e.node);
  const image = images[activeImage] ?? images[0];

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions ?? [],
    });
    toast.success(`${node.title} added to your bag`);
  };

  return (
    <main className="mx-auto max-w-screen-2xl px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
      <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Back to the shop
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <div className="aspect-[4/5] overflow-hidden bg-muted">
            {image ? (
              <img src={image.url} alt={image.altText ?? node.title} className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Photography coming soon
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={`size-20 overflow-hidden border ${i === activeImage ? "border-olive" : "border-border"}`}
                >
                  <img src={img.url} alt={img.altText ?? ""} className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-xl">
          {node.productType && <p className="eyebrow">{node.productType}</p>}
          <h1 className="mt-4 font-display text-6xl leading-[0.92] sm:text-7xl">{node.title}</h1>
          <p className="mt-6 font-display text-4xl tabular-nums">
            {selectedVariant ? formatMoney(selectedVariant.price.amount, selectedVariant.price.currencyCode) : ""}
          </p>
          {node.description && <p className="mt-7 whitespace-pre-line text-base leading-7 text-muted-foreground">{node.description}</p>}

          {variants.length > 1 && (
            <div className="mt-9">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Options</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    disabled={!variant.availableForSale}
                    className={`border px-4 py-2 text-sm transition-colors disabled:opacity-40 ${
                      selectedVariant?.id === variant.id
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" onClick={handleAddToCart} disabled={isCartLoading || !selectedVariant?.availableForSale}>
              {isCartLoading ? <Loader2 className="size-4 animate-spin" /> : selectedVariant?.availableForSale ? "Add to bag" : "Sold out"}
            </Button>
            <Button asChild variant="outline" size="lg"><Link to="/shop">Keep browsing</Link></Button>
          </div>

          <dl className="mt-12 divide-y divide-border border-t border-border text-sm">
            <div className="flex justify-between gap-6 py-4">
              <dt className="text-muted-foreground">Roasted</dt>
              <dd className="text-right">In small batches at our Lavington roastery</dd>
            </div>
            <div className="flex justify-between gap-6 py-4">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="text-right">Calculated at checkout</dd>
            </div>
            <div className="flex justify-between gap-6 py-4">
              <dt className="text-muted-foreground">Collection</dt>
              <dd className="text-right">Lavington Mall, James Gichuru Road</dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}
