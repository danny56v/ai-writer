import GithubButton from "@/components/GithubButton";
import GoogleButton from "@/components/GoogleButton";
import Image from "next/image";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-4 py-16 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.25),transparent_55%),radial-gradient(circle_at_bottom,_rgba(244,114,182,0.25),transparent_50%)]" aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-xl sm:grid-cols-[0.9fr,1.1fr]">
        <div className="flex flex-col justify-between rounded-[2.2rem] bg-white/95 p-10 text-slate-900 shadow-soft-xl">
          <div className="max-w-sm">
            {children}
          </div>
          <div className="mt-10 space-y-6">
            <div className="relative text-center text-sm font-medium text-slate-500">
              <span className="bg-white px-4">Or continue with</span>
            </div>
            <div className="grid gap-4">
              <GoogleButton />
              <GithubButton />
            </div>
          </div>
        </div>
        <div className="relative hidden overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/5 p-12 text-left text-white shadow-inner shadow-black/30 sm:block">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-fuchsia-500/30 to-amber-400/30" aria-hidden="true" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                Aurora studio
              </span>
              <h2 className="mt-6 text-3xl font-semibold text-white">Design meets intelligence</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
                Build articles, marketing campaigns and property listings with an AI assistant that understands typography, layout
                and storytelling.
              </p>
            </div>
            <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/20">
              <Image
                alt="Workspace"
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
                fill
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default layout;
