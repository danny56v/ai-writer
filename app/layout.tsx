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
  metadataBase: new URL("https://listologyai.com"),
  title: {
    default: "ListologyAi | Address-to-description real estate AI",
    template: "%s | ListologyAi",
  },
  description:
    "Paste any property address and ListologyAi returns an MLS-ready description with Street View context, brand voice, and compliance baked in.",
  keywords: [
    "address to description",
    "real estate ai",
    "listing generator",
    "ai copywriting",
    "property address description",
    "ListologyAi",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ListologyAi",
    url: "https://listologyai.com",
    title: "ListologyAi | Enter an address, get a listing description",
    description:
      "Drop an address into ListologyAi and instantly get a persuasive, compliant property story tuned for your market.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ListologyAi | Enter an address, get a listing description",
    description:
      "Introduce doar adresa si primesti o descriere completa: ListologyAi livreaza text MLS-ready in cateva secunde.",
  },
  alternates: {
    canonical: "https://listologyai.com",
  },
  icons: {
    icon: "/Logo.png",
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
