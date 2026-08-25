"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ArticleCard } from "./ArticleCard";
import { articles, difficulties, exams } from "@/lib/articles";
import type { Difficulty, Exam } from "@/lib/types";

export function LibraryBrowser() {
  const [query, setQuery] = useState("");
  const [exam, setExam] = useState<Exam | "All">("All");
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesText = !needle || [article.title, article.topic, article.taskType, ...article.tags].join(" ").toLowerCase().includes(needle);
      return matchesText && (exam === "All" || article.exam === exam) && (difficulty === "All" || article.difficulty === difficulty);
    });
  }, [difficulty, exam, query]);

  return (
    <>
      <div className="library-tools">
        <label className="search-field">
          <span>Search articles</span>
          <div><Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="technology, Task 2, science" /></div>
        </label>
        <label>
          <span>Exam</span>
          <select value={exam} onChange={(event) => setExam(event.target.value as Exam | "All")}>
            <option>All</option>
            {exams.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Difficulty</span>
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty | "All")}>
            <option>All</option>
            {difficulties.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="library-count"><span>{filtered.length} original passages</span><span>Short · Medium · Long</span></div>
      <div className="article-list">
        {filtered.map((article) => <ArticleCard key={article.id} article={article} />)}
      </div>
      {filtered.length === 0 && <div className="empty-filter"><strong>No passages found.</strong><p>Try a broader topic or reset one of the filters.</p></div>}
    </>
  );
}
