import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.homelisterai.com"),
  title: {
    default: "HomeListerAi | Responsible AI copy for real estate teams",
    template: "%s | HomeListerAi",
  },
  description:
    "HomeListerAi centralizes briefs, brand voice, and AI assistants so real estate teams launch listings and campaigns faster with compliance built in.",
  keywords: [
    "real estate ai",
    "listing generator",
    "ai copywriting",
    "property marketing platform",
    "HomeListerAi",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "HomeListerAi",
    url: "https://www.homelisterai.com",
    title: "HomeListerAi | Responsible AI copy for real estate teams",
    description:
      "Launch MLS-ready listings, newsletters, and campaigns in minutes. HomeListerAi unites briefs, workflows, and compliance-friendly AI drafting in one workspace.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HomeListerAi | Responsible AI copy for real estate teams",
    description:
      "Accelerate real estate marketing with guided briefs, AI-assisted drafts, and analytics that prove ROI.",
  },
  alternates: {
    canonical: "https://www.homelisterai.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
