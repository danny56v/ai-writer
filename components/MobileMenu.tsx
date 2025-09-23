"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useState } from "react";
import { signOutAction } from "@/lib/actions/auth";

interface MobileMenuProps {
  navigation: {
    name: string;
    href: string;
  }[];
  authenticated?: boolean;
  userName?: string;
}

const MobileMenu = ({ navigation, authenticated = false, userName = "" }: MobileMenuProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileMenuOpen(true)}
        className="inline-flex items-center justify-center rounded-full bg-white/80 p-2 text-slate-600 shadow-inner shadow-white/60 transition hover:text-slate-900"
      >
        <span className="sr-only">Open main menu</span>
        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
      </button>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm" aria-hidden="true" />
        <DialogPanel className="gradient-border fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto rounded-l-3xl bg-white/95 p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-fuchsia-500 to-amber-400 text-base font-semibold text-white">
                AI
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Aurora</span>
                <span className="text-lg font-semibold text-slate-900">AI Studio</span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center rounded-full bg-white/70 p-2 text-slate-600 shadow-inner shadow-white/60"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-8 space-y-8">
            <div className="space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-2xl bg-white/70 px-4 py-3 text-base font-semibold text-slate-700 shadow-inner shadow-white/50 transition hover:bg-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl">
              <p className="text-sm font-medium">
                {authenticated ? (
                  <>
                    Signed in as <span className="font-semibold">{userName}</span>
                  </>
                ) : (
                  <>Elevate your content workflows with Aurora&apos;s smart assistants.</>
                )}
              </p>
              <div className="mt-5 space-y-3">
                {authenticated ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-full bg-white/10 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                      View profile
                    </Link>
                    <form action={signOutAction}>
                      <button
                        type="submit"
                        className="w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/20 transition hover:bg-slate-100"
                      >
                        Sign out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-slate-900 shadow-lg shadow-fuchsia-400/30 transition hover:bg-slate-100"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-400 px-4 py-2 text-center text-sm font-semibold text-white shadow-lg shadow-fuchsia-400/40 transition hover:opacity-95"
                    >
                      Start free trial
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default MobileMenu;
