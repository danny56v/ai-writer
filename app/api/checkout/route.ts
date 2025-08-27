// /app/api/checkout/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import type Stripe from "stripe";
import { ObjectId } from "mongodb";
import { PRICE_TO_PLAN } from "@/lib/plans";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id) return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });

    const { priceId } = await request.json();
    if (typeof priceId !== "string" || !priceId.trim())
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    if (!Object.keys(PRICE_TO_PLAN).includes(priceId))
      return NextResponse.json({ error: "Unknown priceId" }, { status: 400 });

    if (!user.email || typeof user.email !== "string")
      return NextResponse.json({ error: "User email is required" }, { status: 400 });

    const BASE_URL =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";

    const d = await db();
    const dbUser = await d.collection("users").findOne({ _id: new ObjectId(user.id) });

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/pricing`,
      metadata: { userId: user.id },
      payment_method_collection: "always",
      allow_promotion_codes: true,
    };

    if (dbUser?.stripeCustomerId) params.customer = dbUser.stripeCustomerId;
    else params.customer_email = user.email;

    const checkoutSession = await stripe.checkout.sessions.create(params, {
      idempotencyKey: `${user.id}:${priceId}:${Date.now()}`,
    });

    if (!checkoutSession.url)
      return NextResponse.json({ error: "No checkout URL returned" }, { status: 500 });

    console.log("Checkout session created:", {
      userId: user.id,
      email: user.email,
      priceId,
      customerId: dbUser?.stripeCustomerId ?? "new via email",
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error in checkout route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
