import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

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
        <p>Last updated 25 August 2026</p>
      </header>
      <div className="legal-prose">
        <section>
          <h2>The short version</h2>
          <p>
            {SITE_NAME} currently works without an account. Your typing sessions, unfinished drafts,
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
            The public website is hosted by Vercel. Its processing of infrastructure and analytics data
            is governed by Vercel&apos;s own privacy and security terms.
          </p>
        </section>
        <section>
          <h2>Accounts and future changes</h2>
          <p>
            Account registration and cross-device sync are not active. If we add them, we will update this
            notice before collecting account details and explain how existing local progress can be moved
            into an account.
          </p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>
            Privacy questions can be sent to <a href="mailto:privacy@typeabroad.com">privacy@typeabroad.com</a>.
          </p>
        </section>
      </div>
    </article>
  );
}
