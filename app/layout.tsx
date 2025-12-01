import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { headers } from "next/headers";
import "./globals.css";

const appSans = Inter({
  variable: "--font-app-sans",
  subsets: ["latin"],
  display: "swap",
});

const appMono = JetBrains_Mono({
  variable: "--font-app-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.listologyai.com"),
  title: {
    default: "ListologyAi | Real Estate AI Generator",
    template: "%s | ListologyAi",
  },
  description:
    "ListologyAi centralizes briefs, brand voice, and AI assistants so real estate teams launch listings and campaigns faster with compliance built in.",
  keywords: ["real estate ai", "listing generator", "ai copywriting", "property marketing platform", "ListologyAi"],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const nextUrl = headerList.get("x-pathname") || headerList.get("next-url") || "/";
  const isRealEstateGenerator = nextUrl.startsWith("/real-estate-generator");

  return (
    <html lang="en" className={`${appSans.variable} ${appMono.variable} h-full`}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-white overflow-x-hidden">
        <div
          className={
            isRealEstateGenerator
              ? "flex-1 w-full" // full width, no centering
              : "flex-1 flex w-full justify-center px-4 sm:px-6 lg:px-8 overflow-x-hidden"
          }
        >
          {/* <div
    className={
      isRealEstateGenerator
        ? "w-full"       // full width content
        : "w-full max-w-7xl flex flex-col"
    }
  > */}
          {children}
        </div>
        {/* </div> */}

        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
