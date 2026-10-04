import { describe, expect, it } from "vitest";
import {
  countCustomPassageWords,
  createCustomPassage,
  customPassageToArticle,
  getCustomPassageValidationError,
  getPracticeHref,
  inferCustomPassageTitle,
  normalizeCustomPassageText,
  removeCustomPassageFromCollection,
} from "./customPassages";

describe("custom passages", () => {
  it("normalizes whitespace while preserving paragraph breaks", () => {
    expect(normalizeCustomPassageText("  First   line.\r\n\r\n\r\nSecond\tline.  "))
      .toBe("First line.\n\nSecond line.");
  });

  it("counts words and infers a short title", () => {
    const text = "The value of public libraries in modern cities deserves careful attention today.";
    expect(countCustomPassageWords(text)).toBe(12);
    expect(inferCustomPassageTitle(text)).toBe("The value of public libraries in modern cities…");
  });

  it("validates short and non-English passages", () => {
    expect(getCustomPassageValidationError("too short")).toContain("20 words");
    expect(getCustomPassageValidationError("词语 ".repeat(25))).toContain("English text");
  });

  it("converts a stored passage into the shared article shape", () => {
    const passage = createCustomPassage({
      id: "custom-test",
      title: "City design",
      text: "Public spaces shape daily life and influence how residents move, meet, exercise, rest, learn, work, and participate in their communities together.",
      now: "2026-10-04T00:00:00.000Z",
    });
    const article = customPassageToArticle(passage);

    expect(article.id).toBe("custom-test");
    expect(article.taskType).toBe("Custom passage");
    expect(article.text).toBe(passage.text);
    expect(getPracticeHref(article.id)).toBe("/practice?custom=custom-test");
    expect(getPracticeHref("ielts-test")).toBe("/practice?article=ielts-test");
  });

  it("removes only the selected custom passage", () => {
    const first = createCustomPassage({
      id: "custom-first",
      text: "Public spaces shape daily life and influence how residents move, meet, exercise, rest, learn, work, and participate in their communities together.",
      now: "2026-10-04T00:00:00.000Z",
    });
    const second = createCustomPassage({
      id: "custom-second",
      text: "University students often balance lectures, independent study, group projects, part-time work, exercise, friendships, family responsibilities, and adequate sleep each week.",
      now: "2026-10-04T00:00:00.000Z",
    });

    expect(removeCustomPassageFromCollection([first, second], first.id)).toEqual([second]);
  });
});
