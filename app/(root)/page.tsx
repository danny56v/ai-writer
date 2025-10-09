import type { Metadata } from "next";

import { auth } from "@/auth";
import LandingPage from "@/components/home/LandingPage";
import { getUserPlan } from "@/lib/billing";

export const metadata: Metadata = {
  title: "AI real estate listing generator & marketing workspace",
  description:
    "Power every property launch with guided briefs, compliant AI descriptions, and collaboration tools built for modern real estate teams.",
  openGraph: {
    title: "AI real estate listing generator & marketing workspace",
    description:
      "ListologyAi helps agents and marketers create MLS-ready listings, long-form content, and campaigns in minutes.",
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
    title: "AI real estate listing generator & marketing workspace",
    description:
      "Guided briefs, AI drafting, and usage analytics keep every listing on-brand and compliant.",
    images: ["/Logo.png"],
  },
};

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const plan = userId ? await getUserPlan(userId) : null;

  return <LandingPage currentPriceId={plan?.priceId ?? null} />;
}
