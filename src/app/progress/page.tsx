import type { Metadata } from "next";
import { ProgressDashboard } from "@/components/ProgressDashboard";

export const metadata: Metadata = { title: "Progress", alternates: { canonical: "/progress" } };

export default function ProgressPage() {
  return (
    <div className="progress-page page-shell">
      <header className="page-heading">
        <h1>Progress</h1>
        <p>
          Your essay and word-practice progress, stored locally on this device.
          <span className="progress-wpm-note"><abbr title="Words per minute">WPM</abbr> means words per minute—the number of words typed in one minute.</span>
        </p>
      </header>
      <ProgressDashboard />
    </div>
  );
}
