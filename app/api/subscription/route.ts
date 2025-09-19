import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getUserPriceId } from "@/lib/billing";

export async function GET() {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const priceId = await getUserPriceId(user.id);


    return NextResponse.json({ priceId });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

