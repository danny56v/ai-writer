import Image from "next/image";
import Link from "next/link";

interface CheckEmailSearchParams {
  email?: string;
  resent?: string;
  callbackUrl?: string;
}

type Props = {
  searchParams: CheckEmailSearchParams | Promise<CheckEmailSearchParams>;
};

export default async function CheckEmailPage({ searchParams }: Props) {
  const resolvedParams = await Promise.resolve(searchParams);
  const { email, resent, callbackUrl } = resolvedParams;

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Image src="/Logo.png" alt="HomeListerAi" width={40} height={40} className="mx-auto h-10 w-10" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Check your email</h1>
        <p className="mt-4 text-sm leading-6 text-gray-600">
          {resent === "1"
            ? "We just sent you another confirmation link."
            : "We sent a confirmation link to your email address."}
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="rounded-3xl bg-white px-6 py-10 shadow sm:px-12">
          <p className="text-sm text-gray-600">
            Check your inbox (and spam/promotions) for the HomeListerAi message. Click the button inside the email within 24
            hours to activate your account.
          </p>
          <div className="mt-6 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/70 px-4 py-3 text-left text-sm text-indigo-700">
            <p className="font-semibold">Email sent to</p>
            <p className="mt-1 break-all">{email ?? "your email"}</p>
          </div>
          <div className="mt-6 space-y-3 text-sm text-gray-600">
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
