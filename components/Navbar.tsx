import React from "react";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Marketplace", href: "#" },
  { name: "Company", href: "#" },
];
const Navbar = async () => {
  // const session = await auth();
  return (
    <>
      <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
           
          </Link>
        </div>
       <MobileMenu navigation={navigation}/>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-5">
        <div className="flex flex-1 items-center justify-end gap-x-6">
          <Link href="/sign-in" className="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900">
            Log in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign up
          </Link>
        </div>

        </div>
      </nav>
      {/* <div className="flex justify-between items-center gap-5 p-2">
        <h1 className="text-2xl">Home</h1>
        {session?.user ? (
          <form action={signOutAction}>
            <button type="submit">Sign Out</button>
          </form>
        ) : (
          // <button formAction={signOutAction}>Sign Out</button>
          <form action={signInGoogle}>
            <button type="submit">Sign In</button>
          </form>
          // <button formAction={signInAction}>Sign In</button>
        )}
      </div> */}
    </>
  );
};

export default Navbar;
