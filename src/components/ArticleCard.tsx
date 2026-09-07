"use client";

import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useMembership } from "./MembershipProvider";
import { canAccessArticle, isFreeArticle } from "@/lib/membership";
import { getSessions } from "@/lib/storage";
import type { Article } from "@/lib/types";

export function ArticleCard({ article }: { article: Article }) {
  const { membership, accessMode } = useMembership();
  const accessible = canAccessArticle(article.id, membership, accessMode);
  const freeSample = isFreeArticle(article.id);
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
          <span className={freeSample ? "is-free-access" : "is-member-access"}>
            {!freeSample && <LockKeyhole aria-hidden="true" />}{freeSample ? "Free sample" : "Member library"}
          </span>
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
      <Link className="article-card__action" href={accessible ? `/practice?article=${article.id}` : "/membership?source=library"}>
        {accessible ? "Start practice" : "Unlock essay"} <ArrowRight aria-hidden="true" />
      </Link>
    </article>
  );
}
