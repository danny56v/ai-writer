import { auth } from "@/auth";
import { getUserPlan } from "@/lib/billing";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await getUserPlan(userId);

    return NextResponse.json({ planType: plan.planType, status: plan.status, currentPeriodEnd: plan.currentPeriodEnd });
  } catch (error) {
    console.error("Error fetching plan:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
