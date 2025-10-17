import type { Metadata } from "next";

import { auth } from "@/auth";
import LandingPage from "@/components/home/LandingPage";
import { getUserPlan } from "@/lib/billing";

export const metadata: Metadata = {
  title: "ListologyAi Real Estate Marketing Platform",
  description:
    "Scale listing launches with ListologyAi's AI briefs, SEO copy, and collaboration tools built to help agents win more mandates.",
  keywords: [
    "ListologyAi real estate marketing",
    "AI property description generator",
    "MLS listing automation",
    "real estate content platform",
  ],
  openGraph: {
    title: "ListologyAi Real Estate Marketing Platform",
    description:
      "Activate AI-assisted workflows, compliance checks, and cross-channel content that help real estate teams close faster.",
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
    title: "ListologyAi Real Estate Marketing Platform",
    description:
      "Power every property launch with ListologyAi's AI prompts, SEO insights, and collaborative workspace.",
    images: ["/Logo.png"],
  },
};

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const plan = userId ? await getUserPlan(userId) : null;

  return <LandingPage currentPriceId={plan?.priceId ?? null} />;
}
