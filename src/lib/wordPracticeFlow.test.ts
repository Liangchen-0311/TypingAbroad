import { describe, expect, it } from "vitest";
import {
  findSentenceContainingWord,
  getWordPracticeCompletionAction,
  maskWordInContext,
  shouldMarkMistakeLearned,
  WORD_CONTEXT_BLANK,
} from "./wordPracticeFlow";

describe("mistake practice flow", () => {
  it("adds a context pass before advancing a mistake word", () => {
    expect(getWordPracticeCompletionAction("mistakes", "word", false)).toBe("show-context");
    expect(getWordPracticeCompletionAction("mistakes", "word", true)).toBe("show-context");
    expect(getWordPracticeCompletionAction("mistakes", "context", false)).toBe("next-word");
    expect(getWordPracticeCompletionAction("mistakes", "context", true)).toBe("finish-session");
  });

  it("keeps common-word practice as a single pass", () => {
    expect(getWordPracticeCompletionAction("common", "word", false)).toBe("next-word");
    expect(getWordPracticeCompletionAction("common", "word", true)).toBe("finish-session");
  });

  it("marks a mistake learned only when both passes were error-free", () => {
    expect(shouldMarkMistakeLearned("mistakes", "context", true, false)).toBe(true);
    expect(shouldMarkMistakeLearned("mistakes", "context", false, false)).toBe(false);
    expect(shouldMarkMistakeLearned("mistakes", "context", true, true)).toBe(false);
    expect(shouldMarkMistakeLearned("common", "word", true, false)).toBe(false);
  });

  it("finds the original sentence that contains the whole word", () => {
    const text = "An article introduces the issue. Art can broaden a student's perspective. A final point follows.";
    expect(findSentenceContainingWord(text, "art")).toBe("Art can broaden a student's perspective.");
  });

  it("masks every whole-word occurrence without exposing the answer", () => {
    const masked = maskWordInContext("Evidence can therefore help; therefore, the claim is stronger.", "therefore");
    expect(masked).toBe(`Evidence can ${WORD_CONTEXT_BLANK} help; ${WORD_CONTEXT_BLANK}, the claim is stronger.`);
    expect(masked.toLowerCase()).not.toContain("therefore");
  });

  it("uses an English definition when an older saved mistake has no sentence", () => {
    const masked = maskWordInContext("", "contribute", "to help cause a result");
    expect(masked).toBe(`${WORD_CONTEXT_BLANK} means to help cause a result.`);
    expect(masked).not.toContain("contribute");
  });

  it("never exposes a Chinese fallback meaning in context recall", () => {
    const masked = maskWordInContext("", "therefore", "因此；所以");
    expect(masked).toBe(`Complete the missing academic word: ${WORD_CONTEXT_BLANK}.`);
    expect(masked).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it("masks the answer if an English fallback definition repeats it", () => {
    const masked = maskWordInContext("", "valid", "a valid and logically acceptable claim");
    expect(masked.toLowerCase()).not.toContain("valid");
    expect(masked).toContain(WORD_CONTEXT_BLANK);
  });
});
