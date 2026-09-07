import type { Metadata } from "next";
import { COMPANY_NAME, SITE_NAME } from "@/lib/constants";

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
        <p>Last updated 7 September 2026</p>
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
          <h2>Free and member access</h2>
          <p>
            Free access may include selected essays, word categories, mistake review and recent progress.
            Paid membership unlocks the features shown on the Membership page for the stated service period.
            We may improve or reorganize individual learning materials while preserving the overall nature of
            the purchased service.
          </p>
        </section>
        <section>
          <h2>Prices and payment</h2>
          <p>
            The checkout page shows the current price, original reference price where applicable, membership
            period and total before payment. Paid plans are one-time purchases and do not renew automatically.
            Membership is activated only after our server receives and verifies the payment result. A browser
            redirect or payment screenshot alone does not establish payment.
          </p>
        </section>
        <section>
          <h2>Refunds</h2>
          <p>
            Digital membership refund eligibility is described in our <a href="/refund">Refund Policy</a>.
            Nothing in these terms limits rights that cannot be excluded under applicable law.
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
            The service provider is {COMPANY_NAME}.
          </p>
        </section>
      </div>
    </article>
  );
}
