import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "ListologyAi Checkout Status",
  description:
    "Verify your ListologyAi subscription checkout status and jump back into pricing or the AI listing workspace.",
  keywords: [
    "ListologyAi checkout",
    "real estate AI subscription",
    "ListologyAi billing confirmation",
  ],
  openGraph: {
    title: "ListologyAi Checkout Status",
    description:
      "Review your ListologyAi checkout outcome and jump back into the platform.",
    url: "https://listologyai.com/checkout/success",
    type: "website",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 800,
        alt: "ListologyAi checkout status",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ListologyAi Checkout Status",
    description:
      "Check the status of your ListologyAi subscription checkout and continue onboarding.",
    images: ["/Logo.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

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
