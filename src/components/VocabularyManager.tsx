"use client";

import Link from "next/link";
import { BookOpenCheck, Check, Keyboard, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { WordPractice } from "./WordPractice";
import { getVocabulary, saveVocabulary } from "@/lib/storage";
import { getChineseWordMeaning } from "@/lib/wordMeanings";
import type { SavedVocabulary } from "@/lib/types";

export function VocabularyManager() {
  const [items, setItems] = useState<SavedVocabulary[]>([]);
  const [practiceOpen, setPracticeOpen] = useState(false);
  useEffect(() => {
    const stored = getVocabulary();
    let enrichedAny = false;
    const enriched = stored.map((item) => {
      if (item.meaningZh) return item;
      const meaningZh = getChineseWordMeaning(item.word);
      if (!meaningZh) return item;
      enrichedAny = true;
      return { ...item, meaningZh };
    });
    setItems(enriched);
    if (enrichedAny) saveVocabulary(enriched);
  }, []);

  const update = (next: SavedVocabulary[]) => {
    setItems(next);
    saveVocabulary(next);
  };

  const mistakeWordCount = new Set(
    items
      .filter((item) => item.savedFromMistake)
      .map((item) => item.word.trim().toLowerCase()),
  ).size;

  const openMistakePractice = (scrollIntoView = false) => {
    setPracticeOpen(true);
    if (!scrollIntoView) return;
    window.requestAnimationFrame(() => {
      document.getElementById("practice-mistakes")?.scrollIntoView({ block: "start" });
    });
  };

  if (!items.length) {
    return (
      <div className="vocabulary-empty">
        <BookOpenCheck aria-hidden="true" />
        <h2>No saved words yet.</h2>
        <p>Mistyped passage words appear here automatically. You can also save useful language from a completed passage.</p>
        <div className="vocabulary-empty__actions">
          <Link className="primary-button" href="/practice">Start a passage</Link>
          <Link className="quiet-action" href="/words">Practise common words</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="vocabulary-manager">
      {mistakeWordCount > 0 && (
        <section id="practice-mistakes" className="mistake-practice-workspace" aria-labelledby="mistake-drill-title">
          <div className="mistake-drill-entry">
            <div className="mistake-drill-entry__copy">
              <h2 id="mistake-drill-title">Practice your mistakes</h2>
              <p>Type each missed word, then recall it once more from its original sentence.</p>
              <span>{mistakeWordCount} saved mistake {mistakeWordCount === 1 ? "word" : "words"}</span>
            </div>
            <button
              className="primary-button"
              type="button"
              aria-expanded={practiceOpen}
              aria-controls="mistake-drill-workspace"
              onClick={() => setPracticeOpen((open) => !open)}
            >
              <Keyboard aria-hidden="true" /> {practiceOpen ? "Close practice" : "Start practice"}
            </button>
          </div>
          {practiceOpen && (
            <div id="mistake-drill-workspace" className="mistake-drill-workspace">
              <WordPractice
                source="mistakes"
                vocabularyItems={items}
                onVocabularyChange={setItems}
              />
            </div>
          )}
        </section>
      )}

      <div className="vocabulary-list">
        {items.map((item) => {
          const meaningZh = item.meaningZh ?? getChineseWordMeaning(item.word);
          const isOldMistakePlaceholder = item.meaning === "Mistyped during passage practice.";
          return (
            <article key={item.id} className={item.learned ? "is-learned" : ""}>
              <div className="vocabulary-word">
                <strong>{item.word}</strong>
                <div className="vocabulary-status">
                  {item.savedFromMistake && <span className="is-mistake">Mistake · {item.mistakeCount ?? 1}×</span>}
                  <span>{item.learned ? "Learned" : "Learning"}</span>
                </div>
              </div>
              <div>
                {meaningZh && <p className="vocabulary-meaning-zh" lang="zh-CN">{meaningZh}</p>}
                {!isOldMistakePlaceholder && item.meaning !== meaningZh && <p>{item.meaning}</p>}
                <blockquote>{item.example}</blockquote>
              </div>
              <div className="vocabulary-source"><span>Source</span><strong>{item.sourceTitle}</strong></div>
              <div className="vocabulary-actions">
                <button className="quiet-action" type="button" onClick={() => update(items.map((entry) => entry.id === item.id ? { ...entry, learned: !entry.learned } : entry))}>
                  <Check aria-hidden="true" /> {item.learned ? "Mark learning" : "Mark learned"}
                </button>
                {item.savedFromMistake ? (
                  <button className="quiet-action" type="button" onClick={() => openMistakePractice(true)}><Keyboard aria-hidden="true" /> Practice</button>
                ) : (
                  <Link className="quiet-action" href={item.sourceHref ?? `/practice?article=${item.sourceArticleId}`}><Keyboard aria-hidden="true" /> Practice</Link>
                )}
                <button className="icon-button" type="button" aria-label={`Remove ${item.word}`} onClick={() => update(items.filter((entry) => entry.id !== item.id))}><Trash2 aria-hidden="true" /></button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
