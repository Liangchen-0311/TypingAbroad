import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomePracticePreview } from "@/components/HomePracticePreview";
import { HomeProgressProof } from "@/components/HomeProgressProof";

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
            <h2>Practice the English high scores demand.</h2>
            <p>Build exam-ready typing fluency with model essays, academic vocabulary, and mistake review.</p>
          </div>

          <HomeProgressProof />

          <dl aria-label="Writing practice collection">
            <div>
              <dt>IELTS</dt>
              <dd><strong>High-scoring model essays</strong></dd>
            </div>
            <div>
              <dt>TOEFL</dt>
              <dd><strong>Discussion and email responses</strong></dd>
            </div>
            <div>
              <dt>Mistakes</dt>
              <dd><strong>Retype missed words in context</strong></dd>
            </div>
          </dl>
          <Link className="text-link" href="/library">Explore the essay library <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <HomePracticePreview />
    </div>
  );
}
