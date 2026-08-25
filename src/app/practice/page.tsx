import type { Metadata } from "next";
import { Suspense } from "react";
import { PracticeShell } from "@/components/PracticeShell";

export const metadata: Metadata = { title: "Practice", alternates: { canonical: "/practice" } };

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="practice-page page-shell" aria-busy="true" />}>
      <PracticeShell />
    </Suspense>
  );
}
