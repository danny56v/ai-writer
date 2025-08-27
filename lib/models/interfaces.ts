export interface Subscription {
  _id?: string;
  userId: User["_id"];
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: "free" | "trialing" | "active" | "past_due" | "canceled" | "incomplete" | "incomplete_expired" | "unpaid";
  planType: "free" | "pro_monthly" | "pro_yearly" | "unlimited_monthly" | "unlimited_yearly";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  email: string;
  name?: string;
  image?: string;
  stripeCustomerId?: string; // opțional până la primul checkout
  createdAt: Date;
  updatedAt: Date;
}

export interface Usage {
  _id?: string;
  userId: User["_id"];
  year: number;   // ex: 2025
  month: number;  // 0-11
  articles: number;
  words?: number;
  tokensIn?: number;
  tokensOut?: number;
  createdAt: Date;
  updatedAt: Date;
}
