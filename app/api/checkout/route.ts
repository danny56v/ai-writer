import { auth } from "@/auth";
import { getCustomer } from "@/lib/mongo";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

const ALLOWED_PRICES = new Set([
  "price_1RtQX7RsRyFq7mSBngUAWcHC",
  "price_1RtQX7RsRyFq7mSBLWuC9ddx",
  "price_1RtRzkRsRyFq7mSBXQBHBd5G",
  "price_1RtS0RRsRyFq7mSB1Orea73q",
]);

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!session || !user?.id) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    const { priceId } = await request.json();

    if (typeof priceId !== "string" || !priceId.trim()) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }
    if (!ALLOWED_PRICES.has(priceId)) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    if (!user.email || typeof user.email !== "string") {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const customer = await getCustomer(user.id); // { customerId, ... } | null

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: { userId: user.id },
      // ui_mode: "hosted", // implicit
    };

    // Dacă avem deja customer în Stripe → atașăm subscripția la acela
    if (customer?.customerId) {
      params.customer = customer.customerId;
    } else {
      // fallback pentru utilizatori noi
      params.customer_email = user.email;
    }

    const checkoutSession = await stripe.checkout.sessions.create(params);

    if (!checkoutSession.url) {
      return NextResponse.json({ error: "No checkout URL returned" }, { status: 500 });
    }

    console.log("Checkout session created:", {
      userId: user.id,
      email: user.email,
      priceId,
      customerId: customer?.customerId ?? "new via email",
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error in checkout route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
