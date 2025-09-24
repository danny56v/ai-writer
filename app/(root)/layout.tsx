import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-12 sm:px-6 lg:px-12">
      <div className="pointer-events-none absolute inset-x-6 top-4 -z-10 h-[24rem] rounded-[4rem] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),transparent_70%)] blur-2xl" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 flex justify-center">
        <div className="h-[420px] w-full max-w-6xl rounded-[4rem] bg-gradient-to-r from-[#f4e6ff]/65 via-[#ffe6f6]/60 to-[#e8f1ff]/70 blur-3xl" aria-hidden="true" />
      </div>
      <div className="pointer-events-none absolute left-[-12%] top-1/3 -z-10 h-72 w-72 rounded-full bg-gradient-to-br from-[#9278ff]/45 via-[#ff8adf]/35 to-transparent blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[-10%] bottom-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-br from-[#ffc67f]/40 via-[#ff7db8]/35 to-transparent blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(60%_45%_at_50%_10%,rgba(255,255,255,0.35),transparent_70%)]" aria-hidden="true" />
      <SessionProvider>
        <Navbar />
        <main className="flex-1 pt-12 sm:pt-16 lg:pt-20">{children}</main>
      </SessionProvider>
    </div>
  );
};

export default layout;
