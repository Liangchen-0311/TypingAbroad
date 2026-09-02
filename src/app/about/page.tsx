import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AboutWritingVisual } from "@/components/AboutWritingVisual";

export const metadata: Metadata = { title: "About Us", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <article className="about-page page-shell">
      <header className="about-marquee">
        <h1>
          <span className="about-marquee__title">About Us</span>
          <span className="about-marquee__statement">Make typing disappear into the writing.</span>
        </h1>
      </header>

      <section className="about-intro">
        <div className="about-intro__copy">
          <p className="about-intro__lede">Many students learn to write English long before they learn to type it.</p>
          <p>They may have the ideas, vocabulary, and writing skills—but slow typing can make it harder to express them under the time pressure of computer-based exams like the TOEFL and IELTS.</p>
        </div>
        <AboutWritingVisual />
      </section>

      <p className="about-thesis"><strong>Typing speed doesn’t make you a better writer. But slow typing can limit what you can write.</strong></p>

      <section className="about-story">
        <header className="about-story__heading">
          <h2>Why TypeAbroad exists</h2>
        </header>
        <div className="about-story__body">
          <p>TypeAbroad turns real English writing into typing practice.</p>
          <p>Practice with TOEFL and IELTS writing samples, build familiarity with useful vocabulary and expressions, or bring your own passages.</p>
          <p>The goal isn’t simply to type faster.</p>
          <p className="about-story__closing"><strong>It’s to make typing disappear into the writing.</strong></p>
          <Link className="text-link" href="/practice">Start a passage <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </article>
  );
}
