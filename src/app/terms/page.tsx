import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms for using ${SITE_NAME}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <article className="legal-page page-shell">
      <header className="page-heading">
        <h1>Terms</h1>
        <p>Last updated 25 August 2026</p>
      </header>
      <div className="legal-prose">
        <section>
          <h2>Using the service</h2>
          <p>
            {SITE_NAME} is an educational typing-practice service. You may use it for personal learning
            and study. Do not interfere with the service, attempt unauthorized access, or use automated
            systems in a way that disrupts other visitors.
          </p>
        </section>
        <section>
          <h2>Practice content</h2>
          <p>
            The practice passages and learning materials are provided for general educational purposes.
            {SITE_NAME} is not affiliated with, endorsed by, or an official preparation service of IELTS,
            TOEFL, their operators, or any testing organization.
          </p>
        </section>
        <section>
          <h2>Your local data</h2>
          <p>
            The current version stores progress in your browser. You are responsible for retaining any
            information you need. Clearing site data, changing browser, or changing device may remove or
            make that progress unavailable.
          </p>
        </section>
        <section>
          <h2>Availability and results</h2>
          <p>
            We aim to keep the service reliable, but it is provided as available and may change or be
            interrupted. Typing statistics and learning suggestions are estimates and do not guarantee an
            examination score, admission decision, or other academic outcome.
          </p>
        </section>
        <section>
          <h2>Changes</h2>
          <p>
            We may update the service or these terms as the product develops. The date above will change
            when revised terms are published.
          </p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>
            Questions about these terms can be sent to <a href="mailto:hello@typeabroad.com">hello@typeabroad.com</a>.
          </p>
        </section>
      </div>
    </article>
  );
}
