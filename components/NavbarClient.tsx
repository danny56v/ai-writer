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
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/90 to-transparent" />
      <nav aria-label="Global" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200/70 bg-white/80 px-4 py-2.5 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.4)] transition supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:backdrop-blur-xl">
          <div className="flex items-center gap-3 lg:flex-1">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/favicon.png" alt="ListologyAi" width={36} height={36} className="h-9 w-9" />
              <span className="text-base font-semibold  ">ListologyAi</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-sm font-medium ">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    "group relative rounded-xl px-3 py-2 transition",
                    isActive ? " " : "hover:  hover:bg-neutral-100/80"
                  )}
                >
                  <span>{item.name}</span>
                  <span
                    className={classNames(
                      "absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-neutral-900 transition",
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center justify-end gap-3 text-sm font-medium   lg:flex-1">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="rounded-xl border border-neutral-200 bg-white px-3 py-2   shadow-sm transition hover:bg-neutral-50"
                >
                  {user.name ?? user.email ?? "Profile"}
                </Link>
                {planChecked && isFreePlan ? (
                  <Link
                    href="/pricing"
                    className="rounded-xl bg-neutral-900 px-4 py-2 text-white shadow-[0_20px_55px_-30px_rgba(15,23,42,0.9)] transition hover:bg-neutral-800"
                  >
                    Pro
                  </Link>
                ) : null}
              </>
            ) : isLoadingSession ? null : (
              <Link
                href="/sign-in"
                className="rounded-xl bg-neutral-900 px-4 py-2 text-white shadow-[0_20px_55px_-30px_rgba(15,23,42,0.9)] transition hover:bg-neutral-800"
              >
                Start free
              </Link>
            )}
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white/80 p-2.5   shadow-sm backdrop-blur transition hover:bg-white"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50 bg-black/20" aria-hidden />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto border-l border-neutral-100 bg-white/95 px-6 py-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.5)] backdrop-blur sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <Image src="/favicon.png" alt="ListologyAi" width={32} height={32} className="h-8 w-8" />
              <span className="text-sm font-semibold  ">ListologyAi</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5  hover:bg-neutral-100"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-neutral-200">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7   hover:bg-neutral-100"
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
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7   hover:bg-neutral-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {planChecked && isFreePlan ? (
                      <Link
                        href="/pricing"
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-neutral-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Pro
                      </Link>
                    ) : null}
                  </>
                ) : isLoadingSession ? null : (
                  <Link
                    href="/sign-in"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7  hover:bg-neutral-50"
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
