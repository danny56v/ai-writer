"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import GoogleButton from "@/components/GoogleButton";
import type { ActionState } from "@/interfaces/auth";
import { SignUpAction } from "@/lib/actions/auth";

const INITIAL_STATE: ActionState = { success: true, message: "" };

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
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image src="/Logo.png" alt="HomeListerAi" width={40} height={40} className="mx-auto h-10 w-10" />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create your HomeListerAi account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Generate your first three listings for free. Upgrade when you invite your team.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="rounded-3xl bg-white px-6 py-12 shadow sm:px-12">
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {state.errors?.email?.map((err, index) => (
                  <p key={`signup-email-error-${index}`} className="mt-2 text-xs text-red-600">
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
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {state.errors?.password?.map((err, index) => (
                  <p key={`signup-password-error-${index}`} className="mt-2 text-xs text-red-600">
                    {err}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={pending}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
              >
                {pending ? "Creating account…" : "Create account"}
              </button>
            </div>

            {state.success === false && state.message && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{state.message}</div>
            )}
            {state.success === true && state.message && (
              <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">{state.message}</div>
            )}
          </form>

          <div className="relative mt-10">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-white px-6 text-gray-900">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleButton callbackUrl={callbackUrl} />
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            href={callbackUrl ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/sign-in"}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpScreen;
