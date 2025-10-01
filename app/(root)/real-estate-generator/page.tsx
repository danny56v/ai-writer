import { auth } from "@/auth";
import RealEstateClient from "@/components/realEstate/RealEstateClient";
import { getUserPlan } from "@/lib/billing";

const RealEstateGeneratorPage = async () => {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const defaultPlan = { planType: "free", currentPeriodEnd: null, status: "free" } as const;
  const userPlan = userId ? await getUserPlan(userId) : defaultPlan;

  return <RealEstateClient userPlan={userPlan} isAuthenticated={Boolean(userId)} />;
};

export default RealEstateGeneratorPage;

