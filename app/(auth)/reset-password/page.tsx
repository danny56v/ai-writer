import type { Metadata } from "next";
import ResetPasswordScreen from "@/components/auth/ResetPasswordScreen";

export const metadata: Metadata = {
  title: "ListologyAi Reset Password",
  description:
    "Reset your ListologyAi password and get back to generating compliant real estate listings with AI-powered workflows.",
  keywords: [
    "ListologyAi reset password",
    "real estate AI account recovery",
    "ListologyAi login help",
  ],
  openGraph: {
    title: "ListologyAi Reset Password",
    description:
      "Securely reset your ListologyAi credentials to continue managing property marketing with AI.",
    url: "https://listologyai.com/reset-password",
    type: "website",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 800,
        alt: "ListologyAi reset password",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ListologyAi Reset Password",
    description:
      "Recover your ListologyAi access to keep producing MLS-ready property descriptions.",
    images: ["/Logo.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params?.token;
  return <ResetPasswordScreen token={token} />;
}
