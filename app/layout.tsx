import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { siteUrl, indexable } from "@/lib/site";
import { BRAND } from "@/lib/brand";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabs from "@/components/BottomTabs";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
});
const cond = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  robots: indexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
  title: {
    default: `${BRAND.name} · ${BRAND.tagline}`,
    template: `%s · ${BRAND.name}`,
  },
  description: `${BRAND.tagline} Fan-run, no ads. Not affiliated with the ISL or any club.`,
};
export const viewport: Viewport = {
  themeColor: "#102632",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={`${barlow.variable} ${cond.variable}`}>
      <body className="font-sans min-h-screen pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <div id="main-content" tabIndex={-1} />
        {children}
        <Footer />
        <BottomTabs />
      </body>
    </html>
  );
}
