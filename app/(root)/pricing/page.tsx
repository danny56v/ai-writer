import type { Metadata } from "next";

import { auth } from "@/auth";
import Pricing from "@/components/Pricing";
import { getUserPlan } from "@/lib/billing";
import React from "react";

export const metadata: Metadata = {
  title: "Pricing to turn addresses into MLS descriptions | ListologyAi",
  description:
    "Compare ListologyAi plans that let you drop a property address and receive a polished listing description in seconds—built for agents who want faster MLS copy.",
  keywords: ["ListologyAi pricing", "address to description", "real estate AI plans", "property description software cost", "AI listing generator subscription"],
  openGraph: {
    title: "Pricing to turn addresses into MLS descriptions | ListologyAi",
    description:
      "Pick the ListologyAi plan that converts property addresses into persuasive, compliant listing descriptions—whether you need a few per month or unlimited generations.",
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
    title: "Pricing to turn addresses into MLS descriptions | ListologyAi",
    description:
      "Choose how many times you want to paste an address and get a ready-to-publish property description with ListologyAi.",
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
