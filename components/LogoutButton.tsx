"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => signOut({ callbackUrl: "/" }))}
      disabled={pending}
      className={
        className ??
        "inline-flex justify-center rounded-md border border-red-600 px-4 py-2 text-sm font-semibold text-red-500 shadow-sm transition hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
      }
    >
      {pending ? "Logging out..." : "Log out"}
    </button>
  );
}
