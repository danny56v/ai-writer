import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Checkout success | Start turning addresses into descriptions",
  description:
    "Confirm your ListologyAi subscription and jump back in to paste any address and receive a complete, ready-to-publish property description.",
  keywords: ["ListologyAi checkout", "address to description", "real estate AI subscription", "ListologyAi billing confirmation"],
  openGraph: {
    title: "Checkout success | Start turning addresses into descriptions",
    description: "Review your ListologyAi checkout outcome and return to generating property descriptions from a single address.",
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
    title: "Checkout success | Start turning addresses into descriptions",
    description: "Check your ListologyAi subscription status and continue by dropping an address to get a description.",
    images: ["/Logo.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

type CheckoutSuccessPageProps = {
  searchParams: Promise<{ session_id?: string | string[] | undefined }>;
};

export default async function Return({ searchParams }: CheckoutSuccessPageProps) {
  const params = await searchParams;
  const rawSessionId = params?.session_id;
  const sessionId = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId;

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
    return redirect("/real-estate-generator?checkout=success&subscription=purchased");
  }

  return redirect("/pricing");
}
