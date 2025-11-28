import { auth } from "@/auth";
import NavbarClient from "@/components/NavbarClient";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";

export default async function NotFound() {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-white">
        <NavbarClient initialSession={session} />

        <main className="flex flex-1 items-center justify-center px-6 py-24 sm:px-8 sm:py-32">
          <div className="max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-4 py-1 text-sm font-semibold text-indigo-600 shadow-sm backdrop-blur">
              404
              <span className="h-1 w-1 rounded-full bg-indigo-300" />
              Page not on the market
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight   sm:text-5xl">This address isn’t listed yet</h1>
            <p className="mt-4 text-lg leading-8 text-neutral-600 sm:mt-6">
              The page you were looking for has either been taken off the market or never went live. Let’s get you back
              to the places that move deals forward.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-500 hover:via-purple-500 hover:to-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Back to homepage
              </Link>
              <Link
                href="/real-estate-generator"
                className="inline-flex items-center justify-center rounded-xl border border-indigo-200/70 bg-white/80 px-6 py-3 text-sm font-semibold   shadow-md transition hover:border-indigo-300 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Explore the AI generator
              </Link>
            </div>
            <div className="mt-12 grid gap-6 text-left sm:grid-cols-3 sm:gap-8">
              <Link
                href="/pricing"
                className="group rounded-2xl border border-indigo-100/70 bg-white/60 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-indigo-200 hover:bg-white"
              >
                <p className="text-sm font-semibold text-indigo-600">Plans & Pricing</p>
                <p className="mt-2 text-sm text-neutral-600">
                  Compare plans and unlock unlimited listing creation for your team.
                </p>
              </Link>
              <Link
                href="/blog"
                className="group rounded-2xl border border-indigo-100/70 bg-white/60 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-indigo-200 hover:bg-white"
              >
                <p className="text-sm font-semibold text-indigo-600">Latest resources</p>
                <p className="mt-2 text-sm text-neutral-600">
                  Learn how agents scale marketing with responsible AI workflows.
                </p>
              </Link>
              <Link
                href="/about"
                className="group rounded-2xl border border-indigo-100/70 bg-white/60 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-indigo-200 hover:bg-white"
              >
                <p className="text-sm font-semibold text-indigo-600">Meet ListologyAi</p>
                <p className="mt-2 text-sm text-neutral-600">
                  Discover the mission behind our platform and the team building it.
                </p>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
