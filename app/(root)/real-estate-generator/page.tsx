import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ObjectId } from "mongodb";

import { auth } from "@/auth";
import RealEstateClient from "@/components/realEstate/RealEstateClient";
import { getUserPlan } from "@/lib/billing";
import { db } from "@/lib/db";
import type { PlanKey } from "@/lib/plans";
import { getRealEstateHistory } from "@/lib/realEstateHistory";

export const metadata: Metadata = {
  title: "ListologyAi Real Estate Listing Generator",
  description:
    "Generate SEO-ready MLS listings with ListologyAi's AI prompts, local insights, and compliance guardrails that convert buyers faster.",
  keywords: [
    "ListologyAi listing generator",
    "AI real estate descriptions",
    "MLS copy automation",
    "property marketing AI tool",
    "real estate SEO copywriter",
  ],
  openGraph: {
    title: "ListologyAi Real Estate Listing Generator",
    description:
      "Deliver persuasive, compliant property copy in minutes with ListologyAi's guided workflows, tone controls, and collaboration tools.",
    url: "https://listologyai.com/real-estate-generator",
    type: "website",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 800,
        alt: "ListologyAi real estate generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ListologyAi Real Estate Listing Generator",
    description:
      "Craft MLS-optimized listing descriptions with ListologyAi's AI prompts, market data, and compliance reminders.",
    images: ["/Logo.png"],
  },
};

const RealEstateGeneratorPage = async () => {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  if (!userId) {
    redirect("/sign-in?callbackUrl=/real-estate-generator");
  }

  const defaultPlan = { planType: "free", currentPeriodEnd: null, status: "free" } as const;
  const userPlan = userId ? await getUserPlan(userId) : defaultPlan;
  const history = userId ? await getRealEstateHistory(userId, 20) : [];

  const REAL_ESTATE_LIMITS: Record<PlanKey, number | null> = {
    free: 1,
    pro_monthly: 50,
    pro_yearly: 50,
    unlimited_monthly: 1500,
    unlimited_yearly: 1500,
  };

  const planLimit = REAL_ESTATE_LIMITS[userPlan.planType as PlanKey] ?? null;
  let usageSummary = {
    limit: planLimit,
    remaining: planLimit === null ? null : planLimit,
    used: planLimit === null ? null : 0,
  };

  if (userId) {
    try {
      const database = await db();
      type UsageDoc = {
        usage?: {
          realEstate?: {
            planType?: string;
            limit?: number | null;
            used?: number | null;
          };
        };
      };
      const usersCollection = database.collection<UsageDoc>("users");
      const usageDoc = await usersCollection.findOne(
        { _id: new ObjectId(userId) },
        { projection: { "usage.realEstate": 1 } }
      );

      const realEstateUsage = usageDoc?.usage?.realEstate;
      const usageMatchesPlan = realEstateUsage?.planType === userPlan.planType;
      const usedGenerations = usageMatchesPlan && typeof realEstateUsage?.used === "number" ? realEstateUsage.used : 0;
      const remainingGenerations = planLimit === null ? null : Math.max(planLimit - usedGenerations, 0);

      usageSummary = {
        limit: planLimit,
        remaining: remainingGenerations,
        used: usedGenerations,
      };
    } catch (error) {
      console.error("Failed to load real estate usage", error);
    }
  }

  return (
    <RealEstateClient
      userPlan={userPlan}
      usageSummary={usageSummary}
      isAuthenticated={Boolean(userId)}
      initialHistory={history}
    />
  );
};

export default RealEstateGeneratorPage;
