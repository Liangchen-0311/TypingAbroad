import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomePracticePreview } from "@/components/HomePracticePreview";

export default function HomePage() {
  return (
    <div className="home-page page-shell">
      <section className="home-hero">
        <div className="home-hero__copy">
          <h1>
            <span>Type faster.</span>
            <span>Write better.</span>
          </h1>

          <div className="home-hero__support">
            <p>Type through <strong>high-scoring IELTS and TOEFL model essays</strong>—not random words or generic quotes.</p>
            <Link className="primary-button home-hero__cta" href="/practice">
              Start typing <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <HomePracticePreview />
    </div>
  );
}
