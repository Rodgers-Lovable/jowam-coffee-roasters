import { describe, expect, it } from "vitest";
import { EMPTY_PLACE_SUMMARY, toPlaceSummary } from "./place";

describe("toPlaceSummary", () => {
  it("maps a Places API (New) response", () => {
    const summary = toPlaceSummary({
      rating: 4.7,
      userRatingCount: 212,
      googleMapsUri: "https://maps.google.com/?cid=1",
      reviews: [
        {
          name: "places/x/reviews/1",
          rating: 5,
          text: { text: " Lovely flat white. " },
          relativePublishTimeDescription: "a week ago",
          authorAttribution: { displayName: "Wanjiru", photoUri: "https://photo" },
        },
        { name: "places/x/reviews/2", rating: 4, originalText: { text: "Great service" } },
        { name: "places/x/reviews/3", rating: 3, text: { text: "   " } },
      ],
    });

    expect(summary).toEqual({
      rating: 4.7,
      reviewCount: 212,
      mapsUri: "https://maps.google.com/?cid=1",
      reviews: [
        {
          name: "places/x/reviews/1",
          author: "Wanjiru",
          authorPhoto: "https://photo",
          rating: 5,
          text: "Lovely flat white.",
          relativeTime: "a week ago",
        },
        {
          name: "places/x/reviews/2",
          author: "Google reviewer",
          authorPhoto: undefined,
          rating: 4,
          text: "Great service",
          relativeTime: "",
        },
      ],
    });
  });

  it("returns the empty summary for anything that is not an object", () => {
    expect(toPlaceSummary(null)).toEqual(EMPTY_PLACE_SUMMARY);
    expect(toPlaceSummary("oops")).toEqual(EMPTY_PLACE_SUMMARY);
  });
});
