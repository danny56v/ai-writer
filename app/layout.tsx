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
  description: "A modern AI-powered workspace for crafting articles, marketing copy and property listings with style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col text-slate-900`}
      >
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-x-0 top-[-10%] h-[32rem] bg-gradient-to-b from-purple-300/40 via-transparent to-transparent blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute left-[-15%] top-1/3 h-72 w-72 rounded-full bg-fuchsia-300/30 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute right-[-10%] bottom-[-5%] h-80 w-80 rounded-full bg-sky-300/25 blur-3xl"
            aria-hidden="true"
          />
        </div>
        <div className="relative flex min-h-screen flex-col">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-full max-w-6xl opacity-60">
            <div className="absolute inset-0 rounded-[3rem] bg-white/40 blur-3xl" aria-hidden="true" />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
