import type { TypingPreferences } from "./types";

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "TypeAbroad";
export const SITE_TAGLINE = "Type better. Write better. Study abroad.";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://typeabroad.com").replace(/\/$/, "");

export const DEFAULT_PREFERENCES: TypingPreferences = {
  version: 2,
  theme: "dark",
  fontSize: "medium",
  typingFont: "mono",
  showLiveWpm: true,
  showAccuracy: true,
  smoothCaret: true,
  sound: false,
  defaultDifficulty: "Medium",
};

export const STORAGE_KEYS = {
  sessions: "typeabroad:sessions",
  preferences: "typeabroad:preferences",
  vocabulary: "typeabroad:vocabulary",
  typingDrafts: "typeabroad:typing-drafts",
  wordPracticeDraft: "typeabroad:word-practice-draft",
  wordPracticeCycles: "typeabroad:word-practice-cycles",
  wordPracticeResults: "typeabroad:word-practice-results",
  activePracticeArticle: "typeabroad:active-practice-article",
  goal: "typeabroad:goal",
} as const;
