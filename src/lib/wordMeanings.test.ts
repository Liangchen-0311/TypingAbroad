import { describe, expect, it } from "vitest";
import { articles } from "./articles";
import { getChineseWordMeaning } from "./wordMeanings";

describe("passage word meanings", () => {
  it("provides the Chinese meaning requested for therefore", () => {
    expect(getChineseWordMeaning("therefore")).toContain("因此");
  });

  it("falls back from possessive forms to their base word", () => {
    expect(getChineseWordMeaning("children's")).toBe(getChineseWordMeaning("children"));
  });

  it("covers every word that can be mistyped in a passage", () => {
    const passageWords = articles.flatMap(
      (article) => article.text.match(/[A-Za-z]+(?:['-][A-Za-z]+)*/g) ?? [],
    );
    expect(passageWords.filter((word) => !getChineseWordMeaning(word))).toEqual([]);
  });
});
