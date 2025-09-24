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
    <nav className="relative mt-6 w-full sm:mt-10">
      <div className="pointer-events-none absolute inset-x-6 top-4 z-[-1] h-16 rounded-full bg-gradient-to-r from-[#f5e5ff]/80 via-[#ffe6f5]/80 to-[#e6f3ff]/80 blur-xl" />
      <div className="aurora-card relative flex items-center justify-between gap-4 overflow-hidden rounded-full px-5 py-3 sm:px-8">
        <div className="flex items-center gap-5">
          <Link href="/" className="relative flex items-center gap-4">
            <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#6b4dff] via-[#ff47c5] to-[#ffb64d] text-base font-semibold text-white shadow-[0_16px_30px_-18px_rgba(107,77,255,0.75)]">
              AI
              <span className="absolute -inset-[3px] rounded-full bg-gradient-to-r from-white/70 via-white/20 to-transparent" aria-hidden="true" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold uppercase tracking-[0.38em] text-slate-500">Aurora</span>
              <span className="text-lg font-semibold text-[color:var(--foreground)]">AI Studio</span>
            </div>
          </Link>
          <div className="hidden h-9 w-px bg-gradient-to-b from-transparent via-[#d4c9ff] to-transparent sm:block" aria-hidden="true" />
          <div className="hidden flex-col text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-slate-400 sm:flex">
            <span className="text-slate-500">Inspired by</span>
            <span>ClickUp&apos;s flow</span>
          </div>
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group relative text-sm font-semibold text-slate-600 transition hover:text-[color:var(--foreground)]"
            >
              <span>{item.name}</span>
              <span className="absolute inset-x-0 -bottom-2 h-[3px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-[#6b4dff] via-[#ff47c5] to-[#ffb347] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </div>

        {session && session.user ? (
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/profile"
              className="group flex items-center gap-3 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-inner shadow-white/60 transition hover:border-[#cabaff] hover:text-[color:var(--foreground)]"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#6b4dff] via-[#ff47c5] to-[#ffb347] text-sm font-semibold text-white shadow-[0_14px_26px_-18px_rgba(107,77,255,0.65)]">
                {session.user.name?.charAt(0).toUpperCase() || "A"}
              </span>
              <span className="max-w-[9rem] truncate text-left leading-tight">
                {session.user.name ?? session.user.email}
              </span>
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full bg-[color:var(--foreground)] px-5 py-2 text-sm font-semibold text-white shadow-[0_16px_32px_-20px_rgba(21,1,74,0.65)] transition hover:bg-[#1f0666]"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/sign-in" className="text-sm font-semibold text-slate-600 transition hover:text-[color:var(--foreground)]">
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-gradient-to-r from-[#6b4dff] via-[#ff47c5] to-[#ffb347] px-5 py-2 text-sm font-semibold text-white shadow-[0_18px_34px_-18px_rgba(107,77,255,0.75)] transition hover:opacity-95"
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
