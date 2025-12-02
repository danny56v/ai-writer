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
  title: "Enter a property address for an instant listing description | ListologyAi",
  description:
    "Paste any property address into ListologyAi and receive a persuasive, MLS-ready listing description informed by Street View context and agent voice.",
  keywords: ["ListologyAi listing generator", "address to description", "AI real estate descriptions", "MLS copy for agents", "property description software", "real estate listing generator"],
  openGraph: {
    title: "Enter a property address for an instant listing description | ListologyAi",
    description:
      "Drop an address and ListologyAi writes the full, compliant listing description in minutes with context from Street View.",
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
    title: "Enter a property address for an instant listing description | ListologyAi",
    description: "Introdu doar adresa si primesti o descriere MLS-ready in cateva secunde cu ListologyAi.",
    images: ["/Logo.png"],
  },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const buildCallbackUrl = (searchParams?: Record<string, string | string[] | undefined>) => {
  const search = new URLSearchParams();

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (typeof value === "undefined") return;
      if (Array.isArray(value)) {
        value.forEach((item) => search.append(key, item));
      } else {
        search.set(key, value);
      }
    });
  }

  const queryString = search.toString();
  return queryString ? `/real-estate-generator?${queryString}` : "/real-estate-generator";
};

const RealEstateGeneratorPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const session = await auth();
  const userId = session?.user?.id ?? null;

  if (!userId) {
    const callbackUrl = buildCallbackUrl(params);
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
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
