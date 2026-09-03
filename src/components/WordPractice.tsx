"use client";

import Link from "next/link";
import { ArrowRight, BookMarked, RefreshCw, Shuffle, SkipForward } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TypingText } from "./TypingText";
import { usePreferences } from "./ThemeProvider";
import {
  getVocabulary,
  getWordPracticeCycleProgress,
  getWordPracticeDraft,
  removeWordPracticeDraft,
  saveWordPracticeCycleProgress,
  saveWordPracticeResult,
  saveVocabulary,
  saveVocabularyItem,
  saveWordPracticeDraft,
} from "@/lib/storage";
import {
  advanceWritingWordCycle,
  buildWritingWordSession,
  restoreWritingWordSession,
  writingWords,
  WRITING_WORD_CATEGORIES,
  type WritingWordCategory,
} from "@/lib/writingWords";
import { calculateAccuracy } from "@/lib/typing";
import { getChineseWordMeaning } from "@/lib/wordMeanings";
import { articles } from "@/lib/articles";
import {
  findSentenceContainingWord,
  getWordPracticeCompletionAction,
  maskWordInContext,
  shouldMarkMistakeLearned,
  WORD_CONTEXT_BLANK,
} from "@/lib/wordPracticeFlow";
import type {
  SavedVocabulary,
  WordPracticeCycleProgress,
  WordPracticeDraft,
  WordPracticeResult,
  WordPracticeSource,
  WordPracticeStage,
} from "@/lib/types";

type CategoryFilter = "All" | WritingWordCategory;
type WordTransition = "idle" | "leaving" | "entering";
const WORD_EXIT_MS = 120;
const WORD_ENTER_MS = 220;
const EMPTY_WORD_IDS: string[] = [];

interface PracticeWord {
  id: string;
  word: string;
  meaningZh: string;
  definition: string;
  example: string;
  context: string;
  category: string;
  savedItem?: SavedVocabulary;
}

interface WordPracticeProps {
  source?: WordPracticeSource;
  vocabularyItems?: SavedVocabulary[];
  onVocabularyChange?: (items: SavedVocabulary[]) => void;
}

const COMMON_PRACTICE_WORDS: PracticeWord[] = writingWords.map((item) => ({
  id: item.id,
  word: item.word,
  meaningZh: item.meaningZh,
  definition: item.definition,
  example: item.example,
  context: item.example,
  category: item.category,
}));

function normaliseWord(word: string) {
  return word.trim().toLowerCase();
}

function createSeededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1_664_525 + 1_013_904_223) >>> 0;
    return value / 4_294_967_296;
  };
}

export function WordPractice({
  source = "common",
  vocabularyItems,
  onVocabularyChange,
}: WordPracticeProps = {}) {
  const [savedItems, setSavedItems] = useState<SavedVocabulary[]>([]);
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [sessionLength, setSessionLength] = useState(10);
  const [shuffleVersion, setShuffleVersion] = useState(0);
  const [index, setIndex] = useState(0);
  const [practiceStage, setPracticeStage] = useState<WordPracticeStage>("word");
  const [firstPassCorrect, setFirstPassCorrect] = useState(false);
  const [currentPassHadError, setCurrentPassHadError] = useState(false);
  const [typed, setTyped] = useState<string[]>([]);
  const [errorCount, setErrorCount] = useState(0);
  const [masteredCount, setMasteredCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [inputCount, setInputCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [wordTransition, setWordTransition] = useState<WordTransition>("idle");
  const [draftReady, setDraftReady] = useState(false);
  const [restoredSessionIds, setRestoredSessionIds] = useState<string[] | null>(null);
  const [cycleProgress, setCycleProgress] = useState<WordPracticeCycleProgress>({});
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typedRef = useRef<string[]>([]);
  const savedMistakesRef = useRef(new Set<string>());
  const latestDraftRef = useRef<WordPracticeDraft | null>(null);
  const inputCountRef = useRef(0);
  const elapsedBeforeRunRef = useRef(0);
  const sessionStartedAtRef = useRef<number | null>(null);
  const { preferences } = usePreferences();

  useEffect(() => {
    setSavedItems(getVocabulary());
    setCycleProgress(getWordPracticeCycleProgress());
    const draft = getWordPracticeDraft(source);
    if (!draft) {
      setDraftReady(true);
      return;
    }

    const restoredCategory = draft.category === "All" || WRITING_WORD_CATEGORIES.includes(draft.category as WritingWordCategory)
      ? draft.category as CategoryFilter
      : "All";
    setCategory(source === "mistakes" ? "All" : restoredCategory);
    setSessionLength([10, 20, 40].includes(draft.sessionLength) ? draft.sessionLength : 10);
    setShuffleVersion(Math.max(0, draft.shuffleVersion));
    setRestoredSessionIds(draft.sessionWordIds);
    setIndex(Math.max(0, draft.index));
    setPracticeStage(source === "mistakes" && draft.stage === "context" ? "context" : "word");
    setFirstPassCorrect(Boolean(draft.firstPassCorrect));
    setCurrentPassHadError(Boolean(draft.currentPassHadError));
    setTyped(draft.typed);
    typedRef.current = draft.typed;
    setErrorCount(Math.max(0, draft.errorCount));
    setMasteredCount(Math.max(0, draft.masteredCount));
    setSkippedCount(Math.max(0, draft.skippedCount));
    const restoredInputCount = Math.max(0, draft.inputCount ?? 0);
    setInputCount(restoredInputCount);
    inputCountRef.current = restoredInputCount;
    elapsedBeforeRunRef.current = Math.max(0, draft.elapsedMs ?? 0);
    sessionStartedAtRef.current = null;
    savedMistakesRef.current = new Set(draft.savedMistakeKeys);
    setDraftReady(true);
  }, [source]);

  useEffect(() => {
    if (vocabularyItems) setSavedItems(vocabularyItems);
  }, [vocabularyItems]);

  const mistakeWords = useMemo<PracticeWord[]>(() => {
    const unique = new Map<string, SavedVocabulary>();
    for (const item of savedItems.filter((entry) => entry.savedFromMistake)) {
      const key = normaliseWord(item.word);
      const current = unique.get(key);
      if (!current || (item.mistakeCount ?? 1) > (current.mistakeCount ?? 1)) unique.set(key, item);
    }
    return Array.from(unique.values()).map((item) => {
      const common = writingWords.find((entry) => entry.word === normaliseWord(item.word));
      const sourceArticle = articles.find((article) => article.id === item.sourceArticleId);
      const articleContext = sourceArticle ? findSentenceContainingWord(sourceArticle.text, item.word) : null;
      return {
        id: `saved:${item.id}`,
        word: normaliseWord(item.word),
        meaningZh: item.meaningZh ?? common?.meaningZh ?? getChineseWordMeaning(item.word) ?? "尚未添加中文释义",
        definition: item.meaning,
        example: item.example,
        context: item.mistakeContext || articleContext || item.example,
        category: common?.category ?? "My mistakes",
        savedItem: item,
      };
    });
  }, [savedItems]);

  const availableWords = source === "mistakes" ? mistakeWords : COMMON_PRACTICE_WORDS;

  const filteredWords = useMemo(
    () => category === "All" || source === "mistakes" ? availableWords : availableWords.filter((item) => item.category === category),
    [availableWords, category, source],
  );

  const poolKey = `${source}:${source === "mistakes" ? "All" : category}`;
  const practicedWordIds = cycleProgress[poolKey] ?? EMPTY_WORD_IDS;

  const session = useMemo(
    () => {
      if (restoredSessionIds?.length) {
        const restored = restoreWritingWordSession(filteredWords, restoredSessionIds);
        if (restored.length) return restored;
      }
      const labelSeed = `${source}:${category}`.split("").reduce((total, character) => total + character.charCodeAt(0), 0);
      return buildWritingWordSession(
        filteredWords,
        sessionLength,
        createSeededRandom(labelSeed + shuffleVersion * 997 + 1),
        practicedWordIds,
      );
    },
    [category, filteredWords, practicedWordIds, restoredSessionIds, sessionLength, shuffleVersion, source],
  );
  const currentWord = session[index];
  const typedWord = typed.join("");
  const wordComplete = Boolean(currentWord && typedWord === currentWord.word);
  const isContextRecall = source === "mistakes" && practiceStage === "context";
  const targetLength = currentWord ? Array.from(currentWord.word).length : 0;
  const hasTypedMismatch = Boolean(currentWord && typed.some((character, characterIndex) => character !== Array.from(currentWord.word)[characterIndex]));
  const hasCurrentError = isContextRecall
    ? typed.length === targetLength && hasTypedMismatch
    : hasTypedMismatch;
  const maskedContext = currentWord
    ? maskWordInContext(currentWord.context, currentWord.word, currentWord.definition)
    : "";

  const focusInput = useCallback(() => inputRef.current?.focus({ preventScroll: true }), []);

  const getSessionElapsedMs = useCallback(() => (
    elapsedBeforeRunRef.current
      + (sessionStartedAtRef.current === null ? 0 : Date.now() - sessionStartedAtRef.current)
  ), []);

  const resetAttempt = useCallback((sessionIds: string[] | null) => {
    setRestoredSessionIds(sessionIds);
    setIndex(0);
    setPracticeStage("word");
    setFirstPassCorrect(false);
    setCurrentPassHadError(false);
    setTyped([]);
    typedRef.current = [];
    setErrorCount(0);
    setMasteredCount(0);
    setSkippedCount(0);
    setInputCount(0);
    inputCountRef.current = 0;
    elapsedBeforeRunRef.current = 0;
    sessionStartedAtRef.current = null;
    setFinished(false);
    setWordTransition("idle");
    savedMistakesRef.current = new Set();
    latestDraftRef.current = null;
    removeWordPracticeDraft(source);
    window.requestAnimationFrame(focusInput);
  }, [focusInput, source]);

  const resetSession = useCallback(() => resetAttempt(null), [resetAttempt]);

  const saveCurrentMistake = useCallback(() => {
    if (!currentWord) return;
    const attemptKey = `${index}:${currentWord.id}:${practiceStage}`;
    if (savedMistakesRef.current.has(attemptKey)) return;
    savedMistakesRef.current.add(attemptKey);

    const existing = currentWord.savedItem
      ?? getVocabulary().find((item) => normaliseWord(item.word) === currentWord.word);
    const item: SavedVocabulary = existing ? {
      ...existing,
      meaningZh: existing.meaningZh ?? currentWord.meaningZh,
      mistakeContext: existing.mistakeContext || currentWord.context,
      savedFromMistake: true,
      mistakeCount: 1,
    } : {
      id: `word-practice:${currentWord.word}`,
      word: currentWord.word,
      meaning: currentWord.definition,
      meaningZh: currentWord.meaningZh,
      example: currentWord.example,
      mistakeContext: currentWord.context || `${currentWord.word} means ${currentWord.definition}.`,
      sourceArticleId: "word-practice",
      sourceTitle: "Word Practice",
      sourceHref: "/vocabulary#practice-mistakes",
      savedFromMistake: true,
      mistakeCount: 1,
      learned: false,
      savedAt: new Date().toISOString(),
    };
    const next = saveVocabularyItem(item);
    setSavedItems(next);
    onVocabularyChange?.(next);
  }, [currentWord, index, onVocabularyChange, practiceStage]);

  const typeCharacters = useCallback((characters: string[]) => {
    if (!currentWord || finished || wordTransition === "leaving") return;
    let next = typedRef.current;
    let newErrors = 0;
    let attemptedCharacters = 0;
    for (const character of characters) {
      if (next.length >= currentWord.word.length) break;
      attemptedCharacters += 1;
      if (character !== currentWord.word[next.length]) newErrors += 1;
      next = [...next, character];
    }
    if (attemptedCharacters > 0) {
      if (sessionStartedAtRef.current === null) sessionStartedAtRef.current = Date.now();
      inputCountRef.current += attemptedCharacters;
      setInputCount(inputCountRef.current);
    }
    typedRef.current = next;
    setTyped(next);
    if (newErrors > 0) {
      setErrorCount((count) => count + newErrors);
      setCurrentPassHadError(true);
      saveCurrentMistake();
    }
  }, [currentWord, finished, saveCurrentMistake, wordTransition]);

  const moveNext = useCallback((mastered: boolean) => {
    if (!currentWord) return;
    setPracticeStage("word");
    setFirstPassCorrect(false);
    setCurrentPassHadError(false);
    if (mastered) setMasteredCount((count) => count + 1);
    else setSkippedCount((count) => count + 1);

    if (index >= session.length - 1) {
      const sessionIds = session.map((item) => item.id);
      const completedWords = masteredCount + (mastered ? 1 : 0);
      const skippedWords = skippedCount + (mastered ? 0 : 1);
      const elapsedMs = getSessionElapsedMs();
      elapsedBeforeRunRef.current = elapsedMs;
      sessionStartedAtRef.current = null;
      const result: WordPracticeResult = {
        version: 1,
        id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
        source,
        category: source === "mistakes" ? "All" : category,
        requestedLength: sessionLength,
        totalWords: session.length,
        completedWords,
        skippedWords,
        errorCount,
        inputCount: inputCountRef.current,
        accuracy: calculateAccuracy(inputCountRef.current - errorCount, inputCountRef.current),
        duration: elapsedMs / 1_000,
        wordIds: sessionIds,
        createdAt: new Date().toISOString(),
      };
      saveWordPracticeResult(result);
      setRestoredSessionIds(sessionIds);
      setCycleProgress((current) => {
        const nextIds = advanceWritingWordCycle(filteredWords, current[poolKey] ?? [], sessionIds);
        const next = { ...current, [poolKey]: nextIds };
        saveWordPracticeCycleProgress(next);
        return next;
      });
      setFinished(true);
      latestDraftRef.current = null;
      removeWordPracticeDraft(source);
      return;
    }
    setWordTransition("entering");
    setIndex((value) => value + 1);
    setTyped([]);
    typedRef.current = [];
    window.requestAnimationFrame(focusInput);
  }, [
    category,
    currentWord,
    errorCount,
    filteredWords,
    focusInput,
    getSessionElapsedMs,
    index,
    masteredCount,
    poolKey,
    session,
    sessionLength,
    skippedCount,
    source,
  ]);

  const showContextRecall = useCallback((completedWithoutErrors: boolean) => {
    setPracticeStage("context");
    setFirstPassCorrect(completedWithoutErrors);
    setCurrentPassHadError(false);
    setTyped([]);
    typedRef.current = [];
    setWordTransition("entering");
    window.requestAnimationFrame(focusInput);
  }, [focusInput]);

  const markCurrentWordLearned = useCallback(() => {
    if (!currentWord) return;
    const next = getVocabulary().map((item) => (
      normaliseWord(item.word) === currentWord.word ? { ...item, learned: true } : item
    ));
    saveVocabulary(next);
    setSavedItems(next);
    onVocabularyChange?.(next);
  }, [currentWord, onVocabularyChange]);

  useEffect(() => {
    if (!wordComplete || finished) return;
    const completionAction = getWordPracticeCompletionAction(
      source,
      practiceStage,
      index >= session.length - 1,
    );
    setWordTransition("leaving");
    const timeoutId = window.setTimeout(() => {
      if (completionAction === "show-context") {
        showContextRecall(!currentPassHadError);
        return;
      }
      if (shouldMarkMistakeLearned(source, practiceStage, firstPassCorrect, currentPassHadError)) {
        markCurrentWordLearned();
      }
      moveNext(true);
    }, preferences.smoothCaret ? WORD_EXIT_MS : 0);
    return () => window.clearTimeout(timeoutId);
  }, [
    finished,
    firstPassCorrect,
    index,
    currentPassHadError,
    markCurrentWordLearned,
    moveNext,
    practiceStage,
    preferences.smoothCaret,
    session.length,
    showContextRecall,
    source,
    wordComplete,
  ]);

  useEffect(() => {
    if (wordTransition !== "entering") return;
    const timeoutId = window.setTimeout(
      () => setWordTransition("idle"),
      preferences.smoothCaret ? WORD_ENTER_MS : 0,
    );
    return () => window.clearTimeout(timeoutId);
  }, [preferences.smoothCaret, wordTransition]);

  useEffect(() => {
    if (!draftReady || finished || !session.length || index >= session.length) return;
    const draft: WordPracticeDraft = {
      version: 1,
      source,
      category,
      sessionLength,
      shuffleVersion,
      sessionWordIds: session.map((item) => item.id),
      index,
      stage: practiceStage,
      firstPassCorrect,
      currentPassHadError,
      typed,
      errorCount,
      masteredCount,
      skippedCount,
      inputCount,
      elapsedMs: getSessionElapsedMs(),
      savedMistakeKeys: Array.from(savedMistakesRef.current),
      savedAt: new Date().toISOString(),
    };
    latestDraftRef.current = draft;
    const timeoutId = window.setTimeout(() => saveWordPracticeDraft(draft), 180);
    return () => window.clearTimeout(timeoutId);
  }, [
    category,
    draftReady,
    errorCount,
    firstPassCorrect,
    finished,
    index,
    inputCount,
    currentPassHadError,
    masteredCount,
    practiceStage,
    session,
    sessionLength,
    shuffleVersion,
    skippedCount,
    source,
    typed,
    getSessionElapsedMs,
  ]);

  useEffect(() => () => {
    if (latestDraftRef.current) {
      saveWordPracticeDraft({ ...latestDraftRef.current, elapsedMs: getSessionElapsedMs() });
    }
  }, [getSessionElapsedMs]);

  useEffect(() => {
    const pauseTimer = () => {
      if (sessionStartedAtRef.current === null) return;
      elapsedBeforeRunRef.current = getSessionElapsedMs();
      sessionStartedAtRef.current = null;
    };
    window.addEventListener("blur", pauseTimer);
    return () => window.removeEventListener("blur", pauseTimer);
  }, [getSessionElapsedMs]);

  useEffect(() => {
    if (!draftReady || !session.length || index < session.length) return;
    resetSession();
  }, [draftReady, index, resetSession, session.length]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (wordTransition === "leaving") {
      event.preventDefault();
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      return;
    }
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = typedRef.current.slice(0, -1);
      typedRef.current = next;
      setTyped(next);
      return;
    }
    if (event.metaKey || event.ctrlKey || event.altKey || event.key.length !== 1) return;
    event.preventDefault();
    typeCharacters([event.key]);
  };

  const startNextSession = () => {
    setShuffleVersion((value) => value + 1);
    resetSession();
  };

  const repeatCurrentSession = () => {
    resetAttempt(session.map((item) => item.id));
  };

  const controls = (
    <section className={`word-practice__controls${source === "mistakes" ? " is-mistakes" : ""}`} aria-label="Word practice controls">
      {source === "common" && (
        <label className="word-practice__control">
          <span>Category</span>
          <select
            value={category}
            onChange={(event) => { setCategory(event.target.value as CategoryFilter); resetSession(); }}
          >
            <option value="All">All</option>
            {WRITING_WORD_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      )}
      <label className="word-practice__control">
        <span>Session</span>
        <select value={sessionLength} onChange={(event) => { setSessionLength(Number(event.target.value)); resetSession(); }}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={40}>40</option>
        </select>
      </label>
      <button className="quiet-action word-practice__shuffle" type="button" onClick={() => { setShuffleVersion((value) => value + 1); resetSession(); }}>
        <Shuffle aria-hidden="true" /> Shuffle
      </button>
    </section>
  );

  if (!session.length) {
    return (
      <div className="word-practice">
        {controls}
        <section className="word-practice__empty">
          <BookMarked aria-hidden="true" />
          <h2>No mistake words yet.</h2>
          <p>Type an article or a common word. The first word you mistype will appear here automatically.</p>
          <Link className="primary-button" href="/practice">Start article practice <ArrowRight aria-hidden="true" /></Link>
        </section>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="word-practice">
        {controls}
        <section className="word-practice__complete" aria-live="polite">
          <span>Session complete</span>
          <h2>{masteredCount} words completed.</h2>
          <dl>
            <div><dt>Completed</dt><dd>{masteredCount}</dd></div>
            <div><dt>Key errors</dt><dd>{errorCount}</dd></div>
            <div><dt>Skipped</dt><dd>{skippedCount}</dd></div>
          </dl>
          <div className="word-practice__complete-actions">
            <button className="primary-button" type="button" onClick={startNextSession}>Next session <ArrowRight aria-hidden="true" /></button>
            <button className="secondary-button" type="button" onClick={repeatCurrentSession}><RefreshCw aria-hidden="true" /> Repeat session</button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="word-practice">
      {controls}
      <section
        className={`word-drill typing-stage--${preferences.fontSize} typing-stage--${preferences.typingFont}`}
        onClick={focusInput}
        aria-label={isContextRecall ? "Complete the sentence by typing the missing word" : `Type the word ${currentWord.word}`}
      >
        <textarea
          ref={inputRef}
          className="typing-input"
          aria-label={isContextRecall ? "Type the missing word" : `Type ${currentWord.word}`}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          onKeyDown={handleKeyDown}
          onChange={(event) => {
            const characters = Array.from(event.currentTarget.value);
            typeCharacters(characters.filter((character) => character !== " " && character !== "\n"));
            event.currentTarget.value = "";
          }}
        />
        <div className="word-drill__topline">
          <span>{String(index + 1).padStart(2, "0")} / {String(session.length).padStart(2, "0")}</span>
          <div>
            {source === "mistakes" && <span className="word-drill__pass">Pass {isContextRecall ? "2" : "1"} / 2</span>}
            <span>{currentWord.category}</span>
            <span>{errorCount} key errors</span>
          </div>
        </div>

        <div
          key={`${index}:${currentWord.id}:${practiceStage}`}
          className={`word-drill__content is-${wordTransition}${preferences.smoothCaret ? "" : " is-instant"}`}
        >
          {isContextRecall ? (
            <div className="word-drill__context-recall">
              <div className="word-drill__context-heading">
                <span>Context recall</span>
                {masteredCount < 3 && <h2>Type the missing word</h2>}
              </div>
              <blockquote>
                {maskedContext.split(WORD_CONTEXT_BLANK).map((part, partIndex, parts) => (
                  <span key={`${partIndex}-${part}`}>
                    {part}
                    {partIndex < parts.length - 1 && (
                      <span className="word-drill__context-blank" aria-label={`${targetLength}-letter missing word`}>{"_".repeat(targetLength)}</span>
                    )}
                  </span>
                ))}
              </blockquote>
              <div className="word-drill__context-answer">
                <span>Your answer <small>{typed.length} / {targetLength} letters</small></span>
                <TypingText
                  targetText={currentWord.word}
                  typedCharacters={typed}
                  smoothCaret={preferences.smoothCaret}
                  revealTarget={false}
                  deferValidation
                  ariaLabel="Your answer to the sentence gap"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="word-drill__target">
                <span>English word</span>
                <TypingText
                  key={`${index}:${currentWord.id}`}
                  targetText={currentWord.word}
                  typedCharacters={typed}
                  smoothCaret={preferences.smoothCaret}
                />
              </div>

              <div className="word-drill__prompt">
                <span>Chinese meaning</span>
                <h2 lang="zh-CN">{currentWord.meaningZh}</h2>
              </div>

              {currentWord.example && <blockquote>{currentWord.example}</blockquote>}
            </>
          )}
        </div>
        <div className="word-drill__footer">
          <p className={wordComplete ? "is-success" : hasCurrentError ? "is-error" : ""} aria-live="polite">
            {wordComplete
              ? isContextRecall
                ? firstPassCorrect && !currentPassHadError
                  ? "Both passes correct. Marked learned and loading the next word…"
                  : "Second pass complete. Loading the next word…"
                : source === "mistakes"
                  ? "First pass complete. Loading context recall…"
                  : "Complete. Loading the next word…"
              : hasCurrentError
                ? isContextRecall
                  ? "That answer does not match. Use Backspace and try again."
                  : "Mistake saved. Use Backspace to correct the word."
                : isContextRecall
                  ? typed.length < targetLength
                    ? "Your answer is checked when every letter slot is filled."
                    : "Checking your answer…"
                  : "Finish the word to continue automatically."}
          </p>
          <div>
            <button className="quiet-action" type="button" disabled={wordTransition === "leaving"} onClick={(event) => { event.stopPropagation(); moveNext(false); }}><SkipForward aria-hidden="true" /> Skip</button>
          </div>
        </div>
      </section>
    </div>
  );
}
