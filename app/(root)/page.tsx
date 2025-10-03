import type { Metadata } from "next";

import LandingPage from "@/components/home/LandingPage";

export const metadata: Metadata = {
  title: "AI real estate listing generator & marketing workspace",
  description:
    "Power every property launch with guided briefs, compliant AI descriptions, and collaboration tools built for modern real estate teams.",
  openGraph: {
    title: "AI real estate listing generator & marketing workspace",
    description:
      "HomeListerAi helps agents and marketers create MLS-ready listings, long-form content, and campaigns in minutes.",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 800,
        alt: "HomeListerAi brand mark",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI real estate listing generator & marketing workspace",
    description:
      "Guided briefs, AI drafting, and usage analytics keep every listing on-brand and compliant.",
    images: ["/Logo.png"],
  },
};

export default function Home() {
  return <LandingPage />;
}
