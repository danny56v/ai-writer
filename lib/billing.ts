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
): Promise<{ planType: PlanKey; currentPeriodEnd: Date | null; status: SubscriptionStatus }> {
  const d = await db();
  const plan = await d
    .collection("subscriptions")
    .findOne({ userId }, { projection: { planType: 1, currentPeriodEnd: 1, status: 1 } });
  console.log("User Plan from DB:", plan);
  return plan
    ? {
        planType: plan.planType as PlanKey,
        currentPeriodEnd: plan.currentPeriodEnd,
        status: plan.status as SubscriptionStatus,
      }
    : {
        planType: "free",
        currentPeriodEnd: null,
        status: "free" as SubscriptionStatus,
      };
}

export async function getUserPriceId(userId: string) {
  const d = await db();
  const subscription = await d.collection("subscriptions").findOne({ userId }, { projection: { priceId: 1 } });
  return subscription?.priceId || null;
}
