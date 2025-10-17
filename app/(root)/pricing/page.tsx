import type { Metadata } from "next";

import { auth } from "@/auth";
import Pricing from "@/components/Pricing";
import { getUserPlan } from "@/lib/billing";
import React from "react";

export const metadata: Metadata = {
  title: "ListologyAi Pricing for Real Estate Agents",
  description:
    "Review ListologyAi plans to generate more MLS-ready property descriptions with AI assistance tailored to individual real estate agents.",
  keywords: [
    "ListologyAi pricing",
    "real estate AI plans",
    "property description software cost",
    "AI listing generator subscription",
  ],
  openGraph: {
    title: "ListologyAi Pricing for Real Estate Agents",
    description:
      "Choose the ListologyAi plan that helps you produce polished listing descriptions faster, from free trials to unlimited agent usage.",
    url: "https://listologyai.com/pricing",
    type: "website",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 800,
        alt: "ListologyAi pricing overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ListologyAi Pricing for Real Estate Agents",
    description:
      "Unlock AI-powered listing copy support on the ListologyAi plan that matches your real estate business volume.",
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
