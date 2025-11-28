import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "ListologyAi Checkout Status",
  description:
    "Verify your ListologyAi subscription checkout status and jump back into pricing or begin generating new listing descriptions.",
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

export default async function Return({ searchParams }: { searchParams?: { session_id?: string } }) {
  const sessionId = searchParams?.session_id;

  if (!sessionId) {
    return redirect("/pricing");
  }

  let status: string | null = null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "subscription"],
    });

    status = session.status;
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return redirect("/pricing?checkout=error");
  }

  if (status === "open" || status === null) {
    return redirect("/pricing");
  }

  if (status === "complete") {
    return redirect("/real-estate-generator?checkout=success");
  }

  return redirect("/pricing");
}
