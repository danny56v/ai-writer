import type { Metadata } from "next";
import ForgotPasswordScreen from "@/components/auth/ForgotPasswordScreen";

export const metadata: Metadata = {
  title: "Forgot password | Get back to address-to-description in ListologyAi",
  description:
    "Request a secure reset link to restore access to ListologyAi so you can keep pasting addresses and receiving MLS-ready descriptions.",
  keywords: ["ListologyAi forgot password", "address to description", "real estate AI password reset", "ListologyAi account support"],
  openGraph: {
    title: "Forgot password | Get back to address-to-description in ListologyAi",
    description:
      "Send yourself a ListologyAi password reset link and keep delivering MLS-ready property descriptions from a single address.",
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
    title: "Forgot password | Get back to address-to-description in ListologyAi",
    description: "Recover your ListologyAi login to continue crafting AI-assisted property marketing from any address.",
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
