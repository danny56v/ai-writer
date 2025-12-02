import { Suspense } from "react";
import type { Metadata } from "next";

import SignUpScreen from "@/components/auth/SignUpScreen";

export const metadata: Metadata = {
  title: "Sign up to paste an address and get a description | ListologyAi",
  description:
    "Create your ListologyAi account to drop any property address and receive a compliant, MLS-ready listing description in seconds.",
  keywords: ["ListologyAi sign up", "address to description", "real estate AI trial", "property listing generator signup"],
  openGraph: {
    title: "Sign up to paste an address and get a description | ListologyAi",
    description: "Join ListologyAi to transform any address into persuasive, MLS-ready copy in minutes.",
    url: "https://listologyai.com/sign-up",
    type: "website",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 800,
        alt: "ListologyAi sign up",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign up to paste an address and get a description | ListologyAi",
    description: "Start using ListologyAi to paste an address and get on-brand, compliant real estate descriptions with AI.",
    images: ["/Logo.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

const SignUp = () => {
  return (
    <Suspense>
      <SignUpScreen />
    </Suspense>
  );
};

export default SignUp;
