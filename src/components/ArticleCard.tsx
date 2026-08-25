"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSessions } from "@/lib/storage";
import type { Article } from "@/lib/types";

export function ArticleCard({ article }: { article: Article }) {
  const articleSessions = getSessions().filter((session) => session.articleId === article.id);
  const best = articleSessions.reduce((value, session) => Math.max(value, session.wpm), 0);
  const average = articleSessions.length
    ? Math.round(articleSessions.reduce((sum, session) => sum + session.wpm, 0) / articleSessions.length)
    : 0;

  return (
    <article className="article-card">
      <div className="article-card__main">
        <div className="article-card__meta">
          <span>{article.exam}</span>
          <span>{article.taskType}</span>
          <span>{article.difficulty}</span>
        </div>
        <h2>{article.title}</h2>
        <p>{article.text.slice(0, 150).trim()}…</p>
      </div>
      <dl className="article-card__stats">
        <div><dt>Topic</dt><dd>{article.topic}</dd></div>
        <div><dt>Words</dt><dd>{article.wordCount}</dd></div>
        <div><dt>Average</dt><dd>{average ? `${average} WPM` : "—"}</dd></div>
        <div><dt>Best</dt><dd>{best ? `${best} WPM` : "—"}</dd></div>
      </dl>
      <Link className="article-card__action" href={`/practice?article=${article.id}`}>
        Start practice <ArrowRight aria-hidden="true" />
      </Link>
    </article>
  );
}
