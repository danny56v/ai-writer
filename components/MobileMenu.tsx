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
        className="inline-flex items-center justify-center rounded-full bg-white/80 p-2 text-slate-600 shadow-[inset_0_1px_6px_rgba(255,255,255,0.8)] transition hover:text-[color:var(--foreground)]"
      >
        <span className="sr-only">Open main menu</span>
        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
      </button>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm" aria-hidden="true" />
        <DialogPanel className="gradient-border fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto rounded-l-3xl bg-white/95 p-6 shadow-[0_30px_60px_-35px_rgba(32,5,94,0.4)]">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6b4dff] via-[#ff47c5] to-[#ffb347] text-base font-semibold text-white">
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
              className="inline-flex items-center justify-center rounded-full bg-white/75 p-2 text-slate-600 shadow-[inset_0_1px_6px_rgba(255,255,255,0.7)]"
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
                  className="block rounded-2xl bg-white/75 px-4 py-3 text-base font-semibold text-slate-700 shadow-[inset_0_1px_8px_rgba(255,255,255,0.65)] transition hover:text-[color:var(--foreground)]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-[#17044f] via-[#2b0a74] to-[#17044f] p-6 text-white shadow-[0_24px_48px_-28px_rgba(15,4,54,0.75)]">
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
                      className="block rounded-full bg-white/15 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/25"
                    >
                      View profile
                    </Link>
                    <form action={signOutAction}>
                      <button
                        type="submit"
                        className="w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] shadow-[0_16px_32px_-22px_rgba(15,4,54,0.85)] transition hover:bg-[#f1e9ff]"
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
                      className="block rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-[color:var(--foreground)] shadow-[0_16px_32px_-22px_rgba(15,4,54,0.85)] transition hover:bg-[#f1e9ff]"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-full bg-gradient-to-r from-[#6b4dff] via-[#ff47c5] to-[#ffb347] px-4 py-2 text-center text-sm font-semibold text-white shadow-[0_18px_36px_-20px_rgba(112,64,255,0.85)] transition hover:opacity-95"
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
