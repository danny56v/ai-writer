import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";

export default async function Return({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return redirect("/pricing");
  }

  try {
    const { status } = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "subscription"],
    });

    if (status === "open") {
      return redirect("/pricing");
    }

    if (status === "complete") {
      return redirect("/real-estate-generator?checkout=success");
    }
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return redirect("/pricing");
  }
}
