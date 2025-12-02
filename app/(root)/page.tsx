import type { Metadata } from "next";

import { auth } from "@/auth";
import LandingPage from "@/components/home/LandingPage";
import { getUserPlan } from "@/lib/billing";

export const metadata: Metadata = {
  title: "Paste an address, get an MLS description | ListologyAi",
  description:
    "ListologyAi transforms any property address into a ready-to-publish listing description using Street View context and your brand voice—just paste the address to get the copy.",
  keywords: ["ListologyAi", "address to description", "real estate description generator", "AI MLS copy", "property story from address"],
  openGraph: {
    title: "Paste an address, get an MLS description | ListologyAi",
    description:
      "Enter an address and ListologyAi writes the entire listing description in seconds—MLS-ready, compliant, and tuned for agents.",
    url: "https://listologyai.com",
    type: "website",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 800,
        alt: "ListologyAi brand mark",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paste an address, get an MLS description | ListologyAi",
    description:
      "Paste an address and instantly receive a persuasive, compliant real estate description with ListologyAi.",
    images: ["/Logo.png"],
  },
};

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const plan = userId ? await getUserPlan(userId) : null;

  return <LandingPage currentPriceId={plan?.priceId ?? null} />;
}
