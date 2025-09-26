import { auth } from "@/auth";
import Pricing from "@/components/Pricing";
import { getUserPlan } from "@/lib/billing";
import React from "react";

const PricingPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const plan = userId ? await getUserPlan(userId) : null;

  return (
    <>
      <Pricing currentPriceId={plan?.priceId ?? null} />
    </>
  );
};

export default PricingPage;
