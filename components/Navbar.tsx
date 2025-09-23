import React from "react";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import { auth } from "@/auth";
import { signOutAction } from "@/lib/actions/auth";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Article Writer", href: "/article-writer" },
  { name: "Real Estate", href: "/real-estate-generator" },
  { name: "Pricing", href: "/pricing" },
];

const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="relative mt-6 w-full sm:mt-8">
      <div className="pointer-events-none absolute inset-x-0 top-full z-[-1] h-px bg-gradient-to-r from-transparent via-purple-300/50 to-transparent" />
      <div className="aurora-card flex items-center justify-between gap-4 rounded-full px-4 py-3 shadow-soft-xl sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="relative flex items-center gap-3">
            <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-fuchsia-500 to-amber-400 text-base font-semibold text-white shadow-lg shadow-fuchsia-400/40">
              AI
              <span className="absolute -inset-1 rounded-full border border-white/40" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Aurora</span>
              <span className="text-lg font-semibold text-slate-900">AI Studio</span>
            </div>
          </Link>
          <div className="hidden h-8 border-l border-slate-200/80 sm:block" aria-hidden="true" />
          <div className="hidden flex-col text-xs font-medium uppercase tracking-[0.32em] text-slate-400 sm:flex">
            <span className="text-slate-500">Design-led</span>
            <span>AI Platform</span>
          </div>
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group relative text-sm font-semibold text-slate-600 transition hover:text-slate-900"
            >
              <span>{item.name}</span>
              <span className="absolute inset-x-0 -bottom-2 h-[3px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-amber-400 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </div>

        {session && session.user ? (
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/profile"
              className="group flex items-center gap-3 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-inner shadow-white/60 transition hover:border-purple-200 hover:text-slate-900"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-amber-400 text-sm font-semibold text-white shadow-lg shadow-fuchsia-400/40">
                {session.user.name?.charAt(0).toUpperCase() || "A"}
              </span>
              <span className="max-w-[9rem] truncate text-left leading-tight">
                {session.user.name ?? session.user.email}
              </span>
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:bg-slate-800"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/sign-in" className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-400 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-400/40 transition hover:opacity-95"
            >
              Start free trial
            </Link>
          </div>
        )}

        <div className="lg:hidden">
          <MobileMenu
            navigation={navigation}
            authenticated={Boolean(session?.user)}
            userName={session?.user?.name ?? session?.user?.email ?? ""}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
