"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Real Estate", href: "/real-estate-generator" },
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type NavbarClientProps = {
  initialSession: Session | null;
  initialPlanType?: string | null;
};

export default function NavbarClient({ initialSession, initialPlanType }: NavbarClientProps) {
  const { data: liveSession, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [planType, setPlanType] = useState<string | null>(initialPlanType ?? null);
  const [planChecked, setPlanChecked] = useState(initialPlanType !== undefined);
  const pathname = usePathname();

  const session = useMemo(() => liveSession ?? initialSession ?? null, [initialSession, liveSession]);
  const user = session?.user ?? null;

  useEffect(() => {
    if (initialPlanType !== undefined) {
      setPlanType(initialPlanType ?? null);
      setPlanChecked(true);
    }
  }, [initialPlanType]);

  useEffect(() => {
    if (!user) {
      setPlanType(null);
      setPlanChecked(false);
      return;
    }

    let cancelled = false;
    const shouldShowLoading = initialPlanType === undefined;

    if (shouldShowLoading) {
      setPlanChecked(false);
    }

    fetch("/api/account/plan")
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.error || "Failed to load plan");
        }
        return response.json();
      })
      .then((data: { planType?: string }) => {
        if (cancelled) return;
        setPlanType(data.planType ?? null);
        setPlanChecked(true);
      })
      .catch(() => {
        if (cancelled) return;
        setPlanType(null);
        if (shouldShowLoading) {
          setPlanChecked(true);
        }
      })
      .finally(() => {
        if (!cancelled && shouldShowLoading) {
          setPlanChecked(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user, initialPlanType]);

  const isFreePlan = (planType ?? "free") === "free";
  const isLoadingSession = status === "loading" && !session;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav aria-label="Global" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 rounded-full border border-white/40 bg-white/80 px-4 py-2.5 shadow-lg transition-colors supports-[backdrop-filter]:bg-white/40 supports-[backdrop-filter]:backdrop-blur-2xl">
          <div className="flex items-center gap-3 lg:flex-1">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/favicon.png" alt="ListologyAi" width={36} height={36} className="h-9 w-9" />
              <span className="text-base font-semibold text-gray-900">ListologyAi</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-gray-600">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    "group relative rounded-full px-3 py-2 transition",
                    isActive
                      ? "text-gray-900"
                      : "hover:text-gray-900 hover:bg-white/65"
                  )}
                >
                  <span>{item.name}</span>
                  <span
                    className={classNames(
                      "absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-indigo-500 transition",
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center justify-end gap-3 text-sm font-medium text-gray-700 lg:flex-1">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="rounded-full bg-white px-3 py-2 text-gray-900 shadow-md ring-1 ring-indigo-50 transition hover:bg-white/90 hover:ring-indigo-300"
                >
                  {user.name ?? user.email ?? "Profile"}
                </Link>
                {planChecked && isFreePlan ? (
                  <Link
                    href="/pricing"
                    className="rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 px-4 py-2 text-white shadow-lg transition hover:from-indigo-500 hover:via-purple-500 hover:to-blue-500"
                  >
                    Pro
                  </Link>
                ) : null}
              </>
            ) : isLoadingSession ? null : (
              <Link
                href="/sign-in"
                className="rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 px-4 py-2 text-white shadow-lg transition hover:from-indigo-500 hover:via-purple-500 hover:to-blue-500"
              >
                Start free
              </Link>
            )}
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/70 p-2.5 text-gray-700 shadow-sm backdrop-blur transition hover:bg-white"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <Image src="/favicon.png" alt="ListologyAi" width={32} height={32} className="h-8 w-8" />
              <span className="text-sm font-semibold text-gray-900">ListologyAi</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {planChecked && isFreePlan ? (
                      <Link
                        href="/pricing"
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-indigo-600 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Pro
                      </Link>
                    ) : null}
                  </>
                ) : isLoadingSession ? null : (
                  <Link
                    href="/sign-in"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-indigo-600 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Start free
                  </Link>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
