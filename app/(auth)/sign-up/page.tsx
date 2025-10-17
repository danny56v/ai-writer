import { Suspense } from "react";
import type { Metadata } from "next";

import SignUpScreen from "@/components/auth/SignUpScreen";

export const metadata: Metadata = {
  title: "ListologyAi Sign Up",
  description:
    "Create your ListologyAi account to generate compliant real estate listing descriptions faster with AI built for agents.",
  keywords: [
    "ListologyAi sign up",
    "real estate AI trial",
    "property listing generator signup",
  ],
  openGraph: {
    title: "ListologyAi Sign Up",
    description:
      "Join ListologyAi to transform property details into persuasive, MLS-ready copy in minutes.",
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
    title: "ListologyAi Sign Up",
    description:
      "Start using ListologyAi to generate on-brand, compliant real estate descriptions with AI.",
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
