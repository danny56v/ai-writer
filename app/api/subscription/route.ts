import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getUserSubscription } from "@/lib/subscription-helpers";

export async function GET() {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await getUserSubscription(user.id);
    const priceId = subscription?.priceId || null;

    return NextResponse.json({ priceId });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

