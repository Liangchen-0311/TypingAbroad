import type { Article, ArticleLength, CustomPassage } from "./types";

export const CUSTOM_PASSAGE_MIN_WORDS = 20;
export const CUSTOM_PASSAGE_MAX_WORDS = 3_000;
export const CUSTOM_PASSAGE_MAX_CHARACTERS = 40_000;
export const CUSTOM_PASSAGE_LIMIT = 20;
export const CUSTOM_PASSAGE_ID_PREFIX = "custom-";

export function normalizeCustomPassageText(value: string) {
  return value
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[\t ]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function countCustomPassageWords(value: string) {
  const normalized = normalizeCustomPassageText(value);
  return normalized ? normalized.split(/\s+/).length : 0;
}

export function getCustomPassageValidationError(value: string) {
  const normalized = normalizeCustomPassageText(value);
  const wordCount = countCustomPassageWords(normalized);

  if (!normalized) return "Paste an English passage or import a .txt or .md file.";
  if (wordCount < CUSTOM_PASSAGE_MIN_WORDS) return `Add at least ${CUSTOM_PASSAGE_MIN_WORDS} words so the practice has enough context.`;
  if (wordCount > CUSTOM_PASSAGE_MAX_WORDS) return `Keep the passage under ${CUSTOM_PASSAGE_MAX_WORDS.toLocaleString("en")} words.`;
  if (normalized.length > CUSTOM_PASSAGE_MAX_CHARACTERS) return `Keep the passage under ${CUSTOM_PASSAGE_MAX_CHARACTERS.toLocaleString("en")} characters.`;
  if (!/[A-Za-z]/.test(normalized)) return "The passage needs to contain English text.";
  return null;
}

export function inferCustomPassageTitle(value: string) {
  const normalized = normalizeCustomPassageText(value);
  const firstLine = normalized.split("\n").find(Boolean) ?? "Untitled passage";
  const words = firstLine.split(/\s+/).slice(0, 8).join(" ");
  return firstLine.split(/\s+/).length > 8 ? `${words}…` : words;
}

export function createCustomPassage(input: {
  id?: string;
  title?: string;
  text: string;
  createdAt?: string;
  now?: string;
}): CustomPassage {
  const text = normalizeCustomPassageText(input.text);
  const now = input.now ?? new Date().toISOString();
  const fallbackId = `${CUSTOM_PASSAGE_ID_PREFIX}${Date.now()}`;
  const generatedId = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? `${CUSTOM_PASSAGE_ID_PREFIX}${crypto.randomUUID()}`
    : fallbackId;

  return {
    version: 1,
    id: input.id ?? generatedId,
    title: input.title?.trim().slice(0, 100) || inferCustomPassageTitle(text),
    text,
    wordCount: countCustomPassageWords(text),
    createdAt: input.createdAt ?? now,
    updatedAt: now,
  };
}

function getLength(wordCount: number): ArticleLength {
  if (wordCount <= 100) return "Short";
  if (wordCount <= 250) return "Medium";
  return "Long";
}

export function customPassageToArticle(passage: CustomPassage): Article {
  return {
    id: passage.id,
    title: passage.title,
    exam: "Academic English",
    taskType: "Custom passage",
    topic: "Your text",
    difficulty: "Medium",
    length: getLength(passage.wordCount),
    wordCount: passage.wordCount,
    text: passage.text,
    vocabulary: [],
    collocations: [],
    sentenceStructures: [],
    tags: ["Custom passage", "Your text"],
  };
}

export function isCustomPassageId(value: string) {
  return value.startsWith(CUSTOM_PASSAGE_ID_PREFIX);
}

export function getPracticeHref(articleId: string) {
  const parameter = isCustomPassageId(articleId) ? "custom" : "article";
  return `/practice?${parameter}=${encodeURIComponent(articleId)}`;
}

export function removeCustomPassageFromCollection(passages: CustomPassage[], passageId: string) {
  return passages.filter((passage) => passage.id !== passageId);
}
