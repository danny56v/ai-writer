import { Suspense } from "react";
import SignInScreen from "@/components/auth/SignInScreen";

export default function SignIn() {
  return (
    <Suspense fallback={null}>
      <SignInScreen />
    </Suspense>
  );
}