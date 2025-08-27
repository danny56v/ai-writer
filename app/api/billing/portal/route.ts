// /app/api/billing/portal/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ObjectId } from "mongodb";

export async function POST() {
  // 1) Autentificare
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Citește userul din DB ca să obții stripeCustomerId
  const d = await db();
  const dbUser = await d.collection("users").findOne({ _id: new ObjectId(user.id) });
  if (!dbUser?.stripeCustomerId) {
    return NextResponse.json({ error: "No Stripe customer for user" }, { status: 404 });
  }

  // 3) Return URL (înapoi în aplicație)
  const BASE_URL =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";

  // 4) Creează sesiunea de portal
  const portal = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${BASE_URL}/billing`,
  });

  // 5) Trimite URL-ul de portal către client
  return NextResponse.json({ url: portal.url });
}
