import Link from "next/link";
import { ArrowRight, BookOpen, Keyboard, ScanText } from "lucide-react";
import { HomePracticePreview } from "@/components/HomePracticePreview";

export default function HomePage() {
  return (
    <div className="home-page page-shell">
      <section className="home-hero">
        <div>
          <h1>Type faster. Write better.</h1>
          <p>Practice typing with original IELTS, TOEFL, and academic English passages.</p>
          <Link className="primary-button home-hero__cta" href="/practice">Start typing <ArrowRight aria-hidden="true" /></Link>
        </div>
        <div className="hero-categories" aria-label="Available practice categories">
          <span>IELTS Writing</span><span>TOEFL Writing</span><span>Academic English</span><span>Vocabulary</span>
        </div>
      </section>

      <HomePracticePreview />

      <section className="learning-argument">
        <div className="learning-argument__intro">
          <h2>A typing test that leaves language behind.</h2>
          <p>Every passage is written as learning material. When the timer stops, the vocabulary, collocations, and sentence patterns remain.</p>
          <Link className="text-link" href="/library">Browse the article library <ArrowRight aria-hidden="true" /></Link>
        </div>
        <div className="learning-rail">
          <div><Keyboard aria-hidden="true" /><strong>Typing practice</strong><span>WPM, accuracy, consistency, and error positions.</span></div>
          <div><ScanText aria-hidden="true" /><strong>English input</strong><span>Natural academic sentences instead of shuffled word lists.</span></div>
          <div><BookOpen aria-hidden="true" /><strong>Writing study</strong><span>Useful language extracted from the passage you just typed.</span></div>
        </div>
      </section>
    </div>
  );
}
