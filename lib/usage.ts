// /lib/usage.ts
import { db } from "@/lib/db";
import { PLAN_LIMITS, PlanKey, planFromPrice } from "@/lib/plans";


/** Citește planul curent (sau "free") */
export async function getUserPlan(userId: string): Promise<{ planType: PlanKey; currentPeriodEnd?: Date | null }> {
  const d = await db();
  const now = new Date();
  const sub = await d.collection("subscriptions").findOne({
    userId,
    status: { $in: ["trialing","active","past_due"] },
    currentPeriodEnd: { $gt: now },
  });
  const planType: PlanKey = sub?.planType ?? (sub?.stripePriceId ? planFromPrice(sub.stripePriceId) : "free");
  return { planType, currentPeriodEnd: sub?.currentPeriodEnd ?? null };
}

/** Cheia lunii curente */
function ym(d = new Date()) { return { year: d.getFullYear(), month: d.getMonth() }; }

/** Citește usage-ul pe luna curentă (fallback 0) */
export async function getMonthlyUsage(userId: string) {
  const d = await db();
  const { year, month } = ym();
  const doc = await d.collection("usage_monthly").findOne({ userId, year, month });
  return doc ?? { userId, year, month, articles: 0, words: 0 };
}

/** Verifică limitele înainte de generare */
export async function canGenerate(userId: string, requestedWords = 1200) {
  const { planType } = await getUserPlan(userId);
  const limits = PLAN_LIMITS[planType];
  const usage = await getMonthlyUsage(userId);

  // dacă ai și limită pe cuvinte/articol, o verifici aici (ex: limits.maxWordsPerArticle)
  if ("maxWordsPerArticle" in limits && limits.maxWordsPerArticle! < requestedWords) {
    return { ok: false as const, reason: `Limita de ${limits.maxWordsPerArticle} cuvinte/articol` };
  }
  if (usage.articles >= limits.articlesPerMonth) {
    return { ok: false as const, reason: `Ai atins ${limits.articlesPerMonth} articole/lună` };
  }
  return {
    ok: true as const,
    planType,
    remainingArticles: limits.articlesPerMonth - usage.articles,
  };
}

/** Increment atomic la succes (NU incrementa pe failure) */
export async function incUsage(userId: string, words: number) {
  const d = await db();
  const { year, month } = ym();
  const now = new Date();
  await d.collection("usage_monthly").updateOne(
    { userId, year, month },
    {
      $setOnInsert: { createdAt: now, articles: 0, words: 0 },
      $inc: { articles: 1, words },
      $set: { updatedAt: now },
    },
    { upsert: true }
  );
}
