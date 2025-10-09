import { auth } from "@/auth";
import { getRealEstateHistory } from "@/lib/realEstateHistory";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const history = await getRealEstateHistory(userId, 20);
    return NextResponse.json({ history });
  } catch (error) {
    console.error("Failed to load real estate history", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
