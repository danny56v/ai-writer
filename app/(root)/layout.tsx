import { auth } from "@/auth";
import NavbarClient from "@/components/NavbarClient";
import { getUserPlan } from "@/lib/billing";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  const userId = session?.user?.id;
  const plan = userId ? await getUserPlan(userId) : null;

  return (
    <div>
      <SessionProvider session={session}>
        <NavbarClient initialSession={session} initialPlanType={plan?.planType} />
        {children}
      </SessionProvider>
    </div>
  );
};

export default Layout;
