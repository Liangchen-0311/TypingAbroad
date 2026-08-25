"use client";

import { BookMarked, Check, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getVocabulary, saveVocabularyItem } from "@/lib/storage";
import type { Article, SavedVocabulary } from "@/lib/types";

export function LearningPanel({ article }: { article: Article }) {
  const [savedWords, setSavedWords] = useState<string[]>(() => []);

  useEffect(() => {
    setSavedWords(getVocabulary().map((item) => item.id));
  }, []);

  const addWord = (wordIndex: number) => {
    const item = article.vocabulary[wordIndex];
    const id = `${article.id}:${item.word.toLowerCase()}`;
    if (!getVocabulary().some((entry) => entry.id === id)) {
      const saved: SavedVocabulary = {
        ...item,
        id,
        sourceArticleId: article.id,
        sourceTitle: article.title,
        sourceHref: `/practice?article=${article.id}`,
        learned: false,
        savedAt: new Date().toISOString(),
      };
      saveVocabularyItem(saved);
    }
    setSavedWords((current) => current.includes(id) ? current : [...current, id]);
  };

  return (
    <section className="result-section learning-panel">
      <div className="result-section__heading">
        <div>
          <h2>Learn from this essay</h2>
          <p>Keep the language that made this passage worth typing.</p>
        </div>
        <BookMarked aria-hidden="true" />
      </div>

      <div className="learning-vocabulary">
        <h3>Useful vocabulary</h3>
        {article.vocabulary.map((item, index) => {
          const id = `${article.id}:${item.word.toLowerCase()}`;
          const saved = savedWords.includes(id);
          return (
            <article key={item.word}>
              <div>
                <strong>{item.word}</strong>
                <p>{item.meaning}</p>
                <blockquote>{item.example}</blockquote>
              </div>
              <button className="quiet-action" type="button" onClick={() => addWord(index)} disabled={saved}>
                {saved ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
                {saved ? "Saved" : "Save word"}
              </button>
            </article>
          );
        })}
      </div>

      <div className="learning-columns">
        <div>
          <h3>Useful collocations</h3>
          <ul>{article.collocations.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h3>Sentence structure</h3>
          {article.sentenceStructures.map((item) => (
            <div key={item.pattern} className="sentence-pattern">
              <blockquote>{item.pattern}</blockquote>
              <p>{item.explanation}</p>
              <code>{item.template}</code>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
