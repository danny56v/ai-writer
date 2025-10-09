"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowPathIcon, CheckCircleIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("pending");
    setMessage(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to send reset link");
      }

      setStatus("success");
      setMessage("If an account exists for this email, you will receive a reset link shortly.");
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unable to send reset link";
      setStatus("error");
      setMessage(errMsg);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center gap-3">
          <Image src="/Logo.png" alt="ListologyAi" width={44} height={44} className="h-11 w-11 drop-shadow" />
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Forgot password?</h1>
            <p className="mt-2 text-sm text-slate-600">
              Enter your email and we&apos;ll send a secure link to choose a new password.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[500px]">
        <div className="rounded-3xl border border-white/70 bg-white/80 px-6 py-12 shadow-xl ring-1 ring-black/5 backdrop-blur sm:px-12">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {message && (
              <div
                className={`flex items-start gap-3 rounded-2xl border px-5 py-4 text-sm shadow-sm ${
                  status === "success"
                    ? "border-emerald-200 bg-emerald-50/90 text-emerald-700"
                    : "border-red-200 bg-red-50/90 text-red-700"
                }`}
              >
                {status === "success" ? (
                  <CheckCircleIcon aria-hidden="true" className="mt-0.5 h-5 w-5" />
                ) : (
                  <EnvelopeIcon aria-hidden="true" className="mt-0.5 h-5 w-5" />
                )}
                <p>{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "pending"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-lg transition hover:from-indigo-500 hover:via-purple-500 hover:to-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
            >
              {status === "pending" && <ArrowPathIcon aria-hidden="true" className="h-4 w-4 animate-spin" />}
              {status === "pending" ? "Sending link" : "Send reset link"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Remembered your password?{" "}
            <Link href="/sign-in" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
