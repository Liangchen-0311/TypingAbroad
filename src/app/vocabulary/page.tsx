import type { Metadata } from "next";
import { VocabularyManager } from "@/components/VocabularyManager";

export const metadata: Metadata = { title: "Mistake Review", alternates: { canonical: "/vocabulary" } };

export default function VocabularyPage() {
  return (
    <div className="vocabulary-page page-shell">
      <header className="page-heading"><h1>Mistake Review</h1><p>Your mistyped words and high-value language, saved locally on this device.</p></header>
      <VocabularyManager />
    </div>
  );
}
