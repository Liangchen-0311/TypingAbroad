"use client";

import Link from "next/link";
import { ChevronDown, FileText, FileUp, Shuffle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArticleSelector } from "./ArticleSelector";
import { ResultsView } from "./ResultsView";
import { TypingEngine } from "./TypingEngine";
import { MemberGate } from "./MemberGate";
import { useMembership } from "./MembershipProvider";
import { articles, getArticle, getNextArticle } from "@/lib/articles";
import { customPassageToArticle } from "@/lib/customPassages";
import { accessIsOpen, canAccessArticle, isFreeArticle } from "@/lib/membership";
import { getActivePracticeArticle, getCustomPassage, getSessions, saveActivePracticeArticle, saveSession } from "@/lib/storage";
import type { Article, ArticleLength, Difficulty, Exam, TypingResult } from "@/lib/types";

export function PracticeShell() {
  const searchParams = useSearchParams();
  const initialArticleId = searchParams.get("article") ?? undefined;
  const initialCustomId = searchParams.get("custom") ?? undefined;
  const initial = getArticle(initialArticleId);
  const router = useRouter();
  const [exam, setExam] = useState<Exam>(initial.exam);
  const [taskType, setTaskType] = useState(initial.taskType);
  const [difficulty, setDifficulty] = useState<Difficulty>(initial.difficulty);
  const [length, setLength] = useState<ArticleLength>(initial.length);
  const [articleId, setArticleId] = useState(initial.id);
  const [result, setResult] = useState<TypingResult | null>(null);
  const [completedPreviousBest, setCompletedPreviousBest] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(searchParams.get("from") === "home");
  const [runKey, setRunKey] = useState(0);
  const [customArticle, setCustomArticle] = useState<Article | null>(null);
  const [loadedCustomId, setLoadedCustomId] = useState<string | null>(null);
  const { membership, accessMode } = useMembership();

  const filtered = useMemo(
    () => articles.filter((article) => article.exam === exam && article.taskType === taskType && article.difficulty === difficulty && article.length === length),
    [difficulty, exam, length, taskType],
  );
  const currentArticle = customArticle ?? getArticle(articleId);
  const currentArticleAccessible = customArticle
    ? accessIsOpen(membership, accessMode)
    : canAccessArticle(currentArticle.id, membership, accessMode);
  const customArticleReady = !initialCustomId || loadedCustomId === initialCustomId;
  const selectedMatchingArticle = filtered.find((article) => article.id === articleId) ?? filtered[0];
  const choose = useCallback((nextId: string) => {
    setCustomArticle(null);
    setLoadedCustomId(null);
    saveActivePracticeArticle(nextId);
    setArticleId(nextId);
    setResult(null);
    setCompletedPreviousBest(0);
    setRunKey((value) => value + 1);
    router.replace(`/practice?article=${nextId}`, { scroll: false });
  }, [router]);

  useEffect(() => {
    if (!initialCustomId) {
      setCustomArticle(null);
      setLoadedCustomId(null);
      return;
    }
    const passage = getCustomPassage(initialCustomId);
    setCustomArticle(passage ? customPassageToArticle(passage) : null);
    setLoadedCustomId(initialCustomId);
    setResult(null);
    setCompletedPreviousBest(0);
    setFiltersOpen(false);
    setRunKey((value) => value + 1);
  }, [initialCustomId]);

  useEffect(() => {
    if (initialCustomId) return;
    if (initialArticleId) {
      saveActivePracticeArticle(initial.id);
      return;
    }
    const savedId = getActivePracticeArticle();
    const savedArticle = articles.find((article) => article.id === savedId);
    if (!savedArticle || savedArticle.id === initial.id) {
      saveActivePracticeArticle(initial.id);
      return;
    }
    setExam(savedArticle.exam);
    setTaskType(savedArticle.taskType);
    setDifficulty(savedArticle.difficulty);
    setLength(savedArticle.length);
    setArticleId(savedArticle.id);
    setRunKey((value) => value + 1);
    router.replace(`/practice?article=${savedArticle.id}`, { scroll: false });
  }, [initial.id, initialArticleId, initialCustomId, router]);

  const updateExam = (nextExam: Exam) => {
    const next = articles.find((article) => article.exam === nextExam) ?? articles[0];
    setExam(nextExam);
    setTaskType(next.taskType);
    setDifficulty(next.difficulty);
    setLength(next.length);
    choose(next.id);
  };

  const applyArticle = (next: typeof articles[number]) => {
    setExam(next.exam);
    setTaskType(next.taskType);
    setDifficulty(next.difficulty);
    setLength(next.length);
    choose(next.id);
  };

  const randomArticle = useCallback(() => {
    const preferredPool = filtered.length > 1 ? filtered : articles.filter((article) => article.exam === exam);
    const accessiblePool = preferredPool.filter((article) => canAccessArticle(article.id, membership, accessMode));
    const pool = accessiblePool.length ? accessiblePool : preferredPool;
    const next = getNextArticle(currentArticle.id, pool);
    setExam(next.exam);
    setTaskType(next.taskType);
    setDifficulty(next.difficulty);
    setLength(next.length);
    choose(next.id);
    setFiltersOpen(false);
  }, [accessMode, choose, currentArticle.id, exam, filtered, membership]);

  const nextArticle = useCallback(() => {
    if (customArticle) {
      router.push("/custom-practice");
      return;
    }
    randomArticle();
  }, [customArticle, randomArticle, router]);

  const handleComplete = useCallback((completed: TypingResult) => {
    const previousBest = getSessions()
      .filter((session) => session.articleId === completed.articleId)
      .reduce((best, session) => Math.max(best, session.wpm), 0);
    setCompletedPreviousBest(previousBest);
    saveSession(completed);
    setResult(completed);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!customArticleReady) {
    return <div className="practice-page page-shell" aria-busy="true"><p className="practice-loading">Loading your passage…</p></div>;
  }

  if (initialCustomId && !customArticle) {
    return (
      <div className="practice-page page-shell">
        <section className="practice-missing-passage">
          <span>Custom Practice</span>
          <h1>Passage not found.</h1>
          <p>This passage may have been created in another browser or removed from this device.</p>
          <Link className="primary-button" href="/custom-practice">Import a passage</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="practice-page page-shell">
      {!result && (
        <>
          <div className="practice-heading">
            <div>
              <h1>Essay Practice</h1>
            </div>
            <div className="practice-heading__actions">
              <Link className="quiet-action" href="/custom-practice"><FileUp aria-hidden="true" /> Import your text</Link>
              <button className="quiet-action" type="button" onClick={randomArticle}><Shuffle aria-hidden="true" /> Random article</button>
            </div>
          </div>

          <section className="practice-passage" aria-label="Current practice passage">
            <div className="practice-passage__summary">
              <div className="practice-passage__current">
                <span className="practice-passage__label">{customArticle ? "Your passage" : "Current passage"}</span>
                <div className="practice-passage__title">
                  <FileText aria-hidden="true" />
                  <strong>{currentArticle.title}</strong>
                </div>
                <div className="practice-passage__meta" aria-label="Passage details">
                  <span>{currentArticle.exam}</span>
                  <span>{currentArticle.taskType}</span>
                  <span>{currentArticle.difficulty}</span>
                  <span>{currentArticle.length}</span>
                  <span>{currentArticle.wordCount} words</span>
                  {currentArticle.estimatedBand && <span>Band {currentArticle.estimatedBand}</span>}
                </div>
              </div>
              {customArticle ? (
                <Link className="quiet-action passage-chooser__toggle" href={`/custom-practice?passage=${encodeURIComponent(customArticle.id)}`}>
                  Edit passage <FileUp aria-hidden="true" />
                </Link>
              ) : (
                <button
                  className="quiet-action passage-chooser__toggle"
                  type="button"
                  aria-expanded={filtersOpen}
                  aria-controls="passage-chooser"
                  onClick={() => setFiltersOpen((open) => !open)}
                >
                  {filtersOpen ? "Hide filters" : "Change passage"}
                  <ChevronDown aria-hidden="true" />
                </button>
              )}
            </div>

            {!customArticle && filtersOpen && (
              <div id="passage-chooser" className="passage-chooser">
                <ArticleSelector
                  exam={exam}
                  taskType={taskType}
                  difficulty={difficulty}
                  length={length}
                  onExam={updateExam}
                  onTaskType={(value) => {
                    const next = articles.find((article) => article.exam === exam && article.taskType === value);
                    if (next) applyArticle(next);
                  }}
                  onDifficulty={(value) => {
                    const next = articles.find((article) => article.exam === exam && article.taskType === taskType && article.difficulty === value)
                      ?? articles.find((article) => article.exam === exam && article.difficulty === value);
                    if (next) applyArticle(next);
                  }}
                  onLength={(value) => {
                    const next = articles.find((article) => article.exam === exam && article.taskType === taskType && article.difficulty === difficulty && article.length === value)
                      ?? articles.find((article) => article.exam === exam && article.length === value);
                    if (next) applyArticle(next);
                  }}
                />

                <div className="passage-chooser__picker">
                  <div className="passage-chooser__heading">
                    <span>Passage</span>
                    <span>{filtered.length} matches</span>
                  </div>
                  {selectedMatchingArticle ? (
                    <label className="article-select passage-chooser__select">
                      <span>Select an article</span>
                      <select
                        value={selectedMatchingArticle.id}
                        onChange={(event) => {
                          const next = articles.find((article) => article.id === event.target.value);
                          if (!next) return;
                          applyArticle(next);
                          setFiltersOpen(false);
                        }}
                      >
                        {filtered.map((article) => (
                          <option key={article.id} value={article.id}>
                            {isFreeArticle(article.id) ? article.title : `${article.title} · Member`}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <p className="passage-chooser__empty">No exact match. Adjust one filter; your current passage remains available.</p>
                  )}
                </div>
              </div>
            )}
          </section>

          {currentArticleAccessible ? (
            <TypingEngine key={`${currentArticle.id}-${runKey}`} article={currentArticle} onComplete={handleComplete} onNext={nextArticle} />
          ) : (
            <MemberGate title={customArticle ? "Reactivate Custom Practice" : "Unlock this model essay"} source={customArticle ? "custom-practice" : "essay-practice"}>
              {customArticle
                ? "Your passage is still stored on this device. Renew membership to continue the draft and keep saving mistakes in context."
                : "This passage is part of the complete member library. You can choose one of the free samples above or compare membership access."}
            </MemberGate>
          )}
        </>
      )}

      {result && (
        <ResultsView
          article={currentArticle}
          result={result}
          previousBest={completedPreviousBest}
          onAgain={() => { setResult(null); setRunKey((value) => value + 1); }}
          onNext={nextArticle}
          nextLabel={customArticle ? "New passage" : "Next article"}
        />
      )}
    </div>
  );
}
