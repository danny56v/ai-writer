import type { Metadata } from "next";
import ForgotPasswordScreen from "@/components/auth/ForgotPasswordScreen";

export const metadata: Metadata = {
  title: "ListologyAi Forgot Password",
  description:
    "Request a secure reset link to restore access to your ListologyAi workspace for AI-powered real estate marketing.",
  keywords: [
    "ListologyAi forgot password",
    "real estate AI password reset",
    "ListologyAi account support",
  ],
  openGraph: {
    title: "ListologyAi Forgot Password",
    description:
      "Send yourself a ListologyAi password reset link and keep delivering MLS-ready property descriptions.",
    url: "https://listologyai.com/forgot-password",
    type: "website",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 800,
        alt: "ListologyAi forgot password",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ListologyAi Forgot Password",
    description:
      "Recover your ListologyAi login to continue crafting AI-assisted property marketing.",
    images: ["/Logo.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordScreen />;
}
