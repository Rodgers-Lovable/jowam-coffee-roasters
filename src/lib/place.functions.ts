import { createServerFn } from "@tanstack/react-start";
import { EMPTY_PLACE_SUMMARY, PLACE_ID, toPlaceSummary, type PlaceSummary } from "@/lib/place";
import { getPlacesApiKey, placeSummaryCache } from "@/lib/platform.server";

const PLACES_URL = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
const TIMEOUT_MS = 8_000;

export const getPlaceReviews = createServerFn({ method: "GET" }).handler(
  async (): Promise<PlaceSummary> => {
    try {
      const cached = await placeSummaryCache.get();
      if (cached) return cached;
    } catch (error) {
      console.error(
        "[reviews] cache read failed",
        error instanceof Error ? error.message : String(error),
      );
    }

    const apiKey = await getPlacesApiKey();
    if (!apiKey) return EMPTY_PLACE_SUMMARY; // reviews section stays hidden until a key is set

    let response: Response;
    try {
      response = await fetch(PLACES_URL, {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
        },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      console.error(
        "[reviews] Places request failed",
        error instanceof Error ? error.message : String(error),
      );
      return EMPTY_PLACE_SUMMARY;
    }

    if (!response.ok) {
      const body = (await response.text()).slice(0, 200);
      console.error(`[reviews] Places responded ${response.status}: ${body}`);
      return EMPTY_PLACE_SUMMARY;
    }

    const summary = toPlaceSummary(await response.json());
    try {
      await placeSummaryCache.put(summary);
    } catch (error) {
      console.error(
        "[reviews] cache write failed",
        error instanceof Error ? error.message : String(error),
      );
    }
    return summary;
  },
);
