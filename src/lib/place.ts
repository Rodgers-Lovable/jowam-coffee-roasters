// Google Places data for the café, shared by the server function and the reviews section.

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

export const EMPTY_PLACE_SUMMARY: PlaceSummary = {
  rating: null,
  reviewCount: null,
  mapsUri: null,
  reviews: [],
};

type RawPlace = {
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

/** Maps a Places API (New) place response to what the site shows. Drops reviews with no text. */
export function toPlaceSummary(raw: unknown): PlaceSummary {
  if (!raw || typeof raw !== "object") return EMPTY_PLACE_SUMMARY;
  const place = raw as RawPlace;
  return {
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
}
