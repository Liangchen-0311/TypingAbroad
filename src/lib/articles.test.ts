import { describe, expect, it } from "vitest";
import { articles } from "./articles";

describe("article library", () => {
  it("contains twenty IELTS and twenty TOEFL passages", () => {
    expect(articles.filter((article) => article.exam === "IELTS")).toHaveLength(20);
    expect(articles.filter((article) => article.exam === "TOEFL")).toHaveLength(20);
    expect(articles.filter((article) => article.exam === "Academic English")).toHaveLength(5);
  });

  it("uses a unique id and title for every passage", () => {
    expect(new Set(articles.map((article) => article.id)).size).toBe(articles.length);
    expect(new Set(articles.map((article) => article.title)).size).toBe(articles.length);
  });

  it("keeps generated length metadata in sync with every text", () => {
    for (const article of articles) {
      const wordCount = article.text.trim().split(/\s+/).length;
      const expectedLength = wordCount <= 100 ? "Short" : wordCount <= 250 ? "Medium" : "Long";

      expect(article.wordCount, article.id).toBe(wordCount);
      expect(article.length, article.id).toBe(expectedLength);
    }
  });

  it("provides learning material and searchable tags for every passage", () => {
    for (const article of articles) {
      expect(article.vocabulary.length, article.id).toBeGreaterThan(0);
      expect(article.collocations.length, article.id).toBeGreaterThanOrEqual(3);
      expect(article.sentenceStructures.length, article.id).toBeGreaterThan(0);
      expect(article.tags, article.id).toContain(article.exam);
      expect(article.tags, article.id).toContain(article.taskType);
      expect(article.tags, article.id).toContain(article.topic);
    }
  });
});
