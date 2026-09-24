import { describe, expect, it } from "vitest";
import {
  canContinueWithInterests,
  filterInterests,
  toggleInterestSelection,
} from "./trendx";

describe("TrendX interest onboarding", () => {
  it("requires at least three interests before continuing", () => {
    expect(canContinueWithInterests([])).toBe(false);
    expect(canContinueWithInterests(["Sports", "Technology"])).toBe(false);
    expect(canContinueWithInterests(["Sports", "Technology", "Health"])).toBe(true);
  });

  it("adds and removes a selected interest without mutating the input", () => {
    const selected = ["Sports", "Technology"];
    const added = toggleInterestSelection(selected, "Health");
    const removed = toggleInterestSelection(added, "Technology");

    expect(selected).toEqual(["Sports", "Technology"]);
    expect(added).toEqual(["Sports", "Technology", "Health"]);
    expect(removed).toEqual(["Sports", "Health"]);
  });

  it("filters by category and case-insensitive search text", () => {
    const interests = [
      { label: "Artificial Intelligence", category: "Build" },
      { label: "Competitive Exams", category: "Learn" },
      { label: "Sports", category: "Live" },
    ];

    expect(filterInterests(interests, "Build", "intelligence")).toEqual([
      interests[0],
    ]);
    expect(filterInterests(interests, "All", "EXAMS")).toEqual([
      interests[1],
    ]);
    expect(filterInterests(interests, "Trending", "")).toEqual([]);
  });
});
