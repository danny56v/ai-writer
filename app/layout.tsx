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
  metadataBase: new URL("https://www.listologyai.com"),
  title: {
    default: "ListologyAi | Real Estate AI Generator",
    template: "%s | ListologyAi",
  },
  description:
    "ListologyAi centralizes briefs, brand voice, and AI assistants so real estate teams launch listings and campaigns faster with compliance built in.",
  keywords: [
    "real estate ai",
    "listing generator",
    "ai copywriting",
    "property marketing platform",
    "ListologyAi",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ListologyAi",
    url: "https://www.listologyai.com",
    title: "ListologyAi | Responsible AI copy for real estate teams",
    description:
      "Launch MLS-ready listings, newsletters, and campaigns in minutes. ListologyAi unites briefs, workflows, and compliance-friendly AI drafting in one workspace.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ListologyAi | Responsible AI copy for real estate teams",
    description:
      "Accelerate real estate marketing with guided briefs, AI-assisted drafts, and analytics that prove ROI.",
  },
  alternates: {
    canonical: "https://www.listologyai.com",
  },
  icons: {
    icon: "/public/Logo.png",
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
