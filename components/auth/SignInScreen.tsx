"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EnvelopeOpenIcon, ExclamationTriangleIcon, CheckCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

import GoogleButton from "@/components/GoogleButton";
import type { ActionState } from "@/interfaces/auth";
import { SignInAction } from "@/lib/actions/auth";

const INITIAL_STATE: ActionState = { success: true, message: "" };
const SIGN_IN_STATS = [
  { value: "28K+", label: "Listings generated" },
  { value: "5K+", label: "Agents signed up" },
  { value: "18 min", label: "Average time saved per listing" },
] as const;


const SIGN_IN_HIGHLIGHTS = [
  "Secure access to your saved listings",
  "Built specifically for real estate agents",
  "Start new descriptions from any address in seconds",
] as const;


const SignInScreen = () => {
  const [state, formAction, pending] = useActionState(SignInAction, INITIAL_STATE);
  const searchParams = useSearchParams();
  const verifiedStatus = searchParams?.get("verified");
  const callbackUrl = searchParams?.get("callbackUrl") ?? "";
  const [emailInput, setEmailInput] = useState("");
  const [resending, setResending] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    setResendFeedback(null);
    setResending(false);
  }, [state]);

  useEffect(() => {
    if (state.email) {
      setEmailInput(state.email);
    }
  }, [state.email]);

  const handleResendVerification = async () => {
    if (!state.email) return;
    setResending(true);
    setResendFeedback(null);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: state.email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Could not resend verification email");
      }

      setResendFeedback({ type: "success", message: "Verification email sent again. Check your inbox." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not resend verification email";
      setResendFeedback({ type: "error", message });
    } finally {
      setResending(false);
    }
  };

  const verificationMessage =
    verifiedStatus === "1"
      ? "Your email is confirmed. You can sign in now."
      : verifiedStatus === "expired"
      ? "The confirmation link expired. Request a new one from the sign-up page."
      : verifiedStatus === "0"
      ? "Invalid or already used link. Please request a fresh confirmation email."
      : null;

  return (
    <div className="relative isolate flex min-h-screen items-center px-6 py-16 sm:px-10 lg:px-16">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 flex justify-center">
        <div className="h-72 w-[40rem] rounded-full bg-gradient-to-r from-gray-100 via-white to-indigo-50 opacity-70 blur-3xl" />
      </div>
      <div aria-hidden="true" className="absolute -right-28 bottom-10 -z-10 hidden lg:block">
        <div className="h-72 w-72 rounded-full bg-gradient-to-br from-cyan-50 via-white to-emerald-50 opacity-60 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,420px)] lg:items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:gap-3">
              <Image src="/Logo.png" alt="ListologyAi" width={56} height={56} className="h-12 w-12 drop-shadow-xl" />
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/80 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] ">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Secure access
                </span>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight   sm:text-4xl">
                  Sign in to the ListologyAi 
                </h1>
              </div>
            </div>
            <p className="text-base leading-7  lg:max-w-xl">
            Access your saved listings, recent generations, and settings in one place. Continue where you left off or start a new
  description from any property address and let the AI handle the heavy lifting.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {SIGN_IN_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/70 bg-white/80 px-5 py-4 text-left shadow-[0_25px_70px_-35px_rgba(15,23,42,0.35)] ring-1 ring-gray-100/60 backdrop-blur"
                >
                  <p className="text-2xl font-semibold  ">{stat.value}</p>
                  <p className="mt-1 text-sm ">{stat.label}</p>
                </div>
              ))}
            </div>

            <ul className="space-y-3 text-left text-sm ">
              {SIGN_IN_HIGHLIGHTS.map((highlight) => (
                <li key={highlight} className="flex items-center justify-center gap-3 lg:justify-start">
                  <CheckCircleIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-emerald-400" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-white/70 bg-white/90 px-6 py-10 shadow-[0_35px_90px_rgba(15,23,42,0.12)] ring-1 ring-gray-100/80 backdrop-blur sm:px-10">
            {verificationMessage && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 text-sm  shadow-sm">
                <EnvelopeOpenIcon aria-hidden="true" className="mt-0.5 h-5 w-5 flex-shrink-0 " />
                <p>{verificationMessage}</p>
              </div>
            )}

            <form action={formAction} className="space-y-6">
              <input type="hidden" name="callbackUrl" value={callbackUrl} />
              <div>
                <label htmlFor="email" className="block text-sm font-medium  ">
                  Email address
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
                    className="block w-full rounded-xl border border-gray-200/80 bg-white px-4 py-3 text-sm font-medium   shadow-[0_18px_45px_-35px_rgba(15,23,42,0.45)] placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200"
                  />
                  {state.errors?.email?.map((err, index) => (
                    <p key={`email-error-${index}`} className="mt-2 text-xs text-rose-600">
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
                    autoComplete="current-password"
                    className="block w-full rounded-xl border border-gray-200/80 bg-white px-4 py-3 text-sm font-medium   shadow-[0_18px_45px_-35px_rgba(15,23,42,0.45)] placeholder:text-gray-400 focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-200"
                  />
                  {state.errors?.password?.map((err, index) => (
                    <p key={`password-error-${index}`} className="mt-2 text-xs text-rose-600">
                      {err}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <label className="flex items-center gap-2 ">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300   focus:ring-gray-900/30"
                  />
                  Remember me
                </label>
                <Link href="/forgot-password" className="font-semibold   transition hover: ">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={pending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-[0_22px_45px_-20px_rgba(15,23,42,0.8)] transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:opacity-70"
              >
                {pending && <ArrowPathIcon aria-hidden="true" className="h-4 w-4 animate-spin" />}
                {pending ? "Signing in…" : "Sign in"}
              </button>

              {state.success === false && state.message && (
                <div className="space-y-4 rounded-2xl border border-rose-200/70 bg-rose-50/80 px-4 py-4 text-sm text-rose-700 shadow-sm">
                  <div className="flex gap-2 font-medium">
                    <ExclamationTriangleIcon aria-hidden="true" className="mt-0.5 h-5 w-5 text-rose-400" />
                    <p>{state.message}</p>
                  </div>
                  {state.allowResend && state.email && (
                    <div className="space-y-3 rounded-xl border border-rose-100 bg-white/80 px-4 py-3 text-xs text-rose-600">
                      <p className="text-sm font-medium">Didn&apos;t receive the confirmation email?</p>
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={resending}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <ArrowPathIcon aria-hidden="true" className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
                        {resending ? "Resending" : "Resend verification email"}
                      </button>
                      {resendFeedback && (
                        <p
                          className={
                            resendFeedback.type === "success"
                              ? "flex items-center gap-2 text-sm text-emerald-600"
                              : "flex items-center gap-2 text-sm text-rose-600"
                          }
                        >
                          {resendFeedback.type === "success" ? (
                            <CheckCircleIcon aria-hidden="true" className="h-4 w-4" />
                          ) : (
                            <ExclamationTriangleIcon aria-hidden="true" className="h-4 w-4" />
                          )}
                          {resendFeedback.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {state.success === true && state.message && (
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700 shadow-sm">
                  <CheckCircleIcon aria-hidden="true" className="mt-0.5 h-5 w-5 text-emerald-500" />
                  <p>{state.message}</p>
                </div>
              )}
            </form>

            <div className="relative mt-10">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200/80" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white px-6 ">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <GoogleButton callbackUrl={callbackUrl} />
            </div>

            <p className="mt-10 text-center text-sm">
              New to ListologyAi?{" "}
              <Link
                href={callbackUrl ? `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/sign-up"}
                className="font-semibold   hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;
