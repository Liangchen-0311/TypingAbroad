import { describe, expect, it } from "vitest";
import {
  calculateAccuracy,
  calculateConsistency,
  calculateRawWpm,
  calculateWpm,
  countCorrectCharacters,
  createTypingError,
  formatDuration,
  getWordAtPosition,
} from "./typing";

describe("typing metrics", () => {
  it("uses the standard five-character WPM formula", () => {
    expect(calculateWpm(250, 60_000)).toBe(50);
    expect(calculateRawWpm(300, 60_000)).toBe(60);
  });

  it("keeps very short sessions finite", () => {
    expect(calculateWpm(5, 100)).toBe(60);
    expect(Number.isFinite(calculateWpm(5, 0))).toBe(true);
  });

  it("calculates accuracy from all input attempts", () => {
    expect(calculateAccuracy(97, 100)).toBe(97);
    expect(calculateAccuracy(0, 0)).toBe(100);
  });

  it("counts spaces and punctuation like normal characters", () => {
    expect(countCorrectCharacters("Hi, Sam.", ["H", "i", ",", " ", "S", "x", "m", "."])).toBe(7);
  });

  it("locates the word surrounding a character error", () => {
    expect(getWordAtPosition("protect the environment.", 16).word).toBe("environment");
    const error = createTypingError("the environment matters", 8, "o", 500);
    expect(error.word).toBe("environment");
    expect(error.typedWord).not.toBe(error.word);
  });

  it("formats time and scores consistency", () => {
    expect(formatDuration(84)).toBe("01:24");
    expect(calculateConsistency([{ second: 1, wpm: 50, rawWpm: 50 }, { second: 2, wpm: 50, rawWpm: 50 }])).toBe(100);
  });
});
