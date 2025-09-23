import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-12 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-4 -z-10 flex justify-center">
        <div className="h-64 w-full max-w-5xl rounded-[3rem] bg-gradient-to-r from-purple-400/35 via-fuchsia-300/30 to-sky-300/30 blur-3xl" aria-hidden="true" />
      </div>
      <div className="pointer-events-none absolute left-[-8%] top-[35%] -z-10 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[-6%] bottom-24 -z-10 h-80 w-80 rounded-full bg-fuchsia-200/35 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.06),transparent_55%)]" aria-hidden="true" />
      <SessionProvider>
        <Navbar />
        <main className="flex-1 pt-10 sm:pt-14 lg:pt-16">{children}</main>
      </SessionProvider>
    </div>
  );
};

export default layout;
