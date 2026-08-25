import type { TypingError, WpmSample } from "./types";

const MIN_DURATION_MS = 1_000;

export function calculateWpm(correctCharacters: number, elapsedMs: number) {
  if (correctCharacters <= 0 || elapsedMs <= 0) return 0;
  const minutes = Math.max(elapsedMs, MIN_DURATION_MS) / 60_000;
  return Math.round(correctCharacters / 5 / minutes);
}

export function calculateRawWpm(inputCount: number, elapsedMs: number) {
  if (inputCount <= 0 || elapsedMs <= 0) return 0;
  const minutes = Math.max(elapsedMs, MIN_DURATION_MS) / 60_000;
  return Math.round(inputCount / 5 / minutes);
}

export function calculateAccuracy(correctInputs: number, inputCount: number) {
  if (inputCount <= 0) return 100;
  return Math.max(0, Math.min(100, (correctInputs / inputCount) * 100));
}

export function calculateConsistency(samples: WpmSample[]) {
  const values = samples.map((sample) => sample.wpm).filter((value) => value > 0);
  if (values.length < 2) return 100;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  const coefficient = Math.sqrt(variance) / mean;
  return Math.round(Math.max(0, Math.min(100, 100 - coefficient * 100)));
}

export function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function getWordAtPosition(text: string, position: number) {
  const safePosition = Math.max(0, Math.min(position, text.length - 1));
  let start = safePosition;
  let end = safePosition;
  while (start > 0 && /[A-Za-z0-9'-]/.test(text[start - 1])) start -= 1;
  while (end < text.length && /[A-Za-z0-9'-]/.test(text[end])) end += 1;
  return {
    word: text.slice(start, end),
    start,
    end,
  };
}

export function createTypingError(
  text: string,
  position: number,
  typedCharacter: string,
  timestamp: number,
): TypingError {
  const range = getWordAtPosition(text, position);
  const relativePosition = Math.max(0, position - range.start);
  const typedWord = range.word
    ? `${range.word.slice(0, relativePosition)}${typedCharacter}${range.word.slice(relativePosition + 1)}`
    : typedCharacter;

  return {
    expectedCharacter: text[position] ?? "",
    typedCharacter,
    position,
    word: range.word || text[position] || "space",
    typedWord,
    timestamp,
  };
}

export function countCorrectCharacters(target: string, typed: string[]) {
  return typed.reduce((count, character, index) => count + (character === target[index] ? 1 : 0), 0);
}

export function percentileBest(results: { wpm: number }[]) {
  return results.reduce((best, result) => Math.max(best, result.wpm), 0);
}
