import type { Metadata } from "next";
import { ProgressDashboard } from "@/components/ProgressDashboard";

export const metadata: Metadata = { title: "Progress", alternates: { canonical: "/progress" } };

export default function ProgressPage() {
  return (
    <div className="progress-page page-shell">
      <header className="page-heading"><h1>Progress</h1><p>Your article and word-practice progress, stored locally on this device.</p></header>
      <ProgressDashboard />
    </div>
  );
}
