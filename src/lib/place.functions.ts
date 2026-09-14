import { createServerFn } from "@tanstack/react-start";

export const PLACE_ID = "ChIJldy6YBQZLxgRyNU_M5ty6lI";

export type PlaceReview = {
  name: string;
  author: string;
  authorPhoto?: string | undefined;
  rating: number;
  text: string;
  relativeTime: string;
};

export type PlaceSummary = {
  rating: number | null;
  reviewCount: number | null;
  mapsUri: string | null;
  reviews: PlaceReview[];
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";
const CACHE_TTL_MS = 60 * 60 * 1000;
let cache: { at: number; data: PlaceSummary } | null = null;

export const getPlaceReviews = createServerFn({ method: "GET" }).handler(async (): Promise<PlaceSummary> => {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.data;

  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_MAPS_API_KEY"];
  if (!lovableKey || !connectionKey) {
    return { rating: null, reviewCount: null, mapsUri: null, reviews: [] };
  }

  const response = await fetch(`${GATEWAY_URL}/places/v1/places/${PLACE_ID}`, {
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
      "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Google Places request failed [${response.status}]: ${errorBody}`);
    return { rating: null, reviewCount: null, mapsUri: null, reviews: [] };
  }

  const place = (await response.json()) as {
    rating?: number;
    userRatingCount?: number;
    googleMapsUri?: string;
    reviews?: Array<{
      name?: string;
      rating?: number;
      text?: { text?: string };
      originalText?: { text?: string };
      relativePublishTimeDescription?: string;
      authorAttribution?: { displayName?: string; photoUri?: string };
    }>;
  };

  const data: PlaceSummary = {
    rating: place.rating ?? null,
    reviewCount: place.userRatingCount ?? null,
    mapsUri: place.googleMapsUri ?? null,
    reviews: (place.reviews ?? [])
      .map((review, index) => ({
        name: review.name ?? `review-${index}`,
        author: review.authorAttribution?.displayName ?? "Google reviewer",
        authorPhoto: review.authorAttribution?.photoUri,
        rating: review.rating ?? 0,
        text: (review.text?.text ?? review.originalText?.text ?? "").trim(),
        relativeTime: review.relativePublishTimeDescription ?? "",
      }))
      .filter((review) => review.text.length > 0),
  };

  cache = { at: Date.now(), data };
  return data;
});
