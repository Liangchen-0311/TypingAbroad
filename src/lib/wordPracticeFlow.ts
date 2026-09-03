import type { WordPracticeSource, WordPracticeStage } from "./types";

export const WORD_CONTEXT_BLANK = "________";

export type WordPracticeCompletionAction = "show-context" | "next-word" | "finish-session";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function wordPattern(word: string, global = false) {
  const escaped = escapeRegExp(word.trim());
  return new RegExp(`(^|[^A-Za-z'-])(${escaped})(?=$|[^A-Za-z'-])`, global ? "gi" : "i");
}

export function getWordPracticeCompletionAction(
  source: WordPracticeSource,
  stage: WordPracticeStage,
  isLastWord: boolean,
): WordPracticeCompletionAction {
  if (source === "mistakes" && stage === "word") return "show-context";
  return isLastWord ? "finish-session" : "next-word";
}

export function shouldMarkMistakeLearned(
  source: WordPracticeSource,
  stage: WordPracticeStage,
  firstPassCorrect: boolean,
  currentPassHadError: boolean,
) {
  return source === "mistakes"
    && stage === "context"
    && firstPassCorrect
    && !currentPassHadError;
}

export function findSentenceContainingWord(text: string, word: string) {
  const cleanText = text.trim();
  const cleanWord = word.trim();
  if (!cleanText || !cleanWord) return null;

  const match = wordPattern(cleanWord).exec(cleanText);
  if (!match) return null;

  const position = match.index + match[1].length;
  const left = Math.max(
    cleanText.lastIndexOf(".", position - 1),
    cleanText.lastIndexOf("!", position - 1),
    cleanText.lastIndexOf("?", position - 1),
    cleanText.lastIndexOf("\n", position - 1),
  );
  const endings = [
    cleanText.indexOf(".", position),
    cleanText.indexOf("!", position),
    cleanText.indexOf("?", position),
    cleanText.indexOf("\n", position),
  ].filter((value) => value >= 0);
  const right = endings.length ? Math.min(...endings) + 1 : cleanText.length;
  return cleanText.slice(left + 1, right).trim();
}

export function maskWordInContext(context: string, word: string, definition = "") {
  const cleanContext = context.trim();
  const cleanWord = word.trim();
  if (cleanContext && cleanWord) {
    const pattern = wordPattern(cleanWord, true);
    let found = false;
    const masked = cleanContext.replace(pattern, (_match, prefix: string) => {
      found = true;
      return `${prefix}${WORD_CONTEXT_BLANK}`;
    });
    if (found) return masked;
  }

  const cleanDefinition = definition.trim().replace(/[.!?]+$/, "");
  const safeDefinition = /[\u3400-\u9fff]/u.test(cleanDefinition)
    ? ""
    : cleanWord
      ? cleanDefinition.replace(wordPattern(cleanWord, true), (_match, prefix: string) => `${prefix}${WORD_CONTEXT_BLANK}`)
      : cleanDefinition;
  return safeDefinition
    ? `${WORD_CONTEXT_BLANK} means ${safeDefinition}.`
    : `Complete the missing academic word: ${WORD_CONTEXT_BLANK}.`;
}
