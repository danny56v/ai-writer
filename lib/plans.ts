// /lib/plans.ts
export type PlanKey = "free" | "pro_monthly" | "pro_yearly" | "unlimited_monthly" | "unlimited_yearly";

export const PLAN_LIMITS = {
  free: { articlesPerMonth: 3, maxWordsPerArticle: 500 },
  pro_monthly: { articlesPerMonth: 50, maxWordsPerArticle: 1500 },
  pro_yearly: { articlesPerMonth: 50, maxWordsPerArticle: 1500 },
  unlimited_monthly: { articlesPerMonth: 9999, maxWordsPerArticle: 1500 },
  unlimited_yearly: { articlesPerMonth: 9999, maxWordsPerArticle: 1500 },
} as const;

// Map Stripe price IDs to internal plan keys
export const PRICE_TO_PLAN = {
  price_1RtQX7RsRyFq7mSBngUAWcHC: "pro_monthly",
  price_1RtQX7RsRyFq7mSBLWuC9ddx: "pro_yearly",
  price_1RtRzkRsRyFq7mSBXQBHBd5G: "unlimited_monthly",
  price_1RtS0RRsRyFq7mSB1Orea73q: "unlimited_yearly",
} as const satisfies Record<string, Exclude<PlanKey, "free">>;

// Type-safe helper when converting from price id to plan key
export function planFromPrice(priceId: string): PlanKey {
  // convert mapping into a Record for string-based indexing
  return (PRICE_TO_PLAN as Record<string, PlanKey>)[priceId] ?? "free";
}
