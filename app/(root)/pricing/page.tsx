import type { Metadata } from "next";

import { auth } from "@/auth";
import Pricing from "@/components/Pricing";
import { getUserPlan } from "@/lib/billing";
import React from "react";

export const metadata: Metadata = {
  title: "Pricing plans for every real estate team",
  description:
    "Compare HomeListerAi plans, from free trials to unlimited production tiers, and choose the right mix of seats, credits, and compliance controls.",
  openGraph: {
    title: "Pricing plans for every real estate team",
    description:
      "Transparent pricing that scales with your marketing workflow. Review plan limits, billing cadence, and upgrade paths for HomeListerAi.",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 800,
        alt: "HomeListerAi pricing overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing plans for every real estate team",
    description:
      "Unlock collaboration, AI drafting, and analytics with the HomeListerAi plan that fits your brokerage or marketing crew.",
    images: ["/Logo.png"],
  },
};

const PricingPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const plan = userId ? await getUserPlan(userId) : null;

  return (
    <>
    <div className="mt-28">
      <Pricing currentPriceId={plan?.priceId ?? null} />
      </div>
    </>
  );
};

export default PricingPage;
