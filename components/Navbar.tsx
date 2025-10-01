"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Real Estate", href: "/real-estate-generator" },
  { name: "Article Writer", href: "/article-writer" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
];

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [planType, setPlanType] = useState<string | null>(null);
  const [planChecked, setPlanChecked] = useState(false);
  const pathname = usePathname();
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);
  const MAX_OFFSET = 72;

  useEffect(() => {
    if (!session?.user) {
      setPlanType(null);
      setPlanChecked(false);
      return;
    }

    let cancelled = false;
    setPlanChecked(false);

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
      })
      .catch(() => {
        if (cancelled) return;
        setPlanType(null);
      })
      .finally(() => {
        if (!cancelled) setPlanChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, [session?.user]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollYRef.current;
      const delta = currentY - lastY;
      lastScrollYRef.current = currentY;

      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          setOffset((prev) => {
            if (currentY <= 16) {
              return 0;
            }
            const next = Math.min(Math.max(prev + delta, 0), MAX_OFFSET);
            return next;
          });
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isFreePlan = (planType ?? "free") === "free";

  return (
    <header
      className="sticky top-0 z-50 transition-transform duration-300"
      style={{
        transform: `translateY(${-offset}px)`,
        transition: "transform 0.08s ease-out",
      }}
    >
      <nav aria-label="Global" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 rounded-full border border-white/40 bg-white/80 px-4 py-2.5 shadow-lg transition-colors supports-[backdrop-filter]:bg-white/40 supports-[backdrop-filter]:backdrop-blur-2xl">
          <div className="flex items-center gap-3 lg:flex-1">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/Logo.png" alt="ScriptNest" width={36} height={36} className="h-9 w-9" />
              <span className="text-base font-semibold text-gray-900">ScriptNest</span>
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
            {session?.user ? (
              <>
                <Link
                  href="/profile"
                  className="rounded-full bg-white px-3 py-2 text-gray-900 shadow-sm ring-1 ring-white/60 transition hover:bg-white/90 hover:ring-indigo-200"
                >
                  {session.user.name ?? session.user.email ?? "Profile"}
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
            ) : (
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
              <Image src="/Logo.png" alt="ScriptNest" width={32} height={32} className="h-8 w-8" />
              <span className="text-sm font-semibold text-gray-900">ScriptNest</span>
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
                {session?.user ? (
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
                ) : (
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
