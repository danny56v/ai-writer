"use client";

import { useEffect } from "react";
import NavbarClient from "@/components/NavbarClient";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <SessionProvider session={null}>
      <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-white">
        <NavbarClient initialSession={null} />

        <main className="flex flex-1 items-center justify-center px-6 py-24 sm:px-8 sm:py-32">
          <div className="max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-4 py-1 text-sm font-semibold text-indigo-600 shadow-sm backdrop-blur">
              Something went wrong
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight   sm:text-5xl">
              We hit a snag generating this view
            </h1>
            <p className="mt-4 text-lg leading-8 text-neutral-600 sm:mt-6">
              The request could not be completed right now. Try refreshing the page or head back to the dashboard while
              we sort things out.
            </p>
            {error.digest ? <p className="mt-4 text-sm text-neutral-400">Error reference: {error.digest}</p> : null}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-500 hover:via-purple-500 hover:to-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Try again
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-indigo-200/70 bg-white/80 px-6 py-3 text-sm font-semibold   shadow-md transition hover:border-indigo-300 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Go to homepage
              </Link>
            </div>
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
