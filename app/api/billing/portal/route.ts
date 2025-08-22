import { auth } from "@/auth";
import { getCustomer } from "@/lib/mongo";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await auth();

    const user = session?.user;

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customer = await getCustomer(user.id);
    if (!customer?.customerId) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.customerId,
      return_url: `${process.env.NEXTAUTH_URL}/`,
    });
    console.log("Portal session created:", portalSession);
    if (!portalSession.url) {
      return NextResponse.json({ error: "Failed to create billing portal session" }, { status: 500 });
    }
    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Error creating billing portal session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
