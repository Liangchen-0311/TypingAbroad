import { describe, expect, it } from "vitest";
import { calculatePracticeStreak, summarizeWordCategories, summarizeWordPractice } from "./progress";
import type { WordPracticeResult } from "./types";

function result(overrides: Partial<WordPracticeResult> = {}): WordPracticeResult {
  return {
    version: 1,
    id: "session-1",
    source: "common",
    category: "Argument",
    requestedLength: 10,
    totalWords: 10,
    completedWords: 9,
    skippedWords: 1,
    errorCount: 2,
    inputCount: 100,
    accuracy: 98,
    duration: 60,
    wordIds: [],
    createdAt: "2026-08-22T08:00:00.000Z",
    ...overrides,
  };
}

describe("progress summaries", () => {
  it("weights word accuracy by actual key attempts", () => {
    const summary = summarizeWordPractice([
      result(),
      result({ id: "session-2", inputCount: 50, errorCount: 5, completedWords: 8, skippedWords: 2 }),
    ]);

    expect(summary.sessions).toBe(2);
    expect(summary.completedWords).toBe(17);
    expect(summary.accuracy).toBeCloseTo(95.33, 2);
    expect(summary.completionRate).toBe(85);
  });

  it("separates category activity and labels mistake review sessions", () => {
    const categories = summarizeWordCategories([
      result(),
      result({ id: "session-2", source: "mistakes", category: "All" }),
    ]);

    expect(categories.map((item) => item.category)).toEqual(["Argument", "Mistake review"]);
  });

  it("calculates a consecutive local-day streak", () => {
    const streak = calculatePracticeStreak(
      ["2026-08-22T08:00:00.000Z", "2026-08-21T08:00:00.000Z", "2026-08-19T08:00:00.000Z"],
      new Date(2026, 7, 22, 18),
    );

    expect(streak).toBe(2);
  });
});
