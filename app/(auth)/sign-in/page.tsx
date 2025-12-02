import { Suspense } from "react";
import type { Metadata } from "next";
import SignInScreen from "@/components/auth/SignInScreen";

export const metadata: Metadata = {
  title: "Sign in to turn addresses into descriptions | ListologyAi",
  description:
    "Log in to ListologyAi and keep pasting property addresses to instantly receive persuasive, MLS-ready descriptions.",
  keywords: ["ListologyAi login", "address to description", "real estate AI sign in", "property description generator account"],
  openGraph: {
    title: "Sign in to turn addresses into descriptions | ListologyAi",
    description: "Access ListologyAi to drop an address and get a compliant listing description for your clients.",
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
    title: "Sign in to turn addresses into descriptions | ListologyAi",
    description:
      "Return to ListologyAi and continue creating market-ready property descriptions by pasting an address.",
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
