"use client";

import { useRouter } from "next/navigation";
import { TypingEngine } from "./TypingEngine";
import { articles } from "@/lib/articles";
import type { Article } from "@/lib/types";

const source = articles[0];
const demoText = "Technology is most valuable when it removes a barrier to human contact, not when it becomes a barrier itself.";
const demoArticle: Article = {
  ...source,
  id: "home-demo",
  title: "A one-sentence warm-up",
  text: demoText,
  wordCount: demoText.split(/\s+/).length,
  length: "Short",
};

export function HomePracticePreview() {
  const router = useRouter();
  return (
    <div className="home-workbench">
      <div className="home-workbench__caption">
        <span>Try it here</span>
        <p>No start button. Place your hands on the keyboard and type the sentence.</p>
      </div>
      <TypingEngine
        article={demoArticle}
        compact
        onComplete={() => router.push(`/practice?article=${source.id}`)}
        onNext={() => router.push(`/practice?article=${source.id}`)}
      />
    </div>
  );
}
