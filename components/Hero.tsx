import Image from "next/image";
import Link from "next/link";
import React from "react";

const metrics = [
  { label: "Writers empowered", value: "25k+" },
  { label: "Avg. time saved", value: "8h / week" },
  { label: "Quality rating", value: "4.9 / 5" },
];

const highlights = [
  {
    title: "Design-grade visuals",
    description: "Aurora understands layout, balance and hierarchy so every output is ready for the spotlight.",
  },
  {
    title: "Brand-safe intelligence",
    description: "Teach Aurora your voice, guidelines and motion system to ship copy that feels unmistakably yours.",
  },
  {
    title: "Collaborative canvas",
    description: "Invite teammates, comment in-line and iterate together in a cinematic workspace.",
  },
];

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden rounded-[3rem] border border-white/70 bg-white/80 px-6 py-16 shadow-soft-xl backdrop-blur-xl sm:px-12 lg:px-16">
      <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-purple-200/60 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-16 bottom-20 h-80 w-80 rounded-full bg-fuchsia-200/50 blur-3xl" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),transparent_55%)]" aria-hidden="true" />

      <div className="relative grid gap-16 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)] lg:items-center">
        <div className="space-y-10">
          <div className="inline-flex max-w-max items-center gap-2 rounded-full border border-purple-200/70 bg-purple-50/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-purple-600 shadow-inner shadow-white/60">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            Crafted for design leaders
          </div>
          <div className="space-y-6">
            <h1 className="text-balance text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Compose magnetic stories with an AI studio that feels hand-crafted
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Aurora pairs premium aesthetics with orchestration tools so your team can ideate, design and publish editorial-grade copy in a single flow.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/article-writer"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-400 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-fuchsia-400/40 transition hover:opacity-95"
            >
              Start writing now
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-base font-semibold text-slate-700 shadow-inner shadow-white/60 transition hover:border-purple-200 hover:text-slate-900"
            >
              Explore plans
            </Link>
          </div>

          <form
            method="POST"
            action="/api/subscribe"
            className="mt-6 flex w-full flex-col gap-3 rounded-[2rem] border border-slate-200/80 bg-white/80 p-3 shadow-inner shadow-white/40 backdrop-blur-sm sm:flex-row"
          >
            <input
              id="hero-email"
              name="email"
              type="email"
              required
              placeholder="Work email to receive product updates"
              className="h-12 flex-1 rounded-[1.5rem] border border-transparent bg-white/0 px-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-200/60"
            />
            <button
              type="submit"
              className="h-12 rounded-[1.5rem] bg-slate-900 px-6 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
            >
              Join the waitlist
            </button>
          </form>

          <div className="grid gap-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/80 bg-white/80 px-5 py-4 text-left text-sm text-slate-600 shadow-inner shadow-white/50"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-12 left-10 hidden h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-400 opacity-50 blur-2xl lg:block" />
          <div className="absolute -bottom-14 right-6 hidden h-32 w-32 rounded-full bg-amber-300/40 blur-3xl lg:block" />
          <div className="relative mx-auto max-w-xl rounded-[2.5rem] border border-white/70 bg-white/80 p-6 shadow-soft-xl backdrop-blur-xl">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-900/90 p-6 text-white shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">Live preview</span>
                <span className="text-xs text-white/60">Aurora Article Builder</span>
              </div>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/80">
                <p className="rounded-2xl bg-white/5 p-4">
                  “Draft a 1,200 word launch story for our new workspace app. Keep the tone confident, celebrate collaboration and end with a waitlist CTA.”
                </p>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="font-semibold text-white">Aurora drafts</p>
                  <p className="mt-2 text-white/80">
                    Launch faster with a modular AI partner. Aurora analyses your brand voice, assembles structured outlines and designs beautifully formatted content ready to ship.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-amber-400 px-3 py-1 text-xs font-semibold text-white">
                  ✨ Design conscious AI
                </span>
                <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">Brand-safe outputs</span>
                <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">Real-time collaboration</span>
              </div>
            </div>
            <div className="relative mt-6 overflow-hidden rounded-3xl border border-slate-200/70 bg-white">
              <Image
                alt="Application preview"
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                width={1200}
                height={900}
                className="h-64 w-full object-cover"
              />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 text-left shadow-inner shadow-white/60"
                >
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
