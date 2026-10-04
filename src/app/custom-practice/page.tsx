import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomPracticeBuilder } from "@/components/CustomPracticeBuilder";

export const metadata: Metadata = {
  title: "Custom Practice",
  description: "Import your own English passage and practise it with TypeAbroad's typing engine.",
  alternates: { canonical: "/custom-practice" },
};

export default function CustomPracticePage() {
  return (
    <Suspense fallback={<div className="custom-practice-page page-shell" aria-busy="true" />}>
      <CustomPracticeBuilder />
    </Suspense>
  );
}
