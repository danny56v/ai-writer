"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  EnvelopeOpenIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import GoogleButton from "@/components/GoogleButton";
import type { ActionState } from "@/interfaces/auth";
import { SignInAction } from "@/lib/actions/auth";

const INITIAL_STATE: ActionState = { success: true, message: "" };

const SignInScreen = () => {
  const [state, formAction, pending] = useActionState(SignInAction, INITIAL_STATE);
  const searchParams = useSearchParams();
  const verifiedStatus = searchParams?.get("verified");
  const callbackUrl = searchParams?.get("callbackUrl") ?? "";
  const [emailInput, setEmailInput] = useState("");
  const [resending, setResending] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

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
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center gap-3">
          <Image src="/Logo.png" alt="HomeListerAi" width={44} height={44} className="h-11 w-11 drop-shadow" />
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Welcome back to <span className="bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">HomeListerAi</span>
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Sign in with your email and password or continue with Google in just a tap.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[500px]">
        {verificationMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-indigo-100 bg-white/60 px-5 py-4 text-sm text-indigo-700 shadow-sm backdrop-blur">
            <EnvelopeOpenIcon aria-hidden="true" className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
            <p>{verificationMessage}</p>
          </div>
        )}
        <div className="rounded-3xl border border-white/70 bg-white/80 px-6 py-12 shadow-xl ring-1 ring-black/5 backdrop-blur sm:px-12">
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {state.errors?.email?.map((err, index) => (
                  <p key={`email-error-${index}`} className="mt-2 text-xs text-red-600">
                    {err}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {state.errors?.password?.map((err, index) => (
                  <p key={`password-error-${index}`} className="mt-2 text-xs text-red-600">
                    {err}
                  </p>
                ))}
              </div>
            </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm leading-6 text-slate-700">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  Remember me
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold leading-6 text-indigo-600 transition hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={pending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-lg transition hover:from-indigo-500 hover:via-purple-500 hover:to-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
                >
                  {pending && <ArrowPathIcon aria-hidden="true" className="h-4 w-4 animate-spin" />} {pending ? "Signing in…" : "Sign in"}
                </button>
              </div>

              {state.success === false && state.message && (
                <div className="space-y-4 rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 via-white to-red-50/60 px-5 py-4 text-sm text-red-700 shadow-sm">
                  <div className="flex gap-2 font-medium">
                    <ExclamationTriangleIcon aria-hidden="true" className="mt-0.5 h-5 w-5 text-red-500" />
                    <p>{state.message}</p>
                  </div>
                  {state.allowResend && state.email && (
                    <div className="space-y-3 rounded-xl bg-white/80 px-4 py-3 text-xs text-red-600 ring-1 ring-inset ring-red-100">
                      <p className="text-sm font-medium">Didn&apos;t receive the confirmation email?</p>
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={resending}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-red-500 hover:to-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <ArrowPathIcon aria-hidden="true" className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
                        {resending ? "Resending" : "Resend verification email"}
                      </button>
                      {resendFeedback && (
                        <p
                          className={
                            resendFeedback.type === "success"
                              ? "flex items-center gap-2 text-sm text-emerald-600"
                              : "flex items-center gap-2 text-sm text-red-600"
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
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-5 py-4 text-sm text-emerald-700 shadow-sm">
                  <CheckCircleIcon aria-hidden="true" className="mt-0.5 h-5 w-5" />
                  <p>{state.message}</p>
                </div>
              )}
            </form>

          <div className="relative mt-10">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-white px-6 text-slate-600">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleButton callbackUrl={callbackUrl} />
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-slate-600">
          New to HomeListerAi?{" "}
          <Link
            href={callbackUrl ? `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/sign-up"}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInScreen;
