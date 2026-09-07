"use client";

import { ChevronDown, FileText, Shuffle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArticleSelector } from "./ArticleSelector";
import { ResultsView } from "./ResultsView";
import { TypingEngine } from "./TypingEngine";
import { MemberGate } from "./MemberGate";
import { useMembership } from "./MembershipProvider";
import { articles, getArticle, getNextArticle } from "@/lib/articles";
import { canAccessArticle, isFreeArticle } from "@/lib/membership";
import { getActivePracticeArticle, getSessions, saveActivePracticeArticle, saveSession } from "@/lib/storage";
import type { ArticleLength, Difficulty, Exam, TypingResult } from "@/lib/types";

export function PracticeShell() {
  const searchParams = useSearchParams();
  const initialArticleId = searchParams.get("article") ?? undefined;
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
  const { membership, accessMode } = useMembership();

  const filtered = useMemo(
    () => articles.filter((article) => article.exam === exam && article.taskType === taskType && article.difficulty === difficulty && article.length === length),
    [difficulty, exam, length, taskType],
  );
  const currentArticle = getArticle(articleId);
  const currentArticleAccessible = canAccessArticle(currentArticle.id, membership, accessMode);
  const selectedMatchingArticle = filtered.find((article) => article.id === articleId) ?? filtered[0];
  const choose = useCallback((nextId: string) => {
    saveActivePracticeArticle(nextId);
    setArticleId(nextId);
    setResult(null);
    setCompletedPreviousBest(0);
    setRunKey((value) => value + 1);
    router.replace(`/practice?article=${nextId}`, { scroll: false });
  }, [router]);

  useEffect(() => {
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
  }, [initial.id, initialArticleId, router]);

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

  const nextArticle = useCallback(() => {
    if (!currentArticle) return;
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
  }, [accessMode, choose, currentArticle, exam, filtered, membership]);

  const handleComplete = useCallback((completed: TypingResult) => {
    const previousBest = getSessions()
      .filter((session) => session.articleId === completed.articleId)
      .reduce((best, session) => Math.max(best, session.wpm), 0);
    setCompletedPreviousBest(previousBest);
    saveSession(completed);
    setResult(completed);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="practice-page page-shell">
      {!result && (
        <>
          <div className="practice-heading">
            <div>
              <h1>Essay Practice</h1>
            </div>
            <button className="quiet-action" type="button" onClick={nextArticle}><Shuffle aria-hidden="true" /> Random article</button>
          </div>

          <section className="practice-passage" aria-label="Current practice passage">
            <div className="practice-passage__summary">
              <div className="practice-passage__current">
                <span className="practice-passage__label">Current passage</span>
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
            </div>

            {filtersOpen && (
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
            <MemberGate title="Unlock this model essay" source="essay-practice">
              This passage is part of the complete member library. You can choose one of the free samples above or compare membership access.
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
        />
      )}
    </div>
  );
}
