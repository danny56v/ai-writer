import { auth } from "@/auth";
import { getBillingHistory } from "@/lib/billingHistory";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoices = await getBillingHistory(session.user.id);
    return NextResponse.json({ invoices });
  } catch (error) {
    console.error("Error fetching billing history:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
