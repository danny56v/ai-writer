import React from "react";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import { auth } from "@/auth";
import { signOutAction } from "@/lib/actions/auth";

const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Pricing", href: "/pricing" },
  { name: "Company", href: "#" },
];

const Navbar = async () => {
  const session = await auth();
  return (
    <nav
      aria-label="Global"
      className="
      sticky top-4 left-8 right-8 z-50
      bg-white/10 backdrop-blur-md
      border border-white/20
      rounded-4xl
      shadow-sm
      mb-4
    "
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              {/* Logo aici */}
            </Link>
          </div>

          {/* Meniu desktop */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
                {item.name}
              </Link>
            ))}
          </div>
          {session && session.user ? (
            <div className="hidden lg:flex items-center gap-5">
              <Link href="/profile" className="text-sm font-semibold leading-6 text-gray-900">
                {session?.user?.name}
              </Link>

              <form action={signOutAction}>
                <button type="submit">Sign Out</button>
              </form>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-5">
              <Link href="/sign-in" className="text-sm font-semibold leading-6 text-gray-900">
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Meniu mobil */}
          <div className="lg:hidden">
            <MobileMenu navigation={navigation} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
