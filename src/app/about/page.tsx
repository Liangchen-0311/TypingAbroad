import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "About", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <article className="about-page page-shell">
      <header className="page-heading"><h1>Typing is the exercise. Better English is the outcome.</h1></header>
      <div className="about-prose">
        <p>{SITE_NAME} is built for students preparing to study in English. It combines the focus of a minimal typing test with original IELTS, TOEFL, and academic passages.</p>
        <p>Random words can train finger speed. Complete arguments train something more useful: the rhythm of academic sentences, the vocabulary that connects ideas, and the punctuation that makes complex writing readable.</p>
        <p>The first version stays intentionally narrow. Practice works without an account, results remain on your device, and every completed passage opens a short learning layer. Account sync and AI explanations belong to a later phase; the keyboard experience comes first.</p>
        <Link className="primary-button" href="/practice">Start a passage <ArrowRight aria-hidden="true" /></Link>
      </div>
    </article>
  );
}
