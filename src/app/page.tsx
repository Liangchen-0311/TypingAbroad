import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomePracticePreview } from "@/components/HomePracticePreview";

export default function HomePage() {
  return (
    <div className="home-page page-shell">
      <section className="home-hero">
        <div className="home-hero__copy">
          <h1><span>Type faster.</span><span>Write better.</span></h1>
          <p>Type through high-scoring IELTS and TOEFL model essays—not random words or generic quotes.</p>
          <Link className="primary-button home-hero__cta" href="/practice">Start typing <ArrowRight aria-hidden="true" /></Link>
        </div>

        <div className="home-writing-proof">
          <div className="home-writing-proof__intro">
            <h2>High-scoring writing, built into every session.</h2>
            <p>Sentence structure, vocabulary, and argument flow stay in context as you type.</p>
          </div>
          <dl aria-label="Writing practice collection">
            <div>
              <dt>IELTS</dt>
              <dd><strong>High-scoring model essays</strong><span>Writing Task 1 and Task 2</span></dd>
            </div>
            <div>
              <dt>TOEFL</dt>
              <dd><strong>High-scoring sample responses</strong><span>Write an Email and Academic Discussion</span></dd>
            </div>
            <div>
              <dt>Language</dt>
              <dd><strong>Academic English in context</strong><span>Vocabulary, collocations, and patterns</span></dd>
            </div>
          </dl>
          <Link className="text-link" href="/library">Explore the writing library <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <HomePracticePreview />
    </div>
  );
}
