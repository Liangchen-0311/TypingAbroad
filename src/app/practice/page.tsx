import type { Metadata } from "next";
import { PracticeShell } from "@/components/PracticeShell";

export const metadata: Metadata = { title: "Practice", alternates: { canonical: "/practice" } };

export default async function PracticePage({ searchParams }: { searchParams: Promise<{ article?: string }> }) {
  const params = await searchParams;
  return <PracticeShell initialArticleId={params.article} />;
}
