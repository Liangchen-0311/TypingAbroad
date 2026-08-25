import type { WordPracticeResult } from "./types";

export interface WordPracticeSummary {
  sessions: number;
  completedWords: number;
  skippedWords: number;
  errorCount: number;
  inputCount: number;
  accuracy: number | null;
  completionRate: number | null;
  duration: number;
}

export interface WordCategorySummary extends WordPracticeSummary {
  category: string;
}

export function summarizeWordPractice(results: WordPracticeResult[]): WordPracticeSummary {
  const totals = results.reduce(
    (summary, result) => ({
      completedWords: summary.completedWords + result.completedWords,
      skippedWords: summary.skippedWords + result.skippedWords,
      errorCount: summary.errorCount + result.errorCount,
      inputCount: summary.inputCount + result.inputCount,
      duration: summary.duration + result.duration,
    }),
    { completedWords: 0, skippedWords: 0, errorCount: 0, inputCount: 0, duration: 0 },
  );
  const attemptedWords = totals.completedWords + totals.skippedWords;
  return {
    sessions: results.length,
    ...totals,
    accuracy: totals.inputCount
      ? Math.max(0, ((totals.inputCount - totals.errorCount) / totals.inputCount) * 100)
      : null,
    completionRate: attemptedWords ? (totals.completedWords / attemptedWords) * 100 : null,
  };
}

export function summarizeWordCategories(results: WordPracticeResult[]) {
  const grouped = new Map<string, WordPracticeResult[]>();
  for (const result of results) {
    const label = result.source === "mistakes" ? "Mistake review" : result.category;
    grouped.set(label, [...(grouped.get(label) ?? []), result]);
  }
  return Array.from(grouped, ([category, categoryResults]): WordCategorySummary => ({
    category,
    ...summarizeWordPractice(categoryResults),
  })).sort((a, b) => b.completedWords - a.completedWords || b.sessions - a.sessions);
}

function localDateKey(value: Date) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

export function calculatePracticeStreak(createdDates: string[], now = new Date()) {
  const days = new Set(
    createdDates
      .map((createdAt) => new Date(createdAt))
      .filter((date) => !Number.isNaN(date.getTime()))
      .map(localDateKey),
  );
  let count = 0;
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  while (days.has(localDateKey(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
