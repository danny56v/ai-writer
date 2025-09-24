import GithubButton from "@/components/GithubButton";
import GoogleButton from "@/components/GoogleButton";
import Image from "next/image";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fef6ff] via-[#f2f5ff] to-[#fff0fa] px-4 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(203,186,255,0.35),transparent_60%),radial-gradient(circle_at_bottom,_rgba(255,183,229,0.3),transparent_55%)]" aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-8 overflow-hidden rounded-[3rem] border border-white/60 bg-white/90 p-2 shadow-[0_45px_120px_-60px_rgba(32,5,94,0.25)] backdrop-blur-xl sm:grid-cols-[0.9fr,1.1fr]">
        <div className="flex flex-col justify-between rounded-[2.2rem] border border-white/70 bg-white/90 p-10 text-[color:var(--foreground)] shadow-[0_35px_70px_-40px_rgba(34,7,94,0.2)]">
          <div className="max-w-sm space-y-8">
            {children}
            <div className="space-y-4">
              <div className="relative text-center text-sm font-medium text-slate-500">
                <span className="rounded-full bg-white px-4 py-1 shadow-[inset_0_1px_6px_rgba(255,255,255,0.8)]">Or continue with</span>
              </div>
              <div className="grid gap-4">
                <GoogleButton />
                <GithubButton />
              </div>
            </div>
          </div>
          <p className="mt-10 text-xs text-slate-400">Secured by passwordless magic links &amp; OAuth.</p>
        </div>
        <div className="relative hidden overflow-hidden rounded-[2.2rem] border border-white/60 bg-gradient-to-br from-[#f4ecff]/70 via-[#ffe9f7]/60 to-[#f4f9ff]/60 p-12 text-left text-[color:var(--foreground)] shadow-[inset_0_1px_24px_rgba(255,255,255,0.65)] sm:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(203,186,255,0.3),transparent_60%)]" aria-hidden="true" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Aurora studio
              </span>
              <h2 className="mt-6 text-3xl font-semibold text-[color:var(--foreground)]">Design meets intelligence</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
                Build articles, marketing campaigns and property listings with an AI assistant that understands typography, layout and storytelling.
              </p>
            </div>
            <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/70 shadow-[0_30px_70px_-45px_rgba(34,7,94,0.25)]">
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
