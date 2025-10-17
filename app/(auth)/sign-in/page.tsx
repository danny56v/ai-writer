import { Suspense } from "react";
import type { Metadata } from "next";
import SignInScreen from "@/components/auth/SignInScreen";

export const metadata: Metadata = {
  title: "ListologyAi Sign In",
  description:
    "Log in to ListologyAi to generate persuasive, MLS-ready real estate descriptions and manage your team's workspace.",
  keywords: [
    "ListologyAi login",
    "real estate AI sign in",
    "property description generator account",
  ],
  openGraph: {
    title: "ListologyAi Sign In",
    description:
      "Access ListologyAi to power faster, compliant real estate listing copy.",
    url: "https://listologyai.com/sign-in",
    type: "website",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 800,
        alt: "ListologyAi sign in",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ListologyAi Sign In",
    description:
      "Return to ListologyAi and continue creating market-ready property descriptions with AI.",
    images: ["/Logo.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignIn() {
  return (
    <Suspense fallback={null}>
      <SignInScreen />
    </Suspense>
  );
}
