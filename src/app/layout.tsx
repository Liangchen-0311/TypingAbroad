import type { Metadata } from "next";
import { Geist, IBM_Plex_Sans, Roboto_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { MembershipProvider } from "@/components/MembershipProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
  weight: ["400", "600", "700"],
});
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: `${SITE_NAME} — English typing practice`, template: `%s · ${SITE_NAME}` },
  description: "Build typing fluency with high-scoring IELTS and TOEFL model essays.",
  keywords: ["IELTS typing", "TOEFL writing", "English typing practice", "academic English"],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — English typing practice`,
    description: SITE_TAGLINE,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — English typing practice`,
    description: SITE_TAGLINE,
  },
  category: "education",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geist.variable} ${plex.variable} ${robotoMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <MembershipProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Analytics />
            <SpeedInsights sampleRate={0.5} />
          </MembershipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
