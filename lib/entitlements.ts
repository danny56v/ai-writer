import { db } from "@/lib/db";
import { getEffectivePlan } from "./billing";

export async function getUserEntitlementForTool(userId: string, toolKey: string) {
  const d = await db();
  const { planType, currentPeriodEnd } = await getEffectivePlan(userId);
  const tool = await d.collection("tools").findOne(
    { key: toolKey },
    { projection: { entitlements: 1, unit: 1, defaultWindow: 1, defaultPerRequestCap: 1 } }
  );
  const ent = tool?.entitlements?.[planType] ?? { allowed: false };
  return {
    planType,
    currentPeriodEnd,
    allowed: !!ent.allowed,
    limit: ent.limit as number | undefined,
    window: (ent.window ?? tool?.defaultWindow) as "day" | "month" | "lifetime" | undefined,
    unit: tool?.unit as string | undefined,
    perRequestCap: (ent.perRequestCap ?? tool?.defaultPerRequestCap) as number | undefined,
  };
}
