"use client";

import { ArrowRight, RefreshCw, Search, Trophy } from "lucide-react";
import type { Article, TypingResult } from "@/lib/types";
import { formatDuration } from "@/lib/typing";
import { LearningPanel } from "./LearningPanel";
import { MistakeAnalysis } from "./MistakeAnalysis";
import { TypingChart } from "./TypingChart";

interface ResultsViewProps {
  article: Article;
  result: TypingResult;
  previousBest: number;
  onAgain: () => void;
  onNext: () => void;
}

export function ResultsView({ article, result, previousBest, onAgain, onNext }: ResultsViewProps) {
  const isRecord = result.wpm > previousBest;

  return (
    <div className="results-view">
      <section className="result-hero">
        <div className="result-score">
          <span>words per minute</span>
          <strong>{result.wpm}</strong>
          <small>raw {result.rawWpm}</small>
        </div>
        <dl className="result-metrics">
          <div><dt>Accuracy</dt><dd>{result.accuracy.toFixed(1)}%</dd></div>
          <div><dt>Time</dt><dd>{formatDuration(result.duration)}</dd></div>
          <div><dt>Errors</dt><dd>{result.errorCount}</dd></div>
          <div><dt>Characters</dt><dd>{result.characters}</dd></div>
          <div><dt>Consistency</dt><dd>{result.consistency}%</dd></div>
        </dl>
        <TypingChart samples={result.samples} />
        <div className="personal-best">
          <div>
            <span>{isRecord ? "New personal best" : "Personal best"}</span>
            <strong>{Math.max(previousBest, result.wpm)} WPM</strong>
          </div>
          {isRecord ? <Trophy aria-label="New record" /> : <span>Previous {previousBest || "—"}</span>}
        </div>
        <div className="result-actions">
          <button className="primary-button" type="button" onClick={onNext}>Next article <ArrowRight aria-hidden="true" /></button>
          <button className="secondary-button" type="button" onClick={onAgain}><RefreshCw aria-hidden="true" /> Practice again</button>
          <button className="text-button" type="button" onClick={() => document.getElementById("mistake-analysis")?.scrollIntoView({ behavior: "smooth" })}>
            <Search aria-hidden="true" /> Review mistakes
          </button>
        </div>
      </section>

      <MistakeAnalysis errors={result.errors} />
      <LearningPanel article={article} />
    </div>
  );
}
