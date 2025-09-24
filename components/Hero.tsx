import Link from "next/link";
import React from "react";

const metrics = [
  { label: "Teams onboarded", value: "1,200+" },
  { label: "Avg. time saved", value: "9h / week" },
  { label: "Brand alignment", value: "98%" },
];

const highlights = [
  {
    title: "Strategy + execution",
    description: "Assign goals, guardrails and reviewers while Aurora keeps every scene moving toward the launch date.",
  },
  {
    title: "Layouts that breathe",
    description: "Weave typography, motion cues and CTAs that mirror your product design system without any manual tweaks.",
  },
  {
    title: "Ops ready",
    description: "Integrate with your CRM, task flows and analytics so creative and growth stay in the same orbit.",
  },
];

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden rounded-[3.5rem] border border-white/60 bg-gradient-to-br from-[#ffffff]/95 via-[#f9f4ff]/95 to-[#fff2fd]/95 px-6 py-16 shadow-soft-xl sm:px-12 lg:px-16">
      <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#b49bff]/45 via-[#ff7bd5]/40 to-transparent blur-3xl" aria-hidden="true" />
      <div className="absolute -right-24 bottom-16 h-80 w-80 rounded-full bg-gradient-to-br from-[#ffd38a]/45 via-[#ff90d2]/35 to-transparent blur-3xl" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_-10%,rgba(255,255,255,0.85),transparent_70%)]" aria-hidden="true" />

      <div className="relative grid gap-16 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)] lg:items-center">
        <div className="space-y-10">
          <span className="glow-pill">Workspace OS</span>
          <div className="space-y-6">
            <h1 className="text-balance text-4xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-5xl lg:text-6xl">
              Design, plan and launch content in a flow that feels like ClickUp
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Bring briefs, AI creation, reviews and publishing together. Aurora orchestrates every ritual with cinematic polish so your team can focus on impact.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/article-writer"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#6b4dff] via-[#ff47c5] to-[#ffb347] px-6 py-3 text-base font-semibold text-white shadow-[0_22px_40px_-20px_rgba(110,71,255,0.8)] transition hover:opacity-95"
            >
              Start writing now
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-[#d9cfff] bg-white/80 px-6 py-3 text-base font-semibold text-slate-700 shadow-[inset_0_1px_10px_rgba(255,255,255,0.8)] transition hover:border-[#c2afff] hover:text-[color:var(--foreground)]"
            >
              Explore plans
            </Link>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-[inset_0_1px_12px_rgba(255,255,255,0.75)] backdrop-blur">
            <form method="POST" action="/api/subscribe" className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <label htmlFor="hero-email" className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                Join the product pulse
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="hero-email"
                  name="email"
                  type="email"
                  required
                  placeholder="Work email"
                  className="h-12 flex-1 rounded-full border border-transparent bg-white/60 px-4 text-sm font-medium text-slate-700 shadow-[inset_0_1px_6px_rgba(255,255,255,0.65)] placeholder:text-slate-400 focus:border-[#c2afff] focus:outline-none focus:ring-4 focus:ring-[#cabaff]/40"
                />
                <button
                  type="submit"
                  className="h-12 rounded-full bg-[color:var(--foreground)] px-6 text-sm font-semibold text-white shadow-[0_18px_36px_-20px_rgba(21,1,74,0.7)] transition hover:bg-[#1f0666]"
                >
                  Join waitlist
                </button>
              </div>
            </form>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/70 bg-white/90 px-5 py-4 text-left text-sm text-slate-600 shadow-[inset_0_1px_10px_rgba(255,255,255,0.8)]"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-12 left-8 hidden h-24 w-24 rounded-full bg-gradient-to-br from-[#6b4dff]/60 via-[#ff47c5]/55 to-transparent blur-2xl lg:block" aria-hidden="true" />
          <div className="absolute -bottom-16 right-4 hidden h-32 w-32 rounded-full bg-gradient-to-br from-[#ffb347]/50 via-[#ff6ec7]/40 to-transparent blur-3xl lg:block" aria-hidden="true" />
          <div className="relative mx-auto max-w-xl rounded-[2.75rem] border border-white/70 bg-white/90 p-6 shadow-soft-xl backdrop-blur">
            <div className="relative overflow-hidden rounded-3xl border border-[#e4dcff] bg-white/95 p-6 shadow-[0_25px_60px_-40px_rgba(21,1,74,0.45)]">
              <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                <span className="rounded-full bg-[#f3ecff] px-4 py-1 text-slate-600">Campaign HQ</span>
                <span className="text-slate-300">Live scene</span>
              </div>
              <div className="mt-6 space-y-5">
                <div className="rounded-2xl border border-[#eadfff] bg-[#f8f5ff] p-4">
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">Launch narrative</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Aurora drafts hero copy, feature highlights and CTA prompts using your brand tone and design tokens.
                  </p>
                </div>
                <div className="grid gap-4 rounded-2xl border border-[#ffe3f7] bg-[#fff4fb] p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#ff47c5]">Today</p>
                    <p className="mt-2 text-sm font-medium text-[color:var(--foreground)]">Design review with Maya</p>
                    <p className="mt-1 text-xs text-slate-500">Assets synced · Comments resolved</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#6b4dff]">Ready to publish</span>
                    <span className="text-xs font-semibold text-slate-400">7 tasks done</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                <span className="rounded-full bg-gradient-to-r from-[#6b4dff] via-[#ff47c5] to-[#ffb347] px-3 py-1 text-white">AI co-pilot active</span>
                <span className="rounded-full bg-[#f5f0ff] px-3 py-1">Auto tasks</span>
                <span className="rounded-full bg-[#fff2fa] px-3 py-1">Voice guardrails</span>
              </div>
            </div>
            <div className="relative mt-6 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/70 bg-white/90 p-5 text-left shadow-[inset_0_1px_10px_rgba(255,255,255,0.7)]"
                >
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">{item.title}</p>
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
