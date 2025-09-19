import { ObjectId } from "mongodb";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"
  | "paused"
  | "inactive"
  | "free";

export type PlanKey = "free" | "pro_monthly" | "pro_yearly" | "unlimited_monthly" | "unlimited_yearly";

export type UnitType = "articles" | "words" | "tokens_in" | "tokens_out";

export interface Subscription {
  _id?: ObjectId;
  userId: ObjectId | string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: SubscriptionStatus;
  planType: PlanKey;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: ObjectId;
  email: string;
  name?: string;
  image?: string;
  stripeCustomerId?: string; // opțional până la primul checkout
  createdAt: Date;
  updatedAt: Date;
}

export interface Usage {
  _id?: ObjectId;
  userId: ObjectId | string;

  year: number; // ex: 2025
  month: number; // 0-11
  articles: number;
  words?: number;
  tokensIn?: number;
  tokensOut?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tool {
  _id: ObjectId;
  name: string;
  descriptiom?: string;
  unitType: UnitType;
  entitlements: ToolEntitlement[]; // ce planuri au acces la tool-ul ăsta
  createdAt: Date;
  updatedAt: Date;
}

export interface ToolEntitlement {
  toolId: ObjectId | string;
  planType: PlanKey; // "free" e permis aici
  freeUnitsPerMonth: number; // ex: 3 articole/lună
  maxWordsPerArticle?: number; // opțional, ex: 1500 cuvinte/articol
}
