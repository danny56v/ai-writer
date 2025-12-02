import type { Metadata } from "next";
import ResetPasswordScreen from "@/components/auth/ResetPasswordScreen";

export const metadata: Metadata = {
  title: "Reset password | Continue turning addresses into descriptions",
  description:
    "Reset your ListologyAi password and get back to pasting property addresses to generate compliant real estate listings with AI.",
  keywords: ["ListologyAi reset password", "address to description", "real estate AI account recovery", "ListologyAi login help"],
  openGraph: {
    title: "Reset password | Continue turning addresses into descriptions",
    description: "Securely reset your ListologyAi credentials to keep generating property marketing copy from a single address.",
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
    title: "Reset password | Continue turning addresses into descriptions",
    description: "Recover your ListologyAi access to keep producing MLS-ready property descriptions from addresses.",
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
