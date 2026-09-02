import type { Metadata } from "next";
import { LibraryBrowser } from "@/components/LibraryBrowser";

export const metadata: Metadata = { title: "Essay Library", alternates: { canonical: "/library" } };

export default function LibraryPage() {
  return (
    <div className="library-page page-shell">
      <header className="page-heading"><h1>Essay Library</h1><p>Original practice material written for accurate typing and useful academic English.</p></header>
      <LibraryBrowser />
    </div>
  );
}
