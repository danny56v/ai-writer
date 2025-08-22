import { auth } from "@/auth";
import { getCustomer } from "@/lib/mongo";
import { stripe } from "@/lib/stripe";
import { get } from "http";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!session || !user?.id) {
      return new NextResponse("Unauthorized user", { status: 401 });
    }

    const customer = await getCustomer(user.id);

    if (!customer?.customerId) {
      return new NextResponse("Customer not found", { status: 404 });
    }


    const { priceId } = await request.json();

    if (typeof priceId !== "string" || !priceId.trim()) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }

    if (!user.email || typeof user.email !== "string") {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: {
        userId: user.id,
      },
    });

    console.log("Checkout session created for:", {
      id: user.id,
      email: user.email,
      priceId,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error in checkout route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
