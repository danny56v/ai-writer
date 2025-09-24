import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Aurora AI Studio",
  description:
    "A modern AI-powered workspace for crafting articles, marketing copy and property listings with a ClickUp-inspired experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col text-[color:var(--foreground)]`}
      >
        <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
          <div
            className="absolute inset-x-1/4 top-[-18rem] h-[32rem] rounded-full bg-gradient-to-br from-[#fce2ff] via-white to-transparent blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -left-40 top-[16rem] h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-[#bd9cff]/50 via-[#ff78d2]/40 to-transparent blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -right-48 bottom-[-6rem] h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-[#ffd27f]/60 via-[#ffa6e8]/40 to-transparent blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_15%,rgba(255,255,255,0.55),transparent_70%)]"
            aria-hidden="true"
          />
        </div>
        <div className="relative flex min-h-screen flex-col">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto flex h-full w-full max-w-6xl justify-center opacity-70">
            <div className="h-full w-full rounded-[3.5rem] bg-white/55 shadow-[0_45px_120px_-60px_rgba(90,33,208,0.25)] backdrop-blur-3xl" aria-hidden="true" />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
