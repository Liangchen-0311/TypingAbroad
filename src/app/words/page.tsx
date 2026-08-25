import type { Metadata } from "next";
import { Suspense } from "react";
import { WordPractice } from "@/components/WordPractice";

export const metadata: Metadata = { title: "Word practice", alternates: { canonical: "/words" } };

export default function WordsPage() {
  return (
    <div className="words-page page-shell">
      <header className="page-heading">
        <h1>Word practice</h1>
        <p>Build speed and recall with 1,000+ IELTS and TOEFL words, paired with concise Chinese meanings.</p>
      </header>
      <Suspense fallback={<div aria-busy="true" />}>
        <WordPractice />
      </Suspense>
    </div>
  );
}
