// minimal, driver Mongo
import { db } from "@/lib/db";

import { PlanKey, SubscriptionStatus } from "./models/interfaces";

export async function getEffectivePlan(userId: string): Promise<{
  planType: PlanKey;
  currentPeriodEnd: Date | null;
}> {
  const d = await db();
  const now = new Date();
  const sub = await d.collection("subscriptions").findOne(
    {
      userId,
      status: { $in: ["trialing", "active", "past_due"] },
      currentPeriodEnd: { $gt: now },
    },
    { projection: { planType: 1, currentPeriodEnd: 1 } }
  );

  return {
    planType: (sub?.planType as PlanKey) ?? "free",
    currentPeriodEnd: sub?.currentPeriodEnd ?? null,
  };
}

export async function getUserPlan(
  userId: string
): Promise<{ planType: PlanKey; currentPeriodEnd: Date | null; status: SubscriptionStatus; priceId: string | null }> {
  const d = await db();
  const plan = await d
    .collection("subscriptions")
    .findOne({ userId }, { projection: { planType: 1, currentPeriodEnd: 1, status: 1, priceId: 1, stripePriceId: 1 } });
  console.log("User Plan from DB:", plan);
  const resolvedPriceId = (plan?.priceId as string | undefined) ?? (plan?.stripePriceId as string | undefined) ?? null;
  return plan
    ? {
        planType: plan.planType as PlanKey,
        currentPeriodEnd: plan.currentPeriodEnd,
        status: plan.status as SubscriptionStatus,
        priceId: resolvedPriceId,
      }
    : {
        planType: "free",
        currentPeriodEnd: null,
        status: "free" as SubscriptionStatus,
        priceId: null,
      };
}

export async function getUserPriceId(userId: string) {
  const d = await db();
  const subscription = await d
    .collection("subscriptions")
    .findOne({ userId }, { projection: { priceId: 1, stripePriceId: 1 } });
  return (subscription?.priceId as string | undefined) ?? (subscription?.stripePriceId as string | undefined) ?? null;
}
