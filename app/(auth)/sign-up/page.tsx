import { Suspense } from "react";

import SignUpScreen from "@/components/auth/SignUpScreen";

const SignUp = () => {
  return (
    <Suspense>
      <SignUpScreen />
    </Suspense>
  );
};

export default SignUp;
