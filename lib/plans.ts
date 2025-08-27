// /lib/plans.ts
export type PlanKey = "free" | "pro_monthly" | "pro_yearly" | "unlimited_monthly" | "unlimited_yearly";

export const PLAN_LIMITS = {
  free: { articlesPerMonth: 3, maxWordsPerArticle: 1000 },
  pro_monthly: { articlesPerMonth: 50, maxWordsPerArticle: 6000 },
  pro_yearly: { articlesPerMonth: 50, maxWordsPerArticle: 6000 },
  unlimited_monthly: { articlesPerMonth: 9999, maxWordsPerArticle: 6000 },
  unlimited_yearly: { articlesPerMonth: 9999, maxWordsPerArticle: 6000 },
} as const;

// map priceId → plan; tipat cu `satisfies` ca să nu ajungi la `any`
export const PRICE_TO_PLAN = {
  price_1RtQX7RsRyFq7mSBngUAWcHC: "pro_monthly",
  price_1RtQX7RsRyFq7mSBLWuC9ddx: "pro_yearly",
  price_1RtRzkRsRyFq7mSBXQBHBd5G: "unlimited_monthly",
  price_1RtS0RRsRyFq7mSB1Orea73q: "unlimited_yearly",
} as const satisfies Record<string, Exclude<PlanKey, "free">>;

// helper sigur la tipuri (fără `as any`)
export function planFromPrice(priceId: string): PlanKey {
  // convertim mapping-ul în Record pentru indexare cu string
  return (PRICE_TO_PLAN as Record<string, PlanKey>)[priceId] ?? "free";
}
