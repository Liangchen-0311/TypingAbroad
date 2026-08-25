import { STORAGE_KEYS } from "./constants";
import type {
  SavedVocabulary,
  TypingDraft,
  TypingPreferences,
  TypingResult,
  WordPracticeCycleProgress,
  WordPracticeDraft,
  WordPracticeResult,
} from "./types";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getActivePracticeArticle() {
  return readJson<string | null>(STORAGE_KEYS.activePracticeArticle, null);
}

export function saveActivePracticeArticle(articleId: string) {
  writeJson(STORAGE_KEYS.activePracticeArticle, articleId);
}

export function getSessions() {
  return readJson<TypingResult[]>(STORAGE_KEYS.sessions, []);
}

export function saveSession(result: TypingResult) {
  const sessions = [result, ...getSessions()].slice(0, 200);
  writeJson(STORAGE_KEYS.sessions, sessions);
  return sessions;
}

export function getPreferences(fallback: TypingPreferences) {
  const stored = readJson<Partial<TypingPreferences>>(STORAGE_KEYS.preferences, {});
  if (stored.version !== fallback.version) {
    return { ...fallback, ...stored, version: fallback.version, typingFont: "mono" as const };
  }
  return { ...fallback, ...stored };
}

export function savePreferences(preferences: TypingPreferences) {
  writeJson(STORAGE_KEYS.preferences, preferences);
}

export function getVocabulary() {
  return readJson<SavedVocabulary[]>(STORAGE_KEYS.vocabulary, []);
}

export function saveVocabulary(items: SavedVocabulary[]) {
  writeJson(STORAGE_KEYS.vocabulary, items);
}

export function saveVocabularyItem(item: SavedVocabulary) {
  const current = getVocabulary();
  const existingIndex = current.findIndex((entry) => entry.id === item.id);
  if (existingIndex === -1) {
    const next = [item, ...current];
    saveVocabulary(next);
    return next;
  }

  const existing = current[existingIndex];
  const merged: SavedVocabulary = {
    ...existing,
    ...item,
    learned: existing.learned,
    savedAt: existing.savedAt,
    savedFromMistake: existing.savedFromMistake || item.savedFromMistake,
    mistakeCount: (existing.mistakeCount ?? 0) + (item.savedFromMistake ? (item.mistakeCount ?? 1) : 0),
  };
  const next = current.map((entry, index) => index === existingIndex ? merged : entry);
  saveVocabulary(next);
  return next;
}

export function getTypingDrafts() {
  return readJson<Record<string, TypingDraft>>(STORAGE_KEYS.typingDrafts, {});
}

export function getTypingDraft(articleId: string) {
  const draft = getTypingDrafts()[articleId];
  return draft?.version === 1 ? draft : null;
}

export function saveTypingDraft(draft: TypingDraft) {
  writeJson(STORAGE_KEYS.typingDrafts, { ...getTypingDrafts(), [draft.articleId]: draft });
}

export function removeTypingDraft(articleId: string) {
  const drafts = getTypingDrafts();
  if (!(articleId in drafts)) return;
  delete drafts[articleId];
  writeJson(STORAGE_KEYS.typingDrafts, drafts);
}

export function getWordPracticeDraft() {
  const draft = readJson<WordPracticeDraft | null>(STORAGE_KEYS.wordPracticeDraft, null);
  return draft?.version === 1 ? draft : null;
}

export function saveWordPracticeDraft(draft: WordPracticeDraft) {
  writeJson(STORAGE_KEYS.wordPracticeDraft, draft);
}

export function removeWordPracticeDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEYS.wordPracticeDraft);
}

export function getWordPracticeCycleProgress() {
  return readJson<WordPracticeCycleProgress>(STORAGE_KEYS.wordPracticeCycles, {});
}

export function saveWordPracticeCycleProgress(progress: WordPracticeCycleProgress) {
  writeJson(STORAGE_KEYS.wordPracticeCycles, progress);
}

export function getWordPracticeResults() {
  return readJson<WordPracticeResult[]>(STORAGE_KEYS.wordPracticeResults, [])
    .filter((result) => result.version === 1);
}

export function saveWordPracticeResult(result: WordPracticeResult) {
  const results = [result, ...getWordPracticeResults()].slice(0, 500);
  writeJson(STORAGE_KEYS.wordPracticeResults, results);
  return results;
}

export function getGoal() {
  return readJson<number>(STORAGE_KEYS.goal, 60);
}

export function saveGoal(wpm: number) {
  writeJson(STORAGE_KEYS.goal, wpm);
}
