import type { Metadata } from "next";

import { auth } from "@/auth";
import RealEstateClient from "@/components/realEstate/RealEstateClient";
import { getUserPlan } from "@/lib/billing";

export const metadata: Metadata = {
  title: "Real estate listing generator powered by guided AI",
  description:
    "Generate MLS-ready property descriptions with compliant language, brand voice presets, and collaboration tools tailored for agents and marketers.",
  openGraph: {
    title: "Real estate listing generator powered by guided AI",
    description:
      "HomeListerAi streamlines briefs, AI drafting, and approvals so you can publish standout listings faster.",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 800,
        alt: "HomeListerAi real estate generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Real estate listing generator powered by guided AI",
    description:
      "Craft persuasive property copy in minutes with editable briefs, tone controls, and compliance reminders.",
    images: ["/Logo.png"],
  },
};

const RealEstateGeneratorPage = async () => {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const defaultPlan = { planType: "free", currentPeriodEnd: null, status: "free" } as const;
  const userPlan = userId ? await getUserPlan(userId) : defaultPlan;

  return <RealEstateClient userPlan={userPlan} isAuthenticated={Boolean(userId)} />;
};

export default RealEstateGeneratorPage;
