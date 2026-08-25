import { describe, expect, it } from "vitest";
import {
  advanceWritingWordCycle,
  buildWritingWordSession,
  restoreWritingWordSession,
  writingWords,
  WRITING_WORD_CATEGORIES,
} from "./writingWords";

describe("writing word bank", () => {
  it("contains at least one thousand unique words with Chinese meanings", () => {
    expect(writingWords.length).toBeGreaterThanOrEqual(1000);
    expect(new Set(writingWords.map((item) => item.word)).size).toBe(writingWords.length);
    expect(writingWords.every((item) => item.meaningZh.trim().length > 0)).toBe(true);
    expect(writingWords.every((item) => /^[a-z]+$/.test(item.word))).toBe(true);
  });

  it("covers every writing category", () => {
    for (const category of WRITING_WORD_CATEGORIES) {
      expect(writingWords.some((item) => item.category === category)).toBe(true);
    }
  });

  it("provides several full sessions in every focused category", () => {
    for (const category of WRITING_WORD_CATEGORIES.filter((item) => item !== "General academic")) {
      expect(writingWords.filter((item) => item.category === category)).toHaveLength(40);
    }
  });

  it("builds a bounded session without mutating the word bank", () => {
    const source = writingWords.slice(0, 5);
    const before = source.map((item) => item.id);
    const session = buildWritingWordSession(source, 3, () => 0.4);
    expect(session).toHaveLength(3);
    expect(source.map((item) => item.id)).toEqual(before);
  });

  it("restores a saved session in its original order and ignores missing words", () => {
    const source = writingWords.slice(0, 4);
    const restored = restoreWritingWordSession(source, [source[2].id, "missing", source[0].id]);
    expect(restored.map((item) => item.id)).toEqual([source[2].id, source[0].id]);
  });

  it("draws from unpracticed words until the pool is exhausted", () => {
    const source = writingWords.slice(0, 8);
    const firstSessionIds = source.slice(0, 5).map((item) => item.id);
    const session = buildWritingWordSession(source, 5, () => 0.4, firstSessionIds);

    expect(session).toHaveLength(3);
    expect(session.every((item) => !firstSessionIds.includes(item.id))).toBe(true);
  });

  it("starts a fresh cycle after every word has been practiced", () => {
    const source = writingWords.slice(0, 5);
    const session = buildWritingWordSession(source, 3, () => 0.4, source.map((item) => item.id));

    expect(session).toHaveLength(3);
  });

  it("keeps cycle progress until the final unused word is completed", () => {
    const source = writingWords.slice(0, 5);
    const firstSessionIds = source.slice(0, 3).map((item) => item.id);
    const remainingProgress = advanceWritingWordCycle(source, [], firstSessionIds);
    const completedProgress = advanceWritingWordCycle(
      source,
      remainingProgress,
      source.slice(3).map((item) => item.id),
    );

    expect(remainingProgress).toEqual(firstSessionIds);
    expect(completedProgress).toEqual([]);
  });
});
