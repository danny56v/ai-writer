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

export interface InvoiceItem {
  id: string;
  description: string | null;
  amount: number;
  currency: string;
  periodStart?: Date | null;
  periodEnd?: Date | null;
  metadata?: Record<string, string | number | null>;
}

export interface Invoice {
  id: string;
  status: "draft" | "open" | "paid" | "uncollectible" | "void";
  amountDue: number;
  amountPaid: number;
  currency: string;
  created: Date;
  hostedInvoiceUrl?: string | null;
  pdfUrl?: string | null;
  periodStart?: Date | null;
  periodEnd?: Date | null;
  total: number;
  subtotal: number;
  items: InvoiceItem[];
  metadata?: Record<string, string | number | null>;
}

export interface User {
  _id: ObjectId;
  email: string;
  name?: string;
  image?: string;
  stripeCustomerId?: string; // optional until the first checkout completes
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
  entitlements: ToolEntitlement[]; // which plans can use this tool
  createdAt: Date;
  updatedAt: Date;
}

export interface ToolEntitlement {
  toolId: ObjectId | string;
  planType: PlanKey; // "free" e permis aici
  freeUnitsPerMonth: number; // e.g. 3 articles per month
  maxWordsPerArticle?: number; // optional, e.g. 1500 words per article
}
