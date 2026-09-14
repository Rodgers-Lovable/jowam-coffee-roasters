import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Star } from "lucide-react";
import { getPlaceReviews } from "@/lib/place.functions";

function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star key={value} aria-hidden className={`size-3.5 ${value <= Math.round(rating) ? "fill-cherry text-cherry" : "text-border"}`} />
      ))}
    </span>
  );
}

export function GoogleReviews({ tone = "light" }: { tone?: "light" | "deep" }) {
  const fetchReviews = useServerFn(getPlaceReviews);
  const { data } = useQuery({ queryKey: ["place-reviews"], queryFn: () => fetchReviews(), staleTime: 60 * 60 * 1000 });

  if (!data || data.reviews.length === 0) return null;

  return (
    <section className={tone === "deep" ? "bg-paper-deep" : ""}>
      <div className="mx-auto max-w-screen-2xl px-5 py-24 sm:px-8 md:py-32 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">What guests say</p>
            <h2 className="mt-4 max-w-2xl font-display text-5xl leading-[0.98] sm:text-6xl">Kind words from Google.</h2>
          </div>
          <div className="shrink-0">
            {data.rating !== null && (
              <p className="flex items-baseline gap-3">
                <span className="font-display text-5xl">{data.rating.toFixed(1)}</span>
                <span className="flex flex-col gap-1">
                  <Stars rating={data.rating} />
                  <span className="text-xs text-muted-foreground">{data.reviewCount} Google reviews</span>
                </span>
              </p>
            )}
            {data.mapsUri && (
              <a href={data.mapsUri} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.12em] underline underline-offset-4">
                Read on Google
              </a>
            )}
          </div>
        </div>
        <ul className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {data.reviews.slice(0, 6).map((review) => (
            <li key={review.name} className="border-t border-border pt-6">
              <Stars rating={review.rating} />
              <p className="mt-4 text-sm leading-7">“{review.text.length > 320 ? `${review.text.slice(0, 320).trimEnd()}…` : review.text}”</p>
              <div className="mt-5 flex items-center gap-3">
                {review.authorPhoto && <img src={review.authorPhoto} alt="" width={32} height={32} loading="lazy" className="size-8 rounded-full object-cover" />}
                <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                  {review.author}
                  {review.relativeTime && ` · ${review.relativeTime}`}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-xs text-muted-foreground">Reviews and ratings provided by Google.</p>
      </div>
    </section>
  );
}
