// /app/api/billing/portal/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ObjectId } from "mongodb";

export async function POST() {
  // 1) Ensure the user is authenticated
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Load the user from the DB to retrieve their Stripe customer id
  const d = await db();
  const dbUser = await d.collection("users").findOne({ _id: new ObjectId(user.id) });
  if (!dbUser?.stripeCustomerId) {
    return NextResponse.json({ error: "No Stripe customer for user" }, { status: 404 });
  }

  // 3) Determine the return URL back into the app
  const BASE_URL =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";

  // 4) Create the customer portal session
  const portal = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${BASE_URL}/profile#plan`,
  });

  // 5) Return the portal URL to the client
  return NextResponse.json({ url: portal.url });
}
