import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "About", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <article className="about-page page-shell">
      <header className="page-heading"><h1>Make typing disappear into the writing.</h1></header>
      <div className="about-prose">
        <p className="about-prose__lede">Many students learn to write English long before they learn to type it.</p>
        <p>They may have the ideas, vocabulary, and writing skills—but slow typing can make it harder to express them under the time pressure of computer-based exams like the TOEFL and IELTS.</p>
        <p><strong>Typing speed doesn’t make you a better writer. But slow typing can limit what you can write.</strong></p>

        <section>
          <h2>Why TypeAbroad exists</h2>
          <p>TypeAbroad turns real English writing into typing practice.</p>
          <p>Practice with TOEFL and IELTS writing samples, build familiarity with useful vocabulary and expressions, or bring your own passages.</p>
          <p>The goal isn’t simply to type faster.</p>
        </section>

        <p className="about-prose__closing"><strong>It’s to make typing disappear into the writing.</strong></p>
        <Link className="text-link" href="/practice">Start a passage <ArrowRight aria-hidden="true" /></Link>
      </div>
    </article>
  );
}
