"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

import GoogleButton from "@/components/GoogleButton";
import type { ActionState } from "@/interfaces/auth";
import { SignUpAction } from "@/lib/actions/auth";

const INITIAL_STATE: ActionState = { success: true, message: "" };
const SIGN_UP_STATS = [
  { value: "3", label: "Free listings to start" },
  { value: "24/7", label: "AI compliance guardrail" },
  { value: "1", label: "Workspace for your team" },
] as const;

const SIGN_UP_HIGHLIGHTS = [
  "Invite teammates and keep roles aligned",
  "Save tone & brand libraries once",
  "Ship MLS-ready copy in minutes",
] as const;

const SignUpScreen = () => {
  const [state, formAction, pending] = useActionState(SignUpAction, INITIAL_STATE);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") ?? "";
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    if (state.email) {
      setEmailInput(state.email);
    }
  }, [state.email]);

  return (
    <div className="relative isolate flex min-h-screen items-center px-6 py-16 sm:px-10 lg:px-16">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 flex justify-center">
        <div className="h-64 w-[42rem] rounded-full bg-gradient-to-r from-neutral-100 via-white to-indigo-50 opacity-70 blur-3xl" />
      </div>
      <div aria-hidden="true" className="absolute -left-24 bottom-0 -z-10 hidden lg:block">
        <div className="h-72 w-72 rounded-full bg-gradient-to-br from-pink-50 via-white to-emerald-50 opacity-60 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,410px)] lg:items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:gap-3">
              <Image src="/Logo.png" alt="ListologyAi" width={56} height={56} className="h-12 w-12 drop-shadow-xl" />
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/80 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-neutral-500">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  New workspace
                </span>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight   sm:text-4xl">
                  Create your ListologyAi account
                </h1>
              </div>
            </div>

            <p className="text-base leading-7 text-neutral-600 lg:max-w-xl">
              Launch an AI workspace designed for real estate teams — generate property briefs, manage approvals, and
              publish MLS-ready copy without juggling ten different tools.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {SIGN_UP_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/70 bg-white/80 px-5 py-4 text-left shadow-[0_25px_70px_-35px_rgba(15,23,42,0.35)] ring-1 ring-neutral-100/60 backdrop-blur"
                >
                  <p className="text-2xl font-semibold  ">{stat.value}</p>
                  <p className="mt-1 text-sm text-neutral-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <ul className="space-y-3 text-left text-sm text-neutral-600">
              {SIGN_UP_HIGHLIGHTS.map((highlight) => (
                <li key={highlight} className="flex items-center justify-center gap-3 lg:justify-start">
                  <CheckCircleIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-emerald-400" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-white/70 bg-white/90 px-6 py-10 shadow-[0_35px_90px_rgba(15,23,42,0.12)] ring-1 ring-neutral-100/80 backdrop-blur sm:px-10">
            <form action={formAction} className="space-y-6">
              <input type="hidden" name="callbackUrl" value={callbackUrl} />
              <div>
                <label htmlFor="email" className="block text-sm font-medium  ">
                  Work email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={emailInput}
                    onChange={(event) => setEmailInput(event.target.value)}
                    className="block w-full rounded-xl border border-neutral-200/80 bg-white px-4 py-3 text-sm font-medium   shadow-[0_18px_45px_-35px_rgba(15,23,42,0.45)] placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-200"
                  />
                  {state.errors?.email?.map((err, index) => (
                    <p key={`signup-email-error-${index}`} className="mt-2 text-xs text-rose-600">
                      {err}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium  ">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    className="block w-full rounded-xl border border-neutral-200/80 bg-white px-4 py-3 text-sm font-medium   shadow-[0_18px_45px_-35px_rgba(15,23,42,0.45)] placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-200"
                  />
                  {state.errors?.password?.map((err, index) => (
                    <p key={`signup-password-error-${index}`} className="mt-2 text-xs text-rose-600">
                      {err}
                    </p>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={pending}
                className="flex w-full items-center justify-center rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_22px_45px_-20px_rgba(15,23,42,0.8)] transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:opacity-70"
              >
                {pending ? "Creating account…" : "Create account"}
              </button>

              {state.success === false && state.message && (
                <div className="rounded-2xl border border-rose-200/70 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 shadow-sm">
                  {state.message}
                </div>
              )}
              {state.success === true && state.message && (
                <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700 shadow-sm">
                  {state.message}
                </div>
              )}
            </form>

            <div className="relative mt-10">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200/80" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white px-6 text-neutral-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <GoogleButton callbackUrl={callbackUrl} />
            </div>

            <p className="mt-10 text-center text-sm text-neutral-600">
              Already have an account?{" "}
              <Link
                href={callbackUrl ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/sign-in"}
                className="font-semibold   hover: "
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;
