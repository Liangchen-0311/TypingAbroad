"use client";

import { BookMarked, Pause, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { usePreferences } from "./ThemeProvider";
import { TypingStats } from "./TypingStats";
import { TypingText } from "./TypingText";
import {
  calculateAccuracy,
  calculateConsistency,
  calculateRawWpm,
  calculateWpm,
  countCorrectCharacters,
} from "@/lib/typing";
import { getTypingDraft, removeTypingDraft, saveTypingDraft, saveVocabularyItem } from "@/lib/storage";
import { getEngineElapsedMs, initialEngineState, typingEngineReducer, type EngineState } from "@/lib/typingEngineState";
import { writingWords } from "@/lib/writingWords";
import { getChineseWordMeaning } from "@/lib/wordMeanings";
import type { Article, SavedVocabulary, TypingDraft, TypingResult, WpmSample } from "@/lib/types";

function normaliseWord(word: string) {
  return word.replace(/^[^A-Za-z]+|[^A-Za-z'-]+$/g, "").toLowerCase();
}

function getSentenceContext(text: string, position: number) {
  const left = Math.max(text.lastIndexOf(".", position - 1), text.lastIndexOf("!", position - 1), text.lastIndexOf("?", position - 1), text.lastIndexOf("\n", position - 1));
  const endings = [text.indexOf(".", position), text.indexOf("!", position), text.indexOf("?", position), text.indexOf("\n", position)].filter((value) => value >= 0);
  const right = endings.length ? Math.min(...endings) + 1 : text.length;
  return text.slice(left + 1, right).trim();
}

function createMistakeVocabulary(article: Article, word: string, position: number): SavedVocabulary {
  const normalised = normaliseWord(word);
  const learningItem = article.vocabulary.find((item) => normaliseWord(item.word) === normalised);
  const commonWord = writingWords.find((item) => item.word === normalised);
  const meaningZh = getChineseWordMeaning(normalised);
  return {
    id: `${article.id}:${normalised}`,
    word: word.replace(/^[^A-Za-z]+|[^A-Za-z'-]+$/g, ""),
    meaning: learningItem?.meaning ?? commonWord?.definition ?? meaningZh ?? "文章练习中输入错误的单词",
    meaningZh,
    example: learningItem?.example ?? commonWord?.example ?? getSentenceContext(article.text, position),
    sourceArticleId: article.id,
    sourceTitle: article.title,
    sourceHref: `/practice?article=${article.id}`,
    savedFromMistake: true,
    mistakeCount: 1,
    learned: false,
    savedAt: new Date().toISOString(),
  };
}

function playTone(correct: boolean) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = correct ? 420 : 180;
  gain.gain.setValueAtTime(0.018, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.035);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.04);
  oscillator.addEventListener("ended", () => void context.close());
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

interface TypingEngineProps {
  article: Article;
  onComplete: (result: TypingResult) => void;
  onNext?: () => void;
  compact?: boolean;
}

export function TypingEngine({ article, onComplete, onNext, compact = false }: TypingEngineProps) {
  const [state, dispatch] = useReducer(typingEngineReducer, initialEngineState);
  const [now, setNow] = useState(0);
  const [samples, setSamples] = useState<WpmSample[]>([]);
  const [draftReady, setDraftReady] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [autoSavedCount, setAutoSavedCount] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const tabArmedRef = useRef(false);
  const completedRef = useRef(false);
  const savedMistakeWordsRef = useRef(new Set<string>());
  const latestDraftRef = useRef<TypingDraft | null>(null);
  const { preferences } = usePreferences();

  const elapsedMs = getEngineElapsedMs(state, now);
  const correctCharacters = useMemo(() => countCorrectCharacters(article.text, state.typed), [article.text, state.typed]);
  const wpm = calculateWpm(correctCharacters, elapsedMs);
  const rawWpm = calculateRawWpm(state.inputCount, elapsedMs);
  const accuracy = calculateAccuracy(state.correctInputCount, state.inputCount);
  const progress = (state.typed.length / article.text.length) * 100;

  const focusInput = useCallback(() => {
    inputRef.current?.focus({ preventScroll: true });
    if (state.pausedAt !== null) dispatch({ type: "RESUME", timestamp: performance.now() });
  }, [state.pausedAt]);

  const resetState = useCallback(() => {
    dispatch({ type: "RESTART" });
    setSamples([]);
    setNow(0);
    setDraftRestored(false);
    setAutoSavedCount(0);
    savedMistakeWordsRef.current = new Set();
    latestDraftRef.current = null;
    removeTypingDraft(article.id);
    completedRef.current = false;
  }, [article.id]);

  const restart = useCallback(() => {
    resetState();
    window.requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
  }, [resetState]);

  useEffect(() => {
    completedRef.current = false;
    latestDraftRef.current = null;
    const draft = getTypingDraft(article.id);
    const canRestore = draft
      && draft.targetLength === article.text.length
      && draft.typed.length > 0
      && draft.typed.length < article.text.length;

    if (canRestore) {
      savedMistakeWordsRef.current = new Set(draft.savedMistakeWords ?? []);
      setAutoSavedCount(savedMistakeWordsRef.current.size);
      setSamples(draft.samples);
      setNow(0);
      setDraftRestored(true);
      dispatch({ type: "RESTORE", draft });
    } else {
      if (draft) removeTypingDraft(article.id);
      savedMistakeWordsRef.current = new Set();
      setAutoSavedCount(0);
      setSamples([]);
      setNow(0);
      setDraftRestored(false);
      dispatch({ type: "RESTART" });
    }
    setDraftReady(true);
  }, [article.id, article.text.length]);

  useEffect(() => {
    if (state.startTime === null || state.isFinished || state.pausedAt !== null) return;
    setNow(performance.now());
    const interval = window.setInterval(() => setNow(performance.now()), 200);
    return () => window.clearInterval(interval);
  }, [state.startTime, state.isFinished, state.pausedAt]);

  useEffect(() => {
    if (state.startTime === null || state.isFinished || state.pausedAt !== null) return;
    const second = Math.floor(elapsedMs / 1_000);
    if (second <= 0) return;
    setSamples((current) => {
      if (current.at(-1)?.second === second) return current;
      return [...current, { second, wpm, rawWpm }];
    });
  }, [elapsedMs, rawWpm, state.isFinished, state.pausedAt, state.startTime, wpm]);

  useEffect(() => {
    if (!draftReady) return;
    let savedAny = false;
    for (const error of state.errors) {
      const word = normaliseWord(error.word);
      if (!word || savedMistakeWordsRef.current.has(word)) continue;
      savedMistakeWordsRef.current.add(word);
      saveVocabularyItem(createMistakeVocabulary(article, error.word, error.position));
      savedAny = true;
    }
    if (savedAny) setAutoSavedCount(savedMistakeWordsRef.current.size);
  }, [article, draftReady, state.errors]);

  const createDraft = useCallback((engineState: EngineState, speedSamples: WpmSample[]): TypingDraft => ({
    version: 1,
    articleId: article.id,
    targetLength: article.text.length,
    typed: engineState.typed,
    errors: engineState.errors,
    inputCount: engineState.inputCount,
    correctInputCount: engineState.correctInputCount,
    elapsedMs: getEngineElapsedMs(engineState, performance.now()),
    samples: speedSamples,
    savedMistakeWords: Array.from(savedMistakeWordsRef.current),
    savedAt: new Date().toISOString(),
  }), [article.id, article.text.length]);

  useEffect(() => {
    if (!draftReady || state.isFinished || state.typed.length === 0) return;
    const draft = createDraft(state, samples);
    latestDraftRef.current = draft;
    const timeout = window.setTimeout(() => saveTypingDraft(draft), 250);
    return () => window.clearTimeout(timeout);
  }, [createDraft, draftReady, samples, state]);

  useEffect(() => () => {
    if (latestDraftRef.current) saveTypingDraft(latestDraftRef.current);
  }, [article.id]);

  useEffect(() => {
    if (!state.isFinished || completedRef.current) return;
    completedRef.current = true;
    latestDraftRef.current = null;
    removeTypingDraft(article.id);
    const finalSecond = Math.max(1, Math.round(elapsedMs / 1_000));
    const finalSamples = samples.at(-1)?.second === finalSecond ? samples : [...samples, { second: finalSecond, wpm, rawWpm }];
    onComplete({
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
      articleId: article.id,
      articleTitle: article.title,
      wpm,
      rawWpm,
      accuracy,
      duration: elapsedMs / 1_000,
      errors: state.errors,
      errorCount: state.errors.length,
      characters: article.text.length,
      consistency: calculateConsistency(finalSamples),
      samples: finalSamples,
      createdAt: new Date().toISOString(),
    });
  }, [accuracy, article, elapsedMs, onComplete, rawWpm, samples, state.errors, state.isFinished, wpm]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingInput = target === inputRef.current;
      if (target && !isTypingInput && ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName)) return;
      if (document.querySelector("dialog[open]")) return;

      if (event.key === "Tab") {
        event.preventDefault();
        tabArmedRef.current = true;
        window.setTimeout(() => { tabArmedRef.current = false; }, 1_500);
        return;
      }
      if (event.key === "Enter" && tabArmedRef.current) {
        event.preventDefault();
        tabArmedRef.current = false;
        restart();
        return;
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        onNext?.();
        return;
      }
      if (event.key === "Enter") {
        const position = state.typed.length;
        if (article.text[position] === "\n") {
          event.preventDefault();
          if (preferences.sound) playTone(true);
          dispatch({ type: "CHARACTER", character: "\n", timestamp: performance.now(), target: article.text });
        }
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        dispatch({ type: state.pausedAt === null ? "PAUSE" : "RESUME", timestamp: performance.now() });
        return;
      }
      if (event.key === "Backspace") {
        event.preventDefault();
        dispatch({ type: "BACKSPACE" });
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey || event.key.length !== 1) return;
      event.preventDefault();
      const position = state.typed.length;
      if (preferences.sound) playTone(event.key === article.text[position]);
      dispatch({ type: "CHARACTER", character: event.key, timestamp: performance.now(), target: article.text });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [article.text, onNext, preferences.sound, restart, state.pausedAt, state.typed.length]);

  useEffect(() => {
    const handleBlur = () => dispatch({ type: "PAUSE", timestamp: performance.now() });
    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, []);

  const handleMobileInput = (value: string) => {
    if (!value) return;
    for (const character of Array.from(value)) {
      dispatch({ type: "CHARACTER", character, timestamp: performance.now(), target: article.text });
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const textClass = [
    "typing-stage",
    compact ? "typing-stage--compact" : "",
    `typing-stage--${preferences.fontSize}`,
    `typing-stage--${preferences.typingFont}`,
  ].filter(Boolean).join(" ");

  return (
    <section className={textClass} onClick={focusInput} aria-label="Typing practice">
      <textarea
        ref={inputRef}
        className="typing-input"
        aria-label="Type the displayed passage"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        onChange={(event) => handleMobileInput(event.currentTarget.value)}
      />
      <div className="typing-stage__topline">
        <TypingStats
          wpm={wpm}
          accuracy={accuracy}
          elapsedSeconds={elapsedMs / 1_000}
          progress={progress}
          showWpm={preferences.showLiveWpm}
          showAccuracy={preferences.showAccuracy}
        />
        <button className="quiet-action" type="button" onClick={(event) => { event.stopPropagation(); restart(); }}>
          <RefreshCw aria-hidden="true" /> Restart
        </button>
      </div>

      <div className="typing-copy-wrap">
        <TypingText targetText={article.text} typedCharacters={state.typed} smoothCaret={preferences.smoothCaret} />
        {state.pausedAt !== null && (
          <button className="pause-overlay" type="button" onClick={focusInput}>
            <Pause aria-hidden="true" />
            <strong>Practice paused</strong>
            <span>Click here or press Esc to continue.</span>
          </button>
        )}
      </div>

      <div className="typing-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
      <div className="shortcut-hints" aria-label="Keyboard shortcuts">
        <span><kbd>tab</kbd> + <kbd>enter</kbd> restart</span>
        <span><kbd>esc</kbd> pause</span>
        {onNext && <span><kbd>⌘</kbd> + <kbd>enter</kbd> next</span>}
        {draftRestored && <span className="typing-persistence-note">Draft restored · {Math.round(progress)}%</span>}
        {autoSavedCount > 0 && <span className="typing-persistence-note"><BookMarked aria-hidden="true" /> {autoSavedCount} mistake{autoSavedCount === 1 ? "" : "s"} saved</span>}
      </div>
    </section>
  );
}
