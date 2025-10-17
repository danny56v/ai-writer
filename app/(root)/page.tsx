import type { Metadata } from "next";

import { auth } from "@/auth";
import LandingPage from "@/components/home/LandingPage";
import { getUserPlan } from "@/lib/billing";

export const metadata: Metadata = {
  title: "ListologyAi Real Estate Description Generator",
  description:
    "Write MLS-ready property descriptions in minutes with ListologyAi, the AI assistant designed for real estate agents.",
  keywords: [
    "ListologyAi",
    "real estate description generator",
    "AI listings for agents",
    "MLS copy assistant",
  ],
  openGraph: {
    title: "ListologyAi Real Estate Description Generator",
    description:
      "Instantly transform property details into persuasive, compliant listing descriptions tailored for agents.",
    url: "https://listologyai.com",
    type: "website",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 800,
        alt: "ListologyAi brand mark",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ListologyAi Real Estate Description Generator",
    description:
      "Generate polished MLS descriptions and listing highlights faster with ListologyAi for real estate agents.",
    images: ["/Logo.png"],
  },
};

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const plan = userId ? await getUserPlan(userId) : null;

  return <LandingPage currentPriceId={plan?.priceId ?? null} />;
}
