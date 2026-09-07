import type { Metadata } from "next";
import { COMPANY_NAME, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${SITE_NAME} handles practice data and visitor information.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="legal-page page-shell">
      <header className="page-heading">
        <h1>Privacy</h1>
        <p>Last updated 7 September 2026</p>
      </header>
      <div className="legal-prose">
        <section>
          <h2>The short version</h2>
          <p>
            {SITE_NAME} currently works without a required account. Your typing sessions, unfinished drafts,
            preferences, goals, and saved vocabulary stay in your browser rather than being uploaded to
            a {SITE_NAME} account database.
          </p>
        </section>
        <section>
          <h2>Information stored on your device</h2>
          <p>
            We use browser local storage to remember your practice history and settings. This information
            is specific to the browser and device you use. You can remove it by clearing this site&apos;s
            browser data, but doing so also removes your local progress.
          </p>
        </section>
        <section>
          <h2>Hosting and measurement</h2>
          <p>
            Our hosting provider may process standard request information, such as IP address, browser
            type, requested page, and timestamps, to deliver and secure the service. We also use
            cookie-free, anonymized site analytics and aggregated performance measurements to understand
            traffic and improve reliability. We do not use this information for advertising profiles.
          </p>
        </section>
        <section>
          <h2>Third-party services</h2>
          <p>
            The public website is delivered through Tencent Cloud services. We also use privacy-conscious
            performance and traffic measurement tools. Infrastructure providers may process standard request
            data under their own privacy and security terms.
          </p>
        </section>
        <section>
          <h2>Membership and payment information</h2>
          <p>
            When online membership purchasing opens, we will use the mobile number supplied at checkout to
            bind and recover membership access. Payment is processed by the selected payment provider. We do
            not receive or store your Alipay password, payment password, or complete bank-card details.
            Order identifiers, plan, amount, payment status and necessary contact information may be retained
            to deliver the service, handle refunds and meet legal or accounting requirements.
          </p>
        </section>
        <section>
          <h2>Accounts and future changes</h2>
          <p>
            Account-based cross-device sync is not active yet. We will update this notice before syncing
            typing history to an account and explain how existing local progress can be moved securely.
          </p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>
            Privacy questions can be sent to <a href="mailto:privacy@typeabroad.com">privacy@typeabroad.com</a>.
            The service provider is {COMPANY_NAME}.
          </p>
        </section>
      </div>
    </article>
  );
}
