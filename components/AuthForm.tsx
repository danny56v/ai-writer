"use client";
import { ActionState } from "@/interfaces/auth";
import { useActionState } from "react";

interface AuthFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  buttonText: string;
  title: string;
}

const AuthForm = ({ action, buttonText, title }: AuthFormProps) => {
  const [state, formAction, pending] = useActionState(action, { success: true, message: "" });
  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">Welcome back to Aurora. Enter your credentials to access the studio.</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-slate-900">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="h-11 w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-200/60"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-semibold text-slate-900">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="h-11 w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-200/60"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-400/40 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Loading..." : buttonText}
      </button>

      {state.success === false && state.message && (
        <div className="rounded-2xl border border-red-200/60 bg-red-50/80 px-4 py-3 text-sm text-red-700">{state.message}</div>
      )}

      {state.success === true && state.message && (
        <div className="rounded-2xl border border-green-200/60 bg-green-50/80 px-4 py-3 text-sm text-green-700">{state.message}</div>
      )}
    </form>
  );
};

export default AuthForm;
