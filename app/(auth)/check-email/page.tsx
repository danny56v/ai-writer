import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Confirm email | Start pasting addresses for instant descriptions",
  description:
    "Check your inbox to confirm your ListologyAi account and begin turning any property address into an MLS-ready real estate description.",
  keywords: ["ListologyAi email verification", "address to description", "real estate AI account activation", "ListologyAi confirmation"],
  openGraph: {
    title: "Confirm email | Start pasting addresses for instant descriptions",
    description: "Verify your ListologyAi account from your inbox to unlock AI-powered real estate copywriting from any address.",
    url: "https://listologyai.com/check-email",
    type: "website",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 800,
        alt: "ListologyAi email confirmation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Confirm email | Start pasting addresses for instant descriptions",
    description: "Confirm your ListologyAi account to keep building AI-powered real estate marketing from a property address.",
    images: ["/Logo.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

type CheckEmailParams = {
  email?: string;
  resent?: string;
  callbackUrl?: string;
};

type CheckEmailPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CheckEmailPage({ searchParams }: CheckEmailPageProps) {
  const params = (await searchParams) as CheckEmailParams;

  // If Next returns arrays, normalize the value:
  const getStr = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const email = getStr(params.email);
  const resent = getStr(params.resent);
  const callbackUrl = getStr(params.callbackUrl);

  return (
    <div className="flex min-h-screen flex-col justify-center bg-neutral-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Image src="/Logo.png" alt="ListologyAi" width={40} height={40} className="mx-auto h-10 w-10" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight  ">Check your email</h1>
        <p className="mt-4 text-sm leading-6 text-neutral-600">
          {resent === "1"
            ? "We just sent you another confirmation link."
            : "We sent a confirmation link to your email address."}
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="rounded-2xl bg-white px-6 py-10 shadow sm:px-12">
          <p className="text-sm text-neutral-600">
            Check your inbox (and spam/promotions) for the ListologyAi message. Click the button inside the email within
            24 hours to activate your account.
          </p>
          <div className="mt-6 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/70 px-4 py-3 text-left text-sm text-indigo-700">
            <p className="font-semibold">Email sent to</p>
            <p className="mt-1 break-all">{email ?? "your email"}</p>
          </div>
          <div className="mt-6 space-y-3 text-sm text-neutral-600">
            <p>If you don’t see the email yet, request another link from the sign-up page in a few minutes.</p>
            <p>
              Already confirmed?{" "}
              <Link
                href={callbackUrl ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/sign-in"}
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Sign in here
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
