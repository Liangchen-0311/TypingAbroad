import type { Metadata } from "next";
import { WordPractice } from "@/components/WordPractice";

export const metadata: Metadata = { title: "Word practice", alternates: { canonical: "/words" } };

export default async function WordsPage({ searchParams }: { searchParams: Promise<{ source?: string }> }) {
  const params = await searchParams;
  const initialSource = params.source === "mistakes" ? "mistakes" as const : undefined;

  return (
    <div className="words-page page-shell">
      <header className="page-heading">
        <h1>Word practice</h1>
        <p>Build speed and recall with 1,000+ IELTS and TOEFL words, paired with concise Chinese meanings.</p>
      </header>
      <WordPractice initialSource={initialSource} />
    </div>
  );
}
