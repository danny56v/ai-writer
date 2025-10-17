import type { Metadata } from "next";

import { auth } from "@/auth";
import Pricing from "@/components/Pricing";
import { getUserPlan } from "@/lib/billing";
import React from "react";

export const metadata: Metadata = {
  title: "ListologyAi Pricing & Plans",
  description:
    "Compare ListologyAi pricing to scale AI listing generation, team seats, and compliance guardrails across your real estate brand.",
  keywords: [
    "ListologyAi pricing",
    "real estate AI plans",
    "property description software cost",
    "AI listing generator subscription",
  ],
  openGraph: {
    title: "ListologyAi Pricing & Plans",
    description:
      "Choose transparent ListologyAi plans with flexible usage limits, collaboration seats, and upgrade-ready billing for your brokerage.",
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
    title: "ListologyAi Pricing & Plans",
    description:
      "Unlock AI-powered listing copy, analytics, and workflow automation on the ListologyAi tier built for your team.",
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
