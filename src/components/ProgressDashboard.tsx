"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { articles } from "@/lib/articles";
import { calculatePracticeStreak, summarizeWordCategories, summarizeWordPractice } from "@/lib/progress";
import { getGoal, getSessions, getTypingDrafts, getWordPracticeResults, saveGoal } from "@/lib/storage";
import type { TypingDraft, TypingResult, WordPracticeResult } from "@/lib/types";

type ProgressView = "articles" | "words";
type Range = 7 | 30 | "all";

function getLevel(wpm: number) {
  if (wpm >= 80) return "Typing Master";
  if (wpm >= 60) return "Expert";
  if (wpm >= 45) return "Advanced";
  if (wpm >= 30) return "Intermediate";
  return "Beginner";
}

function getWordLevel(accuracy: number | null) {
  if (accuracy === null) return "Start your first session";
  if (accuracy >= 98) return "Excellent control";
  if (accuracy >= 95) return "Strong accuracy";
  if (accuracy >= 90) return "Building consistency";
  return "Keep practising";
}

function formatDuration(seconds: number) {
  if (!seconds) return "—";
  if (seconds < 60) return `${Math.max(1, Math.round(seconds))} sec`;
  if (seconds < 3_600) return `${(seconds / 60).toFixed(seconds < 600 ? 1 : 0)} min`;
  return `${(seconds / 3_600).toFixed(1)} h`;
}

function formatSessionDate(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function filterByRange<T extends { createdAt: string }>(items: T[], range: Range, renderedAt: number) {
  if (range === "all") return [...items].reverse();
  const cutoff = renderedAt - range * 86_400_000;
  return items.filter((item) => new Date(item.createdAt).getTime() >= cutoff).reverse();
}

function RangeControl({ range, onChange }: { range: Range; onChange: (range: Range) => void }) {
  return (
    <div className="segmented">
      {([7, 30, "all"] as const).map((item) => (
        <button key={item} type="button" className={range === item ? "is-active" : ""} onClick={() => onChange(item)}>
          {item === "all" ? "All" : `${item} days`}
        </button>
      ))}
    </div>
  );
}

export function ProgressDashboard() {
  const [sessions, setSessions] = useState<TypingResult[]>([]);
  const [wordSessions, setWordSessions] = useState<WordPracticeResult[]>([]);
  const [drafts, setDrafts] = useState<TypingDraft[]>([]);
  const [view, setView] = useState<ProgressView>("articles");
  const [range, setRange] = useState<Range>(30);
  const [goal, setGoalState] = useState(60);
  const [renderedAt] = useState(() => Date.now());

  useEffect(() => {
    const articleResults = getSessions();
    const wordResults = getWordPracticeResults();
    setSessions(articleResults);
    setWordSessions(wordResults);
    setDrafts(Object.values(getTypingDrafts()).sort((a, b) => b.savedAt.localeCompare(a.savedAt)));
    setGoalState(getGoal());

    const latestArticle = articleResults[0]?.createdAt ?? "";
    const latestWord = wordResults[0]?.createdAt ?? "";
    if (latestWord && latestWord >= latestArticle) setView("words");
  }, []);

  const articleById = useMemo(() => new Map(articles.map((article) => [article.id, article])), []);
  const visibleArticles = useMemo(() => filterByRange(sessions, range, renderedAt), [range, renderedAt, sessions]);
  const visibleWords = useMemo(() => filterByRange(wordSessions, range, renderedAt), [range, renderedAt, wordSessions]);
  const average = sessions.length ? Math.round(sessions.reduce((sum, item) => sum + item.wpm, 0) / sessions.length) : 0;
  const best = sessions.reduce((value, item) => Math.max(value, item.wpm), 0);
  const accuracy = sessions.length ? sessions.reduce((sum, item) => sum + item.accuracy, 0) / sessions.length : 0;
  const practiceSeconds = sessions.reduce((sum, item) => sum + item.duration, 0);
  const articleChartData = visibleArticles.map((session, index) => ({ index: index + 1, wpm: session.wpm }));
  const goalProgress = Math.min(100, goal ? (average / goal) * 100 : 0);
  const wordSummary = useMemo(() => summarizeWordPractice(wordSessions), [wordSessions]);
  const wordCategories = useMemo(() => summarizeWordCategories(wordSessions), [wordSessions]);
  const wordChartData = visibleWords.map((session, index) => ({
    index: index + 1,
    accuracy: session.inputCount ? Number(session.accuracy.toFixed(1)) : null,
  }));

  return (
    <div className="progress-dashboard">
      <div className="segmented progress-view-switch" role="group" aria-label="Progress type">
        <button type="button" className={view === "articles" ? "is-active" : ""} onClick={() => setView("articles")}>
          Article typing <small>{sessions.length}</small>
        </button>
        <button type="button" className={view === "words" ? "is-active" : ""} onClick={() => setView("words")}>
          Word practice <small>{wordSessions.length}</small>
        </button>
      </div>

      {view === "articles" ? (
        <>
          <section className="progress-summary">
            <div className="progress-primary"><span>Average WPM</span><strong>{average || "—"}</strong><small>{getLevel(average)}</small></div>
            <dl>
              <div><dt>Best WPM</dt><dd>{best || "—"}</dd></div>
              <div><dt>Accuracy</dt><dd>{sessions.length ? `${accuracy.toFixed(1)}%` : "—"}</dd></div>
              <div><dt>Practice time</dt><dd>{formatDuration(practiceSeconds)}</dd></div>
              <div><dt>Articles</dt><dd>{sessions.length || "—"}</dd></div>
              <div><dt>Daily streak</dt><dd>{calculatePracticeStreak(sessions.map((session) => session.createdAt))} days</dd></div>
            </dl>
          </section>

          {drafts.length > 0 && (
            <section className="progress-detail-section">
              <div className="section-title-row"><div><h2>Continue article practice</h2><p>Your unfinished passages are saved automatically.</p></div></div>
              <div className="progress-draft-list">
                {drafts.map((draft) => {
                  const article = articleById.get(draft.articleId);
                  const percent = Math.min(100, draft.targetLength ? (draft.typed.length / draft.targetLength) * 100 : 0);
                  return (
                    <article key={draft.articleId} className="progress-draft-row">
                      <div>
                        <span>{article?.exam ?? "Practice"} · {article?.taskType ?? "Article"}</span>
                        <h3>{article?.title ?? "Saved article practice"}</h3>
                      </div>
                      <div className="progress-draft-metrics">
                        <span>{Math.round(percent)}% complete</span>
                        <span>{draft.errors.length} errors</span>
                        <span>{formatDuration(draft.elapsedMs / 1_000)}</span>
                      </div>
                      <div className="progress-draft-track" aria-label={`${Math.round(percent)} percent complete`}><span style={{ transform: `scaleX(${percent / 100})` }} /></div>
                      <Link className="text-button" href={`/practice?article=${draft.articleId}`}>Continue</Link>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          <section className="progress-chart-section">
            <div className="section-title-row">
              <div><h2>Typing speed over time</h2><p>Each point is one completed article.</p></div>
              <RangeControl range={range} onChange={setRange} />
            </div>
            {articleChartData.length ? (
              <div className="progress-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={articleChartData} margin={{ top: 20, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="var(--color-chart-grid)" vertical={false} />
                    <XAxis dataKey="index" stroke="var(--color-muted)" tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--color-muted)" tickLine={false} axisLine={false} width={52} />
                    <Line dataKey="wpm" type="monotone" stroke="var(--color-accent)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--color-accent)" }} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : <div className="chart-empty">Complete a passage to draw your first data point.</div>}
          </section>

          <section className="progress-detail-section">
            <div className="section-title-row"><div><h2>Recent article results</h2><p>Speed, accuracy and errors from your latest completed passages.</p></div></div>
            {sessions.length ? (
              <div className="progress-session-list">
                {sessions.slice(0, 8).map((session) => (
                  <article key={session.id} className="progress-session-row">
                    <div><span>{formatSessionDate(session.createdAt)}</span><h3>{session.articleTitle}</h3></div>
                    <dl>
                      <div><dt>WPM</dt><dd>{session.wpm}</dd></div>
                      <div><dt>Accuracy</dt><dd>{session.accuracy.toFixed(1)}%</dd></div>
                      <div><dt>Errors</dt><dd>{session.errorCount}</dd></div>
                      <div><dt>Time</dt><dd>{formatDuration(session.duration)}</dd></div>
                    </dl>
                  </article>
                ))}
              </div>
            ) : <div className="chart-empty">Complete an article to see its result here.</div>}
          </section>

          <section className="goal-section">
            <div><h2>Target WPM</h2><p>Your goal stays on this device.</p></div>
            <div className="goal-control">
              <div className="segmented">
                {[40, 50, 60, 80].map((value) => <button key={value} type="button" className={goal === value ? "is-active" : ""} onClick={() => { setGoalState(value); saveGoal(value); }}>{value}</button>)}
              </div>
              <p><strong>{average}</strong><span>→</span><strong>{goal} WPM</strong><small>{Math.round(goalProgress)}%</small></p>
              <div className="goal-track" aria-label={`${Math.round(goalProgress)} percent toward goal`}><span style={{ transform: `scaleX(${goalProgress / 100})` }} /></div>
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="progress-summary progress-summary--words">
            <div className="progress-primary"><span>Words completed</span><strong>{wordSummary.completedWords || "—"}</strong><small>{getWordLevel(wordSummary.accuracy)}</small></div>
            <dl>
              <div><dt>Key accuracy</dt><dd>{wordSummary.accuracy === null ? "—" : `${wordSummary.accuracy.toFixed(1)}%`}</dd></div>
              <div><dt>Completion</dt><dd>{wordSummary.completionRate === null ? "—" : `${wordSummary.completionRate.toFixed(1)}%`}</dd></div>
              <div><dt>Key errors</dt><dd>{wordSummary.errorCount || "—"}</dd></div>
              <div><dt>Sessions</dt><dd>{wordSummary.sessions || "—"}</dd></div>
              <div><dt>Practice time</dt><dd>{formatDuration(wordSummary.duration)}</dd></div>
              <div><dt>Daily streak</dt><dd>{calculatePracticeStreak(wordSessions.map((session) => session.createdAt))} days</dd></div>
            </dl>
          </section>

          <section className="progress-chart-section">
            <div className="section-title-row">
              <div><h2>Word accuracy over time</h2><p>Correct key attempts in each completed session.</p></div>
              <RangeControl range={range} onChange={setRange} />
            </div>
            {wordChartData.length ? (
              <div className="progress-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={wordChartData} margin={{ top: 20, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="var(--color-chart-grid)" vertical={false} />
                    <XAxis dataKey="index" stroke="var(--color-muted)" tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} stroke="var(--color-muted)" tickLine={false} axisLine={false} width={52} unit="%" />
                    <Line connectNulls dataKey="accuracy" type="monotone" stroke="var(--color-accent)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--color-accent)" }} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : <div className="chart-empty">Complete a word session to draw your first data point.</div>}
          </section>

          <section className="progress-detail-section">
            <div className="section-title-row"><div><h2>Category performance</h2><p>See where you practise most and where accuracy needs attention.</p></div></div>
            {wordCategories.length ? (
              <div className="word-category-grid">
                {wordCategories.map((item) => (
                  <article key={item.category} className="word-category-card">
                    <div><span>{item.sessions} sessions</span><h3>{item.category}</h3></div>
                    <dl>
                      <div><dt>Words</dt><dd>{item.completedWords}</dd></div>
                      <div><dt>Accuracy</dt><dd>{item.accuracy === null ? "—" : `${item.accuracy.toFixed(1)}%`}</dd></div>
                      <div><dt>Errors</dt><dd>{item.errorCount}</dd></div>
                    </dl>
                    <div className="word-accuracy-track" aria-hidden="true"><span style={{ transform: `scaleX(${(item.accuracy ?? 0) / 100})` }} /></div>
                  </article>
                ))}
              </div>
            ) : <div className="chart-empty">Your category breakdown will appear after the first session.</div>}
          </section>

          <section className="progress-detail-section">
            <div className="section-title-row"><div><h2>Recent word sessions</h2><p>Your latest completion, accuracy and mistake results.</p></div></div>
            {wordSessions.length ? (
              <div className="progress-session-list">
                {wordSessions.slice(0, 10).map((session) => (
                  <article key={session.id} className="progress-session-row">
                    <div>
                      <span>{formatSessionDate(session.createdAt)} · {session.source === "mistakes" ? "Mistake review" : session.category}</span>
                      <h3>{session.completedWords} of {session.totalWords} words completed</h3>
                    </div>
                    <dl>
                      <div><dt>Accuracy</dt><dd>{session.inputCount ? `${session.accuracy.toFixed(1)}%` : "—"}</dd></div>
                      <div><dt>Errors</dt><dd>{session.errorCount}</dd></div>
                      <div><dt>Skipped</dt><dd>{session.skippedWords}</dd></div>
                      <div><dt>Time</dt><dd>{formatDuration(session.duration)}</dd></div>
                    </dl>
                  </article>
                ))}
              </div>
            ) : <div className="chart-empty">Complete a word session to see its result here.</div>}
          </section>
        </>
      )}
    </div>
  );
}
